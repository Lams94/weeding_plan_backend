import React, { useMemo, useRef, useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const parsePercent = (value, fallback) => {
  const match = String(value ?? '').match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : fallback;
};
const parseShape = (sizeClass = '') => {
  if (sizeClass.includes('rect')) return 'rect';
  if (sizeClass.includes('bar')) return 'bar';
  return 'round';
};
const parseSize = (sizeClass = '') => {
  const match = String(sizeClass).match(/:(\d+)/);
  if (match) return Number(match[1]);
  if (sizeClass.includes('w-40')) return 160;
  if (sizeClass.includes('w-32')) return 128;
  return 96;
};
const makeSizeClass = (shape, size) => `${shape}:${size}`;

export default function GestionDesTablesMappingSpatial() {
  const canvasRef = useRef(null);
  const tables = useStore(state => state.tables);
  const guests = useStore(state => state.guests);
  const assignGuestToTable = useStore(state => state.assignGuestToTable);
  const addTable = useStore(state => state.addTable);
  const updateTable = useStore(state => state.updateTable);
  const deleteTable = useStore(state => state.deleteTable);

  const [selectedTableId, setSelectedTableId] = useState(null);
  const [draggedTableId, setDraggedTableId] = useState(null);

  const selectedTable = tables.find(table => table.id === selectedTableId);
  const unseatedGuests = guests.filter(guest => !guest.tableId && guest.status !== 'Declined');
  const seatedCount = guests.filter(guest => guest.tableId).length;
  const capacity = tables.reduce((sum, table) => sum + (Number(table.chairs) || 0), 0);

  const tableGuests = useMemo(() => {
    return tables.reduce((acc, table) => {
      acc[table.id] = guests.filter(guest => guest.tableId === table.id);
      return acc;
    }, {});
  }, [guests, tables]);

  const positionFromEvent = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      leftPos: String(clamp(((event.clientX - rect.left) / rect.width) * 100, 4, 96).toFixed(1)),
      topPos: String(clamp(((event.clientY - rect.top) / rect.height) * 100, 5, 95).toFixed(1))
    };
  };

  const handleTableDrop = (event) => {
    event.preventDefault();
    const tableId = event.dataTransfer.getData('tableId') || draggedTableId;
    if (!tableId) return;
    updateTable(tableId, positionFromEvent(event));
    setDraggedTableId(null);
  };

  const handleGuestDrop = (event, tableId) => {
    event.preventDefault();
    event.stopPropagation();
    const guestId = event.dataTransfer.getData('guestId');
    if (guestId) assignGuestToTable(guestId, tableId);
  };

  const createTable = (shape = 'round') => {
    const next = tables.length + 1;
    addTable({
      name: shape === 'bar' ? 'Buffet' : `Table ${next}`,
      chairs: shape === 'bar' ? 0 : 8,
      topPos: 50,
      leftPos: 50,
      sizeClass: makeSizeClass(shape, shape === 'bar' ? 180 : 104)
    });
  };

  const updateSelected = (patch) => {
    if (selectedTable) updateTable(selectedTable.id, patch);
  };

  return (
    <>
      <TopAppBar title="Editeur plan de salle" role="PLANNER" />
      <main className="px-4 md:px-10 pt-24 pb-28 max-w-[1600px] mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Placement invités</p>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">Plan de salle interactif</h1>
            <p className="text-on-surface-variant mt-2 max-w-2xl">Deplace les tables, ajoute les zones utiles et glisse les invites sur la bonne table.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 min-w-[320px]">
            <div className="bg-surface border border-outline-variant rounded-lg p-3">
              <p className="text-xs uppercase tracking-widest text-secondary">Places</p>
              <p className="font-semibold text-on-surface">{seatedCount} / {guests.length}</p>
            </div>
            <div className="bg-surface border border-outline-variant rounded-lg p-3">
              <p className="text-xs uppercase tracking-widest text-secondary">Capacite</p>
              <p className="font-semibold text-on-surface">{capacity}</p>
            </div>
            <div className="bg-surface border border-outline-variant rounded-lg p-3">
              <p className="text-xs uppercase tracking-widest text-secondary">Attente</p>
              <p className="font-semibold text-on-surface">{unseatedGuests.length}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_340px] gap-5">
          <aside className="bg-surface border border-outline-variant rounded-xl p-4 h-fit">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">Outils</p>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => createTable('round')} className="rounded-md border border-outline-variant px-4 py-3 text-left hover:border-primary">
                <span className="material-symbols-outlined align-middle mr-2 text-[18px]">radio_button_unchecked</span>
                Table ronde
              </button>
              <button onClick={() => createTable('rect')} className="rounded-md border border-outline-variant px-4 py-3 text-left hover:border-primary">
                <span className="material-symbols-outlined align-middle mr-2 text-[18px]">crop_16_9</span>
                Table rectangle
              </button>
              <button onClick={() => createTable('bar')} className="rounded-md border border-outline-variant px-4 py-3 text-left hover:border-primary">
                <span className="material-symbols-outlined align-middle mr-2 text-[18px]">countertops</span>
                Zone buffet / DJ
              </button>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Table selectionnee</p>
              {selectedTable ? (
                <div className="space-y-3">
                  <label className="block">
                    <span className="block text-xs text-secondary mb-1">Nom</span>
                    <input value={selectedTable.name} onChange={event => updateSelected({ name: event.target.value })} className="w-full border border-outline-variant rounded-md bg-surface px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="block text-xs text-secondary mb-1">Chaises</span>
                    <input type="number" min="0" value={selectedTable.chairs} onChange={event => updateSelected({ chairs: Number(event.target.value) || 0 })} className="w-full border border-outline-variant rounded-md bg-surface px-3 py-2" />
                  </label>
                  <label className="block">
                    <span className="block text-xs text-secondary mb-1">Forme</span>
                    <select value={parseShape(selectedTable.sizeClass)} onChange={event => updateSelected({ sizeClass: makeSizeClass(event.target.value, parseSize(selectedTable.sizeClass)) })} className="w-full border border-outline-variant rounded-md bg-surface px-3 py-2">
                      <option value="round">Ronde</option>
                      <option value="rect">Rectangle</option>
                      <option value="bar">Zone</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="block text-xs text-secondary mb-1">Taille</span>
                    <input type="range" min="72" max="190" value={parseSize(selectedTable.sizeClass)} onChange={event => updateSelected({ sizeClass: makeSizeClass(parseShape(selectedTable.sizeClass), Number(event.target.value)) })} className="w-full" />
                  </label>
                  <button onClick={() => {
                    deleteTable(selectedTable.id);
                    setSelectedTableId(null);
                  }} className="w-full rounded-md border border-error text-error px-4 py-3 hover:bg-error/10">
                    Supprimer
                  </button>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">Selectionne une table sur le plan.</p>
              )}
            </div>
          </aside>

          <section
            ref={canvasRef}
            onDragOver={event => event.preventDefault()}
            onDrop={handleTableDrop}
            className="relative h-[680px] bg-surface border border-outline-variant rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(#d1c5b4 1px, transparent 1px), linear-gradient(90deg, #d1c5b4 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute left-[50%] top-[7%] -translate-x-1/2 w-48 h-12 border border-outline-variant bg-surface-container-low flex items-center justify-center text-xs uppercase tracking-widest text-secondary">
              Scene / ceremonie
            </div>
            <div className="absolute left-[50%] top-[43%] -translate-x-1/2 w-36 h-36 border border-primary/60 bg-primary/5 rounded-sm flex items-center justify-center text-xs uppercase tracking-widest text-primary">
              Piste
            </div>
            {tables.map(table => {
              const shape = parseShape(table.sizeClass);
              const size = parseSize(table.sizeClass);
              const count = tableGuests[table.id]?.length || 0;
              const full = Number(table.chairs) > 0 && count >= Number(table.chairs);
              return (
                <button
                  key={table.id}
                  draggable
                  onDragStart={event => {
                    setDraggedTableId(table.id);
                    event.dataTransfer.setData('tableId', table.id);
                  }}
                  onDragOver={event => event.preventDefault()}
                  onDrop={event => handleGuestDrop(event, table.id)}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 border bg-surface shadow-sm transition-all hover:shadow-lg ${shape === 'round' ? 'rounded-full' : 'rounded-md'} ${selectedTableId === table.id ? 'border-primary ring-4 ring-primary/20' : full ? 'border-error' : 'border-outline-variant'}`}
                  style={{
                    left: `${parsePercent(table.leftPos, 50)}%`,
                    top: `${parsePercent(table.topPos, 50)}%`,
                    width: shape === 'bar' ? size : size,
                    height: shape === 'rect' ? Math.round(size * 0.62) : shape === 'bar' ? 52 : size
                  }}
                >
                  <span className="block font-semibold text-on-surface text-sm">{table.name}</span>
                  <span className={`block text-[11px] ${full ? 'text-error' : 'text-secondary'}`}>{count} / {table.chairs || 0}</span>
                </button>
              );
            })}
          </section>

          <aside className="bg-surface border border-outline-variant rounded-xl p-4 h-fit max-h-[680px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">A placer</p>
              <span className="rounded-full bg-surface-container-low px-3 py-1 text-sm">{unseatedGuests.length}</span>
            </div>
            <div className="space-y-2 overflow-y-auto pr-1">
              {unseatedGuests.map(guest => (
                <div
                  key={guest.id}
                  draggable
                  onDragStart={event => event.dataTransfer.setData('guestId', guest.id)}
                  className="border border-outline-variant rounded-md p-3 bg-surface-container-low cursor-grab active:cursor-grabbing"
                >
                  <p className="font-medium text-on-surface">{guest.name}</p>
                  <p className="text-xs text-secondary">{guest.circle || guest.groupName || 'Invite'}</p>
                </div>
              ))}
              {unseatedGuests.length === 0 && <p className="text-sm text-on-surface-variant text-center py-10">Tous les invites sont places.</p>}
            </div>

            {selectedTable && (
              <div className="mt-5 border-t border-outline-variant pt-4">
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">{selectedTable.name}</p>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {(tableGuests[selectedTable.id] || []).map(guest => (
                    <div key={guest.id} className="flex items-center justify-between gap-2 bg-surface-container-low rounded-md px-3 py-2">
                      <span className="text-sm text-on-surface truncate">{guest.name}</span>
                      <button onClick={() => assignGuestToTable(guest.id, null)} className="text-error hover:opacity-70">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  ))}
                  {(tableGuests[selectedTable.id] || []).length === 0 && <p className="text-sm text-on-surface-variant">Aucun invite sur cette table.</p>}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
