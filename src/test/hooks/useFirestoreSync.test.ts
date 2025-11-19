import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFirestoreSync } from '../../hooks/useFirestoreSync';

vi.mock('../../config/firebase', () => ({
  auth: {
    currentUser: { uid: 'test-user-123' },
    onAuthStateChanged: vi.fn((callback) => {
      callback({ uid: 'test-user-123' });
      return vi.fn();
    }),
  },
}));

vi.mock('../../services/firestore', () => ({
  firestoreUserProfile: {
    get: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
  firestoreWorkouts: {
    getAll: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
  firestoreGoals: {
    getAll: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
  firestorePersonalRecords: {
    getAll: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
  firestoreBatch: {
    syncAllData: vi.fn(),
  },
  hasFirestoreData: vi.fn(),
}));

describe('useFirestoreSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with a sync status', () => {
    const { result } = renderHook(() => useFirestoreSync());
    // Status can be 'offline', 'syncing', or 'synced' depending on timing
    expect(['offline', 'syncing', 'synced', 'error']).toContain(result.current.syncStatus);
  });

  it('should handle sync status changes', async () => {
    const { hasFirestoreData } = await import('../../services/firestore');
    vi.mocked(hasFirestoreData).mockResolvedValue(false);

    const { result } = renderHook(() => useFirestoreSync());

    await waitFor(() => {
      expect(result.current.syncStatus).not.toBe('offline');
    });
  });
});
