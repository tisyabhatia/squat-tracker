import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, Dumbbell, TrendingUp, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function WorkoutHistory() {
  const { workoutSessions, userProfile } = useApp();

  // Calculate stats from actual workout data
  const stats = {
    totalWorkouts: userProfile?.stats.totalWorkouts || workoutSessions.filter(w => w.status === 'completed').length,
    totalMinutes: Math.round(workoutSessions.filter(w => w.status === 'completed').reduce((sum, w) => sum + (w.duration / 60), 0)),
    totalCalories: workoutSessions.filter(w => w.status === 'completed').reduce((sum, w) => sum + (w.calories || 0), 0),
    averageDuration: workoutSessions.filter(w => w.status === 'completed').length > 0
      ? Math.round(workoutSessions.filter(w => w.status === 'completed').reduce((sum, w) => sum + (w.duration / 60), 0) / workoutSessions.filter(w => w.status === 'completed').length)
      : 0
  };

  // Filter only completed workouts and format for display
  const completedWorkouts = workoutSessions
    .filter(w => w.status === 'completed')
    .map(w => ({
      id: w.id,
      date: new Date(w.startTime).toISOString().split('T')[0],
      name: w.name,
      duration: Math.round(w.duration / 60), // Convert seconds to minutes
      exercises: w.exercises.length,
      totalVolume: w.totalVolume || 0,
      calories: w.calories || 0,
      completed: true,
      notes: w.notes || ''
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Workout History</h1>
        <p className="text-muted-foreground">
          Review your past workouts and track your consistency
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalWorkouts}</p>
              </div>
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Minutes</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalMinutes}</p>
              </div>
              <Clock className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calories</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalCalories.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stats.averageDuration} min</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Workouts
          </CardTitle>
          <CardDescription className="text-muted-foreground">Your workout history from most recent</CardDescription>
        </CardHeader>
        <CardContent>
          {completedWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-foreground mb-2">No workouts yet</p>
              <p className="text-sm text-muted-foreground">Complete your first workout to see it here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedWorkouts.map(workout => (
                <div
                  key={workout.id}
                  className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="mb-1 text-foreground font-semibold">{workout.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge variant={workout.completed ? 'default' : 'secondary'}>
                      {workout.completed ? 'Completed' : 'Incomplete'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{workout.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{workout.exercises} exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{workout.totalVolume.toLocaleString()} lbs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{workout.calories} cal</span>
                    </div>
                  </div>

                  {workout.notes && (
                    <p className="text-sm text-muted-foreground italic mb-3">"{workout.notes}"</p>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      View Details (Coming Soon)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
