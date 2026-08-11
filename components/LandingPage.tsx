'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './LandingPage.module.scss';

interface LandingPageProps {
  messages?: {
    landing: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
      features: {
        interactive: { title: string; description: string };
        challenges: { title: string; description: string };
        export: { title: string; description: string };
        tutorial: { title: string; description: string };
      };
      challenges: {
        title: string;
        description: string;
        urlShortener: string;
        urlShortenerDesc: string;
        socialFeed: string;
        socialFeedDesc: string;
        chat: string;
        chatDesc: string;
        ecommerce: string;
        ecommerceDesc: string;
      };
      cta: {
        button: string;
        secondary: string;
      };
      footer: {
        description: string;
        links: string;
        madeWith: string;
      };
    };
  };
}

export default function LandingPage({ messages }: LandingPageProps) {
  const [mounted, setMounted] = useState(false);
  const [detectedLocale, setDetectedLocale] = useState<'en' | 'pt'>('en');

  useEffect(() => {
    setMounted(true);
    // Detect browser language for CTA button
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith('pt')) {
      setDetectedLocale('pt');
    }
  }, []);

  // Default English messages if not provided
  const defaultMessages = {
    landing: {
      hero: {
        title: 'Master System Design',
        subtitle: 'Learn architecture through interactive visual design',
        description: 'Build, connect, and learn system architecture patterns by dragging components and solving real-world challenges.',
      },
      features: {
        interactive: {
          title: 'Interactive Canvas',
          description: 'Drag components to the canvas, connect them, and watch your system come to life in real-time.',
        },
        challenges: {
          title: 'Real-World Challenges',
          description: 'Learn from 5+ system design scenarios including URL Shortener, Social Feed, Chat, and E-commerce.',
        },
        export: {
          title: 'Export & Share',
          description: 'Export your diagrams as PNG images to save, share, and review your architectural decisions.',
        },
        tutorial: {
          title: 'Guided Tutorial',
          description: 'Follow step-by-step guided tutorials to learn system design patterns from scratch.',
        },
      },
      challenges: {
        title: 'Featured Challenges',
        description: 'Start with one of our curated challenges and learn industry-standard architecture patterns',
        urlShortener: 'URL Shortener',
        urlShortenerDesc: 'Design a service that converts long URLs to short ones',
        socialFeed: 'Social Feed',
        socialFeedDesc: 'Build a scalable social media feed with billions of users',
        chat: 'Chat Application',
        chatDesc: 'Design a real-time messaging system with global scale',
        ecommerce: 'E-commerce Platform',
        ecommerceDesc: 'Create a highly available shopping platform with billions in revenue',
      },
      cta: {
        button: 'Start Learning',
        secondary: 'View Tutorial',
      },
      footer: {
        description: 'Learn system design through interactive visual training. Build real-world architectures step by step.',
        links: 'Challenges',
        madeWith: 'Made with passion for engineers',
      },
    },
  };

  const t = messages?.landing || defaultMessages.landing;

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t.hero.title}</h1>
          <p className={styles.heroSubtitle}>{t.hero.subtitle}</p>
          <p className={styles.heroDescription}>{t.hero.description}</p>
          <div className={styles.heroActions}>
            <Link href={`/${detectedLocale}/`} className={styles.ctaButton}>
              {t.cta.button}
            </Link>
            <Link href={`/${detectedLocale}/#tutorial`} className={styles.secondaryButton}>
              {t.cta.secondary}
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <img 
            src="/Systemly/intro-logo.png" 
            alt="Systemly Logo"
            className={styles.heroImage}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>{t.features.interactive.title}</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✨</div>
              <h3>{t.features.interactive.title}</h3>
              <p>{t.features.interactive.description}</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>{t.features.challenges.title}</h3>
              <p>{t.features.challenges.description}</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>{t.features.export.title}</h3>
              <p>{t.features.export.description}</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3>{t.features.tutorial.title}</h3>
              <p>{t.features.tutorial.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className={styles.challenges} id="challenges">
        <div className={styles.challengesContainer}>
          <h2>{t.challenges.title}</h2>
          <p className={styles.challengesDescription}>{t.challenges.description}</p>
          <div className={styles.challengesGrid}>
            <div className={styles.challengeCard}>
              <div className={styles.challengeIcon}>🔗</div>
              <h3>{t.challenges.urlShortener}</h3>
              <p>{t.challenges.urlShortenerDesc}</p>
            </div>
            <div className={styles.challengeCard}>
              <div className={styles.challengeIcon}>📱</div>
              <h3>{t.challenges.socialFeed}</h3>
              <p>{t.challenges.socialFeedDesc}</p>
            </div>
            <div className={styles.challengeCard}>
              <div className={styles.challengeIcon}>💬</div>
              <h3>{t.challenges.chat}</h3>
              <p>{t.challenges.chatDesc}</p>
            </div>
            <div className={styles.challengeCard}>
              <div className={styles.challengeIcon}>🛒</div>
              <h3>{t.challenges.ecommerce}</h3>
              <p>{t.challenges.ecommerceDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaContent}>
          <h2>Ready to Build?</h2>
          <p>Start your system design journey today and master architecture patterns</p>
          <Link href={`/${detectedLocale}/`} className={styles.ctaButton}>
            {t.cta.button} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Systemly</h3>
            <p>{t.footer.description}</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="#challenges">Challenges</Link></li>
              <li><Link href={`/${detectedLocale}/#tutorial`}>Tutorial</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>{t.footer.madeWith}</p>
        </div>
      </footer>
    </div>
  );
}
