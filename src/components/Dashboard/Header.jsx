/* eslint-disable react/prop-types */
import { CloudUploadIcon, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ greetingText, showAdminButton, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <CloudUploadIcon className="w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold tracking-tight">CloudSync Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">
            {greetingText}
          </span>

          {/* Кнопка перехода в административную панель */}
          {showAdminButton && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 ease-in-out group"
            >
              <SettingsIcon className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Панель управления</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Выход
          </button>
        </div>
      </div>
    </header>
  );
};


export default Header;