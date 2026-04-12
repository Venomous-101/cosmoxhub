'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cosmox_user_name';
const VISIT_KEY = 'cosmox_visit_count';

export function useUserGreeting() {
  const [userName, setUserName] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem(STORAGE_KEY);
    const storedVisits = parseInt(localStorage.getItem(VISIT_KEY) || '0');
    const newVisitCount = storedVisits + 1;

    localStorage.setItem(VISIT_KEY, String(newVisitCount));
    setVisitCount(newVisitCount);

    if (storedName) {
      setUserName(storedName);
      setShowWelcomeBack(true);
      setTimeout(() => setShowWelcomeBack(false), 4000);
    } else if (newVisitCount === 1) {
      setTimeout(() => setShowNamePrompt(true), 3000);
    }

    setIsReady(true);
  }, []);

  const saveName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem(STORAGE_KEY, trimmed);
    setUserName(trimmed);
    setShowNamePrompt(false);
    setShowWelcomeBack(true);
    setTimeout(() => setShowWelcomeBack(false), 4000);
  };

  const dismissPrompt = () => setShowNamePrompt(false);
  const dismissWelcome = () => setShowWelcomeBack(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedMessage = (name: string, visits: number) => {
    if (visits === 2) return `Great to see you again, ${name}!`;
    if (visits <= 5) return `Welcome back, ${name}! Ready to get things done?`;
    if (visits <= 15) return `Hey ${name}! Your tools are waiting. ⚡`;
    return `${name}, you're a CosmoxHub regular! 🌟`;
  };

  return {
    userName,
    showNamePrompt,
    showWelcomeBack,
    visitCount,
    isReady,
    saveName,
    dismissPrompt,
    dismissWelcome,
    getGreeting,
    getPersonalizedMessage,
  };
}
