'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { AdherenceDataPoint, CorrelationDataPoint, Protocol, DailyCheckIn } from '@/lib/types';
import styles from '@/app/dashboard/page.module.css';

interface DashboardChartsProps {
  adherenceData: AdherenceDataPoint[];
  correlationData: CorrelationDataPoint[];
  protocol: Protocol;
  todayCheckIn: DailyCheckIn | null;
}

const tooltipStyle = {
  background: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'var(--color-text-primary)',
};

export function DashboardCharts({ adherenceData, correlationData, protocol, todayCheckIn }: DashboardChartsProps) {
  // Calculate category breakdown
  const catData = (() => {
    const cats: Record<string, { total: number; done: number }> = {};
    protocol.habits.forEach(h => {
      if (!cats[h.category]) cats[h.category] = { total: 0, done: 0 };
      cats[h.category].total++;
      if (todayCheckIn?.habitCompletions[h.id]) cats[h.category].done++;
    });
    return Object.entries(cats).map(([cat, d]) => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      completion: d.total > 0 ? Math.round((d.done / d.total) * 100) : 0,
    }));
  })();

  return (
    <>
      {/* Adherence Trend */}
      <motion.div className={`${styles.chartCard} card`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className={styles.sectionTitle}>Adherence Trend</h2>
        <p className={styles.chartSub}>Daily protocol compliance over the past 30 days</p>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={adherenceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-line-1)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--chart-line-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--chart-text)" fontSize={11}
                tickFormatter={(val) => { const d = new Date(val + 'T00:00:00'); return `${d.getMonth() + 1}/${d.getDate()}`; }} interval={4} />
              <YAxis stroke="var(--chart-text)" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown) => [`${value}%`, 'Adherence']}
                labelFormatter={(label) => new Date(label + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <Area type="monotone" dataKey="adherenceRate" stroke="var(--chart-line-1)" fill="url(#adherenceGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Correlation Engine */}
      <motion.div className={`${styles.chartCard} card`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2 className={styles.sectionTitle}>Correlation Engine</h2>
        <p className={styles.chartSub}>Protocol adherence vs. goal progress over time</p>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={correlationData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="corrGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-line-1)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--chart-line-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="corrGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-line-2)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--chart-line-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="week" stroke="var(--chart-text)" fontSize={11} interval={3} />
              <YAxis stroke="var(--chart-text)" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle}
                formatter={(value: unknown, name: unknown) => [`${value}%`, name === 'adherenceRate' ? 'Adherence' : 'Progress']} />
              <Area type="monotone" dataKey="adherenceRate" stroke="var(--chart-line-1)" fill="url(#corrGrad1)" strokeWidth={2} />
              <Area type="monotone" dataKey="progressMetric" stroke="var(--chart-line-2)" fill="url(#corrGrad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'var(--chart-line-1)' }} /><span>Adherence</span></div>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'var(--chart-line-2)' }} /><span>Progress</span></div>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div className={`${styles.chartCard} card`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <h2 className={styles.sectionTitle}>Category Breakdown</h2>
        <p className={styles.chartSub}>Today&apos;s completion by habit category</p>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--chart-text)" fontSize={11} />
              <YAxis stroke="var(--chart-text)" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown) => [`${value}%`, 'Completion']} />
              <Bar dataKey="completion" radius={[6, 6, 0, 0]}>
                {catData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? 'var(--chart-line-1)' : 'var(--chart-line-2)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </>
  );
}
