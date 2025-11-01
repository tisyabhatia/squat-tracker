import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Play, Pause, Check, Clock, Dumbbell, Plus, Minus } from 'lucide-react';

export function ActiveWorkout() {
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const [workout] = useState({
    name: 'Full Body Strength',
    exercises: [
      { name: 'Barbell Squat', sets: 4, targetReps: '8-10', completedSets: [] as any[] },
      { name: 'Bench Press', sets: 4, targetReps: '8-10', completedSets: [] as any[] },
      { name: 'Bent Over Rows', sets: 4, targetReps: '10-12', completedSets: [] as any[] },
      { name: 'Overhead Press', sets: 3, targetReps: '8-10', completedSets: [] as any[] },
      { name: 'Romanian Deadlifts', sets: 3, targetReps: '10-12', completedSets: [] as any[] },
    ]
  });

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

  const handleLogSet = (exerciseIndex: number, weight: number, reps: number) => {
    workout.exercises[exerciseIndex].completedSets.push({
      weight,
      reps,
      timestamp: new Date().toISOString()
    });
  };

  const handleFinishWorkout = () => {
    alert('Workout completed! Great job!');
    // Here you would save the workout data
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Active Workout</h1>
        <p className="text-gray-600">
          Track your sets and reps in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {completedSets} / {totalSets} sets completed
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatTime(elapsedTime)}</div>
                  <div className="text-sm text-gray-600">Duration</div>
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
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{exercise.name}</h3>
                        <p className="text-sm text-gray-600">
                          {exercise.sets} sets × {exercise.targetReps} reps
                        </p>
                      </div>
                      <Badge variant={exercise.completedSets.length === exercise.sets ? 'default' : 'outline'}>
                        {exercise.completedSets.length} / {exercise.sets}
                      </Badge>
                    </div>

                    {exercise.completedSets.length < exercise.sets && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <p className="text-sm mb-2">Log Set {exercise.completedSets.length + 1}</p>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1 flex-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {}}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              placeholder="Weight"
                              className="text-center"
                            />
                            <span className="text-sm text-gray-600">lbs</span>
                          </div>
                          <div className="flex items-center gap-1 flex-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {}}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              placeholder="Reps"
                              className="text-center"
                            />
                            <span className="text-sm text-gray-600">reps</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleLogSet(exerciseIndex, 135, 10)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {exercise.completedSets.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {exercise.completedSets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                          >
                            <span className="text-gray-600">Set {setIndex + 1}</span>
                            <span>
                              {set.weight} lbs × {set.reps} reps
                            </span>
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2">{formatTime(elapsedTime)}</div>
                <p className="text-sm text-gray-600">Total workout time</p>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Workout Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Exercises</span>
                <span className="text-sm font-semibold">{workout.exercises.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Sets</span>
                <span className="text-sm font-semibold">{totalSets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <span className="text-sm font-semibold">{completedSets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Remaining</span>
                <span className="text-sm font-semibold">{totalSets - completedSets}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Exercise
              </Button>
              <Button variant="outline" className="w-full">
                Skip Exercise
              </Button>
              <Button variant="destructive" className="w-full">
                End Workout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
