
import React, { useState } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { JobOffer, JobType, AppTab, ThemeMode } from '../types';
import { COLORS, THEME } from '../constants';

const MOCK_JOBS: JobOffer[] = [
  {
    id: 'j1',
    orgId: 'org_almada',
    title: 'Técnico de Manutenção Sénior',
    companyName: 'Câmara Municipal de Almada',
    type: JobType.FULL_TIME,
    location: 'Almada, PT',
    salaryRange: '1.200€ - 1.500€',
    description: 'Responsável pela manutenção preventiva e corretiva de infraestruturas municipais. Foco em sistemas hídricos e elétricos.',
    requirements: ['Certificação Técnica Nível IV', 'Carta de Condução', 'Disponibilidade para turnos'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'j2',
    orgId: 'org_tech',
    title: 'Eletricista de Redes GIG',
    companyName: 'Volt Solutions',
    type: JobType.GIG,
    location: 'Remoto / Lisboa',
    salaryRange: '45€/hora',
    description: 'Instalação pontual de painéis solares em projetos residenciais de larga escala.',
    requirements: ['Experiência comprovada em fotovoltaicos', 'Seguro de acidentes de trabalho ativo'],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'j3',
    orgId: 'org_form',
    title: 'Certificação Avançada Pintura',
    companyName: 'Fix.it Academy',
    type: JobType.FORMATION,
    location: 'Online',
    salaryRange: 'Grátis (Plano PRO)',
    description: 'Curso intensivo de 20h sobre novas técnicas de pintura hidrófuga e acabamentos premium.',
    requirements: ['Ser utilizador Fix.it PRO verificado'],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

interface JobsEnvironmentScreenProps {
  themeMode: ThemeMode;
  onBack: () => void;
  onNavigateToTab: (tab: AppTab) => void;
}

const JobsEnvironmentScreen: React.FC<JobsEnvironmentScreenProps> = ({ themeMode, onBack, onNavigateToTab }) => {
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'MY_APPS'>('OFFERS');
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const currentTheme = THEME[themeMode];

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
      <HomeHeader themeMode={themeMode} />
      <EnvironmentBar />

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
        {/* Navigation / Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => selectedJob ? setSelectedJob(null) : onBack()}
            className="text-[#F97316] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1 active:scale-95 transition-transform"
          >
            ← {selectedJob ? 'Ver Ofertas' : 'Hub Principal'}
          </button>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#6B7280]"></div>
             <span className="font-black text-[9px] uppercase tracking-widest italic" style={{ color: currentTheme.textSecondary }}>Emprego+ Bolsa</span>
          </div>
        </div>

        {/* List View */}
        {!selectedJob && (
          <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="font-black text-3xl uppercase tracking-tighter italic leading-none mb-2" style={{ color: currentTheme.text }}>Bolsa Emprego</h2>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-8 italic">Oportunidades e Formação X247</p>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-900/50 p-1.5 rounded-full border border-white/5" style={{ backgroundColor: themeMode === 'LIGHT' ? '#E5E7EB' : 'rgba(15, 23, 42, 0.5)', borderColor: currentTheme.border }}>
              <button 
                onClick={() => setActiveTab('OFFERS')}
                className={`flex-1 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'OFFERS' ? 'bg-[#6B7280] text-white shadow-lg' : 'text-slate-500'}`}
              >
                Ofertas
              </button>
              <button 
                onClick={() => setActiveTab('MY_APPS')}
                className={`flex-1 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'MY_APPS' ? 'bg-[#6B7280] text-white shadow-lg' : 'text-slate-500'}`}
              >
                Minhas Candidaturas
              </button>
            </div>

            {activeTab === 'OFFERS' ? (
              <div className="space-y-4">
                {MOCK_JOBS.map(job => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-6 text-left shadow-xl hover:border-[#F97316] transition-all group active:scale-[0.98]"
                    style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-[#F97316] text-[8px] font-black uppercase tracking-widest mb-1">{job.type}</span>
                        <h4 className="font-black text-lg uppercase tracking-tight group-hover:text-[#F97316] transition-colors" style={{ color: currentTheme.text }}>{job.title}</h4>
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{job.companyName}</span>
                      </div>
                      <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/10" style={{ borderColor: currentTheme.border }}>
                        <span className="font-black text-[8px] uppercase" style={{ color: currentTheme.textSecondary }}>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold italic" style={{ color: currentTheme.textSecondary }}>{job.salaryRange || 'A combinar'}</span>
                       <span className="text-[#F97316] font-black text-sm">Candidatar →</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center opacity-30 flex flex-col items-center">
                <span className="text-5xl mb-4">📂</span>
                <p className="font-black text-xs uppercase tracking-widest" style={{ color: currentTheme.text }}>Ainda não tem candidaturas ativas</p>
              </div>
            )}
          </div>
        )}

        {/* Detail View */}
        {selectedJob && (
          <div className="animate-in fade-in slide-in-from-bottom duration-300 pb-20">
            <div className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden mb-8" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
               <div className="mb-8">
                 <span className="bg-[#F97316] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block">{selectedJob.type}</span>
                 <h2 className="font-black text-3xl uppercase tracking-tighter italic leading-none mb-2" style={{ color: currentTheme.text }}>{selectedJob.title}</h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">{selectedJob.companyName}</p>
               </div>

               <div className="space-y-8">
                  <div>
                    <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Descrição da Oferta</h4>
                    <p className="font-medium text-sm leading-relaxed opacity-80" style={{ color: currentTheme.text }}>{selectedJob.description}</p>
                  </div>

                  <div>
                    <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Requisitos</h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></div>
                          <span className="text-xs font-bold uppercase tracking-tight" style={{ color: currentTheme.textSecondary }}>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5 grid grid-cols-2 gap-4" style={{ backgroundColor: themeMode === 'LIGHT' ? '#F3F4F6' : 'rgba(0,0,0,0.4)', borderColor: currentTheme.border }}>
                    <div>
                      <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Remuneração</span>
                      <span className="font-black text-sm" style={{ color: currentTheme.text }}>{selectedJob.salaryRange || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Localização</span>
                      <span className="font-black text-sm" style={{ color: currentTheme.text }}>{selectedJob.location}</span>
                    </div>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => {
                setHasApplied(true);
                setTimeout(() => { setSelectedJob(null); setHasApplied(false); }, 1500);
              }}
              disabled={hasApplied}
              className={`w-full py-6 rounded-[2.5rem] border-b-8 border-r-8 border-black font-[900] text-xl uppercase tracking-[0.2em] transition-all active:translate-y-1 active:border-b-4 shadow-2xl ${hasApplied ? 'bg-green-600 text-white border-green-900' : 'bg-[#F97316] text-white'}`}
            >
              {hasApplied ? '✓ Candidatura Enviada' : 'Candidatar-me Já'}
            </button>
            <p className="text-slate-600 text-[9px] font-bold text-center mt-6 uppercase tracking-widest italic opacity-40">
              O seu perfil verificado X247 será enviado à organização.
            </p>
          </div>
        )}
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.HOME} onTabChange={onNavigateToTab} themeMode={themeMode} />
    </div>
  );
};

export default JobsEnvironmentScreen;
