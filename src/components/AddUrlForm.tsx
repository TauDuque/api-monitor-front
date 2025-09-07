// src/components/AddUrlForm.tsx
import React, { useState } from "react";

interface AddUrlFormProps {
  onUrlAdded: () => void; // Callback para quando uma URL for adicionada com sucesso
}

const AddUrlForm: React.FC<AddUrlFormProps> = ({ onUrlAdded }) => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [interval, setInterval] = useState(60); // Padrão: 60 segundos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/monitored-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, name, interval }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add URL");
      }

      setSuccess("URL adicionada com sucesso!");
      setUrl("");
      setName("");
      setInterval(60);
      onUrlAdded(); // Notifica o componente pai para recarregar a lista
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-xl font-semibold mb-4">
        Adicionar Nova URL para Monitoramento
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nome:
        </label>
        <input
          type="text"
          id="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="url"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          URL:
        </label>
        <input
          type="url"
          id="url"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/api/health"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="interval"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Intervalo (segundos):
        </label>
        <input
          type="number"
          id="interval"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={interval}
          onChange={(e) => setInterval(parseInt(e.target.value))}
          min="10" // Mínimo de 10 segundos conforme validação do backend
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
