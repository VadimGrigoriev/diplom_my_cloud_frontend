import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShieldCheckIcon, ClockIcon, DevicePhoneMobileIcon, CloudIcon } from "@heroicons/react/24/solid";

function LandingPage() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth); // Проверка авторизации

  const handleStart = () => {
    if (accessToken) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };


  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">CloudSync</h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-300"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors duration-300"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Ваши файлы <span className="text-blue-600">всегда с вами</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Безопасное и удобное облачное хранилище для ваших данных.
              </p>
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Начать сейчас
              </button>
            </div>
            <div className="flex justify-center">
              <div className="bg-blue-50 p-12 rounded-2xl">
                <CloudIcon className="w-48 h-48 text-blue-600 animate-bounce-slow" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                Icon: ShieldCheckIcon,
                title: "Безопасность",
                description: "Передовые технологии защиты ваших персональных данных"
              },
              {
                Icon: ClockIcon,
                title: "Быстрота",
                description: "Моментальный доступ к файлам из любой точки мира"
              },
              {
                Icon: DevicePhoneMobileIcon,
                title: "Универсальность",
                description: "Работайте с файлами на любых устройствах"
              }
            ].map(({ Icon, title, description }, index) => (
              <div 
                key={index} 
                className="bg-white border border-blue-100 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Icon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">CloudSync &copy; 2024</p>
          <div className="space-x-4">
            <Link to="/privacy" className="hover:underline">
              Политика конфиденциальности
            </Link>
            <Link to="/contact" className="hover:underline">
              Контакты
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
