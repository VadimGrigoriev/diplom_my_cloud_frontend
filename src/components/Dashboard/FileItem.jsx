/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  DownloadIcon,
  TrashIcon,
  MessageCircleIcon,
  LinkIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "lucide-react";
import { formatFileSize } from "../../utils/formatFileSize";

const FileItem = ({
  file,
  onGenerateLink,
  onDownloadFile,
  onSelectFileComment,
  onDeleteFile,
  onRenameFile
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(file.original_name);

  const handleRenameSubmit = () => {
    if (newFileName && newFileName !== file.original_name) {
      onRenameFile(file.id, newFileName);
      setIsRenaming(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
      <div className="flex-grow mr-4">
          {isRenaming ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="border rounded px-2 py-1 flex-grow"
                autoFocus
              />
              <button 
                onClick={handleRenameSubmit}
                className="text-green-500 hover:text-green-700"
              >
                Сохранить
              </button>
              <button 
                onClick={() => {
                  setIsRenaming(false);
                  setNewFileName(file.original_name);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Отмена
              </button>
            </div>
          ) : (
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="font-medium text-gray-800">{file.original_name}</h3>
              {file.comment && (
                <div className="ml-2 flex items-center">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-1">
                    Комментарий
                  </span>
                  {isExpanded ? 
                    <ChevronUpIcon className="w-4 h-4 text-gray-400" /> : 
                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                  }
                </div>
              )}
            </div>
          )}
          <div className="text-sm text-gray-500 space-x-4">
            <span>{formatFileSize(file.size)}</span>
            <span>Загружен: {new Date(file.uploaded_at).toLocaleDateString()}</span>
            <span>
              Дата последнего скачивания: {file.last_downloaded 
                ? new Date(file.last_downloaded).toLocaleString() 
                : "Еще не скачивался"}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsRenaming(true)}
            className="group relative text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <EditIcon className="w-5 h-5" />
            <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Переименовать
            </span>
          </button>

          <button
            onClick={() => onGenerateLink(file.id)}
            className="group relative text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Создать ссылку
            </span>
          </button>

          <button
            onClick={() => onDownloadFile(file.id)}
            className="group relative text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
          >
            <DownloadIcon className="w-5 h-5" />
            <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Скачать
            </span>
          </button>

          <button
            onClick={() => onSelectFileComment(file.id)}
            className="group relative text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors"
          >
            <MessageCircleIcon className="w-5 h-5" />
            <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Добавить комментарий
            </span>
          </button>

          <button
            onClick={() => onDeleteFile(file.id)}
            className="group relative text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
              Удалить
            </span>
          </button>
        </div>
      </div>

      {file.comment && isExpanded && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
          <p className="text-gray-700">{file.comment}</p>
        </div>
      )}
    </div>
  );
};

export default FileItem;
