import { useNavigate } from "react-router-dom";

const RegisterHeader = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div>
      <h2 
        className="text-center text-4xl font-extrabold text-blue-600 cursor-pointer hover:text-blue-700"
        onClick={handleClick}
      >
        My Cloud
      </h2>
      <p className="mt-4 text-center text-xl text-gray-600">
        Создайте свой аккаунт
      </p>
    </div>
  );
};

export default RegisterHeader;
