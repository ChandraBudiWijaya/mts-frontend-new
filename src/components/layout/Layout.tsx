import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="flex pt-16">{/* push content under header */}
        {/* Sidebar - fixed under header, independent scrollbar */}
        <div
          className={`fixed left-0 z-50 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          } top-16 bottom-0`}
          style={{ willChange: 'transform' }}
        >
          {/* Ensure sidebar fills remaining viewport (under header) and allows its own scroll */}
          <div className="h-[calc(100vh-4rem)] min-h-0 w-max overflow-y-auto">
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>
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

        {/* Main content - leave space for header (pt-16) and sidebar (lg:ml-64 or lg:ml-16) */}
        <div className={`flex-1 relative z-10 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <main className="flex-1 px-4 pt-2 min-h-[calc(100vh-4rem)] overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
