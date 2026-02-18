
import React, { useState, useEffect } from 'react';

const EnvironmentBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-slate-950/90 py-1.5 px-4 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 tracking-wide uppercase">
        <span className="opacity-50">🕒 {formattedTime}</span>
        <span className="w-px h-3 bg-white/10"></span>
        <span>Almada PT · EUR</span>
      </div>
      
      <div className="flex items-center gap-2 bg-slate-900 px-2 py-0.5 rounded-full border border-white/5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Online 24/7</span>
      </div>
    </div>
  );
};

export default EnvironmentBar;
