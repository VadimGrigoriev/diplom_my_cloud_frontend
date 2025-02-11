import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import { ToastProvider } from './components/ToastProvider/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserFiles from './components/Admin/UserFiles';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from './features/authSlice';

function App() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!authUser) {
        dispatch(fetchCurrentUser());
    }
  }, [dispatch, authUser]);

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
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Любой несуществующий маршрут отправляет на главную */}
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/files/:userId" element={<UserFiles />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App
