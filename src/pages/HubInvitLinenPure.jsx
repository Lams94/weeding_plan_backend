import React from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

export default function HubInvitLinenPure() {
  const agendaItems = useStore(state => state.agendaItems);
  const publicAgenda = agendaItems.filter(item => !item.isRestricted);

  return (
    <>
      <TopAppBar title="Votre Programme" role="GUEST" />

<main className="max-w-md mx-auto px-margin-mobile pt-24 pb-40 flex flex-col gap-10">

<section className="text-center">
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Le Programme du Week-end</h1>
<p className="font-body-md text-body-md text-secondary">Une célébration de l'amour et de l'amitié</p>
</section>

{/* RSVP Section (Test for Global State) */}
<section className="bg-surface border border-primary/20 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-4 shadow-sm">
  <h2 className="font-headline-md text-headline-md text-primary">Serez-vous parmi nous ?</h2>
  <p className="font-label-sm text-label-sm text-on-surface-variant">Théodore Montague (Invitation VIP)</p>
  <div className="flex gap-4 w-full mt-2">
    <button 
      onClick={() => useStore.getState().updateGuestStatus(2, 'Confirmed')}
      className="flex-1 bg-primary text-on-primary py-3 rounded-full font-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
    >
      J'accepte
    </button>
    <button 
      onClick={() => useStore.getState().updateGuestStatus(2, 'Declined')}
      className="flex-1 bg-surface-container text-on-surface py-3 rounded-full font-label-sm uppercase tracking-widest border border-outline-variant hover:bg-surface-container-high transition-colors"
    >
      Je décline
    </button>
  </div>
</section>

<section className="bg-surface-container-low rounded-[1.5rem] p-8 flex flex-col gap-8 relative overflow-hidden">

<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-container-high/50 to-transparent pointer-events-none"></div>

{publicAgenda.map((item, index) => (
  <div key={item.id} className="relative z-10 flex gap-6">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>favorite</span>
      </div>
      {index !== publicAgenda.length - 1 && (
        <div className="w-px h-full bg-outline-variant/30 my-2"></div>
      )}
    </div>
    <div className={`pt-2 ${index !== publicAgenda.length - 1 ? 'pb-6' : ''}`}>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{item.title}</h3>
      <p className="font-body-md text-body-md text-secondary">{item.time} - {item.description}</p>
    </div>
  </div>
))}
</section>

<div className="grid grid-cols-1 gap-6">

<section className="bg-surface-container rounded-[1.5rem] p-8 flex flex-col justify-between min-h-[200px] group cursor-pointer hover:bg-surface-container-high transition-colors duration-300">
<div>
<div className="flex items-center justify-between mb-4">
<h2 className="font-headline-md text-headline-md text-on-surface">La Carte</h2>
<span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">arrow_outward</span>
</div>
<p className="font-body-md text-body-md text-secondary mb-6">Découvrez le menu gastronomique de notre chef.</p>
</div>
<div className="w-full h-32 rounded-lg bg-surface-variant overflow-hidden">
<img alt="Menu preview" className="w-full h-full object-cover opacity-80 mix-blend-multiply" data-alt="A top-down, minimalist close-up of an elegant dining table setting. A pristine, off-white linen napkin is beautifully folded beside high-end matte silverware and a delicate, sparkling crystal wine glass. The scene is bathed in soft, diffused natural daylight that casts gentle, organic shadows across the textured table surface. The overarching aesthetic is serene, premium, and zen, utilizing a restrained palette of creams, warm grays, and subtle earthy taupes." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRT7Nk2ud16uE9ahSS6S38pOSxCpd4d7Lldoj7qbYiKkQOLBdLI9q6aAjHS-F2DylGBJXPdOv9pIs5BX9AvexuARvfqe9ZnlesaYliKk4RtQtL9cCAcEHckmjyb7zUogQk4r7DQDZOjyvRgCJDwAJ7LY6qGUvbPaDDkI9F2eu7Qd4OweWdT43gVdRTkFmkZ89xTtpmSnWP4hzsOhSPRe9IoM_8U1d0rdclWCFDNb0WkKNGYVO54Lvq0GgCQm6ASGI9T2wSAscNzwzW"/>
</div>
</section>

<section className="bg-surface-container-lowest rounded-[1.5rem] border border-outline-variant/20 overflow-hidden group cursor-pointer">
<div className="h-40 bg-surface-variant w-full relative">
<img alt="Location Map" className="w-full h-full object-cover opacity-60" data-alt="An abstract, stylized aerial view resembling a minimalist cartographic map. Soft, flowing lines and muted, earthy tones suggest winding roads and organic landscapes. The image feels serene and textured, akin to a high-quality linen print or a watercolor painting in light beige and subtle olive hues. It evokes a sense of journey and calm destination, perfectly matching a premium, light-mode organic aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT2ciRY8pSjQJNN2h303TmQNLrutFMfQ7szwFcCsYqjNl0nj_GRTiAEaNA0ZwDANX3D5gKCzZXDAxQSnYfgR1tYV0Fx4blmdKSG5GGjoEB8XoN5kzJh95MiP9UNSCcEh3w0w2GBmfDU2XuAcPBnBWg0BxT8hA3LtKln0wV46ETnn2RCYamKEJOQKo0GNUFfV-XGJ8jD2pa4aiOxpmuzD_R937KIDRSFIqexwNK7QDhzC3boEF2QOrNyfjHTHbhiqaHPqAJEOxFzEfj"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-surface/90 backdrop-blur-sm p-3 rounded-full shadow-sm text-primary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>location_on</span>
</div>
</div>
</div>
<div className="p-6">
<div className="flex items-center justify-between mb-2">
<h2 className="font-headline-md text-headline-md text-on-surface">Cortège</h2>
<span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">directions_car</span>
</div>
<p className="font-body-md text-body-md text-secondary">Itinéraires et stationnement pour rejoindre le domaine.</p>
</div>
</section>
</div>

<section className="pt-4">
<button className="w-full bg-primary-container text-on-primary-container font-body-lg text-body-lg py-5 rounded-full flex items-center justify-center gap-3 hover:bg-inverse-primary transition-colors duration-300">
<span className="material-symbols-outlined">photo_camera</span>
<span>Capturer l'Instant</span>
</button>
<p className="text-center font-label-sm text-label-sm text-secondary mt-4">Partagez vos photos avec les mariés</p>
</section>
</main>
<BottomNavBar />
    </>
  );
}
