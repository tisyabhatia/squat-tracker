import { WorkoutTemplate, BodybuildingGoal, WorkoutType, MuscleGroup } from '../types';

interface PlanGeneratorInput {
  goal: BodybuildingGoal;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  weeklyFrequency?: number;
}

interface GeneratedPlan {
  name: string;
  description: string;
  weeklyFrequency: number;
  templates: Partial<WorkoutTemplate>[];
  tips: string[];
}

export function generateTrainingPlan(input: PlanGeneratorInput): GeneratedPlan {
  const { goal, experienceLevel, weeklyFrequency = 4 } = input;

  // Determine training split based on frequency
  let split: 'full-body' | 'upper-lower' | 'ppl' = 'full-body';
  if (weeklyFrequency >= 6) {
    split = 'ppl'; // Push/Pull/Legs 2x per week
  } else if (weeklyFrequency >= 4) {
    split = 'ppl'; // Push/Pull/Legs
  } else if (weeklyFrequency === 3) {
    split = 'full-body'; // Full body 3x per week
  } else {
    split = 'upper-lower'; // Upper/Lower 2x per week
  }

  // Base templates
  switch (split) {
    case 'full-body':
      return generateFullBodyPlan(goal, experienceLevel);
    case 'upper-lower':
      return generateUpperLowerPlan(goal, experienceLevel);
    case 'ppl':
      return generatePPLPlan(goal, experienceLevel, weeklyFrequency);
    default:
      return generateFullBodyPlan(goal, experienceLevel);
  }
}

function generateFullBodyPlan(
  goal: BodybuildingGoal,
  level: 'beginner' | 'intermediate' | 'advanced'
): GeneratedPlan {
  const sets = level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5;
  const reps = goal === 'strength-focus' ? '4-6' : goal === 'cut' ? '10-12' : '8-10';

  return {
    name: 'Full Body Program',
    description: `3x per week full body training optimized for ${goal.replace('-', ' ')}`,
    weeklyFrequency: 3,
    templates: [
      {
        id: 'fb-day-1',
        name: 'Full Body A',
        description: 'Compound movements focused workout',
        type: 'full-body' as WorkoutType,
        difficulty: level,
        estimatedDuration: level === 'beginner' ? 45 : level === 'intermediate' ? 60 : 75,
        targetMuscles: ['chest', 'back', 'quadriceps', 'shoulders', 'hamstrings'] as MuscleGroup[],
        exercises: [
          {
            exerciseId: 'squat',
            order: 1,
            sets,
            targetReps: reps,
            restTime: goal === 'strength-focus' ? 180 : 90,
            notes: 'Focus on depth and control'
          },
          {
            exerciseId: 'bench-press',
            order: 2,
            sets,
            targetReps: reps,
            restTime: goal === 'strength-focus' ? 180 : 90,
          },
          {
            exerciseId: 'rows',
            order: 3,
            sets,
            targetReps: reps,
            restTime: 90,
          },
          {
            exerciseId: 'overhead-press',
            order: 4,
            sets: sets - 1,
            targetReps: reps,
            restTime: 90,
          },
          {
            exerciseId: 'romanian-deadlift',
            order: 5,
            sets: 3,
            targetReps: '10-12',
            restTime: 60,
          }
        ],
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'fb-day-2',
        name: 'Full Body B',
        description: 'Variation workout for balanced development',
        type: 'full-body' as WorkoutType,
        difficulty: level,
        estimatedDuration: level === 'beginner' ? 45 : level === 'intermediate' ? 60 : 75,
        targetMuscles: ['back', 'chest', 'quadriceps', 'biceps', 'triceps'] as MuscleGroup[],
        exercises: [
          {
            exerciseId: 'deadlift',
            order: 1,
            sets: sets - 1,
            targetReps: goal === 'strength-focus' ? '3-5' : '6-8',
            restTime: goal === 'strength-focus' ? 240 : 120,
          },
          {
            exerciseId: 'incline-bench',
            order: 2,
            sets,
            targetReps: reps,
            restTime: 90,
          },
          {
            exerciseId: 'pull-ups',
            order: 3,
            sets,
            targetReps: 'AMRAP',
            restTime: 90,
          },
          {
            exerciseId: 'leg-press',
            order: 4,
            sets: 3,
            targetReps: '10-15',
            restTime: 60,
          },
          {
            exerciseId: 'dips',
            order: 5,
            sets: 3,
            targetReps: '8-12',
            restTime: 60,
          }
        ],
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    tips: [
      'Alternate between Workout A and B throughout the week',
      'Rest at least one day between sessions',
      goal === 'lean-bulk' ? 'Focus on progressive overload - add weight or reps each week' : '',
      goal === 'cut' ? 'Maintain strength while in a deficit - volume may need to decrease slightly' : '',
      level === 'beginner' ? 'Focus on learning proper form before adding weight' : '',
    ].filter(Boolean)
  };
}

function generateUpperLowerPlan(
  goal: BodybuildingGoal,
  level: 'beginner' | 'intermediate' | 'advanced'
): GeneratedPlan {
  const sets = level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5;
  const reps = goal === 'strength-focus' ? '4-6' : goal === 'cut' ? '10-12' : '8-10';

  return {
    name: 'Upper/Lower Split',
    description: `4x per week upper/lower training optimized for ${goal.replace('-', ' ')}`,
    weeklyFrequency: 4,
    templates: [
      {
        id: 'ul-upper-1',
        name: 'Upper Body A',
        type: 'upper-body' as WorkoutType,
        difficulty: level,
        estimatedDuration: 60,
        targetMuscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] as MuscleGroup[],
        exercises: [
          { exerciseId: 'bench-press', order: 1, sets, targetReps: reps, restTime: 120 },
          { exerciseId: 'rows', order: 2, sets, targetReps: reps, restTime: 90 },
          { exerciseId: 'overhead-press', order: 3, sets: 4, targetReps: reps, restTime: 90 },
          { exerciseId: 'pull-ups', order: 4, sets: 3, targetReps: 'AMRAP', restTime: 90 },
          { exerciseId: 'curls', order: 5, sets: 3, targetReps: '10-12', restTime: 60 },
        ],
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ul-lower-1',
        name: 'Lower Body A',
        type: 'lower-body' as WorkoutType,
        difficulty: level,
        estimatedDuration: 55,
        targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'] as MuscleGroup[],
        exercises: [
          { exerciseId: 'squat', order: 1, sets, targetReps: reps, restTime: 150 },
          { exerciseId: 'romanian-deadlift', order: 2, sets: 4, targetReps: '8-10', restTime: 90 },
          { exerciseId: 'leg-press', order: 3, sets: 3, targetReps: '12-15', restTime: 90 },
          { exerciseId: 'leg-curls', order: 4, sets: 3, targetReps: '10-12', restTime: 60 },
          { exerciseId: 'calf-raises', order: 5, sets: 4, targetReps: '15-20', restTime: 45 },
        ],
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    tips: [
      'Train 4 days per week: Upper/Lower/Rest/Upper/Lower/Rest/Rest',
      'Focus on compound movements first when you have the most energy',
      goal === 'recomp' ? 'Maintain high training intensity while adjusting diet for body composition changes' : '',
    ].filter(Boolean)
  };
}

function generatePPLPlan(
  goal: BodybuildingGoal,
  level: 'beginner' | 'intermediate' | 'advanced',
  frequency: number
): GeneratedPlan {
  const sets = level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5;
  const reps = goal === 'strength-focus' ? '5-7' : goal === 'cut' ? '10-12' : '8-10';

  return {
    name: 'Push/Pull/Legs Split',
    description: `${frequency}x per week PPL training optimized for ${goal.replace('-', ' ')}`,
    weeklyFrequency: frequency,
    templates: [
      {
        id: 'ppl-push',
        name: 'Push Day',
        type: 'push' as WorkoutType,
        difficulty: level,
        estimatedDuration: 65,
        targetMuscles: ['chest', 'shoulders', 'triceps'] as MuscleGroup[],
        exercises: [
          { exerciseId: 'bench-press', order: 1, sets, targetReps: reps, restTime: 120 },
          { exerciseId: 'overhead-press', order: 2, sets: 4, targetReps: reps, restTime: 90 },
          { exerciseId: 'incline-dumbbell-press', order: 3, sets: 4, targetReps: '8-12', restTime: 90 },
          { exerciseId: 'lateral-raises', order: 4, sets: 3, targetReps: '12-15', restTime: 60 },
          { exerciseId: 'tricep-pushdowns', order: 5, sets: 3, targetReps: '10-12', restTime: 60 },
        ],
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ppl-pull',
        name: 'Pull Day',
        type: 'pull' as WorkoutType,
        difficulty: level,
        estimatedDuration: 65,
        targetMuscles: ['back', 'biceps', 'forearms'] as MuscleGroup[],
        exercises: [
          { exerciseId: 'deadlift', order: 1, sets: 4, targetReps: goal === 'strength-focus' ? '3-5' : '6-8', restTime: 180 },
          { exerciseId: 'pull-ups', order: 2, sets: 4, targetReps: 'AMRAP', restTime: 90 },
          { exerciseId: 'barbell-rows', order: 3, sets: 4, targetReps: '8-10', restTime: 90 },
          { exerciseId: 'face-pulls', order: 4, sets: 3, targetReps: '15-20', restTime: 60 },
          { exerciseId: 'bicep-curls', order: 5, sets: 3, targetReps: '10-12', restTime: 60 },
        ],
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ppl-legs',
        name: 'Leg Day',
        type: 'legs' as WorkoutType,
        difficulty: level,
        estimatedDuration: 60,
        targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'] as MuscleGroup[],
        exercises: [
          { exerciseId: 'squat', order: 1, sets, targetReps: reps, restTime: 180 },
          { exerciseId: 'romanian-deadlift', order: 2, sets: 4, targetReps: '8-10', restTime: 90 },
          { exerciseId: 'leg-press', order: 3, sets: 3, targetReps: '12-15', restTime: 90 },
          { exerciseId: 'leg-curls', order: 4, sets: 3, targetReps: '12-15', restTime: 60 },
          { exerciseId: 'calf-raises', order: 5, sets: 4, targetReps: '15-20', restTime: 45 },
        ],
        isCustom: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    tips: [
      frequency === 6 ? 'Run the cycle twice per week: Push/Pull/Legs/Push/Pull/Legs/Rest' : 'Run each workout once per week with rest days as needed',
      'Progressive overload is key - aim to beat last week\'s performance',
      goal === 'lean-bulk' ? 'Ensure you\'re in a caloric surplus of 200-300 calories for optimal muscle growth' : '',
      goal === 'strength-focus' ? 'Focus on the main compounds - everything else is accessory work' : '',
      level === 'advanced' ? 'Consider adding intensity techniques like drop sets or rest-pause on final sets' : '',
    ].filter(Boolean)
  };
}
