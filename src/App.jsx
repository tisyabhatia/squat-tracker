import { useEffect, useRef, useState } from 'react'
import { Pose } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'
import './App.css'

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [repCount, setRepCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTracking, setIsTracking] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [squatState, setSquatState] = useState('standing')
  const [currentKneeAngle, setCurrentKneeAngle] = useState(180)
  const [formWarning, setFormWarning] = useState('')
  const [bodyVisible, setBodyVisible] = useState(true)
  const [cameraAngle, setCameraAngle] = useState('')

  // Session tracking state
  const [workoutActive, setWorkoutActive] = useState(false)
  const [workoutStartTime, setWorkoutStartTime] = useState(null)
  const [workoutDuration, setWorkoutDuration] = useState(0)
  const [sessionWarningsCount, setSessionWarningsCount] = useState(0)
  const [showSummary, setShowSummary] = useState(false)
  const [sessionSummary, setSessionSummary] = useState(null)
  
  const previousStateRef = useRef('standing')
  const landmarksRef = useRef(null)
  const repCooldownRef = useRef(false) // Prevent double counting
  const squatTroughRef = useRef({ minAngle: 180, maxDepth: 0 }) // Track troughs while squatting
  const currentFormRef = useRef(null)
  const smoothedAngleRef = useRef(180) // Smoothed knee angle for filtering jitter
  const angleHistoryRef = useRef([]) // Store recent angles for better smoothing
  // Configurable thresholds
  const CONFIG = {
    squatAngleEnter: 110, // angle to consider 'in squat'
    squatAngleExit: 150, // angle to consider 'standing' (rep counted on exit)
    minDepthForRep: 0.04, // minimum depth (in normalized Y space) to consider a valid rep
    maxKneeAngleDiff: 15, // max permitted left/right knee angle difference
    smoothingWindow: 5,
    smoothingAlpha: 0.3
  }
  const cameraRef = useRef(null)
  const loadingTimeoutRef = useRef(null)

  // Timer effect for workout duration
  useEffect(() => {
    let interval
    if (workoutActive && workoutStartTime) {
      interval = setInterval(() => {
        const duration = Math.floor((Date.now() - workoutStartTime) / 1000)
        setWorkoutDuration(duration)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [workoutActive, workoutStartTime])

  // Start workout handler
  const startWorkout = () => {
    setWorkoutActive(true)
    setWorkoutStartTime(Date.now())
    setRepCount(0)
    setSessionWarningsCount(0)
    setWorkoutDuration(0)
    setShowSummary(false)
    setFormWarning('')
    console.log('[Workout] Started at', new Date().toLocaleTimeString())
  }

  // End workout handler
  const endWorkout = () => {
    setWorkoutActive(false)
    const finalDuration = workoutDuration

    // Create session summary
    const summary = {
      totalReps: repCount,
      duration: finalDuration,
      warnings: sessionWarningsCount,
      endTime: new Date().toLocaleTimeString()
    }

    setSessionSummary(summary)
    setShowSummary(true)

    console.log('[Workout] Ended', summary)
  }

  // Close summary and reset
  const closeSummary = () => {
    setShowSummary(false)
    setSessionSummary(null)
  }

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      }
    })

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.6, // Increased from 0.5
      minTrackingConfidence: 0.6    // Increased from 0.5
    })

    pose.onResults(onResults)

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current })
        },
        width: 640,
        height: 480
      })
      // Keep reference so we can restart/stop the camera if needed
      cameraRef.current = camera
      camera.start()
      // Set a timeout in case the camera takes too long to start
      loadingTimeoutRef.current = setTimeout(() => {
        setCameraError('Camera taking too long to start. Check permissions or try retrying.')
        setIsLoading(false)
      }, 6000)
    }

    return () => {
      // Cleanup camera and loading timeout
      try {
        if (cameraRef.current && cameraRef.current.stop) cameraRef.current.stop()
      } catch (e) {
        console.warn('[Camera Cleanup] error stopping camera', e)
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }, [])

  function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
    let angle = Math.abs(radians * 180.0 / Math.PI)
    if (angle > 180.0) {
      angle = 360 - angle
    }
    return angle
  }

  function smoothAngle(rawAngle) {
    // Add to history (keep last 5 frames for moving average)
    angleHistoryRef.current.push(rawAngle)
    if (angleHistoryRef.current.length > CONFIG.smoothingWindow) {
      angleHistoryRef.current.shift()
    }

    // Calculate weighted moving average (more weight on recent values)
  // Build weights dynamically from window size (older frames lower weight)
  const baseWeights = [0.1, 0.15, 0.2, 0.25, 0.3]
  const weights = baseWeights.slice(-CONFIG.smoothingWindow)
    let smoothedAngle = 0
    let totalWeight = 0

    for (let i = 0; i < angleHistoryRef.current.length; i++) {
      const weight = weights[weights.length - angleHistoryRef.current.length + i] || 0.2
      smoothedAngle += angleHistoryRef.current[i] * weight
      totalWeight += weight
    }

    smoothedAngle = smoothedAngle / totalWeight

    // Also apply exponential moving average for additional smoothing
  const alpha = CONFIG.smoothingAlpha // Smoothing factor
  smoothedAngleRef.current = alpha * smoothedAngle + (1 - alpha) * smoothedAngleRef.current

    console.log('[Angle Smoothing]', {
      raw: rawAngle.toFixed(2),
      movingAvg: smoothedAngle.toFixed(2),
      exponentialSmoothed: smoothedAngleRef.current.toFixed(2),
      historySize: angleHistoryRef.current.length
    })

    return smoothedAngleRef.current
  }

  function checkFullBodyVisible(landmarks) {
    // Only check the most critical points for squat tracking
    // Require shoulders + lower body for better reliability
    const criticalPoints = [11, 12, 23, 24, 25, 26, 27, 28] // shoulders, hips, knees, ankles

    let visibleCount = 0
    const pointStatus = {}

    for (let idx of criticalPoints) {
      const point = landmarks[idx]
      if (!point) {
        pointStatus[idx] = 'missing'
        continue
      }

  // Frame bounds - require points slightly inside frame
  const inFrameX = point.x > 0.03 && point.x < 0.97
  const inFrameY = point.y > 0.03 && point.y < 0.97

  // Visibility threshold - require moderate confidence
  const isVisible = !point.visibility || point.visibility > 0.35

      if (inFrameX && inFrameY && isVisible) {
        visibleCount++
        pointStatus[idx] = 'visible'
      } else {
        pointStatus[idx] = `outOfFrame(x:${inFrameX},y:${inFrameY},vis:${isVisible})`
      }
    }

  // Need at least 6 out of 8 critical points visible (75%)
  const isFullBodyVisible = visibleCount >= 6

    console.log('[Body Visibility]', {
      visibleCount,
      total: criticalPoints.length,
      percentage: ((visibleCount / criticalPoints.length) * 100).toFixed(1) + '%',
      isFullBodyVisible,
      pointStatus
    })

    return isFullBodyVisible
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
    const rawAvgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2

    // Apply smoothing to reduce jitter
    const smoothedKneeAngle = smoothAngle(rawAvgKneeAngle)

    // Calculate hip depth
    const avgHipY = (leftHip.y + rightHip.y) / 2
    const avgKneeY = (leftKnee.y + rightKnee.y) / 2
    const depth = avgKneeY - avgHipY

    // Debug logging for angle and depth values
    // Per-frame debug logs - useful while tuning
    console.debug('[Form Analysis]', {
      leftKneeAngle: leftKneeAngle.toFixed(2),
      rightKneeAngle: rightKneeAngle.toFixed(2),
      rawAvgKneeAngle: rawAvgKneeAngle.toFixed(2),
      smoothedKneeAngle: smoothedKneeAngle.toFixed(2),
      depth: depth.toFixed(4),
      angleDifference: Math.abs(leftKneeAngle - rightKneeAngle).toFixed(2)
    })

    return {
      kneeAngle: smoothedKneeAngle, // Use smoothed angle for rep counting
      rawKneeAngle: rawAvgKneeAngle,
      depth: depth,
      leftKneeAngle,
      rightKneeAngle
    }
  }

  function onResults(results) {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)
    
    if (results.poseLandmarks) {
      // First successful result - camera and pose are working
      if (isLoading) {
        setIsLoading(false)
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
      if (cameraError) setCameraError('')
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

  let currentState = squatState // Keep previous state by default

  if (squatState === 'standing' && formData.kneeAngle < CONFIG.squatAngleEnter) {
          // Transition to squatting
          currentState = 'squatting'
          repCooldownRef.current = false // Ready to count when standing again
          // Reset trough tracking for this new squat
          squatTroughRef.current = { minAngle: formData.kneeAngle, maxDepth: formData.depth }
          console.log('[State Transition] Standing → Squatting', {
            kneeAngle: formData.kneeAngle.toFixed(2),
            threshold: CONFIG.squatAngleEnter
          })
        } else if (squatState === 'squatting' && formData.kneeAngle > 150) {
          // Transition to standing - COUNT REP
          currentState = 'standing'

          // Only count if not in cooldown (prevents double counting) and workout is active
          // In devMode we allow counting without starting a workout to aid testing
          if (!repCooldownRef.current && (workoutActive || devMode)) {
            // Check trough metrics to validate rep
            const trough = squatTroughRef.current || { minAngle: 180, maxDepth: 0 }
            // Save latest form/trough for debug overlay
            currentFormRef.current = { ...formData, trough }
            const reachedDepth = trough.maxDepth >= CONFIG.minDepthForRep
            const reachedAngle = trough.minAngle <= CONFIG.squatAngleEnter

            console.log('[Rep Validation]', {
              troughMinAngle: trough.minAngle.toFixed(2),
              troughMaxDepth: trough.maxDepth.toFixed(4),
              reachedDepth,
              reachedAngle
            })

            if (reachedDepth && reachedAngle) {
              setRepCount(prev => prev + 1)
            } else {
              console.log('[Rep Rejected] Did not reach depth/angle requirements')
            }
            repCooldownRef.current = true

            console.log('[REP]', {
              newRepCount: repCount + 1,
              kneeAngle: formData.kneeAngle.toFixed(2),
              depth: formData.depth.toFixed(4),
              leftKneeAngle: formData.leftKneeAngle.toFixed(2),
              rightKneeAngle: formData.rightKneeAngle.toFixed(2),
              trough: squatTroughRef.current
            })

            // Check if form was questionable using troughs for more reliable reading
            let hasWarning = false
            const troughForWarning = trough || (squatTroughRef.current || { minAngle: formData.kneeAngle, maxDepth: formData.depth })
            if (troughForWarning.maxDepth < CONFIG.minDepthForRep) {
              setFormWarning('⚠️ Depth too shallow - need deeper squat')
              console.warn('[Form Warning] Shallow depth detected:', troughForWarning.maxDepth.toFixed(4))
              hasWarning = true
            } else if (Math.abs(formData.leftKneeAngle - formData.rightKneeAngle) > CONFIG.maxKneeAngleDiff) {
              setFormWarning('⚠️ Uneven form - one leg different than other')
              console.warn('[Form Warning] Uneven form detected:', {
                leftKneeAngle: formData.leftKneeAngle.toFixed(2),
                rightKneeAngle: formData.rightKneeAngle.toFixed(2),
                difference: Math.abs(formData.leftKneeAngle - formData.rightKneeAngle).toFixed(2)
              })
              hasWarning = true
            } else {
              setFormWarning('')
              console.log('[Form Check] Good form!')
            }

            // Increment warnings counter if there was a warning
            if (hasWarning) {
              setSessionWarningsCount(prev => prev + 1)
            }

            // Clear cooldown after 500ms
            setTimeout(() => {
              repCooldownRef.current = false
            }, 500)
          } else if (!workoutActive) {
            console.log('[Rep Skipped] Workout not active')
          } else {
            console.log('[Rep Skipped] In cooldown period')
          }
        }

        setSquatState(currentState)
        previousStateRef.current = currentState
        
        // Update squat trough tracking while squatting
        if (currentState === 'squatting') {
          const t = squatTroughRef.current || { minAngle: 180, maxDepth: 0 }
          t.minAngle = Math.min(t.minAngle, formData.kneeAngle)
          t.maxDepth = Math.max(t.maxDepth, formData.depth)
          squatTroughRef.current = t
        }
        
        // store latest formData for overlay
        currentFormRef.current = formData

        drawSkeleton(ctx, results.poseLandmarks, formData, fullBodyVisible)
      } else {
        // Body not fully visible - draw warning
        drawSkeleton(ctx, results.poseLandmarks, null, fullBodyVisible)
      }
    } else {
      setIsTracking(false)
      setBodyVisible(false)
    }
    
    ctx.restore()
  }

  function restartCamera() {
    setCameraError('')
    setIsLoading(true)
    try {
      if (cameraRef.current) {
        if (cameraRef.current.stop) cameraRef.current.stop()
        if (cameraRef.current.start) cameraRef.current.start()
      }
    } catch (e) {
      console.warn('[Restart Camera] failed', e)
      setCameraError('Failed to restart camera. Please reload the page or check camera permissions.')
      setIsLoading(false)
    }
    // setup a fallback timeout again
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current)
    loadingTimeoutRef.current = setTimeout(() => {
      setCameraError('Camera taking too long to start. Check permissions or try retrying.')
      setIsLoading(false)
    }, 6000)
  }

  function drawSkeleton(ctx, landmarks, formData, fullBodyVisible) {
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
    } else if (squatState === 'squatting') {
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

      {/* Session Control Buttons */}
      <div style={{
        maxWidth: '640px',
        margin: '0 auto 20px',
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
      }}>
        {/* Dev Mode Toggle for testing without starting workout */}
        <div style={{ position: 'absolute', right: 24, top: 28 }}>
          <label style={{ color: '#8892b0', fontSize: '0.9em' }}>
            <input type="checkbox" checked={devMode} onChange={(e) => setDevMode(e.target.checked)} /> Dev Mode
          </label>
        </div>
        {!workoutActive ? (
          <button
            onClick={startWorkout}
            style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 40px',
              color: '#0f0f23',
              fontSize: '1.2em',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Start Workout
          </button>
        ) : (
          <button
            onClick={endWorkout}
            style={{
              background: 'linear-gradient(135deg, #ff4444 0%, #ff6b6b 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 40px',
              color: 'white',
              fontSize: '1.2em',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 68, 68, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            End Workout
          </button>
        )}
      </div>

      <div style={{
        maxWidth: '640px',
        margin: '0 auto 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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

        {/* Duration */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#8892b0', fontSize: '0.9em', marginBottom: '5px' }}>
            Duration
          </div>
          <div style={{
            color: workoutActive ? '#00ccff' : '#8892b0',
            fontSize: '1.5em',
            fontWeight: 'bold',
            lineHeight: '1'
          }}>
            {Math.floor(workoutDuration / 60)}:{(workoutDuration % 60).toString().padStart(2, '0')}
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
        {cameraError && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 11,
            background: 'rgba(255, 68, 68, 0.9)',
            color: 'white',
            padding: '10px 14px',
            borderRadius: '8px',
            fontWeight: '600'
          }}>
            {cameraError}
            <div style={{ marginTop: '8px' }}>
              <button onClick={restartCamera} style={{
                background: '#fff',
                color: '#0f0f23',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700'
              }}>Retry Camera</button>
            </div>
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

        {/* Debug overlay */}
        {devMode && (
          <div style={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            zIndex: 50,
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            padding: '10px 12px',
            borderRadius: 10,
            fontSize: '0.9em',
            minWidth: 220
          }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Debug Overlay</div>
            <div>Tracking: {isTracking ? 'yes' : 'no'}</div>
            <div>Body Visible: {bodyVisible ? 'yes' : 'no'}</div>
            <div>Squat State: {squatState}</div>
            <div>Reps: {repCount}</div>
            <div>Current Knee: {currentKneeAngle}°</div>
            <div>Form Warning: {formWarning || 'none'}</div>
            <div style={{ marginTop: 8, fontSize: '0.85em' }}>
              {currentFormRef.current ? (
                <>
                  <div>Frame knee: {currentFormRef.current.kneeAngle.toFixed(1)}°</div>
                  <div>Depth: {currentFormRef.current.depth.toFixed(4)}</div>
                  <div>Trough minAngle: {(currentFormRef.current.trough?.minAngle || 'n/a').toFixed ? currentFormRef.current.trough.minAngle.toFixed(1) + '°' : (currentFormRef.current.trough && currentFormRef.current.trough.minAngle) || 'n/a'}</div>
                  <div>Trough maxDepth: {(currentFormRef.current.trough?.maxDepth || 'n/a').toFixed ? currentFormRef.current.trough.maxDepth.toFixed(4) : (currentFormRef.current.trough && currentFormRef.current.trough.maxDepth) || 'n/a'}</div>
                </>
              ) : (
                <div>No frame data yet</div>
              )}
            </div>
          </div>
        )}
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

      {/* Session Summary Modal */}
      {showSummary && sessionSummary && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f23 100%)',
            border: '2px solid rgba(0, 255, 136, 0.3)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 255, 136, 0.2)'
          }}>
            <h2 style={{
              color: '#00ff88',
              fontSize: '2em',
              marginTop: 0,
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              Workout Complete!
            </h2>

            <div style={{
              display: 'grid',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#8892b0', fontSize: '1.1em' }}>Total Reps</span>
                <span style={{ color: '#00ff88', fontSize: '2em', fontWeight: 'bold' }}>
                  {sessionSummary.totalReps}
                </span>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#8892b0', fontSize: '1.1em' }}>Duration</span>
                <span style={{ color: '#00ccff', fontSize: '1.8em', fontWeight: 'bold' }}>
                  {Math.floor(sessionSummary.duration / 60)}:{(sessionSummary.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#8892b0', fontSize: '1.1em' }}>Form Warnings</span>
                <span style={{
                  color: sessionSummary.warnings > 0 ? '#ffaa00' : '#00ff88',
                  fontSize: '1.8em',
                  fontWeight: 'bold'
                }}>
                  {sessionSummary.warnings}
                </span>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#8892b0', fontSize: '0.9em', marginBottom: '5px' }}>
                  Form Quality
                </div>
                <div style={{
                  color: sessionSummary.totalReps === 0 ? '#8892b0' : (sessionSummary.warnings === 0 ? '#00ff88' : sessionSummary.warnings < sessionSummary.totalReps * 0.3 ? '#00ccff' : '#ffaa00'),
                  fontSize: '1.3em',
                  fontWeight: 'bold'
                }}>
                  {sessionSummary.totalReps === 0 ? 'No reps recorded' : (sessionSummary.warnings === 0 ? 'Perfect!' : sessionSummary.warnings < sessionSummary.totalReps * 0.3 ? 'Good' : 'Needs Work')}
                </div>
              </div>
            </div>

            <button
              onClick={closeSummary}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #00ff88 0%, #00ccff 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '15px',
                color: '#0f0f23',
                fontSize: '1.1em',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Close Summary
            </button>
          </div>
        </div>
      )}

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