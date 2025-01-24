import { CheckCircle } from "lucide-react";

// Компонент успешного сброса пароля
const SuccessMessage = () => (
  <div className="bg-white shadow-xl rounded-2xl px-10 pt-8 pb-10">
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
      <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
      <div>
        <p className="font-medium">Пароль успешно изменён!</p>
        <p className="text-gray-600">
          Вы будете перенаправлены на страницу входа через несколько секунд...
        </p>
        <a 
          href="/login" 
          className="text-blue-600 hover:underline block mt-2"
        >
          Вернуться к странице входа сейчас
        </a>
      </div>
    </div>
  </div>
);

export default SuccessMessage;
