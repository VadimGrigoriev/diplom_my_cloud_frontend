import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import { ToastProvider } from './components/ToastProvider/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Главная страница */}
          <Route path='/' element={<LandingPage />} />

          {/* Страница входа */}
          <Route path='/login' element={<LoginPage />} />

          {/* Страница регистрации */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Дашборд */}
          <Route path='/dashboard' element={<DashboardPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App
