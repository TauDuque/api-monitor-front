import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";

// Componentes de exemplo para as rotas
const HomePage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold mb-4">
      Bem-vindo ao Dashboard de Monitoramento!
    </h2>
    <p>Esta é a página inicial. Navegue para outras seções.</p>
    <Link to="/settings" className="text-blue-500 hover:underline mt-4 block">
      Ir para Configurações
    </Link>
  </div>
);

const SettingsPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold mb-4">Configurações</h2>
    <p>Aqui você poderá gerenciar suas URLs monitoradas e alertas.</p>
    <Link to="/" className="text-blue-500 hover:underline mt-4 block">
      Voltar para Home
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:underline">
                Configurações
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Adicione outras rotas conforme necessário */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
