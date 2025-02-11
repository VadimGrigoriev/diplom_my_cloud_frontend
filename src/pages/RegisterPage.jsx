import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, clearAuthState } from "../features/authSlice";
import logger from "../utils/logger";

import RegisterHeader from "../components/Register/RegisterHeader";
import RegisterForm from "../components/Register/RegisterForm";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success, user } = useSelector((state) => state.auth);

  // Состояние для формы
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Состояние для видимости пароля
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Локальное состояние для ошибок валидации
  const [validationErrors, setValidationErrors] = useState({});

  // При загрузке компонента сбрасываем состояние auth
  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  // Если регистрация прошла успешно, переходим на /dashboard
  useEffect(() => {
    if (success && user ) {
      navigate("/dashboard");
    }
  }, [success, navigate, user]);

  // Очистка состояния auth при размонтировании (если нужно)
  useEffect(() => {
    return () => {
      dispatch(clearAuthState());
    };
  }, [dispatch]);

  // Переключение видимости пароля
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Валидация формы
  const validateForm = () => {
    const errors = {};

    // Валидация логина
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
    if (!formData.username) {
      errors.username = "Введите логин.";
    } else if (!usernameRegex.test(formData.username)) {
      errors.username =
        "Логин должен соответствовать требованиям:\n" +
        "- Только латинские буквы и цифры.\n" +
        "- Первый символ — буква.\n" +
        "- Длина от 4 до 20 символов.";
    }

    // Валидация полного имени
    if (!formData.fullName) {
      errors.fullName = "Полное имя обязательно";
    } else if (formData.fullName.length < 3) {
      errors.fullName = "Полное имя должно быть не короче 3 символов";
    }

    // Валидация email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      errors.email = "Введите email.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email =
        "Введите корректный email. Он должен содержать:\n" +
        "- Имя почтового ящика (латинские буквы, цифры, . _ % + -).\n" +
        "- Символ '@' перед доменом.\n" +
        "- Доменное имя (буквы, цифры, точки, тире).\n" +
        "- Окончание с минимум 2 латинскими буквами (.com, .ru и т. д.).";
    }

    // Валидация пароля
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!formData.password) {
      errors.password = "Введите пароль.";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Пароль должен содержать:\n" +
        "- Минимум 6 символов.\n" +
        "- Хотя бы одну заглавную букву.\n" +
        "- Хотя бы одну цифру.\n" +
        "- Хотя бы один специальный символ (!@#$%^&*).";
    }

    // Повторная проверка пароля
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      logger.warn(`⚠️ Ошибка валидации: ${JSON.stringify(errors)}`);
    }

    return Object.keys(errors).length === 0;
  };

  // Обработчик изменений в инпутах
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Если была ошибка по этому полю — убираем
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
      };
      dispatch(registerUser(userData));
    }
  };

  // Обработчик ошибки с Redux
  useEffect(() => {
    if (error) {
      try {
        // Если ошибка приходит как JSON-строка, распарсим её
        const parsedError = typeof error === "string" ? JSON.parse(error) : error;
        if (parsedError.username) {
          setValidationErrors((prev) => ({
            ...prev,
            username: "Этот логин уже занят. Пожалуйста, выберите другой.",
          }));
        }
      } catch (err) {
        console.error("Ошибка парсинга ошибки с сервера:", err);
      }
    }
  }, [error]);

  // Хелпер для преобразования ошибок с переносами строк
  const renderValidationError = (error) => {
    return error.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < error.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Шапка (логотип + текст) */}
        <RegisterHeader />

        {/* Основная форма регистрации */}
        <RegisterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          validationErrors={validationErrors}
          renderValidationError={renderValidationError}
          passwordVisibility={passwordVisibility}
          togglePasswordVisibility={togglePasswordVisibility}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
