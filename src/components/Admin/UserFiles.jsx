/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserFiles, deleteFile } from "../../features/fileSlice";
import { useParams, useNavigate } from "react-router-dom";
import { TrashIcon, FileIcon, ArrowLeftIcon } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import DeleteConfirmation from "./DeleteConfirmation";

const UserFiles = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fileList, isLoading, error } = useSelector((state) => state.files);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUserFiles(userId));
  }, [dispatch, userId]);

  const handleDeleteFile = (fileId) => {
    dispatch(deleteFile({ fileId, userId }));
    setFileToDelete(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin/')}
              className="mr-4 hover:bg-red-700 p-2 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold flex items-center">
              <FileIcon className="mr-3 w-8 h-8" />
              Файлы пользователя
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-red-50 border-b border-red-100">
            <h2 className="text-xl font-semibold text-red-800">Список файлов</h2>
          </div>

          {fileList.length === 0 ? (
            <div className="text-center py-8 bg-gray-50">
              <p className="text-gray-600">Файлов пока нет</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-red-100 text-red-800">
                <tr>
                  {["ID", "Имя файла", "Размер", "Загружен", "Действия"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileList.map((file) => (
                  <tr 
                    key={file.id} 
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{file.id}</td>
                    <td className="px-4 py-3">{file.original_name}</td>
                    <td className="px-4 py-3">{(file.size / 1024).toFixed(2)} KB</td>
                    <td className="px-4 py-3">{new Date(file.uploaded_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => setFileToDelete(file)}
                        className="group relative text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {fileToDelete && (
        <DeleteConfirmation 
          confirmDelete={fileToDelete.id} 
          setConfirmDelete={setFileToDelete} 
          deleteUser={handleDeleteFile}
          isFile={true}
        />
      )}
    </div>
  );
};

export default UserFiles;
