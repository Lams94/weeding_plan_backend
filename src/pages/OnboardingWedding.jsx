import React, { useState } from 'react';
import useStore from '../store/useStore';

const roleOptions = [
  { value: 'couple', label: 'Mariés', icon: 'favorite', hint: 'Vue simple sur budget, invités, tâches et paiements.' },
  { value: 'beneficiary', label: 'Bénéficiaire', icon: 'volunteer_activism', hint: 'Famille ou proche qui suit une partie du mariage.' },
  { value: 'vendor', label: 'Prestataire', icon: 'handshake', hint: 'Accès centré sur missions, planning et paiements.' },
  { value: 'wedding_planner', label: 'Wedding planner', icon: 'event_available', hint: 'Pilotage complet du projet et de tous les intervenants.' }
];

const defaultTasks = [
  ['J-365', 'Définir le budget de base et le style du mariage'],
  ['J-300', 'Réserver le lieu et valider la date'],
  ['J-240', 'Sélectionner traiteur, photo, vidéo, musique et décoration'],
  ['J-180', 'Construire la liste invités et envoyer les save the date'],
  ['J-120', 'Valider les contrats prestataires et les premiers acomptes'],
  ['J-90', 'Finaliser menu, hébergements et transport'],
  ['J-60', 'Construire le plan de table et les timings cérémonie/réception'],
  ['J-30', 'Contrôler les factures, soldes et confirmations prestataires'],
  ['J-7', 'Partager le briefing final aux prestataires et témoins'],
  ['Jour J', 'Coordination terrain, accueil invités, imprévus et clôture']
];

export default function OnboardingWedding() {
  const activeWedding = useStore(state => state.activeWedding);
  const updateWedding = useStore(state => state.updateWedding);
  const showToast = useStore(state => state.showToast);
  const agendaItems = useStore(state => state.agendaItems);
  const importRetroplanning = useStore(state => state.importRetroplanning);

  const [form, setForm] = useState({
    ownerRole: activeWedding?.ownerRole || 'wedding_planner',
    brideName: activeWedding?.brideName || '',
    groomName: activeWedding?.groomName || '',
    plannerName: activeWedding?.plannerName || '',
    beneficiaries: activeWedding?.beneficiaries || '',
    date: activeWedding?.date ? activeWedding.date.slice(0, 10) : '',
    baseBudget: activeWedding?.baseBudget || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateWedding({
      ...form,
      baseBudget: Number(form.baseBudget) || 0,
      onboardingComplete: true
    });
    showToast('Onboarding terminé');
  };

  const selectedRole = roleOptions.find(role => role.value === form.ownerRole);

  return (
    <main className="min-h-screen bg-background px-4 md:px-12 py-10 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 bg-surface border border-outline-variant rounded-xl p-6 md:p-10">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Configuration projet</p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Onboarding Wedding Plan</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            On pose les bases: rôle, mariés, bénéficiaires, budget initial et date. Ces informations pilotent ensuite le cockpit, le budget et le rétroplanning.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Rôle utilisateur</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleOptions.map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setForm({ ...form, ownerRole: role.value })}
                    className={`text-left border rounded-lg p-4 transition-colors ${form.ownerRole === role.value ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container-low hover:border-primary/50'}`}
                  >
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
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.brideName} onChange={e => setForm({ ...form, brideName: e.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Marié / partenaire 2</span>
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.groomName} onChange={e => setForm({ ...form, groomName: e.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Wedding planner référent</span>
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.plannerName} onChange={e => setForm({ ...form, plannerName: e.target.value })} />
              </label>
              <label className="block">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Date du mariage</span>
                <input type="date" className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </label>
              <label className="block md:col-span-2">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Budget de base souhaité (€)</span>
                <input type="number" min="0" className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.baseBudget} onChange={e => setForm({ ...form, baseBudget: e.target.value })} />
              </label>
              <label className="block md:col-span-2">
                <span className="block font-label-sm text-label-sm text-secondary mb-1">Bénéficiaires / personnes à informer</span>
                <textarea rows="3" className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" value={form.beneficiaries} onChange={e => setForm({ ...form, beneficiaries: e.target.value })} placeholder="Parents, témoins, assistant planner, famille..." />
              </label>
            </div>

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
              {defaultTasks.map(([time, title]) => (
                <div key={`${time}-${title}`} className="flex gap-3 border-b border-outline-variant/30 pb-3 last:border-0">
                  <span className="text-primary font-semibold w-16">{time}</span>
                  <span className="text-on-surface-variant">{title}</span>
                </div>
              ))}
            </div>
            {agendaItems.length > 0 && (
              <p className="text-xs text-secondary mt-4">{agendaItems.length} tâche(s) déjà présentes dans le planning de ce projet.</p>
            )}
            <button
              type="button"
              onClick={() => importRetroplanning(defaultTasks.map(([time, title], index) => ({
                time,
                title,
                description: `Étape ${index + 1} du rétroplanning mariage. À détailler avec les mariés, bénéficiaires et prestataires concernés.`,
                isRestricted: false,
                isDone: false
              })))}
              className="mt-5 w-full border border-primary text-primary rounded-full px-5 py-3 font-label-sm uppercase tracking-widest hover:bg-primary/5 transition-colors"
            >
              Importer ces tâches dans le planning
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
