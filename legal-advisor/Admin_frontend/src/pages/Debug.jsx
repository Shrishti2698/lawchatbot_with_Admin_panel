import { useState, useEffect } from 'react';
import { vectorStoreAPI, systemAPI } from '../services/api';

export default function Debug() {
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [testing, setTesting] = useState(false);
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

  const testRetrieval = async () => {
    if (!testQuery.trim()) return;
    
    setTesting(true);
    try {
      const response = await vectorStoreAPI.search({
        query: testQuery,
        k: 10
      });
      setTestResults(response.data);
    } catch (error) {
      setError('Failed to test retrieval');
    } finally {
      setTesting(false);
    }
  };

  const sampleQueries = [
    "What is Article 21 of the Constitution?",
    "What are the provisions of Section 302 IPC?",
    "What is the procedure for filing an FIR?",
    "What are fundamental rights in India?",
    "What is the punishment for theft under IPC?"
  ];

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

      {/* Retrieval Testing */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🔍 Test Retrieval System</h2>
        
        {/* Sample Queries */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Sample Queries:</h3>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setTestQuery(query)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Enter test query..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => e.key === 'Enter' && testRetrieval()}
          />
          <button
            onClick={testRetrieval}
            disabled={testing || !testQuery.trim()}
            className="btn-primary"
          >
            {testing ? 'Testing...' : 'Test Retrieval'}
          </button>
        </div>

        {/* Results */}
        {testResults && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Retrieval Results</h3>
              <div className="text-sm text-gray-600">
                Found {testResults.results_count} results in {testResults.search_time_ms}ms
              </div>
            </div>

            {testResults.results.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">No results found for this query.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.results.map((result, index) => (
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