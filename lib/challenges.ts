import { Challenge } from "./types";

export const CHALLENGES: Challenge[] = [
  {
    id: "url-shortener",
    title: "Encurtador de URL",
    brief:
      "Projete um sistema que recebe uma URL longa e devolve uma URL curta, redirecionando milhões de acessos por dia.",
    constraints: [
      "100M de novas URLs por mês",
      "Leitura >> escrita (redirecionamentos são muito mais frequentes)",
      "Latência de redirecionamento baixa",
    ],
    checklist: [
      { id: "c1", label: "Camada de borda para distribuir carga", match: ["load-balancer", "cdn"] },
      { id: "c2", label: "Serviço de aplicação para gerar/resolver códigos", match: ["app-server", "microservice"] },
      { id: "c3", label: "Cache para redirecionamentos populares", match: ["cache"] },
      { id: "c4", label: "Banco de dados para persistir o mapeamento", match: ["sql-db", "nosql-db"] },
    ],
  },
  {
    id: "social-feed",
    title: "Feed de Rede Social",
    brief:
      "Projete o backend de um feed estilo Twitter/Instagram: usuários postam, seguem outros e veem um feed cronológico ou ranqueado.",
    constraints: [
      "Fan-out de posts para milhões de seguidores",
      "Feed deve carregar rápido (< 200ms)",
      "Mídia (fotos/vídeos) é pesada",
    ],
    checklist: [
      { id: "c1", label: "API Gateway na entrada das requisições", match: ["api-gateway"] },
      { id: "c2", label: "Serviço de autenticação separado", match: ["auth"] },
      { id: "c3", label: "Fila para processar fan-out de forma assíncrona", match: ["queue"] },
      { id: "c4", label: "Cache do feed pré-computado", match: ["cache"] },
      { id: "c5", label: "Storage de objetos para mídia", match: ["storage"] },
      { id: "c6", label: "CDN para servir mídia perto do usuário", match: ["cdn"] },
      { id: "c7", label: "Banco de dados para posts/relacionamentos", match: ["sql-db", "nosql-db"] },
    ],
  },
  {
    id: "chat-app",
    title: "Chat em Tempo Real",
    brief:
      "Projete um sistema de mensagens instantâneas 1:1 e em grupo, com entrega confiável e status online/offline.",
    constraints: [
      "Baixa latência de entrega",
      "Mensagens não podem se perder",
      "Milhões de conexões simultâneas",
    ],
    checklist: [
      { id: "c1", label: "Load balancer para distribuir conexões", match: ["load-balancer"] },
      { id: "c2", label: "Serviço de mensageria dedicado", match: ["microservice", "app-server"] },
      { id: "c3", label: "Fila para garantir entrega e ordenação", match: ["queue"] },
      { id: "c4", label: "Cache para presença/status online", match: ["cache"] },
      { id: "c5", label: "Banco de dados para histórico de mensagens", match: ["sql-db", "nosql-db"] },
    ],
  },
  {
    id: "ecommerce-cart",
    title: "E-commerce: Carrinho e Checkout",
    brief:
      "Projete o fluxo de carrinho de compras e checkout de um e-commerce de grande escala, incluindo pagamento e estoque.",
    constraints: [
      "Consistência forte no pagamento e estoque",
      "Picos de tráfego em promoções (Black Friday)",
      "Catálogo de produtos com alto volume de leitura",
    ],
    checklist: [
      { id: "c1", label: "CDN para catálogo/imagens de produtos", match: ["cdn"] },
      { id: "c2", label: "API Gateway centralizando as rotas", match: ["api-gateway"] },
      { id: "c3", label: "Cache para catálogo de produtos", match: ["cache"] },
      { id: "c4", label: "Fila para processar pedidos de forma assíncrona", match: ["queue"] },
      { id: "c5", label: "Microsserviço dedicado a pagamento", match: ["microservice"] },
      { id: "c6", label: "Banco relacional para pedidos/estoque (consistência)", match: ["sql-db"] },
    ],
  },
  {
    id: "free-form",
    title: "Modo Livre",
    brief: "Sem restrições — use o canvas para explorar qualquer arquitetura que você quiser desenhar.",
    constraints: [],
    checklist: [],
  },
];
