import React from 'react';

export default function ModeCortGeMobileDriverView() {
  return (
    <>
      

<header className="absolute top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-4 py-4 border-b border-outline-variant/10">
<button className="w-10 h-10 flex items-center justify-center bg-surface-container-low rounded-full text-primary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">close</span>
</button>
<div className="text-center">
<h1 className="font-headline-md text-headline-md text-primary font-bold">Procession Mode</h1>
<p className="font-label-sm text-label-sm text-secondary mt-1 tracking-widest">ALPHA TEAM CONVOY</p>
</div>
<button className="w-10 h-10 flex items-center justify-center text-primary relative">
<span className="material-symbols-outlined">group</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full border border-surface"></span>
</button>
</header>

<main className="flex-1 w-full h-full relative bg-surface-variant">

<div className="absolute inset-0 w-full h-full bg-surface-container">
<img alt="Procession Route Map" className="w-full h-full object-cover opacity-70 grayscale-[30%] contrast-125 sepia-[20%]" data-alt="A highly stylized, minimalist digital map interface showing a rural route in Provence. The map utilizes a pure, light-mode color palette dominated by warm off-whites, soft linen textures, and thin elegant lines representing country roads. The aesthetic is extremely clean, resembling a high-end editorial infographic or luxury stationery rather than a standard commercial GPS. The overall mood is calm, organized, and organic, perfectly suited for a premium wedding planning tool." data-location="Provence, France" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeMQzIFqDwf9NQiKr-zcy2ycWdz9mX5v-6YRFnAiLOcmAaxc1sioJMnv5w8Xav9m2s9v4svlT8ELM-z7vJQA0Qdv43x458Kj7e9Ko-AK83EcYxp6MaPTegyc_rL8R1rmIS3Lys5idvEKsAbYUVDPaL2Xl5hMQo4twWTzcowywO4isOLSEYVKhIjJLM8nZ2JD3ydxpOyLFtIhlYQU38ZQEdRPoiXrihHyupKiOzUvCRvmSJw5yhBhiI8O5Yy3WDHy-wg5_eDRh1PfzR"/>
</div>

<svg className="absolute inset-0 w-full h-full pointer-events-none" preserveaspectratio="none" viewbox="0 0 100 100">
<path className="opacity-60" d="M 20,80 Q 40,60 60,70 T 80,30" fill="none" stroke="#725a39" stroke-dasharray="2 1" stroke-width="0.8"></path>
</svg>

<div className="absolute top-[65%] left-[55%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
<div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
<div className="w-4 h-4 bg-primary rounded-full shadow-lg border-2 border-surface"></div>
</div>
</div>
</div>

<div className="absolute top-[35%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
<div className="bg-surface px-2 py-1 rounded shadow-sm border border-outline-variant/20 mb-1">
<span className="font-label-sm text-label-sm text-secondary">Lead Car</span>
</div>
<div className="w-3 h-3 bg-secondary rounded-full border-2 border-surface shadow-sm"></div>
</div>

<div className="absolute top-24 left-4 right-4 z-30 bg-surface/75 backdrop-blur-2xl rounded-2xl p-4 flex justify-between items-center border border-outline-variant/10 shadow-sm">
<div className="flex flex-col items-center flex-1">
<span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase mb-1">Speed</span>
<div className="flex items-baseline gap-1">
<span className="font-headline-md text-headline-md text-on-surface">42</span>
<span className="font-body-md text-body-md text-secondary text-sm">km/h</span>
</div>
</div>
<div className="w-px h-12 bg-outline-variant/20"></div>
<div className="flex flex-col items-center flex-1">
<span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase mb-1">ETA</span>
<span className="font-headline-md text-headline-md text-primary">15:45</span>
</div>
<div className="w-px h-12 bg-outline-variant/20"></div>
<div className="flex flex-col items-center flex-1">
<span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase mb-1">Distance</span>
<div className="flex items-baseline gap-1">
<span className="font-headline-md text-headline-md text-on-surface">8.4</span>
<span className="font-body-md text-body-md text-secondary text-sm">km</span>
</div>
</div>
</div>

<button className="absolute bottom-[280px] right-6 z-30 w-16 h-16 bg-primary text-on-primary rounded-full shadow-[0_8px_30px_rgba(114,90,57,0.3)] flex items-center justify-center hover:bg-on-primary-container transition-colors">
<span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: '"FILL" 1' }}>mic</span>
</button>
</main>

<div className="absolute bottom-0 left-0 right-0 z-40 bg-surface rounded-t-3xl border-t border-outline-variant/10 shadow-[0_-20px_40px_rgba(0,0,0,0.03)] px-6 pt-3 pb-8">

<div className="w-12 h-1 bg-surface-container-high rounded-full mx-auto mb-6"></div>
<div className="flex items-center justify-between mb-6">
<h2 className="font-headline-md text-headline-md text-on-surface">Convoy Status</h2>
<span className="font-label-sm text-label-sm text-primary bg-primary-container/20 px-3 py-1 rounded-full">On Schedule</span>
</div>

<div className="grid grid-cols-3 gap-3 mb-6">
<button className="flex flex-col items-center justify-center bg-surface-container-low py-4 px-2 rounded-2xl hover:bg-surface-container transition-colors border border-transparent">
<span className="material-symbols-outlined text-secondary mb-2">traffic</span>
<span className="font-label-sm text-label-sm text-on-surface text-center">Traffic</span>
</button>
<button className="flex flex-col items-center justify-center bg-error-container/20 py-4 px-2 rounded-2xl border border-error/10 hover:bg-error-container/40 transition-colors text-error">
<span className="material-symbols-outlined mb-2">warning</span>
<span className="font-label-sm text-label-sm text-center">Problem</span>
</button>
<button className="flex flex-col items-center justify-center bg-primary-container/20 py-4 px-2 rounded-2xl border border-primary/10 hover:bg-primary-container/40 transition-colors text-on-primary-container">
<span className="material-symbols-outlined mb-2">flag</span>
<span className="font-label-sm text-label-sm text-center">Arrived</span>
</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center text-primary">
<span className="material-symbols-outlined">church</span>
</div>
<div>
<p className="font-label-sm text-label-sm text-secondary tracking-widest uppercase mb-1">Next Destination</p>
<p className="font-body-lg text-body-lg text-on-surface">Domaine de Valmouriane</p>
</div>
</div>
<button className="text-primary p-2">
<span className="material-symbols-outlined">directions</span>
</button>
</div>
</div>

    </>
  );
}
