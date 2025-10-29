import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function AppLayout({ children, sidebar }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex-shrink-0">
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}