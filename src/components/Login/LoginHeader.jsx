import { useNavigate } from "react-router-dom";

const LoginHeader = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="text-center">
      <h1 
        className="text-4xl font-bold text-blue-600 mb-4 cursor-pointer hover:text-blue-700"
        onClick={handleClick}
      >
        My Cloud
      </h1>
      <p className="text-gray-600">Войдите в свой аккаунт</p>
    </div>
  );
};

export default LoginHeader;
