// src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center border-b border-gray-700">
      <Link to="/" className="text-2xl font-bold text-white">
        Monitoramento de APIs
      </Link>
      <nav className="px-8 py-2">
        <ul className="flex gap-20 list-none m-0 p-0">
          <li>
            <Link
              to="/"
              className="text-white no-underline px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Dashboard
            </Link>
          </li>
          <li className="text-gray-300 self-center">|</li>
          <li>
            <Link
              to="/settings"
              className="text-white no-underline px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
            >
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
