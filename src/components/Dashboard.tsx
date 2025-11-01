import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Flame, Clock, Dumbbell, Target, Award } from 'lucide-react';

export function Dashboard() {
  const weeklyData = [
    { day: 'Mon', workouts: 1, duration: 45 },
    { day: 'Tue', workouts: 0, duration: 0 },
    { day: 'Wed', workouts: 1, duration: 60 },
    { day: 'Thu', workouts: 0, duration: 0 },
    { day: 'Fri', workouts: 1, duration: 50 },
    { day: 'Sat', workouts: 1, duration: 75 },
    { day: 'Sun', workouts: 0, duration: 0 },
  ];

  const progressData = [
    { week: 'Week 1', volume: 2500, strength: 65 },
    { week: 'Week 2', volume: 2800, strength: 70 },
    { week: 'Week 3', volume: 3100, strength: 75 },
    { week: 'Week 4', volume: 3400, strength: 80 },
  ];

  const stats = [
    { label: 'Workouts This Week', value: '4', icon: Dumbbell, color: 'text-blue-600' },
    { label: 'Total Minutes', value: '230', icon: Clock, color: 'text-green-600' },
    { label: 'Calories Burned', value: '1,840', icon: Flame, color: 'text-orange-600' },
    { label: 'Current Streak', value: '12 days', icon: Target, color: 'text-purple-600' },
  ];

  const goals = [
    { name: 'Build Muscle', progress: 65, target: 'Complete 16 strength workouts' },
    { name: 'Lose Weight', progress: 45, target: 'Burn 8,000 calories this month' },
    { name: 'Improve Endurance', progress: 80, target: 'Complete 12 cardio sessions' },
  ];

  const achievements = [
    { name: 'First Week Complete', date: 'Oct 25, 2025' },
    { name: '10 Day Streak', date: 'Oct 28, 2025' },
    { name: 'Form Master', date: 'Oct 30, 2025' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Progress Dashboard</h1>
        <p className="text-gray-600">Track your fitness journey and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your workout frequency this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="workouts" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>Training volume and strength gains</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="strength" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span>Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <span>Strength</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Goal Progress
            </CardTitle>
            <CardDescription>Your progress toward fitness goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.name}>
                <div className="flex items-center justify-between mb-2">
                  <span>{goal.name}</span>
                  <span className="text-sm text-gray-600">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-sm text-gray-500 mt-1">{goal.target}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Milestones you've unlocked</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-yellow-900" />
                </div>
                <div className="flex-1">
                  <p>{achievement.name}</p>
                  <p className="text-sm text-gray-600">{achievement.date}</p>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-12 h-12" />
            <div>
              <h3 className="mb-1">You're on fire! 🔥</h3>
              <p className="text-blue-100">
                You've worked out 4 times this week. Keep up the great work to hit your weekly goal!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
