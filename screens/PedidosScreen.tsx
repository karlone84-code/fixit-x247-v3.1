import React, { useState, useEffect } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import OrderInProgressCard from '../components/Orders/OrderInProgressCard';
import { AppTab, ServiceRequest, RequestStatus, ThemeMode } from '../types';
import { SUPPORT_CONTACTS } from '../constants';
import { api } from '../services/api';
import { playNotificationSound } from '../utils/sound';

type PedidosSubTab = 'PEDIDOS' | 'HISTORICO' | 'BONITO';

const MOCK_ORDERS: ServiceRequest[] = [
  {
    id: '#SOS-2026-000123',
    type: 'SOS',
    title: 'Rotura de Cano (SOS)',
    categoryLabel: 'Canalização · Emergência',
    status: 'AGUARDANDO_PAGAMENTO',
    escrowStatus: 'EM_ESCROW',
    date: 'Hoje',
    time: 'Urgente',
    value: 115.00,
    basePrice: 70.00,
    appFee: 25.00,
    sosFee: 20.00,
    sosImmediateFee: 20.00,
    retainedValue: 115.00,
    address: 'Rua de Almada, 12, 3º Esq',
    proName: 'Mário Canalizações',
    proIsOnline: true,
    distanceKm: 3.2,
    gpsPreference: 'GOOGLE_MAPS',
    marketPosition: 'AVG',
    isCapped: true
  },
  {
    id: '#SER-2026-000456',
    type: 'CUSTOM',
    title: 'Instalação de Quadro Elétrico',
    categoryLabel: 'Eletricidade · Instalação',
    status: 'EM_EXECUCAO',
    escrowStatus: 'EM_ESCROW',
    date: 'Hoje',
    time: '14:30',
    value: 125.00,
    basePrice: 100.00,
    appFee: 25.00,
    retainedValue: 125.00,
    address: 'Av. Liberdade, 45',
    proName: 'Eletro Volt Solutions',
    proIsOnline: true,
    originType: 'QUOTE',
    marketPosition: 'BELOW'
  }
];

interface PedidosScreenProps {
  themeMode: ThemeMode;
  onBack: () => void;
  onNavigateToTab: (tab: AppTab) => void;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  initialOrderId?: string;
  onPayOrder?: (order: ServiceRequest) => void;
}

const PedidosScreen: React.FC<PedidosScreenProps> = ({ 
  themeMode,
  onBack, 
  onNavigateToTab, 
  onOpenMenu, 
  onOpenNotifications,
  initialOrderId,
  onPayOrder
}) => {
  const [activeSubTab, setActiveSubTab] = useState<PedidosSubTab>('PEDIDOS');
  const [orders, setOrders] = useState<ServiceRequest[]>(MOCK_ORDERS);
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(
    initialOrderId ? orders.find(o => o.id === initialOrderId) || null : null
  );

  useEffect(() => {
    const sub = api.subscribeToEvents((event) => {
      if (event.type === 'ORDER_STATUS_UPDATE') {
        const { order_id, new_status } = event.payload;
        setOrders(prev => prev.map(o => o.id === order_id ? { ...o, status: new_status } : o));
        playNotificationSound();
        if (selectedReq?.id === order_id) {
            setSelectedReq(prev => prev ? { ...prev, status: new_status } : null);
        }
      }
    });
    return () => { if (sub) sub.close(); };
  }, [selectedReq]);

  const filteredOrders = orders.filter(req => {
    if (activeSubTab === 'PEDIDOS') return req.status !== 'CONCLUIDO' && req.status !== 'CANCELADO';
    if (activeSubTab === 'HISTORICO') return req.status === 'CONCLUIDO' || req.status === 'CANCELADO';
    if (activeSubTab === 'BONITO') return req.type === 'PACK';
    return true;
  });

  const getStatusColor = (status: RequestStatus) => {
    if (['A_CAMINHO', 'EM_EXECUCAO', 'PAID', 'ASSIGNED'].includes(status)) return 'bg-blue-600';
    if (status === 'CONCLUIDO') return 'bg-green-600';
    if (status === 'AGUARDANDO_PAGAMENTO') return 'bg-yellow-500 animate-pulse';
    return 'bg-slate-700';
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-[#020617] overflow-hidden">
      <HomeHeader themeMode={themeMode} onOpenMenu={onOpenMenu} onOpenNotifications={onOpenNotifications} />
      <EnvironmentBar />

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-44">
        {!selectedReq ? (
          <>
            <div className="mt-4 mb-8">
               <h2 className="text-white font-[900] text-4xl uppercase tracking-tighter italic leading-none mb-1">Meus Pedidos</h2>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-60">Ligação Kernel Live Ativa</p>
               </div>
            </div>

            <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-10 sticky top-0 z-10 shadow-2xl">
               {(['PEDIDOS', 'HISTORICO', 'BONITO'] as const).map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveSubTab(tab)}
                   className={`flex-1 py-3 rounded-full text-[9px] font-[900] uppercase tracking-[0.2em] transition-all duration-300 ${
                     activeSubTab === tab ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500'
                   }`}
                 >
                   {tab === 'PEDIDOS' ? 'Ativos' : tab === 'HISTORICO' ? 'Histórico' : 'Bonito'}
                 </button>
               ))}
            </div>

            <div className="space-y-6">
              {filteredOrders.map(req => (
                <div 
                  key={req.id} 
                  className="w-full bg-slate-900 border-4 border-black rounded-[3.5rem] p-8 text-left shadow-2xl transition-all relative overflow-hidden group hover:border-white"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      req.status === 'AGUARDANDO_PAGAMENTO' ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                    <span className="text-white font-black text-2xl italic">{req.value.toFixed(2)}€</span>
                  </div>
                  
                  <h4 className="text-white font-black text-xl uppercase italic leading-none">{req.title}</h4>
                  
                  <div className="flex items-center gap-3 mt-4 mb-8">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(req.status)} shadow-[0_0_8px_currentColor]`}></div>
                    <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{req.id} · {req.date}</span>
                  </div>

                  <div className="flex gap-3">
                     <button 
                       onClick={() => setSelectedReq(req)}
                       className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest border-b-4 border-r-4 border-black active:translate-y-1 active:border-0"
                     >
                       Detalhes
                     </button>
                     {req.status === 'AGUARDANDO_PAGAMENTO' && onPayOrder && (
                        <button 
                          onClick={() => onPayOrder(req)}
                          className="flex-1 py-4 bg-[#FACC15] text-black rounded-2xl font-black text-[9px] uppercase tracking-widest border-b-4 border-r-4 border-black active:translate-y-1 active:border-0 shadow-lg animate-pulse"
                        >
                          Pagar Agora
                        </button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <OrderInProgressCard order={selectedReq} onBack={() => setSelectedReq(null)} />
        )}
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.PEDIDOS} onTabChange={onNavigateToTab} />
    </div>
  );
};

export default PedidosScreen;