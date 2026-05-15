import React, { useMemo, useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';
import { canSeeCoupleDirectMessages } from '../lib/accessControl';

const channels = [
  { id: 'backstage', label: 'Backstage', audience: 'planner', icon: 'forum' },
  { id: 'couple_direct', label: 'Mariés direct', audience: 'couple', icon: 'favorite' },
  { id: 'planner_vendor', label: 'Planner ↔ presta', audience: 'vendor', icon: 'handshake' },
  { id: 'day_logistics', label: 'Logistique Jour J', audience: 'logistics', icon: 'route' }
];

export default function MessagerieBackstageLinenPure() {
  const messages = useStore(state => state.messages);
  const addMessage = useStore(state => state.addMessage);
  const currentAccessRole = useStore(state => state.currentAccessRole);
  const activeWedding = useStore(state => state.activeWedding);
  const vendors = useStore(state => state.vendors);
  const [inputText, setInputText] = useState('');
  const [channel, setChannel] = useState('backstage');
  const [vendorId, setVendorId] = useState('');

  const availableChannels = channels.filter(item => item.id !== 'couple_direct' || canSeeCoupleDirectMessages(currentAccessRole, activeWedding || {}));
  const activeChannel = availableChannels.find(item => item.id === channel) || availableChannels[0];
  const visibleMessages = useMemo(() => messages.filter(message => {
    const messageChannel = message.channel || 'backstage';
    if (messageChannel !== activeChannel.id) return false;
    if (activeChannel.id === 'planner_vendor' && vendorId) return message.vendorId === vendorId;
    return true;
  }), [messages, activeChannel.id, vendorId]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage(inputText, {
      channel: activeChannel.id,
      audience: activeChannel.audience,
      vendorId: activeChannel.id === 'planner_vendor' ? vendorId || null : null,
      isPrivate: activeChannel.id === 'couple_direct'
    });
    setInputText('');
  };

  return (
    <>
      <TopAppBar title="Canaux Backstage" />
      <main className="flex w-full h-screen pt-[72px] pb-[80px]">
        <aside className="hidden md:flex w-80 flex-col border-r border-outline-variant/20 bg-surface-container-lowest flex-shrink-0">
          <div className="p-6 border-b border-outline-variant/10">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Flux</h2>
            <p className="text-sm text-secondary">Canaux séparés pour éviter de polluer les prestataires non concernés.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {availableChannels.map(item => (
              <button key={item.id} type="button" onClick={() => setChannel(item.id)} className={`w-full text-left px-4 py-4 rounded-xl transition-colors ${activeChannel.id === item.id ? 'bg-surface-container text-primary' : 'hover:bg-surface-container-low text-on-surface'}`}>
                <span className="material-symbols-outlined text-[20px] align-middle mr-3">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex-1 flex flex-col bg-surface relative">
          <div className="h-auto md:h-24 px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-outline-variant/10 bg-surface-container-lowest/80 backdrop-blur-md z-10 sticky top-0">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">{activeChannel.label}</h2>
              <p className="font-label-sm text-label-sm text-secondary mt-1 tracking-widest uppercase">{visibleMessages.length} message(s)</p>
            </div>
            {activeChannel.id === 'planner_vendor' && (
              <select value={vendorId} onChange={event => setVendorId(event.target.value)} className="border border-outline-variant bg-surface rounded-md px-3 py-2 text-sm">
                <option value="">Tous les prestataires</option>
                {vendors.map(vendor => <option key={vendor.id} value={vendor.id}>{vendor.name} - {vendor.role}</option>)}
              </select>
            )}
          </div>

          <div className="md:hidden flex gap-2 overflow-x-auto p-3 border-b border-outline-variant/10">
            {availableChannels.map(item => (
              <button key={item.id} type="button" onClick={() => setChannel(item.id)} className={`px-3 py-2 rounded-full text-xs uppercase tracking-widest whitespace-nowrap ${activeChannel.id === item.id ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col">
            {visibleMessages.map((msg) => {
              const isMe = msg.sender.includes('(You)');
              return (
                <div key={msg.id} className={`flex gap-4 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary-container font-label-sm text-label-sm">
                    {msg.sender.charAt(0)}
                  </div>
                  <div className={`space-y-2 ${isMe ? 'flex flex-col items-end' : ''}`}>
                    <div className={`flex items-baseline gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="font-body-md text-body-md font-medium text-on-surface">{msg.sender}</span>
                      <span className="font-label-sm text-label-sm text-tertiary">{msg.time}</span>
                    </div>
                    <div className={`${isMe ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface-container-lowest text-on-surface rounded-tl-none border border-outline-variant/10'} p-4 rounded-2xl shadow-sm`}>
                      <p className="font-body-md text-body-md">{msg.text.replace(/"/g, '')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {visibleMessages.length === 0 && <p className="text-center text-on-surface-variant mt-12">Aucun message dans ce canal.</p>}
          </div>

          <div className="p-4 md:p-6 bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/10">
            <div className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4">
              <div className="flex-1 bg-surface-container rounded-2xl p-2 flex items-end">
                <textarea className="w-full bg-transparent border-none resize-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder:text-secondary py-2 px-3 max-h-32 outline-none" placeholder={`Message ${activeChannel.label}`} rows="1" style={{ minHeight: '44px' }} value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }} />
              </div>
              <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm" onClick={handleSend}>
                <span className="material-symbols-outlined ml-1">send</span>
              </button>
            </div>
          </div>
        </section>
      </main>
      <BottomNavBar />
    </>
  );
}
