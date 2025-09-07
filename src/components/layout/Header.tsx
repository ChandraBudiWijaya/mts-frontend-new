import { useState } from 'react';
import { useAuth } from '../../shared/hooks';
import {
  UserIcon,
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const todayString = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date());

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-primary-100 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle (for mobile) */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-primary-700 hover:text-primary-900 hover:bg-primary-50"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0] || 'Guest'}!
            </h1>
            <p className="text-sm text-gray-600">
              {user?.position || 'Demo Mode'} • {user?.plantation_group || 'MTS Dashboard'}
            </p>
          </div>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs text-gray-500">Tanggal hari ini:</span>
            <span className="text-sm font-medium text-gray-900">{todayString}</span>
          </div>
          {/* Notifications */}
          <button className="p-2 rounded-md text-primary-700 hover:text-primary-900 hover:bg-primary-50 relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-md text-primary-700 hover:text-primary-900 hover:bg-primary-50"
            >
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Guest User'}</p>
                  <p className="text-xs text-gray-600">{user?.email || 'demo@mts-dashboard.com'}</p>
                </div>
              </div>
              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Guest User'}</p>
                    <p className="text-sm text-gray-600">{user?.email || 'demo@mts-dashboard.com'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user?.roles?.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {role.name}
                        </span>
                      )) || (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Demo User
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu items */}
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserCircleIcon className="h-4 w-4 mr-3" />
                    Profile Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
