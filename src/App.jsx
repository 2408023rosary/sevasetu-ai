import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import WorkerLogin from './pages/WorkerLogin';
import WorkerDashboard from './pages/WorkerDashboard';
import Sidebar from './components/Sidebar';

function ProtectedLayout() {
  const token = localStorage.getItem('adminToken');

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/worker/login" element={<WorkerLogin />} />
      <Route path="/worker/dashboard" element={<WorkerDashboard />} />
      <Route path="/worker/*" element={<Navigate to="/worker/dashboard" replace />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
