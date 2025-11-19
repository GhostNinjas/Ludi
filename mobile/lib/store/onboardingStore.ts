import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface ChildProfile {
  name: string;
  age: number | null;
  gender: string | null;
  specialNeeds: string[];
}

interface OnboardingStore {
  // State
  isOnboardingComplete: boolean;
  childProfile: ChildProfile;

  // Actions
  setChildName: (name: string) => void;
  setChildAge: (age: number) => void;
  setChildGender: (gender: string) => void;
  setChildSpecialNeeds: (needs: string[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialChildProfile: ChildProfile = {
  name: '',
  age: null,
  gender: null,
  specialNeeds: [],
};

// Custom storage adapter that works on both web and native
const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(name);
      }
      return await AsyncStorage.getItem(name);
    } catch (e) {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(name, value);
      } else {
        await AsyncStorage.setItem(name, value);
      }
    } catch (e) {
      console.error('Error saving to storage', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(name);
      } else {
        await AsyncStorage.removeItem(name);
      }
    } catch (e) {
      console.error('Error removing from storage', e);
    }
  },
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      // Initial state
      isOnboardingComplete: false,
      childProfile: initialChildProfile,

      // Actions
      setChildName: (name) =>
        set((state) => ({
          childProfile: { ...state.childProfile, name },
        })),

      setChildAge: (age) =>
        set((state) => ({
          childProfile: { ...state.childProfile, age },
        })),

      setChildGender: (gender) =>
        set((state) => ({
          childProfile: { ...state.childProfile, gender },
        })),

      setChildSpecialNeeds: (needs) =>
        set((state) => ({
          childProfile: { ...state.childProfile, specialNeeds: needs },
        })),

      completeOnboarding: () =>
        set(() => ({
          isOnboardingComplete: true,
        })),

      resetOnboarding: () =>
        set(() => ({
          isOnboardingComplete: false,
          childProfile: initialChildProfile,
        })),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);
