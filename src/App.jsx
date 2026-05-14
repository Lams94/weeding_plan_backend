import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import useStore from './store/useStore';
import AgencyDashboard from './components/AgencyDashboard.jsx';

// Import all generated pages
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

export default function App() {
  const toast = useStore(state => state.toast);
  const isMenuOpen = useStore(state => state.isMenuOpen);
  const closeMenu = useStore(state => state.closeMenu);
  const fetchData = useStore(state => state.fetchData);
  const activeTheme = useStore(state => state.activeTheme);
  const activeWedding = useStore(state => state.activeWedding);
  const setActiveWedding = useStore(state => state.setActiveWedding);
  
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

  // Note: fetchData est désormais appelé par setActiveWedding lorsqu'un projet est choisi.

  // Appliquer le thème dynamiquement sur le body
  useEffect(() => {
    document.body.className = activeTheme;
  }, [activeTheme]);

  return (
    <BrowserRouter>
      {/* Navigation Drawer (Sidebar) */}
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
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary pl-2 mb-4 mt-2">Planners Hub</p>
              <Link to="/" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-primary">dashboard</span> Dashboard Cockpit</Link>
              <Link to="/planning" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-primary">checklist</span> Todo & Planning</Link>
              <Link to="/crm" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-primary">group</span> Guest Hub (CRM)</Link>
              <Link to="/tables" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-primary">chair</span> Floorplan</Link>
              <Link to="/prestataires" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-primary">handshake</span> Prestataires</Link>
              <Link to="/budget" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-primary">payments</span> Budget & Paiements</Link>
              <Link to="/chat" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-primary">forum</span> Backstage Live</Link>
              
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary pl-2 mb-4 mt-8">Guests Experience</p>
              <Link to="/hub-invit-prestige" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-tertiary">diamond</span> Espace Invité Prestige</Link>
              <Link to="/cortege" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-tertiary">directions_car</span> Cortège GPS</Link>
              <Link to="/scanner" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-tertiary">qr_code_scanner</span> Scanner QR (Accueil)</Link>
              
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary pl-2 mb-4 mt-8">Design Studio</p>
              <Link to="/canva" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-[#584324]">palette</span> Canva Editor</Link>
              <Link to="/music" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"><span className="material-symbols-outlined text-[#584324]">queue_music</span> Music Studio</Link>

              <div className="mt-8 border-t border-outline-variant/30 pt-6">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary pl-2 mb-4">Design System (Theme)</p>
                <div className="grid grid-cols-2 gap-2 px-2">
                  <button onClick={() => useStore.getState().setTheme('theme-linen-pure')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-linen-pure' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Linen Pure</button>
                  <button onClick={() => useStore.getState().setTheme('theme-editorialist')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-editorialist' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Editorialist</button>
                  <button onClick={() => useStore.getState().setTheme('theme-syky')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-syky' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>SYKY (Tech)</button>
                  <button onClick={() => useStore.getState().setTheme('theme-boho-canvas')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-boho-canvas' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Boho Canvas</button>
                  <button onClick={() => useStore.getState().setTheme('theme-velvet-night')} className={`p-2 rounded-md text-xs font-medium border transition-colors ${activeTheme === 'theme-velvet-night' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}>Velvet Night</button>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
      
      {/* Barre de Chargement Globale (Top Progress) */}
      {useStore(state => state.isLoading) && (
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[400] overflow-hidden bg-primary/10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-[loading-slide_1.5s_infinite_linear] bg-[length:200%_100%]"></div>
        </div>
      )}

      {/* Bannière Hors-Ligne */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-error text-on-error py-2 px-4 z-[300] flex justify-center items-center gap-2 animate-[slide-down_0.3s_ease-out]">
          <span className="material-symbols-outlined text-[18px]">wifi_off</span>
          <p className="font-label-sm uppercase tracking-widest text-xs">Mode Hors-Ligne Activé - Les données seront synchronisées au retour de la connexion</p>
        </div>
      )}

      {/* Dashboard Agence Multi-Projets (Obligatoire) */}
      {!activeWedding && <AgencyDashboard />}
      
      {activeWedding && !activeWedding.onboardingComplete && <OnboardingWedding />}

      {activeWedding?.onboardingComplete && (
      <div className="mt-8">
        <Routes>
          {/* Main Dashboards */}
          <Route path="/" element={<TableauDeBordCockpit />} />
          <Route path="/planning" element={<TodoPlanning />} />
          <Route path="/dash-linen" element={<TableauDeBordLinenPure />} />
          
          {/* CRM & Guests */}
          <Route path="/crm" element={<CrmInvitSLinenPure />} />
          <Route path="/crm-circles" element={<CrmInvitSCerclesPrivS />} />
          <Route path="/hub-invit" element={<HubInvitLinenPure />} />
          <Route path="/hub-invit-prestige" element={<HubInvitVotreExpRiencePrestige />} />
          
          {/* Vendors */}
          <Route path="/prestataires" element={<PrestatairesLinenPure />} />
          <Route path="/prestataires-suivi" element={<CosystMePrestatairesSuiviAdmin />} />
          <Route path="/budget" element={<BudgetSuivi />} />
          
          {/* Floorplan & Tables */}
          <Route path="/salle" element={<PlanDeSalleLinenPure />} />
          <Route path="/salle-detail" element={<PlanDeSalleDTaillPrestigeEdition />} />
          <Route path="/tables" element={<GestionDesTablesMappingSpatial />} />
          
          {/* Backstage / Communication */}
          <Route path="/chat" element={<MessagerieBackstageLinenPure />} />
          <Route path="/chat-live" element={<MessagerieBackstageCoordinationLive />} />
          
          {/* Design & Editing */}
          <Route path="/canva" element={<CanvaEditorLinenPureEdition />} />
          <Route path="/design" element={<DesignHubLinenPureEdition />} />
          <Route path="/music" element={<MusicStudioLinenPure />} />
          
          {/* Cortège (Convoy / Logistics) */}
          <Route path="/cortege" element={<ModeCortGeGpsSuiviEnDirect />} />
          <Route path="/cortege-mobile" element={<ModeCortGeMobileDriverView />} />
          <Route path="/cortege-edit" element={<ModifierLItinRaireModeCortGe />} />
          <Route path="/cortege-vehicules" element={<RCapitulatifDesVHiculesModeCortGe />} />
          
          {/* Outils Terrain */}
          <Route path="/scanner" element={<ScannerEntree />} />
        </Routes>
      </div>
      )}
      
      {/* Toast Notification Globale */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-12 right-1/2 translate-x-1/2 md:translate-x-0 md:right-12 z-[100] bg-surface-container-highest text-on-surface border border-outline-variant shadow-xl px-6 py-4 rounded-sm flex items-center gap-3 animate-[fade-in-up_0.3s_ease-out]">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-body-md text-body-md font-medium">{toast.message}</span>
        </div>
      )}
      
    </BrowserRouter>
  );
}
