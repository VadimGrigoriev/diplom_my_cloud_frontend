/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

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
      return; // Ждем загрузку пользователя
    }

    // Если пользователь не админ — перенаправляем на главную страницу
    if (!authUser?.is_admin) {
        navigate("/dashboard");
    } else {
        dispatch(fetchUsers());
    }
  }, [dispatch, authUser, navigate]);

  const toggleAdmin = async (id, isAdmin) => {
      if (id === authUser.id) {
          return;
      }

      try {
          await api.patch(`/admin/users/${id}/`, { is_admin: !isAdmin });
          dispatch(fetchUsers()); // Обновляем список
      } catch (error) {
          console.error("Ошибка изменения статуса", error);
      }
  };

  const deleteUser = async (id) => {
      if (id === authUser.id) {
          return;
      }

      try {
          await api.delete(`/admin/users/${id}/delete/`);
          dispatch(fetchUsers()); // Обновляем список
          setConfirmDelete(null);
      } catch (error) {
          console.error("Ошибка удаления пользователя", error);
      }
  };

  if (authUser === null) return <LoadingSpinner />;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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
