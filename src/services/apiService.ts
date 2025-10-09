/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/apiService.ts
// Serviço centralizado para requisições da API

import type { MonitoredURL, URLCheck, Incident, AlertConfig } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    // Para respostas vazias (como 204 No Content em DELETE), retorna void
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0" || response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Monitored URLs
  async getMonitoredUrls(): Promise<MonitoredURL[]> {
    return this.request<MonitoredURL[]>("/api/monitored-urls");
  }

  async getMonitoredUrl(id: string): Promise<MonitoredURL> {
    return this.request<MonitoredURL>(`/api/monitored-urls/${id}`);
  }

  async createMonitoredUrl(data: any): Promise<MonitoredURL> {
    return this.request<MonitoredURL>("/api/monitored-urls", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMonitoredUrl(id: string, data: any): Promise<MonitoredURL> {
    return this.request<MonitoredURL>(`/api/monitored-urls/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMonitoredUrl(id: string): Promise<void> {
    return this.request<void>(`/api/monitored-urls/${id}`, {
      method: "DELETE",
    });
  }

  // URL Checks
  async getUrlHistory(id: string, params?: any): Promise<URLCheck[]> {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request<URLCheck[]>(`/api/checks/${id}/history${queryString}`);
  }

  async getLatestChecks(): Promise<URLCheck[]> {
    return this.request<URLCheck[]>("/api/checks/latest");
  }

  async getUptimeMetrics(id: string, params: any): Promise<any> {
    const queryString = "?" + new URLSearchParams(params).toString();
    return this.request<any>(`/api/checks/${id}/uptime${queryString}`);
  }

  async getIncidents(id?: string): Promise<Incident[]> {
    const endpoint = id
      ? `/api/checks/${id}/incidents`
      : "/api/checks/incidents";
    return this.request<Incident[]>(endpoint);
  }

  // Alert Configurations
  async getAlertConfigs(): Promise<AlertConfig[]> {
    return this.request<AlertConfig[]>("/api/alert-configurations");
  }

  async getAlertConfigByUrl(urlId: string): Promise<AlertConfig | null> {
    return this.request<AlertConfig | null>(
      `/api/alert-configurations/url/${urlId}`
    );
  }

  async createAlertConfig(data: any): Promise<AlertConfig> {
    return this.request<AlertConfig>("/api/alert-configurations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAlertConfig(id: string, data: any): Promise<AlertConfig> {
    return this.request<AlertConfig>(`/api/alert-configurations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAlertConfig(id: string): Promise<void> {
    return this.request<void>(`/api/alert-configurations/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
export default apiService;
