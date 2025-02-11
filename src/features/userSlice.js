import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Асинхронное действие для загрузки пользователей
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users/");
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки пользователей:", error);
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
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default userSlice.reducer;
