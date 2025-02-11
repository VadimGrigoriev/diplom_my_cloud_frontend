/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Upload, X, CheckCircle2, MessageSquare } from 'lucide-react';
import CustomAlert from './Modals/CustomAlert';

const FileUploadSection = ({
  loading,
  selectedFiles,
  setSelectedFiles,
  fileComments,
  setFileComments,
  handleUpload
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const newFiles = [...e.dataTransfer.files];
    addFilesToList(newFiles);
  };

  const addFilesToList = (newFiles) => {
    const dt = new DataTransfer();
    
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(file => dt.items.add(file));
    }
    
    newFiles.forEach(file => dt.items.add(file));
    
    setError('');
    setSelectedFiles(dt.files);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      addFilesToList(newFiles);
    }
  };

  const removeFile = (index) => {
    const dt = new DataTransfer();
    const files = Array.from(selectedFiles);
    files.splice(index, 1);
    files.forEach(file => dt.items.add(file));
    setSelectedFiles(dt.files);
    
    // Удаляем комментарий для удаленного файла
    const newComments = { ...fileComments };
    delete newComments[index];
    setFileComments(newComments);
  };

  const handleCommentChange = (index, comment) => {
    setFileComments(prev => ({
      ...prev,
      [index]: comment
    }));
  };

  const handleUploadWithComments = () => {
    // Создаем FormData с файлами и комментариями
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file, index) => {
      formData.append("files", file);
      if (fileComments[index]) {
        formData.append(`comments[${index}]`, fileComments[index]);
      }
    });
    
    handleUpload(formData);
  };

  return (
    <section className="mb-8 bg-blue-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
        <Upload size={24} />
        Загрузить файлы
      </h2>
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
          ${error ? 'border-red-300' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-gray-600">
            Перетащите файлы сюда или кликните для выбора
          </div>
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="text-sm text-gray-500">
              Выбрано файлов: {selectedFiles.length}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <CustomAlert>{error}</CustomAlert>
        </div>
      )}

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Выбранные файлы:</h3>
          <div className="space-y-2">
            {Array.from(selectedFiles).map((file, index) => (
              <div key={`${file.name}-${index}`}>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCommentId(editingCommentId === index ? null : index)}
                      className="group relative"
                      title={fileComments[index] ? "Редактировать комментарий" : "Добавить комментарий"}
                    >
                      <MessageSquare 
                        className={`h-4 w-4 transition-colors ${
                          fileComments[index] && fileComments[index].trim() !== '' 
                            ? 'text-blue-500 hover:text-blue-600' 
                            : 'text-gray-400 hover:text-blue-500'
                        }`}
                      />
                      {fileComments[index] && fileComments[index].trim() !== '' && (
                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full -top-1 -right-1" />
                      )}
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Удалить файл"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {editingCommentId === index && (
                  <div className="mt-2 pl-6">
                    <textarea
                      value={fileComments[index] || ''}
                      onChange={(e) => handleCommentChange(index, e.target.value)}
                      placeholder="Добавить комментарий к файлу..."
                      className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows="2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleUploadWithComments}
        disabled={loading || !selectedFiles || selectedFiles.length === 0}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        <Upload className="h-5 w-5" />
        {loading ? "Загрузка..." : "Загрузить файлы"}
      </button>
    </section>
  );
};

export default FileUploadSection;
