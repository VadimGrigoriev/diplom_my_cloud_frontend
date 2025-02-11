/* eslint-disable react/prop-types */
import { ShieldCheckIcon, ShieldXIcon, TrashIcon, FileIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserRow = ({ user, authUser, toggleAdmin, setConfirmDelete }) => {
  const navigate = useNavigate();

  return (
    <tr
      className={`border-b hover:bg-gray-50 transition-colors ${
        user.id === authUser.id ? "bg-green-50 border-green-200" : ""
      }`}
    >
      <td className="px-4 py-3 relative">
        {String(user.id) === String(authUser.id) && (
          <span className="absolute left-10 top-1/2 -translate-y-1/2 text-green-600 tooltip" title="Ваш профиль">
            <User className="w-5 h-5" />
          </span>
        )}
        {user.id}
      </td>
      <td className="px-4 py-3">{user.username}</td>
      <td className="px-4 py-3">{user.email}</td>
      <td className="px-4 py-3">{user.file_count}</td>
      <td className="px-4 py-3">{(user.total_file_size / 1024).toFixed(2)} KB</td>
      <td className="px-4 py-3">
        <button
          onClick={() => toggleAdmin(user.id, user.is_admin)}
          disabled={user.id === authUser.id}
          className={`rounded-full p-2 ${
            user.id === authUser.id
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : user.is_admin
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {user.is_admin ? <ShieldCheckIcon className="w-5 h-5" /> : <ShieldXIcon className="w-5 h-5" />}
        </button>
      </td>
      <td className="px-4 py-3 space-x-2">
        <button
          onClick={() => setConfirmDelete(user.id)}
          disabled={user.id === authUser.id}
          className={`group relative ${
            user.id === authUser.id ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:bg-red-50"
          } p-2 rounded-full transition-colors`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(`/admin/files/${user.id}`)}
          className="group relative text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
        >
          <FileIcon className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
