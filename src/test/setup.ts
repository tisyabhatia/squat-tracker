import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test case
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Mock Firebase
vi.mock('../config/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return vi.fn(); // unsubscribe function
    }),
    signOut: vi.fn(),
  },
  db: {},
  googleProvider: {},
  appleProvider: {},
}));

// Mock localStorage with working implementation
const storage: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => storage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    storage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete storage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(storage).forEach(key => delete storage[key]);
  }),
  get length() {
    return Object.keys(storage).length;
  },
  key: vi.fn((index: number) => Object.keys(storage)[index] || null),
};

global.localStorage = localStorageMock as any;
