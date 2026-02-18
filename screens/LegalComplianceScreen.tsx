
import React, { useState } from 'react';
import HomeHeader from '../components/Home/HomeHeader';
import EnvironmentBar from '../components/Home/EnvironmentBar';
import BottomDock from '../components/Home/BottomDock';
import AssistantMascot from '../components/Home/AssistantMascot';
import { AppTab, ThemeMode, LegalDocument, LegalDocumentType } from '../types';
import { THEME } from '../constants';

const MOCK_LEGAL_DOCS: LegalDocument[] = [
  {
    id: 'ld1',
    type: LegalDocumentType.TERMS_CLIENT,
    version: '1.2',
    language: 'pt-PT',
    title: 'Termos & Condições - Cliente',
    content: `
# Termos de Utilização para Clientes

Bem-vindo à Fix.it x247. Ao utilizar a nossa aplicação, concorda com os seguintes termos:

## 1. Papel da Plataforma
A Fix.it x247 atua exclusivamente como um marketplace intermediário. Não executamos diretamente serviços técnicos, mas facilitamos a ligação entre Clientes e Profissionais (Pros).

## 2. Responsabilidades
O Cliente compromete-se a fornecer informações precisas e a garantir condições de segurança para a realização do serviço.

## 3. Pagamentos e Escrow
Todos os pagamentos devem ser efetuados através da aplicação. O valor é retido em Escrow e libertado ao Pro após a confirmação da conclusão ou resolução de disputas.

## 4. Política de Disputas
Qualquer problema deve ser reportado via canal de Suporte num prazo de 48h após a data do serviço.
    `,
    effectiveFrom: '2026-01-01',
    isActive: true
  },
  {
    id: 'ld2',
    type: LegalDocumentType.PRIVACY_POLICY,
    version: '1.1',
    language: 'pt-PT',
    title: 'Política de Privacidade (RGPD)',
    content: `
# Política de Privacidade Fix.it x247

A sua privacidade é a nossa prioridade absoluta.

## 1. Dados Recolhidos
Recolhemos dados de identificação, localização e histórico de transações para garantir o funcionamento do Ecossistema X247.

## 2. Retenção de Dados
Em conformidade com as obrigações legais, logs de transações e conversas de suporte são retidos por um período de 5 anos.

## 3. Direitos do Titular
Pode solicitar a exportação ou eliminação dos seus dados em Perfil -> Sistema -> Privacidade.
    `,
    effectiveFrom: '2026-01-01',
    isActive: true
  },
  {
    id: 'ld3',
    type: LegalDocumentType.BRIDGE_TERMS,
    version: '1.0',
    language: 'pt-PT',
    title: 'Termos de Parceiros Bridge',
    content: `
# Protocolo Bridge Manual

O modelo Bridge é utilizado quando um profissional externo ao catálogo nativo é mobilizado para o seu serviço.

## 1. Natureza do Serviço
Os Parceiros Bridge são prestadores independentes verificados manualmente pela equipa Fix.it.

## 2. Faturação
A faturação é de responsabilidade exclusiva do parceiro, sendo a Fix.it o intermediário de cobrança.
    `,
    effectiveFrom: '2026-01-01',
    isActive: true
  },
  {
    id: 'ld4',
    type: LegalDocumentType.FAQ_LEGAL,
    version: '1.0',
    language: 'pt-PT',
    title: 'FAQ Legal & Operacional',
    content: `
# Perguntas Frequentes

### Quem me fatura?
A fatura é emitida pelo profissional ou empresa que executa o serviço. A Fix.it emite fatura da taxa de serviço.

### O que acontece se o Pro não aparecer?
O valor retido em Escrow é devolvido integralmente ou o radar é reativado sem custos adicionais.
    `,
    effectiveFrom: '2026-01-01',
    isActive: true
  }
];

interface LegalComplianceScreenProps {
  themeMode: ThemeMode;
  onBack: () => void;
  onNavigateToTab: (tab: AppTab) => void;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
}

const LegalComplianceScreen: React.FC<LegalComplianceScreenProps> = ({ 
  themeMode, 
  onBack, 
  onNavigateToTab, 
  onOpenMenu, 
  onOpenNotifications 
}) => {
  const currentTheme = THEME[themeMode];
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
      <HomeHeader themeMode={themeMode} onOpenMenu={onOpenMenu} onOpenNotifications={onOpenNotifications} />
      <EnvironmentBar />

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-44">
        {!selectedDoc ? (
          <div className="animate-in fade-in slide-in-from-right duration-500">
            <div className="mt-4 mb-10">
               <h2 className="font-[900] text-4xl uppercase tracking-tighter italic leading-none mb-1" style={{ color: currentTheme.text }}>Legal & Compliance</h2>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic opacity-60">Transparência e Regras v3.1</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {MOCK_LEGAL_DOCS.map(doc => (
                 <button 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-slate-900 border-4 border-black p-8 rounded-[3rem] flex flex-col text-left shadow-2xl transition-all active:scale-[0.98] group hover:border-[#FACC15]"
                 >
                    <div className="flex justify-between items-start mb-4">
                       <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">v{doc.version}</span>
                       <span className="text-[#FACC15] opacity-20 group-hover:opacity-100 transition-opacity">→</span>
                    </div>
                    <h3 className="text-white font-black text-xl uppercase italic leading-tight">{doc.title}</h3>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-4 italic">Válido desde: {doc.effectiveFrom}</p>
                 </button>
               ))}
            </div>

            <div className="mt-12 bg-blue-600/5 border-2 border-blue-600/20 p-8 rounded-[3rem] flex items-start gap-4">
               <span className="text-2xl">🛡️</span>
               <div className="flex flex-col">
                  <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest italic mb-1">Proteção RGPD</span>
                  <p className="text-slate-500 text-[10px] font-bold leading-relaxed uppercase italic">
                    Todas as interações na app e conversas de suporte são auditáveis e retidas por <span className="text-white">5 anos</span> conforme o protocolo X247.
                  </p>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom duration-500">
             <button onClick={() => setSelectedDoc(null)} className="text-[#FACC15] text-[10px] font-black uppercase tracking-widest mb-10 italic flex items-center gap-2">← Voltar à Lista</button>
             
             <div className="bg-slate-900 border-4 border-black rounded-[4rem] overflow-hidden shadow-2xl flex flex-col">
                <div className="p-10 border-b-4 border-black bg-black/40 flex justify-between items-end">
                   <div>
                      <h3 className="text-white font-[900] text-3xl uppercase italic leading-none">{selectedDoc.title}</h3>
                      <p className="text-slate-600 text-[9px] font-black uppercase mt-3 tracking-widest">Versão {selectedDoc.version} · Almada HQ</p>
                   </div>
                   <div className="bg-[#22C55E] px-4 py-1.5 rounded-full border-2 border-black">
                      <span className="text-black font-black text-[8px] uppercase tracking-widest">Ativo</span>
                   </div>
                </div>
                
                <div className="p-10 prose prose-invert max-w-none prose-sm">
                   <div className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedDoc.content}
                   </div>
                </div>

                <div className="p-10 bg-black/20 border-t border-white/5">
                   <p className="text-slate-500 text-[9px] font-bold uppercase italic text-center leading-relaxed">
                     Este documento é propriedade intelectual da Fix.it x247 e pode ser atualizado a qualquer momento. Os utilizadores serão notificados via Notification Center em caso de alterações estruturais.
                   </p>
                </div>
             </div>
          </div>
        )}
      </div>

      <AssistantMascot />
      <BottomDock activeTab={AppTab.PERFIL} onTabChange={onNavigateToTab} themeMode={themeMode} />
    </div>
  );
};

export default LegalComplianceScreen;
