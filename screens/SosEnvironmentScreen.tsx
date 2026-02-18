
import React, { useState, useEffect, useRef } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { SosState, SosCategory, AppTab, ProviderPublicCard, ThemeMode } from '../types';
import { SOS_CATEGORIES, SOS_FUNCTIONS, COLORS } from '../constants';
import { api } from '../services/api';
import { playNotificationSound } from '../utils/sound';

interface SosEnvironmentScreenProps {
  themeMode: ThemeMode;
  onBack: () => void;
  onNavigateToTab: (tab: AppTab) => void;
}

const SosEnvironmentScreen: React.FC<SosEnvironmentScreenProps> = ({ 
  themeMode,
  onBack, 
  onNavigateToTab 
}) => {
  const [state, setState] = useState<SosState>(SosState.CATEGORIA);
  const [selectedCategory, setSelectedCategory] = useState<SosCategory | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  
  // LIVE RADAR DATA
  const [radarStats, setRadarStats] = useState({ pros_online: 0, sos_active: 0, eta_avg: '--' });
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchTimer, setSearchTimer] = useState(60);
  const [isImmediate, setIsImmediate] = useState(true);
  const [selectedPro, setSelectedPro] = useState<ProviderPublicCard | null>(null);
  const [prosFound, setProsFound] = useState<ProviderPublicCard[]>([]);
  const [isLoadingPros, setIsLoadingPros] = useState(false);
  
  const [showProRedScreen, setShowProRedScreen] = useState(false);
  const [proTimer, setProTimer] = useState(180);
  const [showEtaPicker, setShowEtaPicker] = useState(false);

  const radarIntervalRef = useRef<any>(null);

  // 1. WEBSOCKET RADAR SYNC
  useEffect(() => {
    const tenantId = 1; // Mock tenant
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:8000/api/realtime/sos-radar/${tenantId}`;
    
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'RADAR_SYNC') {
        setRadarStats(data.payload);
        if (data.payload.sos_active > radarStats.sos_active) {
            playNotificationSound('sos');
        }
      }
    };

    // 2. SSE EVENT STREAM
    const eventSource = api.subscribeToEvents((data) => {
        setLiveEvents(prev => [data, ...prev].slice(0, 5));
        if (data.type === 'ORDER_UPDATE') playNotificationSound('message');
    });

    return () => {
      ws.close();
      if (eventSource) eventSource.close();
    };
  }, []);

  const startRadar = async () => {
    setState(SosState.PROCURAR);
    setSearchTimer(60);
    setSearchProgress(0);
    setIsLoadingPros(true);

    try {
      const results = await api.getProsByCategory(selectedCategory?.id || '');
      setProsFound(results);
    } catch (err) {
      console.error("Radar falhou.");
    }

    radarIntervalRef.current = setInterval(() => {
      setSearchTimer(t => (t <= 1 ? 0 : t - 1));
      setSearchProgress(p => Math.min(100, p + 2));
    }, 1000);

    setTimeout(() => {
      setIsLoadingPros(false);
      clearInterval(radarIntervalRef.current);
      setState(SosState.SELECIONAR);
      playNotificationSound('sos');
    }, 3000);
  };

  useEffect(() => {
    let timer: any;
    if (showProRedScreen && proTimer > 0) {
      timer = setInterval(() => setProTimer(p => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showProRedScreen, proTimer]);

  const handleProChoice = (pro: ProviderPublicCard) => {
    setSelectedPro(pro);
    setShowProRedScreen(true);
    setProTimer(180);
    playNotificationSound('sos');
  };

  const finalizeSOS = (eta: string) => {
    setShowEtaPicker(false);
    setShowProRedScreen(false);
    playNotificationSound('payment');
    onNavigateToTab(AppTab.PEDIDOS);
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-[#020617] overflow-hidden relative">
      <HomeHeader themeMode={themeMode} />
      <EnvironmentBar />

      {/* RADAR OVERLAY (GLASSMORPHISM) */}
      <div className="bg-red-600/10 border-b border-white/10 px-6 py-3 backdrop-blur-xl flex justify-between items-center z-20">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
            <span className="text-white font-[900] text-[10px] uppercase tracking-widest italic">Radar Live</span>
         </div>
         <div className="flex gap-4">
            <div className="flex flex-col items-end">
               <span className="text-slate-500 text-[7px] font-black uppercase">Pros Online</span>
               <span className="text-white font-black text-xs">{radarStats.pros_online}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-slate-500 text-[7px] font-black uppercase">SOS Ativos</span>
               <span className="text-red-500 font-black text-xs">{radarStats.sos_active}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-slate-500 text-[7px] font-black uppercase">Avg ETA</span>
               <span className="text-[#FACC15] font-black text-xs italic">{radarStats.eta_avg}</span>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-44">
        <div className="mb-8">
          <button 
            onClick={() => {
              if (state === SosState.CATEGORIA) onBack();
              else if (state === SosState.FUNCAO) setState(SosState.CATEGORIA);
              else if (state === SosState.DESCRICAO) setState(SosState.FUNCAO);
              else setState(SosState.DESCRICAO);
            }}
            className="text-[#FACC15] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1"
          >
            ← Voltar
          </button>
        </div>

        {state === SosState.CATEGORIA && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-white font-[900] text-4xl uppercase tracking-tighter italic mb-10 leading-none">Onde é o Problema?</h2>
            <div className="grid grid-cols-1 gap-4">
              {SOS_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat); setState(SosState.FUNCAO); }}
                  className="bg-slate-900 border-4 border-black p-8 rounded-[3rem] flex items-center gap-8 shadow-2xl transition-all active:scale-[0.98] border-b-8 border-r-8 hover:translate-x-1 hover:translate-y-1 hover:border-b-4 hover:border-r-4"
                >
                  <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-4xl shadow-inner">{cat.icon}</div>
                  <div className="text-left">
                    <span className="text-white font-[900] text-2xl uppercase tracking-tighter italic block">{cat.name}</span>
                    <span className="text-red-600 text-[10px] font-black uppercase tracking-widest mt-2 italic block">Mobilização Radar</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {state === SosState.FUNCAO && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <h3 className="text-white font-[900] text-3xl uppercase tracking-tighter italic mb-10 italic">{selectedCategory?.name}</h3>
            <div className="space-y-3">
              {SOS_FUNCTIONS[selectedCategory?.id || '']?.map(func => (
                <button 
                  key={func}
                  onClick={() => { setSelectedFunction(func); setState(SosState.DESCRICAO); }}
                  className="w-full p-6 rounded-[2rem] border-4 bg-slate-900 border-slate-800 text-slate-400 font-black text-[11px] uppercase tracking-widest text-left hover:border-white hover:text-white transition-colors"
                >
                  {func}
                </button>
              ))}
            </div>
          </div>
        )}

        {state === SosState.DESCRICAO && (
          <div className="animate-in slide-in-from-bottom duration-300">
            <h3 className="text-white font-[900] text-3xl uppercase tracking-tighter italic mb-8 italic">Detalhes Finais</h3>
            <div className="space-y-6">
              <textarea 
                placeholder="Descreva a emergência técnica..." 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full h-40 bg-slate-950 border-4 border-black rounded-[2.5rem] p-8 text-white font-bold text-sm outline-none focus:border-red-600 shadow-inner"
              />
              <button
                onClick={startRadar}
                className="w-full py-8 rounded-[2.5rem] border-b-[12px] border-r-[12px] border-black font-black text-2xl uppercase tracking-widest bg-red-600 text-white shadow-2xl active:translate-y-1 active:border-b-4"
              >
                ATIVAR RADAR SOS
              </button>
            </div>
          </div>
        )}

        {state === SosState.PROCURAR && (
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in">
             <div className="relative w-72 h-72 mb-12">
                <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping"></div>
                <div className="absolute inset-4 bg-red-600/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-32 h-32 bg-red-600 rounded-full border-8 border-black flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(255,31,51,0.5)] animate-bounce">⚡</div>
                </div>
             </div>
             <h3 className="text-white font-[900] text-3xl uppercase tracking-tighter italic mb-4">Protocolo Radar Ativo</h3>
             <div className="mt-4 w-64 h-3 bg-slate-950 rounded-full overflow-hidden border-2 border-black">
                <div className="h-full bg-red-600 transition-all duration-1000 shadow-[0_0_15px_#FF1F33]" style={{ width: `${searchProgress}%` }} />
             </div>
             <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-6 italic">Kernel Sync: {searchTimer}s</span>
          </div>
        )}

        {state === SosState.SELECIONAR && (
          <div className="animate-in slide-in-from-bottom duration-500 space-y-8">
             <div className="flex justify-between items-center">
                <h3 className="text-white font-[900] text-3xl uppercase tracking-tighter italic leading-none">Resultados Radar</h3>
                <div className="flex bg-slate-900 p-2 rounded-full border-4 border-black gap-1">
                   <button onClick={() => setIsImmediate(true)} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isImmediate ? 'bg-red-600 text-white' : 'text-slate-600'}`}>Imediato</button>
                   <button onClick={() => setIsImmediate(false)} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${!isImmediate ? 'bg-slate-700 text-white' : 'text-slate-600'}`}>24 Horas</button>
                </div>
             </div>

             {prosFound.map(pro => (
                <div key={pro.id} className="bg-slate-900 border-4 border-black rounded-[4rem] p-8 text-left shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:border-white transition-all">
                   <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-4xl border-4 border-black overflow-hidden shadow-lg">👤</div>
                      <div className="flex-1">
                         <h4 className="text-white font-[900] text-2xl uppercase tracking-tighter italic mb-1">{pro.displayName}</h4>
                         <div className="flex items-center gap-3">
                            <span className="text-[#FACC15] font-black text-xs">★ {pro.averageRating}</span>
                            <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">· {pro.distanceKm} KM</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-black/60 rounded-[3rem] p-6 border-4 border-black space-y-3 mb-8 shadow-inner">
                      <div className="flex justify-between items-end">
                         <span className="text-slate-500 font-black text-[11px] uppercase tracking-widest italic">Total Orçamentado</span>
                         <span className="text-[#FACC15] font-[900] text-5xl italic leading-none">{(pro.indicativePrice + (isImmediate ? 20 : 0)).toFixed(2)}€</span>
                      </div>
                   </div>

                   <button onClick={() => handleProChoice(pro)} className="w-full py-6 bg-red-600 text-white rounded-[2.5rem] font-black text-lg uppercase tracking-[0.25em] border-b-8 border-r-8 border-black active:translate-y-1 active:border-b-4 shadow-xl">REQUISITAR AGORA</button>
                </div>
             ))}
          </div>
        )}
      </div>

      {showProRedScreen && (
        <div className="fixed inset-0 z-[600] bg-red-600 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
           <div className="relative z-10 w-full max-w-sm">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl border-8 border-black animate-bounce">
                <span className="text-5xl">🚨</span>
              </div>
              <h2 className="text-white font-[900] text-5xl uppercase tracking-tighter italic mb-12 italic leading-none">NOVO SOS HQ!</h2>
              <div className="bg-black/20 p-10 rounded-[4rem] mb-12 border-4 border-white/20 shadow-2xl">
                 <p className="text-white font-black text-3xl uppercase italic leading-none">{selectedPro?.displayName}</p>
                 <div className="w-full h-6 bg-black/40 rounded-full overflow-hidden border-4 border-white/20 mt-10 shadow-inner">
                   <div className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_#FFF]" style={{ width: `${(proTimer / 180) * 100}%` }}></div>
                 </div>
                 <p className="text-white/60 font-black text-[10px] uppercase tracking-widest mt-6">Protocolo de Aceitação Ativo</p>
              </div>
              <button onClick={() => setShowEtaPicker(true)} className="w-full py-10 bg-white text-red-600 rounded-[4rem] font-black text-3xl uppercase tracking-[0.2em] border-b-[12px] border-r-[12px] border-black active:translate-y-1 shadow-2xl">ACEITAR SOS</button>
           </div>
           {/* Background Pulse Effect */}
           <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
        </div>
      )}

      {showEtaPicker && (
         <div className="fixed inset-0 z-[700] bg-[#020617]/98 flex flex-col items-center justify-center p-8 animate-in zoom-in duration-300 backdrop-blur-3xl">
            <div className="bg-slate-900 border-8 border-black p-12 rounded-[5rem] w-full max-w-sm shadow-[0_0_100px_rgba(255,31,51,0.3)]">
               <h3 className="text-white font-[900] text-4xl uppercase tracking-tighter italic mb-12 italic text-center leading-none">Tempo de Chegada</h3>
               <div className="grid grid-cols-2 gap-5">
                  {['15 min', '30 min', '45 min', '1 hora'].map(eta => (
                    <button key={eta} onClick={() => finalizeSOS(eta)} className="bg-slate-950 border-4 border-black p-6 rounded-[2.5rem] text-white font-black text-[11px] uppercase tracking-widest hover:border-red-600 transition-all shadow-xl active:scale-95">
                        {eta}
                    </button>
                  ))}
               </div>
            </div>
         </div>
      )}

      <AssistantMascot />
      <BottomDock activeTab={AppTab.HOME} onTabChange={onNavigateToTab} themeMode={themeMode} />
    </div>
  );
};

export default SosEnvironmentScreen;
