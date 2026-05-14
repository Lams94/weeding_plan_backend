import React, { useState, useEffect } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

export default function ModeCortGeGpsSuiviEnDirect() {
  const [gpsData, setGpsData] = useState({
    remainingKm: 12.4,
    speed: 45,
    vehicles: 24,
    etaHead: 14,
    headTop: 30,
    headLeft: 40,
    tailTop: 60,
    tailLeft: 20,
    status: 'Stable'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGpsData(prev => {
        if (prev.remainingKm <= 0) return { ...prev, speed: 0, status: 'Arrived' };
        return {
          ...prev,
          remainingKm: Math.max(0, prev.remainingKm - 0.1),
          speed: Math.floor(Math.random() * (55 - 35 + 1) + 35),
          etaHead: Math.max(0, prev.etaHead - 0.2),
          headTop: prev.headTop - 0.2,
          headLeft: prev.headLeft + 0.3,
          tailTop: prev.tailTop - 0.15,
          tailLeft: prev.tailLeft + 0.2
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <TopAppBar title="Cortège GPS Live" role="LOGISTICS" />

      <main className="flex-1 w-full overflow-y-auto bg-surface relative pt-20 pb-24">
        <div className="max-w-container-max mx-auto px-6 py-12 md:py-16 flex flex-col gap-12">

          <header className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-primary tracking-[0.2em] uppercase">Live Operations</span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface">Mode Cortège</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-2">
              Real-time procession monitoring from the Cathedral to the Château. Maintain serene oversight of the convoy's progress.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

            {/* Map Column */}
            <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden relative flex flex-col border-[0.5px] border-outline-variant/30 h-[600px] lg:h-auto">

              {/* Background map image */}
              <div className="absolute inset-0 z-0">
                <img
                  alt="Stylized GPS map"
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdUKcvs17HT3AgQ73l_FFbh_aMKcx4NdXL1mXYKKpvvGpXPFWWPdVcnM_BwFv0TgTOnHGzwrYWtTf1xk6Uey49Foser4_V2DnpBZpe2riUUs-frJbdd0u99k2OcZ1T0GQgUeWxaC6P-MAgJInzTcweMaBAPLEaqfUNV0-p5pnaT4CuqwOxJuU11QtR3-S9mO_dCBgSWPIaigetHWPRuZTW8oJA9PQEmUNMA07I6KQsav5kaL2MP8i2MyuVRQ-m-99OAQz84qHrowMe"
                />
              </div>

              {/* Status badge */}
              <div className="relative z-10 p-6 flex justify-between items-start pointer-events-none">
                <div className="bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/20 inline-flex items-center gap-2 shadow-sm pointer-events-auto">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider">Route Active</span>
                </div>
              </div>

              {/* Head of procession marker */}
              <div
                className="absolute z-10 pointer-events-auto group transition-all duration-1000 ease-linear"
                style={{ top: `${gpsData.headTop}%`, left: `${gpsData.headLeft}%` }}
              >
                <div className="w-10 h-10 bg-surface-container-lowest rounded-full border border-primary shadow-sm flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-primary text-xl">directions_car</span>
                </div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-surface backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 text-center shadow-sm">
                  <p className="font-label-sm text-label-sm text-on-surface">Head of Procession</p>
                  <p className="font-body-md text-body-md text-primary font-medium">{Math.ceil(gpsData.etaHead)} min ETA</p>
                </div>
              </div>

              {/* Tail of procession marker */}
              <div
                className="absolute z-10 pointer-events-auto transition-all duration-1000 ease-linear"
                style={{ top: `${gpsData.tailTop}%`, left: `${gpsData.tailLeft}%` }}
              >
                <div className="w-8 h-8 bg-surface-variant rounded-full border border-outline shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm">directions_car</span>
                </div>
              </div>

            </div>

            {/* Status Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Stats card */}
              <div className="bg-surface-bright rounded-xl p-8 border border-surface-container-high flex flex-col gap-8">
                <h3 className="font-headline-md text-headline-md text-on-surface border-b-[0.5px] border-outline-variant pb-4">Procession Status</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Remaining</span>
                    <span className="font-headline-lg text-headline-lg text-primary">
                      {gpsData.remainingKm.toFixed(1)} <span className="text-lg font-body-md text-on-surface-variant">km</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Speed</span>
                    <span className="font-headline-lg text-headline-lg text-on-surface">
                      {gpsData.speed} <span className="text-lg font-body-md text-on-surface-variant">km/h</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Vehicles in Convoy</span>
                    <div className="flex items-center gap-3">
                      <span className="font-headline-lg text-headline-lg text-on-surface">{gpsData.vehicles}</span>
                      <span className="px-2 py-1 bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm rounded">{gpsData.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-surface-bright rounded-xl p-8 border border-surface-container-high flex flex-col gap-4">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Live Milestones</h3>
                <div className="flex items-center justify-between py-3 border-b border-surface-container">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">flag</span>
                    <span className="font-body-md text-body-md text-on-surface">Head of Procession</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-medium">15:45</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-surface-container">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline">more_horiz</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">Mid-Convoy Anchor</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface-variant">15:48</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline">local_taxi</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">Tail of Procession</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface-variant">15:52</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 flex flex-col gap-4 mt-auto">
                <button className="w-full py-4 px-6 bg-surface border border-outline text-on-surface hover:bg-surface-bright transition-colors rounded-lg flex items-center justify-center gap-2 font-label-sm text-label-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  Broadcast to Drivers
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 px-4 bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-bright transition-colors rounded-lg flex items-center justify-center gap-2 font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">route</span>
                    Update Route
                  </button>
                  <button className="py-3 px-4 bg-error/5 border border-error/20 text-error hover:bg-error/10 transition-colors rounded-lg flex items-center justify-center gap-2 font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">front_hand</span>
                    Halt
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <BottomNavBar />
    </>
  );
}
