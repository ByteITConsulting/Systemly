import { StepType } from 'react-joyride';

export interface TutorialStep extends StepType {
  // i18n keys for dynamic translations
  titleKey?: string;
  contentKey?: string;
}

/**
 * Tutorial steps configuration for guided tour
 * Each step uses i18n keys (tutorial.step*.title, tutorial.step*.content)
 * to support multi-language (EN, PT) and dynamic updates
 */
export const getTutorialSteps = (t: (key: string) => string): TutorialStep[] => [
  {
    target: '[data-tour="sidebar"]',
    titleKey: 'tutorial.step1.title',
    contentKey: 'tutorial.step1.content',
    title: t('tutorial.step1.title'),
    content: t('tutorial.step1.content'),
    placement: 'right',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="sidebar-categories"]',
    titleKey: 'tutorial.step2.title',
    contentKey: 'tutorial.step2.content',
    title: t('tutorial.step2.title'),
    content: t('tutorial.step2.content'),
    placement: 'right',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="sidebar-drag-hint"]',
    titleKey: 'tutorial.step3.title',
    contentKey: 'tutorial.step3.content',
    title: t('tutorial.step3.title'),
    content: t('tutorial.step3.content'),
    placement: 'right',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="canvas"]',
    titleKey: 'tutorial.step4.title',
    contentKey: 'tutorial.step4.content',
    title: t('tutorial.step4.title'),
    content: t('tutorial.step4.content'),
    placement: 'left',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="canvas-connect"]',
    titleKey: 'tutorial.step5.title',
    contentKey: 'tutorial.step5.content',
    title: t('tutorial.step5.title'),
    content: t('tutorial.step5.content'),
    placement: 'left',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="toolbar"]',
    titleKey: 'tutorial.step6.title',
    contentKey: 'tutorial.step6.content',
    title: t('tutorial.step6.title'),
    content: t('tutorial.step6.content'),
    placement: 'bottom',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="toolbar-export"]',
    titleKey: 'tutorial.step7.title',
    contentKey: 'tutorial.step7.content',
    title: t('tutorial.step7.title'),
    content: t('tutorial.step7.content'),
    placement: 'bottom',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="challenge-panel"]',
    titleKey: 'tutorial.step8.title',
    contentKey: 'tutorial.step8.content',
    title: t('tutorial.step8.title'),
    content: t('tutorial.step8.content'),
    placement: 'left',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="challenge-scenarios"]',
    titleKey: 'tutorial.step9.title',
    contentKey: 'tutorial.step9.content',
    title: t('tutorial.step9.title'),
    content: t('tutorial.step9.content'),
    placement: 'left',
    spotlightPadding: 8,
  },
  {
    target: '[data-tour="challenge-checklist"]',
    titleKey: 'tutorial.step10.title',
    contentKey: 'tutorial.step10.content',
    title: t('tutorial.step10.title'),
    content: t('tutorial.step10.content'),
    placement: 'left',
    spotlightPadding: 8,
  },
];
