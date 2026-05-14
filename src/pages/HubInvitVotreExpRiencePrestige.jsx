import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function HubInvitVotreExpRiencePrestige() {
  const { agendaItems, updateGuestStatus, guests } = useStore();
  // Theodore Montague est l'invité VIP de démonstration (id=2)
  const demoGuest = guests.find(g => g.id === 2) || { name: 'Théodore Montague', status: 'Pending' };
  const publicAgenda = agendaItems.filter(item => !item.isRestricted);

  return (
    <>
      <TopAppBar title="Hub Invité" role="EDITORIALIST" />

<main className="w-full max-w-2xl mx-auto flex flex-col gap-12 pt-20 pb-24 px-container-padding-mobile">

<section className="pt-8 pb-4">
<p className="font-label-sm text-label-sm text-primary uppercase tracking-[0.2em] mb-4">Hub Invité</p>
<h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface">Le Programme<br/>du Week-end.</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-6 max-w-[85%]">Votre itinéraire personnalisé. Laissez-vous guider par l'élégance de chaque instant.</p>
</section>

{/* RSVP Section - connecté au store Zustand */}
<section className="bg-surface border border-primary/20 rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm">
  <h2 className="font-headline-md text-headline-md text-primary">Serez-vous parmi nous ?</h2>
  <p className="font-label-sm text-label-sm text-on-surface-variant">{demoGuest.name} — Statut actuel : <span className={`font-bold ${demoGuest.status === 'Confirmed' ? 'text-primary' : demoGuest.status === 'Declined' ? 'text-error' : 'text-secondary'}`}>{demoGuest.status}</span></p>
  <div className="flex gap-4 w-full mt-2">
    <button
      onClick={() => updateGuestStatus(2, 'Confirmed')}
      className={`flex-1 py-3 rounded-full font-label-sm uppercase tracking-widest transition-all ${demoGuest.status === 'Confirmed' ? 'bg-primary text-on-primary ring-2 ring-primary/30' : 'bg-surface-container text-on-surface border border-primary hover:bg-primary hover:text-on-primary'}`}
    >
      ✓ J'accepte
    </button>
    <button
      onClick={() => updateGuestStatus(2, 'Declined')}
      className={`flex-1 py-3 rounded-full font-label-sm uppercase tracking-widest border transition-all ${demoGuest.status === 'Declined' ? 'bg-error-container text-on-error-container border-error' : 'bg-surface-container text-on-surface border-outline-variant hover:bg-surface-container-high'}`}
    >
      Je décline
    </button>
  </div>
</section>

<section>
<div className="flex items-center gap-4 mb-8">
<div className="h-[1px] flex-1 bg-outline-variant/50"></div>
<h2 className="font-headline-md text-headline-md text-on-surface italic">Timeline Perso</h2>
<div className="h-[1px] w-12 bg-outline-variant/50"></div>
</div>
<div className="relative pl-8 border-l-[0.5px] border-outline-variant/50 ml-4 flex flex-col gap-10">
  {publicAgenda.map((item, idx) => (
    <div key={item.id} className="relative group cursor-pointer">
      <div className={`absolute -left-[37px] top-1 w-[10px] h-[10px] rounded-full ring-8 ring-surface-bright transition-transform group-hover:scale-110 ${item.isDone ? 'bg-primary' : 'border-[0.5px] border-primary bg-surface-bright'}`}></div>
      <p className={`font-label-sm text-label-sm mb-2 ${item.isDone ? 'text-primary' : 'text-on-surface-variant'}`}>{item.time} {item.isDone ? '— TERMINÉ' : '— À VENIR'}</p>
      <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] mb-1">{item.title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{item.description}</p>
    </div>
  ))}
</div>
</section>

<section className="grid grid-cols-12 gap-4">

<div className="col-span-12 md:col-span-7 border-[0.5px] border-outline-variant p-8 flex flex-col justify-between items-start hover:bg-surface-container-low transition-colors duration-300">
<div>
<span className="material-symbols-outlined text-primary mb-6" style={{ fontVariationSettings: '"FILL" 0' }}>restaurant_menu</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-3">La Carte</h3>
<p className="font-body-md text-body-md text-on-surface-variant text-sm mb-8">Découvrez la partition culinaire orchestrée pour la soirée.</p>
</div>
<button className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest border-b-[0.5px] border-on-surface pb-1 hover:text-primary hover:border-primary transition-colors">Consulter le menu</button>
</div>

<div className="col-span-12 md:col-span-5 border-[0.5px] border-outline-variant bg-surface-container-low p-8 flex flex-col justify-between items-start">
<div>
<span className="material-symbols-outlined text-on-surface-variant mb-6" style={{ fontVariationSettings: '"FILL" 0' }}>near_me</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-3">Cortège</h3>
<p className="font-body-md text-body-md text-on-surface-variant text-sm mb-8">Rejoindre la suite de la réception.</p>
</div>
<button className="font-label-sm text-label-sm text-primary uppercase tracking-widest border-b-[0.5px] border-primary pb-1 hover:opacity-70 transition-opacity">Naviguer</button>
</div>

<div className="col-span-12 bg-primary-container p-8 flex flex-col items-center text-center mt-4 cursor-pointer hover:bg-primary-fixed transition-colors duration-300 group rounded-2xl">
<div className="w-16 h-16 rounded-full bg-on-primary-container/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
<span className="material-symbols-outlined text-on-primary-container text-3xl" style={{ fontVariationSettings: '"FILL" 0' }}>add</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-primary-container mb-2">Capturer l'Instant</h3>
<p className="font-body-md text-body-md text-on-primary-container/80 italic text-sm">Partagez vos photographies directement dans la galerie privée.</p>
</div>
</section>
</main>

<BottomNavBar />
    </>
  );
}
