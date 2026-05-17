'use client';

import { motion } from 'framer-motion';
import { Milestone } from '@/lib/types';
import styles from '@/app/dashboard/page.module.css';

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  return (
    <motion.div className={`${styles.milestoneCard} card`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
      <h2 className={styles.sectionTitle}>Milestones</h2>
      <div className={styles.milestoneList}>
        {milestones.map((ms, i) => {
          const date = new Date(ms.targetDate);
          const isPast = date < new Date();
          const progress = ms.targetValue && ms.currentValue
            ? Math.min(100, Math.round((ms.currentValue / ms.targetValue) * 100))
            : ms.completed ? 100 : 0;

          return (
            <div key={ms.id} className={`${styles.milestone} ${ms.completed ? styles.milestoneComplete : ''}`}>
              <div className={styles.msTimeline}>
                <div className={`${styles.msDot} ${ms.completed ? styles.msDotComplete : isPast ? styles.msDotOverdue : ''}`} />
                {i < milestones.length - 1 && <div className={styles.msLine} />}
              </div>
              <div className={styles.msContent}>
                <div className={styles.msHeader}>
                  <span className={styles.msTitle}>{ms.title}</span>
                  <span className={styles.msDate}>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className={styles.msDesc}>{ms.description}</p>
                {ms.targetValue != null && (
                  <div className={styles.msProgress}>
                    <div className={styles.msProgressBar}>
                      <div className={styles.msProgressFill} style={{ width: `${progress}%` }} />
                    </div>
                    <span className={styles.msProgressLabel}>
                      {ms.currentValue ?? 0}/{ms.targetValue} {ms.unit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
