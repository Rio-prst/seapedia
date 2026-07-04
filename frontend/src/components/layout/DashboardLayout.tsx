import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
    } else if (!user.activeRole) {
      navigate('/role-select', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user || !user.activeRole) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-teal-600 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="md:hidden flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-slate-600 hover:text-slate-800 cursor-pointer"
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-bold text-teal-600">SEAPEDIA</span>
        </div>
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
