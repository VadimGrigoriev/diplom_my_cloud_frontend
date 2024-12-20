import axios from "axios";
import store from "../store"; // Импортируем store Redux
import { refreshAccessToken } from "../features/authSlice";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Базовый URL backend API
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем интерцептор для автоматической передачи токена
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Обрабатываем ошибку 401 и пытаемся обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Диспетч обновления токена через Redux
        const result = await store.dispatch(refreshAccessToken());
        const newAccessToken = result.payload?.accessToken;

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Повторяем запрос с новым токеном
        }
      } catch (refreshError) {
        console.error("Ошибка при обновлении токена:", refreshError);
        // Удаляем токены и перенаправляем на страницу входа
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
