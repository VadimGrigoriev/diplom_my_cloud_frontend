/* eslint-disable react/prop-types */
import { AlertCircle } from "lucide-react";


// Компонент сообщения об ошибке
const ErrorMessage = ({ error }) => error ? (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
    <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
    {error}
  </div>
) : null;

export default ErrorMessage;
