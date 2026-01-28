'use client';

import { useContext } from 'react';
import { useAuth } from './useAuth';
import { storage } from '@/lib/storage';

export function useUser() {
  const { user, updateProfile } = useAuth();

  const updateOnboarding = async (onboardingData: any) => {
    try {
      await updateProfile({
        ...onboardingData,
        isOnboarded: true,
      });
    } catch (error) {
      console.error('Error updating onboarding:', error);
      throw error;
    }
  };

  const updateUserPreferences = async (preferences: any) => {
    try {
      await updateProfile(preferences);
      storage.set('user_preferences', preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const getStreak = () => {
    return user?.streak || 0;
  };

  const getCurrentDay = () => {
    return user?.currentDay || 1;
  };

  return {
    user,
    updateOnboarding,
    updateUserPreferences,
    getStreak,
    getCurrentDay,
  };
}
