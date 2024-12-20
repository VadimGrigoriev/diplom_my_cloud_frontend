import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
import { setCredentials } from "../features/authSlice";
import api from "../utils/api";

function LoginPage() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Предотвращаем стандартное поведение формы
    e.preventDefault();
    
    try {
      // Отправляем запрос на авторизацию
      const response = await api.post('token/', { username, password });
      const { access, refresh } = response.data;

      // Сохраняем учетные данные в Redux и локальном хранилище
      dispatch(setCredentials({ 
        user: username, 
        accessToken: access, 
        refreshToken: refresh 
      }));

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Переходим на панель управления
      navigate('/dashboard/');
    } catch (err) {
      // Обрабатываем ошибку входа
      console.error(err);
      setError('Неверный логин или пароль.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">CloudSync</h1>
          <p className="text-gray-600">Войдите в свой аккаунт</p>
        </div>
        
        <form 
          onSubmit={handleLogin} 
          className="bg-white shadow-xl rounded-2xl px-10 pt-8 pb-10 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Имя пользователя
            </label>
            <input 
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Введите ваше имя пользователя"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              Пароль
            </label>
            <input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Введите ваш пароль"
            />
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Войти
          </button>

          <div className="text-center">
            <a 
              href="/forgot-password" 
              className="text-blue-600 hover:underline text-sm"
            >
              Забыли пароль?
            </a>
          </div>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Нет аккаунта? {' '}
            <a 
              href="/register" 
              className="text-blue-600 hover:underline font-semibold"
            >
              Зарегистрируйтесь
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
