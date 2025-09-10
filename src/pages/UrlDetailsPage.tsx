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
        try {
          const uptimeRes = await fetch(
            `/api/checks/${id}/uptime?period=day&startDate=${thirtyDaysAgo.toISOString()}&endDate=${now.toISOString()}`
          );
          if (uptimeRes.ok) {
            const uptimeJson: UptimeMetric[] = await uptimeRes.json();
            setUptimeData(uptimeJson);
          } else {
            console.warn("Failed to fetch uptime data, continuing without it");
            setUptimeData([]);
          }
        } catch (uptimeError) {
          console.warn("Error fetching uptime data:", uptimeError);
          setUptimeData([]);
        }

        // Fetch incidents
        try {
          const incidentsRes = await fetch(`/api/checks/${id}/incidents`);
          if (incidentsRes.ok) {
            const incidentsData: Incident[] = await incidentsRes.json();
            setIncidents(incidentsData);
          } else {
            console.warn("Failed to fetch incidents, continuing without them");
            setIncidents([]);
          }
        } catch (incidentsError) {
          console.warn("Error fetching incidents:", incidentsError);
          setIncidents([]);
        }
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
    <div className="max-w-6xl mx-auto p-6 bg-gray-700 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Detalhes de {urlDetails.name}
      </h1>
      <p className="text-gray-300 mb-6">URL: {urlDetails.url}</p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Uptime Recente
        </h2>
        {uptimeData.length > 0 ? (
          <UptimeChart
            data={uptimeData}
            title={`Uptime de ${urlDetails.name} (últimos 30 dias)`}
          />
        ) : (
          <p className="text-gray-300">
            Nenhum dado de uptime disponível para o período.
          </p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Timeline de Status (Últimas 24h)
        </h2>
        {history.length > 0 ? (
          <StatusTimeline checks={history} />
        ) : (
          <p className="text-gray-300">
            Nenhum check recente disponível para a timeline.
          </p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Histórico de Verificações
        </h2>
        {history.length > 0 ? (
          <div className="border border-gray-600 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full bg-gray-800">
                <thead className="sticky top-0 bg-gray-800 z-10">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-600 text-left text-white font-semibold">
                      Data/Hora
                    </th>
                    <th className="py-3 px-4 border-b border-gray-600 text-left text-white font-semibold">
                      Status HTTP
                    </th>
                    <th className="py-3 px-4 border-b border-gray-600 text-left text-white font-semibold">
                      Tempo de Resposta (ms)
                    </th>
                    <th className="py-3 px-4 border-b border-gray-600 text-left text-white font-semibold">
                      Online
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((check) => (
                    <tr
                      key={check.id}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4 border-b border-gray-600 text-gray-300 text-sm">
                        {new Date(check.checkedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600 text-gray-300 text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            check.status &&
                            check.status >= 200 &&
                            check.status < 300
                              ? "bg-green-100 text-green-800"
                              : check.status
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {check.status || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600 text-gray-300 text-sm">
                        {check.responseTime ? `${check.responseTime}ms` : "N/A"}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-600 text-gray-300 text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            check.isOnline
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {check.isOnline ? "Sim" : "Não"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-700 px-4 py-2 text-sm text-gray-400 border-t border-gray-600">
              Mostrando {history.length} verificações • Role para ver mais
            </div>
          </div>
        ) : (
          <p className="text-gray-300">
            Nenhum histórico de verificações disponível.
          </p>
        )}
      </div>

      <div className="mt-8">
        <AlertConfigurationForm monitoredUrlId={id!} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Histórico de Incidentes
        </h2>
        <IncidentHistory incidents={incidents} />
      </div>
    </div>
  );
};

export default UrlDetailsPage;
