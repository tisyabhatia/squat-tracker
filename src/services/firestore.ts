import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  writeBatch,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  UserProfile,
  WorkoutSession,
  Goal,
  AppSettings,
  PersonalRecord,
  Exercise,
} from '../types';

// ==================== Collection References ====================

const COLLECTIONS = {
  USERS: 'users',
  WORKOUTS: 'workouts',
  GOALS: 'goals',
  PERSONAL_RECORDS: 'personal_records',
  EXERCISES: 'exercises',
} as const;

// ==================== Helper Functions ====================

/**
 * Convert Firestore timestamp to ISO string
 */
function timestampToString(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  if (timestamp.toDate) return timestamp.toDate().toISOString();
  return timestamp;
}

/**
 * Sanitize data for Firestore (remove undefined values)
 */
function sanitizeForFirestore<T>(data: T): any {
  const sanitized: any = {};
  Object.entries(data as any).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeForFirestore(value);
      } else {
        sanitized[key] = value;
      }
    }
  });
  return sanitized;
}

// ==================== User Profile ====================

export const firestoreUserProfile = {
  /**
   * Get user profile from Firestore
   */
  get: async (userId: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: timestampToString(data.createdAt),
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Create or update user profile in Firestore
   */
  set: async (userId: string, profile: UserProfile): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const sanitized = sanitizeForFirestore(profile);
      await setDoc(docRef, {
        ...sanitized,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  /**
   * Update specific fields in user profile
   */
  update: async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const sanitized = sanitizeForFirestore(updates);
      await updateDoc(docRef, {
        ...sanitized,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Listen to user profile changes in real-time
   */
  subscribe: (userId: string, callback: (profile: UserProfile | null) => void) => {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          ...data,
          createdAt: timestampToString(data.createdAt),
        } as UserProfile);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in user profile subscription:', error);
      callback(null);
    });
  },
};

// ==================== Workout Sessions ====================

export const firestoreWorkouts = {
  /**
   * Get all workout sessions for a user
   */
  getAll: async (userId: string): Promise<WorkoutSession[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS),
        orderBy('startTime', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startTime: timestampToString(doc.data().startTime),
        endTime: doc.data().endTime ? timestampToString(doc.data().endTime) : undefined,
      })) as WorkoutSession[];
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },

  /**
   * Get a single workout session
   */
  get: async (userId: string, workoutId: string): Promise<WorkoutSession | null> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS, workoutId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          startTime: timestampToString(data.startTime),
          endTime: data.endTime ? timestampToString(data.endTime) : undefined,
        } as WorkoutSession;
      }
      return null;
    } catch (error) {
      console.error('Error fetching workout:', error);
      throw error;
    }
  },

  /**
   * Add a new workout session
   */
  add: async (userId: string, workout: WorkoutSession): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS, workout.id);
      const sanitized = sanitizeForFirestore(workout);
      await setDoc(docRef, {
        ...sanitized,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  },

  /**
   * Update a workout session
   */
  update: async (userId: string, workoutId: string, updates: Partial<WorkoutSession>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS, workoutId);
      const sanitized = sanitizeForFirestore(updates);
      await updateDoc(docRef, {
        ...sanitized,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },

  /**
   * Delete a workout session
   */
  delete: async (userId: string, workoutId: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS, workoutId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  /**
   * Get recent workouts
   */
  getRecent: async (userId: string, limitCount: number = 10): Promise<WorkoutSession[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS),
        orderBy('startTime', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startTime: timestampToString(doc.data().startTime),
        endTime: doc.data().endTime ? timestampToString(doc.data().endTime) : undefined,
      })) as WorkoutSession[];
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
      throw error;
    }
  },

  /**
   * Subscribe to workout changes
   */
  subscribe: (userId: string, callback: (workouts: WorkoutSession[]) => void) => {
    const q = query(
      collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS),
      orderBy('startTime', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const workouts = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startTime: timestampToString(doc.data().startTime),
        endTime: doc.data().endTime ? timestampToString(doc.data().endTime) : undefined,
      })) as WorkoutSession[];
      callback(workouts);
    }, (error) => {
      console.error('Error in workouts subscription:', error);
      callback([]);
    });
  },
};

// ==================== Goals ====================

export const firestoreGoals = {
  /**
   * Get all goals for a user
   */
  getAll: async (userId: string): Promise<Goal[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: timestampToString(doc.data().createdAt),
        deadline: timestampToString(doc.data().deadline),
        completedAt: doc.data().completedAt ? timestampToString(doc.data().completedAt) : undefined,
      })) as Goal[];
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  /**
   * Add a new goal
   */
  add: async (userId: string, goal: Goal): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS, goal.id);
      const sanitized = sanitizeForFirestore(goal);
      await setDoc(docRef, sanitized);
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  },

  /**
   * Update a goal
   */
  update: async (userId: string, goalId: string, updates: Partial<Goal>): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS, goalId);
      const sanitized = sanitizeForFirestore(updates);
      await updateDoc(docRef, sanitized);
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  /**
   * Delete a goal
   */
  delete: async (userId: string, goalId: string): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS, goalId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  /**
   * Subscribe to goal changes
   */
  subscribe: (userId: string, callback: (goals: Goal[]) => void) => {
    const q = query(
      collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const goals = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: timestampToString(doc.data().createdAt),
        deadline: timestampToString(doc.data().deadline),
        completedAt: doc.data().completedAt ? timestampToString(doc.data().completedAt) : undefined,
      })) as Goal[];
      callback(goals);
    }, (error) => {
      console.error('Error in goals subscription:', error);
      callback([]);
    });
  },
};

// ==================== Personal Records ====================

export const firestorePersonalRecords = {
  /**
   * Get all personal records for a user
   */
  getAll: async (userId: string): Promise<PersonalRecord[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.PERSONAL_RECORDS),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: timestampToString(doc.data().date),
      })) as PersonalRecord[];
    } catch (error) {
      console.error('Error fetching personal records:', error);
      throw error;
    }
  },

  /**
   * Add a new personal record
   */
  add: async (userId: string, record: PersonalRecord): Promise<void> => {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.PERSONAL_RECORDS, record.id);
      const sanitized = sanitizeForFirestore(record);
      await setDoc(docRef, sanitized);
    } catch (error) {
      console.error('Error adding personal record:', error);
      throw error;
    }
  },

  /**
   * Get records for a specific exercise
   */
  getByExercise: async (userId: string, exerciseId: string): Promise<PersonalRecord[]> => {
    try {
      const q = query(
        collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.PERSONAL_RECORDS),
        where('exerciseId', '==', exerciseId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: timestampToString(doc.data().date),
      })) as PersonalRecord[];
    } catch (error) {
      console.error('Error fetching personal records by exercise:', error);
      throw error;
    }
  },
};

// ==================== Batch Operations ====================

export const firestoreBatch = {
  /**
   * Sync all local data to Firestore
   */
  syncAllData: async (
    userId: string,
    data: {
      profile?: UserProfile;
      workouts?: WorkoutSession[];
      goals?: Goal[];
      personalRecords?: PersonalRecord[];
    }
  ): Promise<void> => {
    try {
      const batch = writeBatch(db);

      // Sync profile
      if (data.profile) {
        const profileRef = doc(db, COLLECTIONS.USERS, userId);
        const sanitized = sanitizeForFirestore(data.profile);
        batch.set(profileRef, {
          ...sanitized,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      // Sync workouts
      if (data.workouts) {
        data.workouts.forEach(workout => {
          const workoutRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.WORKOUTS, workout.id);
          const sanitized = sanitizeForFirestore(workout);
          batch.set(workoutRef, sanitized);
        });
      }

      // Sync goals
      if (data.goals) {
        data.goals.forEach(goal => {
          const goalRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GOALS, goal.id);
          const sanitized = sanitizeForFirestore(goal);
          batch.set(goalRef, sanitized);
        });
      }

      // Sync personal records
      if (data.personalRecords) {
        data.personalRecords.forEach(record => {
          const recordRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.PERSONAL_RECORDS, record.id);
          const sanitized = sanitizeForFirestore(record);
          batch.set(recordRef, sanitized);
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error syncing all data:', error);
      throw error;
    }
  },
};

// ==================== Utility Functions ====================

/**
 * Check if user has data in Firestore
 */
export async function hasFirestoreData(userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking Firestore data:', error);
    return false;
  }
}

/**
 * Delete all user data from Firestore
 */
export async function deleteAllUserData(userId: string): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Delete user profile
    const profileRef = doc(db, COLLECTIONS.USERS, userId);
    batch.delete(profileRef);

    // Delete all subcollections (workouts, goals, personal records)
    // Note: Firestore doesn't delete subcollections automatically
    const collections = [COLLECTIONS.WORKOUTS, COLLECTIONS.GOALS, COLLECTIONS.PERSONAL_RECORDS];

    for (const collectionName of collections) {
      const q = query(collection(db, COLLECTIONS.USERS, userId, collectionName));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
    }

    await batch.commit();
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}
