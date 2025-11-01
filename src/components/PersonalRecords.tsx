import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trophy, TrendingUp, Calendar, Award } from 'lucide-react';

export function PersonalRecords() {
  const records = [
    {
      exercise: 'Squat',
      weight: 315,
      unit: 'lbs',
      reps: 5,
      date: '2025-10-28',
      improvement: '+15 lbs from last month',
      category: 'Strength'
    },
    {
      exercise: 'Bench Press',
      weight: 225,
      unit: 'lbs',
      reps: 6,
      date: '2025-10-30',
      improvement: '+10 lbs from last month',
      category: 'Strength'
    },
    {
      exercise: 'Deadlift',
      weight: 405,
      unit: 'lbs',
      reps: 3,
      date: '2025-10-26',
      improvement: '+20 lbs from last month',
      category: 'Strength'
    },
    {
      exercise: 'Pull-ups',
      weight: 0,
      unit: 'reps',
      reps: 18,
      date: '2025-10-29',
      improvement: '+3 reps from last month',
      category: 'Bodyweight'
    },
    {
      exercise: '5K Run',
      weight: 0,
      unit: 'time',
      reps: 0,
      time: '22:45',
      date: '2025-10-25',
      improvement: '-45 seconds from last month',
      category: 'Cardio'
    },
    {
      exercise: 'Plank Hold',
      weight: 0,
      unit: 'time',
      reps: 0,
      time: '4:30',
      date: '2025-10-27',
      improvement: '+30 seconds from last month',
      category: 'Core'
    }
  ];

  const milestones = [
    {
      title: '1000 lb Club',
      description: 'Combined total of Squat, Bench, and Deadlift',
      current: 945,
      goal: 1000,
      achieved: false
    },
    {
      title: 'Bodyweight Bench',
      description: 'Bench press your bodyweight',
      current: 225,
      goal: 185,
      achieved: true
    },
    {
      title: '2x Bodyweight Squat',
      description: 'Squat twice your bodyweight',
      current: 315,
      goal: 370,
      achieved: false
    },
    {
      title: '20 Pull-ups',
      description: 'Perform 20 consecutive pull-ups',
      current: 18,
      goal: 20,
      achieved: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Personal Records</h1>
        <p className="text-gray-600">
          Track your best lifts and celebrate your achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Your PRs
              </CardTitle>
              <CardDescription>Your personal best performances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.map((record, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="mb-1">{record.exercise}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge variant="outline">{record.category}</Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      {record.unit === 'lbs' && (
                        <div className="text-3xl font-bold text-blue-600">
                          {record.weight} lbs
                          {record.reps > 1 && <span className="text-lg ml-2">x {record.reps}</span>}
                        </div>
                      )}
                      {record.unit === 'reps' && (
                        <div className="text-3xl font-bold text-blue-600">
                          {record.reps} reps
                        </div>
                      )}
                      {record.unit === 'time' && (
                        <div className="text-3xl font-bold text-blue-600">
                          {record.time}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{record.improvement}</span>
                    </div>
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
                <Award className="w-5 h-5 text-purple-600" />
                Milestones
              </CardTitle>
              <CardDescription>Goals to work towards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    milestone.achieved
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    {milestone.achieved && (
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>

                  {milestone.achieved ? (
                    <Badge variant="default" className="bg-green-600">
                      Achieved!
                    </Badge>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round((milestone.current / milestone.goal) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${Math.min((milestone.current / milestone.goal) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {milestone.goal - milestone.current} to go
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-10 h-10" />
                <div>
                  <h3 className="mb-1">Next Milestone</h3>
                  <p className="text-purple-100 text-sm">
                    You're only 2 pull-ups away from hitting 20!
                  </p>
                </div>
              </div>
              <Button variant="secondary" className="w-full">
                View All Milestones
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent PRs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Bench Press</span>
                  <span className="text-green-600">+10 lbs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Squat</span>
                  <span className="text-green-600">+15 lbs</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Deadlift</span>
                  <span className="text-green-600">+20 lbs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
