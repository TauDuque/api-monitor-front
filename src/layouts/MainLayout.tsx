// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { getSocket } from "../services/socketService";
// import Sidebar from '../components/Sidebar'; // Descomente se for usar Sidebar

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // Estado inicial
    setIsConnected(socket.connected);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {/* <Sidebar /> */} {/* Descomente se for usar Sidebar */}
        <main className="flex-1 p-6 bg-gray-800">{children}</main>
      </div>
      {/* Indicador de conectividade */}
      <div
        className={`fixed bottom-4 right-4 px-3 py-1 rounded-full text-white text-sm ${
          isConnected ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {isConnected ? "Conectado" : "Desconectado"}
      </div>
    </div>
  );
};

export default MainLayout;
