
import React, { useState } from 'react';
import { ServiceRequest, ThemeMode } from '../../types';
import { ICONS, THEME } from '../../constants';

interface OrderInProgressCardProps {
  order: ServiceRequest;
  onBack: () => void;
}

const OrderInProgressCard: React.FC<OrderInProgressCardProps> = ({ order, onBack }) => {
  const [report, setReport] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isValueConfirmed, setIsValueConfirmed] = useState(false);
  const [startConfirmed, setStartConfirmed] = useState(false);
  const [arrivalConfirmed, setArrivalConfirmed] = useState(true);

  const finalValue = order.value; // Simplificado para o MVP

  const handleGPS = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address || 'Almada, Portugal')}`, '_blank');
  };

  const handleFinalize = () => {
    if (!isValueConfirmed) {
      alert("Por favor, confirme o valor final antes de finalizar.");
      return;
    }
    alert("Serviço finalizado com sucesso! Fatura emitida e enviada para o cliente.");
    onBack();
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 space-y-6 pb-20">
      {/* Header de Navegação do Card */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="bg-black text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-b-4 border-r-4 border-slate-700 active:translate-y-1 active:border-0"
        >
          ← Voltar à Lista
        </button>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]"></span>
           <span className="text-black font-black text-[9px] uppercase tracking-widest italic">A Decorrer X247</span>
        </div>
      </div>

      {/* CORE CARD - NEO BRUTALISM WHITE STYLE */}
      <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
        
        {/* 1. CABEÇALHO DO PEDIDO */}
        <div className="border-b-4 border-black pb-8">
           <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-black font-[900] text-3xl uppercase tracking-tighter italic leading-none">{order.title}</h3>
                <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mt-3">ID: {order.id} · Almada Protocol</p>
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">
                v3.1 Ativo
              </div>
           </div>
           
           <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                 <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-1 italic">📅 DATA</span>
                 <span className="text-black font-black text-xs italic">{order.date}</span>
              </div>
              <div className="flex flex-col border-x-2 border-slate-100 px-4">
                 <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-1 italic">🕒 HORA</span>
                 <span className="text-black font-black text-xs italic">{order.time}</span>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-slate-400 text-[8px] font-black uppercase tracking-widest mb-1 italic">🚗 CHEGADA</span>
                 <span className="text-black font-black text-xs italic">{arrivalConfirmed ? 'CONFIRMADA' : 'PENDENTE'}</span>
              </div>
           </div>
        </div>

        {/* 2. INTERVENIENTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* CLIENTE */}
           <div className="bg-slate-50 border-4 border-black p-6 rounded-[2rem] relative overflow-hidden">
              <span className="text-orange-500 font-black text-[9px] uppercase tracking-widest block mb-4 italic">👤 Cliente</span>
              <h4 className="text-black font-black text-lg leading-none mb-1">{order.clientName || 'Maria Silva'}</h4>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">NIF: 123456789</p>
              <div className="mt-4 pt-4 border-t-2 border-slate-200">
                 <p className="text-black text-[10px] font-bold leading-relaxed italic">{order.address}</p>
              </div>
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded text-[8px] font-black uppercase">Card #247001</div>
           </div>

           {/* PRO */}
           <div className="bg-slate-50 border-4 border-black p-6 rounded-[2rem]">
              <span className="text-green-600 font-black text-[9px] uppercase tracking-widest block mb-4 italic">🔧 Profissional</span>
              <h4 className="text-black font-black text-lg leading-none mb-1">{order.proName}</h4>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Pro Certificado X247</p>
              <div className="mt-4 bg-black/5 p-3 rounded-xl border border-black/10">
                 <span className="text-slate-500 text-[8px] font-black uppercase block mb-1">🚗 Viatura</span>
                 <span className="text-black font-black text-xs">RENAULT CLIO · 11-AB-22</span>
              </div>
           </div>
        </div>

        {/* 3. RELATÓRIO DE SERVIÇO */}
        <div className="space-y-4">
           <h4 className="text-black font-black text-sm uppercase tracking-widest italic flex items-center gap-2">
             <span className="text-xl">📋</span> Relatório de Serviço
           </h4>
           <textarea 
             value={report}
             onChange={(e) => setReport(e.target.value)}
             placeholder="Descreva o serviço realizado ou valide a conclusão técnica..."
             className="w-full h-32 bg-slate-50 border-4 border-black rounded-[2rem] p-6 text-black font-bold text-sm outline-none focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
           />
           <button className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 border-4 border-black rounded-2xl text-black font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
              <span className="text-xl">📸</span> Adicionar Foto de Evidência
           </button>
        </div>

        {/* 4. ACOMPANHAMENTO / GPS / TEMPOS */}
        <div className="space-y-4">
           <h4 className="text-black font-black text-sm uppercase tracking-widest italic flex items-center gap-2">
             <span className="text-xl">📍</span> Acompanhamento
           </h4>
           <button 
             onClick={handleGPS}
             className="w-full p-6 bg-white border-4 border-black rounded-[2rem] flex justify-between items-center group active:scale-[0.98] transition-all"
           >
              <span className="text-black font-black text-[11px] uppercase tracking-tight italic truncate pr-4">{order.address}</span>
              <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest group-hover:underline flex items-center gap-2">GPS <ICONS.ChevronRight /></span>
           </button>

           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setStartConfirmed(true)}
                className={`p-6 rounded-[2rem] border-4 border-black transition-all flex flex-col items-center gap-2 shadow-xl active:scale-95 ${startConfirmed ? 'bg-green-100' : 'bg-white'}`}
              >
                 <span className="text-slate-400 text-[8px] font-[900] uppercase tracking-widest italic">Início Serviço</span>
                 <span className="text-black font-black text-lg italic leading-none">{startConfirmed ? '14:32' : 'CONFIRMAR'}</span>
              </button>
              <button 
                onClick={() => setArrivalConfirmed(true)}
                className={`p-6 rounded-[2rem] border-4 border-black transition-all flex flex-col items-center gap-2 shadow-xl active:scale-95 ${arrivalConfirmed ? 'bg-blue-100' : 'bg-white'}`}
              >
                 <span className="text-slate-400 text-[8px] font-[900] uppercase tracking-widest italic">Chegada Local</span>
                 <span className="text-black font-black text-lg italic leading-none">{arrivalConfirmed ? '14:25' : 'CONFIRMAR'}</span>
              </button>
           </div>
        </div>

        {/* 5. VALOR, AJUSTES E CONFIRMAÇÃO */}
        <div className="bg-black text-white p-10 rounded-[3.5rem] space-y-6">
           <h4 className="text-[#FACC15] font-black text-sm uppercase tracking-[0.2em] italic mb-6">💶 Valores do Pedido</h4>
           
           <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                 <span>Base do Serviço:</span>
                 <span className="text-white">{order.basePrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                 <span>Taxas SOS / App:</span>
                 <span className="text-white">{(order.value - order.basePrice).toFixed(2)}€</span>
              </div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between items-end">
                 <span className="text-slate-300 font-black text-sm uppercase italic">Total Final a Pagar</span>
                 <span className="text-[#FACC15] font-black text-5xl italic leading-none">{finalValue.toFixed(2)}€</span>
              </div>
           </div>

           <div className="pt-8 flex items-start gap-4">
              <button 
                onClick={() => setIsValueConfirmed(!isValueConfirmed)}
                className={`w-10 h-10 shrink-0 border-4 rounded-xl flex items-center justify-center transition-all ${isValueConfirmed ? 'bg-[#FACC15] border-[#FACC15]' : 'border-white/20'}`}
              >
                 {isValueConfirmed && <span className="text-black font-black text-xl">✓</span>}
              </button>
              <p className="text-slate-400 text-[10px] font-bold uppercase italic leading-tight">
                Eu confirmo o valor final deste serviço conforme o relatório técnico apresentado.
              </p>
           </div>
        </div>

        {/* 6. FATURAÇÃO / DOWNLOAD FATURA */}
        <div className="space-y-4 pt-4 border-t-4 border-black/5">
           <h4 className="text-black font-black text-sm uppercase tracking-widest italic flex items-center gap-2">
             <span className="text-xl">🧾</span> Faturação
           </h4>
           <div className="bg-slate-50 border-2 border-black border-dashed p-6 rounded-3xl flex justify-between items-center">
              <div>
                 <span className="text-slate-400 text-[8px] font-black uppercase block mb-1">FATURA #FX-INV-001</span>
                 <span className="text-black font-black text-xs uppercase italic">Pendente de Fecho</span>
              </div>
              <button className="bg-white border-2 border-black px-4 py-2 rounded-xl text-slate-300 font-black text-[9px] uppercase tracking-widest cursor-not-allowed">
                 Download PDF
              </button>
           </div>
        </div>

        {/* 8. AÇÕES FINAIS */}
        <div className="pt-8 space-y-4">
           <button 
             onClick={handleFinalize}
             className={`w-full py-7 rounded-[2.5rem] border-b-8 border-r-8 border-black font-black text-xl uppercase tracking-[0.2em] transition-all shadow-2xl active:translate-y-1 active:border-b-4 ${isValueConfirmed ? 'bg-black text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300 shadow-none'}`}
           >
              Finalizar Serviço
           </button>
           
           <div className="flex gap-4">
              <button className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-red-600 active:scale-95 transition-all">
                Reportar Problema
              </button>
              <button className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-slate-400 active:scale-95 transition-all">
                Nova Visita
              </button>
           </div>
        </div>

      </div>

      <div className="text-center opacity-30 mt-10">
         <p className="text-black font-black text-[9px] uppercase tracking-[0.4em] italic">Stealth Protocol · Security First</p>
      </div>
    </div>
  );
};

export default OrderInProgressCard;
