import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

export default function CanvaEditorLinenPureEdition() {
  return (
    <>
      <TopAppBar title="Design Hub - Editor" role="EDITORIALIST" />
      
<main className="flex-1 flex flex-col h-screen bg-surface-container-lowest pt-[72px] pb-[80px]">

<header className="flex justify-between items-center px-6 py-4 border-b-[0.5px] border-outline-variant bg-surface-bright">
<div className="flex items-center space-x-6">
<div className="flex items-center space-x-2">
<span className="material-symbols-outlined text-outline">description</span>
<span className="font-body-md text-body-md text-on-surface">Eleanor &amp; James Invitation.pdf</span>
</div>
<div className="h-6 w-[1px] bg-outline-variant"></div>
<div className="flex items-center space-x-4">
<button className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors">
<span className="font-body-md text-body-md">Newsreader</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</button>
<div className="flex items-center border border-outline-variant rounded-sm overflow-hidden">
<button className="px-2 py-1 text-on-surface-variant hover:bg-surface-container-low transition-colors">-</button>
<input className="w-12 text-center border-none bg-transparent font-body-md text-body-md p-0 focus:ring-0 text-on-surface" type="text" value="48"/>
<button className="px-2 py-1 text-on-surface-variant hover:bg-surface-container-low transition-colors">+</button>
</div>
<button className="w-6 h-6 rounded-sm bg-[#584324] border border-outline-variant"></button>
<div className="flex items-center space-x-2 border-l border-outline-variant pl-4">
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">format_align_left</span></button>
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">format_align_center</span></button>
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">format_list_bulleted</span></button>
</div>
</div>
</div>
<div className="flex items-center space-x-4">
<div className="flex items-center -space-x-2 mr-4">
<div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-bright flex items-center justify-center text-xs font-medium text-on-surface-variant">EJ</div>
<div className="w-8 h-8 rounded-full bg-primary-container border-2 border-surface-bright flex items-center justify-center text-xs font-medium text-on-primary-container">PA</div>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors p-2"><span className="material-symbols-outlined">visibility</span></button>
<button className="bg-primary-container text-on-primary-container px-6 py-2 font-label-sm text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
                    Share
                </button>
<button className="border border-outline-variant text-on-surface px-6 py-2 font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-container-low transition-colors">
                    Export
                </button>
</div>
</header>

<div className="flex-1 flex overflow-hidden">

<aside className="w-20 bg-surface-bright border-r-[0.5px] border-outline-variant flex flex-col items-center py-6 space-y-8 overflow-y-auto">
<button className="flex flex-col items-center space-y-1 text-on-surface-variant hover:text-primary transition-colors group">
<span className="material-symbols-outlined group-hover:scale-110 transition-transform">view_cozy</span>
<span className="text-[10px] uppercase tracking-wider">Templates</span>
</button>
<button className="flex flex-col items-center space-y-1 text-primary group">
<span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontVariationSettings: '"FILL" 1' }}>category</span>
<span className="text-[10px] uppercase tracking-wider font-medium">Elements</span>
</button>
<button className="flex flex-col items-center space-y-1 text-on-surface-variant hover:text-primary transition-colors group">
<span className="material-symbols-outlined group-hover:scale-110 transition-transform">text_fields</span>
<span className="text-[10px] uppercase tracking-wider">Text</span>
</button>
<button className="flex flex-col items-center space-y-1 text-on-surface-variant hover:text-primary transition-colors group">
<span className="material-symbols-outlined group-hover:scale-110 transition-transform">palette</span>
<span className="text-[10px] uppercase tracking-wider">Brand Kit</span>
</button>
<button className="flex flex-col items-center space-y-1 text-on-surface-variant hover:text-primary transition-colors group">
<span className="material-symbols-outlined group-hover:scale-110 transition-transform">cloud_upload</span>
<span className="text-[10px] uppercase tracking-wider">Uploads</span>
</button>
</aside>

<div className="w-72 bg-surface-container-lowest border-r-[0.5px] border-outline-variant flex flex-col">
<div className="p-4 border-b border-outline-variant">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline-variant text-sm">search</span>
<input className="w-full pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-sm font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-primary" placeholder="Search elements..." type="text"/>
</div>
</div>
<div className="flex-1 overflow-y-auto p-4">
<h3 className="font-label-sm text-label-sm uppercase text-on-surface-variant mb-4">Recently Used</h3>
<div className="grid grid-cols-2 gap-2 mb-8">
<div className="aspect-square bg-surface-container-low rounded-sm flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors border border-transparent hover:border-outline-variant">
<img alt="Floral vector element" className="w-16 h-16 object-contain opacity-80 mix-blend-multiply" data-alt="A delicate, minimalist vector illustration of a botanical branch with small leaves, rendered in a warm dark grey on a transparent background, suitable for an elegant wedding invitation design in a light-mode interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL2UG82m1003yBfIB81l8dpGP_jq_qyRyfXv7wI1Y4V5kzM0mCqGBmqFZZRiJ30L4lX7nYfPG3aQizSVDOQDBxMDFhbgzc97PEEt6HeAG489pyB8tEXjFieT5gyV5L-JwYlVQTC_ZU90rBIZaWb50PujCYVfTgDFV9DKTySCDBjDxdh55S0ezSSe09XSrN-pCj8s99djaW8UsjlKuKdI5U39hG2Ghd4Qpv3Cqxa6AU6vcaME9x3F7kYnFYSWqZRJs9dyIRCL6a8djh"/>
</div>
<div className="aspect-square bg-surface-container-low rounded-sm flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors border border-transparent hover:border-outline-variant">
<img alt="Gold foil texture" className="w-16 h-16 object-cover opacity-80" data-alt="A subtle, high-quality gold foil texture swatch, reflecting soft light, designed to be used as an accent material within a clean, minimalist digital design tool interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpTSHc4v8_9bpEuLMUwMl2aeIahSsRdbdMm1IEFfQVTZPRUItzk14DYmSs4tJGEi90nVADtvNA71e_zjwcNWXFGPB4pVwpNoaW1YOgvIbMjX6nG_CfKj7-kFqBIUeGgAFXWzLKlpp4PxfkX_Ba8zAfxpORhtPs9xGT2qFPLgxJ_LtDPw9tkGmZO00oiaWC-S-JbnE6q4be4La2pS0iLok69EBrlvV8XLQfvfM2OWxpMGlvWvABeWy6JTRuGsFT6U03c2upnGvHzM4c"/>
</div>
</div>
<h3 className="font-label-sm text-label-sm uppercase text-on-surface-variant mb-4">Botanicals</h3>
<div className="grid grid-cols-2 gap-2">
<div className="aspect-square bg-surface-container-low rounded-sm flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors border border-transparent hover:border-outline-variant">
<span className="material-symbols-outlined text-outline text-3xl font-light">local_florist</span>
</div>
<div className="aspect-square bg-surface-container-low rounded-sm flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors border border-transparent hover:border-outline-variant">
<span className="material-symbols-outlined text-outline text-3xl font-light">spa</span>
</div>
<div className="aspect-square bg-surface-container-low rounded-sm flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors border border-transparent hover:border-outline-variant">
<span className="material-symbols-outlined text-outline text-3xl font-light">grass</span>
</div>
<div className="aspect-square bg-surface-container-low rounded-sm flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors border border-transparent hover:border-outline-variant">
<span className="material-symbols-outlined text-outline text-3xl font-light">park</span>
</div>
</div>
</div>
</div>

<div className="flex-1 bg-surface-container-low overflow-auto relative flex items-center justify-center p-8">

<div className="absolute bottom-6 right-6 flex items-center bg-surface-bright border border-outline-variant rounded-sm shadow-sm">
<button className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-low transition-colors">-</button>
<span className="font-body-md text-body-md text-on-surface px-2">85%</span>
<button className="px-3 py-1 text-on-surface-variant hover:bg-surface-container-low transition-colors">+</button>
</div>

<div className="bg-white w-[500px] h-[700px] shadow-sm relative overflow-hidden" style={{ boxShadow: '0 4px 24px -4px rgba(0,0,0,0.05)' }}>

<div className="absolute inset-4 border border-blue-200/50 border-dashed pointer-events-none"></div>
<div className="absolute inset-0 p-12 flex flex-col items-center justify-center text-center">
<img alt="Top floral arch" className="w-48 h-auto opacity-70 mb-8 mix-blend-multiply" data-alt="An elegant, minimalist illustration of a botanical floral arch, curving gently. Rendered in a soft, warm grey ink style. Designed as a top decorative element for a high-end wedding invitation within a sophisticated digital canvas." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSVvdJROOv77ct6LAti5aKSv0ndMZAuIMkvmFmGO3RWAvTzWPK2FjXp0_E49gqZpGXaP5bdZqIfmODfpjfK2R7mqrfL_SCgDkKDfVxvDwDBZELgZcCXZFTVKYDdfdxzZNy8Mm8ZLqhDALbrqHdi5ej-cpBAK0zpeCbBpvGUM1rgTNjLdIn6BCVR6ZRBbN4liHO79drt5uIsG6B3nYlaOpkLfTMglBw4QmSVx_2bzzD0VKgxt5Z66TLus6UqfyRAmJrKMyhhlWPA0hU"/>
<p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-[#584324] mb-6">Together with their families</p>
<h2 className="font-headline-xl text-headline-xl text-[#281801] mb-4">Eleanor <span className="italic font-light">&amp;</span> James</h2>
<p className="font-body-md text-body-md text-[#49473f] mb-8 leading-relaxed max-w-[250px]">
                            request the honor of your presence<br/>at their wedding celebration
                        </p>
<div className="border-t border-b border-[#d1c5b8] py-4 mb-8 w-full max-w-[200px]">
<p className="font-label-sm text-label-sm uppercase tracking-widest text-[#584324] mb-1">Saturday, Oct 14</p>
<p className="font-body-md text-body-md text-[#49473f]">Four o'clock in the afternoon</p>
</div>
<p className="font-body-md text-body-md text-[#49473f] uppercase tracking-wider text-sm mb-1">The Grand Estate</p>
<p className="font-body-md text-body-md text-[#49473f] text-sm">Napa Valley, California</p>

<div className="absolute inset-x-8 top-[20%] bottom-[60%] border border-primary pointer-events-none">
<div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
<div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
<div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
<div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full"></div>
<div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border border-outline-variant rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-outline">rotate_right</span>
</div>
</div>
</div>
</div>
</div>

<aside className="w-64 bg-surface-bright border-l-[0.5px] border-outline-variant flex flex-col">
<div className="flex border-b border-outline-variant">
<button className="flex-1 py-3 text-center border-b-2 border-primary font-label-sm text-label-sm uppercase text-primary">Pages</button>
<button className="flex-1 py-3 text-center text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase transition-colors">Layers</button>
</div>
<div className="flex-1 overflow-y-auto p-4 space-y-4">

<div className="group relative">
<div className="absolute top-2 left-2 bg-surface-container-lowest px-1.5 py-0.5 rounded-sm text-[10px] border border-outline-variant z-10">1</div>
<div className="aspect-[3/4] bg-surface-container-low border-2 border-primary rounded-sm p-2 cursor-pointer relative overflow-hidden">
<div className="w-full h-full bg-white flex flex-col items-center justify-center scale-50 origin-top-left shadow-sm p-4">
<div className="w-12 h-4 bg-outline-variant/30 rounded-full mb-2"></div>
<div className="w-24 h-6 bg-outline-variant/50 mb-2"></div>
<div className="w-16 h-3 bg-outline-variant/30 mb-4"></div>
<div className="w-20 h-[1px] bg-outline-variant mb-4"></div>
</div>
</div>
<div className="flex justify-between items-center mt-2">
<span className="font-body-md text-body-md text-sm text-on-surface">Invitation Front</span>
<button className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-primary transition-all"><span className="material-symbols-outlined text-sm">more_vert</span></button>
</div>
</div>

<div className="group relative">
<div className="absolute top-2 left-2 bg-surface-container-lowest px-1.5 py-0.5 rounded-sm text-[10px] border border-outline-variant z-10">2</div>
<div className="aspect-[3/4] bg-surface-container-low border border-outline-variant rounded-sm p-2 cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden">
<div className="w-full h-full bg-white flex flex-col items-center justify-center scale-50 origin-top-left shadow-sm p-4">
<div className="w-16 h-4 bg-outline-variant/30 mb-6"></div>
<div className="w-20 h-3 bg-outline-variant/30 mb-2"></div>
<div className="w-20 h-3 bg-outline-variant/30 mb-2"></div>
<div className="w-12 h-3 bg-outline-variant/30"></div>
</div>
</div>
<div className="flex justify-between items-center mt-2">
<span className="font-body-md text-body-md text-sm text-on-surface-variant">Details Card</span>
<button className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-primary transition-all"><span className="material-symbols-outlined text-sm">more_vert</span></button>
</div>
</div>
<button className="w-full py-3 border border-dashed border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors flex items-center justify-center space-x-2 rounded-sm">
<span className="material-symbols-outlined text-sm">add</span>
<span className="font-label-sm text-label-sm uppercase">Add Page</span>
</button>
</div>
</aside>
</div>
</main>
<BottomNavBar />
    </>
  );
}
