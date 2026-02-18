
import React from 'react';
import { ProService } from '../../types';
import { checkPriceCompliance, canUpdatePrice, getTaxonomyLabel } from '../../utils/sos-calculations';

interface ProServiceCardProps {
  service: ProService;
  onEdit?: () => void;
}

// FIX: Destructured onEdit from props to allow its use in the onClick handler
const ProServiceCard: React.FC<ProServiceCardProps> = ({ service, onEdit }) => {
  const { isCompliant, maxAllowed } = checkPriceCompliance(service.priceTotal, service.marketMaxPrice);
  const { allowed: isChangeAllowed, daysLeft } = canUpdatePrice(service.lockedUntil);
  const marketPosition = (service.priceTotal / service.marketMaxPrice) * 100;
  const { area, category } = getTaxonomyLabel(service.areaId, service.categoryId);

  return (
    <div className="bg-slate-900 border-2 border-slate-800 rounded-[28px] p-6 mb-5 shadow-2xl relative overflow-hidden transition-all hover:border-slate-700">
      {/* Taxonomy Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
              {area} / {category}
            </span>
            {!service.isPublished && (
              <span className="bg-slate-800 text-slate-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Rascunho</span>
            )}
          </div>
          <h4 className="text-white font-black text-xl uppercase tracking-tighter leading-tight">
            {service.description.length > 40 ? `${service.description.substring(0, 40)}...` : service.description}
          </h4>
        </div>
        
        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${isCompliant ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
          {isCompliant ? 'Competitivo' : 'Teto Excedido'}
        </div>
      </div>

      {/* Pricing Comparison Bar */}
      <div className="bg-black/20 rounded-2xl p-4 mb-4 border border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Posicionamento</span>
          <span className="text-sm font-black text-white">{service.priceTotal.toFixed(2)}€</span>
        </div>
        
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden relative border border-white/5">
          {/* Market Avg Marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white/20 z-10"
            style={{ left: `${(service.marketAvgPrice / service.marketMaxPrice) * 100}%` }}
          />
          {/* 90% Limit Marker */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-red-500/40 z-10"
            style={{ left: '90%' }}
          />
          {/* Progress fill */}
          <div 
            className={`h-full transition-all duration-700 ${isCompliant ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(marketPosition, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold text-slate-600 uppercase">Média</span>
            <span className="text-[9px] font-black text-slate-400">{service.marketAvgPrice.toFixed(2)}€</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-bold text-slate-600 uppercase">Máx (90%)</span>
            <span className="text-[9px] font-black text-slate-400">{maxAllowed.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Budget Fee Status */}
      <div className="flex items-center gap-2 mb-5 px-1">
        <div className={`w-1.5 h-1.5 rounded-full ${service.hasBudgetFee ? 'bg-yellow-500' : 'bg-slate-700'}`} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {service.hasBudgetFee ? `Custo Orçamento: ${service.budgetFeeAmount?.toFixed(2)}€` : 'Orçamento Grátis'}
        </span>
      </div>

      {/* Action Area & Price Lock */}
      <div className="flex flex-col gap-2">
        <button 
          disabled={!isChangeAllowed}
          onClick={onEdit}
          className={`w-full py-3 rounded-xl border-b-4 border-r-4 border-black font-[900] text-[10px] uppercase tracking-widest transition-all active:scale-[0.98] active:translate-y-0.5 active:border-b-0 ${
            isChangeAllowed 
              ? 'bg-white text-slate-900 shadow-lg' 
              : 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed opacity-50'
          }`}
        >
          {isChangeAllowed ? 'Editar Serviço' : `Preço Bloqueado (${daysLeft}d)`}
        </button>
        
        {!isChangeAllowed && (
          <p className="text-[7px] font-bold text-slate-600 uppercase text-center tracking-tighter">
            Bloqueado por 14 dias após última alteração de preço.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProServiceCard;
