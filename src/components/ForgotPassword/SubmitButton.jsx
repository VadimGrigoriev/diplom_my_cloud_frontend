/* eslint-disable react/prop-types */
import { KeyRound } from "lucide-react";


// Компонент кнопки отправки формы
const SubmitButton = ({ text }) => (
  <button
    type="submit"
    className="w-full flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:-translate-y-1 shadow-lg"
  >
    <KeyRound className="w-5 h-5 mr-2" />
    {text}
  </button>
);

export default SubmitButton;
