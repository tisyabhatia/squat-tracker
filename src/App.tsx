import { useState } from 'react';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WorkoutGeneration } from './components/WorkoutGeneration';
import { FormCheck } from './components/FormCheck';
import { RecoveryTracking } from './components/RecoveryTracking';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { WorkoutHistory } from './components/WorkoutHistory';
import { PersonalRecords } from './components/PersonalRecords';
import { ActiveWorkout } from './components/ActiveWorkout';
import { Home, LayoutDashboard, Sparkles, Camera, Heart, Menu, X, BookOpen, History, Trophy, Play } from 'lucide-react';
import { Button } from './components/ui/button';

type View = 'auth' | 'onboarding' | 'home' | 'dashboard' | 'workout' | 'form-check' | 'recovery' | 'exercise-library' | 'history' | 'records' | 'active-workout';

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

  const navigation = [
    { id: 'home' as View, label: 'Home', icon: Home },
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workout' as View, label: 'Workouts', icon: Sparkles },
    { id: 'active-workout' as View, label: 'Active', icon: Play },
    { id: 'form-check' as View, label: 'Form Check', icon: Camera },
    { id: 'recovery' as View, label: 'Recovery', icon: Heart },
    { id: 'exercise-library' as View, label: 'Exercises', icon: BookOpen },
    { id: 'history' as View, label: 'History', icon: History },
    { id: 'records' as View, label: 'Records', icon: Trophy },
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">✓</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">checkpoint</h1>
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
              <p className="text-muted-foreground">Ready to crush your fitness goals today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => setCurrentView('active-workout')}
                className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              >
                <Play className="w-12 h-12 mb-4" />
                <h3 className="mb-2">Start Workout</h3>
                <p className="text-sm text-purple-100">
                  Begin tracking your current workout session
                </p>
              </div>

              <div
                onClick={() => setCurrentView('workout')}
                className="p-6 bg-card rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles className="w-12 h-12 text-primary mb-4" />
                <h3 className="mb-2 text-foreground">Generate Workout</h3>
                <p className="text-sm text-muted-foreground">
                  Create a custom workout based on your goals
                </p>
              </div>

              <div
                onClick={() => setCurrentView('form-check')}
                className="p-6 bg-card rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-105"
              >
                <Camera className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="mb-2 text-foreground">Check Your Form</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a video for AI-powered form analysis
                </p>
              </div>

              <div
                onClick={() => setCurrentView('recovery')}
                className="p-6 bg-card rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-105"
              >
                <Heart className="w-12 h-12 text-red-400 mb-4" />
                <h3 className="mb-2 text-foreground">Track Recovery</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your recovery and adjust workouts
                </p>
              </div>

              <div
                onClick={() => setCurrentView('dashboard')}
                className="p-6 bg-card rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-105"
              >
                <LayoutDashboard className="w-12 h-12 text-primary mb-4" />
                <h3 className="mb-2 text-foreground">View Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See your stats, achievements, and trends
                </p>
              </div>

              <div
                onClick={() => setCurrentView('records')}
                className="p-6 bg-card rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-105"
              >
                <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
                <h3 className="mb-2 text-foreground">Personal Records</h3>
                <p className="text-sm text-muted-foreground">
                  Track your PRs and celebrate milestones
                </p>
              </div>

              <div
                onClick={() => setCurrentView('exercise-library')}
                className="p-6 bg-card rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-105"
              >
                <BookOpen className="w-12 h-12 text-primary mb-4" />
                <h3 className="mb-2 text-foreground">Exercise Library</h3>
                <p className="text-sm text-muted-foreground">
                  Browse exercises with detailed instructions
                </p>
              </div>

              <div
                onClick={() => setCurrentView('history')}
                className="p-6 bg-card rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-105"
              >
                <History className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="mb-2 text-foreground">Workout History</h3>
                <p className="text-sm text-muted-foreground">
                  Review your past workout sessions
                </p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'workout' && <WorkoutGeneration />}
        {currentView === 'form-check' && <FormCheck />}
        {currentView === 'recovery' && <RecoveryTracking />}
        {currentView === 'exercise-library' && <ExerciseLibrary />}
        {currentView === 'history' && <WorkoutHistory />}
        {currentView === 'records' && <PersonalRecords />}
        {currentView === 'active-workout' && <ActiveWorkout />}
      </main>
    </div>
  );
}
