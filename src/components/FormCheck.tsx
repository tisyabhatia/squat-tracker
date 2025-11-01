import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, Camera, CheckCircle2, AlertTriangle, Info, PlayCircle } from 'lucide-react';
import { Progress } from './ui/progress';

export function FormCheck() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        exercise: 'Squat',
        overallScore: 82,
        feedback: [
          {
            type: 'success',
            aspect: 'Depth',
            score: 95,
            message: 'Excellent depth! You are hitting proper parallel position.',
          },
          {
            type: 'warning',
            aspect: 'Knee Alignment',
            score: 75,
            message: 'Knees are tracking slightly inward. Try to push them out more.',
          },
          {
            type: 'success',
            aspect: 'Back Position',
            score: 88,
            message: 'Good neutral spine maintained throughout the movement.',
          },
          {
            type: 'warning',
            aspect: 'Bar Path',
            score: 70,
            message: 'Bar is drifting forward slightly. Keep weight over midfoot.',
          },
        ],
        suggestions: [
          'Focus on pushing knees out to align with toes',
          'Engage your core more to prevent bar drift',
          'Consider mobility work for better ankle dorsiflexion',
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">AI Form Check</h1>
        <p className="text-gray-600">
          Upload a video or photo of your exercise for instant posture analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Media
              </CardTitle>
              <CardDescription>Upload a video or image for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">Video or Image (MP4, MOV, JPG, PNG)</p>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                    <img
                      src={uploadedFile}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">Video uploaded</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setUploadedFile(null)}>
                      Remove
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="flex-1"
                    >
                      {isAnalyzing ? (
                        <>Analyzing...</>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 w-4 h-4" />
                          Analyze Form
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  For best results, ensure the camera captures your full body and the lighting is
                  adequate. Side angle works best for most exercises.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Better Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Film from the side for squats, deadlifts, and presses</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Ensure your entire body is visible in frame</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Use good lighting and a stable camera position</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Capture at least 3-5 repetitions for video analysis</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          {!analysisResult ? (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="mb-2 text-gray-600">No analysis yet</h3>
                <p className="text-gray-500">Upload a video or image to get started</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Form Analysis: {analysisResult.exercise}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      Overall Score:
                      <Badge
                        variant={
                          analysisResult.overallScore >= 80
                            ? 'default'
                            : analysisResult.overallScore >= 60
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {analysisResult.overallScore}/100
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3">Detailed Breakdown</h4>
                  <div className="space-y-4">
                    {analysisResult.feedback.map((item: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.type === 'success' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                            <span>{item.aspect}</span>
                          </div>
                          <span className="text-sm text-gray-600">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="h-2" />
                        <p className="text-sm text-gray-600">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Improvement Suggestions
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {analysisResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 flex-shrink-0">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full" variant="outline">
                  Save Analysis to History
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
