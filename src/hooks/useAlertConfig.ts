// src/hooks/useAlertConfig.ts
// Hook customizado para gerenciar configurações de alerta

import { useState, useEffect, useCallback } from "react";
import type { AlertConfig, AlertConfigFormData } from "../types";
import { API_ENDPOINTS } from "../constants";
import { handleError } from "../utils";

export const useAlertConfig = (monitoredUrlId: string) => {
  const [config, setConfig] = useState<AlertConfig>({
    monitoredUrlId,
    emailRecipient: "",
    webhookUrl: "",
    notifyOnDown: true,
    notifyOnUp: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_ENDPOINTS.ALERT_CONFIGS}/url/${monitoredUrlId}`
      );
      if (response.status === 404) {
        // Nenhuma configuração existente
        setConfig((prev) => ({ ...prev, id: undefined }));
      } else if (response.ok) {
        const data: AlertConfig = await response.json();
        setConfig(data);
      } else {
        throw new Error("Failed to fetch alert configuration");
      }
    } catch (err: unknown) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, [monitoredUrlId]);

  const saveConfig = async (
    configData: AlertConfigFormData
  ): Promise<boolean> => {
    setLoading(true);
    setError("");
    setSuccess("");

    const method = config.id ? "PUT" : "POST";
    const url = config.id
      ? `${API_ENDPOINTS.ALERT_CONFIGS}/${config.id}`
      : API_ENDPOINTS.ALERT_CONFIGS;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, ...configData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Falha ao salvar configuração de alerta."
        );
      }

      const savedConfig: AlertConfig = await response.json();
      setConfig(savedConfig);
      setSuccess("Configuração de alerta salva com sucesso!");
      return true;
    } catch (err: unknown) {
      setError(handleError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (updates: Partial<AlertConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    fetchConfig();
  }, [monitoredUrlId, fetchConfig]);

  return {
    config,
    loading,
    error,
    success,
    saveConfig,
    updateConfig,
    fetchConfig,
    clearMessages,
  };
};
