import { useState, useEffect } from 'react';
import { configAPI } from '../services/api';

export default function Configuration() {
  const [chunkConfig, setChunkConfig] = useState(null);
  const [embeddingConfig, setEmbeddingConfig] = useState(null);
  const [retrievalConfig, setRetrievalConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setError(null);
      const [chunkRes, embeddingRes, retrievalRes] = await Promise.all([
        configAPI.getChunkConfig(),
        configAPI.getEmbeddingConfig(),
        configAPI.getRetrievalConfig(),
      ]);
      setChunkConfig(chunkRes.data.chunk_config);
      setEmbeddingConfig(embeddingRes.data.embedding_config);
      setRetrievalConfig(retrievalRes.data.retrieval_config);
    } catch (error) {
      setError('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  const updateChunkConfig = async (newConfig) => {
    setSaving(true);
    try {
      await configAPI.updateChunkConfig(newConfig);
      setSuccess('Chunking configuration updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update chunking configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateEmbeddingConfig = async (newConfig) => {
    setSaving(true);
    try {
      await configAPI.updateEmbeddingConfig(newConfig);
      setSuccess('Embedding configuration updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update embedding configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateRetrievalConfig = async (newConfig) => {
    setSaving(true);
    try {
      await configAPI.updateRetrievalConfig(newConfig);
      setSuccess('Retrieval configuration updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update retrieval configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4 animate-spin">⚙️</div>
        <p className="text-gray-600">Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuration</h1>
        <p className="text-gray-600 mt-1">Manage system settings and parameters</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Chunking Configuration */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">📄 Chunking Configuration</h2>
            <p className="text-xs text-gray-500 mt-1">(Default for ALL Future Documents)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chunk Size
            </label>
            <input
              type="number"
              value={chunkConfig?.chunk_size || 1000}
              onChange={(e) => setChunkConfig({...chunkConfig, chunk_size: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Number of characters per chunk</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chunk Overlap
            </label>
            <input
              type="number"
              value={chunkConfig?.chunk_overlap || 200}
              onChange={(e) => setChunkConfig({...chunkConfig, chunk_overlap: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Overlap between chunks</p>
          </div>
        </div>
        <button
          onClick={() => updateChunkConfig(chunkConfig)}
          disabled={saving}
          className="mt-4 btn-primary"
        >
          {saving ? 'Saving...' : 'Update Chunking Config'}
        </button>
      </div>

      {/* Embedding Configuration */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🧠 Embedding Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Name
            </label>
            <select
              value={embeddingConfig?.model_name || ''}
              onChange={(e) => setEmbeddingConfig({...embeddingConfig, model_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2 (384 dim)</option>
              <option value="sentence-transformers/all-mpnet-base-v2">all-mpnet-base-v2 (768 dim)</option>
              <option value="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2">multilingual-MiniLM-L12-v2</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={embeddingConfig?.normalize_embeddings || false}
                onChange={(e) => setEmbeddingConfig({...embeddingConfig, normalize_embeddings: e.target.checked})}
                className="mr-2"
              />
              Normalize Embeddings
            </label>
          </div>
        </div>
        <button
          onClick={() => updateEmbeddingConfig(embeddingConfig)}
          disabled={saving}
          className="mt-4 btn-primary"
        >
          {saving ? 'Saving...' : 'Update Embedding Config'}
        </button>
      </div>

      {/* Retrieval Configuration */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🔍 Retrieval Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Results (k)
            </label>
            <input
              type="number"
              value={retrievalConfig?.k || 5}
              onChange={(e) => setRetrievalConfig({...retrievalConfig, k: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Number of chunks to retrieve</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Type
            </label>
            <select
              value={retrievalConfig?.search_type || 'similarity'}
              onChange={(e) => setRetrievalConfig({...retrievalConfig, search_type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="similarity">Similarity</option>
              <option value="mmr">MMR (Maximal Marginal Relevance)</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => updateRetrievalConfig(retrievalConfig)}
          disabled={saving}
          className="mt-4 btn-primary"
        >
          {saving ? 'Saving...' : 'Update Retrieval Config'}
        </button>
      </div>
    </div>
  );
}