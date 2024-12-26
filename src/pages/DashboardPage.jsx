import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/api";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../components/ToastProvider/ToastProvider";

import Header from "../components/Dashboard/Header";
import FileUploadSection from "../components/Dashboard/FileUploadSection";
import FilesList from "../components/Dashboard/FilesList";
import ConfirmationModal from "../components/Dashboard/Modals/ConfirmationModal";
import CommentModal from "../components/Dashboard/Modals/CommentModal";
import LinkModal from "../components/Dashboard/Modals/LinkModal";


const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [selectedFileToComment, setSelectedFileToComment] = useState(null);
  const [comment, setComment] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
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

  const handleLinkButtonClick = async (fileId) => {
    try {
      const response = await api.post(`/files/${fileId}/generate-token/`);
      setGeneratedLink(response.data.download_url);
      setCopySuccess(false);
      showNotification.success("Ссылка успешно сгенерирована!");
    } catch (error) {
      console.error("Ошибка генерации ссылки:", error);
      showNotification.error("Не удалось сгенерировать ссылку.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess(true);
      showNotification.success("Ссылка скопирована!");
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Ошибка при копировании:", error);
      showNotification.error("Не удалось скопировать ссылку.");
    }
  };

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
      setFileToDelete(null);
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
      <Header onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">

        {/* File Upload Section */}
        <FileUploadSection
          loading={loading}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          handleUpload={handleUpload}
        />

        {/* Files List */}
        <FilesList
          files={files}
          loading={loading}
          onGenerateLink={handleLinkButtonClick}
          onDownloadFile={handleDownload}
          onSelectFileComment={(id) => setSelectedFileToComment(id)}
          onDeleteFile={(id) => setFileToDelete(id)}
        />
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

      {/* Comment Modal */}
      <CommentModal
        isOpen={!!selectedFileToComment}
        comment={comment}
        setComment={setComment}
        onConfirm={handleAddComment}          // handleAddComment
        onCancel={() => setSelectedFileToComment(null)}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={!!generatedLink}
        generatedLink={generatedLink}
        copySuccess={copySuccess}
        onCopyLink={handleCopyLink}
        onClose={() => setGeneratedLink(null)}
      />
    </div>
  );
};

export default DashboardPage;
