import React from 'react';
import { COLORS, SUPPORT_CONTACTS, THEME } from '../constants';
import { AppTab, UserRole, AppView, ThemeMode, ProfileSubTab, AdminSubTab } from '../types';

interface MenuOSScreenProps {
  userRole: UserRole;
  themeMode: ThemeMode;
  onClose: () => void;
  onNavigate: (view: AppView, subTab?: string) => void;
  onToggleTheme: () => void;
}

const MenuOSScreen: React.FC<MenuOSScreenProps> = ({ 
  userRole, 
  themeMode, 
  onClose, 
  onNavigate, 
  onToggleTheme 
}) => {
  const currentTheme = THEME[themeMode];

  const sections: {
    title: string;
    items: {
      id: string;
      label: string;
      icon: string;
      color?: string;
      view?: AppView;
      subTab?: string;
      badge?: string;
      action?: () => void;
    }[];
  }[] = [
    {
      title: 'Ecossistema Fix.it',
      items: [
        { id: 'SOS', label: 'SOS 24/7', icon: '🚨', color: COLORS.SOS_RED, view: 'SOS' },
        { id: 'SERVICOS', label: 'Serviços+', icon: '🔧', color: COLORS.SUCCESS_GREEN, view: 'SERVICES_SEARCH' },
        { id: 'EMPREGO', label: 'Emprego+', icon: '💼', color: COLORS.JOB_GRAY, view: 'JOBS' },
        { id: 'VERSE', label: 'Ux247Verse', icon: '🌐', color: COLORS.VERSE_BLUE, view: 'VERSE' }
      ]
    },
    {
      title: 'A Minha Conta',
      items: [
        { id: 'PERFIL', label: 'Perfil & ID', icon: '🆔', view: 'PROFILE', subTab: 'ID' },
        { id: 'PEDIDOS', label: 'Meus Pedidos', icon: '📋', view: 'PEDIDOS', badge: '2' },
        { id: 'WALLETS', label: 'Fix Bank / Carteira', icon: '🏦', view: 'PROFILE', subTab: 'BANCO' } 
      ]
    },
    {
      title: 'Configuração',
      items: [
        { id: 'TEMA', label: `Tema (${themeMode === 'DARK' ? 'Modo Claro' : 'Modo Escuro'})`, icon: themeMode === 'DARK' ? '☀️' : '🌙', action: onToggleTheme },
        { id: 'LEGAL', label: 'Legal & Compliance', icon: '⚖️', view: 'LEGAL_COMPLIANCE' },
        { id: 'NOTIF', label: 'Notificações', icon: '🔔', view: 'SETTINGS_NOTIFICATIONS' },
        { id: 'PRIVACIDADE', label: 'Privacidade', icon: '🛡️', view: 'SETTINGS_PRIVACY' },
        { id: 'IDIOMA', label: 'Idioma (PT)', icon: '🌍', view: 'SETTINGS_LANGUAGE' }
      ]
    }
  ];

  const isAdminRole = userRole.startsWith('ADMIN_') || userRole === 'SUPER_ADMIN';

  if (isAdminRole) {
    // Fixed: Explicitly type adminItems to match the sections' items list structure to allow optional subTab and correct AppView typing
    const adminItems: typeof sections[0]['items'] = [
      { id: 'BACKOFFICE', label: 'Backoffice HQ', icon: '⚙️', view: 'ADMIN' as AppView, subTab: 'PERFORMANCE' }
    ];

    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN_ARQUITETO') {
      adminItems.push({ id: 'SENTINEL', label: 'Sentinel Live', icon: '🛰️', view: 'ADMIN' as AppView, subTab: 'SYSTEM' });
    }

    if (userRole === 'SUPER_ADMIN') {
      adminItems.push({ id: 'ORGANIZATIONS', label: 'Organizações', icon: '🏢', view: 'ORGANIZATIONS' as AppView });
    }

    sections.push({
      title: 'Sistema / Admin',
      items: adminItems
    });
  }

  const handleItemClick = (item: any) => {
    console.log(`[ANALYTICS] MenuAction: ${item.id}`);
    if (item.action) {
      item.action();
      if (item.id === 'TEMA') return; 
      onClose();
    } else if (item.view) {
      onNavigate(item.view as AppView, item.subTab);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] backdrop-blur-3xl flex flex-col p-6 animate-in fade-in duration-300 overflow-hidden"
      style={{ backgroundColor: themeMode === 'DARK' ? 'rgba(2, 6, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
    >
      <div className="flex items-center justify-between mb-10 pt-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#FF1F33] rounded-2xl flex items-center justify-center border-b-4 border-r-4 border-black shadow-lg">
              <span className="text-white font-black text-2xl italic">F</span>
           </div>
           <div>
              <h2 className="font-black text-xl uppercase tracking-tighter italic leading-none" style={{ color: currentTheme.text }}>Fix.it OS</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="opacity-40 font-black text-[8px] uppercase tracking-widest">v3.1.0 Kernel</span>
                 <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                 <span className="text-green-500 text-[8px] font-black uppercase tracking-widest">Live Engine</span>
              </div>
           </div>
        </div>
        <button 
          onClick={onClose}
          className="w-14 h-14 border-4 border-black rounded-[2rem] flex items-center justify-center text-3xl font-black active:scale-90 transition-all shadow-xl"
          style={{ backgroundColor: currentTheme.glass, color: currentTheme.text }}
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-12 pb-20">
        {sections.map(section => (
          <div key={section.title} className="space-y-4">
            <h3 className="opacity-30 font-black text-[10px] uppercase tracking-[0.4em] px-4 italic leading-none" style={{ color: currentTheme.text }}>{section.title}</h3>
            <div className="grid grid-cols-1 gap-3">
               {section.items.map(item => (
                 <button
                   key={item.id}
                   onClick={() => handleItemClick(item)}
                   className="w-full border-4 border-black p-6 rounded-[2.5rem] flex items-center justify-between shadow-xl transition-all active:scale-[0.98] group"
                   style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                 >
                   <div className="flex items-center gap-5">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-black/20"
                        style={{ backgroundColor: item.color || currentTheme.glass }}
                      >
                         {item.icon}
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest italic" style={{ color: currentTheme.text }}>{item.label}</span>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      {item.badge && (
                        <span className="bg-red-600 text-white font-black text-[9px] px-2 py-1 rounded-full shadow-lg border-2 border-black">
                          {item.badge}
                        </span>
                      )}
                      <span className="opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: currentTheme.text }}>→</span>
                   </div>
                 </button>
               ))}
            </div>
          </div>
        ))}

        <div className="pt-10 border-t space-y-4" style={{ borderColor: currentTheme.border }}>
           <p className="opacity-40 text-[9px] font-black uppercase tracking-widest text-center italic" style={{ color: currentTheme.text }}>Central de Suporte v3.1</p>
           <div className="flex justify-center gap-4">
              <button 
                onClick={() => handleItemClick({ view: 'PROFILE', subTab: 'SO' })}
                className="p-6 rounded-[2rem] border-4 border-black flex flex-col items-center gap-2 shadow-xl active:scale-95" 
                style={{ backgroundColor: currentTheme.surface }}
              >
                 <span className="text-3xl">🛡️</span>
                 <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: currentTheme.text }}>Ajuda SO</span>
              </button>
              <a 
                href={SUPPORT_CONTACTS.WHATSAPP_LINK}
                target="_blank"
                className="p-6 rounded-[2rem] border-4 border-black flex flex-col items-center gap-2 shadow-xl active:scale-95" 
                style={{ backgroundColor: currentTheme.surface }}
              >
                 <span className="text-3xl">💬</span>
                 <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: currentTheme.text }}>WhatsApp</span>
              </a>
           </div>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default MenuOSScreen;