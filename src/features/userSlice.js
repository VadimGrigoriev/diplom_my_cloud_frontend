import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import logger from "../utils/logger";

// Асинхронное действие для загрузки пользователей
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      logger.info("📂 Запрос списка пользователей...");
      const response = await api.get("/admin/users/");
      logger.info(`✅ Загружено ${response.data.length} пользователей`);
      return response.data;
    } catch (error) {
      logger.error(`❌ Ошибка загрузки пользователей: ${error.message}`);
      return rejectWithValue("Не удалось загрузить пользователей.");
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        logger.info("⏳ Загрузка списка пользователей...");
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload;
        logger.info(`✅ Список пользователей загружен: ${action.payload.length} пользователей`);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        logger.error(`❌ Ошибка загрузки пользователей: ${state.error}`);
      });
  }
});

export default userSlice.reducer;
