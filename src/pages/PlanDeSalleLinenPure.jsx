import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function PlanDeSalleLinenPure() {
  const { guests, assignGuestToTable } = useStore();
  
  const handleDragStart = (e, guestId) => {
    e.dataTransfer.setData('guestId', guestId);
  };

  const handleDrop = (e, tableId) => {
    e.preventDefault();
    const guestId = e.dataTransfer.getData('guestId');
    if (guestId) {
      assignGuestToTable(Number(guestId), tableId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const unassignedGuests = guests.filter(g => !g.table && g.status !== 'Declined');
  const getTableGuests = (tableId) => guests.filter(g => g.table === tableId);

  return (
    <>
      <TopAppBar title="Spatial Mapping" role="WEDDING COCKPIT" />
      
<div className="flex-1 flex flex-col w-full min-h-screen pt-[72px] pb-[80px]">

<main className="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-section-padding py-gutter md:py-section-padding pb-32 md:pb-section-padding">

<div className="mb-section-padding flex flex-col gap-4">
<h2 className="font-headline-xl text-headline-xl text-on-background">Spatial Mapping</h2>
<p className="font-body-lg text-body-lg text-secondary max-w-2xl">Manage event flow and live positioning. Adjust the floorplan in real-time to accommodate late arrivals and dynamic program shifts.</p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 flex flex-col gap-unit">
<div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 flex-1 flex flex-col min-h-[600px] border border-outline-variant/20 relative overflow-hidden group">
<div className="flex justify-between items-center mb-6 z-10 relative">
<h3 className="font-headline-md text-headline-md text-on-surface">Main Hall</h3>
<button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px]">edit</span>
                                Edit Layout
                            </button>
</div>

<div className="flex-1 w-full rounded-lg bg-surface-container-low overflow-hidden relative border border-outline-variant/30 flex items-center justify-center bg-cover bg-center" style={{  }}>
<div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px]"></div>

<div 
  className="absolute top-[20%] left-[30%] flex flex-col items-center gap-1"
  onDrop={(e) => handleDrop(e, 'T12')}
  onDragOver={handleDragOver}
>
  <div className={`w-24 h-24 rounded-full border ${getTableGuests('T12').length > 0 ? 'border-primary bg-primary/20' : 'border-primary bg-surface/80'} backdrop-blur-md flex flex-col items-center justify-center text-primary font-label-sm text-label-sm cursor-pointer hover:scale-105 transition-transform`}>
    <span>T12</span>
    <span className="text-[10px] opacity-70">{getTableGuests('T12').length} guests</span>
  </div>
</div>

<div 
  className="absolute top-[25%] left-[60%] flex flex-col items-center gap-1"
  onDrop={(e) => handleDrop(e, 'T14')}
  onDragOver={handleDragOver}
>
  <div className={`w-24 h-24 rounded-full border ${getTableGuests('T14').length > 0 ? 'border-primary bg-primary/20' : 'border-primary bg-surface/80'} backdrop-blur-md flex flex-col items-center justify-center text-primary font-label-sm text-label-sm cursor-pointer hover:scale-105 transition-transform`}>
    <span>T14</span>
    <span className="text-[10px] opacity-70">{getTableGuests('T14').length} guests</span>
  </div>
</div>

<div className="absolute bottom-[30%] left-[45%] w-32 h-32 border border-outline bg-surface-container-lowest/50 backdrop-blur-sm flex items-center justify-center">
<span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">Dance Floor</span>
</div>
<div className="absolute bottom-[15%] left-[45%] w-32 h-12 border border-outline bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center">
<span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">DJ Booth</span>
</div>
</div>

<div className="mt-6 flex flex-wrap gap-4 z-10 relative">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full border border-primary"></div>
<span className="font-label-sm text-label-sm text-secondary">Available Table</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-primary border border-primary"></div>
<span className="font-label-sm text-label-sm text-secondary">Occupied Table</span>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 flex flex-col gap-gutter">

<div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20 flex-1 flex flex-col">
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline-md text-headline-md text-on-surface">To Assign</h3>
<span className="px-3 py-1 bg-surface-container-high text-on-surface font-label-sm text-label-sm rounded-full">{unassignedGuests.length}</span>
</div>

<div className="overflow-y-auto flex-grow space-y-3 mb-6 max-h-[300px]">
  {unassignedGuests.length === 0 ? (
    <p className="text-secondary text-center font-body-md mt-10">All guests assigned.</p>
  ) : (
    unassignedGuests.map(guest => (
      <div 
        key={guest.id}
        draggable
        onDragStart={(e) => handleDragStart(e, guest.id)}
        className="p-4 border border-outline-variant/30 bg-surface rounded-lg hover:border-primary cursor-grab active:cursor-grabbing transition-all flex justify-between items-center shadow-sm"
      >
        <div>
          <p className="font-body-md text-on-surface font-medium">{guest.name}</p>
          <p className="font-label-sm text-secondary">{guest.group}</p>
        </div>
        <span className="material-symbols-outlined text-outline-variant">drag_indicator</span>
      </div>
    ))
  )}
</div>

<div className="border-t border-outline-variant/20 pt-6">
  <h4 className="font-body-lg text-body-lg text-on-surface mb-4 font-medium">Table Summary</h4>
  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
    {['T12', 'T14'].map(tId => {
      const tableGuests = getTableGuests(tId);
      if(tableGuests.length === 0) return null;
      return (
        <div key={tId} className="bg-surface p-3 rounded-lg border border-outline-variant/20">
          <p className="font-label-sm font-bold text-primary mb-2">{tId} ({tableGuests.length})</p>
          <div className="flex flex-wrap gap-2">
            {tableGuests.map(g => (
              <span key={g.id} className="text-[10px] px-2 py-1 bg-surface-container-low rounded-md border border-outline-variant/30 text-secondary uppercase flex items-center gap-1">
                {g.name}
                <button 
                  onClick={() => assignGuestToTable(g.id, null)} 
                  className="hover:text-error ml-1 transition-colors"
                  title="Remove from table"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</div>

</div>
</div>

</div>
</main>
</div>

<BottomNavBar />

    </>
  );
}
