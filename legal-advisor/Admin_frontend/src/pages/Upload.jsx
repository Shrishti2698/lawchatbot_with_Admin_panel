import { useState } from 'react';
import { documentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('bns');
  const [chunkSize, setChunkSize] = useState(1000);
  const [chunkOverlap, setChunkOverlap] = useState(200);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const documentTypes = [
    { value: 'constitution', label: 'Constitution' },
    { value: 'ipc', label: 'IPC' },
    { value: 'crpc', label: 'CrPC' },
    { value: 'bns', label: 'BNS 2024' },
    { value: 'bnss', label: 'BNSS 2024' },
    { value: 'bsa', label: 'BSA 2024' },
    { value: 'supreme_court', label: 'Supreme Court' },
    { value: 'high_court', label: 'High Court' },
    { value: 'other', label: 'Other' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.name.endsWith('.pdf')) {
      alert('Only PDF files are allowed');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('chunk_size', chunkSize);
    formData.append('chunk_overlap', chunkOverlap);

    try {
      const response = await documentAPI.upload(formData);
      setResult(response.data);
      setFile(null);
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Upload Document</h1>
        <p className="text-gray-600 mt-1">Add new legal document to knowledge base</p>
      </div>

      <form onSubmit={handleUpload} className="card space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF File *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type *
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="input-field"
            required
          >
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Options */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            {showAdvanced ? '▼' : '▶'} Advanced Options (For specific Document)
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chunk Size (characters)
                </label>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                  className="input-field"
                  min="100"
                  max="5000"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 500-2000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chunk Overlap (characters)
                </label>
                <input
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
                  className="input-field"
                  min="0"
                  max="1000"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 10-20% of chunk size</p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={!file || uploading}
            className="btn-primary flex-1"
          >
            {uploading ? 'Processing...' : 'Upload & Process'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Processing Result */}
      {result && (
        <div className="card bg-green-50 border border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-4">✅ Upload Successful!</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Pages Extracted</p>
              <p className="text-2xl font-bold text-green-700">{result.processing_stats.pages_extracted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Chunks Created</p>
              <p className="text-2xl font-bold text-green-700">{result.processing_stats.chunks_created}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Embeddings</p>
              <p className="text-2xl font-bold text-green-700">{result.processing_stats.embeddings_generated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing Time</p>
              <p className="text-2xl font-bold text-green-700">{result.processing_time_seconds}s</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-gray-700">
              <strong>Saved to:</strong> {result.saved_path}
            </p>
          </div>

          <button
            onClick={() => navigate('/documents')}
            className="mt-4 btn-primary"
          >
            View All Documents
          </button>
        </div>
      )}
    </div>
  );
}
