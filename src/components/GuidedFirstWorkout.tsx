import React, { useState } from 'react';
import { Exercise, WorkoutSession, ExerciseLog, SetLog, WorkoutType } from '../types';
import { Dumbbell, Plus, Check, ArrowLeft, AlertCircle, Trophy, Clock } from 'lucide-react';

interface GuidedFirstWorkoutProps {
  exercises: Exercise[];
  onComplete: (session: WorkoutSession) => void;
  onSkip: () => void;
}

const GuidedFirstWorkout: React.FC<GuidedFirstWorkoutProps> = ({ exercises, onComplete, onSkip }) => {
  const [mode, setMode] = useState<'choose' | 'template' | 'custom' | 'custom-build'>('choose');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [session, setSession] = useState<Partial<WorkoutSession>>({
    id: `workout-${Date.now()}`,
    name: 'First Workout',
    type: 'full-body',
    startTime: new Date().toISOString(),
    duration: 0,
    exercises: [],
    status: 'in-progress'
  });
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState({ weight: '', reps: '', rpe: '' });
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-built templates for first workout
  const templates = [
    {
      id: 'full-body-beginner',
      name: 'Full Body - Beginner',
      description: 'Perfect first workout covering all major muscle groups',
      exercises: ['Goblet Squat', 'Push-ups', 'Dumbbell Row', 'Plank'],
      sets: 3,
      reps: '8-10'
    },
    {
      id: 'ppl-push',
      name: 'Push Day',
      description: 'Focus on chest, shoulders, and triceps',
      exercises: ['Barbell Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Tricep Dips'],
      sets: 4,
      reps: '8-10'
    },
    {
      id: 'ppl-pull',
      name: 'Pull Day',
      description: 'Focus on back and biceps',
      exercises: ['Deadlift', 'Pull-ups', 'Barbell Row', 'Dumbbell Bicep Curl'],
      sets: 4,
      reps: '8-10'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const exerciseLogs: ExerciseLog[] = template.exercises.map((exerciseName, idx) => {
      const exercise = exercises.find(e => e.name === exerciseName);
      return {
        exerciseId: exercise?.id || `exercise-${idx}`,
        exerciseName,
        sets: [],
        completed: false
      };
    });

    setSession({
      ...session,
      name: template.name,
      exercises: exerciseLogs
    });
    setSelectedTemplate(templateId);
    setMode('template');
  };

  const handleExerciseSelect = (exerciseName: string) => {
    if (selectedExercises.includes(exerciseName)) {
      // Remove if already selected
      setSelectedExercises(selectedExercises.filter(e => e !== exerciseName));
    } else {
      // Add to selected exercises in order
      setSelectedExercises([...selectedExercises, exerciseName]);
    }
  };

  const handleStartCustomWorkout = () => {
    if (selectedExercises.length === 0) {
      setError('Please select at least one exercise');
      return;
    }

    const exerciseLogs: ExerciseLog[] = selectedExercises.map((exerciseName, idx) => {
      const exercise = exercises.find(e => e.name === exerciseName);
      return {
        exerciseId: exercise?.id || `exercise-${idx}`,
        exerciseName,
        sets: [],
        completed: false
      };
    });

    setSession({
      ...session,
      name: 'Custom Workout',
      exercises: exerciseLogs
    });
    setMode('custom-build');
    setError(null);
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLogSet = () => {
    setError(null);

    const weight = parseFloat(currentSet.weight);
    const reps = parseInt(currentSet.reps);
    const rpe = currentSet.rpe ? parseInt(currentSet.rpe) : undefined;

    if (!weight || weight <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    if (!reps || reps <= 0) {
      setError('Please enter a valid number of reps');
      return;
    }

    const newSet: SetLog = {
      setNumber: (session.exercises![currentExerciseIndex].sets.length || 0) + 1,
      weight,
      reps,
      rpe,
      completed: true,
      timestamp: new Date().toISOString()
    };

    const updatedExercises = [...session.exercises!];
    updatedExercises[currentExerciseIndex].sets.push(newSet);

    setSession({ ...session, exercises: updatedExercises });
    setCurrentSet({ weight: currentSet.weight, reps: '', rpe: '' }); // Keep weight, clear reps
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < session.exercises!.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet({ weight: '', reps: '', rpe: '' });
    }
  };

  const handleFinishWorkout = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);

    // Calculate total volume
    let totalVolume = 0;
    session.exercises?.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.weight && set.reps) {
          totalVolume += set.weight * set.reps;
        }
      });
    });

    const completedSession: WorkoutSession = {
      ...(session as WorkoutSession),
      endTime: new Date().toISOString(),
      duration,
      totalVolume,
      status: 'completed'
    };

    onComplete(completedSession);
  };

  const canFinish = session.exercises && session.exercises.some(ex => ex.sets.length > 0);

  const totalSets = session.exercises?.reduce((sum, ex) => sum + ex.sets.length, 0) || 0;
  const totalReps = session.exercises?.reduce((sum, ex) =>
    sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0), 0
  ) || 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your First Workout</h1>
          <p className="text-muted-foreground">Let's get started on your transformation journey</p>
        </div>

        {/* Choose Mode */}
        {mode === 'choose' && (
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">Choose Your Path</h2>
              <p className="text-muted-foreground">
                Start with a proven template or create your own custom workout
              </p>
            </div>

            {/* Template Options */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Use a Prebuilt Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="p-5 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/10 transition-all text-left"
                  >
                    <div className="text-3xl mb-2">💪</div>
                    <h4 className="font-semibold text-foreground mb-2">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    <div className="text-xs text-muted-foreground">
                      {template.exercises.length} exercises • {template.sets} sets
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Option */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Or Create Custom Workout
              </h3>
              <p className="text-muted-foreground mb-4">
                Choose your own exercises and track them
              </p>
              <button
                onClick={() => setMode('custom')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start Custom Workout
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={onSkip}
                className="text-primary hover:underline"
              >
                Skip to body metrics logging
              </button>
            </div>
          </div>
        )}

        {/* Custom Exercise Selection */}
        {mode === 'custom' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMode('choose')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to options
              </button>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">Build Your Custom Workout</h2>
              <p className="text-muted-foreground mb-4">
                Click on exercises to add them to your workout. They'll be ordered as you select them.
              </p>
              {selectedExercises.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedExercises.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                      <span>{idx + 1}. {name}</span>
                      <button onClick={() => handleExerciseSelect(name)} className="hover:opacity-70">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Search Bar */}
            <div className="bg-card rounded-xl shadow-sm p-4 border border-border">
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Exercise Library */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Exercise Library ({filteredExercises.length} exercises)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredExercises.map((exercise) => {
                  const isSelected = selectedExercises.includes(exercise.name);
                  const position = selectedExercises.indexOf(exercise.name) + 1;
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => handleExerciseSelect(exercise.name)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{exercise.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {exercise.primaryMuscles.join(', ')}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                            {position}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Workout Button */}
            {selectedExercises.length > 0 && (
              <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t border-border">
                <button
                  onClick={handleStartCustomWorkout}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Workout with {selectedExercises.length} Exercise{selectedExercises.length > 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Template Workout Logging */}
        {(mode === 'template' || mode === 'custom-build') && session.exercises && session.exercises.length > 0 && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Exercise {currentExerciseIndex + 1} of {session.exercises.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {totalSets} sets • {totalReps} reps
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((currentExerciseIndex + 1) / session.exercises.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Exercise */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {session.exercises[currentExerciseIndex].exerciseName}
                  </h2>
                  <p className="text-muted-foreground">
                    {session.exercises[currentExerciseIndex].sets.length} sets completed
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Log Set Form */}
              <div className="bg-muted/30 rounded-lg p-5 mb-6">
                <p className="text-sm font-medium text-foreground mb-4">
                  Log Set {session.exercises[currentExerciseIndex].sets.length + 1}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Weight (lbs) <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      step="2.5"
                      value={currentSet.weight}
                      onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="135"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      Reps <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      value={currentSet.reps}
                      onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      RPE (optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={currentSet.rpe}
                      onChange={(e) => setCurrentSet({ ...currentSet, rpe: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-input-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="7"
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogSet}
                  className="mt-4 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Log Set
                </button>
              </div>

              {/* Completed Sets */}
              {session.exercises[currentExerciseIndex].sets.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">Completed Sets</p>
                  {session.exercises[currentExerciseIndex].sets.map((set, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-accent/20 border border-accent/30 rounded-lg"
                    >
                      <span className="text-sm text-foreground">Set {set.setNumber}</span>
                      <span className="font-medium text-foreground">
                        {set.weight} lbs × {set.reps} reps
                        {set.rpe && <span className="text-muted-foreground ml-2">RPE: {set.rpe}</span>}
                      </span>
                      <Check className="w-5 h-5 text-accent" />
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                {currentExerciseIndex < session.exercises.length - 1 ? (
                  <button
                    onClick={handleNextExercise}
                    disabled={session.exercises[currentExerciseIndex].sets.length === 0}
                    className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Exercise →
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={handleFinishWorkout}
                  disabled={!canFinish}
                  className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Finish Workout
                </button>
              </div>
            </div>

            {/* Workout Summary */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Workout Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sets</p>
                  <p className="text-2xl font-bold text-foreground">{totalSets}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reps</p>
                  <p className="text-2xl font-bold text-foreground">{totalReps}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.floor((Date.now() - startTime) / 60000)}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidedFirstWorkout;
