// ==================== User & Profile ====================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: FitnessGoal[];
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  defaultRestTime: number; // in seconds
  unitSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    workoutReminders: boolean;
    achievements: boolean;
    streakReminders: boolean;
  };
}

export type FitnessGoal =
  | 'build-muscle'
  | 'lose-weight'
  | 'improve-endurance'
  | 'increase-strength'
  | 'stay-active'
  | 'improve-flexibility';

// ==================== Exercise Library ====================

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: Difficulty;
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
  videoUrl?: string;
  imageUrl?: string;
  isFavorite?: boolean;
  isCustom?: boolean;
  createdAt?: string;
}

export type ExerciseCategory =
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'core'
  | 'hiit'
  | 'warmup'
  | 'cooldown';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'lower-back'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'hip-flexors'
  | 'cardiovascular'
  | 'full-body';

export type Equipment =
  | 'none'
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'resistance-band'
  | 'pull-up-bar'
  | 'bench'
  | 'squat-rack'
  | 'cable-machine'
  | 'smith-machine'
  | 'treadmill'
  | 'stationary-bike'
  | 'rowing-machine'
  | 'elliptical'
  | 'jump-rope'
  | 'foam-roller'
  | 'yoga-mat'
  | 'exercise-ball'
  | 'medicine-ball'
  | 'ez-bar';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// ==================== Workout Templates ====================

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  type: WorkoutType;
  difficulty: Difficulty;
  estimatedDuration: number; // in minutes
  targetMuscles: MuscleGroup[];
  exercises: WorkoutExercise[];
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkoutType =
  | 'strength'
  | 'cardio'
  | 'hiit'
  | 'flexibility'
  | 'full-body'
  | 'upper-body'
  | 'lower-body'
  | 'push'
  | 'pull'
  | 'legs'
  | 'core'
  | 'mixed';

export interface WorkoutExercise {
  exerciseId: string;
  order: number;
  sets: number;
  targetReps?: number | string; // Can be "8-10" or just 8
  targetDuration?: number; // in seconds for timed exercises
  targetWeight?: number;
  restTime: number; // in seconds
  notes?: string;
  alternatives?: string[]; // alternative exercise IDs
}

// ==================== Active Workout Sessions ====================

export interface WorkoutSession {
  id: string;
  templateId?: string;
  name: string;
  type: WorkoutType;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  exercises: ExerciseLog[];
  notes?: string;
  rating?: number; // 1-5
  difficulty?: Difficulty;
  totalVolume?: number; // total weight lifted (sets × reps × weight)
  calories?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  notes?: string;
  completed: boolean;
}

export interface SetLog {
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number; // in seconds for timed exercises
  distance?: number; // for cardio
  completed: boolean;
  timestamp: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

// ==================== Progress & Analytics ====================

export interface ProgressMetrics {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalDuration: number; // in minutes
  totalVolume: number;
  totalCalories: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  lastWorkoutDate?: string;
  personalRecords: PersonalRecord[];
  bodyMetrics?: BodyMetrics[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: 'max-weight' | 'max-reps' | 'max-duration' | 'max-distance' | 'max-volume';
  value: number;
  date: string;
  previousRecord?: number;
}

export interface BodyMetrics {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  averageDuration: number;
  currentStreak: number;
  workoutsThisWeek: number;
  mostFrequentExercise?: string;
  favoriteWorkoutType?: WorkoutType;
}

// ==================== Goals & Achievements ====================

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'workout-frequency' | 'streak' | 'weight-lifted' | 'distance' | 'custom';
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

// ==================== Weekly Activity ====================

export interface WeeklyActivity {
  day: string;
  workouts: number;
  duration: number; // in minutes
  volume: number;
  calories: number;
  date: string;
}

// ==================== Onboarding ====================

export interface OnboardingData {
  name: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: FitnessGoal[];
  availableEquipment: Equipment[];
  workoutFrequency: number; // days per week
  preferredDuration: number; // minutes
}

// ==================== Settings ====================

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  unitSystem: 'metric' | 'imperial';
  defaultRestTime: number;
  notifications: {
    workoutReminders: boolean;
    achievements: boolean;
    streakReminders: boolean;
  };
  sound: {
    enabled: boolean;
    volume: number;
  };
}
