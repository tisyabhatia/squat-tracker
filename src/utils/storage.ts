import {
  UserProfile,
  WorkoutTemplate,
  WorkoutSession,
  Exercise,
  ProgressMetrics,
  OnboardingData,
  AppSettings,
  PersonalRecord,
  Goal,
} from '../types';

// Storage Keys
const STORAGE_KEYS = {
  USER_PROFILE: 'checkpoint_user_profile',
  USER_AUTH: 'userAuth',
  ONBOARDING: 'userOnboarding',
  EXERCISES: 'checkpoint_exercises',
  WORKOUT_TEMPLATES: 'checkpoint_workout_templates',
  WORKOUT_HISTORY: 'workoutHistory',
  ACTIVE_WORKOUT: 'checkpoint_active_workout',
  PROGRESS_METRICS: 'checkpoint_progress_metrics',
  PERSONAL_RECORDS: 'checkpoint_personal_records',
  GOALS: 'checkpoint_goals',
  SETTINGS: 'checkpoint_settings',
  WORKOUT_STATS: 'workoutStats',
  FAVORITE_EXERCISES: 'checkpoint_favorite_exercises',
} as const;

// Helper functions for safe localStorage operations
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

// ==================== User Profile ====================

export const userProfileStorage = {
  get: (): UserProfile | null => safeGet<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null),
  set: (profile: UserProfile): boolean => safeSet(STORAGE_KEYS.USER_PROFILE, profile),
  update: (updates: Partial<UserProfile>): boolean => {
    const current = userProfileStorage.get();
    if (!current) return false;
    return safeSet(STORAGE_KEYS.USER_PROFILE, { ...current, ...updates });
  },
  remove: (): void => safeRemove(STORAGE_KEYS.USER_PROFILE),
};

// ==================== Onboarding ====================

export const onboardingStorage = {
  get: (): OnboardingData | null => safeGet<OnboardingData | null>(STORAGE_KEYS.ONBOARDING, null),
  set: (data: OnboardingData): boolean => safeSet(STORAGE_KEYS.ONBOARDING, data),
  remove: (): void => safeRemove(STORAGE_KEYS.ONBOARDING),
};

// ==================== Exercises ====================

export const exerciseStorage = {
  getAll: (): Exercise[] => safeGet<Exercise[]>(STORAGE_KEYS.EXERCISES, []),
  getById: (id: string): Exercise | undefined => {
    const exercises = exerciseStorage.getAll();
    return exercises.find((e) => e.id === id);
  },
  add: (exercise: Exercise): boolean => {
    const exercises = exerciseStorage.getAll();
    exercises.push(exercise);
    return safeSet(STORAGE_KEYS.EXERCISES, exercises);
  },
  update: (id: string, updates: Partial<Exercise>): boolean => {
    const exercises = exerciseStorage.getAll();
    const index = exercises.findIndex((e) => e.id === id);
    if (index === -1) return false;
    exercises[index] = { ...exercises[index], ...updates };
    return safeSet(STORAGE_KEYS.EXERCISES, exercises);
  },
  remove: (id: string): boolean => {
    const exercises = exerciseStorage.getAll().filter((e) => e.id !== id);
    return safeSet(STORAGE_KEYS.EXERCISES, exercises);
  },
  setAll: (exercises: Exercise[]): boolean => safeSet(STORAGE_KEYS.EXERCISES, exercises),
  search: (query: string, category?: string): Exercise[] => {
    const exercises = exerciseStorage.getAll();
    return exercises.filter((exercise) => {
      const matchesQuery =
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.description.toLowerCase().includes(query.toLowerCase()) ||
        exercise.primaryMuscles.some((m) => m.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = !category || category === 'all' || exercise.category === category;
      return matchesQuery && matchesCategory;
    });
  },
};

// ==================== Workout Templates ====================

export const templateStorage = {
  getAll: (): WorkoutTemplate[] => safeGet<WorkoutTemplate[]>(STORAGE_KEYS.WORKOUT_TEMPLATES, []),
  getById: (id: string): WorkoutTemplate | undefined => {
    const templates = templateStorage.getAll();
    return templates.find((t) => t.id === id);
  },
  add: (template: WorkoutTemplate): boolean => {
    const templates = templateStorage.getAll();
    templates.push(template);
    return safeSet(STORAGE_KEYS.WORKOUT_TEMPLATES, templates);
  },
  update: (id: string, updates: Partial<WorkoutTemplate>): boolean => {
    const templates = templateStorage.getAll();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return false;
    templates[index] = { ...templates[index], ...updates };
    return safeSet(STORAGE_KEYS.WORKOUT_TEMPLATES, templates);
  },
  remove: (id: string): boolean => {
    const templates = templateStorage.getAll().filter((t) => t.id !== id);
    return safeSet(STORAGE_KEYS.WORKOUT_TEMPLATES, templates);
  },
  setAll: (templates: WorkoutTemplate[]): boolean => safeSet(STORAGE_KEYS.WORKOUT_TEMPLATES, templates),
};

// ==================== Workout Sessions (History) ====================

export const workoutSessionStorage = {
  getAll: (): WorkoutSession[] => safeGet<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_HISTORY, []),
  getById: (id: string): WorkoutSession | undefined => {
    const sessions = workoutSessionStorage.getAll();
    return sessions.find((s) => s.id === id);
  },
  add: (session: WorkoutSession): boolean => {
    const sessions = workoutSessionStorage.getAll();
    sessions.unshift(session); // Add to beginning for most recent first
    return safeSet(STORAGE_KEYS.WORKOUT_HISTORY, sessions);
  },
  update: (id: string, updates: Partial<WorkoutSession>): boolean => {
    const sessions = workoutSessionStorage.getAll();
    const index = sessions.findIndex((s) => s.id === id);
    if (index === -1) return false;
    sessions[index] = { ...sessions[index], ...updates };
    return safeSet(STORAGE_KEYS.WORKOUT_HISTORY, sessions);
  },
  remove: (id: string): boolean => {
    const sessions = workoutSessionStorage.getAll().filter((s) => s.id !== id);
    return safeSet(STORAGE_KEYS.WORKOUT_HISTORY, sessions);
  },
  getRecent: (limit: number = 5): WorkoutSession[] => {
    return workoutSessionStorage.getAll().slice(0, limit);
  },
  getByDateRange: (startDate: string, endDate: string): WorkoutSession[] => {
    const sessions = workoutSessionStorage.getAll();
    return sessions.filter((s) => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= new Date(startDate) && sessionDate <= new Date(endDate);
    });
  },
  getByType: (type: string): WorkoutSession[] => {
    const sessions = workoutSessionStorage.getAll();
    return sessions.filter((s) => s.type === type);
  },
};

// ==================== Active Workout ====================

export const activeWorkoutStorage = {
  get: (): WorkoutSession | null => safeGet<WorkoutSession | null>(STORAGE_KEYS.ACTIVE_WORKOUT, null),
  set: (session: WorkoutSession): boolean => safeSet(STORAGE_KEYS.ACTIVE_WORKOUT, session),
  remove: (): void => safeRemove(STORAGE_KEYS.ACTIVE_WORKOUT),
  update: (updates: Partial<WorkoutSession>): boolean => {
    const current = activeWorkoutStorage.get();
    if (!current) return false;
    return safeSet(STORAGE_KEYS.ACTIVE_WORKOUT, { ...current, ...updates });
  },
};

// ==================== Progress Metrics ====================

export const progressMetricsStorage = {
  get: (): ProgressMetrics | null => safeGet<ProgressMetrics | null>(STORAGE_KEYS.PROGRESS_METRICS, null),
  set: (metrics: ProgressMetrics): boolean => safeSet(STORAGE_KEYS.PROGRESS_METRICS, metrics),
  update: (updates: Partial<ProgressMetrics>): boolean => {
    const current = progressMetricsStorage.get();
    if (!current) return false;
    return safeSet(STORAGE_KEYS.PROGRESS_METRICS, { ...current, ...updates });
  },
  initialize: (userId: string): boolean => {
    const initial: ProgressMetrics = {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0,
      totalDuration: 0,
      totalVolume: 0,
      totalCalories: 0,
      workoutsThisWeek: 0,
      workoutsThisMonth: 0,
      personalRecords: [],
    };
    return safeSet(STORAGE_KEYS.PROGRESS_METRICS, initial);
  },
};

// ==================== Personal Records ====================

export const personalRecordStorage = {
  getAll: (): PersonalRecord[] => safeGet<PersonalRecord[]>(STORAGE_KEYS.PERSONAL_RECORDS, []),
  add: (record: PersonalRecord): boolean => {
    const records = personalRecordStorage.getAll();
    records.push(record);
    return safeSet(STORAGE_KEYS.PERSONAL_RECORDS, records);
  },
  getByExercise: (exerciseId: string): PersonalRecord[] => {
    const records = personalRecordStorage.getAll();
    return records.filter((r) => r.exerciseId === exerciseId);
  },
};

// ==================== Goals ====================

export const goalStorage = {
  getAll: (): Goal[] => safeGet<Goal[]>(STORAGE_KEYS.GOALS, []),
  add: (goal: Goal): boolean => {
    const goals = goalStorage.getAll();
    goals.push(goal);
    return safeSet(STORAGE_KEYS.GOALS, goals);
  },
  update: (id: string, updates: Partial<Goal>): boolean => {
    const goals = goalStorage.getAll();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return false;
    goals[index] = { ...goals[index], ...updates };
    return safeSet(STORAGE_KEYS.GOALS, goals);
  },
  remove: (id: string): boolean => {
    const goals = goalStorage.getAll().filter((g) => g.id !== id);
    return safeSet(STORAGE_KEYS.GOALS, goals);
  },
  getActive: (): Goal[] => {
    return goalStorage.getAll().filter((g) => !g.completed);
  },
};

// ==================== Settings ====================

export const settingsStorage = {
  get: (): AppSettings => {
    const defaultSettings: AppSettings = {
      theme: 'system',
      unitSystem: 'imperial',
      defaultRestTime: 90,
      notifications: {
        workoutReminders: true,
        achievements: true,
        streakReminders: true,
      },
      sound: {
        enabled: true,
        volume: 0.5,
      },
    };
    return safeGet<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },
  set: (settings: AppSettings): boolean => safeSet(STORAGE_KEYS.SETTINGS, settings),
  update: (updates: Partial<AppSettings>): boolean => {
    const current = settingsStorage.get();
    return safeSet(STORAGE_KEYS.SETTINGS, { ...current, ...updates });
  },
};

// ==================== Workout Stats (Legacy Support) ====================

export const workoutStatsStorage = {
  get: () => safeGet(STORAGE_KEYS.WORKOUT_STATS, {
    workoutsThisWeek: 0,
    totalMinutes: 0,
    currentStreak: 0,
  }),
  set: (stats: any) => safeSet(STORAGE_KEYS.WORKOUT_STATS, stats),
};

// ==================== Favorite Exercises ====================

export const favoriteExerciseStorage = {
  getAll: (): string[] => safeGet<string[]>(STORAGE_KEYS.FAVORITE_EXERCISES, []),
  add: (exerciseId: string): boolean => {
    const favorites = favoriteExerciseStorage.getAll();
    if (!favorites.includes(exerciseId)) {
      favorites.push(exerciseId);
      return safeSet(STORAGE_KEYS.FAVORITE_EXERCISES, favorites);
    }
    return false;
  },
  remove: (exerciseId: string): boolean => {
    const favorites = favoriteExerciseStorage.getAll().filter((id) => id !== exerciseId);
    return safeSet(STORAGE_KEYS.FAVORITE_EXERCISES, favorites);
  },
  toggle: (exerciseId: string): boolean => {
    const favorites = favoriteExerciseStorage.getAll();
    if (favorites.includes(exerciseId)) {
      return favoriteExerciseStorage.remove(exerciseId);
    } else {
      return favoriteExerciseStorage.add(exerciseId);
    }
  },
  isFavorite: (exerciseId: string): boolean => {
    return favoriteExerciseStorage.getAll().includes(exerciseId);
  },
};

// ==================== Data Export/Import ====================

export const dataManagement = {
  exportAll: () => {
    return {
      userProfile: userProfileStorage.get(),
      onboarding: onboardingStorage.get(),
      exercises: exerciseStorage.getAll(),
      templates: templateStorage.getAll(),
      workoutHistory: workoutSessionStorage.getAll(),
      progressMetrics: progressMetricsStorage.get(),
      personalRecords: personalRecordStorage.getAll(),
      goals: goalStorage.getAll(),
      settings: settingsStorage.get(),
      exportDate: new Date().toISOString(),
    };
  },
  importAll: (data: any): boolean => {
    try {
      if (data.userProfile) userProfileStorage.set(data.userProfile);
      if (data.onboarding) onboardingStorage.set(data.onboarding);
      if (data.exercises) exerciseStorage.setAll(data.exercises);
      if (data.templates) templateStorage.setAll(data.templates);
      if (data.workoutHistory) safeSet(STORAGE_KEYS.WORKOUT_HISTORY, data.workoutHistory);
      if (data.progressMetrics) progressMetricsStorage.set(data.progressMetrics);
      if (data.personalRecords) safeSet(STORAGE_KEYS.PERSONAL_RECORDS, data.personalRecords);
      if (data.goals) safeSet(STORAGE_KEYS.GOALS, data.goals);
      if (data.settings) settingsStorage.set(data.settings);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => safeRemove(key));
  },
};
