import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function TopAppBar({ title = "Cockpit - Prestige Edition", role = "EDITORIALIST" }) {
  const toggleMenu = useStore(state => state.toggleMenu);

  return (
    <header className="bg-surface dark:bg-background text-primary dark:text-primary-fixed font-headline-md text-headline-md font-label-sm text-label-sm uppercase tracking-widest docked full-width top-0 border-b border-outline-variant/30 flat no shadows flex justify-between items-center px-container-padding-mobile md:px-container-padding-desktop h-20 w-full fixed z-40 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-4">
        <span onClick={toggleMenu} className="material-symbols-outlined hover:opacity-70 transition-opacity duration-300 cursor-pointer">menu</span>
        <span className="font-headline-md text-headline-md text-on-surface dark:text-on-background tracking-tight">{title}</span>
      </div>
      <div className="hidden md:flex gap-8">
        <Link className="text-primary font-bold hover:opacity-70 transition-opacity duration-300 active:opacity-80 active:scale-95 transition-all" to="/">AGENDA</Link>
        <Link className="text-on-surface-variant hover:opacity-70 transition-opacity duration-300 active:opacity-80 active:scale-95 transition-all" to="/planning">TODO</Link>
        <Link className="text-on-surface-variant hover:opacity-70 transition-opacity duration-300 active:opacity-80 active:scale-95 transition-all" to="/chat">BACKSTAGE</Link>
        <Link className="text-on-surface-variant hover:opacity-70 transition-opacity duration-300 active:opacity-80 active:scale-95 transition-all" to="/salle">FLOORPLAN</Link>
        <Link className="text-on-surface-variant hover:opacity-70 transition-opacity duration-300 active:opacity-80 active:scale-95 transition-all" to="/crm">GUESTS</Link>
        <Link className="text-on-surface-variant hover:opacity-70 transition-opacity duration-300 active:opacity-80 active:scale-95 transition-all" to="/budget">BUDGET</Link>
      </div>
      <div className="flex items-center">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">{role}</span>
      </div>
    </header>
  );
}
