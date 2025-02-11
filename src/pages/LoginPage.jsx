import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/authSlice";
import logger from "../utils/logger";

import LoginHeader from "../components/Login/LoginHeader";
import LoginForm from "../components/Login/LoginForm";
import LoginSignUpPrompt from "../components/Login/LoginSignUpPrompt";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async ({ username, password }, setError) => {
    try {
      logger.info(`🔑 Попытка входа пользователя: ${username}`);

      await dispatch(loginUser({ username, password })).unwrap();

      logger.info(`✅ Вход выполнен, редирект в /dashboard`);
      navigate("/dashboard/");
    } catch (error) {
      logger.error(`❌ Ошибка входа: ${error.message || "Неизвестная ошибка"}`);
      setError(error.message || "Неверный логин или пароль."); // Передаём ошибку в `LoginForm`
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <LoginHeader />
        <LoginForm onLoginSuccess={handleLogin} />
        <LoginSignUpPrompt />
      </div>
    </div>
  );
}

export default LoginPage;
