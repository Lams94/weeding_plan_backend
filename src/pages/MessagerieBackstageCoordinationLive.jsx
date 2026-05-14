import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function MessagerieBackstageCoordinationLive() {
  const { messages, addMessage } = useStore();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      addMessage(inputText);
      setInputText('');
    }
  };

  return (
    <>
      <TopAppBar title="Communications Hub" role="PLANNER" />

<main className="w-full flex flex-col h-screen pt-[72px] pb-[80px]">

<div className="pt-8 pb-4 px-container-padding-mobile md:px-gutter max-w-7xl mx-auto w-full">
<div className="flex gap-8 border-b-[0.5px] border-outline-variant w-full overflow-x-auto pb-4">
<button className="font-label-sm text-label-sm uppercase tracking-widest text-primary border-b-2 border-primary pb-1 flex-shrink-0">
                    Mariés ↔ Planner
                </button>
<button className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors pb-1 flex-shrink-0">
                    Planner ↔ Presta
                </button>
<button className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors pb-1 flex-shrink-0">
                    Inter-Presta
                </button>
</div>
</div>

<div className="flex-grow flex flex-col md:flex-row px-container-padding-mobile md:px-gutter pb-4 max-w-7xl mx-auto w-full gap-gutter h-full min-h-0">

<div className="hidden md:flex w-1/3 flex-col border-[0.5px] border-outline-variant bg-surface-container-lowest h-full overflow-hidden">
<div className="p-4 border-b-[0.5px] border-outline-variant bg-surface-bright">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="w-full bg-transparent border-b-[0.5px] border-outline-variant pl-10 pr-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary placeholder-on-surface-variant/50" placeholder="Search conversations..." type="text"/>
</div>
</div>
<div className="flex-grow overflow-y-auto">

<div className="p-6 border-b-[0.5px] border-outline-variant bg-surface-container-low cursor-pointer border-l-2 border-l-primary">
<div className="flex justify-between items-baseline mb-2">
<h4 className="font-headline-md text-headline-md text-on-surface">The Beaulieu Wedding</h4>
<span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">10:42 AM</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant truncate">Isabella (Bride): We reviewed the floral moodboard, absolutely stunning. Can we discuss...</p>
<div className="mt-3 flex gap-2">
<span className="px-2 py-1 bg-primary-container/20 text-on-primary-container font-label-sm text-[10px] tracking-widest">URGENT</span>
</div>
</div>

<div className="p-6 border-b-[0.5px] border-outline-variant hover:bg-surface-container-lowest cursor-pointer transition-colors group">
<div className="flex justify-between items-baseline mb-2">
<h4 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">Gala de Charité - M. Dupont</h4>
<span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">Yesterday</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant truncate">Planner: I've updated the timeline for the evening. Please confirm receipt.</p>
</div>

</div>
</div>

<div className="w-full md:w-2/3 flex flex-col border-[0.5px] border-outline-variant bg-surface-bright h-full relative overflow-hidden">

<div className="px-8 py-6 border-b-[0.5px] border-outline-variant flex justify-between items-center bg-surface-container-lowest glass-panel z-10 sticky top-0">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">The Beaulieu Wedding</h3>
<p className="font-body-md text-sm text-on-surface-variant">Mariés ↔ Planner Channel • 3 Participants</p>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"wght" 300' }}>more_vert</span>
</button>
</div>

<div className="flex-grow p-4 md:p-8 overflow-y-auto flex flex-col gap-8 bg-[#fcf9f8]">

<div className="flex justify-center my-4">
<span className="font-label-sm text-label-sm text-on-surface-variant bg-surface px-4 py-1 border-[0.5px] border-outline-variant tracking-widest text-[10px]">TODAY</span>
</div>

{messages.map((msg) => {
  const isMe = msg.sender.includes('(You)');
  
  if (isMe) {
    return (
      <div key={msg.id} className="flex flex-col items-end w-3/4 max-w-2xl self-end">
        <span className="font-label-sm text-[10px] text-on-surface-variant mb-2 tracking-widest uppercase text-right">You (Planner) • {msg.time}</span>
        <div className="p-4 md:p-6 bg-primary-container/10 border-[0.5px] border-primary-container text-right rounded-bl-xl rounded-t-xl">
          <p className="font-body-md text-body-md text-on-surface leading-relaxed">
            {msg.text.replace(/"/g, '')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div key={msg.id} className="flex flex-col items-start w-3/4 max-w-2xl">
      <span className="font-label-sm text-[10px] text-on-surface-variant mb-2 tracking-widest uppercase">{msg.sender} • {msg.time}</span>
      <div className={`p-4 md:p-6 bg-surface-container-low border-[0.5px] border-outline-variant rounded-br-xl rounded-t-xl ${msg.isImportant ? 'border-l-4 border-l-tertiary' : ''}`}>
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
          {msg.text.replace(/"/g, '')}
        </p>
      </div>
    </div>
  );
})}

</div>

<div className="p-4 md:p-6 border-t-[0.5px] border-outline-variant bg-surface-container-lowest">
<div className="flex items-end gap-4">
<div className="flex-grow relative">
<textarea 
  className="w-full bg-surface resize-none border-[0.5px] border-outline-variant p-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-0 placeholder-on-surface-variant/50" 
  placeholder="Compose your message..." 
  rows="2"
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
></textarea>
<div className="absolute bottom-4 left-4 flex gap-3 text-on-surface-variant hidden md:flex">
<button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"wght" 300' }}>attach_file</span></button>
<button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: '"wght" 300' }}>image</span></button>
</div>
</div>
<button 
  className="bg-primary text-on-primary px-4 md:px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface-tint transition-colors duration-300 h-[74px] flex items-center justify-center"
  onClick={handleSend}
>
  SEND
</button>
</div>
</div>
</div>
</div>
</main>

<BottomNavBar />

    </>
  );
}
