import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function MessagerieBackstageLinenPure() {
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
      <TopAppBar title="Backstage Chat" role="PLANNER" />

<div className="flex w-full h-screen pt-[72px] pb-[80px]">
<aside className="hidden md:flex w-96 flex-col border-r border-outline-variant/20 bg-surface-container-lowest flex-shrink-0">
<div className="p-6 pb-2 border-b border-outline-variant/10">
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Messages</h2>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary text-[20px]">search</span>
<input className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-secondary focus:ring-1 focus:ring-primary focus:bg-surface-container transition-colors" placeholder="Search conversations..." type="text"/>
</div>
</div>
<div className="flex-1 overflow-y-auto p-4 space-y-2">

<div className="bg-surface-container px-4 py-4 rounded-xl cursor-pointer transition-colors relative">
<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
<div className="flex justify-between items-start mb-1">
<h3 className="font-body-md text-body-md font-semibold text-on-surface">The Beaulieu Wedding</h3>
<span className="font-label-sm text-label-sm text-secondary">10:42 AM</span>
</div>
<p className="font-body-md text-body-md text-secondary truncate">Sarah: The floral arrangements arrived, they look perfect.</p>
<div className="mt-3 flex gap-2">
<span className="px-2 py-1 bg-surface-container-high rounded-md font-label-sm text-label-sm text-on-surface-variant">Logistics</span>
<span className="px-2 py-1 bg-surface-container-high rounded-md font-label-sm text-label-sm text-on-surface-variant">Florals</span>
</div>
</div>

<div className="px-4 py-4 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors">
<div className="flex justify-between items-start mb-1">
<h3 className="font-body-md text-body-md text-on-surface">Gala de Charité</h3>
<span className="font-label-sm text-label-sm text-secondary">Yesterday</span>
</div>
<p className="font-body-md text-body-md text-secondary truncate">Pierre: Finalizing the seating chart now.</p>
</div>

</div>
</aside>

<section className="flex-1 flex flex-col bg-surface relative">

<div className="h-20 px-8 flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-lowest/80 backdrop-blur-md z-10 sticky top-0">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">The Beaulieu Wedding</h2>
<p className="font-label-sm text-label-sm text-secondary mt-1 tracking-widest uppercase">Internal Logistics Channel</p>
</div>
<div className="flex items-center gap-4">
<button className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">call</span>
</button>
<button className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined">more_horiz</span>
</button>
</div>
</div>

<div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col">

<div className="flex justify-center mb-4">
<span className="px-4 py-1 bg-surface-container rounded-full font-label-sm text-label-sm text-secondary">Today</span>
</div>

{messages.map((msg) => {
  const isMe = msg.sender.includes('(You)');
  
  if (isMe) {
    return (
      <div key={msg.id} className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary-container font-label-sm text-label-sm">
          {msg.sender.charAt(0)}
        </div>
        <div className="space-y-2 flex flex-col items-end">
          <div className="flex items-baseline gap-2 flex-row-reverse">
            <span className="font-body-md text-body-md font-medium text-on-surface">{msg.sender}</span>
            <span className="font-label-sm text-label-sm text-tertiary">{msg.time}</span>
          </div>
          <div className="bg-primary p-4 rounded-2xl rounded-tr-none text-on-primary shadow-sm">
            <p className="font-body-md text-body-md">{msg.text.replace(/"/g, '')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={msg.id} className="flex gap-4 max-w-2xl">
      <div className={`w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 text-on-surface-variant font-label-sm text-label-sm`}>
        {msg.sender.charAt(0)}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="font-body-md text-body-md font-medium text-on-surface">{msg.sender}</span>
          <span className="font-label-sm text-label-sm text-tertiary">{msg.time}</span>
        </div>
        <div className={`bg-surface-container-lowest p-4 rounded-2xl rounded-tl-none border border-outline-variant/10 shadow-sm ${msg.isImportant ? 'border-l-4 border-l-tertiary' : ''}`}>
          <p className="font-body-md text-body-md text-on-surface">{msg.text.replace(/"/g, '')}</p>
        </div>
      </div>
    </div>
  );
})}

</div>

<div className="p-4 md:p-6 bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/10">
<div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4">
<button className="hidden md:flex w-12 h-12 rounded-full items-center justify-center text-secondary hover:bg-surface-container transition-colors flex-shrink-0">
<span className="material-symbols-outlined">add</span>
</button>
<div className="flex-1 bg-surface-container rounded-2xl p-2 flex items-end">
<textarea 
  className="w-full bg-transparent border-none resize-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder:text-secondary py-2 px-3 max-h-32 outline-none" 
  placeholder="Type a message..." 
  rows="1" 
  style={{ minHeight: '44px' }}
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
></textarea>
</div>
<button 
  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm"
  onClick={handleSend}
>
<span className="material-symbols-outlined ml-1">send</span>
</button>
</div>
</div>
</section>
</div>

<BottomNavBar />
    </>
  );
}
