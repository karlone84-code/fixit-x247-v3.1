import React, { useState } from 'react';
import { ThemeMode, ServiceRequest } from '../types';
import { THEME, COLORS } from '../constants';
import { api } from '../services/api';
import { playNotificationSound } from '../utils/sound';

interface CheckoutScreenProps {
  themeMode: ThemeMode;
  order: ServiceRequest;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ themeMode, order, onSuccess, onCancel }) => {
  const currentTheme = THEME[themeMode];
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [step, setStep] = useState<'DETAILS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');

  const handlePay = async () => {
    setLoading(true);
    setStep('PROCESSING');
    
    try {
      // 1. Backend PaymentIntent (Simulação de chamada real via API Bridge)
      // No MVP, transformamos o valor em cêntimos (ex: 115.00 -> 11500)
      const amountCents = Math.round(order.value * 100);
      
      const response = await api._post('/payments/create-intent', { 
        amount: amountCents, 
        order_id: order.id 
      });

      console.log('[STRIPE KERNEL] Intent Created:', response.client_secret);

      // 2. Simular confirmação Stripe com latência de rede
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Sucesso
      playNotificationSound();
      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (e: any) {
      alert(`Erro no Pagamento: ${e.message}`);
      setStep('DETAILS');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'PROCESSING') {
    return (
      <div className="flex-1 bg-[#020617] flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 border-8 border-[#FACC15] border-t-transparent rounded-full animate-spin mb-10 shadow-[0_0_30px_#FACC15]"></div>
        <h2 className="text-white font-black text-3xl uppercase tracking-tighter italic">Processando Kernel...</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 opacity-40">Stripe Live Secure Gateway</p>
      </div>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <div className="flex-1 bg-[#22C55E] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
        <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-6xl shadow-2xl border-4 border-black mb-10">✓</div>
        <h2 className="text-black font-[900] text-5xl uppercase tracking-tighter italic leading-none mb-4">Pago HQ!</h2>
        <p className="text-black/60 font-black text-xs uppercase tracking-widest italic leading-relaxed">
          O valor está seguro em <span className="text-black">Escrow x247</span>.<br/>O serviço pode agora prosseguir.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 animate-in slide-in-from-bottom duration-500" style={{ backgroundColor: currentTheme.bg }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pt-4">
        <button onClick={onCancel} className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Cancelar</button>
        <h2 className="text-white font-[900] text-xl uppercase tracking-tighter italic leading-none" style={{ color: currentTheme.text }}>Checkout X247</h2>
        <div className="w-12"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Order Summary Card */}
        <div className="bg-slate-900 border-4 border-black rounded-[2.5rem] p-8 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
           <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest block mb-1 opacity-60">Serviço Selecionado</span>
                <h3 className="text-white font-black text-2xl uppercase tracking-tight italic">{order.title}</h3>
              </div>
              <span className="bg-[#FACC15] text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 border-black shadow-md">Stripe</span>
           </div>
           
           <div className="bg-black/40 rounded-2xl p-5 border border-white/5 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>ID Pedido:</span>
                <span className="text-white">{order.id}</span>
              </div>
              <div className="h-px bg-white/5 my-2"></div>
              <div className="flex justify-between items-end">
                <span className="text-slate-300 font-black text-xs uppercase italic">Total a Pagar</span>
                <span className="text-[#FACC15] font-black text-4xl italic leading-none">{order.value.toFixed(2)}€</span>
              </div>
           </div>
        </div>

        {/* Payment Form - Neo Brutalism */}
        <div className="space-y-6">
           <div className="flex flex-col gap-2">
              <label className="text-white font-black text-[10px] uppercase tracking-widest ml-1" style={{ color: currentTheme.text }}>Número do Cartão</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  maxLength={19}
                  placeholder="4242 4242 4242 4242"
                  className="w-full bg-slate-950 border-4 border-black p-5 rounded-2xl text-white font-bold outline-none focus:border-[#FACC15] transition-all shadow-inner"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">💳</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-white font-black text-[10px] uppercase tracking-widest ml-1" style={{ color: currentTheme.text }}>Expiração</label>
                <input 
                  type="text" 
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  className="w-full bg-slate-950 border-4 border-black p-5 rounded-2xl text-white font-bold outline-none focus:border-[#FACC15] transition-all shadow-inner"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white font-black text-[10px] uppercase tracking-widest ml-1" style={{ color: currentTheme.text }}>CVC</label>
                <input 
                  type="password" 
                  value={cvc}
                  onChange={e => setCvc(e.target.value)}
                  placeholder="•••"
                  maxLength={3}
                  className="w-full bg-slate-950 border-4 border-black p-5 rounded-2xl text-white font-bold outline-none focus:border-[#FACC15] transition-all shadow-inner"
                />
              </div>
           </div>

           <div className="pt-6">
              <div className="bg-blue-600/5 border-2 border-blue-600/20 p-5 rounded-3xl mb-8 flex items-start gap-4">
                 <span className="text-xl">🛡️</span>
                 <p className="text-slate-500 text-[9px] font-bold leading-relaxed uppercase italic">
                    Dados encriptados de ponta-a-ponta via Protocolo Stripe. A Fix.it x247 não armazena os seus dados bancários.
                 </p>
              </div>

              <button 
                onClick={handlePay}
                disabled={loading || cardNumber.length < 16}
                className={`w-full py-7 rounded-[2.5rem] border-b-8 border-r-8 border-black font-[900] text-2xl uppercase tracking-[0.2em] transition-all shadow-2xl active:translate-y-1 active:border-b-4 ${cardNumber.length < 16 ? 'bg-slate-800 text-slate-500 border-slate-950' : 'bg-[#FACC15] text-black hover:scale-[1.02]'}`}
              >
                Pagar Agora
              </button>
           </div>
        </div>
      </div>
      
      <p className="mt-auto text-center text-slate-800 font-black text-[9px] uppercase tracking-[0.4em] italic opacity-30">Secure Payment Engine v3.1</p>
    </div>
  );
};

export default CheckoutScreen;