import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, setCredentials } from "../features/authSlice";

import LoginHeader from "../components/Login/LoginHeader";
import LoginForm from "../components/Login/LoginForm";
import LoginSignUpPrompt from "../components/Login/LoginSignUpPrompt";


function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleLoginSuccess = ({ username, access, refresh }) => {
  //   // Сохраняем учетные данные в Redux
  //   dispatch(
  //     setCredentials({
  //       user: username,
  //       accessToken: access,
  //       refreshToken: refresh,
  //     })
  //   );

  //   // Сохраняем в localStorage
  //   localStorage.setItem("accessToken", access);
  //   localStorage.setItem("refreshToken", refresh);

  //   // Редирект на /dashboard
  //   navigate("/dashboard/");
  // };

  const handleLoginSuccess = async ({ access, refresh }, dispatch, navigate) => {
    try {
      // Сохраняем токены в localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
  
      // Загружаем полные данные о пользователе
      const userData = await dispatch(fetchCurrentUser()).unwrap();
  
      // Сохраняем данные в Redux и localStorage
      dispatch(setCredentials({
        user: userData, // Теперь передаём объект пользователя
        accessToken: access,
        refreshToken: refresh,
      }));
  
      localStorage.setItem("authUser", JSON.stringify(userData)); // Сохраняем полные данные
  
      // Редирект в /dashboard
      navigate("/dashboard/");
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя:", error);
    }
  };

  const handleLogin = (data) => handleLoginSuccess(data, dispatch, navigate);

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Шапка: заголовок CloudSync, подзаголовок */}
        <LoginHeader />

        {/* Форма логина */}
        <LoginForm onLoginSuccess={handleLogin} />

        {/* Блок «Нет аккаунта?» */}
        <LoginSignUpPrompt />
      </div>
    </div>
  );
}

export default LoginPage;
