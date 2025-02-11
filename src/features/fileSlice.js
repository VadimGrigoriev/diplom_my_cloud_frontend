import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../components/ToastProvider/ToastProvider";
import api from "../utils/api";
import logger from "../utils/logger";

// Загрузка файлов конкретного пользователя (для админов)
export const fetchUserFiles = createAsyncThunk(
  "files/fetchUserFiles",
  async (userId, { rejectWithValue }) => {
    try {
      logger.info(`📂 Запрос файлов пользователя ID: ${userId}`);
      const response = await api.get(`/admin/users/${userId}/files/`);
      logger.info(`✅ Файлы пользователя ${userId} загружены`);
      return response.data;
    } catch (error) {
      logger.error(`❌ Ошибка загрузки файлов пользователя ${userId}: ${error.message}`);
      return rejectWithValue("Не удалось загрузить файлы.");
    }
  }
);

// Удаление файла (для админки)
export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async ({ fileId, userId }, { rejectWithValue, dispatch }) => {
    try {
      logger.warn(`🗑️ Удаление файла ID: ${fileId} (Пользователь: ${userId})`);
      await api.delete(`/admin/files/${fileId}/`);
      dispatch(fetchUserFiles(userId)); // Обновляем файлы после удаления
      logger.info(`✅ Файл ${fileId} удален`);
      return fileId;
    } catch (error) {
      logger.error(`❌ Ошибка удаления файла ${fileId}: ${error.message}`);
      return rejectWithValue("Не удалось удалить файл.");
    }
  }
);

// Асинхронное действие для загрузки файлов
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (_, { rejectWithValue }) => {
    try {
      logger.info("📂 Запрос списка файлов...");
      const response = await api.get("/files/");
      logger.info(`✅ Загружено ${response.data.length} файлов`);
      return response.data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)); // Сортировка
    } catch (error) {
      logger.error(`❌ Ошибка загрузки файлов: ${error.message}`);
      showNotification.error("Не удалось загрузить файлы. Попробуйте обновить страницу.");
      return rejectWithValue("Не удалось загрузить файлы.");
    }
  }
);

// Асинхронное действие для обновления комментария
export const updateComment = createAsyncThunk(
  "files/updateComment",
  async ({ fileId, comment }, { rejectWithValue }) => {
    try {
      logger.info(`💬 Обновление комментария к файлу ID: ${fileId}`);
      const response = await api.patch(`/files/${fileId}/`, { comment });
      logger.info(`✅ Комментарий обновлен: "${comment}"`);
      return { fileId, comment: response.data.comment }; // Возвращаем ID файла и обновленный комментарий
    } catch (error) {
      logger.error(`❌ Ошибка обновления комментария: ${error.message}`);
      return rejectWithValue("Не удалось обновить комментарий.");
    }
  }
);

// Асинхронное действие для переименования файла
export const renameFile = createAsyncThunk(
  "files/renameFile",
  async ({ fileId, newName }, { rejectWithValue }) => {
    try {
      logger.info(`✏️ Переименование файла ID: ${fileId} → "${newName}"`);
      const response = await api.patch(`/files/${fileId}/rename/`, { original_name: newName });
      logger.info(`✅ Файл ${fileId} переименован в "${response.data.original_name}"`);
      return { fileId, originalName: response.data.original_name }; // Возвращаем обновленные данные
    } catch (error) {
      logger.error(`❌ Ошибка при переименовании файла ${fileId}: ${error.message}`);
      return rejectWithValue("Не удалось переименовать файл.");
    }
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState: {
    fileList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        logger.info("⏳ Загрузка списка файлов...");
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fileList = action.payload;
        logger.info(`✅ Загружено ${action.payload.length} файлов`);
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        logger.error(`❌ Ошибка загрузки файлов: ${state.error}`);
      })
      .addCase(fetchUserFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        logger.info("⏳ Загрузка файлов пользователя...");
      })
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fileList = action.payload;
        logger.info(`✅ Загружено ${action.payload.length} файлов пользователя`);
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        logger.error(`❌ Ошибка загрузки файлов пользователя: ${state.error}`);
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.fileList = state.fileList.filter((file) => file.id !== action.payload);
        logger.info(`🗑️ Файл ID: ${action.payload} удалён из списка`);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const { fileId, comment } = action.payload;
        const file = state.fileList.find((f) => f.id === fileId);
        if (file) {
          file.comment = comment;
          logger.info(`💬 Комментарий обновлен в Redux для файла ID: ${fileId}`);
        }
      })
      .addCase(renameFile.fulfilled, (state, action) => {
        const { fileId, originalName } = action.payload;
        const file = state.fileList.find((f) => f.id === fileId);
        if (file) {
          file.original_name = originalName;
          logger.info(`✏️ Файл ID: ${fileId} переименован в "${originalName}"`);
        }
      });
  }
});

export default fileSlice.reducer;
