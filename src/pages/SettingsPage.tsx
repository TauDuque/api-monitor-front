// src/pages/SettingsPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import AddUrlForm from "../components/AddUrlForm";
import UrlListItem from "../components/UrlListItem";
import apiService from "../services/apiService";

interface MonitoredURL {
  id: string;
  url: string;
  name: string;
  interval: number;
  active: boolean;
}

const SettingsPage: React.FC = () => {
  const [urls, setUrls] = useState<MonitoredURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data: MonitoredURL[] = await apiService.getMonitoredUrls();
      setUrls(data);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao carregar URLs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleDeleteUrl = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta URL?")) {
      return;
    }
    try {
      await apiService.deleteMonitoredUrl(id);
      fetchUrls(); // Recarrega a lista após a exclusão
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao excluir URL.");
    }
  };

  const handleEditUrl = (url: MonitoredURL) => {
    // Implementar lógica de edição aqui.
    // Por enquanto, apenas um console.log
    console.log("Editar URL:", url);
    alert("Funcionalidade de edição será implementada em breve!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Configurações de URLs
      </h1>

      <AddUrlForm onUrlAdded={fetchUrls} />

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        URLs Monitoradas
      </h2>
      {loading && <p className="text-gray-600">Carregando URLs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && urls.length === 0 && !error && (
        <p className="text-gray-600">
          Nenhuma URL monitorada ainda. Adicione uma acima!
        </p>
      )}
      <div className="space-y-4">
        {urls.map((url) => (
          <UrlListItem
            key={url.id}
            url={url}
            onEdit={handleEditUrl}
            onDelete={handleDeleteUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
