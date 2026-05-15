import React from 'react';
import useStore from '../store/useStore';
import { ROLES, roleLabels } from '../lib/accessControl';

const roleOrder = [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.VENDOR, ROLES.GUEST, ROLES.BENEFICIARY];
const guestGroups = ['famille', 'amis', 'temoins', 'vip', 'prestataires'];

export default function AccessDebugBar() {
  const role = useStore(state => state.currentAccessRole);
  const setRole = useStore(state => state.setCurrentAccessRole);
  const group = useStore(state => state.currentGuestGroup);
  const setGroup = useStore(state => state.setCurrentGuestGroup);

  return (
    <div className="fixed top-20 right-3 z-[90] bg-surface border border-outline-variant shadow-lg rounded-lg p-2 flex flex-col gap-2 max-w-[220px]">
      <label className="text-[10px] uppercase tracking-widest text-secondary">Accès debug</label>
      <select value={role} onChange={event => setRole(event.target.value)} className="text-xs bg-surface-container-low border border-outline-variant rounded-md px-2 py-2">
        {roleOrder.map(item => (
          <option key={item} value={item}>{roleLabels[item]}</option>
        ))}
      </select>
      {role === ROLES.GUEST && (
        <select value={group} onChange={event => setGroup(event.target.value)} className="text-xs bg-surface-container-low border border-outline-variant rounded-md px-2 py-2">
          {guestGroups.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
      )}
    </div>
  );
}
