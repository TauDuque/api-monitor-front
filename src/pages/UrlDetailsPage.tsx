// src/pages/UrlDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UptimeChart from "../components/UptimeChart";
import StatusTimeline from "../components/StatusTimeline";
import AlertConfigurationForm from "../components/AlertConfigurationForm";
import IncidentHistory from "../components/IncidentHistory";

interface MonitoredURL {
  id: string;
  url: string;
  name: string;
  interval: number;
  active: boolean;
}

interface URLCheck {
  id: string;
  monitoredUrlId: string;
  status: number | null;
  responseTime: number | null;
  isOnline: boolean;
  checkedAt: string;
}

interface UptimeMetric {
  period_start: string;
  total_checks: number;
  online_checks: number;
  uptime_percentage: number;
}

interface Incident {
  id: string;
  type: string;
  description: string;
  startedAt: string;
  resolvedAt: string | null;
}

const UrlDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [urlDetails, setUrlDetails] = useState<MonitoredURL | null>(null);
  const [history, setHistory] = useState<URLCheck[]>([]);
  const [uptimeData, setUptimeData] = useState<UptimeMetric[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch URL details
        const urlRes = await fetch(`/api/monitored-urls/${id}`);
        if (!urlRes.ok) throw new Error("Failed to fetch URL details");
        const urlData: MonitoredURL = await urlRes.json();
        setUrlDetails(urlData);

        // Fetch history (e.g., last 24 hours)
        const now = new Date();
        const twentyFourHoursAgo = new Date(
          now.getTime() - 24 * 60 * 60 * 1000
        );
        const historyRes = await fetch(
          `/api/checks/${id}/history?startDate=${twentyFourHoursAgo.toISOString()}&endDate=${now.toISOString()}&take=200`
        ); // Limitar para timeline
        if (!historyRes.ok) throw new Error("Failed to fetch history");
        const historyData: URLCheck[] = await historyRes.json();
        setHistory(historyData);

        // Fetch uptime metrics (e.g., daily for last 30 days)
        const thirtyDaysAgo = new Date(
          now.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        const uptimeRes = await fetch(
          `/api/checks/${id}/uptime?period=day&startDate=${thirtyDaysAgo.toISOString()}&endDate=${now.toISOString()}`
        );
        if (!uptimeRes.ok) throw new Error("Failed to fetch uptime data");
        const uptimeJson: UptimeMetric[] = await uptimeRes.json();
        setUptimeData(uptimeJson);

        // Fetch incidents
        const incidentsRes = await fetch(`/api/checks/${id}/incidents`);
        if (!incidentsRes.ok) throw new Error("Failed to fetch incidents");
        const incidentsData: Incident[] = await incidentsRes.json();
        setIncidents(incidentsData);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Ocorreu um erro ao carregar os detalhes da URL.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <p>Carregando detalhes da URL...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;
  if (!urlDetails) return <p>URL não encontrada.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Detalhes de {urlDetails.name}</h1>
      <p className="text-gray-600 mb-6">URL: {urlDetails.url}</p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Uptime Recente</h2>
        {uptimeData.length > 0 ? (
          <UptimeChart
            data={uptimeData}
            title={`Uptime de ${urlDetails.name} (últimos 30 dias)`}
          />
        ) : (
          <p>Nenhum dado de uptime disponível para o período.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Timeline de Status (Últimas 24h)
        </h2>
        {history.length > 0 ? (
          <StatusTimeline checks={history} />
        ) : (
          <p>Nenhum check recente disponível para a timeline.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Histórico de Verificações
        </h2>
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Data/Hora</th>
                  <th className="py-2 px-4 border-b text-left">Status HTTP</th>
                  <th className="py-2 px-4 border-b text-left">
                    Tempo de Resposta (ms)
                  </th>
                  <th className="py-2 px-4 border-b text-left">Online</th>
                </tr>
              </thead>
              <tbody>
                {history.map((check) => (
                  <tr key={check.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {new Date(check.checkedAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {check.status || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {check.responseTime || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {check.isOnline ? "Sim" : "Não"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Nenhum histórico de verificações disponível.</p>
        )}
      </div>

      <div className="mt-8">
        <AlertConfigurationForm monitoredUrlId={id!} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Histórico de Incidentes</h2>
        <IncidentHistory incidents={incidents} />
      </div>
    </div>
  );
};

export default UrlDetailsPage;
