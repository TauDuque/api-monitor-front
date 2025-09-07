import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import UrlDetailsPage from "./pages/UrlDetailsPage"; // Importe a nova página
import "./index.css"; // Certifique-se de que o CSS principal está importado

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/urls/:id" element={<UrlDetailsPage />} /> {/* Nova rota */}
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
