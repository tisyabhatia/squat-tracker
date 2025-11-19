import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import FirstTimeExperience from './components/FirstTimeExperience';
import { Dashboard } from './components/Dashboard';
import { WorkoutGeneration } from './components/WorkoutGeneration';
import { WorkoutHistory } from './components/WorkoutHistory';
import { ActiveWorkout } from './components/ActiveWorkout';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { Settings } from './components/Settings';
import { SyncStatus } from './components/SyncStatus';
import { Home, LayoutDashboard, History, Play, Menu, X, Dumbbell, Settings as SettingsIcon, Zap, LogOut, Trophy, TrendingUp } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { initializeDemoMode, isDemoMode, clearDemoMode } from './utils/demoData';
import { userProfileStorage, workoutSessionStorage } from './utils/storage';
import { UserProfile, WorkoutSession } from './types';
import { exerciseStorage } from './utils/storage';
import { firestoreUserProfile, firestoreWorkouts } from './services/firestore';
import { auth } from './config/firebase';
import { useFirestoreSync } from './hooks/useFirestoreSync';

type View = 'welcome' | 'first-time-experience' | 'day-1-celebration' | 'home' | 'dashboard' | 'history' | 'active-workout' | 'exercises' | 'settings' | 'generator';

export default function App() {
  // Enable Firestore real-time sync
  const { syncStatus, lastSyncTime } = useFirestoreSync();

  // Clear old auth/onboarding data on mount if no profile exists
  const checkAndCleanOldData = () => {
    const profile = userProfileStorage.get();
    if (!profile && !isDemoMode()) {
      // Clear old auth and onboarding data from previous version
      localStorage.removeItem('userAuth');
      localStorage.removeItem('userOnboarding');
    }
  };

  const [currentView, setCurrentView] = useState<View>(() => {
    checkAndCleanOldData();
    // Start with welcome, but we'll check auth in useEffect
    return 'welcome';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(isDemoMode());
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, check if they have a profile
        const profile = userProfileStorage.get();
        if (profile) {
          // User is logged in with profile, go to home
          setCurrentView('home');
        }
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Safely get workout stats
  const getWorkoutStats = () => {
    try {
      const stats = localStorage.getItem('workoutStats');
      return stats ? JSON.parse(stats) : { currentStreak: 0, workoutsThisWeek: 0, totalMinutes: 0 };
    } catch {
      return { currentStreak: 0, workoutsThisWeek: 0, totalMinutes: 0 };
    }
  };

  const getUserProfile = () => {
    return userProfileStorage.get();
  };

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { id: 'home' as View, label: 'Home', icon: Home },
    { id: 'exercises' as View, label: 'Exercises', icon: Dumbbell },
    { id: 'history' as View, label: 'History', icon: History },
    { id: 'dashboard' as View, label: 'Progress', icon: LayoutDashboard },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon },
  ];

  const handleStartFresh = () => {
    clearDemoMode();
    setShowDemoBanner(false);
    setCurrentView('first-time-experience');
  };

  const handleFirstTimeExperienceComplete = async (profile: UserProfile, firstWorkout?: WorkoutSession) => {
    // Save profile to localStorage
    userProfileStorage.set(profile);

    // Sync profile to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await firestoreUserProfile.set(user.uid, profile);
        console.log('Profile synced to Firestore');
      } catch (error) {
        console.error('Error syncing profile to Firestore:', error);
      }
    }

    // Save first workout if provided
    if (firstWorkout) {
      workoutSessionStorage.add(firstWorkout);

      // Sync first workout to Firestore
      if (user) {
        try {
          await firestoreWorkouts.add(user.uid, firstWorkout);
          console.log('First workout synced to Firestore');
        } catch (error) {
          console.error('Error syncing first workout to Firestore:', error);
        }
      }

      // Show Day 1 celebration
      setCurrentView('day-1-celebration');
    } else {
      // Go straight to home
      setCurrentView('home');
    }
  };

  const handleExitDemo = () => {
    if (confirm('Exit demo mode? All demo data will be cleared.')) {
      handleStartFresh();
    }
  };

  // Welcome screen
  if (currentView === 'welcome') {
    return <WelcomeScreen onStartFresh={handleStartFresh} onTryDemo={handleTryDemo} />;
  }

  // First Time Experience (Auth + Onboarding + First Action)
  if (currentView === 'first-time-experience') {
    const exercises = exerciseStorage.getAll();
    return (
      <FirstTimeExperience
        exercises={exercises}
        onComplete={handleFirstTimeExperienceComplete}
      />
    );
  }

  // Day 1 Celebration
  if (currentView === 'day-1-celebration') {
    const profile = getUserProfile();
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-card border-2 border-border rounded-2xl shadow-lg p-12 space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Trophy className="w-12 h-12 text-[#2a2438]" />
            </div>

            <h1 className="text-4xl font-bold text-foreground">
              🎉 Workout Saved!
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              You've started your transformation.
            </p>

            <div className="bg-accent/20 border border-accent/30 rounded-lg p-6 my-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Day 1 Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-bold text-primary">{profile?.stats.totalWorkouts || 1}</p>
                  <p className="text-sm text-muted-foreground">Workout</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">
                    {((profile?.stats.totalVolume || 0) / 1000).toFixed(1)}k
                  </p>
                  <p className="text-sm text-muted-foreground">Volume (lbs)</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{profile?.stats.currentStreak || 1}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <p className="text-foreground italic">
                "Consistency builds muscle. You've taken the first step."
              </p>
            </div>

            <button
              onClick={() => setCurrentView('home')}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#F2C4DE] to-[#AED8F2] text-[#2a2438] rounded-lg hover:opacity-90 transition-all font-semibold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              Continue to Dashboard
              <TrendingUp className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profile = getUserProfile();

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      {showDemoBanner && (
        <div className="bg-accent/20 border-b border-accent/30 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Demo Mode</Badge>
              <span className="text-sm text-foreground">
                Exploring as {profile?.name || 'Demo User'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleExitDemo}>
              <LogOut className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">checkpoint</h1>
              <SyncStatus status={syncStatus} lastSyncTime={lastSyncTime} className="hidden sm:flex" />
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                    auth.signOut();
                    window.location.reload();
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden lg:inline">Sign Out</span>
              </Button>
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
            <nav className="md:hidden py-4 border-t border-border">
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
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (confirm('Are you sure you want to sign out?')) {
                      auth.signOut();
                      window.location.reload();
                    }
                  }}
                  className="justify-start col-span-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
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
              <h1 className="mb-2 text-foreground">Welcome back{profile?.name ? `, ${profile.name}` : ''}!</h1>
              <p className="text-muted-foreground">Ready to reach today's checkpoint?</p>
            </div>

            {/* Streak Card */}
            <div className="bg-gradient-to-br from-[#F2C4DE] to-[#AED8F2] rounded-lg p-6 text-[#2a2438]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75 mb-1">Current Streak</p>
                  <p className="text-4xl font-bold">{profile?.stats.currentStreak || getWorkoutStats().currentStreak} days</p>
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
                onClick={() => setCurrentView('exercises')}
                className="p-8 bg-card rounded-lg border-2 border-border hover:border-primary hover:shadow-lg cursor-pointer transition-all hover:scale-105"
              >
                <Dumbbell className="w-16 h-16 text-secondary mb-4" />
                <h3 className="mb-2 text-foreground text-xl">Browse Exercises</h3>
                <p className="text-sm text-muted-foreground">
                  View exercise library and generate custom workouts
                </p>
              </div>
            </div>


            {/* Goals Section */}
            {profile?.goals && profile.goals.length > 0 && (
              <div className="bg-card border-2 border-border rounded-lg p-6">
                <h3 className="text-foreground mb-4">Your Goals</h3>
                <div className="space-y-3">
                  {profile.goals.slice(0, 3).map((goal: any) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="text-foreground font-medium">{goal.description}</p>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            {profile && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{profile.stats.totalWorkouts}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{profile.stats.workoutsThisWeek}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{(profile.stats.totalVolume / 1000).toFixed(0)}k</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{profile.stats.averageDuration}min</p>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'generator' && <WorkoutGeneration onStartWorkout={() => setCurrentView('active-workout')} />}
        {currentView === 'history' && <WorkoutHistory />}
        {currentView === 'active-workout' && <ActiveWorkout onBack={() => setCurrentView('home')} />}
        {currentView === 'exercises' && <ExerciseLibrary />}
        {currentView === 'settings' && <Settings />}
      </main>
    </div>
  );
}
