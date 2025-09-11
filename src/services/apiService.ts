/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/apiService.ts
// Serviço centralizado para requisições da API

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

    return response.json();
  }

  // Monitored URLs
  async getMonitoredUrls() {
    return this.request("/api/monitored-urls");
  }

  async getMonitoredUrl(id: string) {
    return this.request(`/api/monitored-urls/${id}`);
  }

  async createMonitoredUrl(data: any) {
    return this.request("/api/monitored-urls", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMonitoredUrl(id: string, data: any) {
    return this.request(`/api/monitored-urls/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMonitoredUrl(id: string) {
    return this.request(`/api/monitored-urls/${id}`, {
      method: "DELETE",
    });
  }

  // URL Checks
  async getUrlHistory(id: string, params?: any) {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    return this.request(`/api/checks/${id}/history${queryString}`);
  }

  async getLatestChecks() {
    return this.request("/api/checks/latest");
  }

  async getUptimeMetrics(id: string, params: any) {
    const queryString = "?" + new URLSearchParams(params).toString();
    return this.request(`/api/checks/${id}/uptime${queryString}`);
  }

  async getIncidents(id?: string) {
    const endpoint = id
      ? `/api/checks/${id}/incidents`
      : "/api/checks/incidents";
    return this.request(endpoint);
  }

  // Alert Configurations
  async getAlertConfigurations() {
    return this.request("/api/alert-configurations");
  }

  async getAlertConfigurationByUrl(urlId: string) {
    return this.request(`/api/alert-configurations/url/${urlId}`);
  }

  async createAlertConfiguration(data: any) {
    return this.request("/api/alert-configurations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAlertConfiguration(id: string, data: any) {
    return this.request(`/api/alert-configurations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAlertConfiguration(id: string) {
    return this.request(`/api/alert-configurations/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
export default apiService;
