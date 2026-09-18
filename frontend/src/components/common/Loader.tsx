import React from 'react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Cargando contenido...',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div
        className={`${sizeMap[size]} border-brand-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-sm text-slate-400 font-medium">{message}</p>}
    </div>
  );
};
