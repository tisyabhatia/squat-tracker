import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Play, Pause, Check, Clock, Dumbbell, ChevronRight, TrendingUp, Award, History } from 'lucide-react';

interface SetData {
  weight: number;
  reps: number;
  timestamp: string;
}

interface Exercise {
  name: string;
  sets: number;
  targetReps: string;
  completedSets: SetData[];
}

interface PreviousPerformance {
  exerciseName: string;
  sets: SetData[];
  date: string;
  totalVolume: number;
  maxWeight: number;
}

export function ActiveWorkout() {
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [previousPerformances, setPreviousPerformances] = useState<Map<string, PreviousPerformance>>(new Map());
  const [showHistory, setShowHistory] = useState<string | null>(null);

  const [workout, setWorkout] = useState<{ name: string; exercises: Exercise[] }>({
    name: 'Full Body Strength',
    exercises: [
      { name: 'Barbell Squat', sets: 4, targetReps: '8-10', completedSets: [] },
      { name: 'Bench Press', sets: 4, targetReps: '8-10', completedSets: [] },
      { name: 'Bent Over Rows', sets: 4, targetReps: '10-12', completedSets: [] },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10', completedSets: [] },
      { name: 'Romanian Deadlifts', sets: 3, targetReps: '10-12', completedSets: [] },
    ]
  });

  const [currentWeight, setCurrentWeight] = useState('');
  const [currentReps, setCurrentReps] = useState('');

  // Load previous performances on mount
  useEffect(() => {
    loadPreviousPerformances();
  }, []);

  const loadPreviousPerformances = () => {
    try {
      const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      const performanceMap = new Map<string, PreviousPerformance>();

      // Find the most recent performance for each exercise
      for (let i = history.length - 1; i >= 0; i--) {
        const workout = history[i];
        if (!workout.exercises) continue;

        workout.exercises.forEach((exercise: Exercise) => {
          if (!performanceMap.has(exercise.name) && exercise.completedSets.length > 0) {
            const totalVolume = exercise.completedSets.reduce(
              (sum: number, set: SetData) => sum + (set.weight * set.reps),
              0
            );
            const maxWeight = Math.max(...exercise.completedSets.map((set: SetData) => set.weight));

            performanceMap.set(exercise.name, {
              exerciseName: exercise.name,
              sets: exercise.completedSets,
              date: workout.completedAt,
              totalVolume,
              maxWeight,
            });
          }
        });
      }

      setPreviousPerformances(performanceMap);
    } catch (error) {
      console.error('Error loading previous performances:', error);
    }
  };

  const getProgressiveSuggestion = (exerciseName: string, setNumber: number) => {
    const previous = previousPerformances.get(exerciseName);
    if (!previous || !previous.sets[setNumber - 1]) {
      return null;
    }

    const lastSet = previous.sets[setNumber - 1];
    const suggestions = [];

    // Suggest weight increase (2.5-5 lbs for upper body, 5-10 lbs for lower body)
    const isLowerBody = exerciseName.toLowerCase().includes('squat') ||
                        exerciseName.toLowerCase().includes('deadlift') ||
                        exerciseName.toLowerCase().includes('leg');
    const weightIncrement = isLowerBody ? 5 : 2.5;

    suggestions.push({
      type: 'weight',
      text: `Last: ${lastSet.weight} lbs × ${lastSet.reps} reps`,
      suggestion: `Try: ${lastSet.weight + weightIncrement} lbs × ${lastSet.reps} reps`,
    });

    // Suggest rep increase if reps were high
    if (lastSet.reps >= 10) {
      suggestions.push({
        type: 'reps',
        text: `Or add reps: ${lastSet.weight} lbs × ${lastSet.reps + 1} reps`,
      });
    }

    return suggestions[0];
  };

  const checkProgressiveOverload = (exerciseName: string, weight: number, reps: number) => {
    const previous = previousPerformances.get(exerciseName);
    if (!previous) return null;

    const currentSetIndex = workout.exercises
      .find(e => e.name === exerciseName)?.completedSets.length || 0;

    const lastSet = previous.sets[currentSetIndex];
    if (!lastSet) return null;

    const currentVolume = weight * reps;
    const lastVolume = lastSet.weight * lastSet.reps;

    if (weight > lastSet.weight) {
      return { type: 'weight', message: `+${(weight - lastSet.weight).toFixed(1)} lbs heavier!` };
    } else if (reps > lastSet.reps && weight >= lastSet.weight) {
      return { type: 'reps', message: `+${reps - lastSet.reps} more reps!` };
    } else if (currentVolume > lastVolume) {
      return { type: 'volume', message: `+${((currentVolume - lastVolume) / lastVolume * 100).toFixed(0)}% volume!` };
    }

    return null;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = workout.exercises.reduce((acc, ex) => acc + ex.completedSets.length, 0);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleLogSet = (exerciseIndex: number) => {
    const weight = parseFloat(currentWeight) || 0;
    const reps = parseInt(currentReps) || 0;

    if (weight === 0 || reps === 0) {
      alert('Please enter both weight and reps');
      return;
    }

    // Check for progressive overload
    const exercise = workout.exercises[exerciseIndex];
    const progressCheck = checkProgressiveOverload(exercise.name, weight, reps);

    const newWorkout = { ...workout };
    newWorkout.exercises[exerciseIndex].completedSets.push({
      weight,
      reps,
      timestamp: new Date().toISOString()
    });
    setWorkout(newWorkout);
    setCurrentWeight('');
    setCurrentReps('');

    // Show progressive overload achievement
    if (progressCheck) {
      // Could show a toast or celebration animation here
      console.log(`Progress: ${progressCheck.message}`);
    }

    // Auto-advance to next exercise if all sets are complete
    if (newWorkout.exercises[exerciseIndex].completedSets.length === newWorkout.exercises[exerciseIndex].sets) {
      if (exerciseIndex < workout.exercises.length - 1) {
        setTimeout(() => setCurrentExerciseIndex(exerciseIndex + 1), 500);
      }
    }
  };

  const handleFinishWorkout = () => {
    setIsActive(false);
    // Save workout data to localStorage
    const workoutData = {
      name: workout.name,
      exercises: workout.exercises,
      duration: elapsedTime,
      completedAt: new Date().toISOString()
    };

    // Save to workout history
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    history.push(workoutData);
    localStorage.setItem('workoutHistory', JSON.stringify(history));

    // Update workout stats
    const stats = JSON.parse(localStorage.getItem('workoutStats') || '{"workoutsThisWeek": 0, "totalMinutes": 0, "currentStreak": 0}');
    stats.workoutsThisWeek += 1;
    stats.totalMinutes += Math.floor(elapsedTime / 60);
    stats.currentStreak += 1;
    localStorage.setItem('workoutStats', JSON.stringify(stats));

    alert('Workout completed! Great job!');

    // Reset workout
    setElapsedTime(0);
    setCurrentExerciseIndex(0);
    const resetWorkout = {
      name: 'Full Body Strength',
      exercises: [
        { name: 'Barbell Squat', sets: 4, targetReps: '8-10', completedSets: [] },
        { name: 'Bench Press', sets: 4, targetReps: '8-10', completedSets: [] },
        { name: 'Bent Over Rows', sets: 4, targetReps: '10-12', completedSets: [] },
        { name: 'Overhead Press', sets: 3, targetReps: '8-10', completedSets: [] },
        { name: 'Romanian Deadlifts', sets: 3, targetReps: '10-12', completedSets: [] },
      ]
    };
    setWorkout(resetWorkout);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Active Workout</h1>
        <p className="text-muted-foreground">
          Track your sets and reps in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">{workout.name}</CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    {completedSets} / {totalSets} sets completed
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">{formatTime(elapsedTime)}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Button
                  onClick={handleStartPause}
                  className="flex-1"
                  variant={isActive ? 'outline' : 'default'}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Workout
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleFinishWorkout}
                  variant="outline"
                  disabled={completedSets === 0}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Finish
                </Button>
              </div>

              <div className="space-y-4">
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      currentExerciseIndex === exerciseIndex
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="mb-1 text-foreground">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.targetReps} reps
                        </p>
                      </div>
                      <Badge variant={exercise.completedSets.length === exercise.sets ? 'default' : 'outline'}>
                        {exercise.completedSets.length} / {exercise.sets}
                      </Badge>
                    </div>

                    {exercise.completedSets.length < exercise.sets && currentExerciseIndex === exerciseIndex && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border space-y-2">
                        {/* Progressive Overload Suggestion */}
                        {(() => {
                          const suggestion = getProgressiveSuggestion(exercise.name, exercise.completedSets.length + 1);
                          return suggestion ? (
                            <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="text-xs space-y-1">
                                <div className="text-gray-700 dark:text-gray-300">{suggestion.text}</div>
                                <div className="font-semibold text-blue-600 dark:text-blue-400">{suggestion.suggestion}</div>
                              </div>
                            </div>
                          ) : null;
                        })()}

                        <p className="text-sm mb-2 text-foreground font-medium">Log Set {exercise.completedSets.length + 1}</p>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1 flex-1">
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={currentWeight}
                              onChange={(e) => setCurrentWeight(e.target.value)}
                              className="text-center bg-input text-foreground"
                            />
                            <span className="text-sm text-muted-foreground">lbs</span>
                          </div>
                          <div className="flex items-center gap-1 flex-1">
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={currentReps}
                              onChange={(e) => setCurrentReps(e.target.value)}
                              className="text-center bg-input text-foreground"
                            />
                            <span className="text-sm text-muted-foreground">reps</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleLogSet(exerciseIndex)}
                            className="bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2] hover:opacity-90 text-[#2a2438]"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {exercise.completedSets.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {exercise.completedSets.map((set, setIndex) => {
                          const previous = previousPerformances.get(exercise.name);
                          const previousSet = previous?.sets[setIndex];
                          const isImprovement = previousSet && (
                            set.weight > previousSet.weight ||
                            (set.weight === previousSet.weight && set.reps > previousSet.reps) ||
                            (set.weight * set.reps > previousSet.weight * previousSet.reps)
                          );

                          return (
                            <div
                              key={setIndex}
                              className={`flex items-center justify-between text-sm p-2 rounded ${
                                isImprovement
                                  ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                                  : 'bg-accent/20'
                              }`}
                            >
                              <span className="text-muted-foreground">Set {setIndex + 1}</span>
                              <span className="text-foreground flex items-center gap-2">
                                {set.weight} lbs × {set.reps} reps
                                {previousSet && (
                                  <span className="text-xs text-gray-500">
                                    (was: {previousSet.weight} × {previousSet.reps})
                                  </span>
                                )}
                              </span>
                              {isImprovement ? (
                                <Award className="w-4 h-4 text-green-600" />
                              ) : (
                                <Check className="w-4 h-4 text-accent" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {exercise.completedSets.length === exercise.sets && exerciseIndex < workout.exercises.length - 1 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-3"
                        onClick={() => setCurrentExerciseIndex(exerciseIndex + 1)}
                      >
                        Next Exercise <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="w-5 h-5 text-primary" />
                Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2 text-foreground">{formatTime(elapsedTime)}</div>
                <p className="text-sm text-muted-foreground">Total workout time</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setElapsedTime(0)}
              >
                Reset Timer
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Dumbbell className="w-5 h-5 text-primary" />
                Workout Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Exercises</span>
                <span className="text-sm font-semibold text-foreground">{workout.exercises.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Sets</span>
                <span className="text-sm font-semibold text-foreground">{totalSets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-semibold text-foreground">{completedSets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="text-sm font-semibold text-foreground">{totalSets - completedSets}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
