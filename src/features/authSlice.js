import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Асинхронное действие для регистрации
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/register/", userData);

      // Получаем токен после успешной регистрации
      const tokenResponse = await api.post("/token/", {
        username: userData.username,
        password: userData.password,
      });

      const { access, refresh } = tokenResponse.data;

      // Сохраняем токены и данные пользователя в Redux
      dispatch(setCredentials({ 
        user: userData.username, 
        accessToken: access, 
        refreshToken: refresh 
      }));

      return response.data;
    } catch (error) {
      const errorResponse = error.response?.data || error.message || "Ошибка регистрации";
      return rejectWithValue(
        typeof errorResponse === "object" ? JSON.stringify(errorResponse) : errorResponse
      );
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

      const response = await api.post("/token/refresh/", { refresh: refreshToken });
      const { access } = response.data;

      // Сохранение нового access токена в localStorage
      localStorage.setItem("accessToken", access);
      return { accessToken: access };
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue("Сессия истекла. Пожалуйста, войдите снова.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.success = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    clearAuthState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload) || "Неизвестная ошибка";
        state.success = false;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.error = null; // Сбрасываем ошибки
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
