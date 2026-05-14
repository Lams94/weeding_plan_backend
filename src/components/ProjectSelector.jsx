import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

export default function ProjectSelector() {
  const weddings = useStore(state => state.weddings);
  const fetchWeddings = useStore(state => state.fetchWeddings);
  const setActiveWedding = useStore(state => state.setActiveWedding);
  const createWedding = useStore(state => state.createWedding);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newWeddingName, setNewWeddingName] = useState('');

  useEffect(() => {
    fetchWeddings();
  }, [fetchWeddings]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newWeddingName.trim()) return;
    createWedding(newWeddingName);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-surface flex flex-col items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.98)), url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl shadow-2xl p-10 animate-[fade-in-up_0.5s_ease-out]">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-4xl text-primary mb-4">diamond</span>
          <h1 className="font-display-lg text-display-lg text-on-surface">Prestige Hub</h1>
          <p className="text-secondary mt-2">Veuillez sélectionner un projet pour continuer.</p>
        </div>

        {isCreating ? (
          <form onSubmit={handleCreate} className="space-y-4 animate-[fade-in_0.3s_ease-out]">
            <div>
              <label className="block text-sm text-on-surface-variant mb-1">Nom des Mariés / Projet</label>
              <input 
                autoFocus
                type="text" 
                value={newWeddingName}
                onChange={e => setNewWeddingName(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
                placeholder="Ex: Sophie & Marc - 2027"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors"
              >
                Créer
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {weddings.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-outline-variant rounded-xl text-on-surface-variant">
                Aucun projet trouvé.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {weddings.map(w => (
                  <button 
                    key={w.id}
                    onClick={() => setActiveWedding(w)}
                    className="w-full text-left p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-headline-md text-on-surface">{w.name}</h3>
                      <p className="text-xs text-secondary mt-1">Créé le {new Date(w.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full mt-6 py-4 rounded-xl border border-dashed border-outline-variant text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Nouveau Mariage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
