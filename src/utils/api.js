import axios from "axios";
import store from "../store"; // Импортируем store Redux
import { refreshAccessToken } from "../features/authSlice";
import logger from "./logger";

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

    logger.info(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error(`🚨 API Request Error: ${error.message}`);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    logger.info(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🔴 Логируем ошибку API-запроса
    if (error.response) {
      logger.error(`❌ API Response Error: ${error.response.status} ${originalRequest.url} - ${error.message}`);
    } else {
      logger.error(`❌ API Network Error: ${error.message}`);
    }

    // Обрабатываем ошибку 401 и пытаемся обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        logger.warn("🔄 Токен истёк, пытаемся обновить...");

        // Диспетч обновления токена через Redux
        const result = await store.dispatch(refreshAccessToken());
        const newAccessToken = result.payload?.accessToken;

        if (newAccessToken) {
          logger.info("🔑 Токен успешно обновлён!");
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Повторяем запрос с новым токеном
        }
      } catch (refreshError) {
        logger.error("🚨 Ошибка при обновлении токена: " + refreshError.message);
        
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
