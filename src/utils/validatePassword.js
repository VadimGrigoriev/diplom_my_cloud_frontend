const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
  if (!password) {
    return "Пароль обязателен";
  }
  if (!passwordRegex.test(password)) {
    return "Пароль должен содержать:\n- Минимум 6 символов\n- Хотя бы одну заглавную букву\n- Хотя бы одну цифру\n- Хотя бы один специальный символ (!@#$%^&*)";
  }
  return null;
};

export default validatePassword;
