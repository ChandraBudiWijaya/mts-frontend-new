import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks';
import Logo from "../../assets/images/GGF.svg";
import {
  HomeIcon,
  UsersIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  MapPinIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  permission?: string;
}

const navDashboard: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
];

const navMasterData: NavigationItem[] = [
  { name: 'Lokasi', href: '/locations', icon: MapIcon, permission: 'view-geofences' },
  { name: 'User', href: '/users', icon: UsersIcon, permission: 'view-employees' },
  { name: 'RBAC', href: '/rbac', icon: CogIcon, permission: 'view-parameters' },
  { name: 'Setting Parameter', href: '/settings', icon: CogIcon, permission: 'view-parameters' },
];

const navRencanaKerja: NavigationItem[] = [
  { name: 'Work Plans', href: '/work-plans', icon: ClipboardDocumentListIcon, permission: 'view-work-plans' },
];

const navLiveTracking: NavigationItem[] = [
  { name: 'Live Tracking', href: '/live-tracking', icon: MapPinIcon, permission: 'view-reports' },
];

const navReport: NavigationItem[] = [
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, permission: 'view-reports' },
];

export default function Sidebar() {
  const location = useLocation();
  const { hasPermission, logout, isAuthenticated } = useAuth();

  const filter = (items: NavigationItem[]) =>
    items.filter((item) => !item.permission || !isAuthenticated || hasPermission(item.permission));

  return (
    <div className="bg-primary-800 text-white w-64 min-h-screen flex flex-col shadow-xl border-r border-primary-700">
      {/* Logo/Header */}
      <div className="p-5 border-b border-primary-700 bg-primary-700/40 flex items-center gap-3">
        <img src={Logo} alt="MTS" className="w-12 h-12 rounded-sm bg-white/90 p-1" />
        <div>
          <h1 className="text-lg font-semibold text-white leading-tight">MTS Dashboard</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Dashboard */}
        <div>
          <div className="px-3 py-1 text-primary-100/70 text-[11px] uppercase tracking-wider">Dashboard</div>
          <div className="space-y-1">
            {filter(navDashboard).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 rounded-md border-l-4 transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400/95 text-white border-amber-500 shadow'
                      : 'text-primary-100/90 hover:bg-primary-700 hover:text-white border-transparent'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Master Data */}
        <div>
          <div className="px-3 py-1 text-primary-100/70 text-[11px] uppercase tracking-wider">Master Data</div>
          <div className="space-y-1">
            {filter(navMasterData).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 rounded-md border-l-4 transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400/95 text-white border-amber-500 shadow'
                      : 'text-primary-100/90 hover:bg-primary-700 hover:text-white border-transparent'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Rencana Kerja */}
        <div>
          <div className="px-3 py-1 text-primary-100/70 text-[11px] uppercase tracking-wider">Rencana Kerja</div>
          <div className="space-y-1">
            {filter(navRencanaKerja).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 rounded-md border-l-4 transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400/95 text-white border-amber-500 shadow'
                      : 'text-primary-100/90 hover:bg-primary-700 hover:text-white border-transparent'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live Tracking */}
        <div>
          <div className="px-3 py-1 text-primary-100/70 text-[11px] uppercase tracking-wider">Live Tracking</div>
          <div className="space-y-1">
            {filter(navLiveTracking).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 rounded-md border-l-4 transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400/95 text-white border-amber-500 shadow'
                      : 'text-primary-100/90 hover:bg-primary-700 hover:text-white border-transparent'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Report */}
        <div>
          <div className="px-3 py-1 text-primary-100/70 text-[11px] uppercase tracking-wider">Report</div>
          <div className="space-y-1">
            {filter(navReport).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 rounded-md border-l-4 transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400/95 text-white border-amber-500 shadow'
                      : 'text-primary-100/90 hover:bg-primary-700 hover:text-white border-transparent'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Management Account */}
        <div>
          <div className="px-3 py-1 text-primary-100/70 text-[11px] uppercase tracking-wider">Management Account</div>
          <div className="space-y-1 px-1">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2.5 rounded-md text-red-100 hover:text-white hover:bg-red-600/90 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-3 border-t border-primary-700">
        <p className="text-primary-100/70 text-xs text-center">
          © 2025 MTS Dashboard v1.0
        </p>
      </div>
    </div>
  );
}
