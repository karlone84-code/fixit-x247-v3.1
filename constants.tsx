
import React from 'react';
import { 
  ServiceArea, 
  ServiceCategory, 
  SosCategory, 
  BonitoPack, 
  FeedPost, 
  GamificationRule, 
  LeaderboardEntry, 
  FixEvent,
  SystemLog,
  ProApplication,
  ThemeMode
} from './types';

// Fix: Added missing canonical color properties for grid UI support
export const COLORS = {
  PRIMARY_RED: '#FF1F33',
  SOS_RED: '#FF1F33',
  SOS_BORDER: '#7F0F1A',
  SOS_SUB: '#FFA1AB',
  
  SUCCESS_GREEN: '#166534',
  SUCCESS_LIGHT: '#16A34A',
  SUCCESS_BORDER: '#0D3D1F',
  SUCCESS_SUB: '#4ADE80',
  
  JOB_GRAY: '#6B7280',
  JOB_ACCENT: '#F97316',
  JOB_BORDER: '#374151',
  
  VERSE_BLUE: '#2563EB', 
  VERSE_BORDER: '#0B1F66',
  VERSE_SUB: '#93C5FD',
  
  FLASH_YELLOW: '#FACC15',
  MASCOT_GREEN: '#22C55E'
};

export const THEME = {
  DARK: {
    bg: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    border: '#374151',
    dock: 'rgba(15, 23, 42, 0.95)',
    input: '#020617',
    glass: 'rgba(255, 31, 51, 0.95)', // Red Glass Canonical
    accent: COLORS.FLASH_YELLOW,
    primary: COLORS.PRIMARY_RED
  },
  LIGHT: {
    bg: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    dock: 'rgba(255, 255, 255, 0.95)',
    input: '#FFFFFF',
    glass: 'rgba(255, 31, 51, 0.85)', // Red Glass Canonical
    accent: COLORS.FLASH_YELLOW,
    primary: COLORS.PRIMARY_RED
  }
};

export const SUPPORT_CONTACTS = {
  EMAIL: 'bonitoserviço@gmail.com',
  WHATSAPP: '+351 937 321 338',
  WHATSAPP_LINK: 'https://wa.me/351937321338',
  MBWAY: '937 321 338'
};

export const SOS_CATEGORIES: SosCategory[] = [
  { id: 'sos_agua', name: 'Canalização', icon: '🚰' },
  { id: 'sos_luz', name: 'Eletricidade', icon: '⚡' },
  { id: 'sos_chaves', name: 'Chaves / Portas', icon: '🔑' },
  { id: 'sos_gas', name: 'Gás / Fogo', icon: '🔥' },
  { id: 'sos_vidros', name: 'Vidros / Janelas', icon: '🪟' }
];

export const SOS_FUNCTIONS: Record<string, string[]> = {
  sos_agua: ['Rotura de Cano', 'Inundação Ativa', 'Entupimento Grave', 'Fuga em Esquentador', 'Outro...'],
  sos_luz: ['Curto-Circuito', 'Quadro Disparado', 'Falta de Luz Parcial', 'Cheiro a Queimado', 'Outro...'],
  sos_chaves: ['Porta Trancada', 'Chave Partida', 'Assalto / Fechadura Danificada', 'Portão Bloqueado', 'Outro...'],
  sos_gas: ['Cheiro a Gás', 'Fuga em Tubagem', 'Avaria em Placa / Forno', 'Outro...'],
  sos_vidros: ['Montra Partida', 'Vidro de Janela Partido', 'Claraboia Danificada', 'Outro...']
};

export const TAXONOMY_AREAS: ServiceArea[] = [
  { id: 'canalizador', name: 'Canalizador' },
  { id: 'eletricista', name: 'Eletricista' },
  { id: 'carpinteiro', name: 'Carpinteiro' },
  { id: 'limpezas', name: 'Limpezas' }
];

export const TAXONOMY_CATEGORIES: ServiceCategory[] = [
  { id: 'c_roturas', areaId: 'canalizador', name: 'Roturas e fugas' },
  { id: 'c_entupimentos', areaId: 'canalizador', name: 'Entupimentos e desobstruções' },
  { id: 'c_loicas', areaId: 'canalizador', name: 'Instalações de loiças sanitárias' },
  { id: 'c_torneiras', areaId: 'canalizador', name: 'Instalações de torneiras e misturadoras' },
  { id: 'c_esquentadores', areaId: 'canalizador', name: 'Instalações de esquentadores e caldeiras' },
  { id: 'c_revisoes', areaId: 'canalizador', name: 'Revisões e manutenção preventiva' },
  { id: 'c_ajustes', areaId: 'canalizador', name: 'Deslocações e pequenos ajustes' },
  { id: 'e_avarias', areaId: 'eletricista', name: 'Avarias e falhas elétricas' },
  { id: 'e_quadros', areaId: 'eletricista', name: 'Quadros elétricos e disjinders' },
  { id: 'e_tomadas', areaId: 'eletricista', name: 'Instalação de tomadas e interruptores' },
  { id: 'e_iluminacao', areaId: 'eletricista', name: 'Iluminação interior e exterior' },
  { id: 'e_eletrodomesticos', areaId: 'eletricista', name: 'Instalação de eletrodomésticos' },
  { id: 'e_certificacoes', areaId: 'eletricista', name: 'Certificações e inspeções simples' },
  { id: 'e_revisoes', areaId: 'eletricista', name: 'Revisões e manutenção preventiva' },
  { id: 'carp_portas', areaId: 'carpinteiro', name: 'Reparação de portas e janelas' },
  { id: 'carp_moveis', areaId: 'carpinteiro', name: 'Montagem de móveis' },
  { id: 'carp_roupeiros', areaId: 'carpinteiro', name: 'Roupeiros e arrumação' },
  { id: 'carp_pavimentos', areaId: 'carpinteiro', name: 'Pavimentos em madeira' },
  { id: 'carp_cozinhas', areaId: 'carpinteiro', name: 'Cozinhas e bancadas' },
  { id: 'carp_arranjos', areaId: 'carpinteiro', name: 'Pequenos arranjos de carpintaria' },
  { id: 'l_pontual', areaId: 'limpezas', name: 'Limpeza doméstica pontual' },
  { id: 'l_recorrente', areaId: 'limpezas', name: 'Limpeza doméstica recorrente' },
  { id: 'l_pos_obra', areaId: 'limpezas', name: 'Limpeza pós-obra' },
  { id: 'l_vidros', areaId: 'limpezas', name: 'Limpeza de vidros e montras' },
  { id: 'l_escritorios', areaId: 'limpezas', name: 'Limpeza de escritórios' },
  { id: 'l_profunda', areaId: 'limpezas', name: 'Limpeza profunda/cozinha e WC' }
];

export const BONITO_PACKS: BonitoPack[] = [
  {
    id: 'pack_elec_rev',
    title: 'Revisão Elétrica Segura',
    areaId: 'eletricista',
    categoryName: 'Eletricidade',
    price: 39.90,
    marketAvg: 55.00,
    duration: '2h',
    image: 'https://picsum.photos/seed/elecrev/600/400'
  },
  {
    id: 'pack_plumb_check',
    title: 'Check-up Canalização',
    areaId: 'canalizador',
    categoryName: 'Canalização',
    price: 34.90,
    marketAvg: 48.00,
    duration: '2h',
    image: 'https://picsum.photos/seed/plumb/600/400'
  },
  {
    id: 'pack_clean_deep',
    title: 'Limpeza Express WC/Cozinha',
    areaId: 'limpezas',
    categoryName: 'Limpezas',
    price: 29.90,
    marketAvg: 45.00,
    duration: '2h',
    image: 'https://picsum.photos/seed/cleaning/600/400'
  }
];

export const MOCK_FEED: FeedPost[] = [
  {
    id: 'fp1',
    userHandle: '@tiago_pro',
    platform: 'INSTAGRAM',
    thumbnail: 'https://picsum.photos/seed/feed1/400/400',
    content: 'Hoje o Bonito Serviço em Almada foi impecável! ⚡️🔧',
    points: 150,
    tags: ['#Fixitx247', '#BonitoServico']
  },
  {
    id: 'fp2',
    userHandle: '@catia_fix',
    platform: 'TIKTOK',
    thumbnail: 'https://picsum.photos/seed/feed2/400/400',
    content: 'Como chamei um SOS em 2 minutos! Inacreditável. 🚨',
    points: 300,
    tags: ['#SOS247', '#Fixit']
  }
];

export const GAMIFICATION_RULES: GamificationRule[] = [
  { id: 'gr1', action: 'Partilhar no Instagram', points: 150, icon: '📸' },
  { id: 'gr2', action: 'Completar 5 SOS', points: 500, icon: '🚨' },
  { id: 'gr3', action: 'Review 5 Estrelas', points: 100, icon: '⭐' },
  { id: 'gr4', action: 'Indicar Amigo PRO', points: 300, icon: '🤝' }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userHandle: '@mario_eletro', points: 12450, level: 'Mestre x247' },
  { rank: 2, userHandle: '@sofia_clean', points: 9820, level: 'Especialista' },
  { rank: 3, userHandle: '@tiago_pro', points: 8540, level: 'Pro Ativo' }
];

export const MOCK_EVENTS: FixEvent[] = [
  { id: 'ev1', title: 'Workshop: Domótica 101', date: '15 Out', time: '18:30', type: 'WORKSHOP' },
  { id: 'ev2', title: 'Live Q&A: Novos Planos', date: '18 Out', time: '21:00', type: 'LIVE' },
  { id: 'ev3', title: 'Campanha: Outubro Rosa', date: '25 Out', time: '10:00', type: 'CAMPANHA' }
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'l1', level: 'CRITICAL', module: 'WALLET_ESCROW', message: 'Falha na liberação de fundos Pedido #912', timestamp: 'Agora' },
  { id: 'l2', level: 'WARNING', module: 'SOS_RADAR', message: 'Alta latência em geolocalização Pro #881', timestamp: 'Há 5m' },
  { id: 'l3', level: 'INFO', module: 'SENTINEL', message: 'Varredura de segurança concluída. 0 ameaças.', timestamp: 'Há 12m' }
];

export const MOCK_PRO_APPLICATIONS: ProApplication[] = [
  { id: 'a1', name: 'Mário Estrela', area: 'Eletricidade', appliedAt: 'Hoje, 10:20', status: 'PENDING' },
  { id: 'a2', name: 'Sofia Mendes', area: 'Limpezas', appliedAt: 'Ontem, 16:45', status: 'PENDING' }
];

export const ICONS = {
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  ),
  Wrench: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  ),
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  )
};
