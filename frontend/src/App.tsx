import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BibliotecaFaturas from './components/Faturas';
import './styles/tailwind.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
            </li>
            <li>
              <Link to="/biblioteca-faturas" className="text-blue-500 hover:underline">Biblioteca de Faturas</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/biblioteca-faturas" element={<BibliotecaFaturas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;