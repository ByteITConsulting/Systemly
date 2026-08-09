'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface TutorialContextType {
  isActive: boolean;
  isCompleted: boolean;
  startTutorial: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
  shouldAutoStart: boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const TUTORIAL_STORAGE_KEY = 'systemly-tutorial-completed';

// Default context value to prevent hydration errors
const defaultContextValue: TutorialContextType = {
  isActive: false,
  isCompleted: false,
  startTutorial: () => {},
  skipTutorial: () => {},
  resetTutorial: () => {},
  shouldAutoStart: false,
};

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    const hasCompleted = completed === 'true';
    setIsCompleted(hasCompleted);

    // Auto-start tutorial only on first visit (not completed)
    if (!hasCompleted) {
      setShouldAutoStart(true);
      setIsActive(true);
    }
  }, []);

  const startTutorial = () => {
    setIsActive(true);
  };

  const skipTutorial = () => {
    setIsActive(false);
    setIsCompleted(true);
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  };

  const resetTutorial = () => {
    setIsActive(true);
    setIsCompleted(false);
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  };

  const value: TutorialContextType = {
    isActive: isMounted ? isActive : false,
    isCompleted: isMounted ? isCompleted : false,
    startTutorial,
    skipTutorial,
    resetTutorial,
    shouldAutoStart: isMounted ? shouldAutoStart : false,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    // Return default value to prevent hydration errors
    return defaultContextValue;
  }
  return context;
};
