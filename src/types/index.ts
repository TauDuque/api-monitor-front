// src/types/index.ts
// Tipagens centralizadas da aplicação

export interface MonitoredURL {
  id: string;
  url: string;
  name: string;
  interval: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Campos para status em tempo real
  lastCheckStatus?: number | null;
  lastCheckResponseTime?: number | null;
  lastCheckIsOnline?: boolean;
  lastCheckedAt?: string;
}

export interface URLCheck {
  id: string;
  monitoredUrlId: string;
  status: number | null;
  responseTime: number | null;
  isOnline: boolean;
  checkedAt: string;
}

export interface UptimeMetric {
  period_start: string;
  total_checks: number;
  online_checks: number;
  uptime_percentage: number;
}

export interface Incident {
  id: string;
  monitoredUrlId: string;
  type: string;
  description: string | null;
  startedAt: string;
  resolvedAt: string | null;
}

export interface AlertConfig {
  id?: string;
  monitoredUrlId: string;
  emailRecipient: string;
  webhookUrl: string;
  notifyOnDown: boolean;
  notifyOnUp: boolean;
}

export interface UrlStatusUpdate {
  monitoredUrlId: string;
  status: number | null;
  responseTime: number | null;
  isOnline: boolean;
  checkedAt: string;
}

// Tipos para formulários
export interface AddUrlFormData {
  name: string;
  url: string;
  interval: number;
}

export interface AlertConfigFormData {
  emailRecipient: string;
  webhookUrl: string;
  notifyOnDown: boolean;
  notifyOnUp: boolean;
}

// Tipos para API responses
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Tipos para paginação
export interface PaginationParams {
  take?: number;
  skip?: number;
  startDate?: string;
  endDate?: string;
}

// Tipos para filtros
export interface UrlHistoryFilters {
  startDate?: Date;
  endDate?: Date;
  take?: number;
  skip?: number;
}

export interface UptimeFilters {
  period: "hour" | "day" | "week" | "month";
  startDate: Date;
  endDate: Date;
}
