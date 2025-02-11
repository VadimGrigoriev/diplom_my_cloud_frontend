/* eslint-disable react/prop-types */
import UserRow from "./UserRow";

const UserTable = ({
  userList,
  searchFilter,
  setSearchFilter,
  sortConfig = { key: "id", direction: "asc" },
  setSortConfig,
  authUser,
  toggleAdmin,
  setConfirmDelete,
}) => {
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key ? (prev.direction === "asc" ? "desc" : "asc") : "asc",
    }));
  };

  const filteredUsers = userList.filter(
    (user) =>
      searchFilter === "" ||
      String(user.id).includes(searchFilter) ||
      user.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    let compareResult = 0;

    switch (sortConfig.key) {
      case "id":
        compareResult = a.id - b.id;
        break;
      case "username":
        compareResult = (a.username || "").localeCompare(b.username || "");
        break;
      case "email":
        compareResult = (a.email || "").localeCompare(b.email || "");
        break;
      case "files":
        // Используем file_count, преобразуем null в 0
        { const filesA = a.file_count || 0;
        const filesB = b.file_count || 0;
        compareResult = filesA - filesB;
        break; }
      case "size":
        // Используем total_file_size, преобразуем null в 0
        { const sizeA = a.total_file_size || 0;
        const sizeB = b.total_file_size || 0;
        compareResult = sizeA - sizeB;
        break; }
      default:
        compareResult = 0;
    }

    return compareResult * direction;
  });

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="ml-2">
        {sortConfig.direction === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-red-50 border-b border-red-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-red-800">Список пользователей</h2>
        <input
          type="text"
          placeholder="Поиск по ID, имени и Email"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="px-3 py-2 border w-64 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      {sortedUsers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50">
          <p className="text-gray-600">
            {searchFilter ? `Пользователей по запросу "${searchFilter}" не найдено` : "Пользователей пока нет"}
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-red-100 text-red-800">
            <tr>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-red-200"
                onClick={() => handleSort("id")}
              >
                ID {renderSortIcon("id")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-red-200"
                onClick={() => handleSort("username")}
              >
                Имя {renderSortIcon("username")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-red-200"
                onClick={() => handleSort("email")}
              >
                Email {renderSortIcon("email")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-red-200"
                onClick={() => handleSort("files")}
              >
                Файлы {renderSortIcon("files")}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-red-200"
                onClick={() => handleSort("size")}
              >
                Размер {renderSortIcon("size")}
              </th>
              <th className="px-4 py-3 text-left">Статус</th>
              <th className="px-4 py-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                authUser={authUser}
                toggleAdmin={toggleAdmin}
                setConfirmDelete={setConfirmDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
