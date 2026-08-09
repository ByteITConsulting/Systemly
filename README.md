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
lib/                  # Tipos, catálogo de componentes e cenários de treino
```

## Ideias para evoluir

- Salvar/carregar diagramas (localStorage ou backend).
- Exportar também como JSON/SVG editável.
- Adicionar mais cenários e um modo "cronometrado" para simular entrevistas.
- Validação mais rica do checklist (ex: exigir uma conexão específica entre
  dois tipos de componente, não só a presença da peça).
