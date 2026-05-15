import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

const emptyVendor = {
  name: '',
  role: '',
  budget: '',
  accessEnabled: false,
  canMessageCouple: false,
  canMessagePlanner: true,
  canSeeGuestList: false,
  canSeeFloorPlan: false,
  canSeeMusicStudio: false
};

const permissionLabels = [
  ['canMessagePlanner', 'Canal planner'],
  ['canMessageCouple', 'Canal mariés'],
  ['canSeeGuestList', 'Invités utiles'],
  ['canSeeFloorPlan', 'Plan salle'],
  ['canSeeMusicStudio', 'Music studio']
];

export default function PrestatairesLinenPure() {
  const vendors = useStore(state => state.vendors);
  const addVendor = useStore(state => state.addVendor);
  const updateVendorFinancials = useStore(state => state.updateVendorFinancials);
  const updateVendorStatus = useStore(state => state.updateVendorStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVendor, setNewVendor] = useState(emptyVendor);

  const handleAddVendor = (event) => {
    event.preventDefault();
    if (!newVendor.name || !newVendor.role) return;
    addVendor({
      name: newVendor.name,
      role: newVendor.role,
      budget: parseFloat(newVendor.budget) || 0,
      accessRole: newVendor.role,
      accessEnabled: newVendor.accessEnabled,
      canMessageCouple: newVendor.canMessageCouple,
      canMessagePlanner: newVendor.canMessagePlanner,
      canSeeGuestList: newVendor.canSeeGuestList,
      canSeeFloorPlan: newVendor.canSeeFloorPlan,
      canSeeMusicStudio: newVendor.canSeeMusicStudio
    });
    setNewVendor(emptyVendor);
    setIsModalOpen(false);
  };

  const toggleVendorPermission = (vendor, field) => {
    updateVendorFinancials(vendor.id, { [field]: !vendor[field] });
  };

  return (
    <>
      <TopAppBar title="Prestataires" />
      <main className="w-full pt-28 px-4 md:px-12 lg:px-section-padding pb-32 max-w-container-max mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Prestataires & accès dédiés</h1>
            <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
              Gérez contrats, paiements, accès prestataires et permissions opérationnelles depuis la même vue.
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center space-x-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-full hover:bg-inverse-primary transition-colors duration-300 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Ajouter</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {vendors.map(vendor => (
            <article key={vendor.id} className="bg-surface-container-low rounded-xl p-8 flex flex-col h-full transition-colors duration-300 hover:bg-surface-container group">
              <div className="flex items-start justify-between mb-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 flex items-center justify-center text-primary text-xl font-headline-md border border-outline-variant">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">{vendor.name}</h3>
                    <p className="font-body-md text-body-md text-secondary">{vendor.role}</p>
                  </div>
                </div>
                <select value={vendor.status} onChange={(event) => updateVendorStatus(vendor.id, event.target.value)} className={`px-3 py-1 rounded-full font-label-sm text-label-sm border outline-none cursor-pointer ${vendor.status === 'Confirmed' ? 'bg-surface text-primary border-primary/30' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30'}`}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {vendor.accessEnabled && <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest">Accès actif</span>}
                  {permissionLabels.filter(([field]) => vendor[field]).map(([field, label]) => (
                    <span key={field} className="px-3 py-1 rounded-full bg-surface text-on-surface-variant text-[10px] uppercase tracking-widest">{label}</span>
                  ))}
                </div>

                <button onClick={() => toggleVendorPermission(vendor, 'accessEnabled')} className="w-full border border-outline-variant rounded-full px-4 py-2 text-xs uppercase tracking-widest text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                  {vendor.accessEnabled ? 'Désactiver accès prestataire' : 'Activer accès prestataire'}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-on-surface-variant">
                  {permissionLabels.map(([field, label]) => (
                    <label key={field} className="flex items-center gap-2">
                      <input type="checkbox" checked={Boolean(vendor[field])} onChange={() => toggleVendorPermission(vendor, field)} />
                      {label}
                    </label>
                  ))}
                </div>

                <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant border-b border-outline-variant/20 pb-4">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">receipt_long</span> Devis total</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">€{Number(vendor.budget || 0).toLocaleString()}</span>
                    <button onClick={() => {
                      const newBudget = prompt('Nouveau devis total (€) :', vendor.budget);
                      if (newBudget) updateVendorFinancials(vendor.id, { budget: parseFloat(newBudget) });
                    }} className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-label-sm text-label-sm text-secondary flex items-center gap-2">
                      Paiement
                      <button onClick={() => {
                        const newPaid = prompt('Nouveau montant payé (€) :', vendor.paid);
                        if (newPaid) updateVendorFinancials(vendor.id, { paid: parseFloat(newPaid) });
                      }} className="text-outline hover:text-primary transition-colors flex items-center">
                        <span className="material-symbols-outlined text-[12px]">add_circle</span>
                      </button>
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">{vendor.budget > 0 ? Math.round((vendor.paid / vendor.budget) * 100) : 0}%</span>
                  </div>
                  <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${vendor.budget > 0 ? (vendor.paid / vendor.budget) * 100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-xl p-8 border border-outline-variant shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Nouveau prestataire</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <label className="block">
                <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Nom / entreprise *</span>
                <input required type="text" value={newVendor.name} onChange={event => setNewVendor({ ...newVendor, name: event.target.value })} className="w-full border border-outline-variant rounded-md px-4 py-2 bg-surface focus:outline-none focus:border-primary" placeholder="Ex: Studio Lenoir" />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Rôle *</span>
                <input required type="text" value={newVendor.role} onChange={event => setNewVendor({ ...newVendor, role: event.target.value })} className="w-full border border-outline-variant rounded-md px-4 py-2 bg-surface focus:outline-none focus:border-primary" placeholder="Ex: DJ, Traiteur, Photographe" />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Devis total (€)</span>
                <input type="number" value={newVendor.budget} onChange={event => setNewVendor({ ...newVendor, budget: event.target.value })} className="w-full border border-outline-variant rounded-md px-4 py-2 bg-surface focus:outline-none focus:border-primary" placeholder="Ex: 2500" />
              </label>

              <div className="border border-outline-variant rounded-lg p-4 space-y-3">
                <label className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <input type="checkbox" checked={newVendor.accessEnabled} onChange={event => setNewVendor({ ...newVendor, accessEnabled: event.target.checked })} />
                  Créer un accès prestataire
                </label>
                <div className="grid grid-cols-1 gap-2 text-sm text-on-surface-variant">
                  {permissionLabels.map(([field, label]) => (
                    <label key={field} className="flex items-center gap-3">
                      <input type="checkbox" checked={Boolean(newVendor[field])} onChange={event => setNewVendor({ ...newVendor, [field]: event.target.checked })} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-primary-container text-on-primary-container py-3 rounded-full font-label-sm mt-4 hover:bg-inverse-primary transition-colors">
                Enregistrer le prestataire
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNavBar />
    </>
  );
}
