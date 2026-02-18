
import React, { useState, useEffect } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { 
  AppTab, AdminStats, KillswitchFlags, DisputeAdminData, 
  UserRole, AdminAccount, AuditLog, AdCard, FeedContentCard,
  SentinelMetrics, FinanceOverview, AdminSubTab, ThemeMode
} from '../types';
import { MOCK_SYSTEM_LOGS } from '../constants';

interface AdminDashboardScreenProps {
  userRole: UserRole;
  themeMode: ThemeMode;
  onNavigateToTab: (tab: AppTab) => void;
  onOpenMenu?: () => void;
  initialTab?: AdminSubTab;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ userRole, themeMode, onNavigateToTab, onOpenMenu, initialTab }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminSubTab>(initialTab || 'PERFORMANCE');
  const [superEnvironment, setSuperEnvironment] = useState<'APP' | 'ADMIN' | 'OFFICE' | 'SENTINEL' | 'BI' | 'FINANCE' | 'FEED_VERSE'>('APP');
  
  const [admins, setAdmins] = useState<AdminAccount[]>(() => JSON.parse(localStorage.getItem('X247_ADMIN_ACCOUNTS') || '[]'));
  
  const [sentinelMetrics, setSentinelMetrics] = useState<SentinelMetrics>({
    apiLatency: 42,
    paymentSuccessRate: 99.1,
    activeSockets: 156,
    sosAvgResponseTime: 28,
    cpuUsage: 18,
    memoryUsage: 35
  });

  useEffect(() => {
    if (initialTab) setActiveAdminTab(initialTab);
  }, [initialTab]);

  const stats: AdminStats = {
    activeSos: 12,
    pendingPros: 5,
    totalAppRevenue: 45680.00,
    dailyActiveUsers: 1240,
    systemHealth: 98,
    cac: 12.40,
    ltv: 450,
    churnRate: 2.1
  };

  const financeData: FinanceOverview = {
    totalInEscrow: 18450.00,
    totalInDispute: 850.00,
    netAppRevenue: 4120.50,
    totalPayoutsPending: 12300.00,
    pspCosts: 540.20
  };

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [flags, setFlags] = useState<KillswitchFlags>({
    sosEnabled: true, bonitoEnabled: true, feedEnabled: true,
    paymentGatewayEnabled: true, proCatalogEnabled: true,
    jobsEnabled: true, verseEnabled: true, adsEnabled: true
  });

  const addAudit = (module: string, action: string, before: string, after: string) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      adminId: 'hq-root',
      adminName: userRole === 'SUPER_ADMIN' ? 'Founder Super' : 'Admin Operador',
      module, action, before, after,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const toggleFlag = (key: keyof KillswitchFlags) => {
    if (userRole !== 'SUPER_ADMIN') return;
    const oldVal = flags[key];
    const newVal = !oldVal;
    setFlags(prev => ({ ...prev, [key]: newVal }));
    addAudit('KILLSWITCH', `TOGGLE_${key.toUpperCase()}`, oldVal.toString(), newVal.toString());
  };

  const navTabs = [
    { id: 'PERFORMANCE', label: 'Performance', icon: '📊' },
    { id: 'DISPUTES', label: 'Disputas', icon: '⚖️' },
    { id: 'SYSTEM', label: 'Sentinel', icon: '🛡️' }
  ];

  if (userRole === 'SUPER_ADMIN') {
    navTabs.push({ id: 'KILLSWITCH', label: 'Killswitch', icon: '🛑' });
    navTabs.push({ id: 'SUPER', label: 'Painel Mãe', icon: '👑' });
  }

  return (
    <div className="flex flex-col flex-1 h-screen bg-[#020617] overflow-hidden selection:bg-[#FF1F33] selection:text-white">
      <HomeHeader onOpenMenu={onOpenMenu} themeMode={themeMode} />
      <EnvironmentBar />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="px-6 pt-10 mb-8 flex justify-between items-end">
           <div>
              <h2 className="text-white font-[900] text-4xl uppercase tracking-[0.05em] italic leading-none mb-2 italic">Admin OS v3.1</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-60">
                {userRole === 'SUPER_ADMIN' ? 'FOUNDER HQ ACCESS' : 'OPERATIONAL PORTAL'}
              </p>
           </div>
           {userRole === 'SUPER_ADMIN' && (
             <div className="bg-red-600 px-3 py-1.5 rounded-xl border-b-4 border-r-4 border-black shadow-[0_0_30px_rgba(255,31,51,0.5)] flex items-center gap-2 animate-pulse">
                <span className="text-white font-black text-[9px] uppercase tracking-widest italic leading-none">STEALTH ACTIVE</span>
             </div>
           )}
        </div>

        <div className="sticky top-0 z-30 bg-slate-900/60 backdrop-blur-2xl border-y border-white/5 py-4 px-6 mb-10 flex gap-3 overflow-x-auto no-scrollbar">
           {navTabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveAdminTab(tab.id as AdminSubTab)}
               className={`px-6 py-3 rounded-full border-2 transition-all shrink-0 active:scale-95 flex items-center gap-3 ${
                 activeAdminTab === tab.id 
                   ? 'bg-[#FF1F33] border-black text-white shadow-[0_10px_20px_rgba(255,31,51,0.3)] scale-105' 
                   : 'bg-slate-900/40 border-slate-800 text-slate-500'
               }`}
             >
               <span className="text-xl">{tab.icon}</span>
               <span className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</span>
             </button>
           ))}
        </div>

        <div className="px-6 space-y-12 animate-in fade-in duration-500">
           
           {/* SUPER ADMIN PAINEL MÃE (GOVERNANCE COCKPIT) */}
           {activeAdminTab === 'SUPER' && userRole === 'SUPER_ADMIN' && (
             <div className="space-y-12">
                <div className="grid grid-cols-4 gap-3">
                   {[
                     { id: 'APP', label: 'App', icon: '📱' },
                     { id: 'ADMIN', label: 'Portas Admin', icon: '👥' },
                     { id: 'SENTINEL', label: 'Sentinel', icon: '🛡️' },
                     { id: 'FINANCE', label: 'Finanças', icon: '💶' },
                     { id: 'FEED_VERSE', label: 'Conteúdo', icon: '📢' }
                   ].map(env => (
                     <button
                       key={env.id}
                       onClick={() => setSuperEnvironment(env.id as any)}
                       className={`p-4 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 ${
                         superEnvironment === env.id 
                            ? 'bg-white border-black text-black scale-105 shadow-xl' 
                            : 'bg-slate-900/50 border-slate-800 text-slate-500'
                       }`}
                     >
                        <span className="text-2xl">{env.icon}</span>
                        <span className="text-[8px] font-black uppercase text-center leading-none">{env.label}</span>
                     </button>
                   ))}
                </div>

                <div className="animate-in slide-in-from-bottom duration-500">
                   {superEnvironment === 'FINANCE' && (
                     <div className="bg-slate-900 border-4 border-black p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
                        <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-4 block italic">Fix Bank Global Liquidity</span>
                        <h2 className="text-white font-black text-6xl tracking-tighter italic leading-none">{financeData.totalInEscrow.toLocaleString()}€</h2>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                           <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5">
                              <span className="text-slate-600 text-[8px] font-black uppercase block mb-1">Net App Revenue</span>
                              <span className="text-[#22C55E] font-black text-xl italic">{financeData.netAppRevenue.toFixed(2)}€</span>
                           </div>
                           <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5">
                              <span className="text-slate-600 text-[8px] font-black uppercase block mb-1">Total Payouts</span>
                              <span className="text-white font-black text-xl italic">{financeData.totalPayoutsPending.toFixed(2)}€</span>
                           </div>
                        </div>
                     </div>
                   )}

                   {superEnvironment === 'ADMIN' && (
                     <div className="bg-slate-900 border-4 border-black p-10 rounded-[4rem] shadow-2xl">
                        <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic mb-8 italic">Gestão de Portas Admin</h3>
                        <div className="space-y-4">
                           {admins.map(admin => (
                             <div key={admin.id} className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
                                <div className="flex flex-col">
                                   <span className="text-white font-black text-sm uppercase italic">{admin.name}</span>
                                   <span className="text-slate-500 text-[8px] font-black uppercase mt-1 opacity-60">Porta: .../portal/{admin.secretSlug}</span>
                                </div>
                                <button className="text-red-600 font-black text-[9px] uppercase tracking-widest border border-red-600/20 px-3 py-1 rounded-full">Revogar</button>
                             </div>
                           ))}
                           <button className="w-full py-4 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-widest border-b-4 border-r-4 border-black">+ Criar Nova Porta 1-a-1</button>
                        </div>
                     </div>
                   )}
                </div>
             </div>
           )}

           {/* KILLSWITCH */}
           {activeAdminTab === 'KILLSWITCH' && userRole === 'SUPER_ADMIN' && (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-20">
                <div className="bg-red-600/10 border-4 border-red-600/30 p-8 rounded-[3rem] mb-6">
                  <p className="text-red-500 font-black text-xs uppercase tracking-widest text-center italic leading-relaxed">
                    Painel de Emergência: Desativar módulos dispara alertas imediatos no Sentinel.
                  </p>
                </div>
                {Object.entries(flags).map(([key, val]) => (
                  <div key={key} className="bg-slate-900 border-4 border-black p-8 rounded-[3.5rem] flex items-center justify-between shadow-xl group hover:border-white transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-3 h-3 rounded-full ${val ? 'bg-[#22C55E] shadow-[0_0_10px_#22C55E]' : 'bg-red-600 shadow-[0_0_10px_#FF1F33]'} animate-pulse`}></div>
                        <span className="text-white font-black text-sm uppercase tracking-widest italic">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                      <button 
                        onClick={() => toggleFlag(key as any)}
                        className={`w-16 h-10 rounded-full p-1.5 border-4 border-black transition-all ${val ? 'bg-[#22C55E]' : 'bg-red-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-all ${val ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                  </div>
                ))}
              </div>
           )}

           {/* PERFORMANCE */}
           {activeAdminTab === 'PERFORMANCE' && (
             <div className="space-y-8 pb-20 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-5">
                   <div className="bg-slate-900 border-4 border-black p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                      <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 block italic opacity-60">CAC Médio</span>
                      <span className="text-white font-black text-5xl italic tracking-tighter leading-none">12.40€</span>
                      <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
                   </div>
                   <div className="bg-slate-900 border-4 border-black p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                      <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 block italic opacity-60">LTV Global</span>
                      <span className="text-white font-black text-5xl italic tracking-tighter leading-none">450€</span>
                      <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                   </div>
                </div>
                <div className="bg-[#020617] border-8 border-black p-12 rounded-[4.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                   <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 block italic opacity-40">Revenue Global (Live)</span>
                   <h2 className="text-white font-black text-7xl tracking-tighter italic leading-none">{stats.totalAppRevenue.toLocaleString()}€</h2>
                </div>
             </div>
           )}

           {/* SENTINEL */}
           {activeAdminTab === 'SYSTEM' && (
             <div className="space-y-10 animate-in fade-in duration-500 pb-20">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900 border-4 border-black p-8 rounded-[3rem] text-center shadow-xl">
                      <span className="text-slate-500 text-[9px] font-black uppercase block mb-2 italic">API Latency</span>
                      <span className="text-white font-black text-3xl italic">{sentinelMetrics.apiLatency}ms</span>
                   </div>
                   <div className="bg-slate-900 border-4 border-black p-8 rounded-[3rem] text-center shadow-xl">
                      <span className="text-slate-500 text-[9px] font-black uppercase block mb-2 italic">Success Rate</span>
                      <span className="text-[#22C55E] font-black text-3xl italic">{sentinelMetrics.paymentSuccessRate}%</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <h4 className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] px-2 italic">Audit & Config Trail</h4>
                   <div className="bg-slate-950 border-4 border-black p-8 rounded-[3.5rem] shadow-2xl max-h-96 overflow-y-auto no-scrollbar space-y-4">
                      {auditLogs.map(log => (
                        <div key={log.id} className="text-[9px] font-bold border-b border-white/5 pb-4 last:border-0 flex flex-col gap-1">
                           <div className="flex justify-between">
                              <span className="text-white font-black uppercase">{log.module} / {log.action}</span>
                              <span className="text-slate-600 italic">{log.timestamp.split('T')[1].substring(0,8)}</span>
                           </div>
                           <span className="text-slate-500 italic">"{log.before}" → <span className="text-[#FACC15] font-black">{log.after}</span></span>
                           <span className="text-[7px] text-slate-800 uppercase tracking-widest">Actor: {log.adminName}</span>
                        </div>
                      ))}
                      {auditLogs.length === 0 && <p className="text-slate-800 text-[10px] font-black italic text-center py-10 uppercase tracking-widest opacity-40">A aguardar telemetria canónica...</p>}
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.ADMIN} onTabChange={onNavigateToTab} themeMode={themeMode} />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboardScreen;
