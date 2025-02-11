/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { logout, fetchCurrentUser } from "../features/authSlice";
import { fetchFiles, updateComment, renameFile } from "../features/fileSlice";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../components/ToastProvider/ToastProvider";
import logger from "../utils/logger";

import Header from "../components/Dashboard/Header";
import FileUploadSection from "../components/Dashboard/FileUploadSection";
import FilesList from "../components/Dashboard/FilesList";
import ConfirmationModal from "../components/Dashboard/Modals/ConfirmationModal";
import CommentModal from "../components/Dashboard/Modals/CommentModal";
import LinkModal from "../components/Dashboard/Modals/LinkModal";


const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [selectedFileToComment, setSelectedFileToComment] = useState(null);
  const [fileComments, setFileComments] = useState({});
  const [comment, setComment] = useState('');
  const [fileToDelete, setFileToDelete] = useState(null);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { fileList, isLoading, error } = useSelector((state) => state.files);
  const { user, accessToken } = useSelector((state) => state.auth); // Получаем пользователя из Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      logger.warn("🚪 Пользователь не авторизован. Перенаправляем на главную.");
      navigate("/"); // Если пользователь не авторизован, отправляем на страницу приветствия
    } else {
      if (!user) {
        dispatch(fetchCurrentUser()); // Загружаем данные о пользователе
      }
      dispatch(fetchFiles()); // Загружаем файлы при загрузке страницы
    }
  }, [dispatch, accessToken, user, navigate]);

  // Определяем текст приветствия
  const greetingText = `Привет, ${user?.full_name || user?.username}!`;

  // Определяем, показывать ли кнопку админки
  const showAdminButton = user?.is_admin || false;

  // Обработчик для генерации ссылки для скачивания
  const handleLinkButtonClick = async (fileId) => {
    try {
      logger.info(`🔗 Генерация ссылки для скачивания файла ID: ${fileId}`);
      const response = await api.post(`/files/${fileId}/generate-token/`);
      setGeneratedLink(response.data.download_url);
      setCopySuccess(false);
      showNotification.success("Ссылка успешно сгенерирована!");
    } catch (error) {
      logger.error(`❌ Ошибка генерации ссылки: ${error.message}`);
      showNotification.error("Не удалось сгенерировать ссылку.");
    }
  };

  // Обработчик для скачивания файла по ссылке
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess(true);
      showNotification.success("Ссылка скопирована!");
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (error) {
      logger.error(`❌ Ошибка при копировании ссылки: ${error.message}`);
      showNotification.error("Не удалось скопировать ссылку.");
    }
  };

  // Обработчик для загрузки файла
  const handleUpload = async () => {
    if (!selectedFiles) {
      showNotification.warning("Выберите файл для загрузки!");
      return;
    }

    const formData = new FormData();

    // Добавляем файлы и их комментарии в FormData
    Array.from(selectedFiles).forEach((file, index) => {
      formData.append("files", file);
      // Если есть комментарий для этого файла, добавляем его
      if (fileComments[index]) {
        formData.append(`comments[${index}]`, fileComments[index]);
      }
    });

    try {
      setLoading(true);
      logger.info(`📤 Загружаем файлы (${selectedFiles.length} шт. на сервер)`);
      await api.post("/files/bulk-upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      await dispatch(fetchFiles());

      document.getElementById('file-upload').value = '';
      setSelectedFiles(null);
      setFileComments({}); // Очищаем комментарии после успешной загрузки

      logger.info("✅ Файлы успешно загружены!");
      showNotification.success("Файлы успешно загружены!");
    } catch (error) {
      logger.error(`❌ Ошибка при загрузке файла: ${error.message}`);
      showNotification.error("Не удалось загрузить файлы. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  // Обработчик для скачивания файла
  const handleDownload = async (fileId) => {
    try {
      logger.info(`📥 Скачивание файла ID: ${fileId}`);
      const response = await api.get(`/files/${fileId}/download/`, {
        responseType: 'blob'
      });
      
      const file = fileList.find(f => f.id === fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.original_name);
      document.body.appendChild(link);
      link.click();
      link.remove();

      dispatch(fetchFiles()); // Обновляем список файлов через Redux
    } catch (error) {
      logger.error(`❌ Ошибка при скачивании файла ID: ${fileId}: ${error.message}`);
      showNotification.error("Не удалось скачать файл.");
    }
  };

  // Обработчик для пеерименования файла
  const handleRenameFile = async (fileId, newName) => {
    try {
      await dispatch(renameFile({ fileId, newName }));
      showNotification.success("Файл успешно переименован!");
    } catch (error) {
      logger.error(`❌ Ошибка при переименовании файла ID: ${fileId}: ${error.message}`);
      showNotification.error("Не удалось переименовать файл.");
    }
  };

  // Обработчик для добавления комментария
  const handleAddComment = async () => {
    if (!selectedFileToComment) return;

    try {
      await dispatch(updateComment({ fileId: selectedFileToComment, comment }));
      setSelectedFileToComment(null);
      setComment('');
      showNotification.success("Комментарий добавлен!");
    } catch (error) {
      logger.error(`❌ Ошибка при добавлении комментария: ${error.message}`);
      showNotification.error("Не удалось добавить комментарий.");
    }
  };

  // Обработчик для удаления файла
  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      logger.warn(`🗑️ Удаление файла ID: ${fileToDelete}`);
      await api.delete(`/files/${fileToDelete}/`);
      await dispatch(fetchFiles());
      showNotification.success("Файл успешно удален.");
      setFileToDelete(null);
    } catch (error) {
      logger.error(`❌ Ошибка при удалении файла ID: ${fileToDelete}: ${error.message}`);
      showNotification.error("Не удалось удалить файл.");
    }
  };

  // Обработчик для выхода с аккаунта
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navigation Header */}
      <Header
        greetingText={greetingText} 
        showAdminButton={showAdminButton} 
        onLogout={handleLogout} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">

        {/* File Upload Section */}
        <FileUploadSection
          loading={loading}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          fileComments={fileComments}
          setFileComments={setFileComments}
          handleUpload={handleUpload}
        />

        {/* Files List */}
        <FilesList
          files={fileList}
          loading={isLoading}
          error={error}
          onGenerateLink={handleLinkButtonClick}
          onDownloadFile={handleDownload}
          onSelectFileComment={(id) => setSelectedFileToComment(id)}
          onDeleteFile={(id) => setFileToDelete(id)}
          onRenameFile={handleRenameFile}
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
