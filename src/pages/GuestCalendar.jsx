import React from 'react';
import useStore from '../store/useStore';
import TopAppBar from '../components/TopAppBar.jsx';
import BottomNavBar from '../components/BottomNavBar.jsx';
import { agendaVisibleForRole } from '../lib/accessControl';

export default function GuestCalendar() {
  const role = useStore(state => state.currentAccessRole);
  const group = useStore(state => state.currentGuestGroup);
  const agendaItems = useStore(state => state.agendaItems);
  const visibleAgenda = agendaItems.filter(item => agendaVisibleForRole(item, 'guest', group));

  return (
    <>
      <TopAppBar title="Calendrier invité" role={`${role} / ${group}`} />
      <main className="min-h-screen bg-background px-4 md:px-12 pt-28 pb-28">
        <section className="max-w-4xl mx-auto bg-surface border border-outline-variant rounded-xl p-6">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Groupe {group}</p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-6">Programme visible invité</h1>
          <div className="space-y-4">
            {visibleAgenda.map(item => (
              <article key={item.id} className="border border-outline-variant rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <span className="text-primary font-semibold w-20">{item.time}</span>
                  <div>
                    <h2 className="font-semibold text-on-surface">{item.title}</h2>
                    <p className="text-sm text-on-surface-variant mt-1">{item.description}</p>
                  </div>
                </div>
              </article>
            ))}
            {visibleAgenda.length === 0 && <p className="text-on-surface-variant">Aucun élément de calendrier ouvert à ce groupe pour le moment.</p>}
          </div>
        </section>
      </main>
      <BottomNavBar />
    </>
  );
}
