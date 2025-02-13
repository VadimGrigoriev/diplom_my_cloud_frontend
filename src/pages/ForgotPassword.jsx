import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "../components/ForgotPassword/SuccessMessage";
import ErrorMessage from "../components/ForgotPassword/ErrorMessage";
import VerificationForm from "../components/ForgotPassword/VerificationForm";
import ResetPasswordForm from "../components/ForgotPassword/ResetPasswordForm";
import validatePassword from "../utils/validatePassword";
import api from "../utils/api";
import logger from "../utils/logger";

const ForgotPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("passwordResetSuccess") === "true") {
      logger.info("🔄 Автоматический редирект на страницу входа после успешного сброса пароля.");
      localStorage.removeItem("passwordResetSuccess");
      navigate("/login");
    }
  }, [navigate]);
  
  useEffect(() => {
    if (success) {
      logger.info("✅ Пароль успешно сброшен. Перенаправляем на страницу входа...");
      localStorage.setItem("passwordResetSuccess", "true");
      const timer = setTimeout(() => {
        localStorage.removeItem("passwordResetSuccess");
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Сброс ошибок валидации при изменении пароля
  useEffect(() => {
    setValidationError(null);
  }, [newPassword]);

  // Редирект на начальную страницу при нажатии на "My Cloud"
  const handleClick = () => {
    navigate("/");
  }

  // Проверка пользователя
  const handleVerification = async (e) => {
    e.preventDefault();
    setError(null);
    logger.info(`🔍 Проверка пользователя: ${username}`);

    try {
      const response = await api.post("/auth/verify-user/", {
        username,
        full_name: fullName,
      });

      if (response.data.success) {
        logger.info(`✅ Пользователь ${username} успешно верифицирован.`);
        setStep(2);
      } else {
        logger.warn(`⚠️ Данные пользователя ${username} не совпадают.`);
        setError("Данные пользователя не совпадают.");
      }
    } catch (err) {
      logger.error(`❌ Ошибка при проверке данных пользователя ${username}: ${err.message}`);
      setError("Произошла ошибка. Попробуйте снова.");
    }
  };

  // Сброс пароля
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    logger.info(`🔑 Попытка сброса пароля для пользователя: ${username}`);

    // Валидация пароля
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      logger.warn(`⚠️ Ошибка валидации пароля: ${passwordError}`);
      setValidationError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      logger.warn("⚠️ Введённые пароли не совпадают.");
      setError("Пароли не совпадают.");
      return;
    }

    try {
      await api.post("/auth/reset-password/", {
        username,
        new_password: newPassword,
      });
      logger.info(`✅ Пароль успешно сброшен для пользователя ${username}`);
      setSuccess(true);
    } catch (err) {
      logger.error(`❌ Ошибка при сбросе пароля пользователя ${username}: ${err.message}`);
      setError("Не удалось сбросить пароль. Попробуйте снова.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 
            className="text-4xl font-bold text-blue-600 mb-4 cursor-pointer hover:text-blue-700"
            onClick={handleClick}
          >
            My Cloud
          </h2>
          <p className="mt-2 text-gray-600">Восстановление доступа к аккаунту</p>
        </div>

        {success ? (
          <SuccessMessage />
        ) : (
          <form
            onSubmit={step === 1 ? handleVerification : handlePasswordReset}
            className="bg-white shadow-xl rounded-2xl px-10 pt-8 pb-10 space-y-6"
          >
            <ErrorMessage error={error} />

            {step === 1 ? (
              <VerificationForm
                username={username}
                setUsername={setUsername}
                fullName={fullName}
                setFullName={setFullName}
                onSubmit={handleVerification}
                error={error}
              />
            ) : (
              <ResetPasswordForm
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={handlePasswordReset}
                error={error}
                validationError={validationError}
              />
            )}

            <div className="text-center">
              <a href="/login" className="text-blue-600 hover:underline text-sm">
                Вернуться к входу
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
