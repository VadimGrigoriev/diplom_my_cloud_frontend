import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userSlice';
import authReducer from './features/authSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: 'root',
  storage
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: persistedAuthReducer,
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production',  // Включить DevTools только в разработке
});

export const persistor = persistStore(store);
