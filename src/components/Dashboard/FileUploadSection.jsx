/* eslint-disable react/prop-types */
const FileUploadSection = ({
  loading,
  selectedFiles,
  setSelectedFiles,
  handleUpload
}) => {
  return (
    <section className="mb-8 bg-blue-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Загрузить файлы</h2>
      <div className="flex items-center space-x-4">
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={(e) => setSelectedFiles(e.target.files)}
          className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />
        <button
          onClick={handleUpload}
          disabled={loading || !selectedFiles}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
        >
          {loading ? "Загрузка..." : "Загрузить"}
        </button>
      </div>
    </section>
  );
};

export default FileUploadSection;
