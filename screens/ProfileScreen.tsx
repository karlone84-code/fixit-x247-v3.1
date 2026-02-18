
import React, { useState, useMemo, useEffect } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { AppTab, ProOperationalSettings, ProCategoryPricing, UserMetrics, WalletState, ProfileSubTab, ThemeMode, AppView } from '../types';
import { TAXONOMY_AREAS, TAXONOMY_CATEGORIES, SUPPORT_CONTACTS, THEME } from '../constants';

interface ProfileScreenProps {
  userRole: 'CLIENT' | 'PRO';
  themeMode: ThemeMode;
  onBack: () => void;
  onNavigateToTab: (tab: AppTab) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  initialTab?: ProfileSubTab;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  userRole, 
  themeMode,
  onBack, 
  onNavigateToTab, 
  onOpenMenu, 
  onOpenNotifications,
  initialTab 
}) => {
  const [activeTab, setActiveTab] = useState<ProfileSubTab>(initialTab || (userRole === 'PRO' ? 'PRO' : 'ID'));
  const [isOnline, setIsOnline] = useState(true);
  const currentTheme = THEME[themeMode];

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const metrics: UserMetrics = {
    rating: 4.9,
    completedTotal: 142,
    sosCount: 28,
    servicesCount: 94,
    bonitoCount: 20,
    jobsCount: 0,
    xpPoints: userRole === 'PRO' ? 12450 : 3450,
    level: userRole === 'PRO' ? 'Elite x247' : 'Fix Fan'
  };

  const wallet: WalletState = {
    available: 1425.80,
    escrow: 340.50,
    dispute: 0,
    transactions: [
      { id: 't1', type: 'IN', value: 85.00, date: 'Hoje', label: 'SOS #123' },
      { id: 't2', type: 'ESCROW', value: 120.00, date: 'Hoje', label: 'Serviço #456' },
      { id: 't3', type: 'OUT', value: 500.00, date: 'Ontem', label: 'Levantamento' }
    ]
  };

  const profileTabs = [
    { id: 'PRO', label: 'Operação Pro', proOnly: true },
    { id: 'ID', label: 'Identidade' },
    { id: 'BANCO', label: 'Fix Bank' },
    { id: 'ATIVIDADE', label: 'Atividade' },
    { id: 'SO', label: 'Sistema' }
  ].filter(t => !t.proOnly || userRole === 'PRO');

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden selection:bg-[#FACC15] selection:text-black" style={{ backgroundColor: currentTheme.bg }}>
      <HomeHeader onOpenMenu={onOpenMenu} onOpenNotifications={onOpenNotifications} themeMode={themeMode} />
      <EnvironmentBar />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        
        {/* CABEÇALHO COCKPIT */}
        <div className="px-6 pt-10 mb-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-[3.5rem] bg-slate-900 border-[8px] border-black shadow-2xl flex items-center justify-center relative group overflow-hidden">
               <span className="text-6xl group-hover:scale-110 transition-transform">👤</span>
               <div className="absolute inset-0 bg-gradient-to-tr from-[#FACC15]/10 to-transparent" />
            </div>
            {userRole === 'PRO' && (
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`absolute -bottom-2 -right-2 px-4 py-2 rounded-full border-4 border-[#020617] shadow-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all ${isOnline ? 'bg-[#22C55E] text-black' : 'bg-slate-700 text-white'}`}
              >
                {isOnline ? 'ONLINE 24/7' : 'OFFLINE'}
              </button>
            )}
          </div>
          
          <h2 className="font-[900] text-4xl uppercase tracking-tighter italic leading-none" style={{ color: currentTheme.text }}>João Silva</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
             <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black text-[#FACC15] uppercase tracking-widest italic">{metrics.level}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 w-full mt-8 px-2">
             <div className="bg-slate-900 border-2 border-slate-800 p-4 rounded-[1.5rem] text-center">
                <span className="text-[#FACC15] font-black text-lg italic block leading-none">{metrics.rating}</span>
                <span className="text-slate-600 text-[7px] font-black uppercase mt-1 block italic">Rating</span>
             </div>
             <div className="bg-slate-900 border-2 border-slate-800 p-4 rounded-[1.5rem] text-center">
                <span className="text-red-500 font-black text-lg italic block leading-none">{metrics.sosCount}</span>
                <span className="text-slate-600 text-[7px] font-black uppercase mt-1 block italic">SOS</span>
             </div>
             <div className="bg-slate-900 border-2 border-slate-800 p-4 rounded-[1.5rem] text-center">
                <span className="text-green-500 font-black text-lg italic block leading-none">{metrics.bonitoCount}</span>
                <span className="text-slate-600 text-[7px] font-black uppercase mt-1 block italic">Bonito</span>
             </div>
             <div className="bg-slate-900 border-2 border-slate-800 p-4 rounded-[1.5rem] text-center">
                <span className="text-blue-500 font-black text-lg italic block leading-none">{metrics.completedTotal}</span>
                <span className="text-slate-600 text-[7px] font-black uppercase mt-1 block italic">Total</span>
             </div>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="sticky top-0 z-30 backdrop-blur-xl border-y border-white/5 py-4 px-6 mb-10 flex gap-3 overflow-x-auto no-scrollbar" style={{ backgroundColor: themeMode === 'DARK' ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
           {profileTabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as ProfileSubTab)}
               className={`px-6 py-3 rounded-full border-2 transition-all shrink-0 active:scale-95 flex items-center gap-2 ${
                 activeTab === tab.id ? 'bg-[#FACC15] border-black text-black shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-500'
               }`}
             >
               <span className="text-[9px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
             </button>
           ))}
        </div>

        <div className="px-6 space-y-12 pb-20">
          
          {/* BANCO (CARTEIRA / ESCROW) */}
          {activeTab === 'BANCO' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="bg-slate-900 border-4 border-black p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col mb-10">
                     <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-4 block italic leading-none opacity-60">Saldos Fix Bank</span>
                     <div className="flex items-baseline gap-4">
                        <h2 className="text-white font-black text-6xl tracking-tighter italic leading-none">{wallet.available.toFixed(2)}€</h2>
                        <span className="text-[#22C55E] text-[10px] font-black uppercase tracking-widest italic animate-pulse">Disponível</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
                        <span className="text-slate-600 text-[8px] font-black uppercase block mb-1 italic">Em Escrow</span>
                        <span className="text-white font-black text-xl italic leading-none">{wallet.escrow.toFixed(2)}€</span>
                        <div className="absolute top-0 right-0 w-1 h-full bg-blue-600/30"></div>
                     </div>
                     <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden">
                        <span className="text-slate-600 text-[8px] font-black uppercase block mb-1 italic">Em Disputa</span>
                        <span className="text-red-500 font-black text-xl italic leading-none">{wallet.dispute.toFixed(2)}€</span>
                        {wallet.dispute > 0 && <div className="absolute top-0 right-0 w-1 h-full bg-red-600 animate-pulse"></div>}
                     </div>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <h4 className="font-black text-xl uppercase tracking-tighter italic leading-none italic px-2" style={{ color: currentTheme.text }}>Transações Fix Bank</h4>
                  <div className="space-y-3">
                     {wallet.transactions.map(t => (
                       <div key={t.id} className="bg-slate-900 border-2 border-slate-800 p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl group hover:border-white transition-all">
                          <div>
                             <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest block mb-1 italic opacity-60">{t.date} · {t.label}</span>
                             <span className={`text-[10px] font-black uppercase tracking-widest ${t.type === 'ESCROW' ? 'text-blue-500' : 'text-white'}`}>{t.type}</span>
                          </div>
                          <span className={`font-black text-lg italic ${t.type === 'OUT' ? 'text-red-500' : 'text-white'}`}>
                             {t.type === 'OUT' ? '-' : '+'}{t.value.toFixed(2)}€
                          </span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* SISTEMA / AJUDA & SUPORTE (SO) */}
          {activeTab === 'SO' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="bg-slate-900 border-4 border-black p-10 rounded-[4rem] shadow-2xl">
                  <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic mb-8 italic">Ajuda & Suporte</h3>
                  <div className="space-y-4">
                     <a 
                      href={`mailto:${SUPPORT_CONTACTS.EMAIL}`} 
                      className="flex items-center justify-between p-6 bg-slate-950 rounded-3xl border border-white/5 hover:border-white transition-all group"
                     >
                        <div className="flex items-center gap-5">
                           <span className="text-2xl">📧</span>
                           <div className="flex flex-col">
                              <span className="text-white font-black text-xs uppercase tracking-widest italic">Email Oficial</span>
                              <span className="text-slate-500 text-[10px] font-bold lowercase">{SUPPORT_CONTACTS.EMAIL}</span>
                           </div>
                        </div>
                        <span className="text-white/20 group-hover:text-white transition-colors text-xl">→</span>
                     </a>
                     
                     <a 
                      href={SUPPORT_CONTACTS.WHATSAPP_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between p-6 bg-slate-950 rounded-3xl border border-white/5 hover:border-white transition-all group"
                     >
                        <div className="flex items-center gap-5">
                           <span className="text-2xl">💬</span>
                           <div className="flex flex-col">
                              <span className="text-white font-black text-xs uppercase tracking-widest italic">WhatsApp x247</span>
                              <span className="text-slate-500 text-[10px] font-bold">{SUPPORT_CONTACTS.WHATSAPP}</span>
                           </div>
                        </div>
                        <span className="text-white/20 group-hover:text-white transition-colors text-xl">→</span>
                     </a>

                     <button 
                      onClick={() => onOpenMenu ? (window as any).dispatchEvent(new CustomEvent('NAV_LEGAL')) : null}
                      className="w-full flex items-center justify-between p-6 bg-slate-950 rounded-3xl border border-white/5 hover:border-white transition-all group"
                     >
                        <div className="flex items-center gap-5">
                           <span className="text-2xl">⚖️</span>
                           <div className="flex flex-col text-left">
                              <span className="text-white font-black text-xs uppercase tracking-widest italic">Legal & Compliance</span>
                              <span className="text-slate-500 text-[10px] font-bold">Termos, Privacidade & RGPD</span>
                           </div>
                        </div>
                        <span className="text-white/20 group-hover:text-white transition-colors text-xl">→</span>
                     </button>

                     <div className="p-8 bg-[#FACC15]/5 rounded-[2.5rem] border-2 border-[#FACC15]/20 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-4">
                           <span className="text-2xl">💶</span>
                           <span className="text-[#FACC15] font-black text-xs uppercase tracking-widest italic">Pagamentos MB WAY</span>
                        </div>
                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed uppercase tracking-wider italic">
                           Para pagamentos diretos ou carregamentos Fix Bank via MB WAY, utilize o número oficial: <span className="text-white font-black">{SUPPORT_CONTACTS.MBWAY}</span> (Bonito Serviço).
                        </p>
                        <div className="absolute top-0 right-0 w-1 h-full bg-[#FACC15]/30"></div>
                     </div>
                  </div>
               </div>

               <div className="p-8 text-center opacity-30">
                  <span className="font-black text-[10px] uppercase tracking-widest italic" style={{ color: currentTheme.text }}>Fix.it OS v3.1.0 · Almada HQ</span>
                  <div className="mt-2 text-[8px] font-black uppercase text-slate-800 tracking-[0.4em] italic">Stealth Protocol Active</div>
               </div>
            </div>
          )}

          {activeTab !== 'BANCO' && activeTab !== 'SO' && (
            <div className="py-20 text-center bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-800">
               <span className="text-slate-600 font-black text-[10px] uppercase tracking-widest italic opacity-50">Visualização de Perfil v3.1 ativa</span>
            </div>
          )}

        </div>
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.PERFIL} onTabChange={onNavigateToTab} themeMode={themeMode} />
    </div>
  );
};

export default ProfileScreen;
