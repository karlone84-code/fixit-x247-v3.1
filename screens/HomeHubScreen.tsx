
import React, { useEffect } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import AdsCarousel from '../components/Home/AdsCarousel';
import EcosystemGrid from '../components/Home/EcosystemGrid';
import FlashOfferCard from '../components/Home/FlashOfferCard';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { calculateTaxaSOS } from '../utils/sos-calculations';
import { AppTab, ThemeMode } from '../types';
import { THEME } from '../constants';

interface HomeHubScreenProps {
  themeMode: ThemeMode;
  onNavigateToServices?: () => void;
  onNavigateToSos?: () => void;
  onNavigateToJobs?: () => void;
  onNavigateToVerse?: () => void;
  onNavigateToTab: (tab: AppTab) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  onToggleTheme?: () => void;
}

const HomeHubScreen: React.FC<HomeHubScreenProps> = ({ 
  themeMode,
  onNavigateToServices, 
  onNavigateToSos,
  onNavigateToJobs,
  onNavigateToVerse,
  onNavigateToTab,
  onOpenMenu,
  onOpenNotifications,
  onToggleTheme
}) => {
  const currentTheme = THEME[themeMode];

  return (
    <div className="flex flex-col flex-1 h-screen transition-colors duration-500" style={{ backgroundColor: currentTheme.bg }}>
      <HomeHeader themeMode={themeMode} onOpenMenu={onOpenMenu} onOpenNotifications={onOpenNotifications} onToggleTheme={onToggleTheme} />
      <EnvironmentBar />
      
      {/* Primary Vertical Scroll Context */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <AdsCarousel />
        
        <div className="mb-2 px-4">
          <h2 className="text-[13px] font-semibold tracking-[0.06em] uppercase mb-3 italic transition-colors" style={{ color: currentTheme.textSecondary }}>Ecossistema X247</h2>
          <EcosystemGrid 
            onNavigateToServices={onNavigateToServices} 
            onNavigateToSos={onNavigateToSos}
            onNavigateToJobs={onNavigateToJobs}
            onNavigateToVerse={onNavigateToVerse}
          />
        </div>
        
        <FlashOfferCard />

        <div className="px-6 pb-24 opacity-30">
          <p className="text-[10px] uppercase font-bold text-center tracking-widest transition-colors" style={{ color: currentTheme.textSecondary }}>
            Powered by Gemini x247 Pro Logic
          </p>
        </div>
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.HOME} onTabChange={onNavigateToTab} themeMode={themeMode} />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shine { 100% { left: 125%; } }
        .animate-shine { animation: shine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default HomeHubScreen;
