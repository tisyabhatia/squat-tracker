import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  userProfileStorage,
  exerciseStorage,
  workoutSessionStorage,
  activeWorkoutStorage,
  settingsStorage,
} from '../../utils/storage';
import { UserProfile, Exercise, WorkoutSession } from '../../types';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('userProfileStorage', () => {
    const mockProfile: UserProfile = {
      id: 'test-123',
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      height: 70,
      weight: 180,
      gender: 'male',
      fitnessLevel: 'intermediate',
      trainingSplit: 'ppl',
      weeklyFrequency: 4,
      equipment: ['barbell', 'dumbbell'],
      primaryGoal: 'lean-bulk',
      goals: [],
      preferences: {
        defaultRestTime: 90,
        unitSystem: 'imperial',
        theme: 'dark',
        notifications: {
          workoutReminders: true,
          achievements: true,
          streakReminders: true,
        },
      },
      stats: {
        totalWorkouts: 10,
        currentStreak: 5,
        longestStreak: 7,
        workoutsThisWeek: 3,
        totalVolume: 50000,
        averageDuration: 60,
      },
      isDemo: false,
      createdAt: new Date().toISOString(),
      firstWorkoutCompleted: true,
    };

    it('should save and retrieve user profile', () => {
      userProfileStorage.set(mockProfile);
      const retrieved = userProfileStorage.get();
      expect(retrieved).toEqual(mockProfile);
    });

    it('should update user profile', () => {
      userProfileStorage.set(mockProfile);
      userProfileStorage.update({ name: 'Updated Name' });
      const retrieved = userProfileStorage.get();
      expect(retrieved?.name).toBe('Updated Name');
    });

    it('should remove user profile', () => {
      userProfileStorage.set(mockProfile);
      userProfileStorage.remove();
      const retrieved = userProfileStorage.get();
      expect(retrieved).toBeNull();
    });

    it('should return null when no profile exists', () => {
      const retrieved = userProfileStorage.get();
      expect(retrieved).toBeNull();
    });
  });

  describe('exerciseStorage', () => {
    const mockExercise: Exercise = {
      id: 'ex-1',
      name: 'Bench Press',
      description: 'Compound chest exercise',
      category: 'strength',
      primaryMuscles: ['chest'],
      secondaryMuscles: ['triceps', 'shoulders'],
      equipment: ['barbell', 'bench'],
      difficulty: 'intermediate',
      instructions: ['Lie on bench', 'Lower bar to chest', 'Press up'],
      formTips: ['Keep shoulders back'],
      commonMistakes: ['Bouncing off chest'],
    };

    it('should add and retrieve exercises', () => {
      exerciseStorage.add(mockExercise);
      const exercises = exerciseStorage.getAll();
      expect(exercises).toHaveLength(1);
      expect(exercises[0]).toEqual(mockExercise);
    });

    it('should get exercise by id', () => {
      exerciseStorage.add(mockExercise);
      const exercise = exerciseStorage.getById('ex-1');
      expect(exercise).toEqual(mockExercise);
    });

    it('should update exercise', () => {
      exerciseStorage.add(mockExercise);
      exerciseStorage.update('ex-1', { name: 'Updated Name' });
      const exercise = exerciseStorage.getById('ex-1');
      expect(exercise?.name).toBe('Updated Name');
    });

    it('should remove exercise', () => {
      exerciseStorage.add(mockExercise);
      exerciseStorage.remove('ex-1');
      const exercises = exerciseStorage.getAll();
      expect(exercises).toHaveLength(0);
    });

    it('should search exercises', () => {
      exerciseStorage.add(mockExercise);
      const results = exerciseStorage.search('bench');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Bench Press');
    });
  });

  describe('workoutSessionStorage', () => {
    const mockWorkout: WorkoutSession = {
      id: 'workout-1',
      name: 'Test Workout',
      type: 'strength',
      startTime: new Date().toISOString(),
      status: 'completed',
      exercises: [],
      notes: '',
    };

    it('should add and retrieve workout sessions', () => {
      workoutSessionStorage.add(mockWorkout);
      const sessions = workoutSessionStorage.getAll();
      expect(sessions).toHaveLength(1);
      expect(sessions[0]).toEqual(mockWorkout);
    });

    it('should add new sessions to the beginning', () => {
      const workout1 = { ...mockWorkout, id: 'w1' };
      const workout2 = { ...mockWorkout, id: 'w2' };
      workoutSessionStorage.add(workout1);
      workoutSessionStorage.add(workout2);
      const sessions = workoutSessionStorage.getAll();
      expect(sessions[0].id).toBe('w2');
      expect(sessions[1].id).toBe('w1');
    });

    it('should get recent workouts', () => {
      for (let i = 0; i < 10; i++) {
        workoutSessionStorage.add({ ...mockWorkout, id: `w${i}` });
      }
      const recent = workoutSessionStorage.getRecent(5);
      expect(recent).toHaveLength(5);
    });

    it('should update workout session', () => {
      workoutSessionStorage.add(mockWorkout);
      workoutSessionStorage.update('workout-1', { notes: 'Updated notes' });
      const session = workoutSessionStorage.getById('workout-1');
      expect(session?.notes).toBe('Updated notes');
    });
  });

  describe('activeWorkoutStorage', () => {
    const mockActiveWorkout: WorkoutSession = {
      id: 'active-1',
      name: 'Current Workout',
      type: 'strength',
      startTime: new Date().toISOString(),
      status: 'in-progress',
      exercises: [],
      notes: '',
    };

    it('should save and retrieve active workout', () => {
      activeWorkoutStorage.set(mockActiveWorkout);
      const retrieved = activeWorkoutStorage.get();
      expect(retrieved).toEqual(mockActiveWorkout);
    });

    it('should update active workout', () => {
      activeWorkoutStorage.set(mockActiveWorkout);
      activeWorkoutStorage.update({ notes: 'Updated' });
      const retrieved = activeWorkoutStorage.get();
      expect(retrieved?.notes).toBe('Updated');
    });

    it('should remove active workout', () => {
      activeWorkoutStorage.set(mockActiveWorkout);
      activeWorkoutStorage.remove();
      const retrieved = activeWorkoutStorage.get();
      expect(retrieved).toBeNull();
    });
  });

  describe('settingsStorage', () => {
    it('should return default settings when none exist', () => {
      const settings = settingsStorage.get();
      expect(settings).toHaveProperty('theme');
      expect(settings).toHaveProperty('unitSystem');
      expect(settings).toHaveProperty('defaultRestTime');
    });

    it('should save and retrieve settings', () => {
      const customSettings = {
        theme: 'dark' as const,
        unitSystem: 'metric' as const,
        defaultRestTime: 120,
        notifications: {
          workoutReminders: false,
          achievements: true,
          streakReminders: false,
        },
        sound: {
          enabled: true,
          volume: 0.8,
        },
      };
      settingsStorage.set(customSettings);
      const retrieved = settingsStorage.get();
      expect(retrieved).toEqual(customSettings);
    });

    it('should update settings', () => {
      settingsStorage.update({ defaultRestTime: 180 });
      const settings = settingsStorage.get();
      expect(settings.defaultRestTime).toBe(180);
    });
  });

  describe('Error handling', () => {
    it('should handle JSON parse errors gracefully', () => {
      localStorage.getItem = vi.fn(() => 'invalid json{');
      const profile = userProfileStorage.get();
      expect(profile).toBeNull();
    });

    it('should handle localStorage quota errors', () => {
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });
      const result = userProfileStorage.set({} as UserProfile);
      expect(result).toBe(false);
    });
  });
});
