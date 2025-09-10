// src/hooks/useUrlDetails.ts
// Hook customizado para gerenciar detalhes de uma URL

import { useState, useEffect } from "react";
import type {
  MonitoredURL,
  URLCheck,
  UptimeMetric,
  Incident,
  UrlHistoryFilters,
  UptimeFilters,
} from "../types";
import { API_ENDPOINTS, DEFAULT_VALUES } from "../constants";
import { handleError } from "../utils";

export const useUrlDetails = (urlId: string) => {
  const [urlDetails, setUrlDetails] = useState<MonitoredURL | null>(null);
  const [history, setHistory] = useState<URLCheck[]>([]);
  const [uptimeData, setUptimeData] = useState<UptimeMetric[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUrlDetails = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.MONITORED_URLS}/${urlId}`);
      if (!response.ok) throw new Error("Failed to fetch URL details");
      const data: MonitoredURL = await response.json();
      setUrlDetails(data);
    } catch (err: unknown) {
      throw new Error(handleError(err));
    }
  };

  const fetchHistory = async (filters: UrlHistoryFilters = {}) => {
    try {
      const now = new Date();
      const startDate =
        filters.startDate ||
        new Date(
          now.getTime() - DEFAULT_VALUES.HISTORY_DAYS * 24 * 60 * 60 * 1000
        );
      const endDate = filters.endDate || now;
      const take = filters.take || DEFAULT_VALUES.HISTORY_LIMIT;

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        take: take.toString(),
      });

      const response = await fetch(
        `${API_ENDPOINTS.CHECKS}/${urlId}/history?${params}`
      );
      if (!response.ok) throw new Error("Failed to fetch history");
      const data: URLCheck[] = await response.json();
      setHistory(data);
    } catch (err: unknown) {
      console.warn("Error fetching history:", handleError(err));
      setHistory([]);
    }
  };

  const fetchUptimeData = async (filters: UptimeFilters) => {
    try {
      const params = new URLSearchParams({
        period: filters.period,
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
      });

      const response = await fetch(
        `${API_ENDPOINTS.CHECKS}/${urlId}/uptime?${params}`
      );
      if (response.ok) {
        const data: UptimeMetric[] = await response.json();
        setUptimeData(data);
      } else {
        console.warn("Failed to fetch uptime data, continuing without it");
        setUptimeData([]);
      }
    } catch (err: unknown) {
      console.warn("Error fetching uptime data:", handleError(err));
      setUptimeData([]);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.CHECKS}/${urlId}/incidents`
      );
      if (response.ok) {
        const data: Incident[] = await response.json();
        setIncidents(data);
      } else {
        console.warn("Failed to fetch incidents, continuing without them");
        setIncidents([]);
      }
    } catch (err: unknown) {
      console.warn("Error fetching incidents:", handleError(err));
      setIncidents([]);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError("");

    try {
      await fetchUrlDetails();
      await fetchHistory();

      // Fetch uptime data for last 30 days
      const now = new Date();
      const thirtyDaysAgo = new Date(
        now.getTime() - DEFAULT_VALUES.UPTIME_DAYS * 24 * 60 * 60 * 1000
      );
      await fetchUptimeData({
        period: "day",
        startDate: thirtyDaysAgo,
        endDate: now,
      });

      await fetchIncidents();
    } catch (err: unknown) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlId) {
      fetchAllData();
    }
  }, [urlId]);

  return {
    urlDetails,
    history,
    uptimeData,
    incidents,
    loading,
    error,
    refetch: fetchAllData,
    fetchHistory,
    fetchUptimeData,
    fetchIncidents,
  };
};
