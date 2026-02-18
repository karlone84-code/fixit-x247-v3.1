
import React from 'react';
import { ThemeMode } from '../../types';
import { THEME } from '../../constants';

interface EnvironmentScreenShellProps {
  children: React.ReactNode;
  themeMode?: ThemeMode;
}

const EnvironmentScreenShell: React.FC<EnvironmentScreenShellProps> = ({ children, themeMode = 'DARK' }) => {
  const currentTheme = THEME[themeMode];

  return (
    <div 
      className="flex flex-col items-center min-h-screen selection:bg-red-500 selection:text-white overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: themeMode === 'DARK' ? '#0f172a' : '#E5E7EB' }}
    >
      {/* Constraints to 576px (max-w-app) */}
      <div 
        className="w-full max-w-[576px] min-h-screen shadow-2xl relative flex flex-col border-x transition-colors duration-500"
        style={{ 
          backgroundColor: currentTheme.bg, 
          color: currentTheme.text,
          borderColor: currentTheme.border
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default EnvironmentScreenShell;
