import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Heart, Bed, Droplets, Moon, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from './ui/progress';

export function RecoveryTracking() {
  const [sleepQuality, setSleepQuality] = useState([7]);
  const [musclesSore, setMusclesSore] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState([6]);
  const [stressLevel, setStressLevel] = useState([4]);
  const [notes, setNotes] = useState('');

  const muscleGroups = [
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'arms', label: 'Arms' },
    { id: 'legs', label: 'Legs' },
    { id: 'core', label: 'Core' },
  ];

  const toggleMuscle = (muscleId: string) => {
    setMusclesSore((prev) =>
      prev.includes(muscleId) ? prev.filter((id) => id !== muscleId) : [...prev, muscleId]
    );
  };

  const recoveryScore = Math.round(
    (sleepQuality[0] * 0.35 + energyLevel[0] * 0.3 + (10 - stressLevel[0]) * 0.25 + (10 - musclesSore.length * 1.5) * 0.1) * 10
  );

  const getRecommendation = () => {
    if (recoveryScore >= 80) {
      return {
        type: 'success',
        message: 'Great recovery! You\'re ready for an intense workout today.',
        suggestion: 'Consider a high-intensity strength or HIIT session',
      };
    } else if (recoveryScore >= 60) {
      return {
        type: 'warning',
        message: 'Moderate recovery. Consider a lighter workout or active recovery.',
        suggestion: 'Try a moderate intensity workout or focus on technique',
      };
    } else {
      return {
        type: 'danger',
        message: 'Low recovery detected. Rest is recommended.',
        suggestion: 'Take a rest day or do very light activity like walking or stretching',
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Recovery Tracking</h1>
        <p className="text-gray-600">
          Monitor your recovery and get personalized workout adjustments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Recovery Check-In</CardTitle>
              <CardDescription>Help us understand how you're feeling today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-600" />
                    Sleep Quality
                  </label>
                  <span className="text-sm text-gray-600">{sleepQuality[0]}/10</span>
                </div>
                <Slider
                  value={sleepQuality}
                  onValueChange={setSleepQuality}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    Energy Level
                  </label>
                  <span className="text-sm text-gray-600">{energyLevel[0]}/10</span>
                </div>
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Exhausted</span>
                  <span>Energized</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                    Stress Level
                  </label>
                  <span className="text-sm text-gray-600">{stressLevel[0]}/10</span>
                </div>
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Relaxed</span>
                  <span>Very Stressed</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-3">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  Muscle Soreness
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {muscleGroups.map((muscle) => (
                    <Button
                      key={muscle.id}
                      variant={musclesSore.includes(muscle.id) ? 'default' : 'outline'}
                      onClick={() => toggleMuscle(muscle.id)}
                      className="w-full"
                    >
                      {muscle.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">Additional Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any injuries, extra fatigue, or other notes..."
                  rows={3}
                />
              </div>

              <Button className="w-full">Save Recovery Data</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recovery History</CardTitle>
              <CardDescription>Your recovery trends over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: 'Today', score: recoveryScore },
                  { date: 'Oct 31', score: 75 },
                  { date: 'Oct 30', score: 88 },
                  { date: 'Oct 29', score: 65 },
                  { date: 'Oct 28', score: 92 },
                ].map((entry) => (
                  <div key={entry.date} className="flex items-center gap-4">
                    <span className="text-sm w-20">{entry.date}</span>
                    <Progress value={entry.score} className="flex-1 h-2" />
                    <span className="text-sm w-12 text-right">{entry.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={`border-2 ${
            recommendation.type === 'success'
              ? 'border-green-200 bg-green-50'
              : recommendation.type === 'warning'
              ? 'border-yellow-200 bg-yellow-50'
              : 'border-red-200 bg-red-50'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {recommendation.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                )}
                Recovery Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-5xl mb-2">{recoveryScore}%</div>
                <Badge
                  variant={
                    recommendation.type === 'success'
                      ? 'default'
                      : recommendation.type === 'warning'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {recommendation.type === 'success'
                    ? 'Well Recovered'
                    : recommendation.type === 'warning'
                    ? 'Moderate'
                    : 'Needs Rest'}
                </Badge>
              </div>
              <Alert>
                <AlertDescription>{recommendation.message}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Adjustment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{recommendation.suggestion}</p>

              <div className="space-y-2">
                <h4 className="text-sm">Recovery Factors:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Sleep
                    </span>
                    <span className={sleepQuality[0] >= 7 ? 'text-green-600' : 'text-orange-600'}>
                      {sleepQuality[0] >= 7 ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Energy
                    </span>
                    <span className={energyLevel[0] >= 6 ? 'text-green-600' : 'text-orange-600'}>
                      {energyLevel[0] >= 6 ? 'Good' : 'Low'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Droplets className="w-4 h-4" />
                      Soreness
                    </span>
                    <span className={musclesSore.length <= 2 ? 'text-green-600' : 'text-orange-600'}>
                      {musclesSore.length <= 2 ? 'Minimal' : 'Significant'}
                    </span>
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Adjust Today's Workout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recovery Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Bed className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Aim for 7-9 hours of quality sleep</span>
                </li>
                <li className="flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Stay hydrated throughout the day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Consider active recovery on rest days</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
