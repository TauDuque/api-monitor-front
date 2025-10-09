// src/config/api.ts
// Configuração centralizada da API

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Log para debug (remover depois)
export const debugApiConfig = () => {
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
};
