import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function PlanDeSalleDTaillPrestigeEdition() {
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

  const TABLES = [
    { id: 'T1', label: 'T1 — FAMILLE', pos: 'absolute top-28 left-20' },
    { id: 'T2', label: 'T2 — HONNEUR', pos: 'absolute top-28 right-20' },
    { id: 'T12', label: 'T12 — AMIS', pos: 'absolute bottom-24 left-1/3 -translate-x-1/2' },
    { id: 'T13', label: 'T13 — AMIS', pos: 'absolute bottom-24 right-1/3 translate-x-1/2' },
  ];

  return (
    <>
      <TopAppBar title="Floorplan" role="EDITORIALIST" />

      <main className="px-container-padding-mobile md:px-container-padding-desktop pt-[100px] pb-24 max-w-[1600px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* === LEFT: FLOORPLAN === */}
          <div className="lg:col-span-8 flex flex-col gap-8 relative">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">Floorplan</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 italic">Salle de Bal — Configuration Gala</p>
              </div>
              <div className="flex items-center gap-4 text-primary">
                <span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">zoom_in</span>
                <span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">zoom_out</span>
                <span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">drag_pan</span>
              </div>
            </div>

            <div className="relative bg-surface border border-outline-variant/50 w-full h-[800px] flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute inset-0 bg-[#fafafa] opacity-50"></div>

              {/* Buffet bar */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[60%] h-16 border border-outline-variant bg-surface flex items-center justify-between px-8">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Buffet &amp; Traiteur</span>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary/40">restaurant</span>
                  <span className="material-symbols-outlined text-primary/40">wine_bar</span>
                </div>
              </div>

              {/* Dance floor */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/20 bg-primary/5 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Piste de Danse</p>
                  <span className="material-symbols-outlined text-primary/30 text-4xl mt-2">star</span>
                </div>
              </div>

              {/* Tables drop zones */}
              {TABLES.map(table => {
                const seated = getTableGuests(table.id);
                const hasGuests = seated.length > 0;
                return (
                  <div
                    key={table.id}
                    onDrop={(e) => handleDrop(e, table.id)}
                    onDragOver={handleDragOver}
                    className={`${table.pos} flex flex-col items-center gap-2`}
                  >
                    <div className={`w-28 h-28 rounded-full border flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform ${hasGuests ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(119,90,25,0.3)]' : 'border-outline-variant bg-surface'}`}>
                      <div className="text-center">
                        <span className={`font-label-sm text-[10px] block ${hasGuests ? 'text-primary' : 'text-on-surface-variant'}`}>{table.label}</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">{seated.length} guests</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* === RIGHT: GUEST PANEL === */}
          <div className="lg:col-span-4 flex flex-col gap-8 pt-12 lg:pt-0">
            <div className="border border-outline-variant/50 p-6 bg-surface h-[800px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-headline-md text-on-background">Invités à placer</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{unassignedGuests.length} RESTANTS</span>
              </div>

              <div className="overflow-y-auto flex-grow space-y-3">
                {unassignedGuests.length === 0 ? (
                  <p className="text-on-surface-variant text-center font-body-md mt-10">Tous les invités sont placés ✓</p>
                ) : (
                  unassignedGuests.map(guest => (
                    <div
                      key={guest.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, guest.id)}
                      className="p-4 border border-outline-variant/30 bg-surface hover:border-primary cursor-grab active:cursor-grabbing transition-all flex justify-between items-center"
                    >
                      <div>
                        <p className="font-body-md text-on-background font-bold">{guest.name}</p>
                        <p className="font-label-sm text-on-surface-variant">{guest.group}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant">drag_indicator</span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 border-t border-outline-variant/30 pt-6">
                <h4 className="font-headline-sm text-headline-sm text-on-background mb-4">Détails des Tables</h4>
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                  {TABLES.map(({ id: tId }) => {
                    const tableGuests = getTableGuests(tId);
                    if (tableGuests.length === 0) return null;
                    return (
                      <div key={tId} className="bg-surface-container-low p-3 border border-outline-variant/20">
                        <p className="font-label-sm font-bold text-primary mb-2">{tId} ({tableGuests.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {tableGuests.map(g => (
                            <span key={g.id} className="text-[10px] px-2 py-1 bg-surface border border-outline-variant text-on-surface-variant uppercase flex items-center gap-1">
                              {g.name}
                              <button
                                onClick={() => assignGuestToTable(g.id, null)}
                                className="hover:text-error ml-1"
                                title="Retirer de la table"
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

      <BottomNavBar />
    </>
  );
}
