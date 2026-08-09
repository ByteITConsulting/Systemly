import { ComponentType } from "./types";

export const COMPONENT_TYPES: ComponentType[] = [
  { id: "client", label: "Cliente", glyph: "USR", category: "client", hint: "Navegador, app mobile ou usuário final" },
  { id: "cdn", label: "CDN", glyph: "CDN", category: "network", hint: "Distribui conteúdo estático perto do usuário" },
  { id: "load-balancer", label: "Load Balancer", glyph: "LB", category: "network", hint: "Distribui tráfego entre instâncias" },
  { id: "api-gateway", label: "API Gateway", glyph: "API", category: "network", hint: "Roteamento, rate limit, autenticação" },
  { id: "auth", label: "Auth Service", glyph: "AUTH", category: "compute", hint: "Autenticação e autorização" },
  { id: "web-server", label: "Web Server", glyph: "WEB", category: "compute", hint: "Serve páginas e assets" },
  { id: "app-server", label: "App Server", glyph: "APP", category: "compute", hint: "Lógica de negócio / backend" },
  { id: "microservice", label: "Microsserviço", glyph: "\u00B5S", category: "compute", hint: "Serviço independente e desacoplado" },
  { id: "queue", label: "Message Queue", glyph: "MQ", category: "compute", hint: "Processamento assíncrono (Kafka, SQS)" },
  { id: "cache", label: "Cache", glyph: "CH", category: "data", hint: "Redis / Memcached — leitura rápida" },
  { id: "sql-db", label: "SQL Database", glyph: "SQL", category: "data", hint: "Banco relacional — consistência forte" },
  { id: "nosql-db", label: "NoSQL Database", glyph: "NoSQL", category: "data", hint: "Banco não-relacional — escala horizontal" },
  { id: "storage", label: "Object Storage", glyph: "S3", category: "data", hint: "Arquivos, imagens, blobs" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  client: "Cliente",
  network: "Rede & Borda",
  compute: "Computação",
  data: "Dados",
};
