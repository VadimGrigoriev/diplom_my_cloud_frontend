/* eslint-disable react/prop-types */
import {
  DownloadIcon,
  TrashIcon,
  MessageCircleIcon,
  LinkIcon,
} from "lucide-react";
import { formatFileSize } from "../../utils/formatFileSize";

const FileItem = ({
  file,
  onGenerateLink,
  onDownloadFile,
  onSelectFileComment,
  onDeleteFile
}) => {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex-grow mr-4">
        <h3 className="font-medium text-gray-800">{file.original_name}</h3>
        <div className="text-sm text-gray-500 space-x-4">
          <span>{formatFileSize(file.size)}</span>
          <span>Загружен: {new Date(file.uploaded_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onGenerateLink(file.id)}
          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
          title="Создать ссылку"
        >
          <LinkIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => onDownloadFile(file.id)}
          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
          title="Скачать"
        >
          <DownloadIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectFileComment(file.id)}
          className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
          title="Добавить комментарий"
        >
          <MessageCircleIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => onDeleteFile(file.id)}
          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
          title="Удалить"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FileItem;
