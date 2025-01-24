/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { User } from "lucide-react";
import SubmitButton from "./SubmitButton";

// Компонент формы верификации пользователя
const VerificationForm = ({ username, setUsername, fullName, setFullName, onSubmit, error }) => (
  <>
    <div>
      <label
        htmlFor="username"
        className="block text-gray-700 mb-2 flex items-center"
      >
        <User className="w-5 h-5 mr-2 text-blue-600" />
        Имя пользователя
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        placeholder="Введите ваш username"
      />
    </div>
    <div>
      <label
        htmlFor="fullName"
        className="block text-gray-700 mb-2 flex items-center"
      >
        <User className="w-5 h-5 mr-2 text-blue-600" />
        Полное имя (если указано)
      </label>
      <input
        id="fullName"
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        placeholder="Введите ваше полное имя"
      />
    </div>
    <SubmitButton text="Продолжить" />
  </>
);

export default VerificationForm;
