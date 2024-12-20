import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userSlice';
import authReducer from './features/authSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: 'root',
  storage,
  serialize: false,
  whitelist: ["auth"],  // Сохраняем auth
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: persistedAuthReducer,
  },
  // eslint-disable-next-line no-undef
  devTools: process.env.NODE_ENV !== 'production',  // Включить DevTools только в разработке
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["err"],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
