import { CloudUploadIcon } from "lucide-react";

const Header = ({ onLogout }) => (
  <header className="bg-blue-600 text-white shadow-md">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <CloudUploadIcon className="w-8 h-8 mr-3" />
        <h1 className="text-2xl font-bold tracking-tight">CloudSync Dashboard</h1>
      </div>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Выход
      </button>
    </div>
  </header>
);

export default Header;