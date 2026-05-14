import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function GestionDesTablesMappingSpatial() {
  const tables = useStore(state => state.tables);
  const toggleTableSelection = useStore(state => state.toggleTableSelection);
  const guests = useStore(state => state.guests);
  const assignGuestToTable = useStore(state => state.assignGuestToTable);
  const tracks = useStore(state => state.tracks);
  const reorderTracks = useStore(state => state.reorderTracks);
  const addTrack = useStore(state => state.addTrack);

  const [draggedTrackIndex, setDraggedTrackIndex] = React.useState(null);

  // Invités non placés
  const unseatedGuests = guests.filter(g => g.tableId === null && g.status !== 'Declined');

  const handleDragStart = (e, guestId) => {
    e.dataTransfer.setData('guestId', guestId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Nécessaire pour autoriser le drop
  };

  const handleDrop = (e, tableId) => {
    e.preventDefault();
    const guestId = e.dataTransfer.getData('guestId');
    if (guestId) {
      assignGuestToTable(guestId, tableId);
    }
  };

  const handleTrackDragStart = (e, index) => {
    setDraggedTrackIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleTrackDrop = (e, index) => {
    e.preventDefault();
    if (draggedTrackIndex === null) return;
    
    const newTracks = [...tracks];
    const [draggedTrack] = newTracks.splice(draggedTrackIndex, 1);
    newTracks.splice(index, 0, draggedTrack);
    
    reorderTracks(newTracks);
    setDraggedTrackIndex(null);
  };

  return (
    <>
      

<TopAppBar title="Floorplan Mapping" role="PLANNER" />
<main className="px-container-padding-mobile md:px-container-padding-desktop pt-12 pb-24 max-w-[1600px] mx-auto">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 flex flex-col gap-8 relative">
<div className="flex justify-between items-end mb-4">
<div>
<h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">Floorplan</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2 italic">Salle de Bal - Configuration Gala</p>
</div>
<div className="flex items-center gap-4 text-primary">
<span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">zoom_in</span>
<span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">zoom_out</span>
<span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">drag_pan</span>
</div>
</div>

<div className="relative bg-surface border border-outline-variant/50 w-full h-[600px] flex items-center justify-center p-8 overflow-hidden" data-alt="A meticulously designed overhead floorplan view of an elegant grand ballroom setup for a gala dinner. The layout is minimalist and architectural, drawn with ultra-fine gold and dark grey linework on a pure white background. Round tables are arranged symmetrically with distinct seating markers. Soft, ethereal diffused lighting casts no shadows, maintaining a pristine, high-end editorial aesthetic typical of luxury wedding planning materials.">

{tables.map(t => {
  const tableGuests = guests.filter(g => g.tableId === t.id);
  
  // Mapping rudimentaire des classes Tailwind vers du CSS pur pour éviter le purge
  const getStyle = (topClass, leftClass) => {
    let top = '0px'; let left = '0px'; let bottom = 'auto'; let right = 'auto'; let transform = 'none';
    if(topClass === 'top-20') top = '5rem';
    if(topClass === 'bottom-32') { top = 'auto'; bottom = '8rem'; }
    if(leftClass === 'left-20') left = '5rem';
    if(leftClass === 'right-40') { left = 'auto'; right = '10rem'; }
    if(leftClass === 'left-1/2 -translate-x-1/2') { left = '50%'; transform = 'translateX(-50%)'; }
    return { top, left, bottom, right, transform };
  };
  
  return (
  <div 
    key={t.id} 
    style={getStyle(t.topPos, t.leftPos)}
    onClick={() => toggleTableSelection(t.id)}
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, t.id)}
    className={`absolute flex flex-col items-center justify-center ${t.sizeClass} rounded-full border bg-surface group cursor-pointer transition-all ${t.selected ? 'border-primary ring-4 ring-primary/20 scale-105 shadow-xl' : 'border-outline-variant hover:border-primary hover:scale-105'}`}
  >
    <span className={`font-label-sm text-label-sm ${t.selected ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{t.name}</span>
    <span className="text-[10px] text-secondary">{tableGuests.length} / {t.chairs}</span>
    
    {t.chairs >= 4 && (
      <>
        <div className={`absolute -top-3 w-4 h-4 rounded-full border bg-surface transition-colors ${t.selected ? 'border-primary' : 'border-outline-variant'}`}></div>
        <div className={`absolute -bottom-3 w-4 h-4 rounded-full border bg-surface transition-colors ${t.selected ? 'border-primary' : 'border-outline-variant'}`}></div>
        <div className={`absolute -left-3 w-4 h-4 rounded-full border bg-surface transition-colors ${t.selected ? 'border-primary' : 'border-outline-variant'}`}></div>
        <div className={`absolute -right-3 w-4 h-4 rounded-full border bg-surface transition-colors ${t.selected ? 'border-primary' : 'border-outline-variant'}`}></div>
      </>
    )}
    {t.chairs === 6 && (
      <>
        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border bg-surface transition-colors ${t.selected ? 'border-primary' : 'border-outline-variant'}`}></div>
        <div className={`absolute bottom-2 left-2 w-4 h-4 rounded-full border bg-surface transition-colors ${t.selected ? 'border-primary' : 'border-outline-variant'}`}></div>
      </>
    )}
  </div>
)})}
</div>
</div>

<div className="lg:col-span-4 flex flex-col gap-12 pt-12 lg:pt-0">

<div className="relative bg-surface/80 backdrop-blur-md border border-outline-variant/50 p-6 shadow-sm hover:border-primary transition-colors flex flex-col h-[400px]">
<div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-4">
<h3 className="font-headline-md text-headline-md text-on-background">Live Deck DJ</h3>
<div className="flex items-center gap-2 text-error">
<span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<span className="font-label-sm text-label-sm tracking-widest">ON AIR</span>
</div>
</div>
<div className="overflow-y-auto flex-1 pr-2 space-y-2">
{tracks.length === 0 ? (
  <p className="text-on-surface-variant italic text-sm text-center mt-10">La tracklist est vide. (API prête à recevoir les morceaux)</p>
) : (
  tracks.map((track, index) => (
    <div 
      key={track.id}
      draggable
      onDragStart={(e) => handleTrackDragStart(e, index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleTrackDrop(e, index)}
      className={`p-3 border border-outline-variant/50 bg-surface rounded-md cursor-grab active:cursor-grabbing hover:bg-surface-container-low transition-colors ${index === 0 ? 'border-primary ring-1 ring-primary/20' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-outline-variant">drag_indicator</span>
          {index === 0 && <span className="material-symbols-outlined text-primary text-sm animate-pulse">graphic_eq</span>}
          <div>
            <p className={`font-body-md text-body-md font-bold ${index === 0 ? 'text-primary' : 'text-on-background'}`}>{track.title}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">{track.artist}</p>
          </div>
        </div>
        <span className="text-xs text-on-surface-variant">#{index + 1}</span>
      </div>
      {track.directives && index === 0 && (
        <div className="bg-primary/5 border border-primary/20 p-2 mt-3 text-sm">
          <div className="flex items-center gap-1 text-primary mb-1">
            <span className="material-symbols-outlined text-xs">warning</span>
            <span className="font-label-sm uppercase text-[10px]">Directives</span>
          </div>
          <p className="text-on-surface-variant italic">{track.directives}</p>
        </div>
      )}
    </div>
  ))
)}
</div>
<button onClick={() => addTrack({ title: 'Nouveau Morceau', artist: 'Artiste', directives: 'Nouvelle directive...' })} className="mt-4 w-full border border-dashed border-outline-variant text-on-surface-variant py-2 rounded-md hover:bg-surface-variant hover:text-on-surface transition-colors text-sm font-medium">
  + Ajouter à la Tracklist
</button>
</div>

<div className="border border-outline-variant/50 p-6 bg-surface">
<div className="flex justify-between items-center mb-6">
<h3 className="font-headline-md text-headline-md text-on-background">À Placer</h3>
<span className="font-label-sm text-label-sm text-on-surface-variant">{unseatedGuests.length} EN ATTENTE</span>
</div>
<ul className="space-y-6">
{unseatedGuests.map(guest => (
  <li 
    key={guest.id} 
    draggable
    onDragStart={(e) => handleDragStart(e, guest.id)}
    className="flex justify-between items-center border-b border-outline-variant/20 pb-4 last:border-0 last:pb-0 hover:bg-surface-container-lowest transition-colors p-2 rounded-sm -mx-2 cursor-grab active:cursor-grabbing"
  >
    <div>
      <p className="font-body-lg text-body-lg text-on-background">{guest.name}</p>
      <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{guest.circle}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-on-surface-variant">drag_indicator</span>
    </div>
  </li>
))}
</ul>
</div>
</div>
</div>
</main>

<BottomNavBar />

    </>
  );
}
