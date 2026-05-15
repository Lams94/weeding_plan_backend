import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { roleLabels } from '../lib/accessControl';

export default function AccessDenied() {
  const role = useStore(state => state.currentAccessRole);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <section className="bg-surface border border-outline-variant rounded-xl p-8 max-w-xl text-center">
        <span className="material-symbols-outlined text-primary text-5xl mb-4">lock</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">Espace cloisonné</h1>
        <p className="text-on-surface-variant mb-6">
          Le rôle actif {roleLabels[role] || role} n'a pas accès à cette zone sur ce projet.
        </p>
        <Link to="/" className="inline-flex items-center justify-center bg-primary text-on-primary rounded-full px-6 py-3 font-label-sm uppercase tracking-widest">
          Retour cockpit
        </Link>
      </section>
    </main>
  );
}
