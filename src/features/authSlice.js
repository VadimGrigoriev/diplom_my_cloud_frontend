/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import logger from "../utils/logger";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена");

      logger.info("🔄 Запрос информации о пользователе...");
      const response = await api.get("/auth/me/");

      dispatch(setUser(response.data)); // Сохраняем пользователя в Redux
      localStorage.setItem("authUser", JSON.stringify(response.data)); // Сохраняем в localStorage

      logger.info("✅ Данные пользователя загружены");
      return response.data;
    } catch (error) {
      logger.error("❌ Ошибка получения данных пользователя: " + error.message);
      return rejectWithValue("Не удалось загрузить данные пользователя.");
    }
  }
);

// Асинхронное действие для регистрации
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      logger.info("📝 Регистрация пользователя...");
      const response = await api.post("/register/", userData);
      const { user } = response.data;

      // Получаем токен после успешной регистрации
      const tokenResponse = await api.post("/token/", {
        username: user.username,
        password: userData.password,
      });

      const { access, refresh } = tokenResponse.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      logger.info("🔐 Токен получен после регистрации");

      // Загружаем информацию о пользователе
      const userResponse = await api.get("/auth/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      // Сохраняем токены и данные пользователя в Redux
      dispatch(setCredentials({ 
        user,
        accessToken: access, 
        refreshToken: refresh 
      }));

      logger.info("✅ Пользователь успешно зарегистрирован");
      return user;
    } catch (error) {
      const errorResponse = error.response?.data || error.message || "Ошибка регистрации";
      if (error.response?.status === 400) {
        logger.warn(`⚠️ Ошибка регистрации: некорректные данные (${JSON.stringify(errorResponse)})`);
      } else {
        logger.error(`❌ Ошибка регистрации: ${error.message}`);
      }
      return rejectWithValue(
        typeof errorResponse === "object" ? JSON.stringify(errorResponse) : errorResponse
      );
    }
  }
);

// Асинхронное действие для авторизации
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      logger.info(`🔑 Авторизация пользователя: ${username}`);

      const tokenResponse = await api.post("/token/", { username, password }, {
        headers: { "Content-Type": "application/json" },
      });

      const { access, refresh } = tokenResponse.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      logger.info("🔐 Токен получен после входа");

      // Загружаем данные пользователя
      const userData = await dispatch(fetchCurrentUser()).unwrap();

      dispatch(setCredentials({ 
        user: userData, 
        accessToken: access, 
        refreshToken: refresh 
      }));

      logger.info("✅ Пользователь успешно вошел");
      return userData;
    } catch (error) {
      // Проверяем, есть ли ответ от сервера
      const errorMessage = error.response?.data || "Ошибка входа";
      
      if (error.response?.status === 401) {
        logger.warn(`⚠️ Неверные учетные данные для ${username}`);
      } else {
        logger.error(`❌ Ошибка авторизации: ${error.message}`);
      }

      logger.error(`🚨 Ответ сервера: ${JSON.stringify(errorMessage)}`);
      return rejectWithValue(errorMessage);
    }
  }
);


// Асинхронное действие для обновления токенов
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Отсутствует refresh token");

      logger.warn("🔄 Попытка обновить токен...");
      const response = await api.post("/token/refresh/", { refresh: refreshToken });
      const { access } = response.data;

      // Сохранение нового access токена в localStorage
      localStorage.setItem("accessToken", access);
      logger.info("🔑 Access-токен успешно обновлён");
      return { accessToken: access };
    } catch (error) {
      logger.error("🚨 Ошибка обновления токена: " + error.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue("Сессия истекла. Пожалуйста, войдите снова.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("authUser")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      let { user, accessToken, refreshToken } = action.payload;

      const userData = user?.id ? user : user?.user;

      state.user = userData;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      logger.info("📝 Данные пользователя сохранены в Redux и localStorage");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("authUser", JSON.stringify(action.payload));
      logger.info("👤 Пользователь обновлён в Redux");
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.success = false;
      localStorage.removeItem("authUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      logger.warn("🚪 Пользователь вышел из системы");
    },
    clearAuthState: (state) => {
      state.error = null;
      state.success = false;
      logger.info("🧹 Очистка состояния аутентификации");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        logger.info("⏳ Регистрация началась...");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        logger.info("✅ Регистрация завершена успешно!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload) || "Неизвестная ошибка";
        state.success = false;
        logger.error("❌ Ошибка регистрации: " + state.error);
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.error = null; // Сбрасываем ошибки
        logger.info("🔑 Access-токен обновлён в Redux");
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.error = action.payload;
        logger.error("🚨 Ошибка обновления токена, сброс аутентификации");
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        logger.info("✅ Данные пользователя загружены в Redux");
      });
  },
});

export const { setCredentials, setUser, logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
