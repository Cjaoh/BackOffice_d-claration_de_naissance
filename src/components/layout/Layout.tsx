import React, { useCallback, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggle = useCallback(() => setSidebarOpen((v) => !v), []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      
      {/* Effets d’arrière-plan avec pulsations cyan/teal similaires aux autres */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Sidebar isOpen={sidebarOpen} onToggle={handleToggle} />

      <div className="lg:pl-64 relative z-10">
        <Header onMenuToggle={handleToggle} title={title} />

        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(Layout);
