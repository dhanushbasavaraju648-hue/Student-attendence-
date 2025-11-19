import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, UserPlus, ShieldCheck, Shield } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.REGISTER, label: 'Registration', icon: UserPlus },
    { id: AppView.VERIFY, label: 'Live Verification', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shadow-sm flex-shrink-0 z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">SecureID</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Student System</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-500">
            <p className="font-semibold mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online & Ready
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 md:px-8">
          <h2 className="text-lg font-semibold text-slate-800">
            {currentView === AppView.DASHBOARD && 'System Overview'}
            {currentView === AppView.REGISTER && 'Student Data Collection'}
            {currentView === AppView.VERIFY && 'Anti-Spoofing Verification'}
          </h2>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">v1.0.0-Gemini</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
