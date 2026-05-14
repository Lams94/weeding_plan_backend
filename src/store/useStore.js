import { create } from 'zustand';
import { io } from 'socket.io-client';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const apiFetch = (path, options) => fetch(`${API_BASE_URL}${path}`, options);

// Initialisation de la connexion Socket.io vers le serveur distant si configuré.
const socket = io(API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/'), {
  autoConnect: Boolean(API_BASE_URL || window.location.hostname === 'localhost')
});

const LOCAL_STATE_KEY = 'weddingPlan.localState.v1';

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const defaultAgendaItems = [
  { id: 'local-task-budget', time: 'J-365', title: 'Définir le budget de base', description: 'Valider l’enveloppe globale avec les mariés et les bénéficiaires.', isRestricted: false, isDone: false, orderIndex: 1 },
  { id: 'local-task-venue', time: 'J-300', title: 'Réserver le lieu', description: 'Comparer les lieux, bloquer la date et suivre l’acompte.', isRestricted: false, isDone: false, orderIndex: 2 },
  { id: 'local-task-vendors', time: 'J-240', title: 'Sélectionner les prestataires', description: 'Traiteur, photo, vidéo, musique, décoration et coordination.', isRestricted: false, isDone: false, orderIndex: 3 },
  { id: 'local-task-guests', time: 'J-180', title: 'Construire la liste invités', description: 'Ajouter les invités, groupes, RSVP et besoins alimentaires.', isRestricted: false, isDone: false, orderIndex: 4 },
  { id: 'local-task-payments', time: 'J-30', title: 'Contrôler acomptes et factures', description: 'Vérifier les montants payés, restes à payer et soldes prestataires.', isRestricted: true, isDone: false, orderIndex: 5 }
];

const defaultLocalState = () => {
  const wedding = {
    id: 'local-wedding-main',
    name: 'Mon mariage',
    theme: 'theme-linen-pure',
    ownerRole: 'couple',
    baseBudget: 0,
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
    guests: [],
    vendors: [],
    agenda: defaultAgendaItems
  };

  return {
    weddings: [wedding],
    projects: {
      [wedding.id]: {
        agendaItems: defaultAgendaItems,
        messages: [],
        guests: [],
        tables: [],
        vendors: [],
        tracks: []
      }
    }
  };
};

const readLocalState = () => {
  if (typeof window === 'undefined') return defaultLocalState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_STATE_KEY));
    if (parsed?.weddings?.length) return parsed;
  } catch (e) {
    console.warn('Local wedding state unavailable', e);
  }
  const fallback = defaultLocalState();
  window.localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(fallback));
  return fallback;
};

const writeLocalState = (state) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
};

const readLocalProject = (weddingId) => {
  const localState = readLocalState();
  return localState.projects[weddingId] || {
    agendaItems: defaultAgendaItems,
    messages: [],
    guests: [],
    tables: [],
    vendors: [],
    tracks: []
  };
};

const writeLocalProject = (weddingId, projectData, weddingPatch = {}) => {
  const localState = readLocalState();
  localState.projects[weddingId] = projectData;
  localState.weddings = localState.weddings.map(wedding => {
    if (wedding.id !== weddingId) return wedding;
    return {
      ...wedding,
      ...weddingPatch,
      agenda: projectData.agendaItems,
      guests: projectData.guests,
      vendors: projectData.vendors
    };
  });
  writeLocalState(localState);
};

const useStore = create((set, get) => ({
  // --- UI STATE (TOAST & MENU) ---
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),

  // --- THEME ENGINE ---
  activeTheme: 'theme-linen-pure', // default
  setTheme: (themeClass) => set({ activeTheme: themeClass }),

  // --- DATA ---
  weddings: [],
  activeWedding: null, // Le projet actuellement sélectionné

  agendaItems: [],
  messages: [],
  guests: [],
  tables: [],
  vendors: [],
  tracks: [], // DJ Live Deck
  isLoading: false, // Global Loading state

  // --- TELEMETRY / LOGS ---
  sendReport: async (level, message, context = {}) => {
    try {
      await fetch('https://devdashapklink-production.up.railway.app/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: 'WeddingPlan-Mobile',
          level: level, // INFO, WARN, ERROR
          message: message,
          device: navigator.userAgent,
          context: {
            weddingId: get().activeWedding?.id,
            ...context
          }
        })
      });
    } catch (e) {
      console.warn("Telemetry failed", e);
    }
  },

  // --- ACTIONS (API CALLS) ---
  fetchWeddings: async () => {
    set({ isLoading: true });
    try {
      const res = await apiFetch('/api/weddings');
      if (!res.ok) throw new Error('Wedding API unavailable');
      const weddings = await res.json();
      set({ weddings });
    } catch (e) {
      console.error("Failed to fetch weddings", e);
      const localState = readLocalState();
      set({ weddings: localState.weddings });
      get().sendReport('ERROR', `Failed to fetch weddings: ${e.message}`);
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveWedding: (wedding) => {
    set({ activeWedding: wedding });
    // Si un thème est associé au mariage, on peut l'appliquer
    if (wedding?.theme) get().setTheme(wedding.theme);
    // Charger les données de ce mariage spécifique
    if (wedding) get().fetchData();
  },

  createWedding: async (payload) => {
    const data = typeof payload === 'string' ? { name: payload } : payload;
    try {
      const res = await apiFetch('/api/weddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Wedding API unavailable');
      const newWedding = await res.json();
      set(state => ({ weddings: [newWedding, ...state.weddings] }));
      get().setActiveWedding(newWedding);
    } catch (e) {
      const newWedding = {
        id: makeId('local-wedding'),
        name: data.name || 'Mon mariage',
        theme: data.theme || 'theme-linen-pure',
        ownerRole: data.ownerRole || 'couple',
        baseBudget: Number(data.baseBudget) || 0,
        onboardingComplete: Boolean(data.onboardingComplete),
        createdAt: new Date().toISOString(),
        guests: [],
        vendors: [],
        agenda: defaultAgendaItems
      };
      const localState = readLocalState();
      localState.weddings = [newWedding, ...localState.weddings];
      localState.projects[newWedding.id] = {
        agendaItems: defaultAgendaItems,
        messages: [],
        guests: [],
        tables: [],
        vendors: [],
        tracks: []
      };
      writeLocalState(localState);
      set(state => ({ weddings: [newWedding, ...state.weddings] }));
      get().setActiveWedding(newWedding);
      get().showToast('Projet créé sur ce téléphone');
    }
  },

  updateWedding: async (data) => {
    const { activeWedding } = get();
    if (!activeWedding) return;
    set({ isLoading: true });
    try {
      const res = await apiFetch(`/api/weddings/${activeWedding.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Wedding update failed');
      const updatedWedding = await res.json();
      set(state => ({
        activeWedding: updatedWedding,
        weddings: state.weddings.map(w => w.id === updatedWedding.id ? { ...w, ...updatedWedding } : w)
      }));
      get().showToast('Projet mis à jour');
    } catch (e) {
      const updatedWedding = { ...activeWedding, ...data };
      const project = readLocalProject(activeWedding.id);
      writeLocalProject(activeWedding.id, project, updatedWedding);
      set(state => ({
        activeWedding: updatedWedding,
        weddings: state.weddings.map(w => w.id === updatedWedding.id ? { ...w, ...updatedWedding } : w)
      }));
      get().sendReport('ERROR', `Wedding Update Failed: ${e.message}`, data);
      get().showToast('Projet enregistré sur ce téléphone');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchData: async () => {
    const { activeWedding } = get();
    if (!activeWedding) return;

    set({ isLoading: true });
    const headers = { 'x-wedding-id': activeWedding.id };

    try {
      const [agendaRes, messagesRes, guestsRes, tablesRes, vendorsRes, tracksRes] = await Promise.all([
        apiFetch('/api/agenda', { headers }),
        apiFetch('/api/messages', { headers }),
        apiFetch('/api/guests', { headers }),
        apiFetch('/api/tables', { headers }),
        apiFetch('/api/vendors', { headers }),
        apiFetch('/api/tracks', { headers })
      ]);
      if (![agendaRes, messagesRes, guestsRes, tablesRes, vendorsRes, tracksRes].every(res => res.ok)) {
        throw new Error('Project API unavailable');
      }
      set({
        agendaItems: await agendaRes.json(),
        messages: await messagesRes.json(),
        guests: await guestsRes.json(),
        tables: await tablesRes.json(),
        vendors: await vendorsRes.json(),
        tracks: await tracksRes.json()
      });
      
      get().setupSocketListeners();
      get().sendReport('INFO', 'Data synchronized successfully');
    } catch (e) {
      console.error("Failed to fetch data", e);
      const localProject = readLocalProject(activeWedding.id);
      set(localProject);
      get().sendReport('ERROR', `Data Sync Failed: ${e.message}`);
    } finally {
      set({ isLoading: false });
    }
  },

  // --- WEBSOCKETS SETUP ---
  setupSocketListeners: () => {
    // Éviter d'ajouter plusieurs fois les mêmes écouteurs
    socket.off('guestCreated');
    socket.off('guestUpdated');
    socket.off('agendaUpdated');
    socket.off('agendaCreated');
    socket.off('messageCreated');
    socket.off('vendorPaymentCreated');
    socket.off('vendorPaymentDeleted');

    socket.on('guestCreated', (newGuest) => {
      set(state => {
        // Vérifier si l'invité n'est pas déjà dans la liste (cas où l'auteur est soi-même)
        if (state.guests.some(g => g.id === newGuest.id)) return state;
        return { guests: [...state.guests, newGuest] };
      });
    });

    socket.on('guestUpdated', (updatedGuest) => {
      set(state => ({
        guests: state.guests.map(g => g.id === updatedGuest.id ? updatedGuest : g)
      }));
    });

    socket.on('agendaUpdated', (updatedItem) => {
      set(state => ({
        agendaItems: state.agendaItems.map(i => i.id === updatedItem.id ? updatedItem : i)
      }));
    });

    socket.on('agendaCreated', (newItem) => {
      set(state => {
        if (state.agendaItems.some(item => item.id === newItem.id)) return state;
        return { agendaItems: [...state.agendaItems, newItem].sort((a, b) => a.orderIndex - b.orderIndex) };
      });
    });

    socket.on('messageCreated', (newMsg) => {
      set(state => {
        if (state.messages.some(m => m.id === newMsg.id)) return state;
        return { messages: [...state.messages, newMsg] };
      });
    });

    socket.on('trackCreated', (newTrack) => {
      set(state => {
        if (state.tracks.some(t => t.id === newTrack.id)) return state;
        return { tracks: [...state.tracks, newTrack].sort((a, b) => a.orderIndex - b.orderIndex) };
      });
    });

    socket.on('trackUpdated', (updatedTrack) => {
      set(state => ({
        tracks: state.tracks.map(t => t.id === updatedTrack.id ? updatedTrack : t).sort((a, b) => a.orderIndex - b.orderIndex)
      }));
    });

    socket.on('vendorPaymentCreated', ({ vendor }) => {
      set(state => ({
        vendors: state.vendors.map(v => v.id === vendor.id ? vendor : v)
      }));
    });

    socket.on('vendorPaymentDeleted', ({ vendor }) => {
      set(state => ({
        vendors: state.vendors.map(v => v.id === vendor.id ? vendor : v)
      }));
    });
  },

  toggleAgendaDone: async (id) => {
    const item = get().agendaItems.find(i => i.id === id);
    if (!item || !get().activeWedding) return;
    const nextDone = !item.isDone;
    
    // Mise à jour optimiste (UX instantanée)
    const nextAgenda = get().agendaItems.map(i => i.id === id ? { ...i, isDone: nextDone } : i);
    set({ agendaItems: nextAgenda });
    writeLocalProject(get().activeWedding.id, { ...readLocalProject(get().activeWedding.id), agendaItems: nextAgenda });
    
    try {
      await apiFetch(`/api/agenda/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify({ isDone: nextDone })
      });
    } catch (e) {
      get().sendReport('WARN', `Agenda local toggle only: ${e.message}`);
    }
  },

  addAgendaItem: async (itemData) => {
    if (!get().activeWedding) return null;
    let item;
    try {
      const res = await apiFetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify(itemData)
      });
      if (!res.ok) throw new Error('Agenda creation failed');
      item = await res.json();
    } catch (e) {
      item = {
        id: makeId('local-task'),
        time: itemData.time || '',
        title: itemData.title || 'Nouvelle tâche',
        description: itemData.description || '',
        isRestricted: Boolean(itemData.isRestricted),
        isDone: Boolean(itemData.isDone),
        orderIndex: Number(itemData.orderIndex) || get().agendaItems.length + 1
      };
    }
    const nextAgenda = [...get().agendaItems, item].sort((a, b) => a.orderIndex - b.orderIndex);
    set({ agendaItems: nextAgenda });
    writeLocalProject(get().activeWedding.id, { ...readLocalProject(get().activeWedding.id), agendaItems: nextAgenda });
    return item;
  },

  importRetroplanning: async (tasks) => {
    if (!get().activeWedding) return;
    set({ isLoading: true });
    try {
      const existingTitles = new Set(get().agendaItems.map(item => item.title));
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!existingTitles.has(task.title)) {
          await get().addAgendaItem({ ...task, orderIndex: i + 1 });
        }
      }
      get().showToast('Rétroplanning importé');
    } catch (e) {
      get().showToast('Erreur import rétroplanning', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  addMessage: async (text) => {
    if (!get().activeWedding) return;
    set({ isLoading: true });
    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify({
          sender: 'Coordinator (You)',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `"${text}"`,
          isImportant: false,
          senderColor: 'primary'
        })
      });
      const newMsg = await res.json();
      set(state => ({ messages: [...state.messages, newMsg] }));
      get().showToast('Message envoyé au Backstage');
    } finally {
      set({ isLoading: false });
    }
  },

  addGuest: async (guest) => {
    if (!get().activeWedding) return;
    set({ isLoading: true });
    try {
      const res = await apiFetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify({ ...guest, weddingId: get().activeWedding.id, status: 'Pending', agendaVis: false, diet: false })
      });
      if (!res.ok) throw new Error('Guest API unavailable');
      const newGuest = await res.json();
      const nextGuests = [...get().guests, newGuest];
      set({ guests: nextGuests });
      writeLocalProject(get().activeWedding.id, { ...readLocalProject(get().activeWedding.id), guests: nextGuests });
      get().showToast('Invité ajouté avec succès');
      get().sendReport('INFO', `Guest added: ${guest.name}`);
    } catch (e) {
      const localGuest = {
        id: makeId('local-guest'),
        name: guest.name,
        circle: guest.circle || 'Friends',
        email: guest.email || '',
        status: guest.status || 'Pending',
        agendaVis: Boolean(guest.agendaVis),
        diet: Boolean(guest.diet),
        groupName: guest.groupName || '',
        tableId: null,
        weddingId: get().activeWedding.id,
        createdAt: new Date().toISOString()
      };
      const nextGuests = [...get().guests, localGuest];
      set({ guests: nextGuests });
      writeLocalProject(get().activeWedding.id, { ...readLocalProject(get().activeWedding.id), guests: nextGuests });
      get().sendReport('ERROR', `Add Guest Failed: ${e.message}`, { guest });
      get().showToast('Invité ajouté sur ce téléphone');
    } finally {
      set({ isLoading: false });
    }
  },

  updateGuestStatus: async (id, status) => {
    if (!get().activeWedding) return;
    // Mise à jour optimiste
    const nextGuests = get().guests.map(g => g.id === id ? { ...g, status } : g);
    set({ guests: nextGuests });
    writeLocalProject(get().activeWedding.id, { ...readLocalProject(get().activeWedding.id), guests: nextGuests });
    
    try {
      await apiFetch(`/api/guests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      get().sendReport('WARN', `Guest status local only: ${e.message}`);
    }
  },

  assignGuestToTable: async (guestId, tableId) => {
    if (!get().activeWedding) return;
    // Mise à jour optimiste
    set(state => ({ guests: state.guests.map(g => g.id === guestId ? { ...g, tableId } : g) }));
    
    await apiFetch(`/api/guests/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
      body: JSON.stringify({ tableId })
    });
  },

  // --- DJ LIVE DECK ---
  addTrack: async (trackData) => {
    if (!get().activeWedding) return;
    set({ isLoading: true });
    try {
      await apiFetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify({ ...trackData, weddingId: get().activeWedding.id })
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTrack: async (id, data) => {
    if (!get().activeWedding) return;
    // Optimistic UI
    set(state => ({
      tracks: state.tracks.map(t => t.id === id ? { ...t, ...data } : t)
    }));
    await apiFetch(`/api/tracks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
      body: JSON.stringify(data)
    });
  },

  reorderTracks: async (newTracksList) => {
    if (!get().activeWedding) return;
    // Optimistic UI
    set({ tracks: newTracksList });

    // Send individual updates for orderIndex
    for (let i = 0; i < newTracksList.length; i++) {
      await apiFetch(`/api/tracks/${newTracksList[i].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify({ orderIndex: i })
      });
    }
  },

  toggleTableSelection: (id) => set(state => ({
    tables: state.tables.map(t => t.id === id ? { ...t, selected: !t.selected } : t)
  })),

  updateVendorStatus: async (id, status) => {
    if (!get().activeWedding) return;
    // Optimistic UI
    set(state => ({ vendors: state.vendors.map(v => v.id === id ? { ...v, status } : v) }));
    await apiFetch(`/api/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
      body: JSON.stringify({ status })
    });
  },

  addVendor: async (vendorData) => {
    if (!get().activeWedding) return;
    set({ isLoading: true });
    try {
      const res = await apiFetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify({ ...vendorData, weddingId: get().activeWedding.id, status: 'Pending', paid: 0 })
      });
      const newVendor = await res.json();
      set(state => ({ vendors: [...state.vendors, newVendor] }));
      get().showToast('Prestataire ajouté avec succès');
      get().sendReport('INFO', `Vendor added: ${vendorData.name}`);
    } catch (e) {
      get().sendReport('ERROR', `Add Vendor Failed: ${e.message}`, { vendorData });
      get().showToast('Erreur prestataire', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  updateVendorFinancials: async (id, data) => {
    if (!get().activeWedding) return;
    // Optimistic UI
    set(state => ({ vendors: state.vendors.map(v => v.id === id ? { ...v, ...data } : v) }));
    const res = await apiFetch(`/api/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const vendor = await res.json();
      set(state => ({ vendors: state.vendors.map(v => v.id === id ? vendor : v) }));
    }
  },

  addVendorPayment: async (vendorId, paymentData) => {
    if (!get().activeWedding) return;
    set({ isLoading: true });
    try {
      const res = await apiFetch(`/api/vendors/${vendorId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-wedding-id': get().activeWedding.id },
        body: JSON.stringify(paymentData)
      });
      if (!res.ok) throw new Error('Payment creation failed');
      const { vendor } = await res.json();
      set(state => ({ vendors: state.vendors.map(v => v.id === vendor.id ? vendor : v) }));
      get().showToast('Paiement enregistré');
    } catch (e) {
      get().sendReport('ERROR', `Vendor Payment Failed: ${e.message}`, { vendorId, paymentData });
      get().showToast('Erreur paiement prestataire', 'error');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteVendorPayment: async (paymentId) => {
    if (!get().activeWedding) return;
    set({ isLoading: true });
    try {
      const res = await apiFetch(`/api/vendor-payments/${paymentId}`, {
        method: 'DELETE',
        headers: { 'x-wedding-id': get().activeWedding.id }
      });
      if (!res.ok) throw new Error('Payment deletion failed');
      const { vendor } = await res.json();
      set(state => ({ vendors: state.vendors.map(v => v.id === vendor.id ? vendor : v) }));
      get().showToast('Paiement supprimé');
    } catch (e) {
      get().showToast('Erreur suppression paiement', 'error');
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useStore;
