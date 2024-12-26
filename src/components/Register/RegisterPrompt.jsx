import { Link } from "react-router-dom";

const RegisterPrompt = () => {
  return (
    <div className="text-center">
      <p className="mt-2 text-sm text-gray-600">
        Уже есть аккаунт?{" "}
        <Link 
          to="/login" 
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Войдите
        </Link>
      </p>
    </div>
  );
};

export default RegisterPrompt;