import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Full width at top */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex">
        {/* Sidebar - Below header */}
        <div className={`fixed top-16 left-0 bottom-0 z-50 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:transform-none ${
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        } transition-all duration-300`}>
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 relative z-10">
          <main className="flex-1 px-4 overflow-x-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
