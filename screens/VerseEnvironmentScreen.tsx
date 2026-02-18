
import React, { useState, useEffect } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { THEME } from '../constants';
import { AppTab, ThemeMode, UxTabId, UxConfig, UserRole } from '../types';

interface VerseEnvironmentScreenProps {
  themeMode: ThemeMode;
  userRole: UserRole;
  onBack: () => void;
  onNavigateToTab: (tab: AppTab) => void;
}

const UX_TABS_SPEC: { id: UxTabId; label: string; icon: string }[] = [
  { id: 'videos', label: 'Flix TV', icon: '📺' },
  { id: 'hub', label: 'Hub Digital', icon: '🪐' },
  { id: 'social', label: 'Social Hub', icon: '🌍' },
  { id: 'shop', label: 'Shop', icon: '🛒' },
  { id: 'future', label: 'Futuro', icon: '🚀' },
];

const VerseEnvironmentScreen: React.FC<VerseEnvironmentScreenProps> = ({ 
  themeMode, 
  userRole,
  onBack, 
  onNavigateToTab 
}) => {
  const currentTheme = THEME[themeMode];
  const [activeTab, setActiveTab] = useState<UxTabId>('videos');
  const [config, setConfig] = useState<UxConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/ux247verse/config');
        if (!response.ok) throw new Error('Falha ao carregar configuração Verse');
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const openExternal = (url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Fix.it x247',
      text: 'Descubra a revolução do ecossistema de serviços em Almada!',
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 h-screen items-center justify-center" style={{ backgroundColor: currentTheme.bg }}>
        <div className="w-12 h-12 border-4 border-[#007BFF] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black text-[10px] uppercase tracking-widest animate-pulse" style={{ color: currentTheme.textSecondary }}>Lançando Verso...</p>
      </div>
    );
  }

  const visibleTabs = UX_TABS_SPEC.filter(tab => {
    if (!config) return false;
    const enabledKey = `${tab.id}_enabled` as keyof UxConfig;
    const visKey = `${tab.id}_visibility` as keyof UxConfig;
    if (config[enabledKey] !== true) return false;
    const visibility = config[visKey];
    if (visibility === 'admin' && !['SUPER_ADMIN', 'ADMIN_ARQUITETO'].includes(userRole)) return false;
    return true;
  });

  if (visibleTabs.length === 0) {
    return (
      <div className="flex flex-col flex-1 h-screen items-center justify-center p-10 text-center" style={{ backgroundColor: currentTheme.bg }}>
        <div className="text-6xl mb-6">🛡️</div>
        <h3 className="font-black text-2xl uppercase tracking-tighter italic mb-2" style={{ color: currentTheme.text }}>Em Manutenção</h3>
        <button onClick={onBack} className="mt-8 px-8 py-3 bg-[#007BFF] text-white rounded-full font-black text-[10px] uppercase tracking-widest border-b-4 border-black active:translate-y-1">Voltar</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden relative" style={{ backgroundColor: currentTheme.bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: `radial-gradient(circle, ${themeMode === 'DARK' ? 'white' : 'black'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      <header className="sticky top-0 z-40 bg-[#007BFF] border-b-4 border-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white active:scale-90 border border-white/10">←</button>
          <h2 className="font-black text-2xl text-white uppercase tracking-[0.1em] italic leading-none">UX247Verse</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span className="text-[8px] font-black text-white uppercase tracking-widest">v1.1 Live</span>
        </div>
      </header>

      <div className="sticky top-[72px] z-30 bg-[#007BFF] border-b-4 border-slate-900 overflow-x-auto no-scrollbar flex p-3 gap-2">
        {visibleTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all shrink-0 active:scale-95 ${
                isActive 
                  ? 'bg-white border-black text-[#007BFF] shadow-[0_4px_0_0_rgba(0,0,0,1)] -translate-y-0.5' 
                  : 'bg-white/10 border-transparent text-white opacity-70'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-40">
        <div className="animate-in fade-in slide-in-from-right duration-500">
          
          {/* TAB: VIDEOS */}
          {activeTab === 'videos' && config?.videos_meta && (
            <div className="space-y-6">
              {[
                { title: 'Fix.it X247 – O Pitch', dur: '02:45', type: 'Institucional', url: config.videos_meta.pitch_url, img: 'https://picsum.photos/seed/pitch/800/450' },
                { title: 'FIX.IT em 30 segundos', dur: '00:30', type: 'Institucional', url: config.videos_meta.short_url, img: 'https://picsum.photos/seed/short/800/450' },
                { title: 'Como usar o SOS 24/7', dur: '03:15', type: 'DIY', url: config.videos_meta.sos_url, img: 'https://picsum.photos/seed/soshow/800/450' }
              ].map((v, i) => (
                <button key={i} onClick={() => openExternal(v.url)} className="w-full relative aspect-video rounded-[2rem] overflow-hidden bg-slate-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group active:scale-[0.98] transition-all">
                  <img src={v.img} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" alt={v.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#007BFF] text-white text-[8px] font-black px-2 py-0.5 rounded uppercase">{v.type}</span>
                      <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{v.dur}</span>
                    </div>
                    <h4 className="text-white font-black text-xl uppercase tracking-tighter italic leading-none">{v.title}</h4>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-[#007BFF] transition-all">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* TAB: HUB DIGITAL */}
          {activeTab === 'hub' && (
            <div className="space-y-8">
              {[
                { 
                  group: 'Lojas & Materiais', 
                  items: [
                    { label: 'Leroy Merlin', icon: '🏗️', url: 'https://www.leroymerlin.pt' },
                    { label: 'MaxMat', icon: '🧱', url: 'https://www.maxmat.pt' },
                    { label: 'Brico Depot', icon: '🔧', url: 'https://www.bricodepot.pt' },
                    { label: 'IKEA', icon: '🪑', url: 'https://www.ikea.com/pt/pt' },
                    { label: 'Custo Justo', icon: '💶', url: 'https://www.custojusto.pt' },
                    { label: 'Amazon', icon: '📦', url: 'https://www.amazon.es' },
                    { label: 'KuantoKusta', icon: '💹', url: 'https://www.kuantokusta.pt' },
                    { label: 'OLX', icon: '♻️', url: 'https://www.olx.pt' },
                    { label: 'AliExpress', icon: '🛒', url: 'https://www.aliexpress.com' }
                  ] 
                },
                {
                  group: 'Emprego & Carreira',
                  items: [
                    { label: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com' },
                    { label: 'IEFP', icon: '🏛️', url: 'https://iefponline.iefp.pt' },
                    { label: 'Even', icon: '📲', url: 'https://www.even.pt' }
                  ]
                },
                {
                  group: 'Aluguer & Outros',
                  items: [
                    { label: 'Yescapa', icon: '🚐', url: 'https://www.yescapa.pt' },
                    { label: 'Planetatours', icon: '🌍', url: 'https://planetatours.pt' }
                  ]
                }
              ].map(section => (
                <div key={section.group}>
                   <h3 className="font-black text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: currentTheme.textSecondary }}>{section.group}</h3>
                   <div className="grid grid-cols-1 gap-3">
                      {section.items.map(item => (
                        <button key={item.label} onClick={() => openExternal(item.url)} className="w-full h-20 border-4 border-black rounded-[1.5rem] flex items-center px-6 gap-6 transition-all active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#007BFF]/5" style={{ backgroundColor: currentTheme.surface }}>
                          <span className="text-3xl">{item.icon}</span>
                          <span className="font-black text-sm uppercase tracking-tight" style={{ color: currentTheme.text }}>{item.label}</span>
                          <span className="ml-auto text-[#007BFF] font-black">→</span>
                        </button>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SOCIAL HUB */}
          {activeTab === 'social' && config?.social_meta && (
            <div className="space-y-6">
              <div className="relative h-48 rounded-[2rem] overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-slate-900 mb-8">
                 <img src="https://picsum.photos/seed/socialx247/1200/800" className="w-full h-full object-cover grayscale opacity-50" alt="Social" />
                 <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">Social Hub X247</h3>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Conecte-se à revolução dos serviços.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {[
                   { label: 'WhatsApp', icon: '🟢', color: '#22C55E', url: config.social_meta.whatsapp_url, sub: 'Canal de Emergência & Ops' },
                   { label: 'Telegram', icon: '📣', color: '#26A5E4', url: config.social_meta.telegram_url, sub: 'Alertas em Tempo Real' },
                   { label: 'Facebook', icon: '📘', color: '#1877F2', url: config.social_meta.facebook_url, sub: 'Página da Comunidade' },
                   { label: 'Instagram', icon: '📸', color: '#E1306C', url: config.social_meta.instagram_url, sub: 'Fix.it Moments' },
                   { label: 'TikTok', icon: '🎵', color: '#000000', url: config.social_meta.tiktok_url, sub: 'Dicas em 30 Segundos' },
                   { label: 'LinkedIn', icon: '🔵', color: '#0A66C2', url: config.social_meta.linkedin_url, sub: 'Professional Network' },
                   { label: 'Rede X', icon: '✖️', color: '#000000', url: config.social_meta.x_url, sub: 'Global Protocol updates' },
                   { label: 'YouTube', icon: '🔴', color: '#FF0000', url: config.social_meta.youtube_url, sub: 'Tutoriais & Flix TV' }
                 ].map(link => (
                   <button key={link.label} onClick={() => openExternal(link.url)} className="w-full p-5 border-4 border-black rounded-[1.5rem] flex items-center gap-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all text-left" style={{ backgroundColor: currentTheme.surface, borderLeftColor: link.color, borderLeftWidth: '12px' }}>
                     <span className="text-3xl shrink-0">{link.icon}</span>
                     <div>
                        <h4 className="font-black text-sm uppercase tracking-widest italic" style={{ color: currentTheme.text }}>{link.label}</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{link.sub}</p>
                     </div>
                   </button>
                 ))}
              </div>

              <button onClick={handleShare} className="w-full py-6 mt-6 bg-[#007BFF] text-white rounded-[2rem] border-b-8 border-r-8 border-black font-black text-xl uppercase tracking-[0.2em] shadow-2xl active:translate-y-1 transition-all">PARTILHAR APP</button>
            </div>
          )}

          {/* TAB: SHOP */}
          {activeTab === 'shop' && config?.shop_meta && (
            <div className="space-y-8">
              <div className="border-4 border-black rounded-[2.5rem] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-left" style={{ backgroundColor: currentTheme.surface }}>
                <div className="aspect-square bg-slate-900 relative">
                   <div className="absolute top-6 right-6 bg-[#FACC15] text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-black z-10 shadow-lg">PRO EDITION</div>
                   <img src="https://picsum.photos/seed/kitpro31/800/800" className="w-full h-full object-cover grayscale-[0.5]" alt="Kit Pro" />
                </div>
                <div className="p-8">
                   <h3 className="font-black text-3xl uppercase tracking-tighter italic mb-2 leading-none" style={{ color: currentTheme.text }}>Kit Ferramentas Pro</h3>
                   <p className="text-slate-400 font-bold uppercase tracking-tight text-xs italic mb-6">Equipamento essencial certificado Fix.it v1</p>
                   <div className="flex items-baseline gap-2 mb-8">
                      <span className="font-black text-4xl italic" style={{ color: currentTheme.text }}>89,90€</span>
                      <span className="text-slate-500 line-through text-sm font-bold">120,00€</span>
                   </div>
                   <button onClick={() => openExternal(config.shop_meta.kit_url)} className="w-full py-4 bg-[#007BFF] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border-b-4 border-r-4 border-black active:translate-y-1">Ver Detalhes Técnicos</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FUTURO */}
          {activeTab === 'future' && (
            <div className="space-y-4">
              <div className="mb-6 p-6 bg-slate-900 border-4 border-black rounded-[2rem] shadow-xl text-center">
                 <span className="text-4xl mb-4 block animate-bounce">🚀</span>
                 <h3 className="text-white font-black text-xl uppercase tracking-tighter italic">Futuro Ux247verse</h3>
                 <p className="text-slate-500 text-[9px] font-black uppercase mt-2">Área Reservada a Fundadores / Admins</p>
              </div>
              {[
                { id: 'tutoriais', icon: '📚', label: 'Manual PDF & Tutoriais' },
                { id: 'chat-tv', icon: '💬', label: 'Chat TV Live Interaction' },
                { id: 'eventos', icon: '📅', label: 'Eventos & Workshops Presenciais' },
                { id: 'aluguer', icon: '🔑', label: 'Sistema Aluguer de Ferramentas' },
                { id: 'parceiros', icon: '🤝', label: 'Marketplace de Parceiros Premium' }
              ].map(card => (
                <div key={card.id} className="h-20 border-4 border-black rounded-[1.5rem] flex items-center justify-between px-6 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-50 grayscale text-left" style={{ backgroundColor: currentTheme.surface }}>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl shrink-0">{card.icon}</span>
                    <span className="font-black text-sm uppercase tracking-widest italic" style={{ color: currentTheme.text }}>{card.label}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest border border-slate-700 px-2 py-1 rounded text-slate-500 shrink-0">Em breve</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.HOME} onTabChange={onNavigateToTab} themeMode={themeMode} />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default VerseEnvironmentScreen;
