import { useState } from 'react';

export default function DeleteConfirmModal({ document, onConfirm, onCancel }) {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== 'DELETE') return;
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Delete Document</h2>
        
        <div className="space-y-4 mb-6">
          <p className="text-gray-700">
            You are about to permanently delete:
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-semibold text-gray-900">{document.filename}</p>
            <p className="text-sm text-gray-600 mt-1">Size: {document.size_mb} MB</p>
            <p className="text-sm text-gray-600">Chunks: {document.chunk_count}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ This action is irreversible!
            </p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• PDF file will be deleted from disk</li>
              <li>• All {document.chunk_count} embeddings will be removed from vector store</li>
              <li>• This cannot be undone</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="input-field"
              placeholder="Type DELETE"
              autoFocus
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmText !== 'DELETE' || loading}
            className="flex-1 btn-danger"
          >
            {loading ? 'Deleting...' : 'Delete Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
