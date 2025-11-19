import { useEffect, useRef, useState } from 'react';
import { auth } from '../config/firebase';
import {
  firestoreUserProfile,
  firestoreWorkouts,
  firestoreGoals,
  firestorePersonalRecords,
  firestoreBatch,
  hasFirestoreData,
} from '../services/firestore';
import {
  userProfileStorage,
  workoutSessionStorage,
  goalStorage,
  personalRecordStorage,
} from '../utils/storage';

export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error';

export function useFirestoreSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const unsubscribersRef = useRef<(() => void)[]>([]);
  const isInitialSyncRef = useRef(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // User logged out - clean up listeners
        cleanupListeners();
        setSyncStatus('offline');
        isInitialSyncRef.current = false;
        return;
      }

      // User logged in - perform initial sync
      if (!isInitialSyncRef.current) {
        await performInitialSync(user.uid);
        isInitialSyncRef.current = true;
      }

      // Set up real-time listeners
      setupRealtimeSync(user.uid);
    });

    return () => {
      unsubscribeAuth();
      cleanupListeners();
    };
  }, []);

  const performInitialSync = async (userId: string) => {
    setSyncStatus('syncing');
    try {
      // Check if user has data in Firestore
      const hasData = await hasFirestoreData(userId);

      if (hasData) {
        // Load FROM Firestore (existing user, new device)
        console.log('📥 Loading data from Firestore...');

        const [profile, workouts, goals, personalRecords] = await Promise.all([
          firestoreUserProfile.get(userId),
          firestoreWorkouts.getAll(userId),
          firestoreGoals.getAll(userId),
          firestorePersonalRecords.getAll(userId),
        ]);

        // Update localStorage with Firestore data
        if (profile) {
          userProfileStorage.set(profile);
        }

        // Clear existing data and add from Firestore
        if (workouts.length > 0) {
          workouts.forEach(w => workoutSessionStorage.add(w));
        }

        if (goals.length > 0) {
          goals.forEach(g => goalStorage.add(g));
        }

        if (personalRecords.length > 0) {
          personalRecords.forEach(pr => personalRecordStorage.add(pr));
        }

        console.log('✅ Data loaded from Firestore');
        setSyncStatus('synced');
        setLastSyncTime(new Date());
      } else {
        // Sync TO Firestore (new user or migrating from localStorage)
        console.log('📤 Syncing local data to Firestore...');

        const localProfile = userProfileStorage.get();
        const localWorkouts = workoutSessionStorage.getAll();
        const localGoals = goalStorage.getAll();
        const localPRs = personalRecordStorage.getAll();

        if (localProfile || localWorkouts.length > 0 || localGoals.length > 0 || localPRs.length > 0) {
          await firestoreBatch.syncAllData(userId, {
            profile: localProfile || undefined,
            workouts: localWorkouts,
            goals: localGoals,
            personalRecords: localPRs,
          });
          console.log('✅ Local data synced to Firestore');
          setSyncStatus('synced');
          setLastSyncTime(new Date());
        } else {
          // No local data either - fresh start
          setSyncStatus('synced');
        }
      }
    } catch (error) {
      console.error('❌ Firestore sync error:', error);
      setSyncStatus('error');
    }
  };

  const setupRealtimeSync = (userId: string) => {
    // Clean up any existing listeners first
    cleanupListeners();

    try {
      // Listen to profile changes
      const unsubscribeProfile = firestoreUserProfile.subscribe(userId, (profile) => {
        if (profile) {
          userProfileStorage.set(profile);
          console.log('🔄 Profile updated from Firestore');
        }
      });

      // Listen to workout changes
      const unsubscribeWorkouts = firestoreWorkouts.subscribe(userId, (workouts) => {
        // BUG FIX: Actually save Firestore data to localStorage to update UI
        if (workouts && workouts.length > 0) {
          // Clear existing and replace with Firestore data (source of truth)
          const allWorkouts = workoutSessionStorage.getAll();
          const firestoreIds = new Set(workouts.map(w => w.id));

          // Keep local-only workouts, replace Firestore ones
          const localOnly = allWorkouts.filter(w => !firestoreIds.has(w.id));

          // Merge: Firestore workouts + local-only workouts
          const merged = [...workouts, ...localOnly].sort((a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          );

          // Save merged data
          merged.forEach(w => workoutSessionStorage.add(w));

          console.log('🔄 Workouts updated from Firestore:', workouts.length);
        }
        setLastSyncTime(new Date());
        // Force page reload to update React state (since this is outside React context)
        window.dispatchEvent(new Event('storage'));
      });

      // Listen to goal changes
      const unsubscribeGoals = firestoreGoals.subscribe(userId, (goals) => {
        // BUG FIX: Actually save Firestore data to localStorage
        if (goals && goals.length > 0) {
          goals.forEach(g => goalStorage.add(g));
          console.log('🔄 Goals updated from Firestore:', goals.length);
        }
        setLastSyncTime(new Date());
        window.dispatchEvent(new Event('storage'));
      });

      // Store unsubscribe functions
      unsubscribersRef.current = [
        unsubscribeProfile,
        unsubscribeWorkouts,
        unsubscribeGoals,
      ];

      console.log('👂 Real-time sync listeners active');
    } catch (error) {
      console.error('❌ Error setting up real-time sync:', error);
      setSyncStatus('error');
    }
  };

  const cleanupListeners = () => {
    unsubscribersRef.current.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing listener:', error);
      }
    });
    unsubscribersRef.current = [];
  };

  return {
    syncStatus,
    lastSyncTime,
  };
}
