import { Link } from "react-router-dom";
import { ShieldCheckIcon, ClockIcon, DevicePhoneMobileIcon, CloudIcon } from "@heroicons/react/24/solid";

function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">MyCloud</h1>
          <div>
            <Link
              to="/login"
              className="px-4 py-2 text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 rounded-lg mr-2"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
                Добро пожаловать в <span className="text-blue-500">MyCloud!</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Ваши файлы всегда под рукой. Удобно, безопасно, быстро.
              </p>
              <Link
                to="/dashboard"
                className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg text-lg shadow-lg"
              >
                Начать сейчас
              </Link>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="flex justify-center items-center w-full h-64 bg-blue-100 rounded-lg">
                <CloudIcon className="w-32 h-32 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <ShieldCheckIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Безопасность</h3>
            <p className="text-gray-600">
              Ваши данные всегда защищены на 100% благодаря современным технологиям.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <ClockIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Быстрота</h3>
            <p className="text-gray-600">
              Загрузка и доступ к вашим файлам за считанные секунды.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <DevicePhoneMobileIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Удобство</h3>
            <p className="text-gray-600">
              Используйте облако на любом устройстве, где бы вы ни находились.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>MyCloud &copy; 2024</p>
          <p>
            <Link to="/privacy" className="underline hover:text-gray-200">
              Политика конфиденциальности
            </Link>
            {" "}|{" "}
            <Link to="/contact" className="underline hover:text-gray-200">
              Контакты
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
