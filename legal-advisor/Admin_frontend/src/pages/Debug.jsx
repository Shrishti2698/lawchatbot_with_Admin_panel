import { useState, useEffect } from 'react';
import { vectorStoreAPI, systemAPI } from '../services/api';

export default function Debug() {
  const [systemHealth, setSystemHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSystemHealth();
  }, []);

  const loadSystemHealth = async () => {
    try {
      setError(null);
      const response = await systemAPI.health();
      setSystemHealth(response.data);
    } catch (error) {
      setError('Failed to load system health');
    } finally {
      setLoadingHealth(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Debug Tools</h1>
        <p className="text-gray-600 mt-1">Test retrieval system and debug issues</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* System Health */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🏥 System Health Check</h2>
        {loadingHealth ? (
          <p className="text-gray-600">Loading health status...</p>
        ) : systemHealth ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {systemHealth.status === 'healthy' ? '✅' : '❌'}
              </span>
              <div>
                <p className="font-semibold">Overall Status: {systemHealth.status}</p>
                <p className="text-sm text-gray-600">Last checked: {new Date(systemHealth.timestamp).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {systemHealth.components && Object.entries(systemHealth.components).map(([component, status]) => (
                <div key={component} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {status.status === 'healthy' || status.status === 'loaded' || status.status === 'accessible' ? '✅' : '❌'}
                    </span>
                    <div>
                      <p className="font-medium capitalize">{component.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">{status.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {systemHealth.statistics && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">System Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total PDFs</p>
                    <p className="font-semibold">{systemHealth.statistics.total_pdfs}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Chunks</p>
                    <p className="font-semibold">{systemHealth.statistics.total_chunks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Storage Used</p>
                    <p className="font-semibold">{systemHealth.statistics.storage_used_mb} MB</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-600">Failed to load system health</p>
        )}
        
        <button
          onClick={loadSystemHealth}
          className="mt-4 btn-primary"
        >
          Refresh Health Check
        </button>
      </div>

      {/* Debug Information */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🐛 Debug Information</h2>
        <div className="space-y-4">
          
          {/* Browser Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Browser Information</h3>
            <div className="text-sm space-y-1">
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>Language:</strong> {navigator.language}</p>
              <p><strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</p>
              <p><strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Local Storage */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Local Storage</h3>
            <div className="text-sm">
              <p><strong>Admin Token:</strong> {localStorage.getItem('admin_token') ? 'Present' : 'Missing'}</p>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">API Configuration</h3>
            <div className="text-sm space-y-1">
              <p><strong>Base URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8000'}</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}