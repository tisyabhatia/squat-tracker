import { useState } from 'react';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WorkoutGeneration } from './components/WorkoutGeneration';
import { WorkoutHistory } from './components/WorkoutHistory';
import { ActiveWorkout } from './components/ActiveWorkout';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { Settings } from './components/Settings';
import { Home, LayoutDashboard, History, Play, Menu, X, Dumbbell, Settings as SettingsIcon, Zap } from 'lucide-react';
import { Button } from './components/ui/button';

type View = 'auth' | 'onboarding' | 'home' | 'dashboard' | 'workout' | 'history' | 'active-workout' | 'exercises' | 'settings' | 'generator';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    // Check if user is authenticated
    const authData = localStorage.getItem('userAuth');
    if (!authData) return 'auth';

    // Check if onboarding is completed
    const onboardingData = localStorage.getItem('userOnboarding');
    return onboardingData ? 'home' : 'onboarding';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Safely get workout stats
  const getWorkoutStats = () => {
    try {
      const stats = localStorage.getItem('workoutStats');
      return stats ? JSON.parse(stats) : { currentStreak: 0, workoutsThisWeek: 0, totalMinutes: 0 };
    } catch {
      return { currentStreak: 0, workoutsThisWeek: 0, totalMinutes: 0 };
    }
  };

  const navigation = [
    { id: 'home' as View, label: 'Home', icon: Home },
    { id: 'active-workout' as View, label: 'Workout', icon: Play },
    { id: 'generator' as View, label: 'Generate', icon: Zap },
    { id: 'exercises' as View, label: 'Exercises', icon: Dumbbell },
    { id: 'history' as View, label: 'History', icon: History },
    { id: 'dashboard' as View, label: 'Progress', icon: LayoutDashboard },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon },
  ];

  const handleCompleteAuth = () => {
    setCurrentView('onboarding');
  };

  const handleCompleteOnboarding = () => {
    setCurrentView('home');
  };

  if (currentView === 'auth') {
    return <Auth onComplete={handleCompleteAuth} />;
  }

  if (currentView === 'onboarding') {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">checkpoint</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? 'default' : 'ghost'}
                    onClick={() => setCurrentView(item.id)}
                    size="sm"
                  >
                    <Icon className="w-4 h-4 md:mr-2" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="grid grid-cols-2 gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? 'default' : 'ghost'}
                      onClick={() => {
                        setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground">Ready to reach today's checkpoint?</p>
            </div>

            {/* Streak Card */}
            <div className="bg-gradient-to-br from-[#F2C4DE] to-[#AED8F2] rounded-lg p-6 text-[#2a2438]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75 mb-1">Current Streak</p>
                  <p className="text-4xl font-bold">{getWorkoutStats().currentStreak} days</p>
                </div>
                <div className="text-6xl">🔥</div>
              </div>
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setCurrentView('active-workout')}
                className="p-8 bg-card rounded-lg border-2 border-primary hover:border-primary hover:shadow-lg cursor-pointer transition-all hover:scale-105"
              >
                <Play className="w-16 h-16 text-primary mb-4" />
                <h3 className="mb-2 text-foreground text-xl">Start Workout</h3>
                <p className="text-sm text-muted-foreground">
                  Begin your workout session and track your progress
                </p>
              </div>

              <div
                onClick={() => setCurrentView('dashboard')}
                className="p-8 bg-card rounded-lg border-2 border-border hover:border-primary hover:shadow-lg cursor-pointer transition-all hover:scale-105"
              >
                <LayoutDashboard className="w-16 h-16 text-secondary mb-4" />
                <h3 className="mb-2 text-foreground text-xl">View Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Check your stats, achievements, and goals
                </p>
              </div>
            </div>

            {/* Today's Workout Card */}
            <div className="bg-card border-2 border-border rounded-lg p-6">
              <h3 className="text-foreground mb-4">Today's Workout</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground">Full Body Strength</span>
                  <Button
                    size="sm"
                    onClick={() => setCurrentView('active-workout')}
                    className="bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2] hover:opacity-90 text-[#2a2438]"
                  >
                    Start
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'generator' && <WorkoutGeneration />}
        {currentView === 'history' && <WorkoutHistory />}
        {currentView === 'active-workout' && <ActiveWorkout />}
        {currentView === 'exercises' && <ExerciseLibrary />}
        {currentView === 'settings' && <Settings />}
      </main>
    </div>
  );
}
