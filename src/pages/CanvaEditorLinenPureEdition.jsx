import React, { useMemo, useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

const defaultInvitation = {
  invitationTitle: 'Vous êtes invités',
  invitationMessage: 'Nous serions honorés de vous compter parmi nous pour célébrer notre mariage.',
  invitationDetails: 'Cérémonie, dîner et soirée dans un lieu qui nous ressemble.',
  invitationDesignUrl: '',
  invitationBackText: 'Votre présence est notre plus beau cadeau.',
  invitationStyle: 'linen',
  rsvpConfirmedMessage: '',
  rsvpDeclinedMessage: ''
};

export default function CanvaEditorLinenPureEdition() {
  const activeWedding = useStore(state => state.activeWedding);
  const updateInvitationSettings = useStore(state => state.updateInvitationSettings);
  const showToast = useStore(state => state.showToast);
  const [form, setForm] = useState(() => ({ ...defaultInvitation, ...(activeWedding || {}) }));
  const [isOpen, setIsOpen] = useState(true);

  const coupleNames = useMemo(() => {
    if (form.brideName && form.groomName) return `${form.brideName} & ${form.groomName}`;
    return activeWedding?.name || 'Les mariés';
  }, [activeWedding?.name, form.brideName, form.groomName]);

  const previewDate = activeWedding?.date
    ? new Date(activeWedding.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date à venir';

  const update = (patch) => setForm(current => ({ ...current, ...patch }));

  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ invitationDesignUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const save = async () => {
    const payload = {
      invitationTitle: form.invitationTitle,
      invitationMessage: form.invitationMessage,
      invitationDetails: form.invitationDetails,
      invitationDesignUrl: form.invitationDesignUrl,
      invitationBackText: form.invitationBackText,
      invitationStyle: form.invitationStyle,
      rsvpConfirmedMessage: form.rsvpConfirmedMessage,
      rsvpDeclinedMessage: form.rsvpDeclinedMessage
    };
    await updateInvitationSettings(payload);
    showToast('Faire-part enregistré');
  };

  return (
    <>
      <TopAppBar title="Studio Faire-part" role="DESIGN" />
      <main className="min-h-screen bg-background px-4 md:px-10 pt-28 pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-8">
          <aside className="bg-surface border border-outline-variant rounded-xl p-5 h-fit space-y-5">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Configuration</p>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">Faire-part dématérialisé</h1>
            </div>

            <label className="block space-y-2">
              <span className="text-sm text-on-surface-variant">Titre d'ouverture</span>
              <input value={form.invitationTitle || ''} onChange={event => update({ invitationTitle: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-on-surface-variant">Message des mariés</span>
              <textarea rows="4" value={form.invitationMessage || ''} onChange={event => update({ invitationMessage: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-on-surface-variant">Détails visibles dans le faire-part</span>
              <textarea rows="3" value={form.invitationDetails || ''} onChange={event => update({ invitationDetails: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-on-surface-variant">Texte après RSVP</span>
              <textarea rows="2" value={form.invitationBackText || ''} onChange={event => update({ invitationBackText: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-on-surface-variant">Message si l'invité accepte</span>
              <textarea rows="2" value={form.rsvpConfirmedMessage || ''} onChange={event => update({ rsvpConfirmedMessage: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="Merci, votre présence est confirmée..." />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-on-surface-variant">Message si l'invité décline</span>
              <textarea rows="2" value={form.rsvpDeclinedMessage || ''} onChange={event => update({ rsvpDeclinedMessage: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="Merci pour votre réponse..." />
            </label>

            <div className="space-y-2">
              <span className="text-sm text-on-surface-variant">Design importé</span>
              <input value={form.invitationDesignUrl || ''} onChange={event => update({ invitationDesignUrl: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="URL image du design" />
              <label className="flex items-center justify-center gap-2 border border-dashed border-outline-variant rounded-md px-3 py-4 cursor-pointer hover:border-primary">
                <span className="material-symbols-outlined">upload</span>
                <span className="text-sm">Importer une image</span>
                <input type="file" accept="image/*" onChange={handleFileImport} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['linen', 'editorialist', 'boho', 'velvet'].map(style => (
                <button key={style} onClick={() => update({ invitationStyle: style })} className={`rounded-md border px-3 py-3 capitalize ${form.invitationStyle === style ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'}`}>
                  {style}
                </button>
              ))}
            </div>

            <button onClick={save} className="w-full bg-primary text-on-primary rounded-full px-6 py-3 uppercase tracking-widest text-sm">Enregistrer</button>
          </aside>

          <section className="bg-surface-container-low border border-outline-variant rounded-xl min-h-[720px] p-4 md:p-8 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Aperçu 3D invité</p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Ouverture du faire-part</h2>
              </div>
              <button onClick={() => setIsOpen(value => !value)} className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-5 py-3">
                <span className="material-symbols-outlined">{isOpen ? 'drafts' : 'mark_email_unread'}</span>
                {isOpen ? 'Refermer' : 'Ouvrir'}
              </button>
            </div>

            <div className="flex-1 grid place-items-center">
              <div className={`invitation-scene ${isOpen ? 'is-open' : ''}`}>
                <div className="invitation-envelope">
                  <div className="invitation-flap" />
                  <button type="button" onClick={() => setIsOpen(true)} className="invitation-cover">
                    <span>{form.invitationTitle}</span>
                    <strong>{coupleNames}</strong>
                    <small>{previewDate}</small>
                  </button>
                  <div className="invitation-paper">
                    {form.invitationDesignUrl ? (
                      <img src={form.invitationDesignUrl} alt="Design du faire-part" className="invitation-design" />
                    ) : (
                      <div className="invitation-generated">
                        <span className="material-symbols-outlined">local_florist</span>
                        <p>Ensemble avec leurs familles</p>
                        <h1>{coupleNames}</h1>
                        <p>{form.invitationMessage}</p>
                        <div>
                          <strong>{previewDate}</strong>
                          <small>{activeWedding?.venueAddress || form.invitationDetails}</small>
                        </div>
                      </div>
                    )}
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
