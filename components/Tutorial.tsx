'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTutorial } from './TutorialProvider';
import styles from './Tutorial.module.scss';

interface TutorialStep {
  target: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export const Tutorial: React.FC = () => {
  const t = useTranslations();
  const { isActive, skipTutorial } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TutorialStep[] = [
    {
      target: '[data-tour="sidebar"]',
      title: t('tutorial.step1.title'),
      content: t('tutorial.step1.content'),
      placement: 'right',
    },
    {
      target: '[data-tour="sidebar-categories"]',
      title: t('tutorial.step2.title'),
      content: t('tutorial.step2.content'),
      placement: 'right',
    },
    {
      target: '[data-tour="sidebar-drag-hint"]',
      title: t('tutorial.step3.title'),
      content: t('tutorial.step3.content'),
      placement: 'right',
    },
    {
      target: '[data-tour="canvas"]',
      title: t('tutorial.step4.title'),
      content: t('tutorial.step4.content'),
      placement: 'left',
    },
    {
      target: '[data-tour="toolbar-export"]',
      title: t('tutorial.step5.title'),
      content: t('tutorial.step5.content'),
      placement: 'bottom',
    },
    {
      target: '[data-tour="challenge-panel"]',
      title: t('tutorial.step6.title'),
      content: t('tutorial.step6.content'),
      placement: 'left',
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isActive || currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isActive, currentStep, isMounted, steps]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      skipTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isMounted || !isActive || steps.length === 0 || currentStep >= steps.length || !targetRect) {
    return null;
  }

  const step = steps[currentStep];
  const padding = 8;
  const tooltipWidth = 350;
  const tooltipHeight = 200;

  let tooltipTop = targetRect.top;
  let tooltipLeft = targetRect.left;

  if (step.placement === 'right') {
    tooltipLeft = targetRect.right + padding + 20;
    tooltipTop = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
  } else if (step.placement === 'left') {
    tooltipLeft = targetRect.left - tooltipWidth - padding - 20;
    tooltipTop = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
  } else if (step.placement === 'bottom') {
    tooltipTop = targetRect.bottom + padding + 20;
    tooltipLeft = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
  }

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={skipTutorial} />

      {/* Spotlight */}
      <div
        className={styles.spotlight}
        style={{
          top: targetRect.top - padding,
          left: targetRect.left - padding,
          width: targetRect.width + padding * 2,
          height: targetRect.height + padding * 2,
        }}
      />

      {/* Tooltip */}
      <div
        className={styles.tooltip}
        style={{
          top: tooltipTop,
          left: tooltipLeft,
          width: tooltipWidth,
        }}
      >
        <div className={styles.tooltipHeader}>
          <h3>{step.title}</h3>
          <button className={styles.closeBtn} onClick={skipTutorial}>
            ✕
          </button>
        </div>
        <p className={styles.tooltipContent}>{step.content}</p>
        <div className={styles.tooltipFooter}>
          <div className={styles.progress}>
            {currentStep + 1} / {steps.length}
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.prevBtn}
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              ← Back
            </button>
            <button className={styles.nextBtn} onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'Done' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
