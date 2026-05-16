import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const DEFAULT_API_BASE_URL = 'https://weedingplanbackend-production.up.railway.app';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

function InvitationCard({ invitation, opened, onOpen }) {
  const wedding = invitation?.wedding || {};
  const guest = invitation?.guest || {};
  const coupleNames = wedding.brideName && wedding.groomName
    ? `${wedding.brideName} & ${wedding.groomName}`
    : wedding.name || 'Les mariés';
  const invitationDate = wedding.date
    ? new Date(wedding.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date à venir';

  return (
    <div className={`invitation-scene ${opened ? 'is-open' : ''}`}>
      <div className="invitation-envelope">
        <div className="invitation-flap" />
        <button type="button" onClick={onOpen} className="invitation-cover" aria-label="Voir le faire-part">
          <span>{wedding.invitationTitle || 'Vous êtes invités'}</span>
          <strong>{coupleNames}</strong>
          <small>Pour {guest.name}</small>
        </button>
        <div className="invitation-paper">
          {wedding.invitationDesignUrl ? (
            <img src={wedding.invitationDesignUrl} alt="Design du faire-part" className="invitation-design" />
          ) : (
            <div className="invitation-generated">
              <span className="material-symbols-outlined">local_florist</span>
              <p>Ensemble avec leurs familles</p>
              <h1>{coupleNames}</h1>
              <p>{wedding.invitationMessage || 'ont la joie de vous inviter à célébrer leur mariage.'}</p>
              <div>
                <strong>{invitationDate}</strong>
                <small>{wedding.venueAddress || 'Lieu à confirmer'}</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvitationExperience() {
  const { weddingId, guestId } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [opened, setOpened] = useState(false);
  const [rsvpVisible, setRsvpVisible] = useState(false);
  const [responsePanelVisible, setResponsePanelVisible] = useState(false);
  const [status, setStatus] = useState('loading');
  const [saving, setSaving] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE_URL}/api/public/invitations/${weddingId}/${guestId}`)
      .then(res => {
        if (!res.ok) throw new Error('Invitation introuvable');
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        setInvitation(data);
        setStatus('ready');
      })
      .catch(() => {
        if (mounted) setStatus('error');
      });
    return () => { mounted = false; };
  }, [weddingId, guestId]);

  useEffect(() => {
    if (!opened) {
      setRsvpVisible(false);
      return undefined;
    }

    const timer = window.setTimeout(() => setRsvpVisible(true), 3500);
    return () => window.clearTimeout(timer);
  }, [opened]);

  const guestStatus = invitation?.guest?.status || 'Pending';
  const headline = useMemo(() => {
    if (!invitation) return '';
    const names = invitation.wedding.brideName && invitation.wedding.groomName
      ? `${invitation.wedding.brideName} et ${invitation.wedding.groomName}`
      : invitation.wedding.name || 'Les mariés';
    return `${names} vous ont invité`;
  }, [invitation]);

  const submitRsvp = async (nextStatus) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/invitations/${weddingId}/${guestId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error('RSVP failed');
      const data = await res.json();
      setInvitation(current => ({ ...current, guest: data.guest }));
      setLastResponse(nextStatus);
      setResponsePanelVisible(false);
      window.setTimeout(() => setResponsePanelVisible(true), 120);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return <main className="min-h-screen grid place-items-center bg-background text-on-surface">Chargement du faire-part...</main>;
  }

  if (status === 'error') {
    return <main className="min-h-screen grid place-items-center bg-background text-on-surface">Ce faire-part n'est pas disponible.</main>;
  }

  const wedding = invitation.wedding;
  const visibleAgenda = wedding.agenda || [];
  const acceptedMessage = wedding.rsvpConfirmedMessage || 'Merci, votre présence est confirmée. Nous sommes très heureux de partager cette journée avec vous.';
  const declinedMessage = wedding.rsvpDeclinedMessage || 'Merci pour votre réponse. Vous serez avec nous par la pensée, et nous vous embrassons fort.';
  const responseStatus = lastResponse || guestStatus;

  return (
    <main className={`min-h-screen bg-background text-on-surface px-4 py-8 md:py-12 invitation-public theme-${wedding.invitationStyle || 'linen'}`}>
      <section className="invitation-layout max-w-6xl mx-auto">
        <header className="invitation-intro">
          <p className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary">Faire-part privé</p>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">{headline}</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {wedding.invitationMessage || 'Voici le faire-part préparé pour vous. Ouvrez-le pour découvrir l’invitation et confirmer votre présence.'}
          </p>
          {!opened && (
            <button onClick={() => setOpened(true)} className="inline-flex items-center gap-3 rounded-full bg-primary text-on-primary px-7 py-4 uppercase tracking-widest text-sm">
              <span className="material-symbols-outlined">drafts</span>
              Ouvrir le faire-part
            </button>
          )}
          {opened && !rsvpVisible && (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Prenez un instant pour découvrir le faire-part...</p>
          )}
        </header>

        <InvitationCard invitation={invitation} opened={opened} onOpen={() => setOpened(true)} />

        {opened && !lastResponse && (
          <section className={`invitation-rsvp-panel ${rsvpVisible ? 'is-visible' : ''}`} aria-hidden={!rsvpVisible}>
            <div>
              <p className="text-sm uppercase tracking-widest text-secondary">Réponse de {invitation.guest.name}</p>
              <p className="font-headline-md text-headline-md text-on-surface">
                {guestStatus === 'Confirmed' ? 'Présence confirmée' : guestStatus === 'Declined' ? 'Invitation déclinée' : 'En attente de réponse'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button disabled={saving || !rsvpVisible} onClick={() => submitRsvp('Confirmed')} className={`rounded-full px-5 py-3 uppercase tracking-widest text-sm ${guestStatus === 'Confirmed' ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant'}`}>
                J'accepte
              </button>
              <button disabled={saving || !rsvpVisible} onClick={() => submitRsvp('Declined')} className={`rounded-full px-5 py-3 uppercase tracking-widest text-sm ${guestStatus === 'Declined' ? 'bg-error-container text-on-error-container border border-error' : 'bg-surface-container border border-outline-variant'}`}>
                Je décline
              </button>
            </div>
            {wedding.invitationBackText && <p className="text-sm text-on-surface-variant italic">{wedding.invitationBackText}</p>}
          </section>
        )}

        {lastResponse && (
          <section className={`invitation-response-panel ${responsePanelVisible ? 'is-visible' : ''}`}>
            <div className="invitation-response-icon">
              <span className="material-symbols-outlined">{responseStatus === 'Confirmed' ? 'favorite' : 'mail'}</span>
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              {responseStatus === 'Confirmed' ? 'Réponse confirmée' : 'Réponse enregistrée'}
            </p>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              {responseStatus === 'Confirmed' ? 'Merci pour votre confirmation' : 'Merci pour votre réponse'}
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {responseStatus === 'Confirmed' ? acceptedMessage : declinedMessage}
            </p>

            {responseStatus === 'Confirmed' && visibleAgenda.length > 0 && (
              <div className="invitation-guest-space">
                <div>
                  <p className="text-xs uppercase tracking-widest text-secondary">Votre espace invité</p>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Programme de la journée</h3>
                </div>
                <div className="space-y-3">
                  {visibleAgenda.slice(0, 6).map(item => (
                    <article key={item.id} className="grid grid-cols-[70px_1fr] gap-4 border-t border-outline-variant/50 pt-3">
                      <span className="text-primary font-semibold">{item.time}</span>
                      <div>
                        <p className="font-semibold text-on-surface">{item.title}</p>
                        <p className="text-sm text-on-surface-variant">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {responseStatus === 'Confirmed' && visibleAgenda.length === 0 && (
              <p className="text-sm text-on-surface-variant italic">Votre espace invité sera ouvert ici dès que le programme sera validé.</p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
