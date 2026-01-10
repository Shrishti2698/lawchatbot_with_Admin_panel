import { useState, useEffect } from 'react';
import { systemAPI, vectorStoreAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slowLoading, setSlowLoading] = useState(false);

  useEffect(() => {
    loadData();
    
    // Show message if loading takes more than 3 seconds
    const timer = setTimeout(() => {
      if (loading) {
        setSlowLoading(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setSlowLoading(false);
      const [healthRes, statsRes] = await Promise.all([
        systemAPI.health(),
        vectorStoreAPI.stats(),
      ]);
      setHealth(healthRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout - Backend is taking too long. Try restarting the backend.');
      } else {
        setError(error.response?.data?.detail || error.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setSlowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <p className="text-gray-600 mb-2">Loading dashboard...</p>
        {slowLoading && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-yellow-800 text-sm">
              ⚠️ This is taking longer than usual. Backend might be processing large data.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">❌ Error Loading Dashboard</h2>
        <p className="text-red-700">{error}</p>
        <button onClick={loadData} className="mt-4 btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and quick stats</p>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Status</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {health?.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}
              </p>
            </div>
            <div className="text-4xl">🏥</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Documents</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {health?.statistics?.total_pdfs || 0}
              </p>
            </div>
            <div className="text-4xl">📄</div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Chunks</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {stats?.vectorstore_stats?.total_chunks || 0}
              </p>
            </div>
            <div className="text-4xl">🧩</div>
          </div>
        </div>
      </div>

      {/* Components Status */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Component Status</h2>
        <div className="space-y-3">
          {health?.components && Object.entries(health.components).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {value.status === 'healthy' || value.status === 'loaded' ? '✅' : '❌'}
                </span>
                <div>
                  <p className="font-medium capitalize">{key.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600">{value.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vector Store Stats */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Vector Store Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Embedding Dimension</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats?.vectorstore_stats?.embedding_dimension}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Storage Size</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats?.vectorstore_stats?.chroma_db_size_mb} MB
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Documents</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {stats?.vectorstore_stats?.total_documents}
            </p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Chunks</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {stats?.vectorstore_stats?.total_chunks}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/upload" className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors text-center">
            <div className="text-4xl mb-2">⬆️</div>
            <p className="font-semibold">Upload Document</p>
          </Link>
          <Link to="/documents" className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors text-center">
            <div className="text-4xl mb-2">📄</div>
            <p className="font-semibold">Manage Documents</p>
          </Link>
          <Link to="/debug" className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors text-center">
            <div className="text-4xl mb-2">🔍</div>
            <p className="font-semibold">Test Retrieval</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
