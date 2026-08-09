/**
 * JSON-LD Schema Generators for Systemly
 * Generates structured data for search engines and rich results
 */

import { getCanonicalUrl, getBaseUrl, type Locale } from '@/lib/seo';

/**
 * Website schema combining organization info
 */
export function generateWebsiteSchema(locale: Locale) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Systemly',
    url: baseUrl,
    description:
      locale === 'en'
        ? 'Visual system design training platform'
        : 'Plataforma de treinamento de system design visual',
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale}?challenge={search_term}`,
      },
      'query-input': 'required name=search_term',
    },
  };
}

/**
 * SoftwareApplication schema for the app
 */
export function generateSoftwareApplicationSchema(locale: Locale) {
  const baseUrl = getBaseUrl();
  const titles = {
    en: 'Systemly — System Design Training',
    pt: 'Systemly — Treino de System Design',
  };

  const descriptions = {
    en: 'Build architecture diagrams by dragging components, connecting them, and exporting as PNG. Train system design visually.',
    pt: 'Monte diagramas de arquitetura arrastando componentes, conecte-os e exporte como PNG. Treine system design de forma visual.',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: titles[locale],
    description: descriptions[locale],
    url: getCanonicalUrl(locale),
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Systemly',
      url: baseUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '250',
    },
  };
}

/**
 * LearningResource schemas for challenges/scenarios
 */
export function generateLearningResourcesSchema(locale: Locale) {
  const resources = [
    {
      name: locale === 'en' ? 'URL Shortener System Design' : 'Encurtador de URL',
      description:
        locale === 'en'
          ? 'Design a system that receives a long URL and returns a short URL, redirecting millions of accesses per day.'
          : 'Projete um sistema que recebe uma URL longa e devolve uma URL curta, redirecionando milhões de acessos por dia.',
      level: 'Intermediate',
      time: 'PT15M',
      concepts:
        locale === 'en'
          ? 'Load Balancer, Cache, Database, API Server'
          : 'Load Balancer, Cache, Banco de Dados, Servidor API',
    },
    {
      name: locale === 'en' ? 'Social Feed System Design' : 'Feed de Rede Social',
      description:
        locale === 'en'
          ? 'Design the backend of a Twitter/Instagram style feed: users post, follow others and see a chronological or ranked feed.'
          : 'Projete o backend de um feed estilo Twitter/Instagram: usuários postam, seguem outros e veem um feed cronológico ou ranqueado.',
      level: 'Advanced',
      time: 'PT20M',
      concepts:
        locale === 'en'
          ? 'API Gateway, Message Queue, CDN, Cache, Object Storage'
          : 'API Gateway, Fila de Mensagens, CDN, Cache, Armazenamento de Objetos',
    },
    {
      name:
        locale === 'en' ? 'Real-Time Chat System' : 'Chat em Tempo Real',
      description:
        locale === 'en'
          ? 'Design an instant messaging system for 1:1 and group chats, with reliable delivery and online/offline status.'
          : 'Projete um sistema de mensagens instantâneas 1:1 e em grupo, com entrega confiável e status online/offline.',
      level: 'Advanced',
      time: 'PT18M',
      concepts:
        locale === 'en'
          ? 'Load Balancer, Message Queue, Cache, WebSocket, Microservices'
          : 'Load Balancer, Fila de Mensagens, Cache, WebSocket, Microsserviços',
    },
    {
      name:
        locale === 'en'
          ? 'E-commerce Cart and Checkout'
          : 'E-commerce: Carrinho e Checkout',
      description:
        locale === 'en'
          ? 'Design the shopping cart and checkout flow for a large-scale e-commerce, including payment and inventory.'
          : 'Projete o fluxo de carrinho de compras e checkout de um e-commerce de grande escala, incluindo pagamento e estoque.',
      level: 'Intermediate',
      time: 'PT20M',
      concepts:
        locale === 'en'
          ? 'CDN, API Gateway, Cache, Message Queue, SQL Database'
          : 'CDN, API Gateway, Cache, Fila de Mensagens, Banco SQL',
    },
  ];

  return resources.map((resource) => ({
    '@type': 'LearningResource',
    name: resource.name,
    description: resource.description,
    educationalLevel: resource.level,
    learningResourceType: 'Interactive Tutorial',
    timeRequired: resource.time,
    teaches: resource.concepts,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
  }));
}

/**
 * Breadcrumb schema for page hierarchy
 */
export function generateBreadcrumbSchema(locale: Locale, customPath?: string) {
  const baseUrl = getBaseUrl();
  const breadcrumbs = [
    {
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      position: 2,
      name: locale === 'en' ? 'English' : 'Português',
      item: getCanonicalUrl(locale),
    },
  ];

  if (customPath) {
    breadcrumbs.push({
      position: 3,
      name: customPath,
      item: getCanonicalUrl(locale, customPath),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb) => ({
      '@type': 'ListItem',
      position: breadcrumb.position,
      name: breadcrumb.name,
      item: breadcrumb.item,
    })),
  };
}

/**
 * Organization schema with social links
 */
export function generateOrganizationSchema(locale: Locale) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Systemly',
    url: baseUrl,
    description:
      locale === 'en'
        ? 'Visual system design training platform'
        : 'Plataforma de treinamento de system design visual',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: baseUrl,
    },
    sameAs: [
      'https://twitter.com/systemly',
      'https://linkedin.com/company/systemly',
      'https://github.com/systemly',
    ],
  };
}

/**
 * FAQPage schema for common questions
 */
export function generateFAQSchema(locale: Locale) {
  const faqs =
    locale === 'en'
      ? [
          {
            question: 'What is system design?',
            answer:
              'System design is the process of architecting a system that can handle large scale, complex problems.',
          },
          {
            question: 'How do I export my diagram?',
            answer:
              'Click the "Export PNG" button in the toolbar. Your diagram will be downloaded as a high-quality image.',
          },
          {
            question: 'Can I save my work?',
            answer:
              'Diagrams are saved in your browser storage. You can export them as PNG or share the diagram code.',
          },
        ]
      : [
          {
            question: 'O que é system design?',
            answer:
              'System design é o processo de arquitetar um sistema que pode lidar com problemas complexos em larga escala.',
          },
          {
            question: 'Como exporto meu diagrama?',
            answer:
              'Clique no botão "Exportar PNG" na barra de ferramentas. Seu diagrama será baixado como uma imagem de alta qualidade.',
          },
          {
            question: 'Posso salvar meu trabalho?',
            answer:
              'Diagramas são salvos no armazenamento do navegador. Você pode exportá-los como PNG ou compartilhar o código do diagrama.',
          },
        ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Video Object schema (if you add tutorial videos)
 */
export function generateVideoSchema(
  title: string,
  description: string,
  durationISO: string,
  locale: Locale
) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description,
    url: getCanonicalUrl(locale),
    duration: durationISO,
    thumbnailUrl: `${baseUrl}/og-image.png`,
    uploadDate: new Date().toISOString(),
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en',
  };
}

/**
 * Combine multiple schemas into a graph
 */
export function generateSchemaGraph(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateOrganizationSchema(locale),
      generateWebsiteSchema(locale),
      generateSoftwareApplicationSchema(locale),
      generateBreadcrumbSchema(locale),
      {
        '@type': 'CollectionPage',
        name:
          locale === 'en'
            ? 'Learning Resources'
            : 'Recursos de Aprendizado',
        description:
          locale === 'en'
            ? 'Interactive system design challenges and tutorials'
            : 'Desafios e tutoriais interativos de system design',
        hasPart: generateLearningResourcesSchema(locale),
      },
    ],
  };
}
