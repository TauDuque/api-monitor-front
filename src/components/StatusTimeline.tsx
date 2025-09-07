// src/components/StatusTimeline.tsx
import React from "react";

interface URLCheck {
  id: string;
  isOnline: boolean;
  checkedAt: string; // String de data do backend
}

interface StatusTimelineProps {
  checks: URLCheck[];
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ checks }) => {
  // Limitar a exibição a um número razoável de checks para não sobrecarregar
  const displayChecks = checks.slice(0, 100); // Ex: últimos 100 checks

  return (
    <div className="flex flex-wrap gap-0.5 p-2 bg-gray-200 rounded-md">
      {displayChecks.map((check) => (
        <div
          key={check.id}
          title={`Checked at: ${new Date(check.checkedAt).toLocaleString()} - Status: ${check.isOnline ? "Online" : "Offline"}`}
          className={`w-2 h-4 rounded-sm ${check.isOnline ? "bg-green-500" : "bg-red-500"}`}
        ></div>
      ))}
      {checks.length > displayChecks.length && (
        <span className="text-sm text-gray-600 ml-2">
          ...e mais {checks.length - displayChecks.length} checks
        </span>
      )}
    </div>
  );
};

export default StatusTimeline;
