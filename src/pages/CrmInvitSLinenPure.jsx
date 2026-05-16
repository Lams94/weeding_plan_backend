import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';
import { QRCodeSVG } from 'qrcode.react';

export default function CrmInvitSLinenPure() {
  const guests = useStore(state => state.guests);
  const updateGuestStatus = useStore(state => state.updateGuestStatus);
  const addGuest = useStore(state => state.addGuest);
  const activeWedding = useStore(state => state.activeWedding);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Circles');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedGuestForQr, setSelectedGuestForQr] = useState(null);
  const [newGuest, setNewGuest] = useState({ name: '', circle: 'Friends', email: '' });

  const handleAddGuest = (e) => {
    e.preventDefault();
    if(newGuest.name.trim() === '') return;
    addGuest(newGuest);
    setIsModalOpen(false);
    setNewGuest({ name: '', circle: 'Friends', email: '' });
  };

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All Circles' || g.circle === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const totalAttending = guests.filter(g => g.status === 'Confirmed').length;
  const pendingRsvps = guests.filter(g => g.status === 'Pending').length;
  const dietaryReqs = guests.filter(g => g.diet).length;
  const invitationLink = selectedGuestForQr && activeWedding
    ? `${window.location.origin}/invitation/${activeWedding.id}/${selectedGuestForQr.id}`
    : '';

  return (
    <>
      <TopAppBar title="Guest Hub - Linen Pure" role="PLANNER" />



<main className="flex-1 w-full h-full overflow-y-auto md:ml-64 pt-20 pb-28 md:pt-12 md:pb-12 bg-background relative">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-section-padding">

<div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h2 className="font-headline-xl text-headline-xl text-on-background mb-4">The Guest List</h2>
<p className="font-body-lg text-body-lg text-secondary max-w-2xl">Manage your circles, track RSVPs, and curate the perfect gathering with understated elegance.</p>
</div>
<button 
  onClick={() => setIsModalOpen(true)}
  className="inline-flex items-center justify-center space-x-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-full hover:bg-inverse-primary transition-colors duration-300 font-label-sm text-label-sm"
>
  <span className="material-symbols-outlined text-sm">person_add</span>
  <span>Add Guest</span>
</button>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-16">

<div className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-between">
<span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: '"FILL" 1' }}>how_to_reg</span>
<div>
<p className="font-label-sm text-label-sm text-secondary mb-1">Total Attending</p>
<p className="font-headline-lg text-headline-lg text-on-background">{totalAttending}</p>
</div>
</div>

<div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between">
<span className="material-symbols-outlined text-tertiary mb-4">hourglass_empty</span>
<div>
<p className="font-label-sm text-label-sm text-secondary mb-1">Pending RSVPs</p>
<p className="font-headline-lg text-headline-lg text-on-background">{pendingRsvps}</p>
</div>
</div>

<div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between">
<span className="material-symbols-outlined text-primary-container mb-4">restaurant</span>
<div>
<p className="font-label-sm text-label-sm text-secondary mb-1">Dietary Reqs</p>
<p className="font-headline-lg text-headline-lg text-on-background">{dietaryReqs}</p>
</div>
</div>
</div>

<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">

<div className="flex flex-wrap gap-2">
  {['All Circles', 'VIP', 'Family', 'Friends'].map(filter => (
    <button 
      key={filter}
      onClick={() => setActiveFilter(filter)}
      className={`px-5 py-2 rounded-full font-label-sm text-label-sm transition-colors ${activeFilter === filter ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-highest text-secondary hover:bg-surface-variant'}`}
    >
      {filter}
    </button>
  ))}
</div>

<div className="relative w-full md:w-72">
<span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline ml-2">search</span>
<input 
  className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 pl-10 py-2 font-body-md text-body-md text-on-background placeholder-secondary transition-colors outline-none" 
  placeholder="Search guests..." 
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
</div>
</div>

<div className="bg-surface rounded-xl">

<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-outline-variant/30 text-secondary font-label-sm text-label-sm uppercase tracking-widest">
<div className="col-span-4">Guest Name</div>
<div className="col-span-2">Circle</div>
<div className="col-span-3">RSVP Status</div>
<div className="col-span-2">Agenda Vis.</div>
<div className="col-span-1 text-right">Actions</div>
</div>

<div className="divide-y divide-outline-variant/20">

{filteredGuests.map(guest => (
  <div key={guest.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-surface-container-low/50 transition-colors">
    <div className="col-span-1 md:col-span-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary font-headline-md">{guest.name.charAt(0)}</div>
      <div>
        <p className="font-body-md text-body-md font-medium text-on-surface">{guest.name}</p>
        <p className="font-label-sm text-label-sm text-secondary md:hidden">{guest.circle} • {guest.status}</p>
      </div>
    </div>
    <div className="hidden md:flex col-span-2 items-center">
      <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full font-label-sm text-label-sm">{guest.circle}</span>
    </div>
    <div className="hidden md:flex col-span-3 items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${guest.status === 'Confirmed' ? 'bg-primary' : 'bg-outline-variant'}`}></span>
      <span className={`font-body-md text-body-md ${guest.status === 'Confirmed' ? 'text-on-surface' : 'text-secondary'}`}>
        {guest.status} 
        {guest.diet && <span className="text-error text-sm ml-2 material-symbols-outlined align-middle" style={{ fontSize: '16px' }}>restaurant</span>}
      </span>
    </div>
    <div className={`hidden md:flex col-span-2 items-center ${guest.agendaVis ? 'text-secondary' : 'text-outline-variant'}`}>
      <span className="material-symbols-outlined text-lg">{guest.agendaVis ? 'visibility' : 'visibility_off'}</span>
    </div>
    <div className="hidden md:flex col-span-1 justify-end gap-3">
      <button 
        onClick={() => { setSelectedGuestForQr(guest); setQrModalOpen(true); }}
        className="text-secondary hover:text-primary transition-colors tooltip-trigger relative" title="Générer QR Pass"
      >
        <span className="material-symbols-outlined">qr_code</span>
      </button>
      <button className="text-tertiary hover:text-primary transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
    </div>
  </div>
))}
</div>
</div>
</div>
</main>
<BottomNavBar />

{/* Add Guest Modal */}
{isModalOpen && (
  <div className="fixed inset-0 z-[110] bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-surface border border-outline-variant rounded-xl p-8 max-w-md w-full shadow-2xl animate-[fade-in-up_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">New Guest</h3>
        <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <form onSubmit={handleAddGuest} className="space-y-6">
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Full Name</label>
          <input 
            type="text" 
            required
            className="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 font-body-md text-on-surface focus:ring-1 focus:ring-primary"
            value={newGuest.name}
            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
            placeholder="e.g. Jane Doe"
          />
        </div>
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Circle</label>
          <select 
            className="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 font-body-md text-on-surface focus:ring-1 focus:ring-primary"
            value={newGuest.circle}
            onChange={(e) => setNewGuest({...newGuest, circle: e.target.value})}
          >
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Email Address</label>
          <input 
            type="email" 
            className="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 font-body-md text-on-surface focus:ring-1 focus:ring-primary"
            value={newGuest.email}
            onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
            placeholder="Optional"
          />
        </div>
        <div className="pt-4 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-primary text-on-primary px-6 py-2 rounded-sm font-label-sm text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Add Guest
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* QR Code Modal */}
{qrModalOpen && selectedGuestForQr && (
  <div className="fixed inset-0 z-[120] bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-surface border border-outline-variant rounded-xl p-10 max-w-sm w-full shadow-2xl animate-[scale-in_0.3s_ease-out] flex flex-col items-center text-center">
      <div className="w-full flex justify-end mb-4">
        <button onClick={() => setQrModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Passeport Numérique</p>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-8">{selectedGuestForQr.name}</h3>
      
      <div className="bg-white p-4 rounded-xl shadow-inner border border-outline-variant/30 mb-8">
        <QRCodeSVG 
          value={invitationLink || selectedGuestForQr.id} 
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"}
          includeMargin={false}
        />
      </div>
      
      <p className="font-body-md text-body-md text-on-surface-variant italic mb-4">À scanner pour ouvrir le faire-part et répondre à l'invitation.</p>
      {invitationLink && (
        <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 mb-5 text-left">
          <p className="text-xs uppercase tracking-widest text-secondary mb-1">Lien faire-part</p>
          <p className="text-xs text-on-surface break-all">{invitationLink}</p>
        </div>
      )}
      
      <button 
        onClick={() => window.print()}
        className="w-full bg-surface-container-high text-on-surface border border-outline-variant px-6 py-3 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-variant transition-colors flex justify-center items-center gap-2 mb-3"
      >
        <span className="material-symbols-outlined text-sm">print</span>
        Imprimer le Pass
      </button>
      
      <button 
        onClick={() => {
          if (invitationLink && navigator.clipboard) navigator.clipboard.writeText(invitationLink);
          useStore.getState().showToast(`Lien du faire-part prêt pour ${selectedGuestForQr.name}`);
          setQrModalOpen(false);
        }}
        className="w-full bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">send</span>
        Copier le lien Faire-Part
      </button>
    </div>
  </div>
)}

    </>
  );
}
