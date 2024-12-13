import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function LoginPage() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('token/', { username, password });
      const { access, refresh } = response.data;

      // Сохраняем токены в Redux и LocalStorage
      dispatch(setCredentials({ user: username, accessToken: access, refreshToken: refresh }));
      console.log('Данные, передаваемые в setCredentials:', { username, access, refresh });

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Переход на Dashboard
      navigate('/dashboard/');
    } catch (err) {
      console.log(err);
      setError('Неверный логин или пароль.');
    }
  };

  return (
    <div>
      <h1>MyCloud</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Имя пользователя:</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
        <label>Пароль:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default LoginPage;