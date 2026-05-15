import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { roleLabels, visibleNavigation } from '../lib/accessControl';

export default function TopAppBar({ title = 'Cockpit - Prestige Edition', role }) {
  const toggleMenu = useStore(state => state.toggleMenu);
  const activeWedding = useStore(state => state.activeWedding);
  const currentAccessRole = useStore(state => state.currentAccessRole);
  const displayRole = roleLabels[currentAccessRole] || role || currentAccessRole;
  const items = visibleNavigation(currentAccessRole, activeWedding || {}).flatMap(section => section.items).slice(0, 6);

  return (
    <header className="bg-surface dark:bg-background text-primary dark:text-primary-fixed font-headline-md text-headline-md font-label-sm text-label-sm uppercase tracking-widest docked full-width top-0 border-b border-outline-variant/30 flat no shadows flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-20 w-full fixed z-40 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-4 min-w-0">
        <button type="button" onClick={toggleMenu} className="material-symbols-outlined hover:opacity-70 transition-opacity duration-300 cursor-pointer">menu</button>
        <span className="font-headline-md text-headline-md text-on-surface dark:text-on-background tracking-tight truncate">{title}</span>
      </div>
      <div className="hidden md:flex gap-6">
        {items.map(item => (
          <Link key={item.to} className="text-on-surface-variant hover:text-primary transition-opacity duration-300 active:opacity-80 active:scale-95 transition-all" to={item.to}>
            {item.label.split(' ')[0]}
          </Link>
        ))}
      </div>
      <div className="flex items-center">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">{displayRole}</span>
      </div>
    </header>
  );
}
