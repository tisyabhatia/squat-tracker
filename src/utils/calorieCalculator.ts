import { WorkoutSession, UserProfile } from '../types';

/**
 * Calculate calories burned during a workout
 * Uses metabolic equivalent of task (MET) values for strength training
 *
 * Formula:
 * - If user profile available: Calories = MET × weight (kg) × duration (hours)
 * - Generic estimate: Based on sets completed and exercise intensity
 */

interface CalorieCalculationOptions {
  userProfile?: UserProfile | null;
  workoutSession: WorkoutSession;
}

/**
 * MET (Metabolic Equivalent of Task) values for different exercise intensities
 * Source: Compendium of Physical Activities
 */
const MET_VALUES = {
  LIGHT_STRENGTH: 3.5,      // Light effort (e.g., stretching, light weights)
  MODERATE_STRENGTH: 5.0,    // Moderate effort (most strength training)
  VIGOROUS_STRENGTH: 6.0,    // Vigorous effort (heavy weights, high intensity)
  HIIT: 8.0,                 // High-intensity interval training
  CARDIO_MODERATE: 5.0,      // Moderate cardio (jogging, cycling)
  CARDIO_VIGOROUS: 8.0,      // Vigorous cardio (running, intense cycling)
};

/**
 * Calculate calories burned based on user profile
 */
function calculateWithProfile(
  profile: UserProfile,
  durationMinutes: number,
  intensity: 'light' | 'moderate' | 'vigorous' = 'moderate'
): number {
  // Convert weight to kg if in imperial
  const weightKg = profile.preferences.unitSystem === 'imperial'
    ? profile.weight * 0.453592  // lbs to kg
    : profile.weight;

  // Select MET value based on intensity
  let met = MET_VALUES.MODERATE_STRENGTH;
  if (intensity === 'light') met = MET_VALUES.LIGHT_STRENGTH;
  if (intensity === 'vigorous') met = MET_VALUES.VIGOROUS_STRENGTH;

  // Calories = MET × weight (kg) × duration (hours)
  const durationHours = durationMinutes / 60;
  const calories = met * weightKg * durationHours;

  // Apply gender adjustment (men typically burn ~5% more calories due to higher muscle mass)
  const genderMultiplier = profile.gender === 'male' ? 1.05 : 1.0;

  return Math.round(calories * genderMultiplier);
}

/**
 * Calculate calories using generic estimates based on workout data
 */
function calculateGenericEstimate(workoutSession: WorkoutSession): number {
  // Calculate workout metrics
  const totalSets = workoutSession.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter(s => s.completed).length,
    0
  );

  const totalVolume = workoutSession.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets
        .filter(s => s.completed)
        .reduce((setSum, set) => setSum + ((set.weight || 0) * (set.reps || 0)), 0),
    0
  );

  // Estimate duration in minutes
  const durationMinutes = workoutSession.endTime
    ? (new Date(workoutSession.endTime).getTime() - new Date(workoutSession.startTime).getTime()) / (1000 * 60)
    : 45; // Default 45 minutes if not completed

  // Generic calorie estimates:
  // - Base: 5 calories per minute of strength training (based on 150lb person)
  // - Bonus: 0.02 calories per lb of volume lifted
  // - Bonus: 2 calories per completed set

  const baseCalories = durationMinutes * 5;
  const volumeBonus = totalVolume * 0.02;
  const setBonus = totalSets * 2;

  return Math.round(baseCalories + volumeBonus + setBonus);
}

/**
 * Determine workout intensity based on workout data
 */
function determineWorkoutIntensity(workoutSession: WorkoutSession): 'light' | 'moderate' | 'vigorous' {
  // Calculate average RPE if available
  const rpeValues = workoutSession.exercises
    .flatMap(ex => ex.sets)
    .map(set => set.rpe)
    .filter((rpe): rpe is number => rpe !== undefined && rpe !== null);

  if (rpeValues.length > 0) {
    const avgRpe = rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length;
    if (avgRpe <= 5) return 'light';
    if (avgRpe <= 7) return 'moderate';
    return 'vigorous';
  }

  // Fallback: Use workout type
  if (workoutSession.type === 'hiit') return 'vigorous';
  if (workoutSession.type === 'cardio') return 'vigorous';
  if (workoutSession.type === 'flexibility') return 'light';

  return 'moderate'; // Default
}

/**
 * Main function to calculate calories for a workout
 */
export function calculateWorkoutCalories(options: CalorieCalculationOptions): number {
  const { userProfile, workoutSession } = options;

  // Calculate duration
  const durationMinutes = workoutSession.endTime
    ? (new Date(workoutSession.endTime).getTime() - new Date(workoutSession.startTime).getTime()) / (1000 * 60)
    : 0;

  // Return 0 if workout hasn't started or has no duration
  if (durationMinutes <= 0) {
    return 0;
  }

  // Use profile-based calculation if available
  if (userProfile && userProfile.weight > 0) {
    const intensity = determineWorkoutIntensity(workoutSession);
    return calculateWithProfile(userProfile, durationMinutes, intensity);
  }

  // Fallback to generic estimate
  return calculateGenericEstimate(workoutSession);
}

/**
 * Calculate calories burned for a single exercise
 */
export function calculateExerciseCalories(
  exerciseSets: number,
  exerciseVolume: number,
  durationMinutes: number
): number {
  const baseCalories = durationMinutes * 5;
  const volumeBonus = exerciseVolume * 0.02;
  const setBonus = exerciseSets * 2;

  return Math.round(baseCalories + volumeBonus + setBonus);
}

/**
 * Get MET value for a specific workout type
 */
export function getMETForWorkoutType(workoutType: string): number {
  switch (workoutType) {
    case 'strength':
    case 'upper-body':
    case 'lower-body':
    case 'full-body':
      return MET_VALUES.MODERATE_STRENGTH;
    case 'hiit':
      return MET_VALUES.HIIT;
    case 'cardio':
      return MET_VALUES.CARDIO_VIGOROUS;
    case 'flexibility':
      return MET_VALUES.LIGHT_STRENGTH;
    default:
      return MET_VALUES.MODERATE_STRENGTH;
  }
}
