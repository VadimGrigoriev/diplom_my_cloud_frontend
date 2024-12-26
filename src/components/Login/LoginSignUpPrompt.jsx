const LoginSignUpPrompt = () => {
  return (
    <div className="text-center">
      <p className="text-gray-600">
        Нет аккаунта?{" "}
        <a 
          href="/register"
          className="text-blue-600 hover:underline font-semibold"
        >
          Зарегистрируйтесь
        </a>
      </p>
    </div>
  );
};

export default LoginSignUpPrompt;
