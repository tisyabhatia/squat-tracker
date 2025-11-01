import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, Dumbbell, TrendingUp, ChevronRight } from 'lucide-react';

export function WorkoutHistory() {
  const workouts = [
    {
      id: 1,
      date: '2025-11-01',
      name: 'Full Body Strength',
      duration: 65,
      exercises: 6,
      totalVolume: 4500,
      calories: 380,
      completed: true,
      notes: 'Great session, felt strong'
    },
    {
      id: 2,
      date: '2025-10-30',
      name: 'Upper Body Push',
      duration: 55,
      exercises: 5,
      totalVolume: 3800,
      calories: 320,
      completed: true,
      notes: 'New PR on bench press!'
    },
    {
      id: 3,
      date: '2025-10-28',
      name: 'Lower Body',
      duration: 70,
      exercises: 6,
      totalVolume: 5200,
      calories: 420,
      completed: true,
      notes: 'Squats felt heavy today'
    },
    {
      id: 4,
      date: '2025-10-26',
      name: 'Upper Body Pull',
      duration: 60,
      exercises: 5,
      totalVolume: 3600,
      calories: 340,
      completed: true,
      notes: ''
    },
    {
      id: 5,
      date: '2025-10-24',
      name: 'Full Body',
      duration: 50,
      exercises: 5,
      totalVolume: 3200,
      calories: 280,
      completed: true,
      notes: 'Short on time but good workout'
    }
  ];

  const stats = {
    totalWorkouts: 24,
    totalMinutes: 1440,
    totalCalories: 8640,
    averageDuration: 60
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Workout History</h1>
        <p className="text-gray-600">
          Review your past workouts and track your consistency
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="mt-2 text-2xl font-bold">{stats.totalWorkouts}</p>
              </div>
              <Dumbbell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Minutes</p>
                <p className="mt-2 text-2xl font-bold">{stats.totalMinutes}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Calories</p>
                <p className="mt-2 text-2xl font-bold">{stats.totalCalories.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="mt-2 text-2xl font-bold">{stats.averageDuration} min</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Workouts
          </CardTitle>
          <CardDescription>Your workout history from most recent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workouts.map(workout => (
              <div
                key={workout.id}
                className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="mb-1">{workout.name}</h3>
                    <p className="text-sm text-gray-600">
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
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{workout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{workout.exercises} exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{workout.totalVolume} lbs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{workout.calories} cal</span>
                  </div>
                </div>

                {workout.notes && (
                  <p className="text-sm text-gray-600 italic mb-3">"{workout.notes}"</p>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4">
            Load More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
