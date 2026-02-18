import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomeHubScreen from './screens/HomeHubScreen';
import ProDashboardScreen from './screens/ProDashboardScreen';
import ServicesSearchScreen from './screens/ServicesSearchScreen';
import SosEnvironmentScreen from './screens/SosEnvironmentScreen';
import JobsEnvironmentScreen from './screens/JobsEnvironmentScreen';
import VerseEnvironmentScreen from './screens/VerseEnvironmentScreen';
import ProfileScreen from './screens/ProfileScreen';
import PedidosScreen from './screens/PedidosScreen';
import FeedScreen from './screens/FeedScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import FounderActivationScreen from './screens/FounderActivationScreen';
import MenuOSScreen from './screens/MenuOSScreen';
import NotificationCenterScreen from './screens/NotificationCenterScreen';
import LegalComplianceScreen from './screens/LegalComplianceScreen';
import LoginScreen from './screens/LoginScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import EnvironmentScreenShell from './components/Layout/EnvironmentScreenShell';
import { AppTab, AppView, ThemeMode, ProfileSubTab, AdminSubTab, Permission, ServiceRequest } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [clientView, setClientView] = React.useState<AppView>('HUB');
  const [themeMode, setThemeMode] = React.useState<ThemeMode>('DARK');
  const [initialOrderId, setInitialOrderId] = React.useState<string | undefined>();
  const [selectedOrderForCheckout, setSelectedOrderForCheckout] = React.useState<ServiceRequest | null>(null);
  const [initialProfileTab, setInitialProfileTab] = React.useState<ProfileSubTab>('ID');
  const [initialAdminTab, setInitialAdminTab] = React.useState<AdminSubTab>('PERFORMANCE');

  const ROLE_PERMISSIONS: Record<string, Permission[]> = {
    'CLIENT': [Permission.DASHBOARD_CLIENTE],
    'PRO': [Permission.DASHBOARD_PRO],
    'ADMIN_ARQUITETO': [Permission.USERS_MANAGE, Permission.INFRA_VIEW],
    'ADMIN_MARKETING': [Permission.USERS_MANAGE, Permission.CAMPAIGNS_MANAGE, Permission.UX_METRICS],
    'ADMIN_OPERACOES_FINANCAS': [Permission.FINANCE_VIEW, Permission.SOS_VIEW],
    'ADMIN_RECURSOS_HUMANOS': [Permission.USERS_MANAGE],
    'SUPER_ADMIN': Object.values(Permission)
  };

  const currentPermissions = user ? ROLE_PERMISSIONS[user.role] || [] : [];
  const hasPermission = (perm: Permission) => currentPermissions.includes(perm);

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#020617] flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#FF1F33] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 font-black text-white text-[10px] uppercase tracking-[0.4em] opacity-40 italic">Kernel Loading x247...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const navigateToTab = (tab: AppTab) => {
    setInitialOrderId(undefined);
    setInitialProfileTab('ID');
    setInitialAdminTab('PERFORMANCE');
    setSelectedOrderForCheckout(null);
    if (tab === AppTab.HOME) setClientView('HUB');
    if (tab === AppTab.PEDIDOS) setClientView('PEDIDOS');
    if (tab === AppTab.PERFIL) setClientView('PROFILE');
    if (tab === AppTab.FEED) setClientView('FEED');
    if (tab === AppTab.ADMIN) setClientView('ADMIN');
  };

  const toggleTheme = () => setThemeMode(prev => prev === 'DARK' ? 'LIGHT' : 'DARK');

  const handleOpenOrder = (id: string) => {
    setInitialOrderId(id);
    setClientView('PEDIDOS');
  };

  const handleStartCheckout = (order: ServiceRequest) => {
    setSelectedOrderForCheckout(order);
    setClientView('CHECKOUT');
  };

  const handleMenuNavigate = (view: AppView, subTab?: string) => {
    if (view === 'PROFILE' && subTab) setInitialProfileTab(subTab as ProfileSubTab);
    if (view === 'ADMIN' && subTab) setInitialAdminTab(subTab as AdminSubTab);
    setClientView(view);
  };

  const isAdminView = ['ADMIN_ARQUITETO', 'ADMIN_MARKETING', 'ADMIN_OPERACOES_FINANCAS', 'ADMIN_RECURSOS_HUMANOS', 'SUPER_ADMIN'].includes(user?.role || '');

  return (
    <EnvironmentScreenShell themeMode={themeMode}>
      {clientView === 'ACTIVATION' && (
        <FounderActivationScreen onComplete={() => handleMenuNavigate('ADMIN')} />
      )}

      {clientView === 'MENU_OS' && (
        <MenuOSScreen 
          userRole={user?.role as any} 
          themeMode={themeMode}
          onClose={() => setClientView('HUB')} 
          onNavigate={handleMenuNavigate}
          onToggleTheme={toggleTheme}
        />
      )}

      {clientView === 'NOTIFICATION_CENTER' && (
        <NotificationCenterScreen 
          themeMode={themeMode}
          onClose={() => setClientView('HUB')} 
          onNavigateToOrder={handleOpenOrder}
          onNavigateToSupport={(id) => handleMenuNavigate('PROFILE', 'SO')}
        />
      )}

      {clientView === 'CHECKOUT' && selectedOrderForCheckout && (
        <CheckoutScreen 
          themeMode={themeMode} 
          order={selectedOrderForCheckout} 
          onSuccess={() => setClientView('PEDIDOS')} 
          onCancel={() => setClientView('PEDIDOS')} 
        />
      )}

      {/* Main Execution Shell */}
      {hasPermission(Permission.DASHBOARD_PRO) && !['PROFILE', 'PEDIDOS', 'FEED', 'ADMIN', 'MENU_OS', 'NOTIFICATION_CENTER', 'LEGAL_COMPLIANCE', 'SERVICES_SEARCH', 'SOS', 'JOBS', 'VERSE', 'CHECKOUT'].includes(clientView) ? (
        <ProDashboardScreen themeMode={themeMode} onOpenMenu={() => setClientView('MENU_OS')} />
      ) : isAdminView && clientView === 'ADMIN' ? (
        <AdminDashboardScreen 
          userRole={user?.role as any} 
          themeMode={themeMode} 
          onNavigateToTab={navigateToTab} 
          onOpenMenu={() => setClientView('MENU_OS')} 
          initialTab={initialAdminTab}
        />
      ) : (
        <>
          {clientView === 'HUB' && (
            <HomeHubScreen 
              themeMode={themeMode}
              onNavigateToServices={() => setClientView('SERVICES_SEARCH')} 
              onNavigateToSos={() => setClientView('SOS')}
              onNavigateToJobs={() => setClientView('JOBS')}
              onNavigateToVerse={() => setClientView('VERSE')}
              onNavigateToTab={navigateToTab}
              onOpenMenu={() => setClientView('MENU_OS')}
              onOpenNotifications={() => setClientView('NOTIFICATION_CENTER')}
              onToggleTheme={toggleTheme}
            />
          )}
          {clientView === 'SERVICES_SEARCH' && (
            <ServicesSearchScreen 
              themeMode={themeMode}
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab} 
            />
          )}
          {clientView === 'SOS' && (
            <SosEnvironmentScreen 
              themeMode={themeMode}
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab} 
            />
          )}
          {clientView === 'JOBS' && (
            <JobsEnvironmentScreen 
              themeMode={themeMode}
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab} 
            />
          )}
          {clientView === 'VERSE' && (
            <VerseEnvironmentScreen 
              themeMode={themeMode}
              userRole={user?.role as any}
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab} 
            />
          )}
          {clientView === 'PROFILE' && (
            <ProfileScreen 
              themeMode={themeMode}
              userRole={isAdminView ? 'CLIENT' : (user?.role as any) || 'CLIENT'} 
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab}
              onOpenMenu={() => setClientView('MENU_OS')}
              onOpenNotifications={() => setClientView('NOTIFICATION_CENTER')}
              initialTab={initialProfileTab}
            />
          )}
          {clientView === 'PEDIDOS' && (
            <PedidosScreen 
              themeMode={themeMode}
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab} 
              onOpenMenu={() => setClientView('MENU_OS')} 
              onOpenNotifications={() => setClientView('NOTIFICATION_CENTER')}
              initialOrderId={initialOrderId}
              onPayOrder={handleStartCheckout}
            />
          )}
          {clientView === 'FEED' && (
            <FeedScreen 
              themeMode={themeMode}
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab} 
            />
          )}
          {clientView === 'LEGAL_COMPLIANCE' && (
            <LegalComplianceScreen 
              themeMode={themeMode}
              onBack={() => setClientView('HUB')} 
              onNavigateToTab={navigateToTab}
              onOpenMenu={() => setClientView('MENU_OS')}
              onOpenNotifications={() => setClientView('NOTIFICATION_CENTER')}
            />
          )}
        </>
      )}
    </EnvironmentScreenShell>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;