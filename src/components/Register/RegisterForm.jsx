/* eslint-disable react/prop-types */
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import RegisterPrompt from "./RegisterPrompt";

/**
 * Компонент формы регистрации.
 * Принимает стейты и функции из родительского компонента RegisterPage.
 */
const RegisterForm = ({
  formData,
  onChange,                // handleChange
  onSubmit,                // handleSubmit
  validationErrors,
  renderValidationError,
  passwordVisibility,
  togglePasswordVisibility,
  loading,
  error,
}) => {
  return (
    <form 
      onSubmit={onSubmit}
      className="bg-white shadow-xl rounded-2xl px-8 pt-6 pb-8 space-y-6"
    >
      {/* Ошибка от бэкенда (Redux), если есть */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Поле: Логин */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Логин
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
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

      {/* Поле: Полное имя */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Полное имя
        </label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
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

      {/* Поле: Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
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

      {/* Поле: Пароль */}
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Пароль
        </label>
        <input
          id="password"
          type={passwordVisibility.password ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={onChange}
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

      {/* Поле: Подтвердить пароль */}
      <div className="relative">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Повторите пароль
        </label>
        <input
          id="confirmPassword"
          type={passwordVisibility.confirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
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

      {/* Кнопка: Создать аккаунт */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {loading ? "Регистрация..." : "Создать аккаунт"}
        </button>
      </div>

      {/* Ссылка: Уже есть аккаунт? */}
      <RegisterPrompt />
    </form>
  );
};

export default RegisterForm;
