import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../components/ToastProvider/ToastProvider";
import api from "../utils/api";

// Асинхронное действие для загрузки файлов
export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/files/");
      return response.data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)); // Сортировка
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
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
      const response = await api.patch(`/files/${fileId}/`, { comment });
      return { fileId, comment: response.data.comment }; // Возвращаем ID файла и обновленный комментарий
    } catch (error) {
      console.error("Ошибка при обновлении комментария:", error);
      return rejectWithValue("Не удалось обновить комментарий.");
    }
  }
);

// Асинхронное действие для переименования файла
export const renameFile = createAsyncThunk(
  "files/renameFile",
  async ({ fileId, newName }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/files/${fileId}/rename/`, { original_name: newName });
      return { fileId, originalName: response.data.original_name }; // Возвращаем обновленные данные
    } catch (error) {
      console.error("Ошибка при переименовании файла:", error);
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
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fileList = action.payload;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const { fileId, comment } = action.payload;
        const file = state.fileList.find((f) => f.id === fileId);
        if (file) {
          file.comment = comment; // Обновляем комментарий у конкретного файла
        }
      })
      .addCase(renameFile.fulfilled, (state, action) => {
        const { fileId, originalName } = action.payload;
        const file = state.fileList.find((f) => f.id === fileId);
        if (file) {
          file.original_name = originalName; // Обновляем оригинальное имя
        }
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default fileSlice.reducer;
