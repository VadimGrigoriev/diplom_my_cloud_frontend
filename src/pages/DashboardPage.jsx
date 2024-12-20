import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  CloudUploadIcon, 
  DownloadIcon,
  TrashIcon, 
  MessageCircleIcon 
} from "lucide-react";
import api from "../utils/api";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../components/ToastProvider/ToastProvider";
import ConfirmationModal from "../components/ConfirmationModal/ConfirmationModal";

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [selectedFileToComment, setSelectedFileToComment] = useState(null);
  const [comment, setComment] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/files/");
      setFiles(response.data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)));
    } catch (error) {
      console.error("Ошибка при загрузке файлов:", error);
      showNotification.error("Не удалось загрузить файлы. Попробуйте обновить страницу.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async () => {
    if (!selectedFiles) {
      showNotification.warning("Выберите файл для загрузки!");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);
      await api.post("/files/bulk-upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      await fetchFiles();

      document.getElementById('file-upload').value = '';
      setSelectedFiles(null);
      
      showNotification.success("Файлы успешно загружены!");
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      showNotification.error("Не удалось загрузить файлы. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await api.get(`/files/${fileId}/download/`, {
        responseType: 'blob'
      });
      
      const file = files.find(f => f.id === fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.original_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
      showNotification.error("Не удалось скачать файл.");
    }
  };

  // Add/Edit comment handler
  const handleAddComment = async () => {
    if (!selectedFileToComment) return;

    try {
      await api.patch(`/files/${selectedFileToComment}/`, { comment });
      await fetchFiles();
      setSelectedFileToComment(null);
      setComment('');
      showNotification.success("Комментарий добавлен!");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      showNotification.error("Не удалось добавить комментарий.");
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      await api.delete(`/files/${fileToDelete}/`);
      await fetchFiles();
      showNotification.success("Файл успешно удален.");
      setFileToDelete(null); // Закрываем модальное окно
    } catch (error) {
      console.error("Ошибка при удалении файла:", error);
      showNotification.error("Не удалось удалить файл.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CloudUploadIcon className="w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold tracking-tight">CloudSync Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              Привет!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Выход
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* File Upload Section */}
        <section className="mb-8 bg-blue-50 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Загрузить файлы</h2>
          <div className="flex items-center space-x-4">
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
              className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !selectedFiles}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? "Загрузка..." : "Загрузить"}
            </button>
          </div>
        </section>

        {/* Files List */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Ваши файлы</h2>
          {loading ? (
            <div className="text-center py-8">
              <p>Загрузка файлов...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">У вас пока нет загруженных файлов</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1">
              {files.map((file) => (
                <div 
                  key={file.id} 
                  className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex-grow mr-4">
                    <h3 className="font-medium text-gray-800">{file.original_name}</h3>
                    <div className="text-sm text-gray-500 space-x-4">
                      <span>{formatFileSize(file.size)}</span>
                      <span>Загружен: {new Date(file.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDownload(file.id)}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                      title="Скачать"
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </button>

                    <button 
                      onClick={() => setSelectedFileToComment(file.id)}
                      className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
                      title="Добавить комментарий"
                    >
                      <MessageCircleIcon className="w-5 h-5" />
                    </button>

                    <button 
                      onClick={() => setFileToDelete(file.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                      title="Удалить"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Модальное окно подтверждения удаления */}
      <ConfirmationModal
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleDeleteFile}
        title="Удаление файла"
        message="Вы уверены, что хотите удалить этот файл? Восстановить его будет невозможно."
        confirmText="Удалить"
        cancelText="Отмена"
      />

      {/* Comment Modal (for adding/editing comments) */}
      {selectedFileToComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Добавить комментарий</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Введите комментарий..."
              className="w-full border rounded-lg p-2 mb-4 min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedFileToComment(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
