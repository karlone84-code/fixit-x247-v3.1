import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../../constants';
import { api } from '../../services/api';
import { playNotificationSound } from '../../utils/sound';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AssistantMascot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Olá! Sou o Flix. Como posso ajudar no seu Bonito Serviço hoje?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userText = inputValue;
    const currentHistory = [...messages];
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Chamada real ao Kernel Backend proxy
      const data = await api.chatWithFlix(userText, currentHistory, 'GENERAL');
      
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      
      // Som de Resposta IA
      playNotificationSound('message');

      // Se foi escalonado (Disputa/Grave), disparar som de SOS
      if (data.escalated) {
        setTimeout(() => playNotificationSound('sos'), 600);
      }

    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "O Kernel IA está em manutenção. Contacte o suporte: 937 321 338. Bonito Serviço." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-28 right-4 z-[200] flex flex-col items-end">
        {!isChatOpen && (
          <div className="mb-2 bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-white/10 shadow-2xl animate-bounce-subtle pointer-events-none">
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Flix Live 🤖</span>
          </div>
        )}
        
        <button 
          onClick={() => {
            if (!isChatOpen) playNotificationSound('message');
            setIsChatOpen(!isChatOpen);
          }}
          className={`relative w-16 h-16 rounded-full border-4 border-black shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all hover:scale-110 active:scale-95 flex items-center justify-center overflow-hidden group ${isChatOpen ? 'rotate-90' : ''}`} 
          style={{ backgroundColor: COLORS.MASCOT_GREEN }}
        >
          {isChatOpen ? (
            <span className="text-white text-3xl font-black">×</span>
          ) : (
            <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center gap-1.5 overflow-hidden shadow-inner">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse delay-75"></div>
              </div>
              <div className="w-5 h-1.5 bg-slate-900 rounded-full"></div>
            </div>
          )}
        </button>
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-[190] bg-[#020617]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute bottom-48 right-4 left-4 max-h-[65vh] bg-slate-900 border-4 border-black rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-20 duration-500">
            <div className="p-6 bg-slate-800 border-b-4 border-black flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-green-500 flex items-center justify-center text-xl shadow-lg border-2 border-black">🤖</div>
                  <div>
                     <h4 className="text-white font-[900] text-sm uppercase tracking-widest leading-none">Flix AI Kernel</h4>
                     <span className="text-green-500 text-[8px] font-black uppercase tracking-widest mt-1.5 block italic">v3.1 Connected</span>
                  </div>
               </div>
               <div className="bg-black/40 px-3 py-1 rounded-full flex items-center gap-2 border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-slate-500 text-[8px] font-black uppercase">Live</span>
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar min-h-[300px] bg-slate-950/20 shadow-inner">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] text-[12px] font-bold leading-relaxed shadow-xl ${
                      m.role === 'user' 
                        ? 'bg-[#FF1F33] text-white rounded-tr-none border-b-8 border-r-8 border-black' 
                        : 'bg-slate-800 text-white/90 border-4 border-black rounded-tl-none'
                    }`}>
                       {m.text}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-slate-800/60 border-4 border-black px-5 py-3 rounded-[1.8rem] rounded-tl-none flex gap-1.5">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></div>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-5 bg-slate-900 border-t-4 border-black flex gap-3">
               <input 
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Escreva ao Flix..."
                 className="flex-1 bg-black border-4 border-black rounded-2xl px-6 py-4 text-xs text-white font-bold outline-none focus:border-[#FF1F33] transition-all placeholder:text-slate-700"
               />
               <button 
                 onClick={handleSend} 
                 disabled={isTyping}
                 className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-black shadow-lg border-b-8 border-r-8 border-black active:translate-y-1 active:border-b-4 transition-all"
               >
                 →
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantMascot;