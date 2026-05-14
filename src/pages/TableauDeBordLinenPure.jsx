import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function TableauDeBordLinenPure() {
  const { agendaItems, messages, addMessage } = useStore();
  const [chatInput, setChatInput] = useState('');
  const [activeTeam, setActiveTeam] = useState('All Teams');

  const handleSend = () => {
    if (chatInput.trim()) {
      addMessage(chatInput);
      setChatInput('');
    }
  };

  // Map team filter to sender name for filtering
  const teamMap = {
    'Florist Team': 'Florist Team',
    'DJ & Sound': 'DJ / Sound',
    'Catering': 'Catering Mgt',
  };

  const visibleMessages = activeTeam === 'All Teams'
    ? messages
    : messages.filter(m => m.sender === teamMap[activeTeam] || m.sender.includes('You'));

  return (
    <>
      <TopAppBar title="Tableau de Bord Central" role="PLANNER" />

<div className="flex-1 flex flex-col min-h-screen pt-[72px] pb-[80px]">

<main className="flex-1 px-margin-mobile md:px-section-padding py-8 md:py-12 max-w-container-max mx-auto w-full">
<div className="mb-10">
<h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">Tableau de Bord Central</h2>
<p className="font-body-lg text-body-lg text-secondary">Coordination &amp; Flux Logistique</p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

{/* === AGENDA SECTION === */}
<section className="lg:col-span-5 flex flex-col gap-4">
  <div className="flex items-baseline justify-between mb-2">
    <h3 className="font-headline-md text-headline-md text-primary">Bride's Agenda</h3>
    <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Aujourd'hui</span>
  </div>

  {agendaItems.map((item, idx) => (
    <div
      key={item.id}
      className={`rounded-xl p-6 flex items-start gap-6 border border-outline-variant/10 transition-all ${
        item.isDone
          ? 'bg-surface-container opacity-60'
          : idx === agendaItems.findIndex(i => !i.isDone)
          ? 'bg-surface-container shadow-sm'
          : 'bg-surface-container-low opacity-80'
      }`}
    >
      <div className="flex flex-col items-center min-w-[60px]">
        <span className="font-headline-md text-headline-md text-on-surface">{item.time}</span>
        {idx < agendaItems.length - 1 && <span className="w-px h-10 bg-outline-variant/30 my-2"></span>}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-body-lg text-body-lg font-medium text-on-surface mb-1">{item.title}</h4>
          {item.isDone && <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>}
          {item.isRestricted && !item.isDone && (
            <span className="material-symbols-outlined text-tertiary text-[18px]">lock</span>
          )}
        </div>
        <p className="font-body-md text-body-md text-secondary">{item.description}</p>
      </div>
    </div>
  ))}
</section>

{/* === BACKSTAGE CHAT === */}
<section className="lg:col-span-7 flex flex-col gap-4">
  <div className="flex items-baseline justify-between mb-2">
    <h3 className="font-headline-md text-headline-md text-primary">Backstage Flux</h3>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
      <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">En Direct</span>
    </div>
  </div>
  <div className="bg-surface-container rounded-xl p-2 border border-outline-variant/10 flex flex-col" style={{ height: '580px' }}>

    {/* Team Filter Tabs */}
    <div className="p-4 border-b border-outline-variant/10 flex gap-3 overflow-x-auto">
      {['All Teams', 'Florist Team', 'DJ & Sound', 'Catering'].map(team => (
        <button
          key={team}
          onClick={() => setActiveTeam(team)}
          className={`px-4 py-2 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-colors ${
            activeTeam === team
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-surface text-secondary border border-outline-variant/20 hover:border-primary hover:text-primary'
          }`}
        >
          {team}
        </button>
      ))}
    </div>

    {/* Messages */}
    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-6">
      {visibleMessages.map(msg => {
        const isMe = msg.sender.includes('You') || msg.sender.includes('Coordinator');
        const iconMap = { 'Florist Team': 'local_florist', 'DJ / Sound': 'speaker', 'Catering Mgt': 'restaurant' };
        const icon = iconMap[msg.sender] || 'person';

        if (isMe) {
          return (
            <div key={msg.id} className="flex gap-3 flex-row-reverse">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <div className="max-w-[75%]">
                <div className="flex items-baseline gap-2 mb-1 flex-row-reverse">
                  <span className="font-body-md text-body-md font-medium text-on-surface">Vous</span>
                  <span className="font-label-sm text-label-sm text-outline">{msg.time}</span>
                </div>
                <div className="bg-primary-container/20 p-4 rounded-2xl rounded-tr-none border border-primary-container/30">
                  <p className="font-body-md text-body-md text-on-surface">{msg.text.replace(/"/g, '')}</p>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-tertiary text-[18px]">{icon}</span>
            </div>
            <div className="max-w-[75%]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-body-md text-body-md font-medium text-on-surface">{msg.sender}</span>
                <span className="font-label-sm text-label-sm text-outline">{msg.time}</span>
                {msg.isImportant && (
                  <span className="text-[10px] px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full uppercase tracking-widest">URGENT</span>
                )}
              </div>
              <div className={`bg-surface p-4 rounded-2xl rounded-tl-none border ${msg.isImportant ? 'border-tertiary/30' : 'border-outline-variant/10'}`}>
                <p className="font-body-md text-body-md text-on-surface-variant">{msg.text.replace(/"/g, '')}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Input */}
    <div className="p-4 border-t border-outline-variant/10 bg-surface rounded-b-xl">
      <div className="flex items-center gap-3 bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/20 focus-within:border-primary transition-colors">
        <span className="material-symbols-outlined text-outline">add_circle</span>
        <input
          className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder:text-outline py-1"
          placeholder="Envoyer une instruction backstage..."
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>
  </div>
</section>

</div>
</main>
</div>

<BottomNavBar />
    </>
  );
}
