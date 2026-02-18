
import React, { useState } from 'react';
import ProServiceCard from '../components/Pro/ProServiceCard';
import { ProService, ServiceArea, ServiceCategory, ThemeMode } from '../types';
import { TAXONOMY_AREAS, TAXONOMY_CATEGORIES } from '../constants';
import { checkPriceCompliance } from '../utils/sos-calculations';

// Fixed: Added ProDashboardScreenProps to resolve TS errors in App.tsx
interface ProDashboardScreenProps {
  themeMode: ThemeMode;
  onOpenMenu: () => void;
}

const MOCK_PRO_SERVICES: ProService[] = [
  {
    id: 's1',
    proId: 'pro1',
    areaId: 'canalizador',
    categoryId: 'c_roturas',
    description: 'Reparação de torneira monocomando na cozinha com substituição de cartucho.',
    priceTotal: 45.00,
    marketAvgPrice: 42.00,
    marketMaxPrice: 65.00,
    lastPriceChangeAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lockedUntil: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-10-01',
    isPublished: true,
    hasBudgetFee: true,
    budgetFeeAmount: 15.00
  },
  {
    id: 's2',
    proId: 'pro1',
    areaId: 'canalizador',
    categoryId: 'c_entupimentos',
    description: 'Desentupimento mecânico de sifão de cozinha e ramal de esgoto.',
    priceTotal: 55.00,
    marketAvgPrice: 58.00,
    marketMaxPrice: 85.00,
    lastPriceChangeAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    lockedUntil: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-09-15',
    isPublished: true,
    hasBudgetFee: false
  }
];

const ProDashboardScreen: React.FC<ProDashboardScreenProps> = ({ themeMode, onOpenMenu }) => {
  const [sosActive, setSosActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'FINANCIAL' | 'SOS'>('CATALOG');
  const [step, setStep] = useState<'LIST' | 'CHOOSE_AREA' | 'CHOOSE_CATEGORY' | 'FORM'>('LIST');
  
  // New Service Draft
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [hasFee, setHasFee] = useState(false);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [description, setDescription] = useState('');

  // Market references for demo (should come from backend)
  const marketRef = { avg: 45, max: 70 };
  const { isCompliant, maxAllowed } = checkPriceCompliance(price, marketRef.max);

  const resetFlow = () => {
    setStep('LIST');
    setSelectedArea(null);
    setSelectedCategory(null);
    setPrice(0);
    setHasFee(false);
    setFeeAmount(0);
    setDescription('');
  };

  return (
    <div className="flex flex-col flex-1 bg-[#020617] pb-24 h-screen overflow-hidden">
      {/* Header PRO */}
      <div className="shrink-0 p-6 bg-slate-900 border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h2 className="text-white font-black text-2xl uppercase tracking-tighter italic leading-none">Painel PRO</h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">João Silva · Fix.it x247</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22C55E]"></div>
            <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Verificado</span>
          </div>
        </div>

        {/* SOS Quick Toggle */}
        <div className={`p-5 rounded-[2.5rem] border-2 transition-all duration-500 ${sosActive ? 'bg-red-600 border-red-900 shadow-[0_10px_30px_rgba(255,31,51,0.25)]' : 'bg-slate-800 border-slate-700 opacity-80'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h3 className="text-white font-black text-lg uppercase leading-none tracking-tight">Status SOS</h3>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1.5 leading-none">
                  {sosActive ? 'Recebendo Chamados' : 'Operação Pausada'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSosActive(!sosActive)}
              className={`w-14 h-8 rounded-full p-1 relative transition-all border border-black/20 ${sosActive ? 'bg-black/40' : 'bg-slate-950'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${sosActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      {step === 'LIST' && (
        <div className="flex px-4 py-4 gap-2 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
          {(['CATALOG', 'SOS', 'FINANCIAL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider border-b-2 border-r-2 transition-all active:scale-95 whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#FACC15] text-slate-900 border-black/20 shadow-lg' 
                  : 'bg-slate-900 text-slate-500 border-white/5'
              }`}
            >
              {tab === 'CATALOG' ? 'Serviços+' : tab === 'SOS' ? 'SOS Config' : 'Fix Bank'}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        {step === 'LIST' && activeTab === 'CATALOG' && (
          <div className="pb-10">
            <div className="flex justify-between items-center mb-6 px-1">
              <div className="flex flex-col">
                <h3 className="text-white font-black text-sm uppercase tracking-tight italic">Meus Serviços+</h3>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Preço Total · Limite Mercado</span>
              </div>
              <button 
                onClick={() => setStep('CHOOSE_AREA')}
                className="h-10 px-5 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest border-b-4 border-r-4 border-slate-300 active:translate-y-0.5 active:border-b-0 shadow-md"
              >
                + Novo Serviço
              </button>
            </div>
            {MOCK_PRO_SERVICES.map(service => (
              <ProServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* STEP: CHOOSE AREA */}
        {step === 'CHOOSE_AREA' && (
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={resetFlow} className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-1">← Voltar</button>
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic mb-2">Escolha a sua Área</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Ofício Principal</p>
            <div className="grid grid-cols-2 gap-3 pb-20">
              {TAXONOMY_AREAS.map(area => (
                <button 
                  key={area.id}
                  onClick={() => { setSelectedArea(area); setStep('CHOOSE_CATEGORY'); }}
                  className="bg-slate-900 border-2 border-slate-800 p-6 rounded-[2rem] text-left hover:border-[#FACC15] transition-all"
                >
                  <span className="text-white font-black text-lg uppercase tracking-tight">{area.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: CHOOSE CATEGORY */}
        {step === 'CHOOSE_CATEGORY' && (
          <div className="animate-in slide-in-from-right duration-300">
            <button onClick={() => setStep('CHOOSE_AREA')} className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-1">← Área</button>
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic mb-2">{selectedArea?.name}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Selecione a Categoria</p>
            <div className="space-y-2 pb-20">
              {TAXONOMY_CATEGORIES.filter(c => c.areaId === selectedArea?.id).map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat); setStep('FORM'); }}
                  className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-white transition-all text-left"
                >
                  <span className="text-white font-black text-xs uppercase tracking-widest flex-1 pr-4">{cat.name}</span>
                  <span className="text-[#FACC15] text-lg shrink-0">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: FORM CONFIG */}
        {step === 'FORM' && (
          <div className="animate-in slide-in-from-bottom duration-300 pb-24">
            <div className="flex justify-between items-center mb-6">
               <button onClick={() => setStep('CHOOSE_CATEGORY')} className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest flex items-center gap-1">← Voltar</button>
               <span className="bg-white/10 px-3 py-1 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest">Configuração</span>
            </div>

            <div className="mb-8">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{selectedArea?.name} / {selectedCategory?.name}</span>
              <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic leading-tight">Serviço no Catálogo</h3>
            </div>

            <div className="space-y-6">
              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-white uppercase tracking-widest">Descrição do Serviço (Livre)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Reparação técnica detalhada de..."
                  className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 text-white font-bold text-sm h-28 focus:border-white outline-none transition-all placeholder:text-slate-700"
                />
              </div>

              {/* Price Market Stats */}
              <div className="bg-slate-900/50 border-2 border-slate-800 rounded-[2rem] p-6 shadow-inner">
                <div className="flex justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Referência Média</span>
                    <span className="text-white font-black text-lg">{marketRef.avg.toFixed(2)}€</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Limite Teto (90%)</span>
                    <span className="text-red-500 font-black text-lg">{maxAllowed.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-white uppercase tracking-widest">Preço Total Proposto</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className={`w-full bg-slate-800 border-4 border-black rounded-2xl p-4 text-white font-black text-xl focus:outline-none shadow-xl ${!isCompliant && price > 0 ? 'border-red-500 text-red-500' : 'focus:border-white'}`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xl">€</span>
                  </div>
                  {!isCompliant && price > 0 && (
                    <p className="text-red-500 text-[9px] font-black uppercase tracking-tight mt-1.5 animate-pulse">Preço acima do limite de mercado permitido.</p>
                  )}
                </div>
              </div>

              {/* Budget Fee Toggle */}
              <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-tight">Custo de Orçamento?</h4>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Deductível na execução</p>
                </div>
                <button 
                  onClick={() => setHasFee(!hasFee)}
                  className={`w-12 h-7 rounded-full p-1 relative transition-all border-2 border-black/20 ${hasFee ? 'bg-[#FACC15]' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-md transition-all ${hasFee ? 'bg-slate-900 translate-x-5' : 'bg-white translate-x-0'}`} />
                </button>
              </div>

              {hasFee && (
                <div className="animate-in slide-in-from-top duration-200">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Valor da Taxa</label>
                  <input 
                    type="number"
                    value={feeAmount || ''}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-4 text-white font-black text-lg focus:outline-none focus:border-white"
                    placeholder="15.00"
                  />
                </div>
              )}

              {/* Info Lock Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-white/5 flex items-start gap-4">
                <span className="text-lg opacity-50 shrink-0">🔒</span>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-tight leading-relaxed">
                   O preço total ficará bloqueado durante <span className="text-white font-black">14 dias</span> após gravação. Mudanças frequentes afetam o rating operacional.
                </p>
              </div>

              <button 
                disabled={!isCompliant || !description || price <= 0}
                onClick={resetFlow}
                className={`w-full py-5 rounded-[2rem] border-b-8 border-r-8 border-black font-black text-lg uppercase tracking-[0.25em] transition-all active:translate-y-1 active:border-b-4 ${
                  isCompliant && description && price > 0 ? 'bg-[#FACC15] text-slate-900 shadow-[0_20px_40px_rgba(250,204,21,0.15)]' : 'bg-slate-800 text-slate-600 border-slate-900 opacity-50'
                }`}
              >
                Ativar Serviço
              </button>
            </div>
          </div>
        )}

        {/* FINANCIAL & SOS tabs remain simplified for focus on catalog */}
        {activeTab === 'FINANCIAL' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-500">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border-2 border-slate-800 shadow-2xl relative overflow-hidden">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block text-center">Fix Bank Saldo</span>
              <h2 className="text-white font-black text-4xl text-center tracking-tighter mb-8 leading-none">1.425,80€</h2>
              <button className="w-full py-4 bg-[#FACC15] text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl border-b-4 border-r-4 border-black/10 active:border-b-0 transition-all">Levantar Fundos</button>
            </div>
          </div>
        )}
        {activeTab === 'SOS' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-500">
            <div className="p-8 bg-slate-900/50 rounded-[2.5rem] border-2 border-white/5 text-center py-16">
              <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                <span className="text-4xl">🚨</span>
              </div>
              <h4 className="text-white font-black text-xl uppercase tracking-tighter italic mb-4">Configuração SOS</h4>
              <p className="text-slate-400 text-[11px] px-8 leading-relaxed mb-10 font-medium uppercase tracking-wider opacity-60">
                Ligue os serviços do catálogo para emergências. SLA definido por categoria.
              </p>
              <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border-b-4 border-r-4 border-black transition-all active:translate-y-0.5 active:border-b-0">Ativar Serviços SOS</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProDashboardScreen;
