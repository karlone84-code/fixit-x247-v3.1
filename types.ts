import React from 'react';

export enum AppTab {
  HOME = 'HOME',
  FEED = 'FEED',
  PEDIDOS = 'PEDIDOS',
  PERFIL = 'PERFIL',
  PRO_DASHBOARD = 'PRO_DASHBOARD',
  ADMIN = 'ADMIN'
}

export type ThemeMode = 'LIGHT' | 'DARK';

export type UserRole = 
  | 'CLIENT' 
  | 'PRO' 
  | 'ADMIN_ARQUITETO' 
  | 'ADMIN_MARKETING' 
  | 'ADMIN_OPERACOES_FINANCAS' 
  | 'ADMIN_RECURSOS_HUMANOS' 
  | 'SUPER_ADMIN';

export enum ClientPlan {
  CLIENT_FIX_FREE = 'CLIENT_FIX_FREE',
  CLIENT_FIX_PREMIUM = 'CLIENT_FIX_PREMIUM',
  BUSINESS_FIX_PREMIUM = 'BUSINESS_FIX_PREMIUM'
}

export enum ProPlan {
  FIX_PRO_FREE = 'FIX_PRO_FREE',
  FIX_PRO_PLUS = 'FIX_PRO_PLUS',
  FIX_PRO_ELITE = 'FIX_PRO_ELITE'
}

export enum Permission {
  USERS_MANAGE = 'USERS_MANAGE',
  INFRA_VIEW = 'INFRA_VIEW',
  CAMPAIGNS_MANAGE = 'CAMPAIGNS_MANAGE',
  UX_METRICS = 'UX_METRICS',
  FINANCE_VIEW = 'FINANCE_VIEW',
  SOS_VIEW = 'SOS_VIEW',
  DASHBOARD_PRO = 'DASHBOARD_PRO',
  DASHBOARD_CLIENTE = 'DASHBOARD_CLIENTE',
  SUPER_ACCESS = 'SUPER_ACCESS',
  LEGAL_MANAGE = 'LEGAL_MANAGE'
}

export type AppView = 
  | 'HUB' 
  | 'SERVICES_SEARCH' 
  | 'SOS' 
  | 'JOBS' 
  | 'VERSE' 
  | 'PROFILE' 
  | 'PEDIDOS' 
  | 'FEED' 
  | 'ADMIN' 
  | 'ACTIVATION' 
  | 'ADMIN_LOGIN' 
  | 'MENU_OS' 
  | 'NOTIFICATION_CENTER'
  | 'SETTINGS_NOTIFICATIONS'
  | 'SETTINGS_PRIVACY'
  | 'SETTINGS_LANGUAGE'
  | 'ORGANIZATIONS'
  | 'LEGAL_COMPLIANCE'
  | 'CHECKOUT';

export type ProfileSubTab = 'ID' | 'BANCO' | 'ATIVIDADE' | 'PRO' | 'SO';
export type AdminSubTab = 'PERFORMANCE' | 'KILLSWITCH' | 'DISPUTES' | 'BI' | 'SYSTEM' | 'SUPER' | 'ORGANIZATIONS' | 'LEGAL';

// UX247verse Types
export type UxTabId = 'videos' | 'hub' | 'social' | 'shop' | 'future';

export interface UxConfig {
  id: number;
  tenant_id: string;
  videos_enabled: boolean;
  hub_enabled: boolean;
  social_enabled: boolean;
  shop_enabled: boolean;
  future_enabled: boolean;
  videos_visibility: 'public' | 'admin';
  hub_visibility: 'public' | 'admin';
  social_visibility: 'public' | 'admin';
  shop_visibility: 'public' | 'admin';
  future_visibility: 'public' | 'admin';
  social_meta: {
    whatsapp_url: string;
    linkedin_url: string;
    youtube_url: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    x_url: string;
    telegram_url: string;
  };
  videos_meta?: {
    pitch_url: string;
    short_url: string;
    sos_url: string;
  };
  shop_meta?: {
    kit_url: string;
  };
  metadata: Record<string, any>;
}

export interface LegalDocument {
  id: string;
  type: LegalDocumentType;
  version: string;
  language: string;
  title: string;
  content: string;
  effectiveFrom: string;
  isActive: boolean;
}

export enum LegalDocumentType {
  TERMS_CLIENT = 'TERMS_CLIENT',
  TERMS_PRO = 'TERMS_PRO',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  BRIDGE_TERMS = 'BRIDGE_TERMS',
  FAQ_LEGAL = 'FAQ_LEGAL'
}

export type NotificationType = 'ORDER_STATUS' | 'PAYMENT' | 'SUPPORT' | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  metadata: Record<string, any>;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  orgId?: string;
  secretSlug: string; 
  permissions: Permission[];
  createdAt: string;
  is2FAActive: boolean;
  clientPlan?: ClientPlan;
  proPlan?: ProPlan;
}

export interface SentinelMetrics {
  apiLatency: number;
  paymentSuccessRate: number;
  activeSockets: number;
  sosAvgResponseTime: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface FinanceOverview {
  totalInEscrow: number;
  totalInDispute: number;
  netAppRevenue: number;
  totalPayoutsPending: number;
  pspCosts: number;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  module: string;
  before: string;
  after: string;
  timestamp: string;
}

export interface AdCard {
  id: string;
  partnerName: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  impressionLimit: number;
  currentImpressions: number;
  status: 'ACTIVE' | 'INACTIVE';
  order: number;
}

export interface FeedContentCard {
  id: string;
  type: 'MURAL' | 'DICA' | 'VIDEO' | 'CAMPANHA';
  title: string;
  description: string;
  mediaUrl: string;
  ctaUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  order: number;
  author: string;
}

export type EscrowStatus = 
  | 'EM_ESCROW' 
  | 'LIBERTADO_PRO' 
  | 'REEMBOLSO_ANALISE' 
  | 'BLOQUEADO_DISPUTA' 
  | 'CONCLUIDO_ACORDO';

export type RequestStatus = 
  | 'SOS_WAITING_CONFIRMATION'
  | 'AGENDADO'
  | 'A_CAMINHO'
  | 'NO_LOCAL' 
  | 'EM_EXECUCAO' 
  | 'RELATORIO_PENDENTE'
  | 'CONCLUIDO' 
  | 'CANCELADO'
  | 'EM_DISPUTA'
  | 'ARBITRAGEM'
  | 'AGUARDANDO_PAGAMENTO'
  | 'PAID'
  | 'ASSIGNED';

export interface ServiceRequest {
  id: string; 
  type: 'SOS' | 'PACK' | 'CUSTOM';
  title: string;
  categoryLabel?: string;
  status: RequestStatus;
  escrowStatus: EscrowStatus;
  date?: string;
  time?: string;
  duration?: string; 
  value: number;            
  basePrice: number;       
  appFee: number;
  proName?: string;
  clientName?: string;
  sosFee?: number;
  sosImmediateFee?: number;
  retainedValue?: number;
  address?: string;
  proIsOnline?: boolean;
  distanceKm?: number;
  gpsPreference?: string;
  marketPosition?: string;
  isCapped?: boolean;
  originType?: string;
  isDoubleBlindReviewed?: boolean;
}

export interface DisputeAdminData {
  id: string;
  orderId: string;
  clientName: string;
  proName: string;
  value: number;
  openedAt: string;
  status: 'PENDENTE' | 'NEGOCIACAO' | 'ARBITRAGEM' | 'RESOLVIDO';
  reason: string;
  clientEvidence: string[];
  proEvidence: string[];
  chatHistory: { role: 'CLIENT' | 'PRO' | 'SYSTEM'; text: string; time: string }[];
}

export interface KillswitchFlags {
  sosEnabled: boolean;
  bonitoEnabled: boolean;
  feedEnabled: boolean;
  paymentGatewayEnabled: boolean;
  proCatalogEnabled: boolean;
  jobsEnabled: boolean;
  verseEnabled: boolean;
  adsEnabled: boolean;
}

export interface AdminStats {
  activeSos: number;
  pendingPros: number;
  totalAppRevenue: number;
  dailyActiveUsers: number;
  systemHealth: number;
  cac: number;
  ltv: number;
  churnRate: number;
}

export interface ProCategoryPricing { 
  id: string; 
  areaName: string; 
  categoryName: string; 
  price: number; 
  marketAvg: number; 
  marketMax: number; 
  lockedUntil: string | null;
  lastPriceUpdateAt: string | null;
}

export interface ProOperationalSettings { 
  schedule: Record<string, { enabled: boolean; start: string; end: string }>; 
  sosEnabled: boolean; 
  sosPeriods: {
    daytime: { enabled: boolean; days: string[] };
    evening: { enabled: boolean; days: string[] };
    nightWeekend: { enabled: boolean; days: string[] };
  }; 
  bonitoEnabled: boolean; 
  bonitoPriceMargin: number; 
  bonitoRadiusKm: number;
  bonitoSchedule: { days: string[]; start: string; end: string }; 
  operationRadiusKm: number; 
  categoryPricing: ProCategoryPricing[]; 
  gpsPreference: 'GOOGLE_MAPS' | 'WAZE';
  secondVisitDefaultDays: number;
}

export interface UserMetrics {
  rating: number;
  completedTotal: number;
  sosCount: number;
  servicesCount: number;
  bonitoCount: number;
  jobsCount: number;
  xpPoints: number;
  level: string;
}

export interface WalletState {
  available: number;
  escrow: number;
  dispute: number;
  transactions: { id: string; type: 'IN' | 'OUT' | 'ESCROW' | 'REFUND'; value: number; date: string; label: string }[];
}

export enum SosState { CATEGORIA = 'CATEGORIA', FUNCAO = 'FUNCAO', DESCRICAO = 'DESCRICAO', PROCURAR = 'PROCURAR', SELECIONAR = 'SELECIONAR', SEM_PRO = 'SEM_PRO', PAGAMENTO = 'PAGAMENTO', MONITORIZACAO = 'MONITORIZACAO' }
export interface SosCategory { id: string; name: string; icon: string; }
export interface ProviderPublicCard { id: string; displayName: string; avatarUrl: string | null; indicativePrice: number; marketAvgPrice: number; appCommissionPercent: number; totalEstimatedPrice: number; languages: string[]; entityType: "INDIVIDUAL" | "COMPANY"; distanceKm: number | null; averageRating: number | null; totalReviews: number; canShowPlanBadge: boolean; planBadgeLabel?: string | null; proBudgetFee: number; sosFeeBase?: number; }
export interface AdSlide { id: string; title: string; image: string; }
export interface EcosystemItem { id: string; title: string; subtitle: string; bgColor: string; borderColor: string; accentColor: string; icon: React.ReactNode; }
export interface BonitoPack { id: string; title: string; areaId: string; categoryName: string; price: number; marketAvg: number; duration: string; image: string; }
export interface FeedPost { id: string; userHandle: string; platform: any; thumbnail: string; content: string; points: number; tags: string[]; }
export interface GamificationRule { id: string; action: string; points: number; icon: string; }
export interface LeaderboardEntry { rank: number; userHandle: string; points: number; level: string; }
export interface FixEvent { id: string; title: string; date: string; time: string; type: 'WORKSHOP' | 'LIVE' | 'CAMPANHA'; }
export interface SystemLog { id: string; level: any; module: string; message: string; timestamp: string; }
export interface ProApplication { id: string; name: string; area: string; appliedAt: string; status: any; }
export interface TaxaSOSRequest { serviceBaseValue: number; requestedAt: string; distanceKm: number; isImmediate: boolean; hasSecondVisit: boolean; }
export interface TaxaSOSResponse { taxaSOS: number; valorTotal: number; ganhoApp: number; colaboradorRecebe: number; breakdown: any; }
export interface ChatMessage { id: string; user: string; text: string; timestamp: string; }
export interface ProService { id: string; proId: string; areaId: string; categoryId: string; description: string; priceTotal: number; marketAvgPrice: number; marketMaxPrice: number; lastPriceChangeAt: string; lockedUntil: string; createdAt: string; isPublished: boolean; hasBudgetFee: boolean; budgetFeeAmount?: number; }
export interface ServiceArea { id: string; name: string; icon?: string; }
export interface ServiceCategory { id: string; areaId: string; name: string; }
export enum JobType { FULL_TIME = 'FULL_TIME', GIG = 'GIG', FORMATION = 'FORMATION' }
export interface JobOffer { id: string; orgId: string; title: string; companyName: string; type: JobType; location: string; salaryRange?: string; description: string; requirements: string[]; createdAt: string; }