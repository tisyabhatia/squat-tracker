import React, { useState } from 'react';
import Authentication from './Authentication';
import ComprehensiveOnboarding from './ComprehensiveOnboarding';
import GuidedFirstWorkout from './GuidedFirstWorkout';
import { OnboardingData, WorkoutSession, UserProfile } from '../types';
import { Dumbbell, TrendingUp } from 'lucide-react';

interface FirstTimeExperienceProps {
  exercises: any[];
  onComplete: (profile: UserProfile, firstWorkout?: WorkoutSession) => void;
}

type FlowStep = 'auth' | 'onboarding' | 'first-action-choice' | 'first-workout' | 'complete';

const FirstTimeExperience: React.FC<FirstTimeExperienceProps> = ({ exercises, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('auth');
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [firstWorkout, setFirstWorkout] = useState<WorkoutSession | null>(null);

  const handleAuthSuccess = (userEmail: string, uid: string) => {
    setEmail(userEmail);
    setUserId(uid);
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setCurrentStep('first-action-choice');
  };

  const handleFirstWorkoutComplete = (session: WorkoutSession) => {
    setFirstWorkout(session);

    // Create user profile
    if (onboardingData) {
      const profile: UserProfile = {
        id: userId,
        name: onboardingData.name,
        email: onboardingData.email,
        age: onboardingData.age,
        height: onboardingData.height,
        weight: onboardingData.weight,
        gender: onboardingData.gender,
        fitnessLevel: onboardingData.fitnessLevel,
        trainingSplit: onboardingData.trainingSplit || 'fullbody',
        weeklyFrequency: onboardingData.weeklyFrequency || 3,
        equipment: onboardingData.availableEquipment || [],
        primaryGoal: onboardingData.primaryGoal,
        targetWeight: onboardingData.targetWeight,
        targetBodyFat: onboardingData.targetBodyFat,
        goals: [],
        preferences: {
          defaultRestTime: 90,
          unitSystem: 'imperial',
          theme: 'system',
          notifications: {
            workoutReminders: true,
            achievements: true,
            streakReminders: true,
          },
        },
        stats: {
          totalWorkouts: 1,
          currentStreak: 1,
          longestStreak: 1,
          workoutsThisWeek: 1,
          totalVolume: session.totalVolume || 0,
          averageDuration: Math.floor(session.duration / 60),
        },
        isDemo: false,
        createdAt: new Date().toISOString(),
        firstWorkoutCompleted: true,
      };

      onComplete(profile, session);
    }
  };

  const handleSkipToHome = () => {
    // Complete without body metrics
    if (onboardingData) {
      const profile: UserProfile = {
        id: userId,
        name: onboardingData.name,
        email: onboardingData.email,
        age: onboardingData.age,
        height: onboardingData.height,
        weight: onboardingData.weight,
        gender: onboardingData.gender,
        fitnessLevel: onboardingData.fitnessLevel,
        trainingSplit: onboardingData.trainingSplit || 'fullbody',
        weeklyFrequency: onboardingData.weeklyFrequency || 3,
        equipment: onboardingData.availableEquipment || [],
        primaryGoal: onboardingData.primaryGoal,
        targetWeight: onboardingData.targetWeight,
        targetBodyFat: onboardingData.targetBodyFat,
        goals: [],
        preferences: {
          defaultRestTime: 90,
          unitSystem: 'imperial',
          theme: 'system',
          notifications: {
            workoutReminders: true,
            achievements: true,
            streakReminders: true,
          },
        },
        stats: {
          totalWorkouts: 0,
          currentStreak: 0,
          longestStreak: 0,
          workoutsThisWeek: 0,
          totalVolume: 0,
          averageDuration: 0,
        },
        isDemo: false,
        createdAt: new Date().toISOString(),
        firstWorkoutCompleted: false,
      };

      onComplete(profile);
    }
  };

  // Render based on current step
  if (currentStep === 'auth') {
    return <Authentication onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentStep === 'onboarding') {
    return (
      <ComprehensiveOnboarding
        email={email}
        userId={userId}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (currentStep === 'first-action-choice') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Ready to Start Tracking Your Progress?
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose how you'd like to begin your transformation journey
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-full max-w-lg">
              {/* Start Workout */}
              <button
                onClick={() => setCurrentStep('first-workout')}
                className="w-full p-8 bg-card rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-border hover:border-primary text-center group"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors mx-auto">
                  <Dumbbell className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Log Your First Workout
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your lifts and begin building your training history. We'll guide you through it step by step.
                </p>
                <div className="text-primary font-medium group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Start workout tracking →
                </div>
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSkipToHome}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now, I'll do this later
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'first-workout') {
    return (
      <GuidedFirstWorkout
        exercises={exercises}
        onComplete={handleFirstWorkoutComplete}
        onSkip={handleSkipToHome}
      />
    );
  }

  return null;
};

export default FirstTimeExperience;
