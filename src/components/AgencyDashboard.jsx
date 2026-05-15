import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { ROLES, roleLabels } from '../lib/accessControl';

const roleOptions = [
  ROLES.SUPER_USER,
  ROLES.COUPLE,
  ROLES.WEDDING_PLANNER,
  ROLES.VENDOR,
  ROLES.GUEST,
  ROLES.BENEFICIARY
];

export default function AgencyDashboard() {
  const weddings = useStore(state => state.weddings);
  const fetchWeddings = useStore(state => state.fetchWeddings);
  const setActiveWedding = useStore(state => state.setActiveWedding);
  const createWedding = useStore(state => state.createWedding);
  const currentAccessRole = useStore(state => state.currentAccessRole);
  const setCurrentAccessRole = useStore(state => state.setCurrentAccessRole);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newWeddingName, setNewWeddingName] = useState('');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  
  // --- UPLOAD APK STATE ---
  const [uploadingApk, setUploadingApk] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetchWeddings();
  }, [fetchWeddings]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newWeddingName.trim()) return;
    setIsSubmittingProject(true);
    try {
      await createWedding(newWeddingName);
      setNewWeddingName('');
      setIsCreating(false);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleApkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingApk(true);
    setUploadMessage('Upload en cours...');

    const formData = new FormData();
    formData.append('apkFile', file);

    try {
      const res = await fetch('/api/upload-apk', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadMessage('Succès : APK en ligne !');
        setTimeout(() => setUploadMessage(''), 3000);
      } else {
        setUploadMessage('Erreur : ' + data.error);
      }
    } catch (err) {
      setUploadMessage('Erreur de connexion serveur.');
    } finally {
      setUploadingApk(false);
    }
  };

  // --- STATISTIQUES GLOBALES AGENCE ---
  const totalProjects = weddings.length;
  const isAgencyProfile = currentAccessRole === ROLES.WEDDING_PLANNER || currentAccessRole === ROLES.SUPER_USER;
  
  // Calcul du budget total géré (Somme des devis de tous les prestataires de tous les mariages)
  const totalManagedBudget = weddings.reduce((sum, w) => {
    return sum + (w.vendors?.reduce((vSum, v) => vSum + v.budget, 0) || 0);
  }, 0);

  // Estimation des honoraires agence (15% en moyenne)
  const estimatedAgencyRevenue = totalManagedBudget * 0.15;

  // Extraction des tâches critiques/urgentes de l'agenda de TOUS les mariages
  const allTasks = weddings.flatMap(w => 
    (w.agenda || []).map(task => ({
      ...task,
      weddingName: w.name,
      weddingId: w.id
    }))
  );
  
  // Filtrer les tâches non faites et les trier (on simule l'urgence par l'ordre chronologique)
  const upcomingTasks = allTasks.filter(t => !t.isDone).slice(0, 5); // Les 5 prochaines
  const primaryWedding = weddings[0];
  const coupleBudget = primaryWedding?.baseBudget || primaryWedding?.vendors?.reduce((sum, vendor) => sum + vendor.budget, 0) || 0;
  const couplePaid = primaryWedding?.vendors?.reduce((sum, vendor) => sum + vendor.paid, 0) || 0;
  const coupleTasks = (primaryWedding?.agenda || []).filter(task => !task.isDone).slice(0, 5);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center">
      
      {/* Header Agence */}
      <header className="w-full bg-surface border-b border-outline-variant px-8 py-6 flex justify-between items-center sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{isAgencyProfile ? 'Prestige Agency Hub' : 'Mon mariage'}</h1>
            <p className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">{isAgencyProfile ? 'Multi-Project Command Center' : 'Espace mariés'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={currentAccessRole} onChange={event => setCurrentAccessRole(event.target.value)} className="bg-surface-container-low border border-outline-variant rounded-full px-4 py-3 text-sm text-on-surface">
            {roleOptions.map(role => <option key={role} value={role}>{roleLabels[role]}</option>)}
          </select>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {isAgencyProfile ? 'Nouveau Projet' : 'Nouveau mariage'}
          </button>
        </div>
      </header>

      {!isAgencyProfile && (
        <main className="w-full max-w-[1200px] px-8 py-12 grid grid-cols-1 xl:grid-cols-12 gap-8">
          <section className="xl:col-span-8 space-y-8">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Projet du couple</p>
              <h2 className="font-display-md text-display-md text-on-background">{primaryWedding?.name || 'Mon mariage'}</h2>
            </div>

            {primaryWedding ? (
              <div onClick={() => setActiveWedding(primaryWedding)} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{primaryWedding.name}</h3>
                    <p className="font-label-sm text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {primaryWedding.date ? new Date(primaryWedding.date).toLocaleDateString() : 'Date à définir'}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
                    <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Invités</p>
                    <p className="font-body-lg font-medium text-on-surface">{primaryWedding.guests?.filter(g => g.status === 'Confirmed').length || 0} <span className="text-outline text-sm">/ {primaryWedding.guests?.length || 0}</span></p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
                    <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Budget prévu</p>
                    <p className="font-body-lg font-medium text-on-surface">{coupleBudget.toLocaleString()}€</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
                    <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Déjà payé</p>
                    <p className="font-body-lg font-medium text-on-surface">{couplePaid.toLocaleString()}€</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">favorite</span>
                <p>Aucun mariage créé. Commencez par “Nouveau mariage”.</p>
              </div>
            )}
          </section>

          <aside className="xl:col-span-4 space-y-8">
            <div className="bg-surface-container-high border border-outline-variant rounded-xl p-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                Budget
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-label-sm text-secondary uppercase tracking-widest mb-1">Enveloppe de base</p>
                  <p className="font-display-sm text-display-sm text-on-background">{coupleBudget.toLocaleString()} €</p>
                </div>
                <div className="pt-4 border-t border-outline-variant/30">
                  <p className="font-label-sm text-secondary uppercase tracking-widest mb-1">Paiements prestataires</p>
                  <p className="font-headline-lg text-primary">{couplePaid.toLocaleString()} €</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-error">notification_important</span>
                  Prochaines échéances
                </h3>
                <span className="bg-error/10 text-error px-2 py-1 rounded-full text-xs font-bold">{coupleTasks.length}</span>
              </div>
              <div className="space-y-4">
                {coupleTasks.length === 0 ? (
                  <p className="text-secondary text-sm italic">Aucune tâche en attente.</p>
                ) : (
                  coupleTasks.map((task, idx) => (
                    <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/50">
                      <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[18px]">event</span>
                      </div>
                      <div>
                        <p className="font-body-md text-on-surface font-medium leading-tight">{task.title}</p>
                        <p className="font-body-sm text-secondary text-sm mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {task.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </main>
      )}

      {isAgencyProfile && (
      <main className="w-full max-w-[1400px] px-8 py-12 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Colonne Principale: Projets en cours */}
        <div className="xl:col-span-8 space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="font-display-md text-display-md text-on-background">Projets Actifs ({totalProjects})</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddings.length === 0 ? (
              <div className="col-span-2 text-center p-12 border border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
                <p>Aucun projet en cours. Cliquez sur "Nouveau Projet" pour commencer.</p>
              </div>
            ) : (
              weddings.map(w => {
                const guestsConfirmed = w.guests?.filter(g => g.status === 'Confirmed').length || 0;
                const guestsTotal = w.guests?.length || 0;
                const budgetTotal = w.vendors?.reduce((sum, v) => sum + v.budget, 0) || 0;
                const budgetPaid = w.vendors?.reduce((sum, v) => sum + v.paid, 0) || 0;
                const budgetProgress = budgetTotal > 0 ? (budgetPaid / budgetTotal) * 100 : 0;

                return (
                  <div 
                    key={w.id}
                    onClick={() => setActiveWedding(w)}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{w.name}</h3>
                        <p className="font-label-sm text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {w.date ? new Date(w.date).toLocaleDateString() : 'Date à définir'}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors relative z-10">arrow_forward</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                        <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Invités</p>
                        <p className="font-body-lg font-medium text-on-surface">
                          {guestsConfirmed} <span className="text-outline text-sm">/ {guestsTotal}</span>
                        </p>
                      </div>
                      <div className="bg-surface p-3 rounded-lg border border-outline-variant/50">
                        <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Budget Alloué</p>
                        <p className="font-body-lg font-medium text-on-surface">
                          {budgetTotal.toLocaleString()}€
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-secondary">Paiements Prestataires</span>
                        <span className="text-primary font-medium">{Math.round(budgetProgress)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${budgetProgress}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Colonne Latérale: Statistiques & Urgences */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* KPI Agence */}
          <div className="bg-surface-container-high border border-outline-variant rounded-xl p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">trending_up</span>
              Performances Agence
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="font-label-sm text-secondary uppercase tracking-widest mb-1">Volume d'Affaires Géré</p>
                <p className="font-display-sm text-display-sm text-on-background">{totalManagedBudget.toLocaleString()} €</p>
              </div>
              
              <div className="pt-4 border-t border-outline-variant/30">
                <p className="font-label-sm text-secondary uppercase tracking-widest mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                  Honoraires Estimés (15%)
                </p>
                <p className="font-headline-lg text-primary">{estimatedAgencyRevenue.toLocaleString()} €</p>
              </div>
            </div>
          </div>

          {/* Alertes & Echéances */}
          <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-error">notification_important</span>
                Prochaines Échéances
              </h3>
              <span className="bg-error/10 text-error px-2 py-1 rounded-full text-xs font-bold">{upcomingTasks.length}</span>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <p className="text-secondary text-sm italic">Aucune tâche en attente pour le moment.</p>
              ) : (
                upcomingTasks.map((task, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/50">
                    <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="material-symbols-outlined text-[18px]">event</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-primary uppercase text-[10px] tracking-widest mb-1">{task.weddingName}</p>
                      <p className="font-body-md text-on-surface font-medium leading-tight">{task.title}</p>
                      <p className="font-body-sm text-secondary text-sm mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {task.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Espace Admin / Dev Dash (Gestion APK) */}
          <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm mt-8">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">developer_mode</span>
              Dev Dash - Distribution App
            </h3>
            
            <div className="space-y-4">
              <p className="text-secondary text-sm mb-4">Uploadez la dernière version Android (APK) pour la rendre téléchargeable par vos clients.</p>
              
              {/* Bouton Upload (Caché l'input, affiche un beau bouton) */}
              <label className={`w-full ${uploadingApk ? 'bg-surface-variant' : 'bg-surface-container-high hover:bg-surface-variant'} text-on-surface border border-outline-variant px-4 py-3 rounded-xl font-label-sm uppercase tracking-widest transition-colors flex justify-center items-center gap-2 cursor-pointer relative overflow-hidden`}>
                <span className="material-symbols-outlined text-sm">{uploadingApk ? 'sync' : 'upload'}</span>
                {uploadingApk ? 'Upload en cours...' : 'Pousser un nouvel APK'}
                <input 
                  type="file" 
                  accept=".apk" 
                  onChange={handleApkUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingApk}
                />
              </label>

              {uploadMessage && (
                <p className={`text-xs text-center font-bold ${uploadMessage.includes('Succès') ? 'text-primary' : 'text-error'}`}>
                  {uploadMessage}
                </p>
              )}

              <hr className="border-outline-variant/30 my-4" />

              {/* Bouton Téléchargement Client */}
              <a 
                href="/api/downloads/PrestigeWeddingApp.apk" 
                download
                className="w-full bg-on-background text-surface px-4 py-3 rounded-xl font-label-sm uppercase tracking-widest hover:bg-primary transition-colors flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">android</span>
                Télécharger l'Application Android
              </a>
            </div>
          </div>

        </div>

      </main>
      )}

      {/* Modal de création (similaire au ProjectSelector original mais en popup) */}
      {isCreating && (
        <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl shadow-2xl p-8 animate-[fade-in-up_0.3s_ease-out]">
            <h2 className="font-headline-md text-on-surface mb-6">Créer un nouveau projet</h2>
            <div>
              <label className="block text-sm text-on-surface-variant mb-2">Nom des Mariés / Projet</label>
              <input 
                autoFocus
                type="text" 
                value={newWeddingName}
                onChange={e => setNewWeddingName(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Ex: Sophie & Marc - 2027"
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit"
                disabled={isSubmittingProject}
                className="flex-1 py-3 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors"
              >
                Créer & Ouvrir
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
