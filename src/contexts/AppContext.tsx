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
} from '../utils/storage';
import { initializeSeedData } from '../data/seedData';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [activeWorkout, setActiveWorkoutState] = useState<WorkoutSession | null>(null);
  const [settings, setSettings] = useState<AppSettings>(settingsStorage.get());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Initialize data on mount
  useEffect(() => {
    initializeSeedData();
    loadData();
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

  const addWorkoutSession = (session: WorkoutSession) => {
    workoutSessionStorage.add(session);
    setWorkoutSessions([session, ...workoutSessions]);
  };

  const updateWorkoutSession = (id: string, updates: Partial<WorkoutSession>) => {
    workoutSessionStorage.update(id, updates);
    setWorkoutSessions(workoutSessions.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteWorkoutSession = (id: string) => {
    workoutSessionStorage.remove(id);
    setWorkoutSessions(workoutSessions.filter((s) => s.id !== id));
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
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      const newProfile = { ...userProfile, ...updates };
      userProfileStorage.set(newProfile);
      setUserProfile(newProfile);
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
