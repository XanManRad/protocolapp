// ============================================================
// Protocol App — Mock Data for Dashboard Demo
// ============================================================

import { Protocol, DailyCheckIn, AdherenceDataPoint, CorrelationDataPoint } from './types';

export const MOCK_PROTOCOL: Protocol = {
  id: 'proto-5k-001',
  goalTitle: 'Sub-17 Minute 5K',
  goalDescription: 'Systematic progression from 19:30 baseline to sub-17:00 5K through structured periodization, posterior chain development, and metabolic conditioning.',
  timeframe: '10 months',
  createdAt: '2026-01-15T00:00:00Z',
  summary: 'Your current 19:30 PR with only 12mpw and no structured strength work leaves significant room for improvement through basic periodization alone. The ankle mobility deficit will be addressed through targeted dorsiflexion work integrated into your warm-up protocol. Progressive mileage build from 12 to 28mpw combined with twice-weekly speed sessions and posterior chain loading should yield the 2:30 improvement within the target window.',
  habits: [
    {
      id: 'protein-intake',
      title: 'Hit Protein Target',
      description: 'Supports muscle recovery and adaptation from increased training load.',
      frequency: 'daily',
      timesPerPeriod: 1,
      category: 'nutrition',
      unit: 'grams',
      targetValue: 160,
    },
    {
      id: 'easy-run',
      title: 'Easy Aerobic Run',
      description: 'Base mileage building at conversational pace (Zone 2).',
      frequency: 'daily',
      timesPerPeriod: 1,
      category: 'training',
      unit: 'miles',
      targetValue: 4,
    },
    {
      id: 'speed-session',
      title: 'Speed/Interval Session',
      description: 'VO2max development through structured interval work at 5K race pace or faster.',
      frequency: 'weekly',
      timesPerPeriod: 1,
      category: 'training',
      unit: 'session',
    },
    {
      id: 'tempo-run',
      title: 'Tempo Run',
      description: 'Lactate threshold development at comfortably hard pace.',
      frequency: 'weekly',
      timesPerPeriod: 1,
      category: 'training',
      unit: 'miles',
      targetValue: 4,
    },
    {
      id: 'leg-strength',
      title: 'Lower Body Resistance Training',
      description: 'Posterior chain and quad loading for power and injury prevention.',
      frequency: 'weekly',
      timesPerPeriod: 2,
      category: 'training',
      unit: 'session',
    },
    {
      id: 'ankle-mobility',
      title: 'Ankle Dorsiflexion Protocol',
      description: 'Targeted mobility work addressing left ankle restriction.',
      frequency: 'daily',
      timesPerPeriod: 1,
      category: 'recovery',
      unit: 'minutes',
      targetValue: 10,
    },
    {
      id: 'sleep-target',
      title: 'Sleep 7.5+ Hours',
      description: 'Minimum recovery sleep for adaptation to training stimulus.',
      frequency: 'daily',
      timesPerPeriod: 1,
      category: 'recovery',
      unit: 'hours',
      targetValue: 7.5,
    },
    {
      id: 'hydration',
      title: 'Hydration Target',
      description: 'Adequate hydration for performance and recovery optimization.',
      frequency: 'daily',
      timesPerPeriod: 1,
      category: 'nutrition',
      unit: 'oz',
      targetValue: 100,
    },
  ],
  milestones: [
    {
      id: 'ms-base-build',
      title: 'Base Building Complete',
      description: 'Consistently hitting 20mpw with no injury flare-ups.',
      targetDate: '2026-03-15T00:00:00Z',
      completed: true,
      targetValue: 20,
      currentValue: 22,
      unit: 'mpw',
    },
    {
      id: 'ms-first-race',
      title: 'First Time Trial',
      description: 'Benchmark 5K time trial to validate training progression.',
      targetDate: '2026-05-01T00:00:00Z',
      completed: true,
      targetValue: 18.5,
      currentValue: 18.2,
      unit: 'minutes',
    },
    {
      id: 'ms-peak-mileage',
      title: 'Peak Mileage Phase',
      description: 'Sustaining 28mpw with quality sessions.',
      targetDate: '2026-07-15T00:00:00Z',
      completed: false,
      targetValue: 28,
      currentValue: 24,
      unit: 'mpw',
    },
    {
      id: 'ms-taper',
      title: 'Race Prep & Taper',
      description: 'Structured taper with race simulation.',
      targetDate: '2026-10-01T00:00:00Z',
      completed: false,
    },
    {
      id: 'ms-goal-race',
      title: 'Goal Race: Sub-17',
      description: 'Target 5K race — sub-17:00 performance.',
      targetDate: '2026-11-15T00:00:00Z',
      completed: false,
      targetValue: 17,
      currentValue: 18.2,
      unit: 'minutes',
    },
  ],
};

/** Generate 30 days of mock check-in data */
export function generateMockCheckIns(): DailyCheckIn[] {
  const checkIns: DailyCheckIn[] = [];
  const today = new Date();
  const dailyHabits = MOCK_PROTOCOL.habits.filter(h => h.frequency === 'daily');

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const habitCompletions: Record<string, boolean> = {};
    for (const habit of dailyHabits) {
      // Simulate ~75-90% adherence with some realistic variance
      const baseChance = 0.82;
      const dayVariance = Math.sin(i * 0.7) * 0.1;
      habitCompletions[habit.id] = Math.random() < (baseChance + dayVariance);
    }

    // Weekly habits — check on appropriate days
    const dayOfWeek = date.getDay();
    const weeklyHabits = MOCK_PROTOCOL.habits.filter(h => h.frequency === 'weekly');
    for (const habit of weeklyHabits) {
      if (habit.id === 'speed-session' && dayOfWeek === 2) {
        habitCompletions[habit.id] = Math.random() < 0.85;
      } else if (habit.id === 'tempo-run' && dayOfWeek === 4) {
        habitCompletions[habit.id] = Math.random() < 0.80;
      } else if (habit.id === 'leg-strength' && (dayOfWeek === 1 || dayOfWeek === 5)) {
        habitCompletions[habit.id] = Math.random() < 0.75;
      }
    }

    checkIns.push({ date: dateStr, habitCompletions });
  }

  return checkIns;
}

/** Generate adherence trend data for charts */
export function generateAdherenceData(): AdherenceDataPoint[] {
  const checkIns = generateMockCheckIns();
  const dailyHabits = MOCK_PROTOCOL.habits.filter(h => h.frequency === 'daily');
  
  return checkIns.map(ci => {
    const completed = dailyHabits.filter(h => ci.habitCompletions[h.id]).length;
    return {
      date: ci.date,
      adherenceRate: Math.round((completed / dailyHabits.length) * 100),
      habitsCompleted: completed,
      habitsTotal: dailyHabits.length,
    };
  });
}

/** Generate correlation data (adherence vs progress) for the correlation engine chart */
export function generateCorrelationData(): CorrelationDataPoint[] {
  const data: CorrelationDataPoint[] = [];
  const weeks = 20;
  
  for (let i = 0; i < weeks; i++) {
    const weekNum = i + 1;
    // Adherence trends upward with noise
    const baseAdherence = 65 + (i / weeks) * 25;
    const adherence = Math.min(100, Math.max(40, baseAdherence + (Math.random() - 0.5) * 15));
    
    // Progress correlates with adherence but with lag
    const laggedAdherence = i > 2 ? 65 + ((i - 2) / weeks) * 25 : 60;
    const progress = Math.min(100, Math.max(20, laggedAdherence * 0.9 + (Math.random() - 0.5) * 10));
    
    data.push({
      week: `W${weekNum}`,
      adherenceRate: Math.round(adherence),
      progressMetric: Math.round(progress),
      label: `Week ${weekNum}`,
    });
  }
  
  return data;
}
