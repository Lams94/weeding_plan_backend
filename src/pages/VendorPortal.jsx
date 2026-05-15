import React from 'react';
import useStore from '../store/useStore';
import TopAppBar from '../components/TopAppBar.jsx';
import BottomNavBar from '../components/BottomNavBar.jsx';

export default function VendorPortal() {
  const role = useStore(state => state.currentAccessRole);
  const activeWedding = useStore(state => state.activeWedding);
  const vendors = useStore(state => state.vendors);
  const agendaItems = useStore(state => state.agendaItems);
  const selectedVendor = vendors.find(vendor => vendor.accessEnabled) || vendors[0];
  const isDj = String(selectedVendor?.role || '').toLowerCase().includes('dj');
  const vendorTasks = agendaItems.filter(item => !item.vendorRole || !selectedVendor || item.vendorRole === selectedVendor.role || item.audience === 'vendor');

  return (
    <>
      <TopAppBar title="Portail prestataire" role={role} />
      <main className="min-h-screen bg-background px-4 md:px-12 pt-28 pb-28">
        <div className="max-w-6xl mx-auto space-y-6">
          <section className="bg-surface border border-outline-variant rounded-xl p-6">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Accès mission</p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">{selectedVendor?.name || 'Prestataire non sélectionné'}</h1>
            <p className="text-on-surface-variant">{selectedVendor?.role || 'Ajoutez un prestataire depuis la vue Prestataires pour activer son accès dédié.'}</p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="bg-surface border border-outline-variant rounded-xl p-6">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Informations utiles</h2>
              <div className="space-y-3 text-sm text-on-surface-variant">
                <p><span className="font-semibold text-on-surface">Adresse:</span> {activeWedding?.venueAddress || 'A renseigner dans onboarding'}</p>
                <p><span className="font-semibold text-on-surface">Ouverture lieu:</span> {activeWedding?.venueAccessTime || 'Non défini'}</p>
                <p><span className="font-semibold text-on-surface">Présence:</span> {selectedVendor?.arrivalTime || 'A confirmer'}</p>
                <p><span className="font-semibold text-on-surface">Zone:</span> {selectedVendor?.locationNotes || 'Selon briefing terrain'}</p>
              </div>
            </section>

            <section className="bg-surface border border-outline-variant rounded-xl p-6">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Canaux autorisés</h2>
              <div className="space-y-2 text-sm">
                <p className={selectedVendor?.canMessagePlanner !== false ? 'text-primary' : 'text-on-surface-variant'}>Wedding planner</p>
                <p className={selectedVendor?.canMessageCouple ? 'text-primary' : 'text-on-surface-variant'}>Mariés</p>
                <p className="text-primary">Flux logistique Jour J</p>
              </div>
            </section>

            <section className="bg-surface border border-outline-variant rounded-xl p-6">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Droits de lecture</h2>
              <div className="flex flex-wrap gap-2">
                {selectedVendor?.canSeeFloorPlan && <span className="px-3 py-2 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-widest">Plan salle</span>}
                {selectedVendor?.canSeeGuestList && <span className="px-3 py-2 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-widest">Invités</span>}
                {(selectedVendor?.canSeeMusicStudio || isDj) && <span className="px-3 py-2 rounded-full bg-primary/10 text-primary text-xs uppercase tracking-widest">Music studio</span>}
              </div>
            </section>
          </div>

          {isDj && (
            <section className="bg-surface border border-outline-variant rounded-xl p-6">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Vue DJ</h2>
              <p className="text-on-surface-variant mb-4">
                Le DJ voit le plan de salle, les horaires, les zones de présence et le Music Studio pour proposer ou recevoir les morceaux imposés par les mariés.
              </p>
              <a href="/music" className="inline-flex bg-primary text-on-primary rounded-full px-6 py-3 font-label-sm uppercase tracking-widest">Ouvrir Music Studio</a>
            </section>
          )}

          <section className="bg-surface border border-outline-variant rounded-xl p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Planning lié à la prestation</h2>
            <div className="space-y-3">
              {vendorTasks.slice(0, 8).map(item => (
                <div key={item.id} className="flex gap-4 border-b border-outline-variant/40 pb-3 last:border-0">
                  <span className="text-primary font-semibold w-16">{item.time}</span>
                  <div>
                    <p className="font-semibold text-on-surface">{item.title}</p>
                    <p className="text-sm text-on-surface-variant">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
