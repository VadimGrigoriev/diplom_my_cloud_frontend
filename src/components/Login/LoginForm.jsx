/* eslint-disable react/prop-types */
import { useState } from "react";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";
import api from "../../utils/api";

const LoginForm = ({
  onLoginSuccess, // callback, чтобы сообщить родителю об успешном логине
  onError         // callback, если хотим обработать ошибку во внешнем компоненте
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Локальный обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Запрос на сервер
      const response = await api.post("token/", { username, password });
      const { access, refresh } = response.data;

      // Если все ок — вызываем onLoginSuccess 
      onLoginSuccess({ username, access, refresh });
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setError("Неверный логин или пароль.");
      // Если нужен колбэк для ошибки:
      if (onError) {
        onError(err);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl px-10 pt-8 pb-10 space-y-6"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Username */}
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

      {/* Password */}
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

      {/* Кнопка «Войти» */}
      <button 
        type="submit"
        className="w-full flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:-translate-y-1 shadow-lg"
      >
        <LogIn className="w-5 h-5 mr-2" />
        Войти
      </button>

      {/* Забыли пароль? */}
      <div className="text-center">
        <a 
          href="/forgot-password" 
          className="text-blue-600 hover:underline text-sm"
        >
          Забыли пароль?
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
