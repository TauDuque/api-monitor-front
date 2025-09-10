// src/constants/index.ts
// Constantes da aplicação

export const API_ENDPOINTS = {
  MONITORED_URLS: "/api/monitored-urls",
  CHECKS: "/api/checks",
  ALERT_CONFIGS: "/api/alert-configurations",
} as const;

export const ROUTES = {
  DASHBOARD: "/",
  SETTINGS: "/settings",
  URL_DETAILS: "/urls/:id",
} as const;

export const DEFAULT_VALUES = {
  URL_INTERVAL: 60, // segundos
  MIN_URL_INTERVAL: 10, // segundos
  TIMEOUT: 5000, // milissegundos
  HISTORY_LIMIT: 200,
  UPTIME_DAYS: 30,
  HISTORY_DAYS: 24,
} as const;

export const STATUS_COLORS = {
  ONLINE: "bg-green-500",
  OFFLINE: "bg-red-500",
  PENDING: "bg-yellow-500",
  ERROR: "bg-gray-500",
} as const;

export const STATUS_LABELS = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  PENDING: "Aguardando",
  ERROR: "Erro",
} as const;

export const THEME_COLORS = {
  PRIMARY: "bg-blue-500",
  SECONDARY: "bg-gray-700",
  SUCCESS: "bg-green-500",
  ERROR: "bg-red-500",
  WARNING: "bg-yellow-500",
} as const;

export const SOCKET_EVENTS = {
  URL_STATUS_UPDATE: "urlStatusUpdate",
  CONNECT: "connect",
  DISCONNECT: "disconnect",
} as const;
