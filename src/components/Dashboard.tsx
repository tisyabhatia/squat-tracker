import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Dumbbell, Target, Award, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

export function Dashboard() {
  const { workoutSessions, userProfile } = useApp();
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [workoutStats, setWorkoutStats] = useState({
    workoutsThisWeek: 0,
    totalMinutes: 0,
    currentStreak: 0,
  });
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', workouts: 0, duration: 0 },
    { day: 'Tue', workouts: 0, duration: 0 },
    { day: 'Wed', workouts: 0, duration: 0 },
    { day: 'Thu', workouts: 0, duration: 0 },
    { day: 'Fri', workouts: 0, duration: 0 },
    { day: 'Sat', workouts: 0, duration: 0 },
    { day: 'Sun', workouts: 0, duration: 0 },
  ]);
  const [progressData, setProgressData] = useState([
    { week: 'Week 1', volume: 0, strength: 0 },
    { week: 'Week 2', volume: 0, strength: 0 },
    { week: 'Week 3', volume: 0, strength: 0 },
    { week: 'Week 4', volume: 0, strength: 0 },
  ]);

  useEffect(() => {
    // Load onboarding data
    const data = localStorage.getItem('userOnboarding');
    if (data) {
      setOnboardingData(JSON.parse(data));
    }

    // Use user profile stats if available, otherwise fall back to localStorage
    if (userProfile?.stats) {
      setWorkoutStats({
        workoutsThisWeek: userProfile.stats.workoutsThisWeek || 0,
        totalMinutes: userProfile.stats.averageDuration * userProfile.stats.totalWorkouts || 0,
        currentStreak: userProfile.stats.currentStreak || 0,
      });
    } else {
      // Load workout stats from localStorage (initially empty)
      const stats = localStorage.getItem('workoutStats');
      if (stats) {
        setWorkoutStats(JSON.parse(stats));
      }
    }

    // Use workout sessions from context instead of localStorage
    const history = workoutSessions.filter(w => w.status === 'completed');

    // Calculate weekly data
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weeklyWorkouts = [
      { day: 'Sun', workouts: 0, duration: 0 },
      { day: 'Mon', workouts: 0, duration: 0 },
      { day: 'Tue', workouts: 0, duration: 0 },
      { day: 'Wed', workouts: 0, duration: 0 },
      { day: 'Thu', workouts: 0, duration: 0 },
      { day: 'Fri', workouts: 0, duration: 0 },
      { day: 'Sat', workouts: 0, duration: 0 },
    ];

    history.forEach((workout: any) => {
      const workoutDate = new Date(workout.endTime || workout.completedAt || workout.startTime);
      const daysSinceWeekStart = Math.floor((workoutDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceWeekStart >= 0 && daysSinceWeekStart < 7) {
        weeklyWorkouts[daysSinceWeekStart].workouts += 1;
        weeklyWorkouts[daysSinceWeekStart].duration += Math.floor((workout.duration || 0) / 60);
      }
    });

    setWeeklyData(weeklyWorkouts);

    // Calculate monthly progress (last 4 weeks)
    const fourWeeksAgo = new Date(now);
    fourWeeksAgo.setDate(now.getDate() - 28);

    const weeklyProgress = [
      { week: 'Week 1', volume: 0, strength: 0, count: 0 },
      { week: 'Week 2', volume: 0, strength: 0, count: 0 },
      { week: 'Week 3', volume: 0, strength: 0, count: 0 },
      { week: 'Week 4', volume: 0, strength: 0, count: 0 },
    ];

    history.forEach((workout: any) => {
      const workoutDate = new Date(workout.endTime || workout.completedAt || workout.startTime);
      const daysSinceStart = Math.floor((workoutDate.getTime() - fourWeeksAgo.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceStart >= 0 && daysSinceStart < 28) {
        const weekIndex = Math.floor(daysSinceStart / 7);

        // Calculate total volume and max weight for this workout
        let workoutVolume = 0;
        let maxWeight = 0;

        if (workout.exercises) {
          workout.exercises.forEach((exercise: any) => {
            // Handle both old format (completedSets) and new format (sets array)
            const sets = exercise.sets || exercise.completedSets || [];
            sets.forEach((set: any) => {
              if (set.completed !== false) { // Include if completed is true or undefined
                workoutVolume += (set.weight || 0) * (set.reps || 0);
                maxWeight = Math.max(maxWeight, set.weight || 0);
              }
            });
          });
        }

        weeklyProgress[weekIndex].volume += workoutVolume;
        weeklyProgress[weekIndex].strength = Math.max(weeklyProgress[weekIndex].strength, maxWeight);
        weeklyProgress[weekIndex].count += 1;
      }
    });

    // Average the volume for each week
    const finalProgress = weeklyProgress.map(week => ({
      week: week.week,
      volume: week.count > 0 ? Math.round(week.volume / week.count) : 0,
      strength: week.strength,
    }));

    setProgressData(finalProgress);
  }, [workoutSessions, userProfile]);

  const stats = [
    { label: 'Workouts This Week', value: workoutStats.workoutsThisWeek.toString(), icon: Dumbbell, color: 'text-primary' },
    { label: 'Total Minutes', value: workoutStats.totalMinutes.toString(), icon: Clock, color: 'text-green-400' },
    { label: 'Current Streak', value: `${workoutStats.currentStreak} days`, icon: Target, color: 'text-purple-400' },
  ];

  // Map user's goals from onboarding to progress tracking
  const goalLabels: Record<string, string> = {
    'build-muscle': 'Build Muscle',
    'improve-endurance': 'Improve Endurance',
    'strength': 'Build Strength',
    'stay-active': 'Stay Active',
  };

  const goals = onboardingData?.goals?.map((goalId: string) => ({
    name: goalLabels[goalId] || goalId,
    progress: 0,
    target: 'Start logging workouts to track progress',
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-foreground">Progress Dashboard</h1>
        <p className="text-muted-foreground">Track your fitness journey and achievements</p>
      </div>

      {workoutStats.workoutsThisWeek === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-12 h-12 text-primary" />
              <div>
                <h3 className="mb-1 text-foreground">Start Your Journey</h3>
                <p className="text-muted-foreground">
                  Begin logging workouts to see your progress and statistics here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Activity</CardTitle>
            <CardDescription className="text-muted-foreground">Your workout frequency this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="workouts" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Progress</CardTitle>
            <CardDescription className="text-muted-foreground">Training volume and strength gains</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="volume" stroke="var(--chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="strength" stroke="var(--chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }} />
                <span>Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-2)' }} />
                <span>Strength</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {goals.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-primary" />
              Your Goals
            </CardTitle>
            <CardDescription className="text-muted-foreground">Track your progress toward your fitness goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map((goal: any) => (
              <div key={goal.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">{goal.target}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {workoutStats.workoutsThisWeek > 0 && (
        <Card className="bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2] text-[#2a2438] border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12" />
              <div>
                <h3 className="mb-1 font-bold">Great work!</h3>
                <p className="opacity-90">
                  You've completed {workoutStats.workoutsThisWeek} workout{workoutStats.workoutsThisWeek !== 1 ? 's' : ''} this week. Keep up the momentum!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
