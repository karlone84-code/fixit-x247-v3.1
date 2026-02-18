
import React from 'react';
import { AppTab, ThemeMode } from '../../types';
import { THEME } from '../../constants';

interface BottomDockProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isAdmin?: boolean;
  themeMode?: ThemeMode;
}

const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onTabChange, isAdmin, themeMode = 'DARK' }) => {
  const currentTheme = THEME[themeMode];
  const tabs = [
    { id: AppTab.HOME, label: 'Home' },
    { id: AppTab.FEED, label: 'Feed' },
    { id: AppTab.PEDIDOS, label: 'Pedidos' },
    { id: AppTab.PERFIL, label: 'Perfil' }
  ];

  if (activeTab === AppTab.ADMIN) {
     tabs.push({ id: AppTab.ADMIN, label: 'Admin' });
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] z-[100]">
      <nav 
        className="flex items-center justify-around h-16 backdrop-blur-2xl rounded-full border shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden px-4 transition-all duration-500"
        style={{ 
          backgroundColor: currentTheme.dock, 
          borderColor: currentTheme.border 
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300 relative"
            >
              <div className={`flex flex-col items-center ${isActive ? 'scale-110' : 'opacity-40 grayscale'}`}>
                <span 
                  className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300`}
                  style={{ color: isActive ? currentTheme.accent : currentTheme.textSecondary }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div 
                    className="mt-1 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" 
                    style={{ backgroundColor: currentTheme.accent, color: currentTheme.accent }}
                  ></div>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomDock;
