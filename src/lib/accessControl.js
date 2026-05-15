export const ROLES = {
  SUPER_USER: 'super_user',
  COUPLE: 'couple',
  WEDDING_PLANNER: 'wedding_planner',
  VENDOR: 'vendor',
  GUEST: 'guest',
  BENEFICIARY: 'beneficiary'
};

export const roleLabels = {
  [ROLES.SUPER_USER]: 'SuperUser debug',
  [ROLES.COUPLE]: 'Mariés',
  [ROLES.WEDDING_PLANNER]: 'Wedding planner',
  [ROLES.VENDOR]: 'Prestataire',
  [ROLES.GUEST]: 'Invité',
  [ROLES.BENEFICIARY]: 'Bénéficiaire'
};

const superUserRoutes = ['*'];

const routeAccess = {
  '/': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.BENEFICIARY],
  '/planning': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.BENEFICIARY],
  '/crm': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/tables': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.VENDOR],
  '/salle': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.VENDOR],
  '/prestataires': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/budget': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.BENEFICIARY],
  '/chat': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.VENDOR],
  '/chat-live': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.VENDOR],
  '/private-thoughts': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/access': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/vendor-portal': [ROLES.SUPER_USER, ROLES.VENDOR, ROLES.WEDDING_PLANNER],
  '/guest-calendar': [ROLES.SUPER_USER, ROLES.GUEST, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/hub-invit-prestige': [ROLES.SUPER_USER, ROLES.GUEST, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/cortege': [ROLES.SUPER_USER, ROLES.GUEST, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/scanner': [ROLES.SUPER_USER, ROLES.WEDDING_PLANNER],
  '/canva': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER],
  '/music': [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.VENDOR]
};

export const navigationSections = [
  {
    title: 'Projet',
    items: [
      { to: '/', label: 'Dashboard Cockpit', icon: 'dashboard' },
      { to: '/planning', label: 'Todo & Planning', icon: 'checklist' },
      { to: '/private-thoughts', label: 'Pensées mariés', icon: 'auto_stories' },
      { to: '/access', label: 'Accès & délégations', icon: 'admin_panel_settings' },
      { to: '/budget', label: 'Budget & Paiements', icon: 'payments' }
    ]
  },
  {
    title: 'Coordination',
    items: [
      { to: '/crm', label: 'Guest Hub', icon: 'group' },
      { to: '/tables', label: 'Plan de salle', icon: 'chair' },
      { to: '/prestataires', label: 'Prestataires', icon: 'handshake' },
      { to: '/chat', label: 'Canaux Backstage', icon: 'forum' },
      { to: '/vendor-portal', label: 'Portail prestataire', icon: 'badge' },
      { to: '/guest-calendar', label: 'Calendrier invité', icon: 'event' }
    ]
  },
  {
    title: 'Jour J',
    items: [
      { to: '/hub-invit-prestige', label: 'Espace invité', icon: 'diamond' },
      { to: '/cortege', label: 'Cortège GPS', icon: 'directions_car' },
      { to: '/scanner', label: 'Scanner QR', icon: 'qr_code_scanner' }
    ]
  },
  {
    title: 'Studio',
    items: [
      { to: '/canva', label: 'Canva Editor', icon: 'palette' },
      { to: '/music', label: 'Music Studio DJ', icon: 'queue_music' }
    ]
  }
];

export function canAccessRoute(role, path, wedding = {}) {
  if (superUserRoutes.includes('*') && role === ROLES.SUPER_USER) return true;
  if (path === '/private-thoughts' && role === ROLES.WEDDING_PLANNER) {
    return Boolean(wedding.plannerCanSeePrivateThoughts);
  }
  if (path === '/vendor-portal' && role === ROLES.WEDDING_PLANNER) {
    return Boolean(wedding.plannerAccessEnabled);
  }
  return (routeAccess[path] || []).includes(role);
}

export function visibleNavigation(role, wedding) {
  return navigationSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => canAccessRoute(role, item.to, wedding))
    }))
    .filter(section => section.items.length > 0);
}

export function canSeeCoupleDirectMessages(role, wedding) {
  return role === ROLES.SUPER_USER || role === ROLES.COUPLE || Boolean(wedding.plannerCanSeeCoupleDirectMessages);
}

export function canSeePrivateThoughts(role, wedding) {
  return role === ROLES.SUPER_USER || role === ROLES.COUPLE || (role === ROLES.WEDDING_PLANNER && Boolean(wedding.plannerCanSeePrivateThoughts));
}

export function agendaVisibleForRole(item, role, selectedGuestGroup = '') {
  if (role === ROLES.SUPER_USER || !item.audience || item.audience === 'all') return true;
  if (item.audience === role) return true;
  if (role === ROLES.GUEST && item.guestGroup) return item.guestGroup === selectedGuestGroup;
  return false;
}
