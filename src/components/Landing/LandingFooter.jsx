import { Link } from "react-router-dom";

const LandingFooter = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4">CloudSync &copy; 2025</p>
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
  );
};

export default LandingFooter;
