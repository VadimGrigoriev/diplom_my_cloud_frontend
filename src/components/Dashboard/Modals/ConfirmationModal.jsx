import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Подтверждение", 
  message = "Вы уверены?", 
  confirmText = "Да", 
  cancelText = "Отмена" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative w-auto max-w-lg mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white rounded-lg shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="relative p-6 flex-auto">
            <p className="my-4 text-gray-600 text-lg leading-relaxed">
              {message}
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-200">
            <button
              className="px-6 py-2 mr-4 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
