import React, { useState } from 'react';
import useStore from '../store/useStore';

const roleOptions = [
  { value: 'couple', label: 'Mariés', icon: 'favorite', hint: 'Le couple garde la main et peut ouvrir le projet à un planner plus tard.' },
  { value: 'wedding_planner', label: 'Wedding planner', icon: 'event_available', hint: 'Gestion multi-projets, coordination prestataires et canaux Jour J.' }
];

const defaultTasks = [
  ['J-365', 'Définir le budget de base et le style du mariage', 'all'],
  ['J-300', 'Réserver le lieu et valider la date', 'all'],
  ['J-240', 'Sélectionner traiteur, photo, vidéo, musique et décoration', 'wedding_planner'],
  ['J-180', 'Construire la liste invités et les groupes calendrier', 'couple'],
  ['J-120', 'Valider les contrats prestataires et les premiers acomptes', 'wedding_planner'],
  ['J-60', 'Construire le plan de table et les timings réception', 'all'],
  ['J-30', 'Contrôler les factures, soldes et confirmations prestataires', 'wedding_planner'],
  ['J-7', 'Partager le briefing final aux prestataires et témoins', 'vendor'],
  ['Jour J', 'Coordination terrain, logistique et clôture', 'all']
];

export default function OnboardingWedding() {
  const activeWedding = useStore(state => state.activeWedding);
  const updateWedding = useStore(state => state.updateWedding);
  const showToast = useStore(state => state.showToast);
  const agendaItems = useStore(state => state.agendaItems);
  const importRetroplanning = useStore(state => state.importRetroplanning);

  const [form, setForm] = useState({
    ownerRole: activeWedding?.ownerRole || 'couple',
    brideName: activeWedding?.brideName || '',
    groomName: activeWedding?.groomName || '',
    plannerName: activeWedding?.plannerName || '',
    beneficiaries: activeWedding?.beneficiaries || '',
    date: activeWedding?.date ? activeWedding.date.slice(0, 10) : '',
    baseBudget: activeWedding?.baseBudget || '',
    plannerAccessEnabled: Boolean(activeWedding?.plannerAccessEnabled),
    plannerDelegationMode: activeWedding?.plannerDelegationMode || 'none',
    plannerCanSeePrivateThoughts: Boolean(activeWedding?.plannerCanSeePrivateThoughts),
    plannerCanSeeCoupleDirectMessages: Boolean(activeWedding?.plannerCanSeeCoupleDirectMessages),
    vendorDelegationMode: activeWedding?.vendorDelegationMode || 'couple',
    venueAddress: activeWedding?.venueAddress || '',
    venueAccessTime: activeWedding?.venueAccessTime || '',
    vendorInstructions: activeWedding?.vendorInstructions || ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateWedding({
      ...form,
      baseBudget: Number(form.baseBudget) || 0,
      onboardingComplete: true
    });
    showToast('Onboarding terminé');
  };

  const update = (patch) => setForm(current => ({ ...current, ...patch }));
  const selectedRole = roleOptions.find(role => role.value === form.ownerRole);
  const showDelegation = form.ownerRole === 'couple' && form.plannerAccessEnabled;

  return (
    <main className="min-h-screen bg-background px-4 md:px-12 py-10 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 bg-surface border border-outline-variant rounded-xl p-6 md:p-10">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Configuration projet</p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Vrai onboarding Wedding Plan</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            On définit qui pilote le mariage, ce qui est privé, ce qui est délégué au planner et ce que les prestataires verront.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Point de départ</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleOptions.map(role => (
                  <button key={role.value} type="button" onClick={() => update({ ownerRole: role.value })} className={`text-left border rounded-lg p-4 transition-colors ${form.ownerRole === role.value ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container-low hover:border-primary/50'}`}>
                    <span className="material-symbols-outlined text-primary mb-2">{role.icon}</span>
                    <p className="font-body-md font-semibold text-on-surface">{role.label}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{role.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Mariée / partenaire 1</span>
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.brideName} onChange={event => update({ brideName: event.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Marié / partenaire 2</span>
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.groomName} onChange={event => update({ groomName: event.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Wedding planner référent</span>
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.plannerName} onChange={event => update({ plannerName: event.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Date du mariage</span>
                <input type="date" className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.date} onChange={event => update({ date: event.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Budget de base souhaité (€)</span>
                <input type="number" min="0" className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.baseBudget} onChange={event => update({ baseBudget: event.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Ouverture du lieu</span>
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.venueAccessTime} onChange={event => update({ venueAccessTime: event.target.value })} placeholder="Ex: 09:00 prestataires, 15:00 invités" />
              </label>
              <label className="block md:col-span-2">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Adresse / lieux</span>
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.venueAddress} onChange={event => update({ venueAddress: event.target.value })} />
              </label>
              <label className="block md:col-span-2">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Bénéficiaires / personnes à informer</span>
                <textarea rows="3" className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.beneficiaries} onChange={event => update({ beneficiaries: event.target.value })} placeholder="Parents, témoins, assistant planner, famille..." />
              </label>
            </div>

            <section className="border border-outline-variant rounded-xl p-5 bg-surface-container-low">
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" checked={form.plannerAccessEnabled} onChange={event => update({ plannerAccessEnabled: event.target.checked })} />
                <span>
                  <span className="block font-semibold text-on-surface">Ouvrir le projet à un wedding planner</span>
                  <span className="text-sm text-on-surface-variant">Le couple peut organiser seul puis activer cette option à tout moment.</span>
                </span>
              </label>

              {showDelegation && (
                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="block font-label-sm text-label-sm text-secondary mb-1">Niveau de délégation planner</span>
                    <select className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.plannerDelegationMode} onChange={event => update({ plannerDelegationMode: event.target.value })}>
                      <option value="partial">Partielle: validation couple obligatoire</option>
                      <option value="total">Totale: planner pilote les prestataires</option>
                      <option value="coordination_day">Jour J seulement</option>
                    </select>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <input type="checkbox" checked={form.plannerCanSeePrivateThoughts} onChange={event => update({ plannerCanSeePrivateThoughts: event.target.checked })} />
                      Ouvrir l'espace de pensées au planner
                    </label>
                    <label className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <input type="checkbox" checked={form.plannerCanSeeCoupleDirectMessages} onChange={event => update({ plannerCanSeeCoupleDirectMessages: event.target.checked })} />
                      Ouvrir les échanges directs mariés
                    </label>
                  </div>
                  <label className="block">
                    <span className="block font-label-sm text-label-sm text-secondary mb-1">Délégation prestataires</span>
                    <select className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.vendorDelegationMode} onChange={event => update({ vendorDelegationMode: event.target.value })}>
                      <option value="couple">Les prestataires parlent au couple</option>
                      <option value="planner">Les prestataires passent par le planner</option>
                      <option value="mixed">Mixte selon prestataire</option>
                    </select>
                  </label>
                </div>
              )}
            </section>

            <label className="block">
              <span className="block font-label-sm text-label-sm text-secondary mb-1">Brief prestataires global</span>
              <textarea rows="3" className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.vendorInstructions} onChange={event => update({ vendorInstructions: event.target.value })} placeholder="Accès livraison, zones, contacts terrain, règles de communication..." />
            </label>

            <button type="submit" className="w-full md:w-auto bg-primary text-on-primary px-8 py-3 rounded-full font-label-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Enregistrer et entrer dans le cockpit
            </button>
          </form>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">{selectedRole?.icon}</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">{selectedRole?.label}</h2>
            </div>
            <p className="text-on-surface-variant">{selectedRole?.hint}</p>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Rétroplanning conseillé</h2>
            <div className="space-y-3">
              {defaultTasks.map(([time, title, audience]) => (
                <div key={`${time}-${title}`} className="flex gap-3 border-b border-outline-variant/30 pb-3 last:border-0">
                  <span className="text-primary font-semibold w-16">{time}</span>
                  <div>
                    <span className="text-on-surface-variant">{title}</span>
                    <p className="text-xs uppercase tracking-widest text-secondary mt-1">visible: {audience}</p>
                  </div>
                </div>
              ))}
            </div>
            {agendaItems.length > 0 && <p className="text-xs text-secondary mt-4">{agendaItems.length} tâche(s) déjà présentes dans le planning de ce projet.</p>}
            <button type="button" onClick={() => importRetroplanning(defaultTasks.map(([time, title, audience], index) => ({
              time,
              title,
              audience,
              description: `Étape ${index + 1} du rétroplanning mariage, à détailler avec les personnes concernées.`,
              isRestricted: audience !== 'all',
              isDone: false
            })))} className="mt-5 w-full border border-primary text-primary rounded-full px-5 py-3 font-label-sm uppercase tracking-widest hover:bg-primary/5 transition-colors">
              Importer ces tâches dans le planning
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
