import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Play, Pause, Check, Clock, Dumbbell, ChevronRight, TrendingUp, Award, History, Trophy, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Modal, ConfirmModal } from './ui/modal';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';

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

interface ActiveWorkoutProps {
  onBack?: () => void;
}

export function ActiveWorkout({ onBack }: ActiveWorkoutProps) {
  const { toast } = useToast();
  const { settings, addWorkoutSession, userProfile, updateUserProfile, activeWorkout: contextActiveWorkout, setActiveWorkout, workoutTemplates, getExerciseById } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [previousPerformances, setPreviousPerformances] = useState<Map<string, PreviousPerformance>>(new Map());
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);

  const [workout, setWorkout] = useState<{ name: string; exercises: Exercise[] } | null>(null);

  const [currentWeight, setCurrentWeight] = useState('');
  const [currentReps, setCurrentReps] = useState('');

  // Initialize workout from context on mount
  useEffect(() => {
    if (contextActiveWorkout && contextActiveWorkout.status === 'in-progress') {
      // BUG FIX #2: Use preserved template data instead of looking up template
      // This prevents stale closure issues and data loss
      const transformedWorkout = {
        name: contextActiveWorkout.name,
        exercises: contextActiveWorkout.exercises.map(ex => {
          return {
            name: ex.exerciseName,
            // Use preserved template metadata (from BUG FIX #1)
            sets: ex.targetSets || 3,
            targetReps: ex.targetReps?.toString() || '8-10',
            completedSets: ex.sets
              .filter(set => set.completed)
              .map(set => ({
                weight: set.weight || 0,
                reps: set.reps || 0,
                timestamp: set.timestamp
              }))
          };
        })
      };
      setWorkout(transformedWorkout);

      // Calculate elapsed time from start time
      const startTime = new Date(contextActiveWorkout.startTime).getTime();
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }
    loadPreviousPerformances();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextActiveWorkout]);

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

  // Rest timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimeRemaining !== null && restTimeRemaining > 0) {
      interval = setInterval(() => {
        setRestTimeRemaining(time => {
          if (time === null || time <= 1) {
            setIsResting(false);
            toast.success('Rest time complete! Ready for next set');
            return null;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeRemaining, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Early return if no workout - must be before using workout.exercises
  if (!workout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-foreground">Active Workout</h1>
            <p className="text-muted-foreground">
              Track your sets and reps in real-time
            </p>
          </div>
          {onBack && (
            <Button variant="ghost" onClick={() => onBack()}>
              ← Back to Home
            </Button>
          )}
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="mb-2 text-foreground text-xl font-semibold">No Active Workout</h3>
            <p className="text-muted-foreground mb-6">
              Start a workout from the Workout Templates to begin tracking your exercises
            </p>
            {onBack && (
              <Button onClick={() => onBack()}>
                Go to Workout Templates
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Now safe to access workout.exercises
  // BUG FIX #5: Validate array bounds to prevent crashes
  const safeExerciseIndex = Math.min(currentExerciseIndex, workout.exercises.length - 1);
  if (safeExerciseIndex !== currentExerciseIndex && safeExerciseIndex >= 0) {
    setCurrentExerciseIndex(safeExerciseIndex);
  }
  const currentExercise = workout.exercises[safeExerciseIndex] || workout.exercises[0];
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = workout.exercises.reduce((acc, ex) => acc + ex.completedSets.length, 0);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleLogSet = (exerciseIndex: number) => {
    const weight = parseFloat(currentWeight);
    const reps = parseInt(currentReps) || 0;

    // Allow negative weights for assisted exercises (pull-ups, dips, etc.)
    if (isNaN(weight) || reps === 0) {
      setError('Please enter both weight and reps');
      return;
    }

    setError(null);

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
      toast.success(`New PR! ${progressCheck.message}`);
    }

    // Start rest timer if not the last set of the workout
    const isLastSetOfExercise = newWorkout.exercises[exerciseIndex].completedSets.length === newWorkout.exercises[exerciseIndex].sets;
    const isLastExercise = exerciseIndex === workout.exercises.length - 1;

    if (!isLastSetOfExercise || !isLastExercise) {
      const defaultRestTime = settings?.defaultRestTime || 90;
      setRestTimeRemaining(defaultRestTime);
      setIsResting(true);
    }

    // Auto-advance to next exercise if all sets are complete
    if (isLastSetOfExercise) {
      if (exerciseIndex < workout.exercises.length - 1) {
        setTimeout(() => setCurrentExerciseIndex(exerciseIndex + 1), 500);
      }
    }
  };

  const handleFinishWorkout = () => {
    setIsActive(false);
    setShowCompletionModal(true);
  };

  const confirmFinishWorkout = () => {
    if (!workout) return;

    // Calculate workout metrics
    const totalVolume = workout.exercises.reduce((total, exercise) => {
      return total + exercise.completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    }, 0);

    // Convert to proper WorkoutSession format
    const workoutSession = {
      id: contextActiveWorkout?.id || `workout-${Date.now()}`,
      templateId: contextActiveWorkout?.templateId,
      name: workout.name,
      type: contextActiveWorkout?.type || ('strength' as const),
      startTime: contextActiveWorkout?.startTime || new Date(Date.now() - elapsedTime * 1000).toISOString(),
      endTime: new Date().toISOString(),
      duration: elapsedTime,
      exercises: workout.exercises.map((ex, idx) => {
        // BUG FIX #3: Preserve original exerciseId from context
        const originalExercise = contextActiveWorkout?.exercises[idx];
        return {
          exerciseId: originalExercise?.exerciseId || ex.name.toLowerCase().replace(/\s+/g, '-'),
          exerciseName: ex.name,
          sets: ex.completedSets.map((set, setIdx) => ({
            setNumber: setIdx + 1,
            weight: set.weight,
            reps: set.reps,
            completed: true,
            timestamp: set.timestamp
          })),
          completed: true
        };
      }),
      totalVolume,
      status: 'completed' as const
    };

    // Add to workout history via context (this updates state and localStorage)
    addWorkoutSession(workoutSession);

    // Clear active workout from context
    setActiveWorkout(null);

    // Update workout stats (legacy - for backwards compatibility)
    const stats = JSON.parse(localStorage.getItem('workoutStats') || '{"workoutsThisWeek": 0, "totalMinutes": 0, "currentStreak": 0}');
    stats.workoutsThisWeek += 1;
    stats.totalMinutes += Math.floor(elapsedTime / 60);
    stats.currentStreak += 1;
    localStorage.setItem('workoutStats', JSON.stringify(stats));

    // Update user profile stats via context
    if (userProfile && userProfile.stats) {
      const currentTotalWorkouts = userProfile.stats.totalWorkouts || 0;
      updateUserProfile({
        stats: {
          ...userProfile.stats,
          totalWorkouts: currentTotalWorkouts + 1,
          workoutsThisWeek: (userProfile.stats.workoutsThisWeek || 0) + 1,
          totalVolume: (userProfile.stats.totalVolume || 0) + totalVolume,
          currentStreak: (userProfile.stats.currentStreak || 0) + 1,
          averageDuration: Math.floor(
            ((userProfile.stats.averageDuration || 0) * currentTotalWorkouts + Math.floor(elapsedTime / 60)) /
            (currentTotalWorkouts + 1)
          )
        }
      });
    }

    toast.success('Workout completed! Great job!');

    // Reset local state
    setElapsedTime(0);
    setCurrentExerciseIndex(0);
    setWorkout(null);

    // Reload previous performances for next workout
    loadPreviousPerformances();

    // Navigate back to home
    if (onBack) {
      onBack();
    }
  };

  const calculateWorkoutStats = () => {
    if (!workout) return { totalVolume: 0, totalReps: 0, maxWeight: 0 };

    const totalVolume = workout.exercises.reduce((total, exercise) => {
      return total + exercise.completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
    }, 0);

    const totalReps = workout.exercises.reduce((total, exercise) => {
      return total + exercise.completedSets.reduce((sum, set) => sum + set.reps, 0);
    }, 0);

    const maxWeight = Math.max(
      ...workout.exercises.flatMap(ex => ex.completedSets.map(s => s.weight)),
      0
    );

    return { totalVolume, totalReps, maxWeight };
  };

  const handleCancelWorkout = () => {
    if (completedSets > 0) {
      if (!confirm('You have unsaved progress. Are you sure you want to cancel this workout?')) {
        return;
      }
    }
    // Clear active workout from context
    setActiveWorkout(null);
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-foreground">Active Workout</h1>
          <p className="text-muted-foreground">
            Track your sets and reps in real-time
          </p>
        </div>
        {onBack && (
          <Button variant="ghost" onClick={handleCancelWorkout}>
            ← Back to Home
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

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
              {/* Rest Timer */}
              {isResting && restTimeRemaining !== null && (
                <div className="mb-4 p-4 bg-accent/20 border-2 border-accent rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1 text-accent animate-pulse">
                      {formatTime(restTimeRemaining)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Rest time remaining</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setIsResting(false);
                        setRestTimeRemaining(null);
                      }}
                    >
                      Skip Rest
                    </Button>
                  </div>
                </div>
              )}

              {/* Workout Timer */}
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

          {/* Upcoming Exercises */}
          {workout.exercises.slice(currentExerciseIndex + 1).length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <button
                  onClick={() => setShowUpcoming(!showUpcoming)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <CardTitle className="flex items-center gap-2 text-foreground text-base">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    Upcoming Exercises
                  </CardTitle>
                  {showUpcoming ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </CardHeader>
              {showUpcoming && (
                <CardContent className="space-y-2 pt-0">
                  {workout.exercises.slice(currentExerciseIndex + 1).map((exercise, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">{exercise.sets} sets × {exercise.targetReps} reps</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {exercise.sets} sets
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}

          {/* Completed Exercises */}
          {workout.exercises.filter(ex => ex.completedSets.length === ex.sets).length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <CardTitle className="flex items-center gap-2 text-foreground text-base">
                    <Check className="w-5 h-5 text-primary" />
                    Completed Exercises
                  </CardTitle>
                  {showCompleted ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </CardHeader>
              {showCompleted && (
                <CardContent className="space-y-2 pt-0">
                  {workout.exercises
                    .filter(ex => ex.completedSets.length === ex.sets)
                    .map((exercise, idx) => {
                      const totalVolume = exercise.completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
                      return (
                        <div key={idx} className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-foreground">{exercise.name}</p>
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{exercise.completedSets.length} sets completed</p>
                            <p className="text-xs text-muted-foreground">{totalVolume.toLocaleString()} lbs</p>
                          </div>
                        </div>
                      );
                    })}
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Workout Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => {
          setShowCompletionModal(false);
          setIsActive(true); // Resume if they cancel
        }}
        title="Workout Complete!"
        showCloseButton={false}
        size="md"
      >
        {(() => {
          const stats = calculateWorkoutStats();
          return (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Trophy className="w-16 h-16 text-yellow-500" />
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-700">Great job! Here's your workout summary:</p>
              </div>

              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900">{formatTime(elapsedTime)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Total Sets:</span>
                  <span className="font-semibold text-gray-900">{completedSets}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Total Reps:</span>
                  <span className="font-semibold text-gray-900">{stats.totalReps}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600">Total Volume:</span>
                  <span className="font-semibold text-gray-900">{stats.totalVolume.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Max Weight:</span>
                  <span className="font-semibold text-gray-900">{stats.maxWeight} lbs</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompletionModal(false);
                    setIsActive(true); // Resume workout
                  }}
                  className="flex-1"
                >
                  Keep Going
                </Button>
                <Button
                  onClick={confirmFinishWorkout}
                  className="flex-1"
                >
                  Save & Finish
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
