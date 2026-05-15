import React, { useState } from 'react';
import useStore from '../store/useStore';
import TopAppBar from '../components/TopAppBar.jsx';
import BottomNavBar from '../components/BottomNavBar.jsx';
import { canSeePrivateThoughts } from '../lib/accessControl';

export default function PrivateThoughts() {
  const role = useStore(state => state.currentAccessRole);
  const activeWedding = useStore(state => state.activeWedding);
  const thoughts = useStore(state => state.thoughts);
  const addThought = useStore(state => state.addThought);
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', sharedWithPlanner: false });
  const canSee = canSeePrivateThoughts(role, activeWedding || {});

  const visibleThoughts = role === 'wedding_planner'
    ? thoughts.filter(thought => thought.sharedWithPlanner)
    : thoughts;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    await addThought(form);
    setForm({ title: '', content: '', imageUrl: '', sharedWithPlanner: false });
  };

  return (
    <>
      <TopAppBar title="Espace de pensées" role={role} />
      <main className="min-h-screen bg-background px-4 md:px-12 pt-28 pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 bg-surface border border-outline-variant rounded-xl p-6">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Notes privées mariés</p>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">Brainstorming, photos, envies</h1>
            <p className="text-on-surface-variant mb-6">
              Cet espace reste privé au couple. Le wedding planner ne voit que les éléments explicitement partagés.
            </p>
            {canSee && role !== 'wedding_planner' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" placeholder="Titre" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} />
                <textarea className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" rows="5" placeholder="Idée, ambiance, contrainte, inspiration..." value={form.content} onChange={event => setForm({ ...form, content: event.target.value })} />
                <input className="w-full border border-outline-variant bg-surface px-4 py-3 rounded-md" placeholder="Lien photo ou moodboard" value={form.imageUrl} onChange={event => setForm({ ...form, imageUrl: event.target.value })} />
                <label className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <input type="checkbox" checked={form.sharedWithPlanner} onChange={event => setForm({ ...form, sharedWithPlanner: event.target.checked })} />
                  Ouvrir cette pensée au wedding planner
                </label>
                <button className="bg-primary text-on-primary rounded-full px-6 py-3 font-label-sm uppercase tracking-widest">Ajouter</button>
              </form>
            )}
          </section>

          <section className="lg:col-span-7 space-y-4">
            {!canSee && (
              <div className="bg-surface border border-outline-variant rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-4">visibility_off</span>
                <p className="text-on-surface-variant">Cet espace n'a pas encore été ouvert au wedding planner.</p>
              </div>
            )}
            {canSee && visibleThoughts.map(thought => (
              <article key={thought.id} className="bg-surface border border-outline-variant rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-headline-md text-headline-md text-on-surface">{thought.title}</h2>
                  {thought.sharedWithPlanner && <span className="text-xs uppercase tracking-widest text-primary">partagé planner</span>}
                </div>
                {thought.content && <p className="text-on-surface-variant mt-3 whitespace-pre-wrap">{thought.content}</p>}
                {thought.imageUrl && <a className="text-primary text-sm mt-4 inline-flex" href={thought.imageUrl} target="_blank" rel="noreferrer">Voir l'inspiration</a>}
              </article>
            ))}
            {canSee && visibleThoughts.length === 0 && (
              <div className="bg-surface border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
                Aucune pensée enregistrée pour le moment.
              </div>
            )}
          </section>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
