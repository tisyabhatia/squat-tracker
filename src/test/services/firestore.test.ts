import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firestoreUserProfile, firestoreWorkouts } from '../../services/firestore';

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(),
  onSnapshot: vi.fn(),
  writeBatch: vi.fn(),
  Timestamp: {
    now: vi.fn(),
  },
  serverTimestamp: vi.fn(),
}));

describe('Firestore Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('firestoreUserProfile', () => {
    it('should handle getting user profile', async () => {
      const { getDoc } = await import('firebase/firestore');
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({
          name: 'Test User',
          email: 'test@example.com',
          createdAt: { toDate: () => new Date() },
        }),
      } as any);

      const profile = await firestoreUserProfile.get('user-123');
      expect(profile).toBeTruthy();
    });

    it('should return null when profile does not exist', async () => {
      const { getDoc } = await import('firebase/firestore');
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => false,
      } as any);

      const profile = await firestoreUserProfile.get('user-123');
      expect(profile).toBeNull();
    });

    it('should handle errors when getting profile', async () => {
      const { getDoc } = await import('firebase/firestore');
      vi.mocked(getDoc).mockRejectedValue(new Error('Network error'));

      await expect(firestoreUserProfile.get('user-123')).rejects.toThrow('Network error');
    });
  });

  describe('firestoreWorkouts', () => {
    it('should handle getting all workouts', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({
        docs: [
          {
            id: 'w1',
            data: () => ({
              name: 'Workout 1',
              startTime: { toDate: () => new Date() },
            }),
          },
        ],
      } as any);

      const workouts = await firestoreWorkouts.getAll('user-123');
      expect(workouts).toHaveLength(1);
    });

    it('should handle empty workout list', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({
        docs: [],
      } as any);

      const workouts = await firestoreWorkouts.getAll('user-123');
      expect(workouts).toHaveLength(0);
    });
  });
});
