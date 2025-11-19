// ==================== User & Profile ====================

export type TrainingSplit = 'fullbody' | 'upperlower' | 'ppl' | 'custom';
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type BodybuildingGoal = 'recomp' | 'lean-bulk' | 'cut' | 'strength-focus';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number; // in inches or cm depending on unit system
  weight: number; // in lbs or kg depending on unit system
  gender: Gender;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  trainingSplit: TrainingSplit;
  weeklyFrequency: number; // 1-7 days per week
  equipment: Equipment[];
  primaryGoal: BodybuildingGoal;
  targetWeight?: number;
  targetBodyFat?: number;
  goals: Goal[];
  preferences: UserPreferences;
  stats: UserStats;
  isDemo: boolean;
  createdAt: string;
  firstWorkoutCompleted: boolean;
  keyLifts?: {
    bench?: number;
    squat?: number;
    deadlift?: number;
  };
}

export interface UserStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: string;
  workoutsThisWeek: number;
  totalVolume: number;
  averageDuration: number; // in minutes
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
  // Template metadata - preserved from WorkoutTemplate for reference
  targetSets?: number;
  targetReps?: number | string;
  targetWeight?: number;
  restTime?: number;
}

export interface SetLog {
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number; // in seconds for timed exercises
  distance?: number; // for cardio
  restTime?: number; // actual rest time taken in seconds
  completed: boolean;
  timestamp: string;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  isWarmup?: boolean;
}

// ==================== Active Workout State ====================

export interface ActiveWorkoutState {
  session: WorkoutSession | null;
  currentExerciseIndex: number;
  currentSetNumber: number;
  isResting: boolean;
  restTimeRemaining: number;
  workoutStartTime: Date | null;
  isPaused: boolean;
}

// ==================== Workout Summary ====================

export interface WorkoutSummary {
  session: WorkoutSession;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  averageRestTime: number;
  estimatedCalories: number;
  personalRecordsAchieved: PersonalRecord[];
  volumeComparison?: number; // percentage vs last similar workout
  goalProgress: {
    goalId: string;
    progressMade: number;
    description: string;
  }[];
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

// ==================== Volume Tracking ====================

export interface MuscleGroupVolume {
  muscleGroup: MuscleGroup;
  totalSets: number;
  totalReps: number;
  totalVolume: number; // weight × reps × sets
  workoutCount: number;
  lastWorkoutDate?: string;
}

export interface WeeklyVolumeData {
  weekStart: string;
  weekEnd: string;
  muscleGroups: MuscleGroupVolume[];
  totalVolume: number;
  totalSets: number;
}

// ==================== Progressive Overload ====================

export interface ExerciseHistory {
  exerciseId: string;
  exerciseName: string;
  sessions: {
    date: string;
    sessionId: string;
    sets: SetLog[];
    totalVolume: number;
    maxWeight: number;
    avgRpe?: number;
  }[];
}

export interface ProgressiveSuggestion {
  type: 'increase-weight' | 'increase-reps' | 'increase-sets' | 'maintain';
  suggestion: string;
  lastPerformance: {
    weight?: number;
    reps?: number;
    sets: number;
    date: string;
  };
  recommendedChange?: {
    weight?: number;
    reps?: number;
  };
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

export type GoalType =
  | 'strength' // e.g., "Bench press 225 lbs"
  | 'endurance' // e.g., "Run 5K under 25 minutes"
  | 'consistency' // e.g., "Work out 4x/week for 12 weeks"
  | 'body_composition' // e.g., "Lose 15 lbs in 3 months"
  | 'volume' // e.g., "Complete 100,000 lbs total volume this month"
  | 'duration'; // e.g., "Average 45-minute workouts for 8 weeks"

export interface Goal {
  id: string;
  type: GoalType;
  description: string; // User-friendly description like "Bench press 225 lbs"
  target: number; // Target value
  current: number; // Current progress
  unit: string; // 'lbs', 'kg', 'minutes', 'workouts', etc.
  deadline: Date | string;
  createdAt: Date | string;
  completed: boolean;
  completedAt?: Date | string;
  exerciseId?: string; // For strength goals tied to specific exercises
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
  // Step 1: Authentication (handled separately)
  email: string;

  // Step 2: Personal Stats
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: Gender;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';

  // Step 3: Goal Selection
  primaryGoal: BodybuildingGoal;
  targetWeight?: number;
  targetBodyFat?: number;

  // Step 4: Training Preferences (optional, can be set later)
  weeklyFrequency?: number;
  trainingSplit?: TrainingSplit;
  availableEquipment?: Equipment[];
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
