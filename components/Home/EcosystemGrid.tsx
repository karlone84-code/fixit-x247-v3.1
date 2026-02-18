
import React from 'react';
import { COLORS, ICONS } from '../../constants';
import { EcosystemItem } from '../../types';

const ECOSYSTEM_ITEMS: EcosystemItem[] = [
  {
    id: 'sos',
    title: 'SOS',
    subtitle: 'Emergências 24H',
    bgColor: COLORS.SOS_RED,
    borderColor: COLORS.SOS_BORDER,
    accentColor: COLORS.SOS_SUB,
    icon: <ICONS.Shield />
  },
  {
    id: 'servicos',
    title: 'Serviços',
    subtitle: 'Profissionais',
    bgColor: COLORS.SUCCESS_GREEN,
    borderColor: COLORS.SUCCESS_BORDER,
    accentColor: COLORS.SUCCESS_SUB,
    icon: <ICONS.Wrench />
  },
  {
    id: 'emprego',
    title: 'Emprego+',
    subtitle: 'Bolsa Emprego',
    bgColor: COLORS.JOB_GRAY,
    borderColor: COLORS.JOB_BORDER,
    accentColor: '#F97316',
    icon: <ICONS.Briefcase />
  },
  {
    id: 'verse',
    title: 'Ux247Verse',
    subtitle: 'Estação Connexia',
    bgColor: COLORS.VERSE_BLUE,
    borderColor: COLORS.VERSE_BORDER,
    accentColor: COLORS.VERSE_SUB,
    icon: <ICONS.Globe />
  }
];

interface EcosystemGridProps {
  onNavigateToServices?: () => void;
  onNavigateToSos?: () => void;
  onNavigateToJobs?: () => void;
  onNavigateToVerse?: () => void;
}

const EcosystemGrid: React.FC<EcosystemGridProps> = ({ 
  onNavigateToServices, 
  onNavigateToSos,
  onNavigateToJobs,
  onNavigateToVerse
}) => {
  return (
    <div className="px-4 grid grid-cols-2 gap-4 pb-4">
      {ECOSYSTEM_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.id === 'servicos' && onNavigateToServices) {
              onNavigateToServices();
            } else if (item.id === 'sos' && onNavigateToSos) {
              onNavigateToSos();
            } else if (item.id === 'emprego' && onNavigateToJobs) {
              onNavigateToJobs();
            } else if (item.id === 'verse' && onNavigateToVerse) {
              onNavigateToVerse();
            }
          }}
          className="relative flex flex-col p-5 rounded-3xl text-left border-b-4 border-r-4 transition-transform active:scale-95 group overflow-hidden"
          style={{ 
            backgroundColor: item.bgColor, 
            borderColor: item.borderColor 
          }}
        >
          {/* Glass Overlay on Icon */}
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
            <span className="text-white scale-125">
              {item.icon}
            </span>
          </div>

          <h3 className="text-white font-[900] text-2xl leading-none mb-1 uppercase tracking-tight">{item.title}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: item.accentColor }}>{item.subtitle}</p>
          
          {/* Decoration */}
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-black/10 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
        </button>
      ))}
    </div>
  );
};

export default EcosystemGrid;
