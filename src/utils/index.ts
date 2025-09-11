// src/utils/index.ts
// Funções utilitárias da aplicação

import type { URLCheck } from "../types";

/**
 * Formata uma data para exibição
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleString("pt-BR");
};

/**
 * Formata tempo de resposta para exibição
 */
export const formatResponseTime = (responseTime: number | null): string => {
  if (responseTime === null) return "N/A";
  return `${responseTime}ms`;
};

/**
 * Formata status HTTP para exibição
 */
export const formatHttpStatus = (status: number | null): string => {
  if (status === null) return "N/A";
  return status.toString();
};

/**
 * Calcula percentual de uptime
 */
export const calculateUptimePercentage = (checks: URLCheck[]): number => {
  if (checks.length === 0) return 0;
  const onlineChecks = checks.filter((check) => check.isOnline).length;
  return Math.round((onlineChecks / checks.length) * 100);
};

/**
 * Gera cor baseada no status
 */
export const getStatusColor = (isOnline: boolean | undefined): string => {
  if (isOnline === undefined) return "bg-yellow-500";
  return isOnline ? "bg-green-500" : "bg-red-500";
};

/**
 * Gera label baseado no status
 */
export const getStatusLabel = (isOnline: boolean | undefined): string => {
  if (isOnline === undefined) return "Aguardando";
  return isOnline ? "Online" : "Offline";
};

/**
 * Valida se uma URL é válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gera ID único simples
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function para otimizar performance
 */
export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Trata erros de forma consistente
 */
export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocorreu um erro inesperado";
};

/**
 * Formata bytes para exibição
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
