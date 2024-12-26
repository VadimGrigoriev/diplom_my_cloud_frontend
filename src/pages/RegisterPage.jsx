import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser, clearAuthState } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate("/dashboard");
    }
  }, [success, navigate]);
  
  useEffect(() => {
    return () => {
      dispatch(clearAuthState());
    };
  }, [dispatch]);

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
    if (!formData.username) {
      errors.username = "Имя пользователя обязательно";
    } else if (!usernameRegex.test(formData.username)) {
      errors.username = "Имя пользователя должно:\n- Начинаться с буквы\n- Содержать только латинские буквы и цифры\n- Быть длиной от 4 до 20 символов";
    }

    // Full name validation
    if (!formData.fullName) {
      errors.fullName = "Полное имя обязательно";
    } else if (formData.fullName.length < 3) {
      errors.fullName = "Полное имя должно быть не короче 3 символов";
    }

    // Email validation with more strict regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      errors.email = "Email обязателен";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Введите корректный email адрес";
    }

    // Password validation - min 6 chars, 1 uppercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!formData.password) {
      errors.password = "Пароль обязателен";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Пароль должен содержать:\n- Минимум 6 символов\n- Хотя бы одну заглавную букву\n- Хотя бы одну цифру\n- Хотя бы один специальный символ (!@#$%^&*)";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const userData = {
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
      };
      console.log("Данные для регистрации:", userData); // Отладочная информация
      dispatch(registerUser(userData)).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {

          navigate("/dashboard");
        }
      });
    }
  };

  // Helper function to render validation errors with line breaks
  const renderValidationError = (error) => {
    return error.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < error.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-blue-600">
            CloudSync
          </h2>
          <p className="mt-4 text-center text-xl text-gray-600">
            Создайте свой аккаунт
          </p>
        </div>
        <form 
          onSubmit={handleSubmit} 
          className="bg-white shadow-xl rounded-2xl px-8 pt-6 pb-8 space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Логин
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.username ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.username && (
              <p className="mt-1 text-sm text-red-600">
                {renderValidationError(validationErrors.username)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Полное имя
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {renderValidationError(validationErrors.fullName)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {renderValidationError(validationErrors.email)}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              type={passwordVisibility.password ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-3 top-10 text-gray-500 hover:text-blue-600"
            >
              {passwordVisibility.password ? (
                <EyeSlashIcon className="h-6 w-6" />
              ) : (
                <EyeIcon className="h-6 w-6" />
              )}
            </button>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {renderValidationError(validationErrors.password)}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Повторите пароль
            </label>
            <input
              id="confirmPassword"
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute right-3 top-10 text-gray-500 hover:text-blue-600"
            >
              {passwordVisibility.confirmPassword ? (
                <EyeSlashIcon className="h-6 w-6" />
              ) : (
                <EyeIcon className="h-6 w-6" />
              )}
            </button>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {renderValidationError(validationErrors.confirmPassword)}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? "Регистрация..." : "Создать аккаунт"}
            </button>
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Уже есть аккаунт?{" "}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Войдите
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
