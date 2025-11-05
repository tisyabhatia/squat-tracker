import React, { useState } from 'react';
import Authentication from './Authentication';
import ComprehensiveOnboarding from './ComprehensiveOnboarding';
import GuidedFirstWorkout from './GuidedFirstWorkout';
import BodyMeasurements from './BodyMeasurements';
import { OnboardingData, WorkoutSession, UserProfile } from '../types';
import { Dumbbell, Ruler, TrendingUp } from 'lucide-react';

interface FirstTimeExperienceProps {
  exercises: any[];
  onComplete: (profile: UserProfile, firstWorkout?: WorkoutSession) => void;
}

type FlowStep = 'auth' | 'onboarding' | 'first-action-choice' | 'first-workout' | 'first-body-metrics' | 'complete';

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
        firstBodyMetricsLogged: false,
      };

      onComplete(profile, session);
    }
  };

  const handleSkipToBodyMetrics = () => {
    setCurrentStep('first-body-metrics');
  };

  const handleBodyMetricsBack = () => {
    setCurrentStep('first-action-choice');
  };

  const handleSkipBodyMetrics = () => {
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
        firstBodyMetricsLogged: false,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ready to Start Tracking Your Progress?
            </h1>
            <p className="text-lg text-gray-600">
              Choose how you'd like to begin your transformation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Workout */}
            <button
              onClick={() => setCurrentStep('first-workout')}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-600 text-left group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <Dumbbell className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Log Your First Workout
              </h3>
              <p className="text-gray-600 mb-4">
                Start tracking your lifts and begin building your training history. We'll guide you through it step by step.
              </p>
              <div className="text-blue-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center">
                Start workout tracking →
              </div>
            </button>

            {/* Log Body Metrics */}
            <button
              onClick={() => setCurrentStep('first-body-metrics')}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-600 text-left group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <Ruler className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Log Starting Measurements
              </h3>
              <p className="text-gray-600 mb-4">
                Record your body measurements and photos to track your physical transformation over time.
              </p>
              <div className="text-green-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center">
                Log body metrics →
              </div>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleSkipBodyMetrics}
              className="text-gray-600 hover:text-gray-900 transition-colors"
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
        onSkip={handleSkipToBodyMetrics}
      />
    );
  }

  if (currentStep === 'first-body-metrics') {
    return <BodyMeasurements onBack={handleBodyMetricsBack} />;
  }

  return null;
};

export default FirstTimeExperience;
