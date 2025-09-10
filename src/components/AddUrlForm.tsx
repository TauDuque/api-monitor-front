// src/components/AddUrlForm.tsx
import React, { useState } from "react";
import type { AddUrlFormData } from "../types";
import { DEFAULT_VALUES } from "../constants";
import { isValidUrl } from "../utils";

interface AddUrlFormProps {
  onUrlAdded: () => void; // Callback para quando uma URL for adicionada com sucesso
}

const AddUrlForm: React.FC<AddUrlFormProps> = ({ onUrlAdded }) => {
  const [formData, setFormData] = useState<AddUrlFormData>({
    name: "",
    url: "",
    interval: DEFAULT_VALUES.URL_INTERVAL,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validações
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      setLoading(false);
      return;
    }

    if (!formData.url.trim()) {
      setError("URL é obrigatória");
      setLoading(false);
      return;
    }

    if (!isValidUrl(formData.url)) {
      setError("URL inválida");
      setLoading(false);
      return;
    }

    if (formData.interval < DEFAULT_VALUES.MIN_URL_INTERVAL) {
      setError(
        `Intervalo deve ser pelo menos ${DEFAULT_VALUES.MIN_URL_INTERVAL} segundos`
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/monitored-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add URL");
      }

      setSuccess("URL adicionada com sucesso!");
      setFormData({
        name: "",
        url: "",
        interval: DEFAULT_VALUES.URL_INTERVAL,
      });
      onUrlAdded(); // Notifica o componente pai para recarregar a lista
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">
        Adicionar Nova URL para Monitoramento
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-white text-sm font-bold mb-2"
        >
          Nome:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 border-gray-600 placeholder-gray-400 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="url"
          className="block text-white text-sm font-bold mb-2"
        >
          URL:
        </label>
        <input
          type="url"
          id="url"
          name="url"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 border-gray-600 placeholder-gray-400 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com/api/health"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="interval"
          className="block text-white text-sm font-bold mb-2"
        >
          Intervalo (segundos):
        </label>
        <input
          type="number"
          id="interval"
          name="interval"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 border-gray-600 placeholder-gray-400 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={formData.interval}
          onChange={handleChange}
          min={DEFAULT_VALUES.MIN_URL_INTERVAL}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Adicionando..." : "Adicionar URL"}
      </button>
    </form>
  );
};

export default AddUrlForm;
