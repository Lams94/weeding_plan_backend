import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function TableauDeBordCockpit() {
  const agendaItems = useStore(state => state.agendaItems);
  const toggleAgendaDone = useStore(state => state.toggleAgendaDone);
  const messages = useStore(state => state.messages);
  const addMessage = useStore(state => state.addMessage);
  
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    addMessage(newMessage);
    setNewMessage('');
  };

  return (
    <>
      

<TopAppBar title="Cockpit - Prestige Edition" role="EDITORIALIST" />

<main className="pt-32 pb-40 px-container-padding-mobile md:px-container-padding-desktop max-w-screen-2xl mx-auto">
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<section className="md:col-span-7 space-y-12 pr-0 md:pr-12">
<div className="mb-16">
<h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">Bride's Agenda</h1>
<div className="h-px w-24 bg-primary mb-8"></div>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Curated schedule for the day's events. Precision and poise in every moment.</p>
</div>
<div className="relative border-l border-outline-variant/50 ml-4 md:ml-8 pl-8 md:pl-12 space-y-16">

{agendaItems.map((item) => (
  <div key={item.id} className="relative cursor-pointer transition-all duration-300" onClick={() => toggleAgendaDone(item.id)}>
    <div className={`absolute -left-[33px] md:-left-[49px] top-2 w-4 h-4 rounded-full ring-4 ring-surface transition-colors duration-300 ${item.isDone ? 'bg-outline border-outline' : (item.isRestricted ? 'bg-primary border-primary' : 'bg-surface border border-primary')}`}></div>
    <div className={`flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2 ${item.isDone ? 'opacity-50 line-through' : ''}`}>
      <span className="font-headline-md text-headline-md text-primary w-24 flex-shrink-0">{item.time}</span>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">{item.title}</h3>
        {item.isRestricted && (
          <span className="inline-flex items-center px-3 py-1 bg-tertiary-container/20 border border-tertiary-container text-tertiary font-label-sm text-label-sm tracking-widest rounded-sm">
            <span className="material-symbols-outlined text-[14px] mr-1" data-icon="visibility_off">visibility_off</span>
            VIP/STAFF ONLY
          </span>
        )}
      </div>
    </div>
    <p className={`font-body-md text-body-md text-on-surface-variant md:ml-[120px] ${item.isDone ? 'opacity-50' : ''}`}>{item.description}</p>
    
    {item.image && (
      <div className={`md:ml-[120px] mt-6 overflow-hidden rounded-sm border border-outline-variant/30 relative h-64 w-full md:w-3/4 group ${item.isDone ? 'opacity-50 grayscale' : ''}`}>
        <img alt="Venue" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={item.image} />
      </div>
    )}
  </div>
))}
</div>
</section>

<section className="md:col-span-5 md:col-start-8 mt-24 md:mt-0">
<div className="sticky top-32">
<div className="bg-surface-container-lowest border-[0.5px] border-outline-variant/60 p-8 md:p-12 relative overflow-hidden">

<div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-primary opacity-50"></div>
<div className="flex items-center justify-between mb-10">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Backstage</h2>
<span className="material-symbols-outlined text-primary font-light text-3xl" data-icon="chat_bubble_outline">chat_bubble_outline</span>
</div>
<div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin">
{messages.map((msg, index) => (
  <div key={msg.id} className={`${index !== messages.length - 1 ? 'border-b border-outline-variant/30 pb-6' : 'pb-2'} ${msg.isImportant ? 'relative' : ''}`}>
    {msg.isImportant && <div className="absolute -left-4 top-1 w-1 h-full bg-tertiary"></div>}
    <div className="flex justify-between items-baseline mb-2">
      <span className={`font-label-sm text-label-sm text-${msg.senderColor} tracking-widest uppercase`}>{msg.sender}</span>
      <span className="font-label-sm text-label-sm text-on-surface-variant/60">{msg.time}</span>
    </div>
    <p className={`font-body-md text-body-md text-on-surface ${msg.isImportant ? 'font-medium' : 'italic'}`}>{msg.text}</p>
  </div>
))}
</div>

<div className="mt-12 pt-6 border-t border-outline-variant/50">
<div className="relative">
<label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest absolute -top-4 left-0 transition-all">Broadcast Update</label>
<input 
  className="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 px-0 py-2 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/30" 
  placeholder="Type message to staff..." 
  type="text"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
/>
</div>
<div className="mt-6 flex justify-end">
<button 
  onClick={handleSendMessage}
  className="font-label-sm text-label-sm uppercase tracking-widest text-primary border border-primary px-6 py-3 hover:bg-primary/5 transition-colors duration-300"
>
  SEND
</button>
</div>
</div>
</div>
</div>
</section>
</div>
</main>

<BottomNavBar />

    </>
  );
}
