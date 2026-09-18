import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onOpenCreateEvent?: () => void;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onOpenCreateEvent,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {(title || subtitle) && (
          <div className="mb-8 pb-4 border-b border-slate-900">
            {title && <h1 className="text-2xl sm:text-3xl font-black text-white">{title}</h1>}
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <Sidebar onOpenCreateEvent={onOpenCreateEvent} />
          <main className="flex-1 w-full overflow-hidden">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};
