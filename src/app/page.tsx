'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Crosshair, ArrowRight, Target, Brain, BarChart3, Zap, ChevronRight, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      {/* Floating Nav */}
      <nav className={styles.topNav}>
        <div className={styles.topNavInner}>
          <div className={styles.brand}>
            <Crosshair size={22} />
            <span>Protocol</span>
          </div>
          <div className={styles.topNavRight}>
            <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/onboarding" className="btn-primary" id="nav-start-cta">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="badge">
            <Zap size={12} /> AI-Powered Goal Deconstruction
          </div>
          <h1 className={styles.heroTitle}>
            Stop setting goals.<br />
            <span className="gradient-text">Start building systems.</span>
          </h1>
          <p className={styles.heroSub}>
            You don&apos;t rise to the level of your goals — you fall to the level of your
            systems. Protocol takes your ambitious visions and reverse-engineers them into
            automated daily protocols that actually work.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/onboarding" className="btn-primary" id="hero-start-cta" style={{ padding: '14px 32px', fontSize: 'var(--text-base)' }}>
              Build Your Protocol <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn-secondary" id="hero-demo-cta" style={{ padding: '14px 32px', fontSize: 'var(--text-base)' }}>
              See Demo Dashboard <ChevronRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Floating Metric Cards */}
        <div className={styles.floatingCards}>
          <motion.div
            className={`${styles.floatCard} card`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className={styles.floatCardIcon} style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }}>
              <Target size={20} />
            </div>
            <div>
              <div className={styles.floatCardValue}>87%</div>
              <div className={styles.floatCardLabel}>Protocol Adherence</div>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.floatCard} card`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <div className={styles.floatCardIcon} style={{ background: 'var(--color-success-subtle)', color: 'var(--color-success)' }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <div className={styles.floatCardValue}>23 Days</div>
              <div className={styles.floatCardLabel}>Current Streak</div>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.floatCard} card`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className={styles.floatCardIcon} style={{ background: 'var(--color-warning-subtle)', color: 'var(--color-warning)' }}>
              <Brain size={20} />
            </div>
            <div>
              <div className={styles.floatCardValue}>6 Habits</div>
              <div className={styles.floatCardLabel}>Daily Protocol</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className="section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.sectionTitle}>
              How <span className="gradient-text">Protocol</span> Works
            </h2>
            <p className={styles.sectionSub}>
              Three steps from vision to automated daily execution.
            </p>
          </motion.div>

          <div className={styles.steps}>
            {[
              {
                num: '01',
                icon: <Brain size={24} />,
                title: 'AI Intake Screening',
                desc: 'Tell our AI your goal. It runs a clinical screening — probing your current baseline, constraints, and available resources — to gather the data it needs.',
              },
              {
                num: '02',
                icon: <Crosshair size={24} />,
                title: 'Protocol Generation',
                desc: 'The AI reverse-engineers your goal into a structured protocol: specific daily habits, weekly milestones, and monthly checkpoints — all measurable.',
              },
              {
                num: '03',
                icon: <BarChart3 size={24} />,
                title: 'Track & Correlate',
                desc: 'Check off habits daily. Watch your adherence metrics, streaks, and progress correlations in real-time on a premium analytics dashboard.',
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className={`${styles.stepCard} card`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="section">
          <motion.div
            className={styles.ctaCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.ctaTitle}>
              Your 2026 system is waiting.
            </h2>
            <p className={styles.ctaSub}>
              Stop guessing. Let the AI build your protocol.
            </p>
            <Link href="/onboarding" className="btn-primary" id="bottom-start-cta" style={{ padding: '16px 40px', fontSize: 'var(--text-lg)' }}>
              Start Free Intake <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="section">
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <Crosshair size={18} />
              <span>Protocol</span>
            </div>
            <p className={styles.footerCopy}>© 2026 Protocol. Systems over goals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
