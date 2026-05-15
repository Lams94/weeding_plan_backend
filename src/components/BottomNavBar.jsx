import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { visibleNavigation } from '../lib/accessControl';

export default function BottomNavBar() {
  const activeWedding = useStore(state => state.activeWedding);
  const currentAccessRole = useStore(state => state.currentAccessRole);
  const items = visibleNavigation(currentAccessRole, activeWedding || {}).flatMap(section => section.items).slice(0, 5);

  return (
    <nav className="md:hidden bg-surface-container-lowest/80 dark:bg-inverse-surface/80 backdrop-blur-3xl text-surface-tint dark:text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-[0.12em] border border-outline-variant/50 shadow-xl fixed bottom-8 left-0 right-0 z-50 flex justify-around items-center h-16 px-4 mx-auto w-[92%] max-w-lg rounded-full">
      {items.map((item, index) => (
        <Link key={item.to} className={`${index === 0 ? 'text-primary dark:text-primary-fixed font-semibold scale-110' : 'text-on-secondary-container/60 dark:text-on-secondary-fixed-variant'} flex flex-col items-center justify-center hover:text-primary transition-all duration-300 active:scale-90`} to={item.to}>
          <span className="material-symbols-outlined mb-1" data-icon={item.icon}>{item.icon}</span>
          <span className="text-[8px] leading-none max-w-14 truncate">{item.label.split(' ')[0]}</span>
        </Link>
      ))}
    </nav>
  );
}
