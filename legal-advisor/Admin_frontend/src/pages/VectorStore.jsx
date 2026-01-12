import { useState, useEffect } from 'react';
import { vectorStoreAPI } from '../services/api';

export default function VectorStore() {
  const [stats, setStats] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rebuildJob, setRebuildJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError(null);
      const response = await vectorStoreAPI.stats();
      setStats(response.data);
    } catch (error) {
      setError('Failed to load vector store statistics');
    } finally {
      setLoading(false);
    }
  };

  const searchVectorStore = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await vectorStoreAPI.search({
        query: searchQuery,
        k: 5
      });
      setSearchResults(response.data);
    } catch (error) {
      setError('Failed to search vector store');
    } finally {
      setSearching(false);
    }
  };

  const rebuildVectorStore = async () => {
    if (!confirm('This will rebuild the entire vector store. This may take several minutes. Continue?')) {
      return;
    }

    setRebuilding(true);
    try {
      const response = await vectorStoreAPI.rebuild({ confirm: true });
      setRebuildJob(response.data);
      setSuccess('Vector store rebuild initiated');
      
      // Poll for status updates
      const pollStatus = setInterval(async () => {
        try {
          const statusRes = await vectorStoreAPI.getRebuildStatus(response.data.job_id);
          setRebuildJob(statusRes.data);
          
          if (statusRes.data.status === 'completed' || statusRes.data.status === 'failed') {
            clearInterval(pollStatus);
            setRebuilding(false);
            if (statusRes.data.status === 'completed') {
              setSuccess('Vector store rebuild completed successfully');
              loadStats(); // Refresh stats
            } else {
              setError('Vector store rebuild failed');
            }
          }
        } catch (error) {
          clearInterval(pollStatus);
          setRebuilding(false);
          setError('Failed to check rebuild status');
        }
      }, 2000);
      
    } catch (error) {
      setError('Failed to initiate vector store rebuild');
      setRebuilding(false);
    }
  };

  const clearVectorStore = async () => {
    const confirmation = prompt('Type "DELETE_ALL_EMBEDDINGS" to confirm clearing all embeddings:');
    if (confirmation !== 'DELETE_ALL_EMBEDDINGS') {
      return;
    }

    setClearing(true);
    try {
      await vectorStoreAPI.clear({ confirm: 'DELETE_ALL_EMBEDDINGS' });
      setSuccess('Vector store cleared successfully');
      loadStats(); // Refresh stats
    } catch (error) {
      setError('Failed to clear vector store');
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4 animate-spin">🗄️</div>
        <p className="text-gray-600">Loading vector store data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Vector Store</h1>
        <p className="text-gray-600 mt-1">Manage embeddings and vector database</p>
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

      {/* Statistics */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">📊 Vector Store Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Chunks</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats?.vectorstore_stats?.total_chunks || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Documents</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats?.vectorstore_stats?.total_documents || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Embedding Dimension</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {stats?.vectorstore_stats?.embedding_dimension || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Storage Size</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {stats?.vectorstore_stats?.chroma_db_size_mb || 0} MB
            </p>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🔍 Search Vector Store</h2>
        
        {/* Sample Queries */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sample Queries:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "What is Article 21 of the Constitution?",
              "What are the provisions of Section 302 IPC?",
              "What is the procedure for filing an FIR?",
              "What are fundamental rights in India?",
              "What is the punishment for theft under IPC?",
              "What is the difference between IPC and BNS?",
              "What are the provisions of Section 498A?"
            ].map((query, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(query)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => e.key === 'Enter' && searchVectorStore()}
          />
          <button
            onClick={searchVectorStore}
            disabled={searching || !searchQuery.trim()}
            className="btn-primary"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {searchResults && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Search Results</h3>
              <div className="text-sm text-gray-600">
                Found {searchResults.results_count} results in {searchResults.search_time_ms}ms
              </div>
            </div>

            {searchResults.results.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">No results found for this query.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.results.map((result, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">#{result.rank}</span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Score: {result.similarity_score}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Distance: {result.distance}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result.content}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <p><strong>Source:</strong> {result.metadata?.source || 'Unknown'}</p>
                      {result.metadata?.page && (
                        <p><strong>Page:</strong> {result.metadata.page}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Management Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">⚙️ Management Actions</h2>
        <div className="space-y-4">
          
          {/* Rebuild */}
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <h3 className="font-semibold text-yellow-800 mb-2">🔄 Rebuild Vector Store</h3>
            <p className="text-sm text-yellow-700 mb-3">
              Recreate all embeddings from scratch. Use this after changing embedding models.
            </p>
            {rebuildJob && rebuilding && (
              <div className="mb-3 p-3 bg-blue-50 rounded border">
                <p className="text-sm font-medium">Rebuild Progress:</p>
                <p className="text-sm">Status: {rebuildJob.status}</p>
                {rebuildJob.progress && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rebuildJob.progress.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1">
                      {rebuildJob.progress.processed} / {rebuildJob.progress.total} files
                    </p>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={rebuildVectorStore}
              disabled={rebuilding}
              className="btn-warning"
            >
              {rebuilding ? 'Rebuilding...' : 'Rebuild Vector Store'}
            </button>
          </div>

          {/* Clear */}
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-semibold text-red-800 mb-2">🗑️ Clear Vector Store</h3>
            <p className="text-sm text-red-700 mb-3">
              Delete all embeddings. Documents will remain but need to be reprocessed.
            </p>
            <button
              onClick={clearVectorStore}
              disabled={clearing}
              className="btn-danger"
            >
              {clearing ? 'Clearing...' : 'Clear All Embeddings'}
            </button>
          </div>
        </div>
      </div>

      {/* Documents by Type */}
      {stats?.documents_by_type && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📚 Documents by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.documents_by_type).map(([type, data]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {data.chunks} chunks
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}