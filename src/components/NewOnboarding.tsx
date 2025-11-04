import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ChevronRight, Dumbbell, Target, Calendar } from 'lucide-react';
import { Equipment, TrainingSplit, GoalType } from '../types';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export function NewOnboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [weeklyFrequency, setWeeklyFrequency] = useState(3);
  const [trainingSplit, setTrainingSplit] = useState<TrainingSplit>('ppl');
  const [selectedGoals, setSelectedGoals] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  const totalSteps = 5;

  // Equipment options
  const equipmentOptions: Equipment[] = [
    'barbell',
    'dumbbell',
    'kettlebell',
    'resistance-band',
    'pull-up-bar',
    'bench',
    'squat-rack',
    'cable-machine',
    'none',
  ];

  // Training split suggestions based on frequency
  const getSuggestedSplit = (freq: number): TrainingSplit => {
    if (freq === 1) return 'fullbody';
    if (freq === 2) return 'upperlower';
    if (freq >= 3) return 'ppl';
    return 'fullbody';
  };

  const handleFrequencyChange = (freq: number) => {
    setWeeklyFrequency(freq);
    setTrainingSplit(getSuggestedSplit(freq));
  };

  const toggleEquipment = (item: Equipment) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter(e => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const addGoal = (type: GoalType, description: string, target: number, unit: string) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      type,
      description,
      target,
      current: 0,
      unit,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setSelectedGoals([...selectedGoals, newGoal]);
  };

  const removeGoal = (id: string) => {
    setSelectedGoals(selectedGoals.filter(g => g.id !== id));
  };

  const handleComplete = () => {
    const onboardingData = {
      name,
      fitnessLevel,
      weeklyFrequency,
      trainingSplit,
      goals: selectedGoals,
      availableEquipment: equipment,
    };

    onComplete(onboardingData);
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return fitnessLevel && weeklyFrequency > 0;
    if (step === 3) return selectedGoals.length > 0;
    if (step === 4) return equipment.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl text-foreground">Welcome to Checkpoint</CardTitle>
            <Badge variant="outline">{step} of {totalSteps}</Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2 text-foreground">Let's get started!</h2>
                <p className="text-muted-foreground">What should we call you?</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input text-foreground text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Fitness Level & Frequency */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold mb-2 text-foreground">Your Fitness Profile</h2>
                <p className="text-muted-foreground">Help us personalize your experience</p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Fitness Level</Label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={fitnessLevel === level ? 'default' : 'outline'}
                      onClick={() => setFitnessLevel(level)}
                      className="h-auto py-4 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Workouts Per Week</Label>
                <div className="grid grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((freq) => (
                    <Button
                      key={freq}
                      variant={weeklyFrequency === freq ? 'default' : 'outline'}
                      onClick={() => handleFrequencyChange(freq)}
                      className="h-12"
                    >
                      {freq}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Training Split</Label>
                <Select value={trainingSplit} onValueChange={(val) => setTrainingSplit(val as TrainingSplit)}>
                  <SelectTrigger className="bg-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullbody">Full Body</SelectItem>
                    <SelectItem value="upperlower">Upper/Lower</SelectItem>
                    <SelectItem value="ppl">Push/Pull/Legs</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Suggested: {getSuggestedSplit(weeklyFrequency).replace('upperlower', 'Upper/Lower').replace('ppl', 'Push/Pull/Legs').replace('fullbody', 'Full Body')}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold mb-2 text-foreground">Set Your Goals</h2>
                <p className="text-muted-foreground">Choose 1-3 measurable goals</p>
              </div>

              {selectedGoals.length > 0 && (
                <div className="space-y-2 mb-4">
                  {selectedGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{goal.description}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeGoal(goal.id)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {selectedGoals.length < 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-4 justify-start"
                    onClick={() => addGoal('strength', 'Bench press 225 lbs', 225, 'lbs')}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Strength Goal</div>
                      <div className="text-xs text-muted-foreground">Bench 225 lbs</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 justify-start"
                    onClick={() => addGoal('consistency', 'Complete 60 workouts in 6 months', 60, 'workouts')}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Consistency</div>
                      <div className="text-xs text-muted-foreground">60 workouts in 6 months</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 justify-start"
                    onClick={() => addGoal('strength', 'Deadlift 405 lbs', 405, 'lbs')}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Deadlift Goal</div>
                      <div className="text-xs text-muted-foreground">405 lbs</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 justify-start"
                    onClick={() => addGoal('volume', 'Complete 100,000 lbs volume monthly', 100000, 'lbs')}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Volume Goal</div>
                      <div className="text-xs text-muted-foreground">100k lbs/month</div>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Equipment */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold mb-2 text-foreground">Available Equipment</h2>
                <p className="text-muted-foreground">Select what you have access to</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {equipmentOptions.map((item) => (
                  <Button
                    key={item}
                    variant={equipment.includes(item) ? 'default' : 'outline'}
                    onClick={() => toggleEquipment(item)}
                    className="h-auto py-4 capitalize justify-start"
                  >
                    <Dumbbell className="w-4 h-4 mr-2" />
                    {item.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold mb-2 text-foreground">Ready to Go!</h2>
                <p className="text-muted-foreground">Review your profile</p>
              </div>

              <div className="space-y-3 bg-accent/10 p-4 rounded-lg">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p className="font-semibold text-foreground">{name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Level:</span>
                  <p className="font-semibold capitalize text-foreground">{fitnessLevel}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Schedule:</span>
                  <p className="font-semibold text-foreground">{weeklyFrequency}x per week - {trainingSplit.replace('ppl', 'PPL').replace('upperlower', 'Upper/Lower').replace('fullbody', 'Full Body')}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Goals:</span>
                  {selectedGoals.map(g => (
                    <p key={g.id} className="font-semibold text-foreground">• {g.description}</p>
                  ))}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Equipment:</span>
                  <p className="font-semibold capitalize text-foreground">{equipment.join(', ').replace(/-/g, ' ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <div className="ml-auto">
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={!canProceed()}>
                  Start Training
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
