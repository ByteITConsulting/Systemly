# Systemly — Treino de System Design

App web (Next.js + SCSS) para treinar system design de forma visual: arraste
componentes de arquitetura para um canvas estilo "planta de engenharia",
conecte-os, monte cenários guiados e exporte o resultado como PNG.

## Funcionalidades

- **Drag & drop** de 13 componentes (cliente, CDN, load balancer, API
  gateway, auth, web/app server, microsserviço, fila, cache, SQL, NoSQL,
  object storage), organizados por categoria.
- **Conexões** entre componentes: ative "Conectar", clique em dois
  componentes para ligá-los. Cada conexão pode receber um rótulo (ex:
  "REST", "assíncrono", "cache miss") com duplo clique.
- **Edição inline**: duplo clique no nome de um componente para renomeá-lo.
- **Modo Treino**: escolha um cenário (encurtador de URL, feed social, chat
  em tempo real, e-commerce, ou modo livre) com restrições reais de
  entrevista e um checklist que se marca automaticamente conforme você monta
  a arquitetura — um guia de autoavaliação, não uma nota.
- **Exportar PNG**: baixe o diagrama completo (em alta resolução, 2x) para
  usar em anotações de estudo ou compartilhar.
- Visual "planta de engenharia" (systemly): grid técnico, traços
  ortogonais estilo circuito, tipografia monoespaçada para rótulos.

## Como rodar localmente

Requer [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:3000 no navegador.

Para gerar uma build de produção:

```bash
npm run build
npm start
```

## Estrutura

```
app/                 # App Router (layout, página, estilos globais)
components/          # Studio (orquestrador), Sidebar, Canvas, Toolbar, ChallengePanel
lib/                  # Tipos, catálogo de componentes, cenários de treino, SEO helpers
```

## SEO & Performance

### Production Deployment

Before deploying to production, set the `NEXT_PUBLIC_BASE_URL` environment variable:

```bash
# .env.local or your deployment platform
NEXT_PUBLIC_BASE_URL=https://systemly.app
```

This URL is critical for:
- **Canonical tags** — prevent duplicate content penalties
- **hreflang** — signal multi-language URLs to search engines
- **Sitemap & robots.txt** — enable search engine crawling
- **Open Graph tags** — proper social media previews
- **PWA manifest** — app installation and branding

### SEO Features Implemented

✅ **Canonical tags & hreflang** — multi-locale support (en, pt)  
✅ **Structured data** — Organization, WebSite, SoftwareApplication, LearningResource schemas  
✅ **Open Graph & Twitter Cards** — social media previews  
✅ **Robots meta & sitemap** — search engine discoverability  
✅ **PWA manifest** — app install + branding  
✅ **Performance** — optimized for Core Web Vitals (Lighthouse ≥90)  

### Deployment Checklist

After deploying to production:

1. **Set environment variables**
   ```bash
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

2. **Verify SEO files are served**
   - Visit `/robots.txt` — should list allowed paths and sitemap
   - Visit `/sitemap.xml` — should contain both `/en` and `/pt` entries
   - Visit `/pt` (or `/en`) and inspect `<head>` for canonical and hreflang tags

3. **Submit to search engines**
   - [Google Search Console](https://search.google.com/search-console) → "Sitemaps" → submit `/sitemap.xml`
   - [Bing Webmaster Tools](https://www.bing.com/webmasters) → "Sitemaps" → submit `/sitemap.xml`

4. **Verify social previews**
   - Share a URL on LinkedIn, Twitter, Facebook
   - Verify title, description, and image render correctly

5. **Run Lighthouse audit**
   - Use [Google PageSpeed Insights](https://pagespeed.web.dev)
   - Target: Lighthouse ≥90 on all pages

6. **Monitor search performance**
   - Check GSC → "Performance" for search impressions and CTR
   - Monitor crawl errors → should be zero

## Ideias para evoluir

- Salvar/carregar diagramas (localStorage ou backend).
- Exportar também como JSON/SVG editável.
- Adicionar mais cenários e um modo "cronometrado" para simular entrevistas.
- Validação mais rica do checklist (ex: exigir uma conexão específica entre
  dois tipos de componente, não só a presença da peça).
