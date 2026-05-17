'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Check, Zap, BarChart3, Bell, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { getUserProfile, unlockSubscription } from '@/lib/store';
import { Protocol } from '@/lib/types';
import styles from './page.module.css';

export default function PaywallPage() {
  const router = useRouter();
  const [protocol, setProtocol] = useState<Protocol | null>(null);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile.protocol) {
      setProtocol(profile.protocol);
    }
    // If already subscribed, skip to dashboard
    if (profile.subscribed) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleUnlock = () => {
    unlockSubscription();
    router.push('/dashboard');
  };

  const features = [
    { icon: <BarChart3 size={18} />, text: 'Interactive daily habit tracker' },
    { icon: <Sparkles size={18} />, text: 'AI-generated protocol with milestones' },
    { icon: <Zap size={18} />, text: 'Advanced compliance analytics' },
    { icon: <Bell size={18} />, text: 'Automated progress notifications' },
    { icon: <Shield size={18} />, text: 'Correlation engine (habits vs. outcomes)' },
  ];

  return (
    <div className={styles.page}>
      {/* Blurred preview background */}
      <div className={styles.previewBg}>
        {protocol && (
          <div className={styles.previewContent}>
            <div className={styles.previewGrid}>
              {/* Fake dashboard cards */}
              <div className={styles.previewCard}>
                <div className={styles.previewCardHeader}>Protocol Adherence</div>
                <div className={styles.previewCardValue}>87%</div>
              </div>
              <div className={styles.previewCard}>
                <div className={styles.previewCardHeader}>Current Streak</div>
                <div className={styles.previewCardValue}>12 Days</div>
              </div>
              <div className={styles.previewCard}>
                <div className={styles.previewCardHeader}>Habits Today</div>
                <div className={styles.previewCardValue}>4/6</div>
              </div>
              {/* Fake habit list */}
              <div className={`${styles.previewCard} ${styles.previewCardWide}`}>
                <div className={styles.previewCardHeader}>Daily Protocol</div>
                {protocol.habits.slice(0, 4).map((habit) => (
                  <div key={habit.id} className={styles.previewHabit}>
                    <div className={styles.previewCheck} />
                    <span>{habit.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className={styles.overlay}>
        <motion.div
          className={styles.paywall}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.lockIcon}>
            <Lock size={24} />
          </div>

          <h1 className={styles.title}>
            Your {new Date().getFullYear()} System is Ready.
          </h1>

          {protocol && (
            <p className={styles.goalPreview}>
              <strong>{protocol.goalTitle}</strong> — {protocol.habits.length} habits, {protocol.milestones.length} milestones
            </p>
          )}

          <div className={styles.features}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className={styles.feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>

          <div className={styles.priceSection}>
            <div className={styles.price}>
              <span className={styles.priceAmount}>$39</span>
              <span className={styles.pricePeriod}>/year</span>
            </div>
            <p className={styles.priceNote}>That&apos;s $3.25/month — less than a coffee.</p>
          </div>

          <button onClick={handleUnlock} className={styles.unlockBtn} id="unlock-cta">
            Unlock Your Protocol <ArrowRight size={18} />
          </button>

          <p className={styles.disclaimer}>
            <Check size={14} /> 7-day free trial · Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
