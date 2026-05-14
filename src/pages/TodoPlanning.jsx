import React, { useMemo, useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function TodoPlanning() {
  const agendaItems = useStore(state => state.agendaItems);
  const toggleAgendaDone = useStore(state => state.toggleAgendaDone);
  const addAgendaItem = useStore(state => state.addAgendaItem);
  const [form, setForm] = useState({ time: '', title: '', description: '' });

  const stats = useMemo(() => {
    const total = agendaItems.length;
    const done = agendaItems.filter(item => item.isDone).length;
    return { total, done, pending: total - done, progress: total ? Math.round((done / total) * 100) : 0 };
  }, [agendaItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await addAgendaItem({
      time: form.time || 'À planifier',
      title: form.title.trim(),
      description: form.description.trim(),
      isDone: false,
      isRestricted: false,
      orderIndex: agendaItems.length + 1
    });
    setForm({ time: '', title: '', description: '' });
  };

  return (
    <>
      <TopAppBar title="Todo & Planning" role="PLANNING" />
      <main className="pt-28 pb-32 px-4 md:px-12 max-w-6xl mx-auto">
        <header className="mb-8">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Rétroplanning opérationnel</p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Todo liste du mariage</h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <p className="text-secondary text-sm">Total tâches</p>
            <p className="font-headline-lg text-headline-lg">{stats.total}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <p className="text-secondary text-sm">À faire</p>
            <p className="font-headline-lg text-headline-lg">{stats.pending}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <p className="text-secondary text-sm">Avancement</p>
            <p className="font-headline-lg text-headline-lg text-primary">{stats.progress}%</p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="bg-surface border border-outline-variant rounded-xl p-5 mb-8 grid grid-cols-1 md:grid-cols-12 gap-3">
          <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="md:col-span-2 border border-outline-variant rounded-md bg-surface px-4 py-3" placeholder="J-90 / 14:00" />
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="md:col-span-4 border border-outline-variant rounded-md bg-surface px-4 py-3" placeholder="Nouvelle tâche" />
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="md:col-span-4 border border-outline-variant rounded-md bg-surface px-4 py-3" placeholder="Détail / responsable / action" />
          <button className="md:col-span-2 bg-primary text-on-primary rounded-md px-4 py-3 font-label-sm uppercase tracking-widest">Ajouter</button>
        </form>

        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
          {agendaItems.length === 0 ? (
            <p className="p-8 text-on-surface-variant italic">Aucune tâche pour le moment. Ajoute une tâche ou importe le rétroplanning depuis l’onboarding.</p>
          ) : (
            agendaItems
              .slice()
              .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleAgendaDone(item.id)}
                  className="w-full text-left grid grid-cols-[auto_1fr_auto] gap-4 items-start p-5 border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low transition-colors"
                >
                  <span className={`material-symbols-outlined mt-1 ${item.isDone ? 'text-primary' : 'text-outline'}`}>
                    {item.isDone ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>
                    <span className={`block font-body-lg font-semibold ${item.isDone ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{item.title}</span>
                    <span className="block text-sm text-on-surface-variant mt-1">{item.description}</span>
                  </span>
                  <span className="text-sm text-primary font-semibold whitespace-nowrap">{item.time}</span>
                </button>
              ))
          )}
        </section>
      </main>
      <BottomNavBar />
    </>
  );
}
