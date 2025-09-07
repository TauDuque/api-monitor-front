import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import "./index.css"; // Certifique-se de que o CSS principal está importado

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
