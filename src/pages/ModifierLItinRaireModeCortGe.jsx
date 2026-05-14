import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

export default function ModifierLItinRaireModeCortGe() {
  return (
    <>
      <TopAppBar title="Modifier l'Itinéraire" role="PLANNER" />

      <main className="w-full flex flex-col h-screen pt-16 pb-20 bg-surface-container-lowest relative overflow-hidden">

        {/* Background map */}
        <div className="absolute inset-0 z-0 bg-surface-variant">
          <img
            alt="Map of Saint-Rémy-de-Provence"
            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUq3phRp2XWl4QSHPY2dU9Kn96CqdgtvxQ9DkC8AhEB3Yt9cYzSiQGpBlhLkIjxoSGuxfxmjQgX-824s9gJLijQlMZJH04_YYTlBxKnp4fm1IzdYbSU4VJ_XzlVbd4pbcloema5OVKjw3a5uTuhT3MG3pFjOhp5R-SC09H4PwdloEaR5RiDGr3COz-u4Y8PtZpbh4wmNbUbmn3mDqaBSaxTYiJ6s2knnJNYyUCuiImEUwraOsaNvE05wTs8jTQHFg26coma3C0Pcjf"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/80 via-transparent to-transparent z-0"></div>
        </div>

        {/* Side Panel */}
        <div className="relative z-10 w-full max-w-[480px] h-full bg-surface/90 backdrop-blur-xl border-r border-outline-variant/30 flex flex-col shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)]">

          <header className="pt-12 pb-8 px-10 border-b border-outline-variant/20">
            <div className="flex items-center gap-3 text-on-surface-variant mb-4">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 0' }}>route</span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Mode Cortège</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Modifier l'Itinéraire</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Ajustez le parcours du convoi en temps réel.</p>
          </header>

          <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10">

            {/* Search input */}
            <div className="space-y-4">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">search</span>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/50 pl-8 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:border-primary transition-colors"
                  placeholder="Ajouter une étape ou destination..."
                  type="text"
                />
              </div>
            </div>

            {/* Waypoints */}
            <div className="space-y-6">
              <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Points de Passage</h3>
              <div className="relative pl-6 space-y-8">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-outline-variant/30"></div>

                <div className="relative flex items-start gap-4 group cursor-pointer">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-surface border-2 border-outline-variant group-hover:border-primary transition-colors z-10"></div>
                  <div className="flex-1">
                    <p className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">Point de départ</p>
                    <p className="font-body-md text-body-md text-on-surface-variant/70 text-sm">Hôtel Le Mas de Peint</p>
                  </div>
                  <button className="text-on-surface-variant/50 hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="relative flex items-start gap-4 group cursor-pointer">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-surface border-2 border-primary z-10"></div>
                  <div className="flex-1">
                    <p className="font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors">Église de Saint-Rémy</p>
                    <p className="font-body-md text-body-md text-on-surface-variant/70 text-sm">Arrivée prévue : 14:30</p>
                  </div>
                  <button className="text-on-surface-variant/50 hover:text-error transition-colors opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="relative flex items-start gap-4 group cursor-pointer">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-primary z-10 flex items-center justify-center">
                    <div className="w-1 h-1 bg-surface rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-lg text-body-lg text-on-surface font-medium group-hover:text-primary transition-colors">Domaine de Valmouriane</p>
                    <p className="font-body-md text-body-md text-on-surface-variant/70 text-sm">Réception principale</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Route preferences */}
            <div className="space-y-6 pt-6 border-t border-outline-variant/20">
              <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Préférences de Route</h3>
              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">Éviter les péages &amp; trafic</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">Route panoramique</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="p-10 bg-surface-container-low border-t border-outline-variant/20 space-y-6">
            <div className="bg-surface p-6 rounded-lg border border-outline-variant/10 flex justify-between items-center">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant mb-1">Impact sur l'horaire</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-md text-headline-md text-primary">+5 mins</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">/ +2.4 km</span>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary/80"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface">Flotte Prête</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">08 véhicules</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-4 px-6 bg-transparent border border-outline-variant text-on-surface font-body-md text-body-md tracking-wide hover:bg-surface-variant transition-colors rounded">
                Annuler
              </button>
              <button className="flex-[2] py-4 px-6 bg-primary text-on-primary font-body-md text-body-md tracking-wide hover:bg-primary-container hover:text-on-primary-container transition-colors rounded shadow-sm">
                Confirmer le Nouvel Itinéraire
              </button>
            </div>
          </div>

        </div>
      </main>

      <BottomNavBar />
    </>
  );
}
