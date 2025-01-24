import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Для навигации
import SuccessMessage from "../components/ForgotPassword/SuccessMessage";
import ErrorMessage from "../components/ForgotPassword/ErrorMessage";
import VerificationForm from "../components/ForgotPassword/VerificationForm";
import ResetPasswordForm from "../components/ForgotPassword/ResetPasswordForm";
import validatePassword from "../utils/validatePassword";
import api from "../utils/api";

// Основной компонент страницы
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
      localStorage.removeItem("passwordResetSuccess");
      navigate("/login");
    }
  }, [navigate]);
  
  useEffect(() => {
    if (success) {
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

  const handleVerification = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/verify-user/", {
        username,
        full_name: fullName,
      });
      if (response.data.success) {
        setStep(2);
      } else {
        setError("Данные пользователя не совпадают.");
      }
    } catch (err) {
      console.error("Ошибка при проверке данных:", err);
      setError("Произошла ошибка. Попробуйте снова.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);

    // Валидация пароля
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    try {
      await api.post("/auth/reset-password/", {
        username,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Ошибка при сбросе пароля:", err);
      setError("Не удалось сбросить пароль. Попробуйте снова.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">CloudSync</h2>
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
