import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

export default function RCapitulatifDesVHiculesModeCortGe() {
  return (
    <>
      <TopAppBar title="Mode Cortège - Flotte" role="PLANNER" />

<main className="w-full flex-1 h-screen overflow-y-auto bg-background pt-20 pb-32">
<div className="max-w-container-max mx-auto px-4 md:px-12 py-8 md:py-16">

<header className="mb-16">
<div className="flex items-end justify-between">
<div>
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-4 block">Live Operations</span>
<h2 className="font-headline-xl text-headline-xl text-on-background">Mode Cortège</h2>
</div>
<div className="flex gap-4">
<button className="px-6 py-3 border border-outline-variant text-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-container transition-colors duration-300 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">map</span>
                            View Map
                        </button>
</div>
</div>
</header>

<section className="grid grid-cols-3 gap-6 mb-16">

<div className="bg-surface-container-lowest p-8 border-[0.5px] border-outline-variant/30 flex flex-col justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total Convoy</span>
<div className="mt-6 flex items-baseline gap-2">
<span className="font-headline-xl text-headline-xl text-on-background">08</span>
<span className="font-body-md text-body-md text-on-surface-variant">Vehicles</span>
</div>
</div>

<div className="bg-surface-container-low p-8 border-[0.5px] border-outline-variant/30 flex flex-col justify-between">
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">En Route</span>
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
</div>
<div className="mt-6 flex items-baseline gap-2">
<span className="font-headline-xl text-headline-xl text-primary">07</span>
<span className="font-body-md text-body-md text-on-surface-variant">Active</span>
</div>
</div>

<div className="bg-error-container/20 p-8 border-[0.5px] border-error-container flex flex-col justify-between">
<div className="flex justify-between items-center">
<span className="font-label-sm text-label-sm text-on-error-container uppercase tracking-widest">Alerts</span>
<span className="material-symbols-outlined text-error">warning</span>
</div>
<div className="mt-6">
<span className="font-headline-md text-headline-md text-error block mb-1">Vehicle 04 Delayed</span>
<span className="font-body-md text-body-md text-on-surface-variant opacity-80">Traffic incident ahead</span>
</div>
</div>
</section>

<section>
<div className="flex justify-between items-center mb-8 border-b border-outline-variant/50 pb-4">
<h3 className="font-headline-md text-headline-md text-on-background">Fleet Telemetry</h3>
<div className="flex gap-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
<span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Lead</span>
<span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Support</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

<article className="bg-surface p-8 border-[0.5px] border-outline-variant/30 relative overflow-hidden group">

<div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
<div className="flex justify-between items-start mb-8">
<div>
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-2 block flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">stars</span> Lead Car
                                </span>
<h4 className="font-headline-lg text-headline-lg text-on-background">Maybach S680</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Driver: A. Laurent</p>
</div>
<div className="px-3 py-1 bg-surface-container-high text-on-surface text-[11px] font-medium tracking-widest uppercase">
                                On Route
                            </div>
</div>
<div className="grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant/20">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Speed</span>
<span className="font-body-lg text-body-lg text-on-background">45 km/h</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Fuel/Bat</span>
<span className="font-body-lg text-body-lg text-on-background">88%</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Dist. from Lead</span>
<span className="font-body-lg text-body-lg text-on-background">--</span>
</div>
</div>
</article>

<article className="bg-surface-container-lowest p-8 border-[0.5px] border-outline-variant/30">
<div className="flex justify-between items-start mb-8">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2 block">Vehicle 02</span>
<h4 className="font-headline-md text-headline-md text-on-background">S-Class W223</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Driver: M. Dubois</p>
</div>
<div className="px-3 py-1 bg-surface-container-high text-on-surface text-[11px] font-medium tracking-widest uppercase">
                                On Route
                            </div>
</div>
<div className="grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant/20">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Speed</span>
<span className="font-body-lg text-body-lg text-on-background">44 km/h</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Fuel/Bat</span>
<span className="font-body-lg text-body-lg text-on-background">92%</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Dist. from Lead</span>
<span className="font-body-lg text-body-lg text-on-background">15 m</span>
</div>
</div>
</article>

<article className="bg-surface-container-lowest p-8 border-[0.5px] border-outline-variant/30">
<div className="flex justify-between items-start mb-8">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2 block">Vehicle 03</span>
<h4 className="font-headline-md text-headline-md text-on-background">V-Class VIP</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Driver: S. Martin</p>
</div>
<div className="px-3 py-1 bg-surface-container-high text-on-surface text-[11px] font-medium tracking-widest uppercase">
                                On Route
                            </div>
</div>
<div className="grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant/20">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Speed</span>
<span className="font-body-lg text-body-lg text-on-background">44 km/h</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Fuel/Bat</span>
<span className="font-body-lg text-body-lg text-on-background">75%</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Dist. from Lead</span>
<span className="font-body-lg text-body-lg text-on-background">32 m</span>
</div>
</div>
</article>

<article className="bg-error-container/5 p-8 border-[0.5px] border-error/20">
<div className="flex justify-between items-start mb-8">
<div>
<span className="font-label-sm text-label-sm text-error uppercase tracking-widest mb-2 block flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">warning</span> Vehicle 04
                                </span>
<h4 className="font-headline-md text-headline-md text-on-background">Range Rover SV</h4>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Driver: J. Moreau</p>
</div>
<div className="px-3 py-1 bg-error/10 text-error text-[11px] font-medium tracking-widest uppercase border border-error/20">
                                Delayed
                            </div>
</div>
<div className="grid grid-cols-3 gap-4 pt-6 border-t border-error/10">
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Speed</span>
<span className="font-body-lg text-body-lg text-on-background">0 km/h</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1 opacity-70">Fuel/Bat</span>
<span className="font-body-lg text-body-lg text-on-background">60%</span>
</div>
<div>
<span className="font-label-sm text-label-sm text-error uppercase tracking-widest block mb-1 opacity-70">Dist. from Lead</span>
<span className="font-body-lg text-body-lg text-error">450 m</span>
</div>
</div>
</article>
</div>
</section>
</div>
</main>
<BottomNavBar />
    </>
  );
}
