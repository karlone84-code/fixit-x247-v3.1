
import React, { useState, useEffect } from 'react';
import { AdSlide } from '../../types';

const MOCK_ADS: AdSlide[] = [
  { id: '1', title: 'Câmara Municipal de Almada', image: 'https://picsum.photos/seed/almada/1200/600' },
  { id: '2', title: 'Farmácia Central 24H', image: 'https://picsum.photos/seed/farmacia/1200/600' },
  { id: '3', title: 'Beira Mar FC - Bilhetes', image: 'https://picsum.photos/seed/beiramar/1200/600' },
  { id: '4', title: 'CHEERS Bar - Live Music', image: 'https://picsum.photos/seed/cheers/1200/600' },
];

const AdsCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % MOCK_ADS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 py-4">
      <div className="relative h-48 w-full overflow-hidden rounded-[2.5rem] bg-slate-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {MOCK_ADS.map((ad, idx) => (
          <div
            key={ad.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover grayscale-[0.2] brightness-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/60 mb-1">Publicidade</span>
              <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-none italic">{ad.title}</h3>
            </div>
          </div>
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-6 right-8 flex gap-1.5">
          {MOCK_ADS.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdsCarousel;
