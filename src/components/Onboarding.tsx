import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Target, Dumbbell, CalendarDays, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutDays, setWorkoutDays] = useState<Date[]>([]);

  const goals = [
    { id: 'lose-weight', label: 'Lose Weight', icon: '🎯' },
    { id: 'build-muscle', label: 'Build Muscle', icon: '💪' },
    { id: 'improve-endurance', label: 'Improve Endurance', icon: '🏃' },
    { id: 'flexibility', label: 'Increase Flexibility', icon: '🧘' },
    { id: 'general-fitness', label: 'General Fitness', icon: '⭐' },
    { id: 'sports-performance', label: 'Sports Performance', icon: '🏅' },
  ];

  const equipment = [
    { id: 'dumbbells', label: 'Dumbbells' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'kettlebell', label: 'Kettlebell' },
    { id: 'resistance-bands', label: 'Resistance Bands' },
    { id: 'pull-up-bar', label: 'Pull-up Bar' },
    { id: 'bench', label: 'Bench' },
    { id: 'yoga-mat', label: 'Yoga Mat' },
    { id: 'no-equipment', label: 'No Equipment (Bodyweight)' },
  ];

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentId) ? prev.filter((id) => id !== equipmentId) : [...prev, equipmentId]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save onboarding data to localStorage
      localStorage.setItem('userOnboarding', JSON.stringify({
        goals: selectedGoals,
        equipment: selectedEquipment,
        fitnessLevel,
        workoutDays,
        completedAt: new Date().toISOString()
      }));
      onComplete();
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedGoals.length > 0 && fitnessLevel !== '';
    if (step === 2) return selectedEquipment.length > 0;
    if (step === 3) return workoutDays.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-24 rounded-full ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && (
              <>
                <Target className="w-6 h-6" />
                Set Your Goals
              </>
            )}
            {step === 2 && (
              <>
                <Dumbbell className="w-6 h-6" />
                Available Equipment
              </>
            )}
            {step === 3 && (
              <>
                <CalendarDays className="w-6 h-6" />
                Weekly Schedule
              </>
            )}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Tell us what you want to achieve and your current fitness level'}
            {step === 2 && 'Select the equipment you have access to'}
            {step === 3 && 'Choose your preferred workout days'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4">What are your fitness goals?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedGoals.includes(goal.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{goal.icon}</span>
                        <span>{goal.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4">Current fitness level</h3>
                <RadioGroup value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                        <div>
                          <div>Beginner</div>
                          <div className="text-sm text-gray-500">
                            New to working out or getting back after a break
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                        <div>
                          <div>Intermediate</div>
                          <div className="text-sm text-gray-500">
                            Regular exercise 2-3 times per week
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                        <div>
                          <div>Advanced</div>
                          <div className="text-sm text-gray-500">
                            Experienced with structured training programs
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleEquipmentToggle(item.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedEquipment.includes(item.id)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedEquipment.includes(item.id)}
                        onCheckedChange={() => handleEquipmentToggle(item.id)}
                      />
                      <span>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select the days you'd like to work out. We recommend 3-5 days per week.
              </p>
              <div className="flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={workoutDays}
                  onSelect={(dates) => setWorkoutDays((dates as Date[]) || [])}
                  className="rounded-md border"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>{workoutDays.length} workout days selected</strong>
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-6 border-t">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="ml-auto"
            >
              {step === 3 ? (
                <>
                  Complete Setup <CheckCircle2 className="ml-2 w-4 h-4" />
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
