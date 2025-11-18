import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Exercise,
  WorkoutTemplate,
  WorkoutSession,
  AppSettings,
  UserProfile,
} from '../types';
import {
  exerciseStorage,
  templateStorage,
  workoutSessionStorage,
  settingsStorage,
  userProfileStorage,
  activeWorkoutStorage,
  goalStorage,
  personalRecordStorage,
} from '../utils/storage';
import { initializeSeedData } from '../data/seedData';
import {
  firestoreUserProfile,
  firestoreWorkouts,
  firestoreGoals,
  firestorePersonalRecords,
  firestoreBatch,
  hasFirestoreData,
} from '../services/firestore';
import { auth } from '../config/firebase';

interface AppContextType {
  // Exercises
  exercises: Exercise[];
  getExerciseById: (id: string) => Exercise | undefined;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;

  // Workout Templates
  workoutTemplates: WorkoutTemplate[];
  getTemplateById: (id: string) => WorkoutTemplate | undefined;
  addTemplate: (template: WorkoutTemplate) => void;
  updateTemplate: (id: string, updates: Partial<WorkoutTemplate>) => void;
  deleteTemplate: (id: string) => void;

  // Workout Sessions
  workoutSessions: WorkoutSession[];
  getSessionById: (id: string) => WorkoutSession | undefined;
  addWorkoutSession: (session: WorkoutSession) => void;
  updateWorkoutSession: (id: string, updates: Partial<WorkoutSession>) => void;
  deleteWorkoutSession: (id: string) => void;

  // Active Workout
  activeWorkout: WorkoutSession | null;
  setActiveWorkout: (workout: WorkoutSession | null) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // User Profile
  userProfile: UserProfile | null;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Refresh data
  refreshData: () => void;

  // Firestore sync
  isSyncing: boolean;
  syncToFirestore: () => Promise<void>;
  loadFromFirestore: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [activeWorkout, setActiveWorkoutState] = useState<WorkoutSession | null>(null);
  const [settings, setSettings] = useState<AppSettings>(settingsStorage.get());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    initializeSeedData();
    loadData();

    // Try to load from Firestore if user is authenticated
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await loadFromFirestore();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = () => {
    setExercises(exerciseStorage.getAll());
    setWorkoutTemplates(templateStorage.getAll());
    setWorkoutSessions(workoutSessionStorage.getAll());
    setActiveWorkoutState(activeWorkoutStorage.get());
    setSettings(settingsStorage.get());
    setUserProfile(userProfileStorage.get());
  };

  const refreshData = () => {
    loadData();
  };

  // Firestore sync methods
  const syncToFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user logged in, skipping Firestore sync');
      return;
    }

    setIsSyncing(true);
    try {
      // Sync all data to Firestore
      await firestoreBatch.syncAllData(user.uid, {
        profile: userProfile || undefined,
        workouts: workoutSessions,
        goals: goalStorage.getAll(),
        personalRecords: personalRecordStorage.getAll(),
      });
      console.log('Successfully synced to Firestore');
    } catch (error) {
      console.error('Error syncing to Firestore:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const loadFromFirestore = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user logged in, skipping Firestore load');
      return;
    }

    setIsSyncing(true);
    try {
      // Check if user has data in Firestore
      const hasData = await hasFirestoreData(user.uid);

      if (hasData) {
        // Load profile
        const profile = await firestoreUserProfile.get(user.uid);
        if (profile) {
          userProfileStorage.set(profile);
          setUserProfile(profile);
        }

        // Load workouts
        const workouts = await firestoreWorkouts.getAll(user.uid);
        if (workouts.length > 0) {
          workouts.forEach(workout => workoutSessionStorage.add(workout));
          setWorkoutSessions(workouts);
        }

        // Load goals
        const goals = await firestoreGoals.getAll(user.uid);
        if (goals.length > 0) {
          goals.forEach(goal => goalStorage.add(goal));
        }

        // Load personal records
        const records = await firestorePersonalRecords.getAll(user.uid);
        if (records.length > 0) {
          records.forEach(record => personalRecordStorage.add(record));
        }

        console.log('Successfully loaded data from Firestore');
      } else {
        // No data in Firestore, sync local data if it exists
        const localProfile = userProfileStorage.get();
        if (localProfile) {
          console.log('Migrating local data to Firestore...');
          await syncToFirestore();
        }
      }
    } catch (error) {
      console.error('Error loading from Firestore:', error);
      // Fall back to local storage
      loadData();
    } finally {
      setIsSyncing(false);
    }
  };

  // Exercise methods
  const getExerciseById = (id: string) => exercises.find((e) => e.id === id);

  const addExercise = (exercise: Exercise) => {
    exerciseStorage.add(exercise);
    setExercises([...exercises, exercise]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    exerciseStorage.update(id, updates);
    setExercises(exercises.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExercise = (id: string) => {
    exerciseStorage.remove(id);
    setExercises(exercises.filter((e) => e.id !== id));
  };

  // Template methods
  const getTemplateById = (id: string) => workoutTemplates.find((t) => t.id === id);

  const addTemplate = (template: WorkoutTemplate) => {
    templateStorage.add(template);
    setWorkoutTemplates([...workoutTemplates, template]);
  };

  const updateTemplate = (id: string, updates: Partial<WorkoutTemplate>) => {
    templateStorage.update(id, updates);
    setWorkoutTemplates(workoutTemplates.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTemplate = (id: string) => {
    templateStorage.remove(id);
    setWorkoutTemplates(workoutTemplates.filter((t) => t.id !== id));
  };

  // Workout Session methods
  const getSessionById = (id: string) => workoutSessions.find((s) => s.id === id);

  const addWorkoutSession = async (session: WorkoutSession) => {
    // Save to localStorage
    workoutSessionStorage.add(session);
    setWorkoutSessions([session, ...workoutSessions]);

    // Sync to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await firestoreWorkouts.add(user.uid, session);
      } catch (error) {
        console.error('Error syncing workout to Firestore:', error);
      }
    }
  };

  const updateWorkoutSession = async (id: string, updates: Partial<WorkoutSession>) => {
    // Update localStorage
    workoutSessionStorage.update(id, updates);
    setWorkoutSessions(workoutSessions.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    // Sync to Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await firestoreWorkouts.update(user.uid, id, updates);
      } catch (error) {
        console.error('Error syncing workout update to Firestore:', error);
      }
    }
  };

  const deleteWorkoutSession = async (id: string) => {
    // Remove from localStorage
    workoutSessionStorage.remove(id);
    setWorkoutSessions(workoutSessions.filter((s) => s.id !== id));

    // Delete from Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await firestoreWorkouts.delete(user.uid, id);
      } catch (error) {
        console.error('Error deleting workout from Firestore:', error);
      }
    }
  };

  // Active Workout methods
  const setActiveWorkout = (workout: WorkoutSession | null) => {
    if (workout) {
      activeWorkoutStorage.set(workout);
    } else {
      activeWorkoutStorage.remove();
    }
    setActiveWorkoutState(workout);
  };

  // Settings methods
  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    settingsStorage.set(newSettings);
    setSettings(newSettings);
  };

  // User Profile methods
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (userProfile) {
      const newProfile = { ...userProfile, ...updates };
      // Update localStorage
      userProfileStorage.set(newProfile);
      setUserProfile(newProfile);

      // Sync to Firestore
      const user = auth.currentUser;
      if (user) {
        try {
          await firestoreUserProfile.update(user.uid, updates);
        } catch (error) {
          console.error('Error syncing profile to Firestore:', error);
        }
      }
    }
  };

  const value: AppContextType = {
    exercises,
    getExerciseById,
    addExercise,
    updateExercise,
    deleteExercise,
    workoutTemplates,
    getTemplateById,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    workoutSessions,
    getSessionById,
    addWorkoutSession,
    updateWorkoutSession,
    deleteWorkoutSession,
    activeWorkout,
    setActiveWorkout,
    settings,
    updateSettings,
    userProfile,
    updateUserProfile,
    refreshData,
    isSyncing,
    syncToFirestore,
    loadFromFirestore,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
