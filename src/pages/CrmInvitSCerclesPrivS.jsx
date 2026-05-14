import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function CrmInvitSCerclesPrivS() {
  const guests = useStore(state => state.guests);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL CIRCLES');

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'ALL CIRCLES' || guest.circle.toUpperCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const confirmedCount = guests.filter(g => g.status === 'Confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'Pending').length;
  const dietCount = guests.filter(g => g.diet).length;

  return (
    <>
      <TopAppBar title="Circles CRM" role="PLANNER" />

<main className="flex-grow w-full pt-20 px-container-padding-mobile md:px-container-padding-desktop pb-32">

<section className="mt-16 md:mt-32 mb-section-gap flex flex-col md:flex-row justify-between items-end gap-8">
<div className="w-full md:w-2/3">
<h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">The Guest List</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant md:w-3/4 leading-relaxed">Orchestrate your invitations with precision. Segment by Circles to define visibility for sensitive itinerary details.</p>
</div>
<div className="flex gap-4 w-full md:w-auto">
<button className="flex-1 md:flex-none border border-outline text-on-surface py-3 px-6 text-label-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="upload_file">upload_file</span>
                    Import CSV
                </button>
<button className="flex-1 md:flex-none bg-primary text-on-primary py-3 px-6 text-label-sm uppercase tracking-widest hover:bg-surface-tint transition-colors duration-300 flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                    Add Guest
                </button>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-section-gap">
<div className="col-span-1 md:col-span-2 border-[0.5px] border-outline-variant p-8 bg-surface-bright">
<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-4">Total Attending</h3>
<div className="flex items-baseline gap-4">
<span className="font-display-lg text-display-lg text-primary">{confirmedCount}</span>
<span className="font-body-md text-body-md text-outline italic">of {guests.length} invited</span>
</div>
<div className="w-full h-px bg-outline-variant mt-8 relative">
<div className="absolute left-0 top-0 h-full bg-primary" style={{ width: `${(confirmedCount / Math.max(1, guests.length)) * 100}%` }}></div>
</div>
</div>
<div className="border-[0.5px] border-outline-variant p-8 bg-surface-bright flex flex-col justify-center">
<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Pending RSVPs</h3>
<span className="font-headline-lg text-headline-lg text-on-surface">{pendingCount}</span>
</div>
<div className="border-[0.5px] border-outline-variant p-8 bg-surface-bright flex flex-col justify-center">
<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2">Dietary Reqs</h3>
<span className="font-headline-lg text-headline-lg text-on-surface">{dietCount}</span>
</div>
</section>

<section className="mb-section-gap">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">

<div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
{['ALL CIRCLES', 'VIP', 'FAMILY', 'FRIENDS'].map(filter => (
  <button 
    key={filter}
    onClick={() => setActiveFilter(filter)}
    className={`px-4 py-2 border-[0.5px] font-label-sm text-label-sm whitespace-nowrap transition-colors ${activeFilter === filter ? 'border-primary bg-primary-fixed-dim/20 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-outline'}`}
  >
    {filter}
  </button>
))}
</div>

<div className="relative w-full md:w-64 border-b-[0.5px] border-outline-variant pb-1">
<span className="material-symbols-outlined absolute left-0 bottom-2 text-on-surface-variant" data-icon="search">search</span>
<input 
  className="w-full bg-transparent border-none focus:ring-0 pl-8 font-body-md text-body-md text-on-surface placeholder-on-surface-variant italic" 
  placeholder="Search guests..." 
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
</div>
</div>

<div className="grid grid-cols-12 gap-4 border-b-[0.5px] border-outline-variant pb-4 mb-4 font-label-sm text-label-sm text-on-surface-variant hidden md:grid">
<div className="col-span-4 pl-4">GUEST NAME</div>
<div className="col-span-3">CIRCLE</div>
<div className="col-span-2">RSVP STATUS</div>
<div className="col-span-2">AGENDA VISIBILITY</div>
<div className="col-span-1 text-right pr-4">ACTIONS</div>
</div>

<div className="flex flex-col gap-4 md:gap-0">
{filteredGuests.map(guest => (
<div key={guest.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4 md:border-b-[0.5px] border-outline-variant hover:bg-surface-container-low transition-colors duration-300 border-[0.5px] md:border-none p-4 md:p-0">
<div className="col-span-1 md:col-span-4 flex items-center gap-4 md:pl-4">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border-[0.5px] border-outline-variant">
<span className="font-headline-md text-headline-md text-on-surface-variant">{guest.name.charAt(0)}</span>
</div>
<div>
<p className="font-headline-md text-headline-md text-on-surface leading-tight">{guest.name}</p>
<p className="font-body-md text-body-md text-on-surface-variant text-sm italic">{guest.group}</p>
</div>
</div>
<div className="col-span-1 md:col-span-3">
<span className={`inline-block px-3 py-1 border-[0.5px] font-label-sm text-[10px] tracking-widest uppercase ${guest.circle === 'VIP' ? 'border-primary text-primary' : 'border-outline-variant text-on-surface-variant'}`}>{guest.circle}</span>
</div>
<div className="col-span-1 md:col-span-2 flex items-center gap-2">
<div className={`w-2 h-2 rounded-full ${guest.status === 'Confirmed' ? 'bg-primary' : 'border border-outline'}`}></div>
<span className="font-body-md text-body-md text-on-surface-variant italic">{guest.status}</span>
</div>
<div className="col-span-1 md:col-span-2 flex items-center gap-2">
<button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[20px]" data-icon={guest.agendaVis ? 'visibility' : 'visibility_off'}>{guest.agendaVis ? 'visibility' : 'visibility_off'}</span>
<span className="font-label-sm text-label-sm border-b-[0.5px] border-transparent hover:border-primary text-outline">{guest.agendaVis ? 'Full Access' : 'Ceremony Only'}</span>
</button>
</div>
<div className="col-span-1 md:col-span-1 text-right md:pr-4">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
))}
</div>
</section>
</main>
<BottomNavBar />

    </>
  );
}
