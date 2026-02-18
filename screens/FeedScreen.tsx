
import React, { useState } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { AppTab, FeedPost, LeaderboardEntry, FixEvent, ChatMessage, ThemeMode } from '../types';
import { MOCK_FEED, GAMIFICATION_RULES, MOCK_LEADERBOARD, MOCK_EVENTS, COLORS, THEME } from '../constants';

type FeedModule = 'MURAL' | 'PONTOS' | 'COMUNIDADE';

interface FeedScreenProps {
  themeMode: ThemeMode;
  onBack: () => void;
  onNavigateToTab: (tab: AppTab) => void;
}

const FeedScreen: React.FC<FeedScreenProps> = ({ themeMode, onBack, onNavigateToTab }) => {
  const [activeModule, setActiveModule] = useState<FeedModule>('MURAL');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Vítor S.', text: 'Malta, já viram o novo workshop de domótica?', timestamp: '10:30' },
    { id: '2', user: 'Ana P.', text: 'Sim! Vou partilhar no Insta para ganhar os pontos extra.', timestamp: '10:35' },
    { id: '3', user: 'Flix', text: 'Bonito Serviço! Não se esqueçam de usar a hashtag oficial.', timestamp: '10:40' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const currentTheme = THEME[themeMode];

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: 'Eu',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
  };

  const handleOpenExternal = (url: string) => {
    console.log(`Abrindo link social: ${url}`);
    // No ambiente real, usaria window.open ou Linking.openURL
    alert(`Encaminhando para a plataforma externa: ${url}`);
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden selection:bg-[#FACC15] selection:text-black" style={{ backgroundColor: currentTheme.bg }}>
      <HomeHeader themeMode={themeMode} />
      <EnvironmentBar />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-44">
        {/* Module Header */}
        <div className="px-6 pt-10 mb-8">
           <h2 className="font-[900] text-4xl uppercase tracking-tighter italic leading-none mb-1" style={{ color: currentTheme.text }}>Mural Social</h2>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-60">Comunidade & Gamificação x247</p>
        </div>

        {/* Triple Tab Navigator - Glassmorphism */}
        <div className="sticky top-0 z-30 backdrop-blur-xl border-y py-4 px-6 mb-10 flex gap-2" style={{ backgroundColor: themeMode === 'DARK' ? 'rgba(2, 6, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderColor: currentTheme.border }}>
           {(['MURAL', 'PONTOS', 'COMUNIDADE'] as const).map(mod => (
             <button
               key={mod}
               onClick={() => setActiveModule(mod)}
               className={`flex-1 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 ${
                 activeModule === mod 
                  ? 'bg-white border-black text-slate-950 shadow-2xl scale-105' 
                  : 'bg-slate-900/50 border-slate-800 text-slate-500'
               }`}
               style={{ 
                 backgroundColor: activeModule === mod ? '#FFFFFF' : currentTheme.surface, 
                 borderColor: activeModule === mod ? '#000000' : currentTheme.border,
                 color: activeModule === mod ? '#000000' : currentTheme.textSecondary
               }}
             >
               {mod === 'MURAL' ? 'Mural' : mod === 'PONTOS' ? 'Ranking' : 'Eventos'}
             </button>
           ))}
        </div>

        <div className="px-6 space-y-12">
          
          {/* 1. AMBIENTE MURAL SOCIAL (UGC) */}
          {activeModule === 'MURAL' && (
            <div className="animate-in fade-in slide-in-from-right duration-500 space-y-8">
               <div className="border p-6 rounded-[2rem] backdrop-blur-md" style={{ borderColor: currentTheme.border, backgroundColor: currentTheme.surface }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] italic text-center leading-relaxed" style={{ color: currentTheme.textSecondary }}>
                    Partilhas que contam para o teu ranking <span style={{ color: currentTheme.text }}>Fix.it x247</span>
                  </p>
               </div>

               <div className="space-y-10">
                  {MOCK_FEED.map(post => (
                    <button 
                      key={post.id} 
                      onClick={() => handleOpenExternal('https://instagram.com/fixitx247')}
                      className="w-full border-4 border-black rounded-[3.5rem] overflow-hidden shadow-2xl transition-all hover:border-white group text-left"
                      style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                    >
                       <div className="aspect-[4/3] relative overflow-hidden">
                          <img src={post.thumbnail} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" />
                          <div className="absolute top-6 left-6 flex items-center gap-2">
                             <div className="bg-black/80 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20">
                                <span className="text-white font-black text-[9px] uppercase tracking-widest">{post.platform}</span>
                             </div>
                          </div>
                          <div className="absolute bottom-6 right-6 bg-[#FACC15] text-slate-900 px-5 py-2 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl border-2 border-black">
                             +{post.points} XP
                          </div>
                       </div>
                       <div className="p-8">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs border" style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}>👤</div>
                             <span className="font-black text-sm uppercase tracking-tight italic" style={{ color: currentTheme.text }}>{post.userHandle}</span>
                          </div>
                          <p className="text-xs font-bold leading-relaxed mb-6 italic" style={{ color: currentTheme.textSecondary }}>"{post.content}"</p>
                          <div className="flex flex-wrap gap-2">
                             {post.tags.map(tag => (
                               <span key={tag} className="text-[#007BFF] text-[9px] font-black uppercase tracking-widest">{tag}</span>
                             ))}
                          </div>
                       </div>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {/* 2. AMBIENTE GAMIFICAÇÃO (RANKING + PONTOS) */}
          {activeModule === 'PONTOS' && (
            <div className="animate-in fade-in slide-in-from-right duration-500 space-y-12">
               {/* Resumo Pessoal */}
               <div className="bg-[#007BFF] border-b-[12px] border-r-[12px] border-black p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                     <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block italic">O teu progresso</span>
                     <h3 className="text-white font-black text-4xl uppercase tracking-tighter italic leading-none mb-8">Nível: Especialista</h3>
                     
                     <div className="flex justify-between items-end mb-4">
                        <span className="text-white font-black text-xs uppercase tracking-widest italic">12.450 / 15.000 XP</span>
                        <span className="text-white/60 text-[9px] font-black uppercase tracking-widest">83%</span>
                     </div>
                     <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border-2 border-white/20 mb-8">
                        <div className="h-full bg-white transition-all duration-1000" style={{ width: '83%' }}></div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-3xl border border-white/10">
                           <span className="text-white/40 text-[8px] font-black uppercase block mb-1">Partilhas</span>
                           <span className="text-white font-black text-xl italic leading-none">24</span>
                        </div>
                        <div className="bg-black/20 p-4 rounded-3xl border border-white/10">
                           <span className="text-white/40 text-[8px] font-black uppercase block mb-1">Vídeos</span>
                           <span className="text-white font-black text-xl italic leading-none">08</span>
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 opacity-30 group-hover:animate-shine" />
               </div>

               {/* Tabela de Pontos */}
               <div className="border-4 border-black rounded-[3.5rem] p-10 shadow-2xl" style={{ backgroundColor: currentTheme.surface }}>
                  <h3 className="font-[900] text-2xl uppercase tracking-tighter italic mb-8 leading-none" style={{ color: currentTheme.text }}>Tabela de Pontos</h3>
                  <div className="space-y-3">
                     {GAMIFICATION_RULES.map(rule => (
                       <div key={rule.id} className="flex items-center justify-between p-6 rounded-3xl border group hover:border-white/20 transition-all" style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}>
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{rule.icon}</div>
                             <span className="font-black text-[10px] uppercase tracking-widest italic" style={{ color: currentTheme.text }}>{rule.action}</span>
                          </div>
                          <span className="text-[#FACC15] font-black text-sm italic">+{rule.points} XP</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Leaderboard */}
               <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                     <h3 className="font-black text-2xl uppercase tracking-tighter italic leading-none" style={{ color: currentTheme.text }}>Leaderboard</h3>
                     <span className="text-[#FACC15] text-[9px] font-black uppercase tracking-widest italic underline decoration-2 underline-offset-4">Top 100</span>
                  </div>
                  <div className="space-y-4">
                     {MOCK_LEADERBOARD.map(user => (
                       <div key={user.userHandle} className={`flex items-center justify-between p-8 rounded-[3.5rem] border-4 border-black transition-all ${user.rank === 1 ? 'bg-[#FACC15] scale-[1.05] shadow-[0_20px_60px_rgba(250,204,21,0.4)]' : 'shadow-xl'}`}
                            style={{ backgroundColor: user.rank === 1 ? '#FACC15' : currentTheme.surface }}>
                          <div className="flex items-center gap-6">
                             <div className={`w-12 h-12 rounded-full flex items-center justify-center font-[900] text-2xl italic border-4 border-black/10 ${user.rank === 1 ? 'bg-black text-[#FACC15]' : 'bg-white text-slate-900'}`}>
                                {user.rank}
                             </div>
                             <div className="flex flex-col">
                                <span className={`font-black text-lg uppercase tracking-tight leading-none mb-1 ${user.rank === 1 ? 'text-black' : ''}`} style={{ color: user.rank === 1 ? '#000' : currentTheme.text }}>{user.userHandle}</span>
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] italic ${user.rank === 1 ? 'text-black/60' : 'text-slate-500'}`}>{user.level}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className={`font-black text-xl italic block leading-none ${user.rank === 1 ? 'text-black' : 'text-[#FACC15]'}`}>{user.points.toLocaleString()}</span>
                             <span className={`text-[7px] font-black uppercase tracking-widest ${user.rank === 1 ? 'text-black/40' : 'text-slate-600'}`}>XP TOTAL</span>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {/* 3. AMBIENTE COMUNIDADE (CHAT + CALENDÁRIO) */}
          {activeModule === 'COMUNIDADE' && (
            <div className="animate-in fade-in slide-in-from-right duration-500 space-y-12 pb-20">
               {/* Event Calendar */}
               <div className="border-4 border-black rounded-[4rem] p-10 shadow-2xl relative overflow-hidden" style={{ backgroundColor: currentTheme.surface }}>
                  <div className="flex items-center justify-between mb-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FACC15] rounded-2xl flex items-center justify-center text-[#020617] text-2xl border-b-4 border-r-4 border-black">📅</div>
                        <h3 className="font-[900] text-2xl uppercase tracking-tighter italic leading-none" style={{ color: currentTheme.text }}>Eventos X247</h3>
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: currentTheme.textSecondary }}>Outubro 2026</span>
                  </div>
                  
                  <div className="space-y-4">
                     {MOCK_EVENTS.map(ev => (
                       <button key={ev.id} className="w-full flex items-center gap-6 p-6 rounded-[2.5rem] border-2 group hover:border-white transition-all text-left"
                               style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}>
                          <div className="flex flex-col items-center justify-center bg-white text-slate-900 w-16 h-16 rounded-3xl shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                             <span className="text-sm font-black leading-none">{ev.date.split(' ')[0]}</span>
                             <span className="text-[9px] font-black uppercase tracking-widest mt-1">{ev.date.split(' ')[1]}</span>
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${ev.type === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : 'bg-[#007BFF] text-white'}`}>{ev.type}</span>
                                <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{ev.time}</span>
                             </div>
                             <h4 className="font-black text-sm uppercase tracking-tight leading-none group-hover:text-[#FACC15] transition-colors" style={{ color: currentTheme.text }}>{ev.title}</h4>
                          </div>
                          <span className="text-slate-700 text-2xl group-hover:text-white transition-colors">→</span>
                       </button>
                     ))}
                  </div>
               </div>

               {/* Community Chat - Frosted Glassmorphism */}
               <div className="bg-white/5 backdrop-blur-3xl border-4 border-white/10 rounded-[4rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col h-[500px]" style={{ borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-green-500 flex items-center justify-center text-slate-900 font-black">@</div>
                        <h3 className="font-[900] text-xl uppercase tracking-tighter italic leading-none" style={{ color: currentTheme.text }}>Chat Geral</h3>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-500 text-[8px] font-black uppercase tracking-widest">142 Online</span>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar mb-8 pr-2">
                     {chatMessages.map(msg => (
                       <div key={msg.id} className={`flex flex-col ${msg.user === 'Eu' ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-3 mb-1.5">
                             <span className={`text-[9px] font-black uppercase tracking-widest ${msg.user === 'Flix' ? 'text-green-500' : 'text-slate-500'}`}>{msg.user}</span>
                             <span className="text-slate-700 text-[8px] font-black">{msg.timestamp}</span>
                          </div>
                          <div className={`max-w-[85%] px-6 py-4 rounded-[1.5rem] text-[11px] font-bold leading-relaxed shadow-xl ${
                            msg.user === 'Eu' 
                              ? 'bg-[#007BFF] text-white rounded-tr-none' 
                              : msg.user === 'Flix'
                                ? 'bg-green-600/10 border-2 border-green-600/30 text-white rounded-tl-none'
                                : 'bg-slate-900 border-2 border-slate-800 text-white rounded-tl-none'
                          }`}>
                             {msg.text}
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="flex gap-3 p-3 rounded-3xl border-4 border-black shadow-inner" style={{ backgroundColor: currentTheme.surface }}>
                     <input 
                       type="text" 
                       value={chatInput}
                       onChange={(e) => setChatInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                       placeholder="PARTILHA ALGO COM A COMUNIDADE..."
                       className="flex-1 bg-transparent text-[9px] font-black uppercase tracking-widest px-4 py-3 outline-none"
                       style={{ color: currentTheme.text }} // Fixed: Removed invalid placeholderColor
                     />
                     <button 
                       onClick={handleSendChat} 
                       className="bg-white text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center font-black border-b-4 border-r-4 border-slate-300 active:scale-95 active:border-b-0 transition-all shadow-xl"
                     >
                       →
                     </button>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.FEED} onTabChange={onNavigateToTab} themeMode={themeMode} />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes shine { 100% { left: 125%; } }
        .animate-shine { animation: shine 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default FeedScreen;
