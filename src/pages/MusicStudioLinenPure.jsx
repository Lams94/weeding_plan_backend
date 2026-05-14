import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function MusicStudioLinenPure() {
  const tracks = useStore(state => state.tracks);
  const addTrack = useStore(state => state.addTrack);
  const deleteTrack = useStore(state => state.deleteTrack) || (() => {}); // On créera cette action plus tard si besoin
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newDirectives, setNewDirectives] = useState('');

  const handleAddTrack = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) return;
    
    addTrack({
      title: newTitle,
      artist: newArtist,
      directives: newDirectives || null,
      orderIndex: tracks.length // Ajouter à la fin
    });
    
    setNewTitle('');
    setNewArtist('');
    setNewDirectives('');
    useStore.getState().showToast("Morceau ajouté à la Tracklist");
  };

  return (
    <>
      <TopAppBar title="Music Studio" role="COUPLE" />
      <main className="px-container-padding-mobile md:px-container-padding-desktop pt-12 pb-24 max-w-[1200px] mx-auto">
        <div className="mb-12">
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Pre-Wedding / Expérience</p>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">Music Studio</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl">
            Construisez la bande sonore de votre mariage. Ajoutez les morceaux incontournables et laissez des directives spécifiques à votre DJ (ex: "Couper à 1:20 pour la première danse"). La tracklist se synchronise en temps réel avec le Cockpit DJ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Add Track Form */}
          <div className="lg:col-span-5 bg-surface border border-outline-variant p-8 rounded-xl shadow-sm h-fit">
            <h3 className="font-headline-md text-headline-md text-on-background mb-6">Ajouter un morceau</h3>
            
            <form onSubmit={handleAddTrack} className="space-y-5">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Titre du morceau *</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:border-primary font-body-md"
                  placeholder="Ex: L'Amour Toujours"
                  required
                />
              </div>
              
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Artiste *</label>
                <input 
                  type="text"
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:border-primary font-body-md"
                  placeholder="Ex: Gigi D'Agostino"
                  required
                />
              </div>
              
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Directives DJ (Optionnel)</label>
                <textarea 
                  value={newDirectives}
                  onChange={(e) => setNewDirectives(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:border-primary font-body-md h-24 resize-none"
                  placeholder="Ex: Utiliser la version String Quartet pour l'entrée en salle."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-on-background text-surface py-4 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary transition-colors mt-4 flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Ajouter à la Tracklist
              </button>
            </form>
          </div>

          {/* Current Playlist */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-end mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Votre Tracklist ({tracks.length})</h3>
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined animate-pulse text-sm">sync</span>
                <span className="font-label-sm text-label-sm">Synchro DJ Active</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {tracks.length === 0 ? (
                <div className="bg-surface-container border border-outline-variant/30 border-dashed rounded-xl p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline mb-4">queue_music</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Votre tracklist est vide.<br/>Commencez par ajouter vos morceaux favoris.</p>
                </div>
              ) : (
                tracks.map((track, idx) => (
                  <div key={track.id} className="bg-surface border border-outline-variant p-4 rounded-xl flex gap-4 hover:border-primary transition-colors group">
                    <div className="w-12 h-12 bg-surface-container-high rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">music_note</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-body-md text-body-md font-bold text-on-background truncate">{track.title}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">{track.artist}</p>
                        </div>
                        <span className="text-xs font-mono text-outline">#{idx + 1}</span>
                      </div>
                      
                      {track.directives && (
                        <div className="mt-3 bg-primary/5 border border-primary/20 rounded p-2 inline-flex items-start gap-2 max-w-full">
                          <span className="material-symbols-outlined text-primary text-[14px] mt-[2px] flex-shrink-0">info</span>
                          <p className="text-sm text-on-surface-variant italic truncate">{track.directives}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
