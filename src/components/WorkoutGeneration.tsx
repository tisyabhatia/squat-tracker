import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Target, Zap, ChevronRight, Play, Dumbbell } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useApp } from '../contexts/AppContext';
import { WorkoutTemplate } from '../types';

export function WorkoutGeneration() {
  const { workoutTemplates, getExerciseById, setActiveWorkout } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);

  const handleStartWorkout = (template: WorkoutTemplate) => {
    // Create a new workout session from the template
    const workoutSession = {
      id: `workout-${Date.now()}`,
      templateId: template.id,
      name: template.name,
      type: template.type,
      startTime: new Date().toISOString(),
      duration: 0,
      exercises: template.exercises.map(ex => {
        const exercise = getExerciseById(ex.exerciseId);
        return {
          exerciseId: ex.exerciseId,
          exerciseName: exercise?.name || 'Unknown Exercise',
          sets: [],
          completed: false,
        };
      }),
      status: 'in-progress' as const,
    };

    setActiveWorkout(workoutSession);
    alert('Workout started! Navigate to the Workout tab to begin.');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return '';
    }
  };

  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedTemplate(null)}
          className="mb-4 text-foreground"
        >
          ← Back to Templates
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-foreground text-2xl">{selectedTemplate.name}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                  <span className="flex items-center gap-1 capitalize">
                    <Target className="w-4 h-4" />
                    {selectedTemplate.type.replace('-', ' ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedTemplate.estimatedDuration} min
                  </span>
                  <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                    {selectedTemplate.difficulty}
                  </Badge>
                </CardDescription>
              </div>
              <Button onClick={() => handleStartWorkout(selectedTemplate)}>
                <Play className="mr-2 w-4 h-4" />
                Start Workout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-primary/10 border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <AlertDescription className="text-foreground">
                {selectedTemplate.description}
              </AlertDescription>
            </Alert>

            <div className="mb-6">
              <h3 className="mb-3 text-foreground font-semibold">Target Muscle Groups</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.targetMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary" className="capitalize">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>

            <h3 className="mb-4 text-foreground font-semibold">Exercises ({selectedTemplate.exercises.length})</h3>
            <div className="space-y-4">
              {selectedTemplate.exercises.map((workoutExercise, index) => {
                const exercise = getExerciseById(workoutExercise.exerciseId);
                if (!exercise) return null;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-2 border-border rounded-lg hover:border-primary/50 transition-colors bg-card"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 text-foreground font-medium">{exercise.name}</h4>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                        <span>{workoutExercise.sets} sets</span>
                        {workoutExercise.targetReps && <span>{workoutExercise.targetReps} reps</span>}
                        {workoutExercise.targetDuration && (
                          <span>{workoutExercise.targetDuration}s duration</span>
                        )}
                        <span>{workoutExercise.restTime}s rest</span>
                      </div>
                      {workoutExercise.notes && (
                        <p className="text-sm text-muted-foreground italic">{workoutExercise.notes}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exercise.primaryMuscles.map((muscle) => (
                          <Badge key={muscle} variant="outline" className="text-xs capitalize">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h4 className="mb-2 text-foreground font-semibold">Workout Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Warm up for 5-10 minutes before starting</li>
                <li>Maintain proper form over heavy weights</li>
                <li>Stay hydrated throughout your session</li>
                <li>Rest the recommended time between sets</li>
                <li>Cool down and stretch after completing</li>
              </ul>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={() => handleStartWorkout(selectedTemplate)}
            >
              <Play className="mr-2 w-5 h-5" />
              Start This Workout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Workout Templates</h1>
        <p className="text-muted-foreground">
          Choose from {workoutTemplates.length} pre-made workout programs designed for your goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutTemplates.map((template) => (
          <Card
            key={template.id}
            className="hover:shadow-lg transition-all cursor-pointer bg-card border-border hover:border-primary"
            onClick={() => setSelectedTemplate(template)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-foreground">{template.name}</CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground capitalize">
                    {template.type.replace('-', ' ')}
                  </CardDescription>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{template.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{template.estimatedDuration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{template.exercises.length} exercises</span>
                </div>
              </div>

              <div>
                <p className="text-sm mb-2 text-foreground">Target Muscles:</p>
                <div className="flex flex-wrap gap-1">
                  {template.targetMuscles.slice(0, 3).map((muscle) => (
                    <Badge key={muscle} variant="outline" className="text-xs capitalize">
                      {muscle}
                    </Badge>
                  ))}
                  {template.targetMuscles.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.targetMuscles.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View Details <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {workoutTemplates.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="mb-2 text-foreground">No workout templates found</h3>
            <p className="text-muted-foreground">Create a custom workout to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
