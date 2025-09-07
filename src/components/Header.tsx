// src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Monitoramento de APIs
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/settings" className="hover:underline">
              Configurações
            </Link>
          </li>
          {/* Adicione outros links aqui */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
