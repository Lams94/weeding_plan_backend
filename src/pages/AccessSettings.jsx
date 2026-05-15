import React, { useState } from 'react';
import useStore from '../store/useStore';
import TopAppBar from '../components/TopAppBar.jsx';
import BottomNavBar from '../components/BottomNavBar.jsx';
import { ROLES, roleLabels } from '../lib/accessControl';

const roleChoices = [ROLES.WEDDING_PLANNER, ROLES.VENDOR, ROLES.GUEST, ROLES.BENEFICIARY, ROLES.SUPER_USER];

export default function AccessSettings() {
  const role = useStore(state => state.currentAccessRole);
  const activeWedding = useStore(state => state.activeWedding);
  const vendors = useStore(state => state.vendors);
  const accessProfiles = useStore(state => state.accessProfiles);
  const updateWedding = useStore(state => state.updateWedding);
  const updateVendorFinancials = useStore(state => state.updateVendorFinancials);
  const addAccessProfile = useStore(state => state.addAccessProfile);
  const [profile, setProfile] = useState({ displayName: '', email: '', role: ROLES.GUEST, vendorId: '', permissions: {} });

  const updateProject = (patch) => updateWedding({ ...patch });

  const toggleVendor = (vendor, field) => {
    updateVendorFinancials(vendor.id, { [field]: !vendor[field] });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!profile.displayName.trim()) return;
    await addAccessProfile({
      ...profile,
      vendorId: profile.vendorId || null,
      isSuperUser: profile.role === ROLES.SUPER_USER,
      permissions: {
        canSeeBudget: profile.role === ROLES.WEDDING_PLANNER || profile.role === ROLES.BENEFICIARY,
        canUseLogistics: profile.role === ROLES.WEDDING_PLANNER || profile.role === ROLES.VENDOR,
        canSeePrivateThoughts: false
      }
    });
    setProfile({ displayName: '', email: '', role: ROLES.GUEST, vendorId: '', permissions: {} });
  };

  return (
    <>
      <TopAppBar title="Accès & délégations" role={role} />
      <main className="min-h-screen bg-background px-4 md:px-12 pt-28 pb-28">
        <div className="max-w-6xl mx-auto space-y-6">
          <section className="bg-surface border border-outline-variant rounded-xl p-6">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Ouverture planner</p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Le couple peut ouvrir ou reprendre la main à tout moment</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 border border-outline-variant rounded-lg p-4">
                <input type="checkbox" className="mt-1" checked={Boolean(activeWedding?.plannerAccessEnabled)} onChange={event => updateProject({ plannerAccessEnabled: event.target.checked })} />
                <span>
                  <span className="block font-semibold text-on-surface">Projet ouvert au wedding planner</span>
                  <span className="text-sm text-on-surface-variant">Active la coordination planner et son portail multi-projets.</span>
                </span>
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Délégation planner</span>
                <select className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={activeWedding?.plannerDelegationMode || 'none'} onChange={event => updateProject({ plannerDelegationMode: event.target.value })}>
                  <option value="none">Aucune</option>
                  <option value="partial">Partielle</option>
                  <option value="total">Totale</option>
                  <option value="coordination_day">Jour J seulement</option>
                </select>
              </label>
              <label className="flex items-center gap-3 text-sm text-on-surface-variant">
                <input type="checkbox" checked={Boolean(activeWedding?.plannerCanSeePrivateThoughts)} onChange={event => updateProject({ plannerCanSeePrivateThoughts: event.target.checked })} />
                Le planner voit l'espace de pensées partagé
              </label>
              <label className="flex items-center gap-3 text-sm text-on-surface-variant">
                <input type="checkbox" checked={Boolean(activeWedding?.plannerCanSeeCoupleDirectMessages)} onChange={event => updateProject({ plannerCanSeeCoupleDirectMessages: event.target.checked })} />
                Le planner voit les échanges directs mariés
              </label>
              <label className="block md:col-span-2">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Mode prestataires</span>
                <select className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={activeWedding?.vendorDelegationMode || 'couple'} onChange={event => updateProject({ vendorDelegationMode: event.target.value })}>
                  <option value="couple">Contact couple</option>
                  <option value="planner">Contact planner</option>
                  <option value="mixed">Mixte selon prestataire</option>
                </select>
              </label>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-outline-variant rounded-xl p-6">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Créer un accès</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" placeholder="Nom affiché" value={profile.displayName} onChange={event => setProfile({ ...profile, displayName: event.target.value })} />
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" placeholder="Email ou identifiant" value={profile.email} onChange={event => setProfile({ ...profile, email: event.target.value })} />
                <select className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={profile.role} onChange={event => setProfile({ ...profile, role: event.target.value })}>
                  {roleChoices.map(item => <option key={item} value={item}>{roleLabels[item]}</option>)}
                </select>
                {profile.role === ROLES.VENDOR && (
                  <select className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={profile.vendorId} onChange={event => setProfile({ ...profile, vendorId: event.target.value })}>
                    <option value="">Associer un prestataire</option>
                    {vendors.map(vendor => <option key={vendor.id} value={vendor.id}>{vendor.name} - {vendor.role}</option>)}
                  </select>
                )}
                <button className="w-full bg-primary text-on-primary rounded-full px-6 py-3 font-label-sm uppercase tracking-widest">Créer l'accès</button>
              </form>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl p-6">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Accès existants</h2>
              <div className="space-y-3">
                {accessProfiles.map(item => (
                  <div key={item.id} className="border border-outline-variant rounded-lg p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-on-surface">{item.displayName || item.email || 'Accès sans nom'}</p>
                        <p className="text-xs uppercase tracking-widest text-secondary">{roleLabels[item.role] || item.role}</p>
                      </div>
                      {item.isSuperUser && <span className="text-xs text-primary uppercase tracking-widest">debug</span>}
                    </div>
                  </div>
                ))}
                {accessProfiles.length === 0 && <p className="text-on-surface-variant">Aucun accès nominatif créé.</p>}
              </div>
            </div>
          </section>

          <section className="bg-surface border border-outline-variant rounded-xl p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Droits prestataires</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {vendors.map(vendor => (
                <article key={vendor.id} className="border border-outline-variant rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold text-on-surface">{vendor.name}</h3>
                      <p className="text-sm text-secondary">{vendor.role}</p>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={Boolean(vendor.accessEnabled)} onChange={() => toggleVendor(vendor, 'accessEnabled')} />
                      accès
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-on-surface-variant">
                    {['canMessageCouple', 'canMessagePlanner', 'canSeeGuestList', 'canSeeFloorPlan', 'canSeeMusicStudio'].map(field => (
                      <label key={field} className="flex items-center gap-2">
                        <input type="checkbox" checked={Boolean(vendor[field])} onChange={() => toggleVendor(vendor, field)} />
                        {field.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
