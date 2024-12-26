import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, clearAuthState } from "../features/authSlice";

// Импортируем вынесенные компоненты
import RegisterHeader from "../components/Register/RegisterHeader";
import RegisterForm from "../components/Register/RegisterForm";

// Иконки могут остаться здесь, если они нужны только для логики (у нас в данном случае нет)
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

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
    if (success) {
      navigate("/dashboard");
    }
  }, [success, navigate]);

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

    // Username validation
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
    if (!formData.username) {
      errors.username = "Имя пользователя обязательно";
    } else if (!usernameRegex.test(formData.username)) {
      errors.username =
        "Имя пользователя должно:\n- Начинаться с буквы\n- Содержать только латинские буквы и цифры\n- Быть длиной от 4 до 20 символов";
    }

    // Full name validation
    if (!formData.fullName) {
      errors.fullName = "Полное имя обязательно";
    } else if (formData.fullName.length < 3) {
      errors.fullName = "Полное имя должно быть не короче 3 символов";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      errors.email = "Email обязателен";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Введите корректный email адрес";
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!formData.password) {
      errors.password = "Пароль обязателен";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Пароль должен содержать:\n- Минимум 6 символов\n- Хотя бы одну заглавную букву\n- Хотя бы одну цифру\n- Хотя бы один специальный символ (!@#$%^&*)";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    setValidationErrors(errors);
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
      dispatch(registerUser(userData)).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          navigate("/dashboard");
        }
      });
    }
  };

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
