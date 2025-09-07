// src/components/UrlListItem.tsx
import React from "react";
import { Link } from "react-router-dom"; // Importe Link

interface MonitoredURL {
  id: string;
  url: string;
  name: string;
  interval: number;
  active: boolean;
  // Adicione outros campos se necessário, como o último status
  // lastCheckStatus?: number | null;
  // lastCheckIsOnline?: boolean;
}

interface UrlListItemProps {
  url: MonitoredURL;
  onEdit: (url: MonitoredURL) => void;
  onDelete: (id: string) => void;
}

const UrlListItem: React.FC<UrlListItemProps> = ({ url, onEdit, onDelete }) => {
  // Para esta fase, o status será apenas 'Ativo' ou 'Inativo'.
  // O status de monitoramento real virá na próxima fase (Dia 9-10)
  const statusColor = url.active ? "bg-green-500" : "bg-red-500";
  const statusText = url.active ? "Ativo" : "Inativo";

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          <Link
            to={`/urls/${url.id}`}
            className="text-blue-600 hover:underline"
          >
            {url.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-600">{url.url}</p>
        <p className="text-xs text-gray-500">Intervalo: {url.interval}s</p>
      </div>
      <div className="flex items-center space-x-4">
        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${statusColor}`}
        >
          {statusText}
        </span>
        <button
          onClick={() => onEdit(url)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(url.id)}
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default UrlListItem;
