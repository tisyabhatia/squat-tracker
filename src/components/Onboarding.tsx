import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Target, Dumbbell, CalendarDays, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutDays, setWorkoutDays] = useState<string[]>([]);

  const goals = [
    { id: 'build-muscle', label: 'Build Muscle', icon: '💪' },
    { id: 'strength', label: 'Build Strength', icon: '🏋️' },
    { id: 'improve-endurance', label: 'Improve Endurance', icon: '🏃' },
    { id: 'stay-active', label: 'Stay Active', icon: '⭐' },
  ];

  const equipment = [
    { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { id: 'barbell', label: 'Barbell', icon: '🏋️' },
    { id: 'kettlebell', label: 'Kettlebell', icon: '⚫' },
    { id: 'resistance-bands', label: 'Resistance Bands', icon: '🎗️' },
    { id: 'pull-up-bar', label: 'Pull-up Bar', icon: '🤸' },
    { id: 'bench', label: 'Workout Bench', icon: '🛋️' },
    { id: 'cardio-equipment', label: 'Cardio Equipment', icon: '🚴' },
    { id: 'no-equipment', label: 'Bodyweight Only', icon: '🧘' },
  ];

  const weekDays = [
    { id: 'monday', label: 'Monday', short: 'Mon' },
    { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { id: 'thursday', label: 'Thursday', short: 'Thu' },
    { id: 'friday', label: 'Friday', short: 'Fri' },
    { id: 'saturday', label: 'Saturday', short: 'Sat' },
    { id: 'sunday', label: 'Sunday', short: 'Sun' },
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

  const handleDayToggle = (dayId: string) => {
    setWorkoutDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
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
    <div className="min-h-screen bg-gradient-to-br from-[#2a2438] via-[#3d3451] to-[#2a2438] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/80 border-border backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-2 w-full">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    s <= step ? 'bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2]' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="flex items-center gap-2 text-foreground">
            {step === 1 && (
              <>
                <Target className="w-6 h-6 text-primary" />
                Set Your Goals
              </>
            )}
            {step === 2 && (
              <>
                <Dumbbell className="w-6 h-6 text-primary" />
                Available Equipment
              </>
            )}
            {step === 3 && (
              <>
                <CalendarDays className="w-6 h-6 text-primary" />
                Weekly Schedule
              </>
            )}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {step === 1 && 'Tell us what you want to achieve and your current fitness level'}
            {step === 2 && 'Select the equipment you have access to'}
            {step === 3 && 'Choose the days you want to work out'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-foreground">What are your fitness goals?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedGoals.includes(goal.id)
                          ? 'border-primary bg-primary/20 text-foreground'
                          : 'border-border hover:border-primary/50 bg-muted/30 text-muted-foreground'
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
                <h3 className="mb-4 text-foreground">Current fitness level</h3>
                <RadioGroup value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 bg-muted/30">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="flex-1 cursor-pointer text-muted-foreground">
                        <div>
                          <div className="text-foreground">Beginner</div>
                          <div className="text-sm text-muted-foreground">
                            New to working out or getting back after a break
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 bg-muted/30">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="flex-1 cursor-pointer text-muted-foreground">
                        <div>
                          <div className="text-foreground">Intermediate</div>
                          <div className="text-sm text-muted-foreground">
                            Regular exercise 2-3 times per week
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 bg-muted/30">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="flex-1 cursor-pointer text-muted-foreground">
                        <div>
                          <div className="text-foreground">Advanced</div>
                          <div className="text-sm text-muted-foreground">
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
                        ? 'border-primary bg-primary/20 text-foreground'
                        : 'border-border hover:border-primary/50 bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select the days you'd like to work out. We recommend 3-5 days per week.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekDays.map((day) => (
                  <div
                    key={day.id}
                    onClick={() => handleDayToggle(day.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                      workoutDays.includes(day.id)
                        ? 'border-primary bg-primary/20 text-foreground'
                        : 'border-border hover:border-primary/50 bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    <div className="text-lg font-semibold mb-1">{day.short}</div>
                    <div className="text-xs opacity-75">{day.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-primary/20 border border-primary/30 p-4 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>{workoutDays.length} workout days selected</strong>
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-6 border-t border-border">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-border text-foreground hover:bg-muted"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="ml-auto bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2] hover:opacity-90 text-[#2a2438] font-medium"
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
