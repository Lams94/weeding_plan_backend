import React from 'react';
import { Link } from 'react-router-dom';

export default function BottomNavBar() {
  return (
    <nav className="md:hidden bg-surface-container-lowest/80 dark:bg-inverse-surface/80 backdrop-blur-3xl text-surface-tint dark:text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-[0.2em] border border-outline-variant/50 shadow-xl fixed bottom-8 left-0 right-0 z-50 flex justify-around items-center h-16 px-8 mx-auto w-[90%] max-w-lg rounded-full">
      <Link className="text-primary dark:text-primary-fixed font-semibold scale-110 flex flex-col items-center justify-center hover:text-primary transition-all duration-300 active:scale-90 transition-transform duration-200" to="/">
        <span className="material-symbols-outlined mb-1" data-icon="calendar_today" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_today</span>
        <span className="text-[8px] leading-none">AGENDA</span>
      </Link>
      <Link className="text-on-secondary-container/60 dark:text-on-secondary-fixed-variant flex flex-col items-center justify-center hover:text-primary transition-all duration-300 active:scale-90 transition-transform duration-200" to="/planning">
        <span className="material-symbols-outlined mb-1" data-icon="checklist">checklist</span>
        <span className="text-[8px] leading-none">TODO</span>
      </Link>
      <Link className="text-on-secondary-container/60 dark:text-on-secondary-fixed-variant flex flex-col items-center justify-center hover:text-primary transition-all duration-300 active:scale-90 transition-transform duration-200" to="/chat">
        <span className="material-symbols-outlined mb-1" data-icon="chat_bubble_outline">chat_bubble_outline</span>
        <span className="text-[8px] leading-none">BACKSTAGE</span>
      </Link>
      <Link className="text-on-secondary-container/60 dark:text-on-secondary-fixed-variant flex flex-col items-center justify-center hover:text-primary transition-all duration-300 active:scale-90 transition-transform duration-200" to="/salle">
        <span className="material-symbols-outlined mb-1" data-icon="grid_view">grid_view</span>
        <span className="text-[8px] leading-none">FLOORPLAN</span>
      </Link>
      <Link className="text-on-secondary-container/60 dark:text-on-secondary-fixed-variant flex flex-col items-center justify-center hover:text-primary transition-all duration-300 active:scale-90 transition-transform duration-200" to="/budget">
        <span className="material-symbols-outlined mb-1" data-icon="payments">payments</span>
        <span className="text-[8px] leading-none">BUDGET</span>
      </Link>
    </nav>
  );
}
