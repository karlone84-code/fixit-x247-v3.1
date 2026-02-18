
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../constants';

const FlashOfferCard: React.FC = () => {
  const [seconds, setSeconds] = useState(4985); // 1:23:05 in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="px-4 pb-20">
      <div className="bg-[#020617] p-5 rounded-3xl border-2 border-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.15)] relative overflow-hidden group">
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400/80">Oferta x247 · Serviço Bonito</span>
          </div>
          
          <div className="flex flex-col">
            <h4 className="text-white font-black text-2xl uppercase tracking-tighter">Bonito – 2h</h4>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-[#FACC15] rounded-full border border-black/10">
                <span className="text-slate-900 font-black text-sm tracking-widest">{formatTime(seconds)}</span>
                <span className="w-px h-3 bg-slate-900/20"></span>
                <button className="text-slate-900 font-black text-[10px] uppercase hover:underline">Reservar Agora</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 opacity-40 group-hover:animate-shine" />
      </div>
      
      <div className="mt-8 mb-10 text-center">
        <a href="#" className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] hover:text-white/40 transition-colors">Legal & Reclamações</a>
      </div>
    </div>
  );
};

export default FlashOfferCard;
