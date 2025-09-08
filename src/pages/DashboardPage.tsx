// src/pages/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getSocket } from "../services/socketService"; // Importe o serviço de socket

interface MonitoredURL {
  id: string;
  url: string;
  name: string;
  interval: number;
  active: boolean;
  // Adicione campos para o último status
  lastCheckStatus?: number | null;
  lastCheckResponseTime?: number | null;
  lastCheckIsOnline?: boolean;
  lastCheckedAt?: string;
}

interface UrlStatusUpdate {
  monitoredUrlId: string;
  status: number | null;
  responseTime: number | null;
  isOnline: boolean;
  checkedAt: string;
}

const DashboardPage: React.FC = () => {
  const [urls, setUrls] = useState<MonitoredURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const socket = getSocket(); // Obtenha a instância do socket

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/monitored-urls");
      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }
      const data: MonitoredURL[] = await response.json();

      // Para cada URL, tente buscar o último status (se houver)
      const urlsWithStatus = await Promise.all(
        data.map(async (url) => {
          try {
            const checkRes = await fetch(
              `/api/checks/${url.id}/history?take=1`
            );
            if (checkRes.ok) {
              const checks = await checkRes.json();
              if (checks.length > 0) {
                const lastCheck = checks[0];
                return {
                  ...url,
                  lastCheckStatus: lastCheck.status,
                  lastCheckResponseTime: lastCheck.responseTime,
                  lastCheckIsOnline: lastCheck.isOnline,
                  lastCheckedAt: lastCheck.checkedAt,
                };
              }
            }
          } catch (e) {
            console.error(`Error fetching last check for ${url.name}:`, e);
          }
          return url; // Retorna a URL sem status se houver erro
        })
      );

      setUrls(urlsWithStatus);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao carregar URLs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();

    // Listener para atualizações de status via WebSocket
    socket.on("urlStatusUpdate", (update: UrlStatusUpdate) => {
      console.log("Received real-time update:", update);
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === update.monitoredUrlId
            ? {
                ...url,
                lastCheckStatus: update.status,
                lastCheckResponseTime: update.responseTime,
                lastCheckIsOnline: update.isOnline,
                lastCheckedAt: update.checkedAt,
              }
            : url
        )
      );
    });

    // Limpeza do listener ao desmontar o componente
    return () => {
      socket.off("urlStatusUpdate");
    };
  }, [fetchUrls, socket]);

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white">
        Dashboard de Monitoramento
      </h1>
      <p className="text-gray-300 mb-8">
        Acompanhe o status em tempo real das suas URLs monitoradas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {urls.length === 0 && (
          <p className="col-span-full text-gray-300">
            Nenhuma URL monitorada. Adicione uma nas{" "}
            <Link to="/settings" className="text-blue-500 hover:underline">
              Configurações
            </Link>
            .
          </p>
        )}
        {urls.map((url) => (
          <div
            key={url.id}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  to={`/urls/${url.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {url.name}
                </Link>
              </h2>
              <p className="text-gray-300 text-sm mb-4">{url.url}</p>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  url.lastCheckIsOnline === true
                    ? "bg-green-500"
                    : url.lastCheckIsOnline === false
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              >
                {url.lastCheckIsOnline === true
                  ? "Online"
                  : url.lastCheckIsOnline === false
                  ? "Offline"
                  : "Aguardando"}
              </span>
              <div className="text-right">
                <p className="text-sm text-gray-300">
                  Status: {url.lastCheckStatus || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  Tempo:{" "}
                  {url.lastCheckResponseTime
                    ? `${url.lastCheckResponseTime}ms`
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-400">
                  Último check:{" "}
                  {url.lastCheckedAt
                    ? new Date(url.lastCheckedAt).toLocaleTimeString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
