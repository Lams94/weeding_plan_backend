import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function CosystMePrestatairesSuiviAdmin() {
  const vendors = useStore(state => state.vendors);

  return (
    <>
      <TopAppBar title="Ecosystème Prestataires" role="PLANNER" />

<main className="w-full flex flex-col min-h-screen pb-32">
<div className="px-container-padding-mobile md:px-container-padding-desktop py-12 md:py-24 flex-grow max-w-container-max mx-auto w-full">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
<div className="max-w-2xl">
<h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">Curated Partners</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant">Manage your elite vendor ecosystem. Track contracts, payments, and deliverables with poise.</p>
</div>
<button className="font-label-sm text-label-sm uppercase tracking-widest px-6 py-3 border border-primary text-primary hover:bg-surface-container-low transition-colors duration-300 flex items-center gap-2 group">
<span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform duration-300">add</span>
                    NEW VENDOR
                </button>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
{vendors.map((vendor, index) => {
  const isFirst = index === 0;
  const isSecond = index === 1;
  const colSpanClass = isFirst ? 'md:col-span-8' : (isSecond ? 'md:col-span-4' : 'md:col-span-6');
  
  return (
    <div key={vendor.id} className={`${colSpanClass} border-[0.5px] border-outline-variant p-8 flex flex-col justify-between relative overflow-hidden group hover:border-primary transition-colors duration-300`}>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-1">{vendor.role}</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">{vendor.name}</h3>
          </div>
          <div className={`px-3 py-1 rounded-sm border ${vendor.status.includes('Confirmed') || vendor.paid === vendor.budget ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-container-highest border-outline-variant text-on-surface-variant'}`}>
            <span className="font-label-sm text-label-sm">{vendor.status}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t-[0.5px] border-outline-variant/50 pt-6 mt-6">
          <div className="w-full">
             <div className="flex justify-between items-end mb-2">
                <span className="font-body-md text-body-md text-on-surface">Paid: €{(vendor.paid/1000).toFixed(1)}k</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Total: €{(vendor.budget/1000).toFixed(1)}k</span>
             </div>
             <div className="h-[2px] w-full bg-surface-container-highest">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(vendor.paid / vendor.budget) * 100}%` }}></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
})}
</div>
</div>
</main>

<BottomNavBar />
    </>
  );
}
