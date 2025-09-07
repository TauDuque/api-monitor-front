// src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
      <h3 className="text-xl font-semibold mb-6">Navegação</h3>
      <nav>
        <ul>
          <li className="mb-2">
            <Link to="/" className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/settings"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Configurações
            </Link>
          </li>
          {/* Adicione mais itens de navegação aqui */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
