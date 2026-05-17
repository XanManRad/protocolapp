'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, Crosshair, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/lib/types';
import { saveProtocol } from '@/lib/store';
import styles from './page.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Protocol Intake Initialized. State your primary objective — the goal you want to reverse-engineer into a daily system.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<'screening' | 'generating' | 'complete'>('screening');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send to chat API
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Chat API failed');
      }

      const chatData = await chatResponse.json();
      const assistantContent = chatData.content;

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistantContent.replace('[SCREENING_COMPLETE]', '').trim(),
        timestamp: new Date().toISOString(),
      };

      const allMessages = [...updatedMessages, assistantMessage];
      setMessages(allMessages);

      // Check if screening is complete
      if (assistantContent.includes('[SCREENING_COMPLETE]')) {
        setPhase('generating');
        
        // Generate the protocol
        setTimeout(async () => {
          try {
            const genResponse = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversationHistory: allMessages.map(m => ({
                  role: m.role,
                  content: m.content,
                })),
              }),
            });

            if (!genResponse.ok) {
              throw new Error('Protocol generation failed');
            }

            const genData = await genResponse.json();
            saveProtocol(genData.protocol);
            setPhase('complete');

            // Navigate to paywall after a moment
            setTimeout(() => {
              router.push('/paywall');
            }, 2000);
          } catch (error) {
            console.error('Protocol generation error:', error);
            setMessages(prev => [...prev, {
              id: `error-${Date.now()}`,
              role: 'assistant',
              content: 'Error generating protocol. Please try again or check your API key configuration.',
              timestamp: new Date().toISOString(),
            }]);
            setPhase('screening');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Connection error. Ensure your GEMINI_API_KEY is set in .env.local and restart the dev server.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerIcon}>
            <Crosshair size={20} />
          </div>
          <div>
            <h1 className={styles.headerTitle}>Intake Screening</h1>
            <p className={styles.headerSub}>
              {phase === 'screening' && 'Answer each question precisely. Data drives your protocol.'}
              {phase === 'generating' && 'Generating your personalized protocol...'}
              {phase === 'complete' && 'Protocol generated successfully.'}
            </p>
          </div>
        </div>
        {/* Progress indicator */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: phase === 'screening'
                ? `${Math.min(90, Math.max(10, (messages.length / 12) * 100))}%`
                : '100%',
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        <div className={styles.messages}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                {msg.role === 'assistant' && (
                  <div className={styles.messageAvatar}>
                    <Crosshair size={14} />
                  </div>
                )}
                <div className={styles.messageBubble}>
                  <p>{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              className={`${styles.message} ${styles.aiMessage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.messageAvatar}>
                <Crosshair size={14} />
              </div>
              <div className={styles.messageBubble}>
                <div className={styles.typing}>
                  <span /><span /><span />
                </div>
              </div>
            </motion.div>
          )}

          {/* Generating overlay */}
          {phase === 'generating' && (
            <motion.div
              className={styles.generatingCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Loader2 size={28} className={styles.spinIcon} />
              <h3>Building Your Protocol</h3>
              <p>Reverse-engineering your goal into daily systems...</p>
            </motion.div>
          )}

          {/* Complete */}
          {phase === 'complete' && (
            <motion.div
              className={styles.completeCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Sparkles size={28} />
              <h3>Protocol Ready</h3>
              <p>Redirecting to your personalized system...</p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {phase === 'screening' && (
        <div className={styles.inputArea}>
          <div className={styles.inputInner}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              className={styles.input}
              disabled={isLoading}
              autoFocus
              id="chat-input"
            />
            <button
              onClick={sendMessage}
              className={styles.sendBtn}
              disabled={!input.trim() || isLoading}
              id="send-message"
            >
              {isLoading ? <Loader2 size={18} className={styles.spinIcon} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
