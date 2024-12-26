/* eslint-disable react/prop-types */
import { XIcon, Copy, CheckIcon } from "lucide-react";

const LinkModal = ({
  isOpen,
  generatedLink,
  copySuccess,
  onCopyLink,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Ссылка для скачивания</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Link Container */}
        <div className="mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-grow break-all text-gray-700">
              {generatedLink}
            </div>
            <button
              onClick={onCopyLink}
              className={`p-2 rounded-md transition-colors ${
                copySuccess
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
              title="Копировать ссылку"
            >
              {copySuccess ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-sm text-gray-500 mb-6">
          Эту ссылку можно использовать для прямого скачивания файла.
          Поделитесь ею с теми, кому нужен доступ к файлу.
        </p>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
