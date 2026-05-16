import React, { useEffect, useMemo, useRef, useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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
  return 104;
};
const makeSizeClass = (shape, size) => `${shape}:${size}`;

const elementConfig = {
  decor: { label: 'Decoration', icon: 'local_florist', className: 'border-emerald-700 bg-emerald-50 text-emerald-800' },
  buffet: { label: 'Buffet', icon: 'countertops', className: 'border-amber-700 bg-amber-50 text-amber-800' },
  dj: { label: 'DJ', icon: 'graphic_eq', className: 'border-purple-700 bg-purple-50 text-purple-800' },
  material: { label: 'Materiel', icon: 'construction', className: 'border-slate-700 bg-slate-50 text-slate-800' },
  seating: { label: 'Assises', icon: 'chair', className: 'border-sky-700 bg-sky-50 text-sky-800' },
  dance: { label: 'Piste', icon: 'steps', className: 'border-primary bg-primary/10 text-primary' },
  wall: { label: 'Mur / limite', icon: 'border_outer', className: 'border-neutral-800 bg-neutral-800 text-white' }
};

export default function GestionDesTablesMappingSpatial() {
  const canvasRef = useRef(null);
  const activeWedding = useStore(state => state.activeWedding);
  const tables = useStore(state => state.tables);
  const guests = useStore(state => state.guests);
  const assignGuestToTable = useStore(state => state.assignGuestToTable);
  const addTable = useStore(state => state.addTable);
  const updateTable = useStore(state => state.updateTable);
  const deleteTable = useStore(state => state.deleteTable);

  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [draggedTableId, setDraggedTableId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.72);
  const [planElements, setPlanElements] = useState([]);
  const [draftWall, setDraftWall] = useState(null);

  const storageKey = `weddingPlan.floorEditor.${activeWedding?.id || 'local'}`;
  const selectedTable = tables.find(table => table.id === selectedTableId);
  const selectedElement = planElements.find(element => element.id === selectedElementId);
  const unseatedGuests = guests.filter(guest => !guest.tableId && guest.status !== 'Declined');
  const seatedCount = guests.filter(guest => guest.tableId).length;
  const seatingTables = tables.filter(table => parseShape(table.sizeClass) !== 'bar' && Number(table.chairs) > 0);
  const capacity = seatingTables.reduce((sum, table) => sum + (Number(table.chairs) || 0), 0);
  const emptySeatingTables = seatingTables.filter(table => !guests.some(guest => guest.tableId === table.id));
  const occupiedSeatingTables = seatingTables.filter(table => guests.some(guest => guest.tableId === table.id));
  const assignedTableIds = new Set(guests.map(guest => guest.tableId).filter(Boolean));
  const missingAssignedTableCount = [...assignedTableIds].filter(tableId => !tables.some(table => table.id === tableId)).length;
  const capacityGap = capacity - guests.length;

  const tableGuests = useMemo(() => {
    return tables.reduce((acc, table) => {
      acc[table.id] = guests.filter(guest => guest.tableId === table.id);
      return acc;
    }, {});
  }, [guests, tables]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey));
      if (saved) {
        setBackgroundImage(saved.backgroundImage || '');
        setBackgroundOpacity(saved.backgroundOpacity ?? 0.72);
        setPlanElements(saved.planElements || []);
      }
    } catch (error) {
      console.warn('Floor plan editor state unavailable', error);
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ backgroundImage, backgroundOpacity, planElements }));
  }, [backgroundImage, backgroundOpacity, planElements, storageKey]);

  const positionFromEvent = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100)
    };
  };

  const handleImportPlan = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBackgroundImage(String(reader.result));
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const addPlanElement = (type, point) => {
    const config = elementConfig[type];
    const defaults = type === 'wall'
      ? { w: 18, h: 2.4 }
      : type === 'dance'
        ? { w: 18, h: 14 }
        : type === 'buffet'
          ? { w: 16, h: 7 }
          : { w: 11, h: 8 };
    const element = {
      id: makeId(type),
      type,
      label: config.label,
      x: clamp(point.x - defaults.w / 2, 0, 100 - defaults.w),
      y: clamp(point.y - defaults.h / 2, 0, 100 - defaults.h),
      ...defaults
    };
    setPlanElements(prev => [...prev, element]);
    setSelectedElementId(element.id);
    setSelectedTableId(null);
    setActiveTool('select');
  };

  const updateElement = (id, patch) => {
    setPlanElements(prev => prev.map(element => element.id === id ? { ...element, ...patch } : element));
  };

  const deleteElement = (id) => {
    setPlanElements(prev => prev.filter(element => element.id !== id));
    setSelectedElementId(null);
  };

  const createTable = (shape = 'round') => {
    const next = tables.length + 1;
    addTable({
      name: shape === 'bar' ? 'Table buffet' : `Table ${next}`,
      chairs: shape === 'bar' ? 0 : shape === 'rect' ? 10 : 9,
      topPos: 50,
      leftPos: 50,
      sizeClass: makeSizeClass(shape, shape === 'bar' ? 180 : 104)
    });
  };

  const updateSelectedTable = (patch) => {
    if (selectedTable) updateTable(selectedTable.id, patch);
  };

  const handleCanvasDrop = (event) => {
    event.preventDefault();
    const tableId = event.dataTransfer.getData('tableId') || draggedTableId;
    const elementId = event.dataTransfer.getData('elementId');
    const point = positionFromEvent(event);

    if (tableId) {
      updateTable(tableId, { leftPos: String(point.x.toFixed(1)), topPos: String(point.y.toFixed(1)) });
      setDraggedTableId(null);
    }
    if (elementId) {
      const element = planElements.find(item => item.id === elementId);
      if (element) updateElement(elementId, {
        x: clamp(point.x - element.w / 2, 0, 100 - element.w),
        y: clamp(point.y - element.h / 2, 0, 100 - element.h)
      });
    }
  };

  const handleGuestDrop = (event, tableId) => {
    event.preventDefault();
    event.stopPropagation();
    const guestId = event.dataTransfer.getData('guestId');
    if (guestId) assignGuestToTable(guestId, tableId);
  };

  const handleCanvasClick = (event) => {
    if (event.target.closest('[data-plan-item]')) return;
    const point = positionFromEvent(event);
    setSelectedTableId(null);
    setSelectedElementId(null);
    if (!['select', 'wall'].includes(activeTool)) addPlanElement(activeTool, point);
  };

  const startWall = (event) => {
    if (activeTool !== 'wall' || event.target.closest('[data-plan-item]')) return;
    setDraftWall({ start: positionFromEvent(event), end: positionFromEvent(event) });
  };

  const moveWall = (event) => {
    if (!draftWall) return;
    setDraftWall(prev => ({ ...prev, end: positionFromEvent(event) }));
  };

  const finishWall = () => {
    if (!draftWall) return;
    const x = Math.min(draftWall.start.x, draftWall.end.x);
    const y = Math.min(draftWall.start.y, draftWall.end.y);
    const w = Math.max(1.2, Math.abs(draftWall.start.x - draftWall.end.x));
    const h = Math.max(1.2, Math.abs(draftWall.start.y - draftWall.end.y));
    const wall = { id: makeId('wall'), type: 'wall', label: 'Mur', x, y, w, h };
    setPlanElements(prev => [...prev, wall]);
    setSelectedElementId(wall.id);
    setDraftWall(null);
    setActiveTool('select');
  };

  const clearAllGuestPlacements = async () => {
    if (!window.confirm('Retirer tous les invités des tables ? Tu pourras ensuite les replacer sur le nouveau plan.')) return;
    for (const guest of guests.filter(item => item.tableId)) {
      await assignGuestToTable(guest.id, null);
    }
  };

  const deleteEmptyTables = async () => {
    if (!emptySeatingTables.length) return;
    if (!window.confirm(`Supprimer ${emptySeatingTables.length} table(s) vide(s) ?`)) return;
    for (const table of emptySeatingTables) {
      await deleteTable(table.id);
    }
    if (selectedTableId && emptySeatingTables.some(table => table.id === selectedTableId)) setSelectedTableId(null);
  };

  const migrateOccupiedTablesToEmptyPositions = async () => {
    if (!occupiedSeatingTables.length || !emptySeatingTables.length) return;
    if (!window.confirm(`Remplacer ${Math.min(occupiedSeatingTables.length, emptySeatingTables.length)} table(s) vide(s) par les anciennes tables qui contiennent deja les invites ?`)) return;

    const orderedOccupied = [...occupiedSeatingTables].sort((a, b) => (tableGuests[b.id]?.length || 0) - (tableGuests[a.id]?.length || 0));
    const orderedEmpty = [...emptySeatingTables].sort((a, b) => parsePercent(a.topPos, 50) - parsePercent(b.topPos, 50) || parsePercent(a.leftPos, 50) - parsePercent(b.leftPos, 50));

    for (let index = 0; index < orderedOccupied.length; index += 1) {
      const oldTable = orderedOccupied[index];
      const placeholder = orderedEmpty[index];
      if (placeholder) {
        await updateTable(oldTable.id, {
          name: placeholder.name,
          chairs: Number(placeholder.chairs) || Number(oldTable.chairs) || 0,
          sizeClass: placeholder.sizeClass || oldTable.sizeClass,
          leftPos: placeholder.leftPos,
          topPos: placeholder.topPos
        });
      } else {
        const gridIndex = index - orderedEmpty.length;
        const columns = 5;
        const row = Math.floor(gridIndex / columns);
        const col = gridIndex % columns;
        await updateTable(oldTable.id, {
          leftPos: String(18 + col * 16),
          topPos: String(18 + row * 14)
        });
      }
    }

    for (const placeholder of orderedEmpty) {
      await deleteTable(placeholder.id);
    }
    setSelectedTableId(orderedOccupied[0]?.id || null);
    setSelectedElementId(null);
  };

  return (
    <>
      <TopAppBar title="Editeur plan de salle" role="PLANNER" />
      <main className="px-4 md:px-10 pt-24 pb-28 max-w-[1700px] mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Plan d'architecte et calques</p>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">Editeur visuel de salle</h1>
            <p className="text-on-surface-variant mt-2 max-w-3xl">Importe un plan, dessine les murs ou zones, puis positionne tables, buffet, assises, DJ, materiel et decoration par-dessus.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 min-w-[320px]">
            <div className="bg-surface border border-outline-variant rounded-lg p-3">
              <p className="text-xs uppercase tracking-widest text-secondary">Places</p>
              <p className="font-semibold text-on-surface">{seatedCount} / {guests.length}</p>
            </div>
            <div className="bg-surface border border-outline-variant rounded-lg p-3">
              <p className="text-xs uppercase tracking-widest text-secondary">Capacite</p>
              <p className={`font-semibold ${capacityGap > 30 ? 'text-error' : 'text-on-surface'}`}>{capacity}</p>
            </div>
            <div className="bg-surface border border-outline-variant rounded-lg p-3">
              <p className="text-xs uppercase tracking-widest text-secondary">Calques</p>
              <p className="font-semibold text-on-surface">{planElements.length}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_340px] gap-5">
          <aside className="bg-surface border border-outline-variant rounded-xl p-4 h-fit">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">Plan source</p>
            <label className="flex items-center justify-center gap-2 rounded-md border border-dashed border-outline-variant px-4 py-4 text-sm text-on-surface hover:border-primary cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Importer plan archi
              <input type="file" accept="image/*" onChange={handleImportPlan} className="hidden" />
            </label>
            {backgroundImage && (
              <button onClick={() => setBackgroundImage('')} className="mt-2 w-full rounded-md border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:text-error">
                Retirer le plan
              </button>
            )}
            <label className="block mt-4">
              <span className="block text-xs uppercase tracking-widest text-secondary mb-2">Opacite plan</span>
              <input type="range" min="0.15" max="1" step="0.05" value={backgroundOpacity} onChange={event => setBackgroundOpacity(Number(event.target.value))} className="w-full" />
            </label>

            <div className="mt-6 border-t border-outline-variant pt-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">Dessiner / poser</p>
              <div className="grid grid-cols-2 gap-2">
                {[['select', 'near_me', 'Selection'], ['wall', 'border_outer', 'Mur'], ['decor', 'local_florist', 'Deco'], ['buffet', 'countertops', 'Buffet'], ['seating', 'chair', 'Assises'], ['dj', 'graphic_eq', 'DJ'], ['material', 'construction', 'Materiel'], ['dance', 'steps', 'Piste']].map(([tool, icon, label]) => (
                  <button key={tool} onClick={() => setActiveTool(tool)} className={`rounded-md border px-3 py-3 text-sm text-left ${activeTool === tool ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface hover:border-primary'}`}>
                    <span className="material-symbols-outlined align-middle mr-1 text-[17px]">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-4">Tables</p>
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
                  <span className="material-symbols-outlined align-middle mr-2 text-[18px]">table_bar</span>
                  Table buffet
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Controle capacite</p>
              <div className="rounded-lg bg-surface-container-low border border-outline-variant p-3 text-sm space-y-2">
                <div className="flex justify-between gap-3"><span>Tables assises</span><strong>{seatingTables.length}</strong></div>
                <div className="flex justify-between gap-3"><span>Tables avec invites</span><strong>{occupiedSeatingTables.length}</strong></div>
                <div className="flex justify-between gap-3"><span>Tables vides</span><strong>{emptySeatingTables.length}</strong></div>
                <div className="flex justify-between gap-3"><span>Surplus places</span><strong className={capacityGap > 30 ? 'text-error' : 'text-on-surface'}>{capacityGap > 0 ? `+${capacityGap}` : capacityGap}</strong></div>
                {missingAssignedTableCount > 0 && <p className="text-xs text-error">{missingAssignedTableCount} placement(s) pointent vers une table absente.</p>}
              </div>
              <div className="grid grid-cols-1 gap-2 mt-3">
                <button onClick={migrateOccupiedTablesToEmptyPositions} className="rounded-md border border-primary px-3 py-2 text-sm text-left text-primary hover:bg-primary/10 disabled:opacity-40" disabled={!occupiedSeatingTables.length || !emptySeatingTables.length}>
                  Remplacer vides par anciennes
                </button>
                <button onClick={clearAllGuestPlacements} className="rounded-md border border-outline-variant px-3 py-2 text-sm text-left hover:border-primary">
                  Replacer tous les invites
                </button>
                <button onClick={deleteEmptyTables} className="rounded-md border border-outline-variant px-3 py-2 text-sm text-left hover:border-error disabled:opacity-40" disabled={!emptySeatingTables.length}>
                  Supprimer tables vides
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Selection</p>
              {selectedTable ? (
                <div className="space-y-3">
                  <input value={selectedTable.name} onChange={event => updateSelectedTable({ name: event.target.value })} className="w-full border border-outline-variant rounded-md bg-surface px-3 py-2" />
                  <input type="number" min="0" value={selectedTable.chairs} onChange={event => updateSelectedTable({ chairs: Number(event.target.value) || 0 })} className="w-full border border-outline-variant rounded-md bg-surface px-3 py-2" />
                  <select value={parseShape(selectedTable.sizeClass)} onChange={event => updateSelectedTable({ sizeClass: makeSizeClass(event.target.value, parseSize(selectedTable.sizeClass)) })} className="w-full border border-outline-variant rounded-md bg-surface px-3 py-2">
                    <option value="round">Ronde</option>
                    <option value="rect">Rectangle</option>
                    <option value="bar">Zone/table buffet</option>
                  </select>
                  <input type="range" min="72" max="210" value={parseSize(selectedTable.sizeClass)} onChange={event => updateSelectedTable({ sizeClass: makeSizeClass(parseShape(selectedTable.sizeClass), Number(event.target.value)) })} className="w-full" />
                  <button onClick={() => {
                    deleteTable(selectedTable.id);
                    setSelectedTableId(null);
                  }} className="w-full rounded-md border border-error text-error px-4 py-3 hover:bg-error/10">Supprimer table</button>
                </div>
              ) : selectedElement ? (
                <div className="space-y-3">
                  <input value={selectedElement.label} onChange={event => updateElement(selectedElement.id, { label: event.target.value })} className="w-full border border-outline-variant rounded-md bg-surface px-3 py-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs text-secondary">Largeur<input type="number" value={Math.round(selectedElement.w)} onChange={event => updateElement(selectedElement.id, { w: clamp(Number(event.target.value) || 1, 1, 80) })} className="mt-1 w-full border border-outline-variant rounded-md bg-surface px-2 py-2 text-on-surface" /></label>
                    <label className="text-xs text-secondary">Hauteur<input type="number" value={Math.round(selectedElement.h)} onChange={event => updateElement(selectedElement.id, { h: clamp(Number(event.target.value) || 1, 1, 80) })} className="mt-1 w-full border border-outline-variant rounded-md bg-surface px-2 py-2 text-on-surface" /></label>
                  </div>
                  <button onClick={() => deleteElement(selectedElement.id)} className="w-full rounded-md border border-error text-error px-4 py-3 hover:bg-error/10">Supprimer element</button>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">Selectionne une table ou un element sur le plan.</p>
              )}
            </div>
          </aside>

          <section
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseDown={startWall}
            onMouseMove={moveWall}
            onMouseUp={finishWall}
            onDragOver={event => event.preventDefault()}
            onDrop={handleCanvasDrop}
            className="relative h-[760px] bg-surface border border-outline-variant rounded-xl overflow-hidden cursor-crosshair"
          >
            {backgroundImage && <img src={backgroundImage} alt="Plan architectural importe" className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ opacity: backgroundOpacity }} />}
            <div className="absolute inset-0 opacity-45 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#d1c5b4 1px, transparent 1px), linear-gradient(90deg, #d1c5b4 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            {!backgroundImage && (
              <div className="absolute inset-10 border-8 border-neutral-400/70 bg-primary/5 pointer-events-none" />
            )}

            {planElements.map(element => {
              const config = elementConfig[element.type] || elementConfig.material;
              return (
                <button
                  key={element.id}
                  data-plan-item
                  draggable
                  onClick={event => {
                    event.stopPropagation();
                    setSelectedElementId(element.id);
                    setSelectedTableId(null);
                  }}
                  onDragStart={event => event.dataTransfer.setData('elementId', element.id)}
                  className={`absolute border-2 shadow-sm flex items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${config.className} ${selectedElementId === element.id ? 'ring-4 ring-primary/30' : ''}`}
                  style={{ left: `${element.x}%`, top: `${element.y}%`, width: `${element.w}%`, height: `${element.h}%` }}
                >
                  <span className="material-symbols-outlined text-[16px]">{config.icon}</span>
                  {element.label}
                </button>
              );
            })}

            {draftWall && (
              <div
                className="absolute border-2 border-neutral-900 bg-neutral-900/70 pointer-events-none"
                style={{
                  left: `${Math.min(draftWall.start.x, draftWall.end.x)}%`,
                  top: `${Math.min(draftWall.start.y, draftWall.end.y)}%`,
                  width: `${Math.max(1.2, Math.abs(draftWall.start.x - draftWall.end.x))}%`,
                  height: `${Math.max(1.2, Math.abs(draftWall.start.y - draftWall.end.y))}%`
                }}
              />
            )}

            {tables.map(table => {
              const shape = parseShape(table.sizeClass);
              const size = parseSize(table.sizeClass);
              const count = tableGuests[table.id]?.length || 0;
              const full = Number(table.chairs) > 0 && count >= Number(table.chairs);
              return (
                <button
                  key={table.id}
                  data-plan-item
                  draggable
                  onDragStart={event => {
                    setDraggedTableId(table.id);
                    event.dataTransfer.setData('tableId', table.id);
                  }}
                  onDragOver={event => event.preventDefault()}
                  onDrop={event => handleGuestDrop(event, table.id)}
                  onClick={event => {
                    event.stopPropagation();
                    setSelectedTableId(table.id);
                    setSelectedElementId(null);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 bg-surface shadow-md transition-all hover:shadow-lg ${shape === 'round' ? 'rounded-full' : 'rounded-md'} ${selectedTableId === table.id ? 'border-primary ring-4 ring-primary/20' : full ? 'border-error' : 'border-outline-variant'}`}
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

          <aside className="bg-surface border border-outline-variant rounded-xl p-4 h-fit max-h-[760px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Invites a placer</p>
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

            <div className="mt-5 border-t border-outline-variant pt-4">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Tables comptees</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {seatingTables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => {
                      setSelectedTableId(table.id);
                      setSelectedElementId(null);
                    }}
                    className={`w-full flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left ${selectedTableId === table.id ? 'border-primary bg-primary/10' : 'border-outline-variant bg-surface-container-low'}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm text-on-surface truncate">{table.name}</span>
                      <span className="block text-xs text-secondary">{tableGuests[table.id]?.length || 0} invite(s)</span>
                    </span>
                    <strong className="text-sm">{table.chairs}</strong>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
