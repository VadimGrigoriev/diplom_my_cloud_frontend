/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Lock } from "lucide-react";
import SubmitButton from "./SubmitButton";


// Компонент формы сброса пароля
const ResetPasswordForm = ({ 
  newPassword, 
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword,
  onSubmit,
  error,
  validationError
}) => (
  <>
    <div>
      <label
        htmlFor="newPassword"
        className="block text-gray-700 mb-2 flex items-center"
      >
        <Lock className="w-5 h-5 mr-2 text-blue-600" />
        Новый пароль
      </label>
      <input
        id="newPassword"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        placeholder="Введите новый пароль"
      />
      {validationError && (
        <p className="mt-2 text-sm text-red-600 whitespace-pre-line">
          {validationError}
        </p>
      )}
    </div>
    <div>
      <label
        htmlFor="confirmPassword"
        className="block text-gray-700 mb-2 flex items-center"
      >
        <Lock className="w-5 h-5 mr-2 text-blue-600" />
        Повторите новый пароль
      </label>
      <input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        placeholder="Повторите новый пароль"
      />
    </div>
    <SubmitButton text="Сменить пароль" />
  </>
);

export default ResetPasswordForm;
