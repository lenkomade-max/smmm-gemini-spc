
import React from 'react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'upload', icon: 'fa-upload', label: 'Upload Chapters' },
    { id: 'queue', icon: 'fa-tasks', label: 'Processing Queue' },
    { id: 'preview', icon: 'fa-eye', label: 'Review Lessons' },
    { id: 'settings', icon: 'fa-cog', label: 'Prompt Engine' },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-indigo-800">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <i className="fas fa-book-open text-xl"></i>
        </div>
        <span className="font-bold text-lg tracking-tight">SMM Factory</span>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${
              activeTab === item.id 
              ? 'bg-indigo-800 border-l-4 border-white' 
              : 'hover:bg-indigo-800/50 text-indigo-300 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 bg-indigo-950/50">
        <div className="flex items-center gap-3 text-sm text-indigo-300">
          <i className="fas fa-user-circle text-lg"></i>
          <span>Elite Educator Mode</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
