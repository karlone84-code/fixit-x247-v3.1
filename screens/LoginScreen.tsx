import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Usando a API Bridge centralizada
      const data = await api.login(email, password);
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação Kernel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#020617] flex flex-col items-center justify-center p-8 min-h-screen">
      <div className="w-full max-w-sm bg-white border-4 border-black p-10 rounded-[3rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-[#FF1F33] rounded-2xl flex items-center justify-center border-b-8 border-r-8 border-black mb-6">
            <span className="text-white font-black text-4xl italic">F</span>
          </div>
          <h2 className="text-black font-[900] text-3xl uppercase tracking-tighter italic leading-none text-center">Login X247</h2>
          <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.3em] mt-3">Kernel Authentication v3.1</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-black font-black text-[10px] uppercase tracking-widest ml-1">Protocolo Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@fixit.pt"
              className="w-full bg-slate-50 border-4 border-black p-5 rounded-2xl text-black font-bold outline-none focus:bg-white focus:border-[#FF1F33] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-black font-black text-[10px] uppercase tracking-widest ml-1">Chave de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border-4 border-black p-5 rounded-2xl text-black font-bold outline-none focus:bg-white focus:border-[#FF1F33] transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-500 p-4 rounded-xl">
              <p className="text-red-600 font-black text-[9px] uppercase tracking-tight text-center italic">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-6 rounded-[2rem] border-b-8 border-r-8 border-black font-[900] text-xl uppercase tracking-[0.2em] transition-all active:translate-y-1 active:border-b-4 shadow-xl ${isSubmitting ? 'bg-slate-200 text-slate-400' : 'bg-[#FF1F33] text-white'}`}
          >
            {isSubmitting ? 'Verificando...' : 'Entrar HQ'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t-2 border-slate-100 text-center">
           <button className="text-slate-400 font-black text-[9px] uppercase tracking-widest hover:text-black transition-colors">Esqueci-me da Chave</button>
           <div className="mt-2">
              <span className="text-slate-300 font-bold text-[9px] uppercase tracking-widest">Não tens conta? </span>
              <button className="text-[#FF1F33] font-black text-[9px] uppercase tracking-widest hover:underline">Regista-te</button>
           </div>
        </div>
      </div>
      
      <p className="mt-12 text-slate-800 font-black text-[10px] uppercase tracking-[0.5em] italic leading-none opacity-30">Fix.it OS x247 · Root Protocol</p>
    </div>
  );
};

export default LoginScreen;