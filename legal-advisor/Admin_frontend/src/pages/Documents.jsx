import { useState, useEffect } from 'react';
import { documentAPI } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slowLoading, setSlowLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, doc: null });

  useEffect(() => {
    loadDocuments();
    
    // Show message if loading takes more than 3 seconds
    const timer = setTimeout(() => {
      if (loading) {
        setSlowLoading(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const loadDocuments = async () => {
    try {
      setError(null);
      setSlowLoading(false);
      const response = await documentAPI.list();
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout - Backend is taking too long. Try restarting the backend.');
      } else {
        setError(error.response?.data?.detail || error.message || 'Failed to load documents');
      }
    } finally {
      setLoading(false);
      setSlowLoading(false);
    }
  };

  const handleDelete = async (filename, folder) => {
    try {
      await documentAPI.delete(filename, folder);
      loadDocuments();
      setDeleteModal({ show: false, doc: null });
    } catch (error) {
      alert('Error deleting document: ' + (error.response?.data?.detail || error.message));
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'indexed' && doc.in_vectorstore) ||
      (filter === 'not_indexed' && !doc.in_vectorstore);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <p className="text-gray-600 mb-2">Loading documents...</p>
        {slowLoading && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-yellow-800 text-sm">
              ⚠️ This is taking longer than usual. Backend might be scanning many files.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">❌ Error Loading Documents</h2>
        <p className="text-red-700">{error}</p>
        <button onClick={loadDocuments} className="mt-4 btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
          <p className="text-gray-600 mt-1">Manage your legal knowledge base</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Documents</option>
            <option value="indexed">Indexed Only</option>
            <option value="not_indexed">Not Indexed</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filename</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chunks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocs.map((doc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">{doc.filename}</p>
                        <p className="text-sm text-gray-500">{doc.full_path}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.size_mb} MB</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.chunk_count}</td>
                  <td className="px-6 py-4">
                    {doc.in_vectorstore ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✅ Indexed
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ❌ Not Indexed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(doc.modified_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setDeleteModal({ show: true, doc })}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No documents found
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <DeleteConfirmModal
          document={deleteModal.doc}
          onConfirm={() => handleDelete(deleteModal.doc.filename, deleteModal.doc.folder)}
          onCancel={() => setDeleteModal({ show: false, doc: null })}
        />
      )}
    </div>
  );
}
