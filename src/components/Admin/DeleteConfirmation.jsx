/* eslint-disable react/prop-types */
const DeleteConfirmation = ({ confirmDelete, setConfirmDelete, deleteUser, isFile = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-red-600 mb-4">
          {isFile ? "Удаление файла" : "Удаление пользователя"}
        </h3>
        <p className="mb-6">
          {isFile ? "Вы уверены, что хотите удалить этот файл?" : "Вы уверены, что хотите удалить этого пользователя?"}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Отмена
          </button>
          <button
            onClick={() => deleteUser(confirmDelete)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
