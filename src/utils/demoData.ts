import { UserProfile, WorkoutSession, Goal, PersonalRecord } from '../types';
import { subDays, format } from 'date-fns';

// Generate demo user profile: Alex Johnson
export function generateDemoProfile(): UserProfile {
  const now = new Date();

  return {
    id: 'demo-user-001',
    name: 'Alex Johnson',
    email: 'alex.demo@checkpoint.app',
    // BUG FIX: Add required fields that were missing
    age: 28,
    height: 70, // 5'10" in inches
    weight: 180, // lbs
    gender: 'male',
    fitnessLevel: 'intermediate',
    trainingSplit: 'ppl',
    weeklyFrequency: 3,
    equipment: ['barbell', 'dumbbell', 'bench', 'squat-rack', 'cable-machine', 'pull-up-bar'],
    primaryGoal: 'lean-bulk',
    targetWeight: 190, // Optional but good for demo
    keyLifts: {
      bench: 205,
      squat: 245,
      deadlift: 365,
    },
    goals: [
      {
        id: 'goal-001',
        type: 'strength',
        description: 'Bench press 225 lbs',
        target: 225,
        current: 205,
        unit: 'lbs',
        deadline: new Date(now.getFullYear(), now.getMonth() + 2, 1).toISOString(),
        createdAt: subDays(now, 60).toISOString(),
        completed: false,
        exerciseId: 'ex-001', // Barbell Bench Press
      },
      {
        id: 'goal-002',
        type: 'consistency',
        description: 'Complete 60 workouts in 6 months',
        target: 60,
        current: 54,
        unit: 'workouts',
        deadline: new Date(now.getFullYear(), now.getMonth() + 2, 1).toISOString(),
        createdAt: subDays(now, 126).toISOString(),
        completed: false,
      },
      {
        id: 'goal-003',
        type: 'strength',
        description: 'Deadlift 405 lbs',
        target: 405,
        current: 365,
        unit: 'lbs',
        deadline: new Date(now.getFullYear(), now.getMonth() + 3, 1).toISOString(),
        createdAt: subDays(now, 60).toISOString(),
        completed: false,
        exerciseId: 'ex-006', // Deadlift
      },
    ],
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
      totalWorkouts: 54,
      currentStreak: 3,
      longestStreak: 12,
      lastWorkoutDate: subDays(now, 1).toISOString(),
      workoutsThisWeek: 2,
      totalVolume: 783450, // Sum of all demo workouts
      averageDuration: 54, // minutes
    },
    isDemo: true,
    createdAt: subDays(now, 60).toISOString(),
    firstWorkoutCompleted: true, // Demo user has workout history
  };
}

// Generate demo workout history (54 workouts over 18 weeks)
export function generateDemoWorkouts(): WorkoutSession[] {
  const now = new Date();
  const workouts: WorkoutSession[] = [];

  // Helper to create a workout
  const createWorkout = (
    daysAgo: number,
    type: 'push' | 'pull' | 'legs',
    exercises: any[],
    duration: number,
    volume: number
  ): WorkoutSession => {
    const workoutDate = subDays(now, daysAgo);
    const startTime = new Date(workoutDate);
    startTime.setHours(17, 0, 0, 0); // 5 PM start time
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    return {
      id: `demo-workout-${daysAgo}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Day`,
      type,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: duration * 60,
      exercises,
      totalVolume: volume,
      calories: Math.round(duration * 6.5), // Rough estimate
      status: 'completed',
    };
  };

  // Week 1 (most recent) - 2, 4, 6 days ago
  workouts.push(
    // Push Day (2 days ago) - PR on Bench!
    createWorkout(
      2,
      'push',
      [
        {
          exerciseId: 'ex-001',
          exerciseName: 'Barbell Bench Press',
          sets: [
            { setNumber: 1, weight: 185, reps: 8, completed: true, timestamp: '', isWarmup: true },
            { setNumber: 2, weight: 205, reps: 6, completed: true, timestamp: '' },
            { setNumber: 3, weight: 205, reps: 6, completed: true, timestamp: '' },
            { setNumber: 4, weight: 205, reps: 6, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-017',
          exerciseName: 'Overhead Press',
          sets: [
            { setNumber: 1, weight: 115, reps: 8, completed: true, timestamp: '' },
            { setNumber: 2, weight: 115, reps: 8, completed: true, timestamp: '' },
            { setNumber: 3, weight: 115, reps: 7, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-002',
          exerciseName: 'Incline Dumbbell Press',
          sets: [
            { setNumber: 1, weight: 70, reps: 10, completed: true, timestamp: '' },
            { setNumber: 2, weight: 70, reps: 10, completed: true, timestamp: '' },
            { setNumber: 3, weight: 70, reps: 9, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-018',
          exerciseName: 'Lateral Raises',
          sets: [
            { setNumber: 1, weight: 20, reps: 12, completed: true, timestamp: '' },
            { setNumber: 2, weight: 20, reps: 12, completed: true, timestamp: '' },
            { setNumber: 3, weight: 20, reps: 11, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-026',
          exerciseName: 'Tricep Pushdowns',
          sets: [
            { setNumber: 1, weight: 50, reps: 12, completed: true, timestamp: '' },
            { setNumber: 2, weight: 50, reps: 12, completed: true, timestamp: '' },
            { setNumber: 3, weight: 50, reps: 11, completed: true, timestamp: '' },
          ],
          completed: true,
        },
      ],
      48,
      12450
    )
  );

  workouts.push(
    // Pull Day (4 days ago)
    createWorkout(
      4,
      'pull',
      [
        {
          exerciseId: 'ex-006',
          exerciseName: 'Deadlift',
          sets: [
            { setNumber: 1, weight: 315, reps: 5, completed: true, timestamp: '', isWarmup: true },
            { setNumber: 2, weight: 365, reps: 5, completed: true, timestamp: '' },
            { setNumber: 3, weight: 365, reps: 5, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-007',
          exerciseName: 'Pull-ups',
          sets: [
            { setNumber: 1, reps: 8, completed: true, timestamp: '' },
            { setNumber: 2, reps: 8, completed: true, timestamp: '' },
            { setNumber: 3, reps: 7, completed: true, timestamp: '' },
            { setNumber: 4, reps: 7, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-008',
          exerciseName: 'Barbell Rows',
          sets: [
            { setNumber: 1, weight: 155, reps: 8, completed: true, timestamp: '' },
            { setNumber: 2, weight: 155, reps: 8, completed: true, timestamp: '' },
            { setNumber: 3, weight: 155, reps: 8, completed: true, timestamp: '' },
            { setNumber: 4, weight: 155, reps: 7, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-020',
          exerciseName: 'Face Pulls',
          sets: [
            { setNumber: 1, weight: 30, reps: 15, completed: true, timestamp: '' },
            { setNumber: 2, weight: 30, reps: 15, completed: true, timestamp: '' },
            { setNumber: 3, weight: 30, reps: 14, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-021',
          exerciseName: 'Barbell Curls',
          sets: [
            { setNumber: 1, weight: 70, reps: 10, completed: true, timestamp: '' },
            { setNumber: 2, weight: 70, reps: 10, completed: true, timestamp: '' },
            { setNumber: 3, weight: 70, reps: 9, completed: true, timestamp: '' },
          ],
          completed: true,
        },
      ],
      52,
      15680
    )
  );

  workouts.push(
    // Legs Day (6 days ago)
    createWorkout(
      6,
      'legs',
      [
        {
          exerciseId: 'ex-011',
          exerciseName: 'Barbell Squats',
          sets: [
            { setNumber: 1, weight: 185, reps: 8, completed: true, timestamp: '', isWarmup: true },
            { setNumber: 2, weight: 245, reps: 6, completed: true, timestamp: '' },
            { setNumber: 3, weight: 245, reps: 6, completed: true, timestamp: '' },
            { setNumber: 4, weight: 245, reps: 6, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-012',
          exerciseName: 'Romanian Deadlifts',
          sets: [
            { setNumber: 1, weight: 185, reps: 8, completed: true, timestamp: '' },
            { setNumber: 2, weight: 185, reps: 8, completed: true, timestamp: '' },
            { setNumber: 3, weight: 185, reps: 8, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-013',
          exerciseName: 'Leg Press',
          sets: [
            { setNumber: 1, weight: 320, reps: 12, completed: true, timestamp: '' },
            { setNumber: 2, weight: 320, reps: 12, completed: true, timestamp: '' },
            { setNumber: 3, weight: 320, reps: 11, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-015',
          exerciseName: 'Leg Curls',
          sets: [
            { setNumber: 1, weight: 80, reps: 12, completed: true, timestamp: '' },
            { setNumber: 2, weight: 80, reps: 12, completed: true, timestamp: '' },
            { setNumber: 3, weight: 80, reps: 11, completed: true, timestamp: '' },
          ],
          completed: true,
        },
        {
          exerciseId: 'ex-016',
          exerciseName: 'Calf Raises',
          sets: [
            { setNumber: 1, weight: 120, reps: 15, completed: true, timestamp: '' },
            { setNumber: 2, weight: 120, reps: 15, completed: true, timestamp: '' },
            { setNumber: 3, weight: 120, reps: 14, completed: true, timestamp: '' },
            { setNumber: 4, weight: 120, reps: 14, completed: true, timestamp: '' },
          ],
          completed: true,
        },
      ],
      55,
      18920
    )
  );

  // Week 2 - 9, 11, 13 days ago
  workouts.push(
    createWorkout(9, 'push', generatePushWorkout(200, 110, 65, 18, 45), 47, 11890),
    createWorkout(11, 'pull', generatePullWorkout(360, 150, 28, 65), 51, 15240),
    createWorkout(13, 'legs', generateLegsWorkout(240, 180, 310, 75, 115), 54, 18420)
  );

  // Week 3 - 16, 18, 20 days ago
  workouts.push(
    createWorkout(16, 'push', generatePushWorkout(200, 110, 65, 18, 45), 46, 11750),
    createWorkout(18, 'pull', generatePullWorkout(355, 145, 28, 65), 50, 14980),
    createWorkout(20, 'legs', generateLegsWorkout(235, 175, 300, 75, 110), 53, 17850)
  );

  // Week 4 - 23, 25, 27 days ago
  workouts.push(
    createWorkout(23, 'push', generatePushWorkout(195, 105, 60, 15, 45), 45, 11320),
    createWorkout(25, 'pull', generatePullWorkout(350, 145, 25, 60), 49, 14560),
    createWorkout(27, 'legs', generateLegsWorkout(230, 170, 290, 70, 110), 52, 17280)
  );

  // Week 5 - 30, 32, 34 days ago
  workouts.push(
    createWorkout(30, 'push', generatePushWorkout(195, 105, 60, 15, 42), 44, 10980),
    createWorkout(32, 'pull', generatePullWorkout(345, 140, 25, 60), 48, 14120),
    createWorkout(34, 'legs', generateLegsWorkout(225, 165, 280, 70, 105), 51, 16740)
  );

  // Week 6 - 37, 39, 41 days ago
  workouts.push(
    createWorkout(37, 'push', generatePushWorkout(190, 100, 55, 15, 40), 43, 10540),
    createWorkout(39, 'pull', generatePullWorkout(340, 135, 22, 55), 47, 13680),
    createWorkout(41, 'legs', generateLegsWorkout(220, 160, 270, 65, 105), 50, 16180)
  );

  // Week 7 - 44, 46, 48 days ago
  workouts.push(
    createWorkout(44, 'push', generatePushWorkout(185, 95, 55, 12, 40), 42, 10120),
    createWorkout(46, 'pull', generatePullWorkout(335, 130, 22, 55), 46, 13240),
    createWorkout(48, 'legs', generateLegsWorkout(215, 155, 260, 65, 100), 49, 15620)
  );

  // Week 8 - 51, 53, 55 days ago
  workouts.push(
    createWorkout(51, 'push', generatePushWorkout(180, 95, 50, 12, 38), 41, 9680),
    createWorkout(53, 'pull', generatePullWorkout(330, 125, 20, 50), 45, 12800),
    createWorkout(55, 'legs', generateLegsWorkout(210, 150, 250, 60, 100), 48, 15060)
  );

  // Week 9 - 58, 60, 62 days ago
  workouts.push(
    createWorkout(58, 'push', generatePushWorkout(175, 90, 50, 12, 35), 40, 9240),
    createWorkout(60, 'pull', generatePullWorkout(325, 120, 20, 50), 44, 12360),
    createWorkout(62, 'legs', generateLegsWorkout(205, 145, 240, 60, 95), 47, 14500)
  );

  // Week 10 - 65, 67, 69 days ago
  workouts.push(
    createWorkout(65, 'push', generatePushWorkout(170, 90, 45, 10, 35), 39, 8800),
    createWorkout(67, 'pull', generatePullWorkout(320, 115, 18, 45), 43, 11920),
    createWorkout(69, 'legs', generateLegsWorkout(200, 140, 230, 55, 95), 46, 13940)
  );

  // Week 11 - 72, 74, 76 days ago
  workouts.push(
    createWorkout(72, 'push', generatePushWorkout(165, 85, 45, 10, 32), 38, 8360),
    createWorkout(74, 'pull', generatePullWorkout(315, 110, 18, 45), 42, 11480),
    createWorkout(76, 'legs', generateLegsWorkout(195, 135, 220, 55, 90), 45, 13380)
  );

  // Week 12 - 79, 81, 83 days ago
  workouts.push(
    createWorkout(79, 'push', generatePushWorkout(160, 85, 40, 10, 32), 37, 7920),
    createWorkout(81, 'pull', generatePullWorkout(310, 105, 15, 40), 41, 11040),
    createWorkout(83, 'legs', generateLegsWorkout(190, 130, 210, 50, 90), 44, 12820)
  );

  // Week 13 - 86, 88, 90 days ago
  workouts.push(
    createWorkout(86, 'push', generatePushWorkout(155, 80, 40, 8, 30), 36, 7480),
    createWorkout(88, 'pull', generatePullWorkout(305, 100, 15, 40), 40, 10600),
    createWorkout(90, 'legs', generateLegsWorkout(185, 125, 200, 50, 85), 43, 12260)
  );

  // Week 14 - 93, 95, 97 days ago
  workouts.push(
    createWorkout(93, 'push', generatePushWorkout(150, 80, 35, 8, 30), 35, 7040),
    createWorkout(95, 'pull', generatePullWorkout(300, 95, 12, 35), 39, 10160),
    createWorkout(97, 'legs', generateLegsWorkout(180, 120, 190, 45, 85), 42, 11700)
  );

  // Week 15 - 100, 102, 104 days ago
  workouts.push(
    createWorkout(100, 'push', generatePushWorkout(145, 75, 35, 8, 28), 34, 6600),
    createWorkout(102, 'pull', generatePullWorkout(295, 90, 12, 35), 38, 9720),
    createWorkout(104, 'legs', generateLegsWorkout(175, 115, 180, 45, 80), 41, 11140)
  );

  // Week 16 - 107, 109, 111 days ago
  workouts.push(
    createWorkout(107, 'push', generatePushWorkout(140, 75, 30, 5, 28), 33, 6160),
    createWorkout(109, 'pull', generatePullWorkout(290, 85, 10, 30), 37, 9280),
    createWorkout(111, 'legs', generateLegsWorkout(170, 110, 170, 40, 80), 40, 10580)
  );

  // Week 17 - 114, 116, 118 days ago
  workouts.push(
    createWorkout(114, 'push', generatePushWorkout(135, 70, 30, 5, 25), 32, 5720),
    createWorkout(116, 'pull', generatePullWorkout(285, 80, 10, 30), 36, 8840),
    createWorkout(118, 'legs', generateLegsWorkout(165, 105, 160, 40, 75), 39, 10020)
  );

  // Week 18 - 121, 123, 125 days ago (earliest workouts)
  workouts.push(
    createWorkout(121, 'push', generatePushWorkout(130, 70, 25, 5, 25), 31, 5280),
    createWorkout(123, 'pull', generatePullWorkout(280, 75, 8, 25), 35, 8400),
    createWorkout(125, 'legs', generateLegsWorkout(160, 100, 150, 35, 75), 38, 9460)
  );

  return workouts;
}

// Helper functions to generate specific workout types
function generatePushWorkout(bench: number, ohp: number, incline: number, lateral: number, tricep: number) {
  return [
    {
      exerciseId: 'ex-001',
      exerciseName: 'Barbell Bench Press',
      sets: [
        { setNumber: 1, weight: bench - 20, reps: 8, completed: true, timestamp: '', isWarmup: true },
        { setNumber: 2, weight: bench, reps: 6, completed: true, timestamp: '' },
        { setNumber: 3, weight: bench, reps: 6, completed: true, timestamp: '' },
        { setNumber: 4, weight: bench, reps: 5, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-017',
      exerciseName: 'Overhead Press',
      sets: [
        { setNumber: 1, weight: ohp, reps: 8, completed: true, timestamp: '' },
        { setNumber: 2, weight: ohp, reps: 7, completed: true, timestamp: '' },
        { setNumber: 3, weight: ohp, reps: 7, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-002',
      exerciseName: 'Incline Dumbbell Press',
      sets: [
        { setNumber: 1, weight: incline, reps: 10, completed: true, timestamp: '' },
        { setNumber: 2, weight: incline, reps: 9, completed: true, timestamp: '' },
        { setNumber: 3, weight: incline, reps: 8, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-018',
      exerciseName: 'Lateral Raises',
      sets: [
        { setNumber: 1, weight: lateral, reps: 12, completed: true, timestamp: '' },
        { setNumber: 2, weight: lateral, reps: 11, completed: true, timestamp: '' },
        { setNumber: 3, weight: lateral, reps: 10, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-026',
      exerciseName: 'Tricep Pushdowns',
      sets: [
        { setNumber: 1, weight: tricep, reps: 12, completed: true, timestamp: '' },
        { setNumber: 2, weight: tricep, reps: 11, completed: true, timestamp: '' },
        { setNumber: 3, weight: tricep, reps: 10, completed: true, timestamp: '' },
      ],
      completed: true,
    },
  ];
}

function generatePullWorkout(deadlift: number, rows: number, facePulls: number, curls: number) {
  return [
    {
      exerciseId: 'ex-006',
      exerciseName: 'Deadlift',
      sets: [
        { setNumber: 1, weight: deadlift - 50, reps: 5, completed: true, timestamp: '', isWarmup: true },
        { setNumber: 2, weight: deadlift, reps: 5, completed: true, timestamp: '' },
        { setNumber: 3, weight: deadlift, reps: 4, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-007',
      exerciseName: 'Pull-ups',
      sets: [
        { setNumber: 1, reps: 8, completed: true, timestamp: '' },
        { setNumber: 2, reps: 7, completed: true, timestamp: '' },
        { setNumber: 3, reps: 7, completed: true, timestamp: '' },
        { setNumber: 4, reps: 6, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-008',
      exerciseName: 'Barbell Rows',
      sets: [
        { setNumber: 1, weight: rows, reps: 8, completed: true, timestamp: '' },
        { setNumber: 2, weight: rows, reps: 8, completed: true, timestamp: '' },
        { setNumber: 3, weight: rows, reps: 7, completed: true, timestamp: '' },
        { setNumber: 4, weight: rows, reps: 7, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-020',
      exerciseName: 'Face Pulls',
      sets: [
        { setNumber: 1, weight: facePulls, reps: 15, completed: true, timestamp: '' },
        { setNumber: 2, weight: facePulls, reps: 14, completed: true, timestamp: '' },
        { setNumber: 3, weight: facePulls, reps: 14, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-021',
      exerciseName: 'Barbell Curls',
      sets: [
        { setNumber: 1, weight: curls, reps: 10, completed: true, timestamp: '' },
        { setNumber: 2, weight: curls, reps: 9, completed: true, timestamp: '' },
        { setNumber: 3, weight: curls, reps: 8, completed: true, timestamp: '' },
      ],
      completed: true,
    },
  ];
}

function generateLegsWorkout(squat: number, rdl: number, legPress: number, legCurl: number, calfRaise: number) {
  return [
    {
      exerciseId: 'ex-011',
      exerciseName: 'Barbell Squats',
      sets: [
        { setNumber: 1, weight: squat - 60, reps: 8, completed: true, timestamp: '', isWarmup: true },
        { setNumber: 2, weight: squat, reps: 6, completed: true, timestamp: '' },
        { setNumber: 3, weight: squat, reps: 6, completed: true, timestamp: '' },
        { setNumber: 4, weight: squat, reps: 5, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-012',
      exerciseName: 'Romanian Deadlifts',
      sets: [
        { setNumber: 1, weight: rdl, reps: 8, completed: true, timestamp: '' },
        { setNumber: 2, weight: rdl, reps: 8, completed: true, timestamp: '' },
        { setNumber: 3, weight: rdl, reps: 7, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-013',
      exerciseName: 'Leg Press',
      sets: [
        { setNumber: 1, weight: legPress, reps: 12, completed: true, timestamp: '' },
        { setNumber: 2, weight: legPress, reps: 11, completed: true, timestamp: '' },
        { setNumber: 3, weight: legPress, reps: 10, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-015',
      exerciseName: 'Leg Curls',
      sets: [
        { setNumber: 1, weight: legCurl, reps: 12, completed: true, timestamp: '' },
        { setNumber: 2, weight: legCurl, reps: 11, completed: true, timestamp: '' },
        { setNumber: 3, weight: legCurl, reps: 10, completed: true, timestamp: '' },
      ],
      completed: true,
    },
    {
      exerciseId: 'ex-016',
      exerciseName: 'Calf Raises',
      sets: [
        { setNumber: 1, weight: calfRaise, reps: 15, completed: true, timestamp: '' },
        { setNumber: 2, weight: calfRaise, reps: 14, completed: true, timestamp: '' },
        { setNumber: 3, weight: calfRaise, reps: 14, completed: true, timestamp: '' },
        { setNumber: 4, weight: calfRaise, reps: 13, completed: true, timestamp: '' },
      ],
      completed: true,
    },
  ];
}

// Generate demo personal records
export function generateDemoPersonalRecords(): PersonalRecord[] {
  const now = new Date();

  return [
    {
      id: 'pr-001',
      exerciseId: 'ex-001',
      exerciseName: 'Barbell Bench Press',
      type: 'max-weight',
      value: 205,
      date: subDays(now, 2).toISOString(),
      previousRecord: 200,
    },
    {
      id: 'pr-002',
      exerciseId: 'ex-006',
      exerciseName: 'Deadlift',
      type: 'max-weight',
      value: 365,
      date: subDays(now, 11).toISOString(),
      previousRecord: 355,
    },
    {
      id: 'pr-003',
      exerciseId: 'ex-011',
      exerciseName: 'Barbell Squats',
      type: 'max-weight',
      value: 245,
      date: subDays(now, 6).toISOString(),
      previousRecord: 240,
    },
  ];
}

// Initialize demo mode - load all demo data into localStorage
export function initializeDemoMode(): void {
  const demoProfile = generateDemoProfile();
  const demoWorkouts = generateDemoWorkouts();
  const demoPRs = generateDemoPersonalRecords();

  // Save demo profile
  localStorage.setItem('checkpoint_user_profile', JSON.stringify(demoProfile));

  // Save demo workouts
  localStorage.setItem('workoutHistory', JSON.stringify(demoWorkouts));

  // Save demo personal records
  localStorage.setItem('checkpoint_personal_records', JSON.stringify(demoPRs));

  // Update workout stats
  localStorage.setItem('workoutStats', JSON.stringify({
    workoutsThisWeek: 1,
    totalMinutes: demoProfile.stats.totalWorkouts * demoProfile.stats.averageDuration,
    currentStreak: demoProfile.stats.currentStreak,
  }));

  // Mark that demo mode is active
  localStorage.setItem('checkpoint_demo_mode', 'true');
}

// Clear demo mode and reset to initial state
export function clearDemoMode(): void {
  localStorage.removeItem('checkpoint_user_profile');
  localStorage.removeItem('workoutHistory');
  localStorage.removeItem('checkpoint_personal_records');
  localStorage.removeItem('workoutStats');
  localStorage.removeItem('checkpoint_demo_mode');
  localStorage.removeItem('userAuth');
  localStorage.removeItem('userOnboarding');
}

// Check if app is in demo mode
export function isDemoMode(): boolean {
  return localStorage.getItem('checkpoint_demo_mode') === 'true';
}
