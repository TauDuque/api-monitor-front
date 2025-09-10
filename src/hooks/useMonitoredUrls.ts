// src/hooks/useMonitoredUrls.ts
// Hook customizado para gerenciar URLs monitoradas

import { useState, useEffect, useCallback } from "react";
import type { MonitoredURL, AddUrlFormData } from "../types";
import { API_ENDPOINTS } from "../constants";
import { handleError } from "../utils";

export const useMonitoredUrls = () => {
  const [urls, setUrls] = useState<MonitoredURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_ENDPOINTS.MONITORED_URLS);
      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }
      const data: MonitoredURL[] = await response.json();
      setUrls(data);
    } catch (err: unknown) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addUrl = useCallback(
    async (urlData: AddUrlFormData): Promise<boolean> => {
      try {
        const response = await fetch(API_ENDPOINTS.MONITORED_URLS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(urlData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add URL");
        }

        await fetchUrls(); // Recarrega a lista
        return true;
      } catch (err: unknown) {
        setError(handleError(err));
        return false;
      }
    },
    [fetchUrls]
  );

  const updateUrl = useCallback(
    async (id: string, urlData: Partial<AddUrlFormData>): Promise<boolean> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.MONITORED_URLS}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(urlData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update URL");
        }

        await fetchUrls(); // Recarrega a lista
        return true;
      } catch (err: unknown) {
        setError(handleError(err));
        return false;
      }
    },
    [fetchUrls]
  );

  const deleteUrl = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.MONITORED_URLS}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete URL");
        }

        await fetchUrls(); // Recarrega a lista
        return true;
      } catch (err: unknown) {
        setError(handleError(err));
        return false;
      }
    },
    [fetchUrls]
  );

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  return {
    urls,
    loading,
    error,
    fetchUrls,
    addUrl,
    updateUrl,
    deleteUrl,
  };
};
