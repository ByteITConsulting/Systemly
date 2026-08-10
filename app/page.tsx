'use client';

import { useEffect } from 'react';
import { defaultLocale, type Locale } from '@/i18n.config';

// Root page that redirects to locale-specific pages
// basePath is handled by constructing the full path
export default function RootPage() {
  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    let locale: Locale = defaultLocale;
    
    // If browser language is Portuguese, redirect to /pt/
    if (browserLang && browserLang.toLowerCase().startsWith('pt')) {
      locale = 'pt';
    }
    
    // Get current path to preserve basePath
    const currentPath = window.location.pathname;
    const basePath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
    
    // Redirect to appropriate locale with basePath
    window.location.replace(`${basePath}${locale}/`);
  }, []);

  return null;
}
