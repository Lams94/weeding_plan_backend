import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function ScannerEntree() {
  const guests = useStore(state => state.guests);
  const tables = useStore(state => state.tables);
  const updateGuestStatus = useStore(state => state.updateGuestStatus);
  const showToast = useStore(state => state.showToast);

  const [isScanning, setIsScanning] = useState(true);
  const [scannedGuest, setScannedGuest] = useState(null);

  // Simulation d'un scan QR Code réussi (Dans la vraie vie, on utilise jsQR ou react-qr-reader)
  const simulateScan = () => {
    // On prend un invité au hasard qui n'est pas encore confirmé
    const pendingGuests = guests.filter(g => g.status === 'Pending');
    if (pendingGuests.length === 0) {
      showToast("Tous les invités sont déjà arrivés !", "error");
      return;
    }
    const guest = pendingGuests[Math.floor(Math.random() * pendingGuests.length)];
    handleScanResult(guest.id);
  };

  const handleScanResult = (guestId) => {
    setIsScanning(false);
    const guest = guests.find(g => g.id === guestId);
    
    if (guest) {
      setScannedGuest(guest);
      // Mettre à jour le statut automatiquement
      if (guest.status !== 'Confirmed') {
        updateGuestStatus(guest.id, 'Confirmed');
        showToast(`${guest.name} est maintenant marqué Présent !`);
      }
    } else {
      showToast("Billet non reconnu", "error");
      setTimeout(() => setIsScanning(true), 2000);
    }
  };

  const getGuestTable = (tableId) => {
    return tables.find(t => t.id === tableId)?.name || "Non placé";
  };

  return (
    <>
      <TopAppBar title="Contrôle d'Accès (QR)" role="SECURITY" />
      
      <main className="min-h-screen bg-surface flex flex-col items-center pt-24 pb-32 px-4">
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display-md text-display-md text-on-surface">Scanner d'Entrée</h1>
            <p className="font-body-md text-secondary mt-2">Scannez le QR Code ou le Passeport Numérique pour valider l'entrée.</p>
          </div>

          {isScanning ? (
            <div className="bg-surface-container border border-outline-variant rounded-3xl p-4 shadow-inner relative overflow-hidden aspect-square flex items-center justify-center cursor-pointer group" onClick={simulateScan}>
              {/* Simulateur de caméra */}
              <div className="absolute inset-0 bg-black/5"></div>
              
              {/* Ligne de scan animée */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(var(--color-primary),1)] animate-[scan_2s_ease-in-out_infinite]"></div>
              
              {/* Cadre du viseur */}
              <div className="absolute inset-8 border-2 border-primary/30 rounded-xl pointer-events-none">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
              </div>

              <div className="z-10 flex flex-col items-center opacity-50 group-hover:opacity-100 transition-opacity text-on-surface">
                <span className="material-symbols-outlined text-4xl mb-2">qr_code_scanner</span>
                <span className="font-label-sm uppercase tracking-widest">Cliquez pour simuler un scan</span>
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-primary/20 rounded-3xl p-8 shadow-xl text-center animate-[scale-in_0.3s_ease-out]">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
              </div>
              
              <p className="font-label-sm text-primary uppercase tracking-widest mb-2">Accès Autorisé</p>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">{scannedGuest?.name}</h2>
              
              <div className="bg-surface-container-low rounded-xl p-4 text-left border border-outline-variant/30 mb-8 space-y-3">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                  <span className="text-secondary font-label-sm">Cercle</span>
                  <span className="text-on-surface font-body-md">{scannedGuest?.circle}</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                  <span className="text-secondary font-label-sm">Table Assignée</span>
                  <span className="text-on-surface font-body-md font-bold">{getGuestTable(scannedGuest?.tableId)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-label-sm">Régime Spécial</span>
                  <span className={`font-body-md ${scannedGuest?.diet ? 'text-error font-bold' : 'text-on-surface'}`}>
                    {scannedGuest?.diet ? 'Oui (Allergie/Régime)' : 'Non'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setScannedGuest(null);
                  setIsScanning(true);
                }}
                className="w-full bg-on-background text-surface py-4 rounded-full font-label-sm uppercase tracking-widest hover:bg-primary transition-colors flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                Scanner le suivant
              </button>
            </div>
          )}

          {isScanning && (
            <div className="mt-8 bg-surface-container-low rounded-xl p-4 flex items-center gap-4 border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary">info</span>
              <p className="text-sm text-secondary">La caméra s'active automatiquement. Placez le QR Code au centre du viseur. Le statut "Présent" sera synchronisé en direct avec le Dashboard du Planner.</p>
            </div>
          )}

        </div>
      </main>
      
      {/* Animation CSS custom pour le scan */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />

      <BottomNavBar />
    </>
  );
}
