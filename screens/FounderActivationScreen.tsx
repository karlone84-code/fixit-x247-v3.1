
import React, { useState } from 'react';

const FounderActivationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'CODE' | 'SETUP' | '2FA'>('CODE');
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleVerify = () => {
    if (code === '050184') {
      setStep('SETUP');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleNextSetup = () => {
    if (!formData.email || !formData.password) {
      alert("Credenciais de Founder são obrigatórias.");
      return;
    }
    setStep('2FA');
  };

  const handleFinish = () => {
    localStorage.setItem('X247_SUPER_ADMIN_ACTIVE', 'true');
    localStorage.setItem('X247_ADMIN_ACCOUNTS', JSON.stringify([{
      id: 'super-founder-hq-01',
      name: 'Super Founder HQ',
      email: formData.email,
      role: 'SUPER_ADMIN',
      secretSlug: 'hq-secure-founder-050184',
      permissions: ['ALL'],
      createdAt: new Date().toISOString(),
      is2FAActive: true
    }]));
    onComplete();
  };

  return (
    <div className="flex-1 bg-black flex flex-col items-center justify-center p-10 selection:bg-red-600 selection:text-white relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-transparent pointer-events-none"></div>
      
      <div className={`w-full max-w-sm bg-slate-900 border-8 border-black p-12 rounded-[5rem] shadow-[0_0_100px_rgba(255,31,51,0.25)] transition-all z-10 ${error ? 'translate-x-2 bg-red-950 border-red-600' : ''}`}>
         <div className="w-20 h-20 bg-[#FF1F33] rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border-b-8 border-r-8 border-black">
            <span className="text-white text-4xl font-black italic">F</span>
         </div>

         {step === 'CODE' && (
           <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center">
                 <h2 className="text-white font-[900] text-3xl uppercase tracking-tighter italic leading-none mb-2 italic">Stealth HQ Activation</h2>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic opacity-60">Founder Code Required</p>
              </div>
              
              <div className="space-y-4">
                 <input 
                   type="text" 
                   maxLength={6}
                   value={code}
                   onChange={e => setCode(e.target.value)}
                   placeholder="CODE"
                   className="w-full bg-black border-4 border-black p-6 rounded-2xl text-[#FACC15] font-black text-center text-3xl tracking-[0.4em] outline-none focus:border-[#FF1F33] transition-all shadow-inner"
                 />
                 <button 
                  onClick={handleVerify}
                  className="w-full py-6 bg-[#FF1F33] text-white rounded-[2rem] font-black text-xl uppercase tracking-widest border-b-8 border-r-8 border-black active:translate-y-1 active:border-b-4 transition-all shadow-xl"
                 >
                   Verify Root
                 </button>
              </div>
           </div>
         )}

         {step === 'SETUP' && (
           <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="text-center">
                 <h2 className="text-[#22C55E] font-[900] text-3xl uppercase tracking-tighter italic leading-none mb-2 italic">Identity Confirmed</h2>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic opacity-60 italic">Setup Stealth Account</p>
              </div>
              
              <div className="space-y-4">
                 <input 
                    type="email" 
                    placeholder="FOUNDER EMAIL"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                    className="w-full bg-black border-4 border-black p-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest outline-none focus:border-[#22C55E]" 
                 />
                 <input 
                    type="password" 
                    placeholder="SECRET PASSWORD"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({...prev, password: e.target.value}))}
                    className="w-full bg-black border-4 border-black p-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest outline-none focus:border-[#22C55E]" 
                 />
                 <button 
                  onClick={handleNextSetup}
                  className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl uppercase tracking-widest border-b-8 border-r-8 border-black active:translate-y-1 shadow-xl"
                 >
                   Secure Identity
                 </button>
              </div>
           </div>
         )}

         {step === '2FA' && (
           <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
              <div className="text-center">
                 <h2 className="text-white font-[900] text-3xl uppercase tracking-tighter italic leading-none mb-2 italic">2FA Initialization</h2>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic opacity-60">Stealth Multi-Factor</p>
              </div>
              
              <div className="flex justify-center gap-3">
                 {[1,2,3,4,5,6].map(i => <div key={i} className="w-10 h-14 bg-black border-2 border-slate-800 rounded-xl flex items-center justify-center font-black text-white text-xl animate-pulse">●</div>)}
              </div>

              <div className="bg-black/40 p-6 rounded-3xl border-2 border-white/5">
                 <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-relaxed text-center italic">
                    A porta <span className="text-white">"hq-secure-founder-050184"</span> será ativada permanentemente neste dispositivo.
                 </p>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full py-6 bg-[#22C55E] text-black rounded-[2rem] font-black text-xl uppercase tracking-widest border-b-8 border-r-8 border-black active:translate-y-1 shadow-2xl"
              >
                Launch Stealth OS
              </button>
           </div>
         )}
      </div>
      
      <p className="mt-12 text-slate-800 font-black text-[10px] uppercase tracking-[0.5em] italic leading-none opacity-30 italic z-10">Fix.it OS x247 · Root Protocol</p>
    </div>
  );
};

export default FounderActivationScreen;
