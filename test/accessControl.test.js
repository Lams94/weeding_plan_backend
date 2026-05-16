import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROLES,
  agendaVisibleForRole,
  canAccessRoute,
  canSeeCoupleDirectMessages,
  canSeePrivateThoughts,
  visibleNavigation
} from '../src/lib/accessControl.js';

test('super user can access every route, including unknown debug routes', () => {
  assert.equal(canAccessRoute(ROLES.SUPER_USER, '/scanner'), true);
  assert.equal(canAccessRoute(ROLES.SUPER_USER, '/unknown-route'), true);
});

test('planner private spaces depend on explicit delegation flags', () => {
  assert.equal(canAccessRoute(ROLES.WEDDING_PLANNER, '/private-thoughts', {}), false);
  assert.equal(canAccessRoute(ROLES.WEDDING_PLANNER, '/private-thoughts', { plannerCanSeePrivateThoughts: true }), true);

  assert.equal(canSeePrivateThoughts(ROLES.WEDDING_PLANNER, {}), false);
  assert.equal(canSeePrivateThoughts(ROLES.WEDDING_PLANNER, { plannerCanSeePrivateThoughts: true }), true);

  assert.equal(canSeeCoupleDirectMessages(ROLES.WEDDING_PLANNER, {}), false);
  assert.equal(canSeeCoupleDirectMessages(ROLES.WEDDING_PLANNER, { plannerCanSeeCoupleDirectMessages: true }), true);
});

test('vendor portal planner access depends on planner access delegation', () => {
  assert.equal(canAccessRoute(ROLES.VENDOR, '/vendor-portal', {}), true);
  assert.equal(canAccessRoute(ROLES.WEDDING_PLANNER, '/vendor-portal', {}), false);
  assert.equal(canAccessRoute(ROLES.WEDDING_PLANNER, '/vendor-portal', { plannerAccessEnabled: true }), true);
});

test('visible navigation hides sections with no accessible items', () => {
  const guestNavItems = visibleNavigation(ROLES.GUEST, {}).flatMap(section => section.items.map(item => item.to));

  assert.deepEqual(guestNavItems, ['/guest-calendar', '/hub-invit-prestige', '/cortege']);
  assert.equal(guestNavItems.includes('/budget'), false);
});

test('agenda visibility respects audience and guest groups', () => {
  assert.equal(agendaVisibleForRole({ audience: 'all' }, ROLES.GUEST), true);
  assert.equal(agendaVisibleForRole({ audience: ROLES.VENDOR }, ROLES.VENDOR), true);
  assert.equal(agendaVisibleForRole({ audience: ROLES.VENDOR }, ROLES.GUEST), false);
  assert.equal(agendaVisibleForRole({ audience: ROLES.GUEST, guestGroup: 'famille' }, ROLES.GUEST, 'famille'), true);
  assert.equal(agendaVisibleForRole({ audience: ROLES.GUEST, guestGroup: 'famille' }, ROLES.GUEST, 'amis'), false);
});
