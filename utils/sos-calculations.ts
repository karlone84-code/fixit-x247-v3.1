
import { TaxaSOSRequest, TaxaSOSResponse } from '../types';
import { TAXONOMY_AREAS, TAXONOMY_CATEGORIES } from '../constants';

/**
 * Canonical SOS Pricing Service logic (Modelo B).
 */
export const calculateTaxaSOS = (request: TaxaSOSRequest): TaxaSOSResponse => {
  const { serviceBaseValue, requestedAt, distanceKm, isImmediate, hasSecondVisit } = request;
  
  const date = new Date(requestedAt);
  const hour = date.getHours();
  
  // 1. Base Periodo (Modelo B: 30/40/50 EUR conforme horário/dia)
  let basePeriodo = 30.00; 
  if (hour >= 18 && hour < 22) {
    basePeriodo = 40.00; // Tarde/Noite inicial
  } else if (hour >= 22 || hour <= 8) {
    basePeriodo = 50.00; // Madrugada
  }

  // 2. Acréscimo Imediato: +20 EUR (Canon v3.1)
  const acrescimoImediato = isImmediate ? 20.00 : 0.00;

  // 3. Acréscimo Distância: 0.5 * max(0, distanceKm - 15)
  const acrescimoDistancia = 0.5 * Math.max(0, distanceKm - 15);

  // 4. Segunda Visita: Valor Fixo (ex: 25.00)
  const acrescimoSegundaVisita = hasSecondVisit ? 25.00 : 0.00;

  // Total Taxa SOS (Inclui Imediato se aplicável)
  const taxaSOS = basePeriodo + acrescimoImediato + acrescimoDistancia + acrescimoSegundaVisita;
  
  // Valor Total Cliente (Serviço + Taxa SOS)
  const valorTotal = serviceBaseValue + taxaSOS;
  
  // Comissão App Fixa: 15% do valor total
  const ganhoApp = valorTotal * 0.15;
  
  // O que o Colaborador (PRO) recebe efetivamente
  const colaboradorRecebe = valorTotal - ganhoApp;

  return {
    taxaSOS,
    valorTotal,
    ganhoApp,
    colaboradorRecebe,
    breakdown: {
      basePeriodo,
      acrescimoImediato,
      acrescimoDistancia,
      acrescimoSegundaVisita
    }
  };
};

/**
 * Regra de Negócio: Preço Total deve ser competitivo.
 * price_total <= 0.9 * market_max_price
 */
export const checkPriceCompliance = (price: number, marketMax: number) => {
  const isCompliant = price <= (0.9 * marketMax);
  const maxAllowed = 0.9 * marketMax;
  return { isCompliant, maxAllowed };
};

/**
 * Regra de Negócio: Bloqueio de alteração de preço (14 dias).
 */
export const canUpdatePrice = (lockedUntil: string): { allowed: boolean; daysLeft: number } => {
  const lockDate = new Date(lockedUntil).getTime();
  const now = new Date().getTime();
  const allowed = now >= lockDate;
  const daysLeft = Math.ceil((lockDate - now) / (1000 * 60 * 60 * 24));
  return { allowed, daysLeft: allowed ? 0 : daysLeft };
};

/**
 * Get taxonomy names for display.
 */
export const getTaxonomyLabel = (areaId: string, categoryId: string) => {
  const area = TAXONOMY_AREAS.find(a => a.id === areaId);
  const category = TAXONOMY_CATEGORIES.find(c => c.id === categoryId);
  return {
    area: area?.name || areaId,
    category: category?.name || categoryId
  };
};

/**
 * Regra de Negócio: Encaminhamento SOS vs SERVIÇOS+.
 */
export const getServiceRoute = (requestedAt: string, isImmediate: boolean): 'SOS' | 'STANDARD' => {
  if (isImmediate) return 'SOS';
  const now = new Date().getTime();
  const requested = new Date(requestedAt).getTime();
  const diffHours = (requested - now) / (1000 * 60 * 60);
  return diffHours < 48 ? 'SOS' : 'STANDARD';
};
