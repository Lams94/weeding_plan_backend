import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import useStore from './store/useStore';
import AgencyDashboard from './components/AgencyDashboard.jsx';
import AccessDebugBar from './components/AccessDebugBar.jsx';
import AccessDenied from './components/AccessDenied.jsx';

import CanvaEditorLinenPureEdition from './pages/CanvaEditorLinenPureEdition.jsx';
import CosystMePrestatairesSuiviAdmin from './pages/CosystMePrestatairesSuiviAdmin.jsx';
import CrmInvitSCerclesPrivS from './pages/CrmInvitSCerclesPrivS.jsx';
import CrmInvitSLinenPure from './pages/CrmInvitSLinenPure.jsx';
import DesignHubLinenPureEdition from './pages/DesignHubLinenPureEdition.jsx';
import GestionDesTablesMappingSpatial from './pages/GestionDesTablesMappingSpatial.jsx';
import HubInvitLinenPure from './pages/HubInvitLinenPure.jsx';
import HubInvitVotreExpRiencePrestige from './pages/HubInvitVotreExpRiencePrestige.jsx';
import MessagerieBackstageCoordinationLive from './pages/MessagerieBackstageCoordinationLive.jsx';
import MessagerieBackstageLinenPure from './pages/MessagerieBackstageLinenPure.jsx';
import ModeCortGeGpsSuiviEnDirect from './pages/ModeCortGeGpsSuiviEnDirect.jsx';
import ModeCortGeMobileDriverView from './pages/ModeCortGeMobileDriverView.jsx';
import ModifierLItinRaireModeCortGe from './pages/ModifierLItinRaireModeCortGe.jsx';
import PlanDeSalleDTaillPrestigeEdition from './pages/PlanDeSalleDTaillPrestigeEdition.jsx';
import PlanDeSalleLinenPure from './pages/PlanDeSalleLinenPure.jsx';
import PrestatairesLinenPure from './pages/PrestatairesLinenPure.jsx';
import RCapitulatifDesVHiculesModeCortGe from './pages/RCapitulatifDesVHiculesModeCortGe.jsx';
import TableauDeBordCockpit from './pages/TableauDeBordCockpit.jsx';
import TableauDeBordLinenPure from './pages/TableauDeBordLinenPure.jsx';
import MusicStudioLinenPure from './pages/MusicStudioLinenPure.jsx';
import ScannerEntree from './pages/ScannerEntree.jsx';
import OnboardingWedding from './pages/OnboardingWedding.jsx';
import BudgetSuivi from './pages/BudgetSuivi.jsx';
import TodoPlanning from './pages/TodoPlanning.jsx';
import PrivateThoughts from './pages/PrivateThoughts.jsx';
import VendorPortal from './pages/VendorPortal.jsx';
import GuestCalendar from './pages/GuestCalendar.jsx';
import AccessSettings from './pages/AccessSettings.jsx';
import { canAccessRoute, visibleNavigation, roleLabels } from './lib/accessControl';

function GuardedRoute({ path, children }) {
  const activeWedding = useStore(state => state.activeWedding);
  const currentAccessRole = useStore(state => state.currentAccessRole);
  return canAccessRoute(currentAccessRole, path, activeWedding || {}) ? children : <AccessDenied />;
}

export default function App() {
  const toast = useStore(state => state.toast);
  const isMenuOpen = useStore(state => state.isMenuOpen);
  const closeMenu = useStore(state => state.closeMenu);
  const activeTheme = useStore(state => state.activeTheme);
  const activeWedding = useStore(state => state.activeWedding);
  const setActiveWedding = useStore(state => state.setActiveWedding);
  const currentAccessRole = useStore(state => state.currentAccessRole);
  const navSections = visibleNavigation(currentAccessRole, activeWedding || {});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    document.body.className = activeTheme;
  }, [activeTheme]);

  return (
    <BrowserRouter>
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[120]" onClick={closeMenu}></div>
          <nav className="fixed top-0 left-0 bottom-0 w-72 bg-surface border-r border-outline-variant z-[130] flex flex-col animate-[fade-in-right_0.3s_ease-out]">
            <div className="h-20 flex items-center justify-between px-6 border-b border-outline-variant/50">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface truncate max-w-[180px]">
                  {activeWedding ? activeWedding.name : 'Menu'}
                </span>
                {activeWedding && (
                  <button onClick={() => { setActiveWedding(null); closeMenu(); }} className="text-xs text-secondary hover:text-primary text-left transition-colors flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[12px]">swap_horiz</span> Changer de projet
                  </button>
                )}
              </div>
              <button onClick={closeMenu} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <div className="px-2 mb-5">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Rôle actif</p>
                <p className="text-sm text-on-surface">{roleLabels[currentAccessRole] || currentAccessRole}</p>
              </div>
              {navSections.map(section => (
                <div key={section.title} className="mb-6">
                  <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary pl-2 mb-3">{section.title}</p>
                  {section.items.map(item => (
                    <Link key={item.to} to={item.to} onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-primary">{item.icon}</span> {item.label}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="mt-8 border-t border-outline-variant/30 pt-6">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary pl-2 mb-4">Design System</p>
                <div className="grid grid-cols-2 gap-2 px-2">
                  <button onClick={() => useStore.getState().setTheme('theme-linen-pure')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-linen-pure' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Linen Pure</button>
                  <button onClick={() => useStore.getState().setTheme('theme-editorialist')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-editorialist' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Editorialist</button>
                  <button onClick={() => useStore.getState().setTheme('theme-syky')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-syky' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>SYKY</button>
                  <button onClick={() => useStore.getState().setTheme('theme-boho-canvas')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-boho-canvas' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Boho</button>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}

      {useStore(state => state.isLoading) && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[400] overflow-hidden bg-primary/10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-[loading-slide_1.5s_infinite_linear] bg-[length:200%_100%]"></div>
        </div>
      )}

      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-error text-on-error py-2 px-4 z-[300] flex justify-center items-center gap-2 animate-[slide-down_0.3s_ease-out]">
          <span className="material-symbols-outlined text-[18px]">wifi_off</span>
          <p className="font-label-sm uppercase tracking-widest text-xs">Mode hors-ligne actif - synchronisation au retour de la connexion</p>
        </div>
      )}

      {!activeWedding && <AgencyDashboard />}
      {activeWedding && <AccessDebugBar />}
      {activeWedding && !activeWedding.onboardingComplete && <OnboardingWedding />}

      {activeWedding?.onboardingComplete && (
        <div className="mt-8">
          <Routes>
            <Route path="/" element={<GuardedRoute path="/"><TableauDeBordCockpit /></GuardedRoute>} />
            <Route path="/planning" element={<GuardedRoute path="/planning"><TodoPlanning /></GuardedRoute>} />
            <Route path="/dash-linen" element={<TableauDeBordLinenPure />} />
            <Route path="/crm" element={<GuardedRoute path="/crm"><CrmInvitSLinenPure /></GuardedRoute>} />
            <Route path="/crm-circles" element={<CrmInvitSCerclesPrivS />} />
            <Route path="/hub-invit" element={<HubInvitLinenPure />} />
            <Route path="/hub-invit-prestige" element={<GuardedRoute path="/hub-invit-prestige"><HubInvitVotreExpRiencePrestige /></GuardedRoute>} />
            <Route path="/guest-calendar" element={<GuardedRoute path="/guest-calendar"><GuestCalendar /></GuardedRoute>} />
            <Route path="/prestataires" element={<GuardedRoute path="/prestataires"><PrestatairesLinenPure /></GuardedRoute>} />
            <Route path="/prestataires-suivi" element={<CosystMePrestatairesSuiviAdmin />} />
            <Route path="/budget" element={<GuardedRoute path="/budget"><BudgetSuivi /></GuardedRoute>} />
            <Route path="/vendor-portal" element={<GuardedRoute path="/vendor-portal"><VendorPortal /></GuardedRoute>} />
            <Route path="/salle" element={<GuardedRoute path="/salle"><PlanDeSalleLinenPure /></GuardedRoute>} />
            <Route path="/salle-detail" element={<PlanDeSalleDTaillPrestigeEdition />} />
            <Route path="/tables" element={<GuardedRoute path="/tables"><GestionDesTablesMappingSpatial /></GuardedRoute>} />
            <Route path="/chat" element={<GuardedRoute path="/chat"><MessagerieBackstageLinenPure /></GuardedRoute>} />
            <Route path="/chat-live" element={<GuardedRoute path="/chat-live"><MessagerieBackstageCoordinationLive /></GuardedRoute>} />
            <Route path="/private-thoughts" element={<GuardedRoute path="/private-thoughts"><PrivateThoughts /></GuardedRoute>} />
            <Route path="/access" element={<GuardedRoute path="/access"><AccessSettings /></GuardedRoute>} />
            <Route path="/canva" element={<GuardedRoute path="/canva"><CanvaEditorLinenPureEdition /></GuardedRoute>} />
            <Route path="/design" element={<DesignHubLinenPureEdition />} />
            <Route path="/music" element={<GuardedRoute path="/music"><MusicStudioLinenPure /></GuardedRoute>} />
            <Route path="/cortege" element={<GuardedRoute path="/cortege"><ModeCortGeGpsSuiviEnDirect /></GuardedRoute>} />
            <Route path="/cortege-mobile" element={<ModeCortGeMobileDriverView />} />
            <Route path="/cortege-edit" element={<ModifierLItinRaireModeCortGe />} />
            <Route path="/cortege-vehicules" element={<RCapitulatifDesVHiculesModeCortGe />} />
            <Route path="/scanner" element={<GuardedRoute path="/scanner"><ScannerEntree /></GuardedRoute>} />
          </Routes>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 md:bottom-12 right-1/2 translate-x-1/2 md:translate-x-0 md:right-12 z-[100] bg-surface-container-highest text-on-surface border border-outline-variant shadow-xl px-6 py-4 rounded-sm flex items-center gap-3 animate-[fade-in-up_0.3s_ease-out]">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-body-md text-body-md font-medium">{toast.message}</span>
        </div>
      )}
    </BrowserRouter>
  );
}
