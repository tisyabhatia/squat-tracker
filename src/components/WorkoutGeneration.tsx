import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Sparkles, Clock, Target, Zap, ChevronRight, Play } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function WorkoutGeneration() {
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState([45]);
  const [intensity, setIntensity] = useState('');
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedWorkout({
        name: 'Full Body Strength Builder',
        duration: duration[0],
        intensity: intensity,
        exercises: [
          {
            name: 'Barbell Squats',
            sets: 4,
            reps: '8-10',
            rest: '90s',
            notes: 'Focus on depth and controlled descent',
          },
          {
            name: 'Bench Press',
            sets: 4,
            reps: '8-10',
            rest: '90s',
            notes: 'Keep shoulder blades retracted',
          },
          {
            name: 'Bent Over Rows',
            sets: 4,
            reps: '10-12',
            rest: '60s',
            notes: 'Pull to lower chest, squeeze shoulder blades',
          },
          {
            name: 'Overhead Press',
            sets: 3,
            reps: '8-10',
            rest: '90s',
            notes: 'Engage core throughout movement',
          },
          {
            name: 'Romanian Deadlifts',
            sets: 3,
            reps: '10-12',
            rest: '60s',
            notes: 'Hinge at hips, feel hamstring stretch',
          },
          {
            name: 'Plank Hold',
            sets: 3,
            reps: '45-60s',
            rest: '45s',
            notes: 'Maintain neutral spine',
          },
        ],
      });
      setIsGenerating(false);
    }, 1500);
  };

  const canGenerate = workoutType && intensity;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Smart Workout Generator</h1>
        <p className="text-gray-600">
          AI-powered workout creation based on your goals and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Workout Parameters
              </CardTitle>
              <CardDescription>Customize your workout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block mb-2 text-sm">Workout Type</label>
                <Select value={workoutType} onValueChange={setWorkoutType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-body">Full Body</SelectItem>
                    <SelectItem value="upper-body">Upper Body</SelectItem>
                    <SelectItem value="lower-body">Lower Body</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="pull">Pull</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2 text-sm">Duration: {duration[0]} minutes</label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={15}
                  max={90}
                  step={5}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15 min</span>
                  <span>90 min</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">Intensity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <Button
                      key={level}
                      variant={intensity === level ? 'default' : 'outline'}
                      onClick={() => setIntensity(level)}
                      className="w-full"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" />
                    Generate Workout
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!generatedWorkout ? (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="mb-2 text-gray-600">No workout generated yet</h3>
                <p className="text-gray-500">
                  Set your parameters and click "Generate Workout" to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{generatedWorkout.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {generatedWorkout.duration} min
                      </span>
                      <Badge variant="secondary">{generatedWorkout.intensity} Intensity</Badge>
                    </CardDescription>
                  </div>
                  <Button>
                    <Play className="mr-2 w-4 h-4" />
                    Start Workout
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <Target className="w-4 h-4" />
                  <AlertDescription>
                    This workout is optimized for your goals: Build Muscle, Improve Endurance
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {generatedWorkout.exercises.map((exercise: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{exercise.name}</h4>
                        <div className="flex gap-4 text-sm text-gray-600 mb-2">
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          <span>{exercise.rest} rest</span>
                        </div>
                        <p className="text-sm text-gray-500 italic">{exercise.notes}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="mb-2">Workout Tips</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Warm up for 5-10 minutes before starting</li>
                    <li>Maintain proper form over heavy weights</li>
                    <li>Stay hydrated throughout your session</li>
                    <li>Cool down and stretch after completing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
