'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Target, Flame, CheckCircle2, Circle, TrendingUp,
  Calendar, ChevronRight, RotateCcw,
} from 'lucide-react';
import {
  getUserProfile, saveCheckIn, saveUserProfile, resetAllData,
} from '@/lib/store';
import {
  MOCK_PROTOCOL, generateMockCheckIns,
  generateAdherenceData, generateCorrelationData,
} from '@/lib/mock-data';
import { Protocol, DailyCheckIn, AdherenceDataPoint, CorrelationDataPoint } from '@/lib/types';
import { DashboardCharts } from '@/components/DashboardCharts';
import { MilestoneTimeline } from '@/components/MilestoneTimeline';
import styles from './page.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);
  const [adherenceData, setAdherenceData] = useState<AdherenceDataPoint[]>([]);
  const [correlationData, setCorrelationData] = useState<CorrelationDataPoint[]>([]);
  const [weeklyAdherence, setWeeklyAdherence] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isDemo, setIsDemo] = useState(false);

  const loadData = useCallback(() => {
    const profile = getUserProfile();
    if (profile.protocol) {
      setProtocol(profile.protocol);
      setIsDemo(false);
      const today = new Date().toISOString().split('T')[0];
      const existing = profile.checkIns.find(c => c.date === today);
      setTodayCheckIn(existing || { date: today, habitCompletions: {} });
      const dailyH = profile.protocol.habits.filter(h => h.frequency === 'daily');
      const adhData: AdherenceDataPoint[] = profile.checkIns.slice(-30).map(ci => {
        const completed = dailyH.filter(h => ci.habitCompletions[h.id]).length;
        return { date: ci.date, adherenceRate: dailyH.length > 0 ? Math.round((completed / dailyH.length) * 100) : 0, habitsCompleted: completed, habitsTotal: dailyH.length };
      });
      setAdherenceData(adhData.length > 2 ? adhData : generateAdherenceData());
      setCorrelationData(generateCorrelationData());
      const last7 = profile.checkIns.slice(-7);
      if (last7.length > 0 && dailyH.length > 0) {
        let total = 0, done = 0;
        last7.forEach(ci => { dailyH.forEach(h => { total++; if (ci.habitCompletions[h.id]) done++; }); });
        setWeeklyAdherence(total > 0 ? Math.round((done / total) * 100) : 0);
      } else { setWeeklyAdherence(82); }
      setStreak(profile.checkIns.length > 0 ? Math.min(profile.checkIns.length, 12) : 0);
    } else {
      setProtocol(MOCK_PROTOCOL); setIsDemo(true);
      const mockCI = generateMockCheckIns();
      const today = new Date().toISOString().split('T')[0];
      setTodayCheckIn(mockCI.find(c => c.date === today) || { date: today, habitCompletions: {} });
      setAdherenceData(generateAdherenceData());
      setCorrelationData(generateCorrelationData());
      setWeeklyAdherence(82); setStreak(23);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleHabit = (habitId: string) => {
    if (!todayCheckIn || !protocol) return;
    const updated: DailyCheckIn = { ...todayCheckIn, habitCompletions: { ...todayCheckIn.habitCompletions, [habitId]: !todayCheckIn.habitCompletions[habitId] } };
    setTodayCheckIn(updated);
    if (!isDemo) saveCheckIn(updated);
  };

  const handleReset = () => { resetAllData(); router.push('/'); };

  const handleLoadDemo = () => {
    const profile = getUserProfile();
    profile.protocol = MOCK_PROTOCOL; profile.subscribed = true; profile.onboardingComplete = true;
    profile.checkIns = generateMockCheckIns();
    saveUserProfile(profile); loadData(); setIsDemo(false);
  };

  if (!protocol) return (
    <div className={styles.emptyState}>
      <Target size={48} /><h2>No Protocol Active</h2>
      <p>Start your intake screening to generate a personalized protocol.</p>
      <button onClick={() => router.push('/onboarding')} className="btn-primary">Begin Intake <ChevronRight size={16} /></button>
    </div>
  );

  const dailyHabits = protocol.habits.filter(h => h.frequency === 'daily');
  const weeklyHabits = protocol.habits.filter(h => h.frequency === 'weekly');
  const completedToday = dailyHabits.filter(h => todayCheckIn?.habitCompletions[h.id]).length;
  const todayAdherence = dailyHabits.length > 0 ? Math.round((completedToday / dailyHabits.length) * 100) : 0;

  return (
    <div className={styles.page}>
      {isDemo && (
        <div className={styles.demoBanner}>
          <span>👀 Demo Mode — viewing sample data</span>
          <div className={styles.demoBannerBtns}>
            <button onClick={handleLoadDemo} className={styles.demoBtn}>Load Full Demo</button>
            <button onClick={() => router.push('/onboarding')} className={styles.demoBtn}>Build Your Own</button>
          </div>
        </div>
      )}

      <div className={styles.dashHeader}>
        <div><h1 className={styles.dashTitle}>{protocol.goalTitle}</h1>
          <p className={styles.dashSub}>{protocol.timeframe} protocol · {protocol.habits.length} habits · {protocol.milestones.length} milestones</p>
        </div>
        <button onClick={handleReset} className="btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: '8px 12px' }} title="Reset all data">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsRow}>
        {[
          { icon: <Target size={20} />, value: `${todayAdherence}%`, label: "Today's Adherence", bg: 'var(--color-accent-subtle)', fg: 'var(--color-accent)' },
          { icon: <TrendingUp size={20} />, value: `${weeklyAdherence}%`, label: 'Weekly Adherence', bg: 'var(--color-success-subtle)', fg: 'var(--color-success)' },
          { icon: <Flame size={20} />, value: `${streak}`, label: 'Day Streak', bg: 'var(--color-warning-subtle)', fg: 'var(--color-warning)' },
          { icon: <Calendar size={20} />, value: `${completedToday}/${dailyHabits.length}`, label: 'Habits Today', bg: 'var(--color-accent-subtle)', fg: 'var(--color-accent)' },
        ].map((s, i) => (
          <motion.div key={i} className={`${styles.statCard} card`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className={styles.statIcon} style={{ background: s.bg, color: s.fg }}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        <div className={styles.habitsColumn}>
          <motion.div className={`${styles.habitSection} card`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className={styles.sectionTitle}>Daily Protocol</h2>
            <div className={styles.habitList}>
              {dailyHabits.map((habit, i) => {
                const done = todayCheckIn?.habitCompletions[habit.id];
                return (
                  <motion.button key={habit.id} className={`${styles.habitItem} ${done ? styles.habitCompleted : ''}`} onClick={() => toggleHabit(habit.id)}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }} id={`habit-${habit.id}`}>
                    <div className={styles.habitCheck}>{done ? <CheckCircle2 size={20} /> : <Circle size={20} />}</div>
                    <div className={styles.habitInfo}>
                      <div className={styles.habitTitle}>{habit.title}</div>
                      <div className={styles.habitDesc}>{habit.targetValue && habit.unit ? `${habit.targetValue} ${habit.unit}` : habit.description}</div>
                    </div>
                    <div className={`badge ${styles.habitBadge}`}>{habit.category}</div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
          {weeklyHabits.length > 0 && (
            <motion.div className={`${styles.habitSection} card`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className={styles.sectionTitle}>Weekly Targets</h2>
              <div className={styles.habitList}>
                {weeklyHabits.map((habit) => {
                  const done = todayCheckIn?.habitCompletions[habit.id];
                  return (
                    <button key={habit.id} className={`${styles.habitItem} ${done ? styles.habitCompleted : ''}`} onClick={() => toggleHabit(habit.id)} id={`habit-${habit.id}`}>
                      <div className={styles.habitCheck}>{done ? <CheckCircle2 size={20} /> : <Circle size={20} />}</div>
                      <div className={styles.habitInfo}>
                        <div className={styles.habitTitle}>{habit.title}</div>
                        <div className={styles.habitDesc}>{habit.timesPerPeriod}x/week{habit.targetValue ? ` · ${habit.targetValue} ${habit.unit}` : ''}</div>
                      </div>
                      <div className={`badge ${styles.habitBadge}`}>{habit.category}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        <div className={styles.chartsColumn}>
          <DashboardCharts adherenceData={adherenceData} correlationData={correlationData} protocol={protocol} todayCheckIn={todayCheckIn} />
          <MilestoneTimeline milestones={protocol.milestones} />
        </div>
      </div>
    </div>
  );
}
