/* eslint-disable react/prop-types */
const CommentModal = ({
  isOpen,
  comment,
  setComment,
  onConfirm,     // handleAddComment
  onCancel       // закрытие модалки
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
