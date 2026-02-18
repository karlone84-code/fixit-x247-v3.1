
import React, { useState } from 'react';
import { AppNotification, NotificationType, ThemeMode } from '../types';
import { THEME } from '../constants';

interface NotificationCenterScreenProps {
  themeMode: ThemeMode; // Fixed: Added missing themeMode property
  onClose: () => void;
  onNavigateToOrder: (id: string) => void;
  onNavigateToSupport: (id: string) => void;
}

const MOCK_NOTIFS: AppNotification[] = [
  {
    id: 'n1',
    type: 'ORDER_STATUS',
    title: 'Pro a Caminho!',
    content: 'O Mário Canalizador já saiu. Chegada prevista em 15 min.',
    isRead: false,
    createdAt: 'Há 2 min',
    metadata: { order_id: '#SOS-2026-000123' }
  },
  {
    id: 'n2',
    type: 'PAYMENT',
    title: 'Pagamento Concluído',
    content: 'O valor de 115.00€ foi retido com sucesso em Escrow.',
    isRead: true,
    createdAt: 'Há 15 min',
    metadata: { order_id: '#SOS-2026-000123' }
  },
  {
    id: 'n3',
    type: 'SUPPORT',
    title: 'Resposta do Flix',
    content: 'O teu ticket #T-2026-00001 sobre a disputa foi atualizado.',
    isRead: false,
    createdAt: 'Há 1h',
    metadata: { ticket_id: 'T-2026-00001' }
  },
  {
    id: 'n4',
    type: 'SYSTEM',
    title: 'Novo Módulo Jobs',
    content: 'Descobre as novas oportunidades na Bolsa de Emprego+.',
    isRead: true,
    createdAt: 'Há 1 dia',
    metadata: {}
  }
];

const NotificationCenterScreen: React.FC<NotificationCenterScreenProps> = ({ 
  themeMode, // Fixed: Destructured themeMode
  onClose, 
  onNavigateToOrder,
  onNavigateToSupport
}) => {
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'ALL'>('ALL');
  const currentTheme = THEME[themeMode]; // Fixed: Use theme constants

  const filtered = MOCK_NOTIFS.filter(n => activeFilter === 'ALL' || n.type === activeFilter);

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'ORDER_STATUS': return '🚨';
      case 'PAYMENT': return '💶';
      case 'SUPPORT': return '🤖';
      case 'SYSTEM': return '🛰️';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex flex-col p-6 animate-in slide-in-from-right duration-300"
      style={{ backgroundColor: currentTheme.bg }} // Fixed: Apply theme-specific background
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 mt-4">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-[#FACC15] text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-1">← Voltar</button>
        </div>
        <h2 className="text-white font-black text-xl uppercase tracking-tighter italic italic">Notificações</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 shrink-0">
        {(['ALL', 'ORDER_STATUS', 'PAYMENT', 'SUPPORT', 'SYSTEM'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 transition-all shrink-0 ${
              activeFilter === f ? 'bg-[#FACC15] border-black text-black shadow-xl scale-105' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {f === 'ALL' ? 'Todas' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-10">
        {filtered.length > 0 ? filtered.map(notif => (
          <button
            key={notif.id}
            onClick={() => {
              if (notif.metadata.order_id) onNavigateToOrder(notif.metadata.order_id);
              if (notif.metadata.ticket_id) onNavigateToSupport(notif.metadata.ticket_id);
              onClose();
            }}
            className={`w-full bg-slate-900 border-4 border-black p-6 rounded-[2.5rem] flex items-start gap-5 text-left relative overflow-hidden transition-all active:scale-[0.98] ${notif.isRead ? 'opacity-60' : 'border-white/20'}`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shrink-0">
               {getTypeIcon(notif.type)}
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-black text-sm uppercase tracking-tight italic leading-none">{notif.title}</span>
                  <span className="text-slate-600 text-[8px] font-black uppercase">{notif.createdAt}</span>
               </div>
               <p className="text-slate-400 text-[10px] font-bold leading-relaxed">{notif.content}</p>
            </div>
            {!notif.isRead && (
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#FACC15] rounded-full shadow-[0_0_10px_#FACC15]"></div>
            )}
          </button>
        )) : (
          <div className="py-20 text-center opacity-30 flex flex-col items-center">
             <span className="text-5xl mb-4">📭</span>
             <p className="text-white font-black text-xs uppercase tracking-widest">A caixa está limpa x247</p>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default NotificationCenterScreen;
