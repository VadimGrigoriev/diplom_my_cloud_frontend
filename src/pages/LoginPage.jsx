import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../features/authSlice";

import LoginHeader from "../components/Login/LoginHeader";
import LoginForm from "../components/Login/LoginForm";
import LoginSignUpPrompt from "../components/Login/LoginSignUpPrompt";


function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = ({ username, access, refresh }) => {
    // Сохраняем учетные данные в Redux
    dispatch(
      setCredentials({
        user: username,
        accessToken: access,
        refreshToken: refresh,
      })
    );

    // Сохраняем в localStorage (если нужно)
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    // Редирект на /dashboard
    navigate("/dashboard/");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Шапка: заголовок CloudSync, подзаголовок */}
        <LoginHeader />

        {/* Форма логина */}
        <LoginForm onLoginSuccess={handleLoginSuccess} />

        {/* Блок «Нет аккаунта?» */}
        <LoginSignUpPrompt />
      </div>
    </div>
  );
}

export default LoginPage;
