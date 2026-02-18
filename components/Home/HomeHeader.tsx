
import React from 'react';
import { COLORS, ICONS, THEME } from '../../constants';
import { ThemeMode } from '../../types';

interface HomeHeaderProps {
  themeMode?: ThemeMode;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  onToggleTheme?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ 
  themeMode = 'DARK', 
  onOpenMenu, 
  onOpenNotifications, 
  onToggleTheme 
}) => {
  const currentTheme = THEME[themeMode];

  return (
    <header 
      className="sticky top-0 z-50 flex items-center justify-between p-4 backdrop-blur-xl border-b transition-colors duration-500"
      style={{ 
        backgroundColor: currentTheme.glass, // Uses Canonical Red Glass for both modes
        borderColor: currentTheme.border
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-xl border-b-4 border-r-4 border-black" 
          style={{ backgroundColor: COLORS.PRIMARY_RED }}
        >
          <span className="text-white font-black text-2xl tracking-tighter">F</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-black text-xl leading-none" style={{ color: themeMode === 'LIGHT' ? '#000' : '#fff' }}>Fix.it</span>
            <span className="font-black text-sm tracking-[0.2em] leading-none opacity-60" style={{ color: themeMode === 'LIGHT' ? '#000' : '#fff' }}>X247</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold opacity-60" style={{ color: themeMode === 'LIGHT' ? '#000' : '#fff' }}>Bonito Serviço</span>
        </div>
      </div>

      {/* HEADER CONTROLS */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent on red
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#fff'
          }}
        >
          {themeMode === 'DARK' ? <ICONS.Sun /> : <ICONS.Moon />}
        </button>
        <button 
          onClick={onOpenNotifications}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#fff'
          }}
        >
          <ICONS.Bell />
          <span className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse border-2 shadow-[0_0_8px_#FFF]" style={{ borderColor: COLORS.PRIMARY_RED }}></span>
        </button>
        <button 
          onClick={onOpenMenu}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#fff'
          }}
        >
          <ICONS.Menu />
        </button>
      </div>
    </header>
  );
};

export default HomeHeader;
