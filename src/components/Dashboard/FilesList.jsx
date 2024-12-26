/* eslint-disable react/prop-types */
import FileItem from "./FileItem";

const FilesList = ({
  files,
  loading,
  onGenerateLink,      // handleLinkButtonClick
  onDownloadFile,       // handleDownload
  onSelectFileComment,  // setSelectedFileToComment
  onDeleteFile          // setFileToDelete
}) => {
  return (
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
            <FileItem
              key={file.id}
              file={file}
              onGenerateLink={onGenerateLink}
              onDownloadFile={onDownloadFile}
              onSelectFileComment={onSelectFileComment}
              onDeleteFile={onDeleteFile}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FilesList;
