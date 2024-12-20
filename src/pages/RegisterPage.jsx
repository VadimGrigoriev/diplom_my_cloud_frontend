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
    email: "",
    username: "",
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
      dispatch(clearAuthState()); // Очищаем состояние при размонтировании
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
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email обязателен";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Некорректный формат email";
    }

    // Username validation
    if (!formData.username) {
      errors.username = "Имя пользователя обязательно";
    } else if (formData.username.length < 3) {
      errors.username = "Имя пользователя должно быть не короче 3 символов";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Пароль обязателен";
    } else if (formData.password.length < 8) {
      errors.password = "Пароль должен быть не короче 8 символов";
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
      dispatch(registerUser({
        email: formData.email,
        username: formData.username,
        password: formData.password
      })).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          // Если регистрация успешна, перенаправляем на Dashboard
          navigate("/dashboard");
        }
      });
    }
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
                validationErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Имя пользователя
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                validationErrors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {validationErrors.username && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.username}
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
                {validationErrors.password}
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
                {validationErrors.confirmPassword}
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
