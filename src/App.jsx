import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import { ToastProvider } from './components/ToastProvider/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Главная страница */}
          <Route path='/' element={<LandingPage />} />

          {/* Страница входа */}
          <Route path='/login' element={<LoginPage />} />

          {/* Страница восстановления пароля */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Страница регистрации */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Дашборд */} 
          <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App
