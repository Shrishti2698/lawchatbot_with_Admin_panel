import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Upload from './pages/Upload';
import Configuration from './pages/Configuration';
import VectorStore from './pages/VectorStore';
import Debug from './pages/Debug';
import DashboardLayout from './components/DashboardLayout';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/documents" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Documents />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Upload />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/config" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Configuration />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/vectorstore" element={
          <ProtectedRoute>
            <DashboardLayout>
              <VectorStore />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/debug" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Debug />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
