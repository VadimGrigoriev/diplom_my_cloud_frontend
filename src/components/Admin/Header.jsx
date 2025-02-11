/* eslint-disable react/prop-types */
import { ShieldCheckIcon, LogOutIcon } from "lucide-react";

const Header = ({ navigate }) => {
  return (
    <header className="bg-red-600 text-white py-6 shadow-lg">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <ShieldCheckIcon className="mr-3 w-8 h-8" />
          Панель администратора
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center px-4 py-2 bg-red-700 hover:bg-red-800 rounded-lg transition-colors text-sm"
        >
          <LogOutIcon className="w-4 h-4 mr-2" />
          В обычный режим
        </button>
      </div>
    </header>
  );
};

export default Header;
