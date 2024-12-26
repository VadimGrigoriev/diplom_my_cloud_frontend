import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
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
  );
};

export default LandingHeader;
