// src/layouts/MainLayout.tsx
import React from "react";
import Header from "../components/Header";
// import Sidebar from '../components/Sidebar'; // Descomente se for usar Sidebar

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {/* <Sidebar /> */} {/* Descomente se for usar Sidebar */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
