import React, { useMemo, useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

const documentTypes = [
  ['demande_devis', 'Demande de devis'],
  ['devis_propose', 'Devis proposé'],
  ['preuve_acompte', 'Preuve acompte'],
  ['facture_acompte', 'Facture acompte'],
  ['facture_finale', 'Facture finale'],
  ['rib_prestataire', 'RIB prestataire'],
  ['contrat', 'Contrat'],
  ['autre', 'Autre document']
];

const tabs = [
  ['payments', 'Paiements'],
  ['documents', 'Documents'],
  ['requests', 'Demandes de devis'],
  ['declined', 'Devis déclinés']
];

const typeLabel = (type) => documentTypes.find(([value]) => value === type)?.[1] || type;

export default function BudgetSuivi() {
  const activeWedding = useStore(state => state.activeWedding);
  const vendors = useStore(state => state.vendors);
  const budgetDocuments = useStore(state => state.budgetDocuments);
  const updateWedding = useStore(state => state.updateWedding);
  const addVendorPayment = useStore(state => state.addVendorPayment);
  const deleteVendorPayment = useStore(state => state.deleteVendorPayment);
  const updateVendorFinancials = useStore(state => state.updateVendorFinancials);
  const addBudgetDocument = useStore(state => state.addBudgetDocument);
  const updateBudgetDocument = useStore(state => state.updateBudgetDocument);
  const deleteBudgetDocument = useStore(state => state.deleteBudgetDocument);

  const [activeTab, setActiveTab] = useState('payments');
  const [baseBudget, setBaseBudget] = useState(activeWedding?.baseBudget || 0);
  const [paymentForms, setPaymentForms] = useState({});
  const [documentModalVendor, setDocumentModalVendor] = useState(null);
  const [documentForm, setDocumentForm] = useState({
    title: '',
    vendorId: '',
    type: 'devis_propose',
    status: 'active',
    amount: '',
    documentUrl: '',
    fileName: '',
    notes: '',
    declinedReason: ''
  });

  const committed = vendors.reduce((sum, vendor) => sum + (Number(vendor.budget) || 0), 0);
  const paid = vendors.reduce((sum, vendor) => sum + (Number(vendor.paid) || 0), 0);
  const base = Number(baseBudget) || 0;
  const remaining = base - committed;
  const paidRate = committed > 0 ? Math.min(100, Math.round((paid / committed) * 100)) : 0;

  const documentsByTab = useMemo(() => ({
    documents: budgetDocuments.filter(document => !['demande_devis'].includes(document.type) && document.status !== 'declined'),
    requests: budgetDocuments.filter(document => document.type === 'demande_devis' && document.status !== 'declined'),
    declined: budgetDocuments.filter(document => document.status === 'declined')
  }), [budgetDocuments]);

  const updatePaymentForm = (vendorId, patch) => {
    setPaymentForms(prev => ({
      ...prev,
      [vendorId]: { label: 'Acompte', amount: '', kind: 'acompte', ...prev[vendorId], ...patch }
    }));
  };

  const submitPayment = async (event, vendorId) => {
    event.preventDefault();
    const form = paymentForms[vendorId] || {};
    if (!Number(form.amount)) return;
    await addVendorPayment(vendorId, {
      label: form.label || 'Paiement',
      amount: Number(form.amount),
      kind: form.kind || 'acompte',
      status: 'paid'
    });
    setPaymentForms(prev => ({ ...prev, [vendorId]: { label: 'Acompte', amount: '', kind: 'acompte' } }));
  };

  const submitDocument = async (event) => {
    event.preventDefault();
    if (!documentForm.title.trim()) return;
    await addBudgetDocument({
      ...documentForm,
      amount: documentForm.amount === '' ? null : Number(documentForm.amount),
      vendorId: documentForm.vendorId || null
    });
    setDocumentForm({
      title: '',
      vendorId: '',
      type: activeTab === 'requests' ? 'demande_devis' : 'devis_propose',
      status: activeTab === 'declined' ? 'declined' : 'active',
      amount: '',
      documentUrl: '',
      fileName: '',
      notes: '',
      declinedReason: ''
    });
    setDocumentModalVendor(null);
  };

  const renderDocumentList = (items) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-on-surface-variant italic">Aucun élément dans cet onglet.</p>
      ) : items.map(document => (
        <article key={document.id} className="border border-outline-variant rounded-lg p-4 bg-surface">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-semibold text-on-surface">{document.title}</h3>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest">{typeLabel(document.type)}</span>
                {document.status === 'declined' && <span className="px-2 py-1 rounded-full bg-error/10 text-error text-[10px] uppercase tracking-widest">décliné</span>}
              </div>
              <p className="text-sm text-secondary">{document.vendor?.name || vendors.find(v => v.id === document.vendorId)?.name || 'Sans prestataire'}</p>
              {document.amount != null && <p className="text-sm text-on-surface mt-1">Montant: <strong>{euro.format(document.amount)}</strong></p>}
              {document.fileName && <p className="text-sm text-on-surface-variant mt-1">Fichier: {document.fileName}</p>}
              {document.notes && <p className="text-sm text-on-surface-variant mt-2 whitespace-pre-wrap">{document.notes}</p>}
              {document.declinedReason && <p className="text-sm text-error mt-2">Motif: {document.declinedReason}</p>}
              {document.documentUrl && <a href={document.documentUrl} target="_blank" rel="noreferrer" className="inline-flex text-primary text-sm mt-2 hover:underline">Ouvrir le document</a>}
            </div>
            <div className="flex gap-2">
              {document.status !== 'declined' && (
                <button onClick={() => {
                  const reason = window.prompt('Motif du devis décliné :', document.declinedReason || '');
                  if (reason !== null) updateBudgetDocument(document.id, { status: 'declined', declinedReason: reason });
                }} className="border border-outline-variant rounded-md px-3 py-2 text-sm text-on-surface-variant hover:text-error">
                  Décliner
                </button>
              )}
              <button onClick={() => deleteBudgetDocument(document.id)} className="text-error hover:opacity-70">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <>
      <TopAppBar title="Budget & Documents" role="FINANCE" />
      <main className="pt-28 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Suivi financier</p>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Budget, acomptes, factures et devis</h1>
          </div>
          <form onSubmit={(event) => {
            event.preventDefault();
            updateWedding({ baseBudget: base });
          }} className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
            <label>
              <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Budget souhaité</span>
              <input type="number" min="0" value={baseBudget} onChange={event => setBaseBudget(event.target.value)} className="border border-outline-variant rounded-md bg-surface px-4 py-2 w-full sm:w-48" />
            </label>
            <button className="bg-primary text-on-primary rounded-md px-5 py-2 font-label-sm uppercase tracking-widest">Enregistrer</button>
          </form>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <p className="text-secondary text-sm">Budget de base</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{euro.format(base)}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <p className="text-secondary text-sm">Engagé prestataires</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">{euro.format(committed)}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <p className="text-secondary text-sm">Payé</p>
            <p className="font-headline-lg text-headline-lg text-primary">{euro.format(paid)}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
            <p className="text-secondary text-sm">Reste budget</p>
            <p className={`font-headline-lg text-headline-lg ${remaining < 0 ? 'text-error' : 'text-on-surface'}`}>{euro.format(remaining)}</p>
          </div>
        </section>

        <div className="bg-surface border border-outline-variant rounded-xl p-5 mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary">Paiements réalisés sur les devis prestataires</span>
            <span className="font-semibold text-primary">{paidRate}%</span>
          </div>
          <div className="h-3 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${paidRate}%` }} />
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto mb-6">
          {tabs.map(([value, label]) => (
            <button key={value} onClick={() => setActiveTab(value)} className={`px-4 py-3 rounded-full border text-sm uppercase tracking-widest whitespace-nowrap ${activeTab === value ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
              {label}
            </button>
          ))}
        </nav>

        {activeTab !== 'payments' && (
          <section className="bg-surface border border-outline-variant rounded-xl p-5 mb-8">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
              {activeTab === 'requests' ? 'Ajouter une demande de devis' : activeTab === 'declined' ? 'Archiver un devis décliné' : 'Ajouter un document financier'}
            </h2>
            <form onSubmit={submitDocument} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={documentForm.title} onChange={event => setDocumentForm({ ...documentForm, title: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface" placeholder="Titre du document" />
              <select value={documentForm.vendorId} onChange={event => setDocumentForm({ ...documentForm, vendorId: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface">
                <option value="">Prestataire non défini</option>
                {vendors.map(vendor => <option key={vendor.id} value={vendor.id}>{vendor.name} - {vendor.role}</option>)}
              </select>
              <select value={documentForm.type} onChange={event => setDocumentForm({ ...documentForm, type: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface">
                {documentTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <input type="number" min="0" step="0.01" value={documentForm.amount} onChange={event => setDocumentForm({ ...documentForm, amount: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface" placeholder="Montant éventuel" />
              <input value={documentForm.fileName} onChange={event => setDocumentForm({ ...documentForm, fileName: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface" placeholder="Nom du fichier" />
              <input value={documentForm.documentUrl} onChange={event => setDocumentForm({ ...documentForm, documentUrl: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface" placeholder="Lien document / drive" />
              <textarea rows="3" value={documentForm.notes} onChange={event => setDocumentForm({ ...documentForm, notes: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface md:col-span-2" placeholder="Notes, éléments demandés, conditions..." />
              <textarea rows="3" value={documentForm.declinedReason} onChange={event => setDocumentForm({ ...documentForm, declinedReason: event.target.value, status: event.target.value ? 'declined' : documentForm.status })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface" placeholder="Motif si devis décliné" />
              <button className="bg-primary text-on-primary rounded-md px-5 py-3 font-label-sm uppercase tracking-widest md:col-span-3">Ajouter au dossier budget</button>
            </form>
          </section>
        )}

        {activeTab === 'payments' && (
          <section className="space-y-5">
            {vendors.map(vendor => {
              const vendorPaidRate = vendor.budget > 0 ? Math.min(100, Math.round((vendor.paid / vendor.budget) * 100)) : 0;
              const form = paymentForms[vendor.id] || { label: 'Acompte', amount: '', kind: 'acompte' };
              const vendorDocuments = budgetDocuments.filter(document => document.vendorId === vendor.id);
              return (
                <article key={vendor.id} className="bg-surface border border-outline-variant rounded-xl p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="font-headline-md text-headline-md text-on-surface">{vendor.name}</p>
                      <p className="text-secondary">{vendor.role}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <span>Devis: <strong>{euro.format(vendor.budget || 0)}</strong></span>
                        <span>Payé: <strong>{euro.format(vendor.paid || 0)}</strong></span>
                        <span>Reste: <strong>{euro.format((vendor.budget || 0) - (vendor.paid || 0))}</strong></span>
                      </div>
                    </div>

                    <div className="w-full lg:w-[460px]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${vendorPaidRate}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-primary w-12 text-right">{vendorPaidRate}%</span>
                      </div>

                      <form onSubmit={(event) => submitPayment(event, vendor.id)} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input value={form.label} onChange={event => updatePaymentForm(vendor.id, { label: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface sm:col-span-1" placeholder="Libellé" />
                        <select value={form.kind} onChange={event => updatePaymentForm(vendor.id, { kind: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface">
                          <option value="acompte">Acompte</option>
                          <option value="facture">Facture</option>
                          <option value="solde">Solde</option>
                        </select>
                        <input type="number" min="0" step="0.01" value={form.amount} onChange={event => updatePaymentForm(vendor.id, { amount: event.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface" placeholder="Montant" />
                        <button className="bg-primary text-on-primary rounded-md px-3 py-2 font-label-sm uppercase tracking-widest">Ajouter</button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-outline-variant/40 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Historique paiements</p>
                      <button onClick={() => {
                        const newBudget = window.prompt('Nouveau devis total (€) :', vendor.budget || 0);
                        if (newBudget !== null) updateVendorFinancials(vendor.id, { budget: Number(newBudget) || 0 });
                      }} className="text-primary text-sm hover:underline">
                        Modifier le devis
                      </button>
                    </div>
                    {(vendor.payments || []).length === 0 ? (
                      <p className="text-sm text-on-surface-variant italic">Aucun acompte ou facture payé enregistré.</p>
                    ) : (
                      <div className="space-y-2">
                        {vendor.payments.map(payment => (
                          <div key={payment.id} className="flex items-center justify-between gap-3 bg-surface-container-low rounded-md px-3 py-2">
                            <div>
                              <p className="font-medium text-on-surface">{payment.label} <span className="text-xs text-secondary uppercase">({payment.kind})</span></p>
                              <p className="text-xs text-secondary">{new Date(payment.paidAt).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{euro.format(payment.amount)}</span>
                              <button onClick={() => deleteVendorPayment(payment.id)} className="text-error hover:opacity-70">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 border-t border-outline-variant/40 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Documents liés</p>
                      <p className="text-sm text-on-surface-variant">{vendorDocuments.length} document(s) classé(s) pour ce prestataire.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDocumentModalVendor(vendor);
                        setDocumentForm({
                          title: '',
                          vendorId: vendor.id,
                          type: 'facture_acompte',
                          status: 'active',
                          amount: '',
                          documentUrl: '',
                          fileName: '',
                          notes: '',
                          declinedReason: ''
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary rounded-full px-5 py-3 font-label-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">attach_file</span>
                      Joindre un document
                    </button>
                  </div>

                  {vendorDocuments.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vendorDocuments.slice(0, 6).map(document => (
                        <div key={document.id} className="bg-surface-container-low border border-outline-variant/50 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-widest">{typeLabel(document.type)}</span>
                                {document.status === 'declined' && <span className="px-2 py-1 rounded-full bg-error/10 text-error text-[10px] uppercase tracking-widest">décliné</span>}
                              </div>
                              <p className="font-medium text-on-surface truncate">{document.title}</p>
                              <p className="text-xs text-secondary mt-1">
                                {document.amount != null ? euro.format(document.amount) : 'Montant non renseigné'}
                                {document.fileName ? ` · ${document.fileName}` : ''}
                              </p>
                              {document.declinedReason && <p className="text-xs text-error mt-1 truncate">{document.declinedReason}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {document.documentUrl && (
                                <a href={document.documentUrl} target="_blank" rel="noreferrer" className="text-primary hover:opacity-70">
                                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                </a>
                              )}
                              <button onClick={() => deleteBudgetDocument(document.id)} className="text-error hover:opacity-70">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {vendorDocuments.length > 6 && (
                        <p className="text-sm text-on-surface-variant md:col-span-2">+ {vendorDocuments.length - 6} autre(s) document(s) visibles dans l'onglet Documents.</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}

        {activeTab === 'documents' && renderDocumentList(documentsByTab.documents)}
        {activeTab === 'requests' && renderDocumentList(documentsByTab.requests)}
        {activeTab === 'declined' && renderDocumentList(documentsByTab.declined)}
      </main>

      {documentModalVendor && (
        <div className="fixed inset-0 z-[180] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <section className="bg-surface border border-outline-variant rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Document paiement</p>
                <h2 className="font-headline-md text-headline-md text-on-surface">Joindre un document</h2>
                <p className="text-sm text-on-surface-variant mt-1">{documentModalVendor.name} - {documentModalVendor.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setDocumentModalVendor(null)}
                className="text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={submitDocument} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Type</span>
                <select value={documentForm.type} onChange={event => setDocumentForm({ ...documentForm, type: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface">
                  {documentTypes.filter(([value]) => value !== 'demande_devis').map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Montant</span>
                <input type="number" min="0" step="0.01" value={documentForm.amount} onChange={event => setDocumentForm({ ...documentForm, amount: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="Ex: 1250" />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Titre</span>
                <input value={documentForm.title} onChange={event => setDocumentForm({ ...documentForm, title: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder={`Ex: Facture acompte - ${documentModalVendor.name}`} />
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Nom du fichier</span>
                <input value={documentForm.fileName} onChange={event => setDocumentForm({ ...documentForm, fileName: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="facture-acompte.pdf" />
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Lien document</span>
                <input value={documentForm.documentUrl} onChange={event => setDocumentForm({ ...documentForm, documentUrl: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="Lien Drive, facture, RIB..." />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Notes</span>
                <textarea rows="3" value={documentForm.notes} onChange={event => setDocumentForm({ ...documentForm, notes: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="Référence virement, échéance, condition, vérification à faire..." />
              </label>
              <label className="flex items-center gap-3 md:col-span-2 text-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={documentForm.status === 'declined'}
                  onChange={event => setDocumentForm({ ...documentForm, status: event.target.checked ? 'declined' : 'active' })}
                />
                Classer comme devis décliné
              </label>
              {documentForm.status === 'declined' && (
                <label className="block md:col-span-2">
                  <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Motif du refus</span>
                  <textarea rows="2" value={documentForm.declinedReason} onChange={event => setDocumentForm({ ...documentForm, declinedReason: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface" placeholder="Budget, disponibilité, conditions, doublon..." />
                </label>
              )}
              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button type="button" onClick={() => setDocumentModalVendor(null)} className="border border-outline-variant rounded-full px-5 py-3 text-on-surface-variant">
                  Annuler
                </button>
                <button className="bg-primary text-on-primary rounded-full px-6 py-3 font-label-sm uppercase tracking-widest">
                  Attacher le document
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      <BottomNavBar />
    </>
  );
}
