
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ambulance, 
  PhoneCall, 
  Users, 
  ClipboardList, 
  Map, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navLinks = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Emergency Requests',
      path: '/emergencies',
      icon: <PhoneCall className="h-5 w-5" />,
    },
    {
      label: 'Ambulances',
      path: '/ambulances',
      icon: <Ambulance className="h-5 w-5" />,
    },
    {
      label: 'Patients',
      path: '/patients',
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      label: 'Live Map',
      path: '/map',
      icon: <Map className="h-5 w-5" />,
    },
  ];

  const bottomLinks = [
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
    {
      label: 'Help & Support',
      path: '/help',
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  const renderNavLink = ({ label, path, icon }: { label: string; path: string; icon: React.ReactNode }) => (
    <NavLink
      key={path}
      to={path}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
        ${isActive 
          ? 'bg-purple-50 text-purple-600' 
          : 'text-gray-700 hover:bg-gray-100'}
        transition-all
      `}
    >
      <span className={`text-gray-500`}>{icon}</span>
      {label}
    </NavLink>
  );

  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Emergency Services
        </h2>
      </div>

      <nav className="space-y-1 px-3 flex-1">
        {navLinks.map(renderNavLink)}
      </nav>

      <div className="mt-auto pt-4 space-y-1 px-3 border-t border-gray-100">
        {bottomLinks.map(renderNavLink)}
      </div>
    </div>
  );
};

export default Sidebar;
