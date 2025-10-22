import { useEffect, useRef, useState, useCallback } from 'react'
import { Pose } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'
import './App.css'

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [repCount, setRepCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTracking, setIsTracking] = useState(false)
  const [squatState, setSquatState] = useState('standing')
  const [currentKneeAngle, setCurrentKneeAngle] = useState(180)
  const [formWarning, setFormWarning] = useState('')
  const [bodyVisible, setBodyVisible] = useState(true)
  const [cameraAngle, setCameraAngle] = useState('')
  const [cameraError, setCameraError] = useState(null)

  const previousStateRef = useRef('standing')
  const landmarksRef = useRef(null)
  const repCooldownRef = useRef(false) // Prevent double counting

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const pose = new Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
          }
        })

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6
        })

        pose.onResults(onResults)

        if (videoRef.current) {
          // Request camera permissions explicitly
          try {
            await navigator.mediaDevices.getUserMedia({ video: true })
          } catch {
            throw new Error('Camera permission denied. Please allow camera access in your browser settings.')
          }

          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              await pose.send({ image: videoRef.current })
            },
            width: 640,
            height: 480
          })

          // Start camera and wait a bit to ensure it's ready
          await camera.start()

          // Give camera a moment to initialize
          setTimeout(() => {
            setIsLoading(false)
          }, 500)
        }
      } catch (error) {
        console.error('Camera initialization error:', error)
        setIsLoading(false)
        setCameraError(error.message || 'Failed to initialize camera. Please refresh the page and allow camera access.')
      }
    }

    initializeCamera()
  }, [onResults])

  function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
    let angle = Math.abs(radians * 180.0 / Math.PI)
    if (angle > 180.0) {
      angle = 360 - angle
    }
    return angle
  }

  function checkFullBodyVisible(landmarks) {
    // Only check the most critical points for squat tracking
    const criticalPoints = [23, 24, 25, 26, 27, 28] // hips, knees, ankles only
    
    let visibleCount = 0
    
    for (let idx of criticalPoints) {
      const point = landmarks[idx]
      if (!point) continue
      
      // More lenient frame bounds - allow points closer to edges
      const inFrameX = point.x > 0.02 && point.x < 0.98
      const inFrameY = point.y > 0.02 && point.y < 0.98
      
      // More lenient visibility threshold
      const isVisible = !point.visibility || point.visibility > 0.3
      
      if (inFrameX && inFrameY && isVisible) {
        visibleCount++
      }
    }
    
    // Need at least 5 out of 6 critical points visible (83%)
    return visibleCount >= 5
  }

  function detectCameraAngle(landmarks) {
    // Compare shoulder width vs hip width in pixels
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]
    const leftHip = landmarks[23]
    const rightHip = landmarks[24]
    
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x)
    const hipWidth = Math.abs(leftHip.x - rightHip.x)
    
    // If shoulders/hips are wide apart, it's front view
    // If narrow, it's side view
    const avgWidth = (shoulderWidth + hipWidth) / 2
    
    if (avgWidth > 0.2) {
      return 'front' // Front or back view
    } else if (avgWidth < 0.1) {
      return 'side' // Side view (best!)
    } else {
      return 'angled' // 45° angle
    }
  }

  function analyzeSquatForm(landmarks) {
    const leftHip = landmarks[23]
    const leftKnee = landmarks[25]
    const leftAnkle = landmarks[27]
    const rightHip = landmarks[24]
    const rightKnee = landmarks[26]
    const rightAnkle = landmarks[28]

    // Calculate knee angles
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
    const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2

    // Calculate hip depth
    const avgHipY = (leftHip.y + rightHip.y) / 2
    const avgKneeY = (leftKnee.y + rightKnee.y) / 2
    const depth = avgKneeY - avgHipY

    return {
      kneeAngle: avgKneeAngle,
      depth: depth,
      leftKneeAngle,
      rightKneeAngle
    }
  }

  const onResults = useCallback((results) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

    if (results.poseLandmarks) {
      setIsTracking(true)
      landmarksRef.current = results.poseLandmarks

      // Detect camera angle
      const angle = detectCameraAngle(results.poseLandmarks)
      setCameraAngle(angle)

      // Check if full body is visible
      const fullBodyVisible = checkFullBodyVisible(results.poseLandmarks)
      setBodyVisible(fullBodyVisible)

      if (fullBodyVisible) {
        // Analyze form
        const formData = analyzeSquatForm(results.poseLandmarks)
        setCurrentKneeAngle(Math.round(formData.kneeAngle))

        // IMPROVED REP COUNTING LOGIC
        // Standing: knee angle > 150°
        // Squatting: knee angle < 110°
        // Hysteresis to prevent bouncing

        let newSquatState = previousStateRef.current // Use ref for immediate access

        if (previousStateRef.current === 'standing' && formData.kneeAngle < 110) {
          // Transition to squatting
          newSquatState = 'squatting'
          repCooldownRef.current = false // Ready to count when standing again
        } else if (previousStateRef.current === 'squatting' && formData.kneeAngle > 150) {
          // Transition to standing - COUNT REP
          newSquatState = 'standing'

          // Only count if not in cooldown (prevents double counting)
          if (!repCooldownRef.current) {
            setRepCount(prev => prev + 1)
            repCooldownRef.current = true

            // Check if form was questionable
            if (formData.depth < 0.05) {
              setFormWarning('⚠️ Depth too shallow - need deeper squat')
            } else if (Math.abs(formData.leftKneeAngle - formData.rightKneeAngle) > 15) {
              setFormWarning('⚠️ Uneven form - one leg different than other')
            } else {
              setFormWarning('')
            }

            // Clear cooldown after 500ms
            setTimeout(() => {
              repCooldownRef.current = false
            }, 500)
          }
        }

        previousStateRef.current = newSquatState
        setSquatState(newSquatState)

        drawSkeleton(ctx, results.poseLandmarks, formData, fullBodyVisible, newSquatState)
      } else {
        // Body not fully visible - draw warning
        drawSkeleton(ctx, results.poseLandmarks, null, fullBodyVisible, previousStateRef.current)
      }
    } else {
      setIsTracking(false)
      setBodyVisible(false)
    }

    ctx.restore()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function drawSkeleton(ctx, landmarks, formData, fullBodyVisible, currentSquatState) {
    const connections = [
      [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
      [11, 23], [12, 24], [23, 24],
      [23, 25], [25, 27], [27, 29], [29, 31],
      [24, 26], [26, 28], [28, 30], [30, 32]
    ]

    // Color based on body visibility and squat state
    let lineColor = '#00ff88' // Default green
    if (!fullBodyVisible) {
      lineColor = '#ff4444' // Red if body not fully visible
    } else if (currentSquatState === 'squatting') {
      lineColor = '#ffaa00' // Orange when squatting
    }

    // Draw connections
    connections.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        
        ctx.beginPath()
        ctx.moveTo(landmarks[start].x * 640, landmarks[start].y * 480)
        ctx.lineTo(landmarks[end].x * 640, landmarks[end].y * 480)
        ctx.stroke()
      }
    })

    // Draw joints
    landmarks.forEach((landmark, idx) => {
      if (landmark) {
        const x = landmark.x * 640
        const y = landmark.y * 480
        
        const isKeyJoint = [23, 24, 25, 26].includes(idx)
        
        if (isKeyJoint) {
          ctx.fillStyle = fullBodyVisible ? 'rgba(255, 170, 0, 0.3)' : 'rgba(255, 68, 68, 0.3)'
          ctx.beginPath()
          ctx.arc(x, y, 14, 0, 2 * Math.PI)
          ctx.fill()
        }
        
        ctx.fillStyle = isKeyJoint ? (fullBodyVisible ? '#ffaa00' : '#ff4444') : lineColor
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    // Display info on canvas
    if (formData && fullBodyVisible) {
      ctx.fillStyle = 'white'
      ctx.font = 'bold 24px sans-serif'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 3
      
      const text = `Knee Angle: ${Math.round(formData.kneeAngle)}°`
      ctx.strokeText(text, 20, 40)
      ctx.fillText(text, 20, 40)
      
      // Show thresholds
      ctx.font = '16px sans-serif'
      const thresholdText = `Stand: >150° | Squat: <110°`
      ctx.strokeText(thresholdText, 20, 70)
      ctx.fillText(thresholdText, 20, 70)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{
          color: 'white',
          fontSize: '3em',
          fontWeight: '800',
          margin: '0',
          background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          FormCheck AI
        </h1>
        <p style={{
          color: '#8892b0',
          fontSize: '1.1em',
          marginTop: '10px'
        }}>
          Hybrid AI Form Tracker • Skeleton + Vision
        </p>
      </div>

      <div style={{
        maxWidth: '640px',
        margin: '0 auto 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px'
      }}>
        {/* Rep Count */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#8892b0', fontSize: '0.9em', marginBottom: '5px' }}>
            Reps
          </div>
          <div style={{
            color: '#00ff88',
            fontSize: '2.5em',
            fontWeight: 'bold',
            lineHeight: '1'
          }}>
            {repCount}
          </div>
        </div>

        {/* Knee Angle */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#8892b0', fontSize: '0.9em', marginBottom: '5px' }}>
            Knee Angle
          </div>
          <div style={{
            color: squatState === 'squatting' ? '#ffaa00' : '#00ff88',
            fontSize: '2em',
            fontWeight: 'bold',
            lineHeight: '1'
          }}>
            {currentKneeAngle}°
          </div>
        </div>

        {/* Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#8892b0', fontSize: '0.9em', marginBottom: '5px' }}>
            Status
          </div>
          <div style={{
            color: isTracking ? (bodyVisible ? '#00ff88' : '#ffaa00') : '#ff4444',
            fontSize: '0.9em',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {!isTracking ? 'NO BODY' : !bodyVisible ? 'MOVE BACK' : squatState}
          </div>
        </div>
      </div>

      {/* Warning for body not visible */}
      {isTracking && !bodyVisible && (
        <div style={{
          maxWidth: '640px',
          margin: '0 auto 20px',
          background: 'rgba(255, 170, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #ffaa00',
          borderRadius: '12px',
          padding: '15px 25px',
          color: '#ffaa00',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          ⚠️ Full body must be visible for accurate tracking
          <div style={{ fontSize: '0.9em', marginTop: '5px', opacity: 0.8 }}>
            Step back or adjust camera angle
          </div>
        </div>
      )}

      {/* Form Warning */}
      {formWarning && bodyVisible && (
        <div style={{
          maxWidth: '640px',
          margin: '0 auto 20px',
          background: 'rgba(255, 170, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #ffaa00',
          borderRadius: '12px',
          padding: '15px 25px',
          color: '#ffaa00',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {formWarning}
          <div style={{ fontSize: '0.9em', marginTop: '5px', opacity: 0.8 }}>
            Claude Vision will analyze next rep
          </div>
        </div>
      )}

      {/* Camera Angle Warning */}
      {cameraAngle === 'front' && (
        <div style={{
          maxWidth: '640px',
          margin: '0 auto 20px',
          background: 'rgba(255, 170, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #ffaa00',
          borderRadius: '12px',
          padding: '15px 25px',
          color: '#ffaa00',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          📷 FRONT VIEW DETECTED - Please use SIDE VIEW for best accuracy
          <div style={{ fontSize: '0.9em', marginTop: '5px', opacity: 0.8 }}>
            Position camera perpendicular to your body (90° angle)
          </div>
        </div>
      )}

      {cameraAngle === 'side' && (
        <div style={{
          maxWidth: '640px',
          margin: '0 auto 20px',
          background: 'rgba(0, 255, 136, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #00ff88',
          borderRadius: '12px',
          padding: '15px 25px',
          color: '#00ff88',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          ✅ SIDE VIEW - Perfect camera angle!
        </div>
      )}

      {/* Camera Error Message */}
      {cameraError && (
        <div style={{
          maxWidth: '640px',
          margin: '0 auto 20px',
          background: 'rgba(255, 68, 68, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #ff4444',
          borderRadius: '12px',
          padding: '20px 30px',
          color: '#ff4444',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2em', marginBottom: '10px' }}>
            🚫 Camera Error
          </div>
          <div style={{ fontSize: '0.95em', lineHeight: '1.6' }}>
            {cameraError}
          </div>
          <div style={{ fontSize: '0.85em', marginTop: '12px', opacity: 0.9, fontWeight: 'normal' }}>
            Common fixes:
            <ul style={{ textAlign: 'left', marginTop: '8px', paddingLeft: '20px' }}>
              <li>Allow camera access when prompted by your browser</li>
              <li>Check if another application is using your camera</li>
              <li>Make sure you're using HTTPS or localhost</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.2em',
            zIndex: 10,
            textAlign: 'center'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(0, 255, 136, 0.3)',
              borderTop: '4px solid #00ff88',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }} />
            Loading Pose Detection...
          </div>
        )}
        
        <video ref={videoRef} style={{ display: 'none' }} />
        
        <canvas 
          ref={canvasRef} 
          width="640" 
          height="480"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '16px',
            border: `3px solid ${!bodyVisible ? '#ff4444' : squatState === 'squatting' ? '#ffaa00' : 'rgba(0, 255, 136, 0.5)'}`,
            boxShadow: `0 8px 32px ${!bodyVisible ? 'rgba(255, 68, 68, 0.3)' : squatState === 'squatting' ? 'rgba(255, 170, 0, 0.3)' : 'rgba(0, 255, 136, 0.2)'}`,
            background: '#000',
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      <div style={{
        maxWidth: '640px',
        margin: '30px auto 0',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px 30px'
      }}>
        <h3 style={{ color: 'white', marginTop: 0, marginBottom: '15px' }}>
          💡 How It Works
        </h3>
        <ul style={{
          color: '#8892b0',
          lineHeight: '1.8',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li><strong style={{color: '#00ff88'}}>Green skeleton:</strong> Standing position, ready to squat</li>
          <li><strong style={{color: '#ffaa00'}}>Orange skeleton:</strong> In squat position (knee angle &lt; 110°)</li>
          <li><strong style={{color: '#ff4444'}}>Red skeleton:</strong> Full body not visible, move back!</li>
          <li>Rep counts when you go from squat → stand (knee angle &gt; 150°)</li>
          <li>Claude Vision analyzes form when issues are detected</li>
        </ul>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default App