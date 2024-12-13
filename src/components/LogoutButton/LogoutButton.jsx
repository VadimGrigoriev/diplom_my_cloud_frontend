import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Удаляем токены
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Сбрасываем состояние пользователя
    dispatch(logout());

    // Возвращаемся на страницу входа
    window.location.href = '/';
  };

  return <button onClick={handleLogout}>Выйти</button>
}

export default LogoutButton;
