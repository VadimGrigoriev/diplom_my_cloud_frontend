/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import logger from "../utils/logger";

import Header from "../components/Admin/Header";
import UserTable from "../components/Admin/UserTable";
import DeleteConfirmation from "../components/Admin/DeleteConfirmation";
import LoadingSpinner from "../components/Admin/LoadingSpinner";
import ErrorMessage from "../components/Admin/ErrorMessage";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userList, isLoading, error } = useSelector((state) => state.user);
  const authUser = useSelector((state) => state.auth.user);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    if (authUser === null) {
      logger.info("⏳ Ожидание загрузки данных аутентификации...");
      return; // Ждем загрузку пользователя
    }

    // Если пользователь не админ — перенаправляем на главную страницу
    if (!authUser?.is_admin) {
      logger.warn(`🚫 Доступ запрещен: пользователь ${authUser.username} перенаправлен.`);
      navigate("/dashboard");
    } else {
      logger.info("📂 Загрузка списка пользователей...");
      dispatch(fetchUsers());
    }
  }, [dispatch, authUser, navigate]);

  const toggleAdmin = async (id, isAdmin) => {
    if (id === authUser.id) {
      logger.warn("⚠️ Попытка изменить свой собственный статус администратора заблокирована.");
      return;
    }

    try {
      await api.patch(`/admin/users/${id}/`, { is_admin: !isAdmin });
      logger.info(
        `🔄 Статус администратора изменён: пользователь ID ${id} теперь ${!isAdmin ? "администратор" : "обычный пользователь"}.`
      );
      dispatch(fetchUsers()); // Обновляем список
    } catch (error) {
      logger.error(`❌ Ошибка изменения статуса пользователя ID ${id}: ${error.message}`);
    }
  };

  const deleteUser = async (id) => {
    if (id === authUser.id) {
      logger.warn("⚠️ Попытка удалить себя заблокирована.");
      return;
    }

    try {
      await api.delete(`/admin/users/${id}/delete/`);
      logger.warn(`🗑️ Пользователь ID ${id} удалён.`);
      dispatch(fetchUsers()); // Обновляем список
      setConfirmDelete(null);
    } catch (error) {
      logger.error(`❌ Ошибка удаления пользователя ID ${id}: ${error.message}`);
    }
  };

  if (authUser === null) return <LoadingSpinner />;
  if (isLoading) return <LoadingSpinner />;
  if (error) {
    logger.error(`❌ Ошибка загрузки пользователей: ${error}`);
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigate={navigate} />
      <main className="container mx-auto px-6 py-8">
        <UserTable
          userList={userList}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          authUser={authUser}
          toggleAdmin={toggleAdmin}
          setConfirmDelete={setConfirmDelete}
        />
      </main>
      {confirmDelete && (
        <DeleteConfirmation
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          deleteUser={deleteUser}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
