import { useState, useRef } from 'react';
// --- FIX: Import the centralized 'api' instance, not raw axios ---
import api from '../services/api';

// --- FIX: Remove the hardcoded API_URL that causes CORS errors ---
// const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export default function ImageUpload({ onUploadComplete, linkedDocumentId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'tif', 'pdf'];
    const validFiles = newFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return allowedFormats.includes(ext);
    });

    if (validFiles.length !== newFiles.length) {
      alert('Some files were skipped. Only JPG, PNG, WEBP, TIFF, and PDF files are allowed.');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setUploading(true);
    setUploadResults([]);

    try {
      const formData = new FormData();

      files.forEach(file => {
        formData.append('files', file);
      });

      if (linkedDocumentId) {
        formData.append('linked_document_id', linkedDocumentId);
      }

      // --- FIX: Use the centralized 'api' instance for the POST request ---
      // This call will now correctly go through the Vite proxy.
      const response = await api.post(
        '/media/upload',
        formData,
        {
          // The 'api' instance automatically handles the Authorization token.
          // We only need to specify the Content-Type for file uploads.
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUploadResults(response.data.media || []);
      setFiles([]);

      setTimeout(() => {
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 2000);

    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  // --- UI Code (Unchanged) ---
  // The UI has been updated to match the LegAIntel aesthetic.
  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-[#c5a059] bg-[#c5a059]/10'
            : 'border-white/10 hover:border-white/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <svg
          className="mx-auto h-12 w-12 text-slate-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="text-sm text-slate-400 mb-2">
          <span className="font-semibold text-[#c5a059] hover:text-[#e0c286] cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            Click to upload
          </span>
          {' '}or drag and drop
        </p>
        <p className="text-xs text-slate-500">
          JPG, PNG, WEBP, TIFF, or PDF up to 10MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.tiff,.tif,.pdf"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded p-3"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <svg
                    className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-4 text-red-500 hover:text-red-400 disabled:opacity-30"
                  disabled={uploading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadResults.length > 0 && (
        <div className="mt-4 bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-emerald-400 mb-2">
            Upload Complete
          </h3>
          <div className="space-y-1">
            {uploadResults.map((result, index) => (
              <div key={index} className="text-sm text-emerald-300 flex items-center">
                {result.status === 'processing' ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {result.filename} - queued for processing...
                  </>
                ) : result.status === 'failed' ? (
                  <>
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {result.filename} - {result.error}
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && uploadResults.length === 0 && (
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setFiles([])}
            className="px-4 py-2 border border-white/10 rounded text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-white/5 transition-colors"
            disabled={uploading}
          >
            Clear All
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-[#c5a059] text-black rounded text-xs font-bold uppercase tracking-widest hover:bg-[#b38f48] transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}