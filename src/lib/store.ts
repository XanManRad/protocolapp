// ============================================================
// Protocol App — localStorage Persistence Layer
// ============================================================

import { UserProfile, DailyCheckIn, Protocol } from './types';

const STORAGE_KEY = 'protocol_app_data';

function getDefaultProfile(): UserProfile {
  return {
    onboardingComplete: false,
    subscribed: false,
    protocol: null,
    checkIns: [],
    createdAt: new Date().toISOString(),
  };
}

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return getDefaultProfile();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile();
    return JSON.parse(raw) as UserProfile;
  } catch {
    return getDefaultProfile();
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function saveProtocol(protocol: Protocol): void {
  const profile = getUserProfile();
  profile.protocol = protocol;
  profile.onboardingComplete = true;
  saveUserProfile(profile);
}

export function unlockSubscription(): void {
  const profile = getUserProfile();
  profile.subscribed = true;
  saveUserProfile(profile);
}

export function saveCheckIn(checkIn: DailyCheckIn): void {
  const profile = getUserProfile();
  const existingIndex = profile.checkIns.findIndex(c => c.date === checkIn.date);
  if (existingIndex >= 0) {
    profile.checkIns[existingIndex] = checkIn;
  } else {
    profile.checkIns.push(checkIn);
  }
  saveUserProfile(profile);
}

export function getTodayCheckIn(): DailyCheckIn | null {
  const profile = getUserProfile();
  const today = new Date().toISOString().split('T')[0];
  return profile.checkIns.find(c => c.date === today) || null;
}

export function getAdherenceRate(days: number = 7): number {
  const profile = getUserProfile();
  if (!profile.protocol) return 0;
  
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const relevantCheckIns = profile.checkIns.filter(c => new Date(c.date) >= cutoff);
  
  if (relevantCheckIns.length === 0) return 0;

  const dailyHabits = profile.protocol.habits.filter(h => h.frequency === 'daily');
  if (dailyHabits.length === 0) return 0;
  
  let totalCompleted = 0;
  let totalPossible = 0;
  
  for (const checkIn of relevantCheckIns) {
    for (const habit of dailyHabits) {
      totalPossible++;
      if (checkIn.habitCompletions[habit.id]) {
        totalCompleted++;
      }
    }
  }
  
  return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
}

export function getCurrentStreak(): number {
  const profile = getUserProfile();
  if (!profile.protocol || profile.checkIns.length === 0) return 0;
  
  const dailyHabits = profile.protocol.habits.filter(h => h.frequency === 'daily');
  if (dailyHabits.length === 0) return 0;

  const sorted = [...profile.checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sorted.length; i++) {
    const checkDate = new Date(sorted[i].date);
    const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    
    if (checkDate.toISOString().split('T')[0] !== expectedDate.toISOString().split('T')[0]) {
      break;
    }
    
    const completedCount = dailyHabits.filter(h => sorted[i].habitCompletions[h.id]).length;
    const adherence = completedCount / dailyHabits.length;
    
    if (adherence >= 0.5) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
