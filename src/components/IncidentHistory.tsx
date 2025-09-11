// src/components/IncidentHistory.tsx
import React from "react";
import type { Incident } from "../types";

interface IncidentHistoryProps {
  incidents: Incident[];
}

const IncidentHistory: React.FC<IncidentHistoryProps> = ({ incidents }) => {
  if (incidents.length === 0) {
    return (
      <p className="text-gray-600">
        Nenhum incidente registrado para esta URL.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Tipo</th>
            <th className="py-2 px-4 border-b text-left">Descrição</th>
            <th className="py-2 px-4 border-b text-left">Início</th>
            <th className="py-2 px-4 border-b text-left">Fim</th>
            <th className="py-2 px-4 border-b text-left">Duração</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    incident.type === "DOWN"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {incident.type}
                </span>
              </td>
              <td className="py-2 px-4 border-b">{incident.description}</td>
              <td className="py-2 px-4 border-b">
                {new Date(incident.startedAt).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b">
                {incident.resolvedAt
                  ? new Date(incident.resolvedAt).toLocaleString()
                  : "Em aberto"}
              </td>
              <td className="py-2 px-4 border-b">
                {incident.resolvedAt
                  ? (
                      (new Date(incident.resolvedAt).getTime() -
                        new Date(incident.startedAt).getTime()) /
                      (1000 * 60)
                    ).toFixed(2) + " min"
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentHistory;
