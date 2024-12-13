import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route path='/' element={<LandingPage />} />

         {/* Страница входа */}
        <Route path='/login' element={<LoginPage />} />

        {/* Дашборд */}
        <Route path='/dashboard' element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App
