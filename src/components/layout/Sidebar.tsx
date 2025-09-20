import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks';
import Logo from "../../assets/images/GGF_MTS.jpg";
import {
  HomeIcon,
  UsersIcon,
  MapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  MapPinIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleStackIcon,
  EyeIcon,
  DocumentTextIcon,
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
  { name: 'Role Management', href: '/rbac', icon: CogIcon, permission: 'manage-roles' },
  { name: 'Parameters', href: '/parameters', icon: CogIcon, permission: 'view-parameters' },
];

const navRencanaKerja: NavigationItem[] = [
  { name: 'Work Plans', href: '/work-plans', icon: ClipboardDocumentListIcon, permission: 'view-work-plans' },
];

const navLiveTracking: NavigationItem[] = [
  { name: 'Live Tracking', href: '/live-tracking', icon: MapPinIcon, permission: 'view-live-tracking' },
];

const navReport: NavigationItem[] = [
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, permission: 'view-reports' },
];

export default function Sidebar({ collapsed = false, onToggleCollapse }: { 
  collapsed?: boolean; 
  onToggleCollapse?: () => void; 
}) {
  const location = useLocation();
  const { logout } = useAuth();

  // Development: show all menu items regardless of permissions
  const filter = (items: NavigationItem[]) => items;

  return (
    <div className={`bg-primary-800 text-white min-h-full w-max flex flex-col shadow-xl border-r border-primary-700 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header with Logo and Collapse Button */}
      <div className={`p-4 border-b border-primary-700 bg-gradient-to-r from-primary-700 to-primary-600 flex items-center ${
        collapsed ? 'justify-center relative' : 'justify-between'
      }`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-12 h-12 rounded-lg bg-white/95 p-2 flex items-center justify-center shadow-lg">
            <img src={Logo} alt="MTS" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg   font-bold text-white leading-tight">Mandor Tracking</h1>
              <h2 className="text-sm font-medium text-primary-100 leading-tight">System</h2>
            </div>
          )}
        </div>
        
        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-lg text-primary-100 hover:text-white hover:bg-white/10 transition-all duration-200 ${
            collapsed ? 'absolute -right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 border-2 border-white shadow-lg' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className={`flex-1 py-4 ${collapsed ? 'px-2' : 'px-4'} space-y-3 overflow-y-auto scrollbar-thick scrollbar-thumb-primary-200 scrollbar-track-transparent`}>
        {/* Main Dashboard Section */}
        <div className="space-y-1">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary-300 uppercase tracking-wide ${collapsed ? 'justify-center' : ''}`}>
            <HomeIcon className="h-4 w-4" />
            {!collapsed && <span>Main</span>}
          </div>
          
          {filter(navDashboard).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/95 text-primary-800 shadow-lg transform translate-x-1'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && !isActive && (
                  <ChevronRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Data Management Section */}
        <div className="space-y-1 pt-2">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary-300 uppercase tracking-wide ${collapsed ? 'justify-center' : ''}`}>
            <CircleStackIcon className="h-4 w-4" />
            {!collapsed && <span>Data Management</span>}
          </div>
          
          {filter(navMasterData).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/95 text-primary-800 shadow-lg transform translate-x-1'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && !isActive && (
                  <ChevronRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Monitoring Section */}
        <div className="space-y-1 pt-2">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary-300 uppercase tracking-wide ${collapsed ? 'justify-center' : ''}`}>
            <EyeIcon className="h-4 w-4" />
            {!collapsed && <span>Monitoring</span>}
          </div>
          
          {filter(navLiveTracking).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/95 text-primary-800 shadow-lg transform translate-x-1'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && !isActive && (
                  <ChevronRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Work Planning Section */}
        <div className="space-y-1 pt-2">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary-300 uppercase tracking-wide ${collapsed ? 'justify-center' : ''}`}>
            <ClipboardDocumentListIcon className="h-4 w-4" />
            {!collapsed && <span>Work Planning</span>}
          </div>
          
          {filter(navRencanaKerja).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/95 text-primary-800 shadow-lg transform translate-x-1'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && !isActive && (
                  <ChevronRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Reports Section */}
        <div className="space-y-1 pt-2">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary-300 uppercase tracking-wide ${collapsed ? 'justify-center' : ''}`}>
            <DocumentTextIcon className="h-4 w-4" />
            {!collapsed && <span>Reports</span>}
          </div>
          
          {filter(navReport).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/95 text-primary-800 shadow-lg transform translate-x-1'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {!collapsed && !isActive && (
                  <ChevronRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Account Management Section */}
        <div className="space-y-1 pt-4 border-t border-primary-700/50">
          <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary-300 uppercase tracking-wide ${collapsed ? 'justify-center' : ''}`}>
            <CogIcon className="h-4 w-4" />
            {!collapsed && <span>Account</span>}
          </div>
          
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-200 hover:text-white hover:bg-red-600/20 transition-all duration-200 group ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
            {!collapsed && (
              <ChevronRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-primary-700">
          <p className="text-primary-100/70 text-xs text-center">
            © 2025 MTS Dashboard v1.0
          </p>
        </div>
      )}
    </div>
  );
}
