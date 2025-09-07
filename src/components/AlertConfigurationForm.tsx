// src/components/AlertConfigurationForm.tsx
import React, { useState, useEffect } from "react";

interface AlertConfig {
  id?: string; // Pode ser nulo se for uma nova configuração
  monitoredUrlId: string;
  emailRecipient: string;
  webhookUrl: string;
  notifyOnDown: boolean;
  notifyOnUp: boolean;
}

interface AlertConfigurationFormProps {
  monitoredUrlId: string;
}

const AlertConfigurationForm: React.FC<AlertConfigurationFormProps> = ({ monitoredUrlId }) => {
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

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/alert-configurations/url/${monitoredUrlId}`);
        if (response.status === 404) {
          // Nenhuma configuração existente
          setConfig((prev) => ({ ...prev, id: undefined }));
        } else if (response.ok) {
          const data: AlertConfig = await response.json();
          setConfig(data);
        } else {
          throw new Error("Failed to fetch alert configuration");
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar configurações de alerta.");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [monitoredUrlId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const method = config.id ? "PUT" : "POST";
    const url = config.id ? `/api/alert-configurations/${config.id}` : "/api/alert-configurations";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao salvar configuração de alerta.");
      }

      const savedConfig: AlertConfig = await response.json();
      setConfig(savedConfig); // Atualiza o ID se for uma nova criação
      setSuccess("Configuração de alerta salva com sucesso!");
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando configurações de alerta...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Configurações de Alerta</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="emailRecipient" className="block text-gray-700 text-sm font-bold mb-2">
            E-mail para Notificação:
          </label>
          <input
            type="email"
            id="emailRecipient"
            name="emailRecipient"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={config.emailRecipient || ""}
            onChange={handleChange}
            placeholder="seu.email@exemplo.com"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="webhookUrl" className="block text-gray-700 text-sm font-bold mb-2">
            Webhook URL:
          </label>
          <input
            type="url"
            id="webhookUrl"
            name="webhookUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={config.webhookUrl || ""}
            onChange={handleChange}
            placeholder="https://api.example.com/webhook"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="notifyOnDown"
            name="notifyOnDown"
            className="mr-2 leading-tight"
            checked={config.notifyOnDown}
            onChange={handleChange}
          />
          <label htmlFor="notifyOnDown" className="text-sm text-gray-700">
            Notificar quando a URL ficar OFFLINE
          </label>
        </div>
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="notifyOnUp"
            name="notifyOnUp"
            className="mr-2 leading-tight"
            checked={config.notifyOnUp}
            onChange={handleChange}
          />
          <label htmlFor="notifyOnUp" className="text-sm text-gray-700">
            Notificar quando a URL voltar ONLINE
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Configurações"}
        </button>
      </form>
    </div>
  );
};

export default AlertConfigurationForm;
