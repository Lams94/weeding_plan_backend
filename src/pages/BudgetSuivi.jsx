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
const requiredDocumentTypes = ['devis_propose', 'rib_prestataire', 'contrat', 'facture_acompte', 'facture_finale'];
const contractStatuses = [
  ['non_recu', 'Contrat non reçu'],
  ['recu', 'Contrat reçu'],
  ['signe', 'Contrat signé'],
  ['archive', 'Contrat archivé']
];
const contractLabel = (status) => contractStatuses.find(([value]) => value === status)?.[1] || status || 'Contrat non reçu';
const paymentStatusLabel = {
  paid: 'Payé',
  due: 'À payer',
  overdue: 'En retard'
};

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
  const [paymentModalVendor, setPaymentModalVendor] = useState(null);
  const [vendorFilter, setVendorFilter] = useState('all');
  const [documentForm, setDocumentForm] = useState({
    title: '',
    vendorId: '',
    type: 'devis_propose',
    status: 'active',
    amount: '',
    documentUrl: '',
    fileName: '',
    notes: '',
    declinedReason: '',
    paymentId: ''
  });

  const vendorRoles = useMemo(() => [...new Set(vendors.map(vendor => vendor.role).filter(Boolean))].sort(), [vendors]);
  const filteredVendors = useMemo(() => vendorFilter === 'all' ? vendors : vendors.filter(vendor => vendor.role === vendorFilter), [vendors, vendorFilter]);
  const committed = filteredVendors.reduce((sum, vendor) => sum + (Number(vendor.budget) || 0), 0);
  const paid = filteredVendors.reduce((sum, vendor) => sum + (Number(vendor.paid) || 0), 0);
  const base = Number(baseBudget) || 0;
  const remaining = base - committed;
  const paidRate = committed > 0 ? Math.min(100, Math.round((paid / committed) * 100)) : 0;

  const documentsByTab = useMemo(() => ({
    documents: budgetDocuments.filter(document => !['demande_devis'].includes(document.type) && document.status !== 'declined'),
    requests: budgetDocuments.filter(document => document.type === 'demande_devis' && document.status !== 'declined'),
    declined: budgetDocuments.filter(document => document.status === 'declined')
  }), [budgetDocuments]);

  const upcomingPayments = useMemo(() => vendors.flatMap(vendor => (vendor.payments || []).map(payment => ({
    ...payment,
    vendorName: vendor.name,
    effectiveStatus: payment.status === 'paid' ? 'paid' : (payment.dueDate && new Date(payment.dueDate) < new Date() ? 'overdue' : 'due')
  }))).filter(payment => payment.status !== 'paid' || payment.dueDate).sort((a, b) => new Date(a.dueDate || a.paidAt) - new Date(b.dueDate || b.paidAt)), [vendors]);

  const vendorHealth = (vendor) => {
    const docs = budgetDocuments.filter(document => document.vendorId === vendor.id && document.status !== 'declined');
    const docTypes = new Set(docs.map(document => document.type));
    const missingDocuments = requiredDocumentTypes.filter(type => !docTypes.has(type));
    const quotes = docs.filter(document => document.type === 'devis_propose' && document.amount != null);
    const quoteAmount = quotes.length ? quotes[0].amount : null;
    return {
      docs,
      missingDocuments,
      quoteAmount,
      variance: quoteAmount == null ? null : quoteAmount - (Number(vendor.budget) || 0)
    };
  };
  const reportGeneratedAt = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const allMissingDocuments = filteredVendors.flatMap(vendor => {
    const health = vendorHealth(vendor);
    return health.missingDocuments.map(type => ({ vendorName: vendor.name, vendorRole: vendor.role, type }));
  });
  const paidPayments = filteredVendors.flatMap(vendor => (vendor.payments || []).filter(payment => payment.status === 'paid').map(payment => ({ ...payment, vendorName: vendor.name, vendorRole: vendor.role })));
  const duePayments = filteredVendors.flatMap(vendor => (vendor.payments || []).filter(payment => payment.status !== 'paid').map(payment => ({ ...payment, vendorName: vendor.name, vendorRole: vendor.role })));
  const budgetChartRows = useMemo(() => {
    const grouped = filteredVendors.reduce((acc, vendor) => {
      const role = vendor.role || 'Autre';
      acc[role] = acc[role] || { role, budget: 0, paid: 0, count: 0 };
      acc[role].budget += Number(vendor.budget) || 0;
      acc[role].paid += Number(vendor.paid) || 0;
      acc[role].count += 1;
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => b.budget - a.budget).slice(0, 8);
  }, [filteredVendors]);
  const maxChartValue = Math.max(1, ...budgetChartRows.map(row => row.budget));

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
      status: form.status || 'paid',
      dueDate: form.dueDate || null
    });
    setPaymentForms(prev => ({ ...prev, [vendorId]: { label: 'Acompte', amount: '', kind: 'acompte', status: 'paid', dueDate: '' } }));
    setPaymentModalVendor(null);
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
      declinedReason: '',
      paymentId: ''
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
                {document.isVerified && <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] uppercase tracking-widest">vérifié</span>}
              </div>
              <p className="text-sm text-secondary">{document.vendor?.name || vendors.find(v => v.id === document.vendorId)?.name || 'Sans prestataire'}</p>
              {document.amount != null && <p className="text-sm text-on-surface mt-1">Montant: <strong>{euro.format(document.amount)}</strong></p>}
              {document.fileName && <p className="text-sm text-on-surface-variant mt-1">Fichier: {document.fileName}</p>}
              {document.notes && <p className="text-sm text-on-surface-variant mt-2 whitespace-pre-wrap">{document.notes}</p>}
              {document.declinedReason && <p className="text-sm text-error mt-2">Motif: {document.declinedReason}</p>}
              {document.documentUrl && <a href={document.documentUrl} target="_blank" rel="noreferrer" className="inline-flex text-primary text-sm mt-2 hover:underline">Ouvrir le document</a>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => updateBudgetDocument(document.id, { isVerified: !document.isVerified, verifiedBy: document.isVerified ? null : 'Wedding planner' })} className="border border-outline-variant rounded-md px-3 py-2 text-sm text-on-surface-variant hover:text-primary">
                {document.isVerified ? 'Dévalider' : 'Vérifier'}
              </button>
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

  const exportBudgetCsv = () => {
    const rows = [
      ['Prestataire', 'Role', 'Contrat', 'Budget', 'Paye', 'Reste', 'Documents manquants', 'Ecart devis'],
      ...filteredVendors.map(vendor => {
        const health = vendorHealth(vendor);
        return [
          vendor.name,
          vendor.role,
          contractLabel(vendor.contractStatus),
          vendor.budget || 0,
          vendor.paid || 0,
          (vendor.budget || 0) - (vendor.paid || 0),
          health.missingDocuments.map(typeLabel).join(' | '),
          health.variance ?? ''
        ];
      })
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-${activeWedding?.name || 'mariage'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printBudgetReport = () => {
    window.print();
  };

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

        <section className="bg-surface border border-outline-variant rounded-xl p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
            <div>
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Graphique</p>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Budget par poste</h2>
            </div>
            <div className="flex gap-4 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-2"><i className="w-3 h-3 rounded-full bg-primary inline-block" /> Engage</span>
              <span className="inline-flex items-center gap-2"><i className="w-3 h-3 rounded-full bg-secondary inline-block" /> Paye</span>
            </div>
          </div>
          <div className="space-y-4">
            {budgetChartRows.map(row => {
              const budgetWidth = Math.max(2, Math.round((row.budget / maxChartValue) * 100));
              const paidWidth = row.budget > 0 ? Math.min(100, Math.round((row.paid / row.budget) * 100)) : 0;
              return (
                <div key={row.role} className="grid grid-cols-1 md:grid-cols-[180px_1fr_160px] gap-2 md:items-center">
                  <div>
                    <p className="font-medium text-on-surface truncate">{row.role}</p>
                    <p className="text-xs text-secondary">{row.count} prestataire(s)</p>
                  </div>
                  <div className="h-7 bg-surface-container-low rounded-full overflow-hidden border border-outline-variant/50">
                    <div className="h-full bg-primary/25 rounded-full" style={{ width: `${budgetWidth}%` }}>
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${paidWidth}%` }} />
                    </div>
                  </div>
                  <p className="text-sm text-on-surface md:text-right">
                    <strong>{euro.format(row.budget)}</strong>
                    <span className="text-secondary"> / {euro.format(row.paid)}</span>
                  </p>
                </div>
              );
            })}
            {budgetChartRows.length === 0 && <p className="text-sm text-on-surface-variant">Aucun budget prestataire a afficher.</p>}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-outline-variant rounded-xl p-5">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Filtre poste</p>
            <select value={vendorFilter} onChange={event => setVendorFilter(event.target.value)} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface">
              <option value="all">Tous les prestataires</option>
              {vendorRoles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-5">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Exports</p>
            <div className="flex gap-2">
              <button onClick={exportBudgetCsv} className="flex-1 border border-outline-variant rounded-md px-3 py-3 text-sm text-on-surface hover:border-primary">Excel CSV</button>
              <button onClick={printBudgetReport} className="flex-1 border border-outline-variant rounded-md px-3 py-3 text-sm text-on-surface hover:border-primary">PDF / Imprimer</button>
            </div>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-5">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">Échéances</p>
            <p className="text-sm text-on-surface-variant">{upcomingPayments.filter(payment => payment.effectiveStatus !== 'paid').length} paiement(s) à suivre</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="bg-surface border border-outline-variant rounded-xl p-5">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Documents manquants</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredVendors.filter(vendor => vendorHealth(vendor).missingDocuments.length > 0).slice(0, 8).map(vendor => (
                <div key={vendor.id} className="bg-surface-container-low rounded-lg p-3">
                  <p className="font-semibold text-on-surface">{vendor.name}</p>
                  <p className="text-xs text-error mt-1">{vendorHealth(vendor).missingDocuments.map(typeLabel).join(', ')}</p>
                </div>
              ))}
              {filteredVendors.every(vendor => vendorHealth(vendor).missingDocuments.length === 0) && <p className="text-sm text-on-surface-variant">Tous les documents obligatoires sont présents.</p>}
            </div>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-5">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Échéances paiement</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {upcomingPayments.slice(0, 8).map(payment => (
                <div key={payment.id} className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-on-surface">{payment.vendorName}</p>
                    <p className="text-xs text-secondary">{payment.label} · {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('fr-FR') : new Date(payment.paidAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className={payment.effectiveStatus === 'overdue' ? 'text-error text-sm' : 'text-primary text-sm'}>{paymentStatusLabel[payment.effectiveStatus]}</span>
                </div>
              ))}
              {upcomingPayments.length === 0 && <p className="text-sm text-on-surface-variant">Aucune échéance enregistrée.</p>}
            </div>
          </div>
        </section>

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
            {filteredVendors.map(vendor => {
              const vendorPaidRate = vendor.budget > 0 ? Math.min(100, Math.round((vendor.paid / vendor.budget) * 100)) : 0;
              const vendorDocuments = budgetDocuments.filter(document => document.vendorId === vendor.id);
              const health = vendorHealth(vendor);
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
                        {health.variance != null && <span>Écart devis réel: <strong className={health.variance > 0 ? 'text-error' : 'text-primary'}>{euro.format(health.variance)}</strong></span>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <select value={vendor.contractStatus || 'non_recu'} onChange={event => updateVendorFinancials(vendor.id, { contractStatus: event.target.value })} className="border border-outline-variant rounded-full px-3 py-2 bg-surface text-xs">
                          {contractStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        {health.missingDocuments.slice(0, 3).map(type => (
                          <span key={type} className="px-3 py-2 rounded-full bg-error/10 text-error text-[10px] uppercase tracking-widest">Manque {typeLabel(type)}</span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full lg:w-[460px]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${vendorPaidRate}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-primary w-12 text-right">{vendorPaidRate}%</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentModalVendor(vendor);
                          setPaymentForms(prev => ({
                            ...prev,
                            [vendor.id]: { label: 'Acompte', amount: '', kind: 'acompte', status: 'paid', dueDate: '' }
                          }));
                        }}
                        className="w-full bg-primary text-on-primary rounded-full px-5 py-3 font-label-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                      >
                        Ajouter une opération
                      </button>
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
                              <p className="text-xs text-secondary">
                                {payment.status === 'paid' ? 'Payé le ' : 'Échéance '}
                                {new Date(payment.dueDate || payment.paidAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={payment.status === 'paid' ? 'text-primary text-xs uppercase' : 'text-error text-xs uppercase'}>{paymentStatusLabel[payment.status] || payment.status}</span>
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
                          declinedReason: '',
                          paymentId: ''
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
                                {document.isVerified && <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] uppercase tracking-widest">vérifié</span>}
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

      <section className="budget-print-report">
        <header className="print-report-header">
          <div>
            <p className="print-kicker">Rapport financier mariage</p>
            <h1>{activeWedding?.name || 'Projet mariage'}</h1>
            <p>Genere le {reportGeneratedAt}</p>
          </div>
          <div className="print-report-badge">
            <span>{paidRate}%</span>
            <small>paiements realises</small>
          </div>
        </header>

        <section className="print-summary-grid">
          <div>
            <span>Budget de base</span>
            <strong>{euro.format(base)}</strong>
          </div>
          <div>
            <span>Engage prestataires</span>
            <strong>{euro.format(committed)}</strong>
          </div>
          <div>
            <span>Paye</span>
            <strong>{euro.format(paid)}</strong>
          </div>
          <div>
            <span>Reste budget</span>
            <strong>{euro.format(remaining)}</strong>
          </div>
        </section>

        <section className="print-section print-chart-section">
          <div className="print-section-title">
            <h2>Graphique budget par poste</h2>
            <p>Barre claire: engage - barre foncee: paye</p>
          </div>
          <div className="print-chart">
            {budgetChartRows.map(row => {
              const budgetWidth = Math.max(2, Math.round((row.budget / maxChartValue) * 100));
              const paidWidth = row.budget > 0 ? Math.min(100, Math.round((row.paid / row.budget) * 100)) : 0;
              return (
                <div key={row.role} className="print-chart-row">
                  <span>{row.role}</span>
                  <div className="print-chart-track">
                    <div className="print-chart-budget" style={{ width: `${budgetWidth}%` }}>
                      <div className="print-chart-paid" style={{ width: `${paidWidth}%` }} />
                    </div>
                  </div>
                  <strong>{euro.format(row.budget)}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className="print-section">
          <div className="print-section-title">
            <h2>Synthese prestataires</h2>
            <p>{filteredVendors.length} prestataire(s) dans ce rapport</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Prestataire</th>
                <th>Role</th>
                <th>Contrat</th>
                <th>Devis</th>
                <th>Paye</th>
                <th>Reste</th>
                <th>Docs manquants</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map(vendor => {
                const health = vendorHealth(vendor);
                return (
                  <tr key={vendor.id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.role}</td>
                    <td>{contractLabel(vendor.contractStatus)}</td>
                    <td>{euro.format(vendor.budget || 0)}</td>
                    <td>{euro.format(vendor.paid || 0)}</td>
                    <td>{euro.format((vendor.budget || 0) - (vendor.paid || 0))}</td>
                    <td>{health.missingDocuments.length ? health.missingDocuments.map(typeLabel).join(', ') : 'OK'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="print-two-columns">
          <div className="print-section">
            <div className="print-section-title">
              <h2>Paiements enregistres</h2>
              <p>{paidPayments.length} operation(s) payee(s)</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Prestataire</th>
                  <th>Operation</th>
                  <th>Date</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {paidPayments.length ? paidPayments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.vendorName}</td>
                    <td>{payment.label} ({payment.kind})</td>
                    <td>{new Date(payment.dueDate || payment.paidAt).toLocaleDateString('fr-FR')}</td>
                    <td>{euro.format(payment.amount)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4">Aucun paiement enregistre.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="print-section">
            <div className="print-section-title">
              <h2>Echeances a suivre</h2>
              <p>{duePayments.length} paiement(s) a payer</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Prestataire</th>
                  <th>Operation</th>
                  <th>Echeance</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {duePayments.length ? duePayments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.vendorName}</td>
                    <td>{payment.label} ({payment.kind})</td>
                    <td>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('fr-FR') : 'Non definie'}</td>
                    <td>{euro.format(payment.amount)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4">Aucune echeance ouverte.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="print-section">
          <div className="print-section-title">
            <h2>Documents et conformite</h2>
            <p>{budgetDocuments.length} document(s) classe(s) - {allMissingDocuments.length} manque(s)</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Prestataire</th>
                <th>Document</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {budgetDocuments.length ? budgetDocuments.map(document => (
                <tr key={document.id}>
                  <td>{document.vendor?.name || vendors.find(v => v.id === document.vendorId)?.name || 'Sans prestataire'}</td>
                  <td>{document.title}</td>
                  <td>{typeLabel(document.type)}</td>
                  <td>{document.status === 'declined' ? `Decline${document.declinedReason ? ` - ${document.declinedReason}` : ''}` : document.isVerified ? 'Verifie' : 'A verifier'}</td>
                  <td>{document.amount != null ? euro.format(document.amount) : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="5">Aucun document financier classe.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        {allMissingDocuments.length > 0 && (
          <section className="print-section print-alert-section">
            <div className="print-section-title">
              <h2>Actions prioritaires</h2>
              <p>Documents a recuperer</p>
            </div>
            <ul>
              {allMissingDocuments.map(item => (
                <li key={`${item.vendorName}-${item.type}`}>{item.vendorName} ({item.vendorRole}) : {typeLabel(item.type)}</li>
              ))}
            </ul>
          </section>
        )}
      </section>

      {paymentModalVendor && (
        <div className="fixed inset-0 z-[180] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <section className="bg-surface border border-outline-variant rounded-xl shadow-2xl w-full max-w-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Paiement prestataire</p>
                <h2 className="font-headline-md text-headline-md text-on-surface">Ajouter une opération</h2>
                <p className="text-sm text-on-surface-variant mt-1">{paymentModalVendor.name} - {paymentModalVendor.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalVendor(null)}
                className="text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={event => submitPayment(event, paymentModalVendor.id)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block md:col-span-2">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Libellé</span>
                <input
                  value={(paymentForms[paymentModalVendor.id]?.label) || ''}
                  onChange={event => updatePaymentForm(paymentModalVendor.id, { label: event.target.value })}
                  className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface"
                  placeholder="Ex: Acompte traiteur"
                />
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Type</span>
                <select
                  value={(paymentForms[paymentModalVendor.id]?.kind) || 'acompte'}
                  onChange={event => updatePaymentForm(paymentModalVendor.id, { kind: event.target.value })}
                  className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface"
                >
                  <option value="acompte">Acompte</option>
                  <option value="facture">Facture</option>
                  <option value="solde">Solde</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Statut</span>
                <select
                  value={(paymentForms[paymentModalVendor.id]?.status) || 'paid'}
                  onChange={event => updatePaymentForm(paymentModalVendor.id, { status: event.target.value })}
                  className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface"
                >
                  <option value="paid">Payé</option>
                  <option value="due">À payer</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Montant</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(paymentForms[paymentModalVendor.id]?.amount) || ''}
                  onChange={event => updatePaymentForm(paymentModalVendor.id, { amount: event.target.value })}
                  className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface"
                  placeholder="Ex: 3000"
                />
              </label>
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Date</span>
                <input
                  type="date"
                  value={(paymentForms[paymentModalVendor.id]?.dueDate) || ''}
                  onChange={event => updatePaymentForm(paymentModalVendor.id, { dueDate: event.target.value })}
                  className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface"
                />
              </label>
              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button type="button" onClick={() => setPaymentModalVendor(null)} className="border border-outline-variant rounded-full px-5 py-3 text-on-surface-variant">
                  Annuler
                </button>
                <button className="bg-primary text-on-primary rounded-full px-6 py-3 font-label-sm uppercase tracking-widest">
                  Enregistrer
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

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
                <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Lier à une opération de paiement</span>
                <select value={documentForm.paymentId || ''} onChange={event => setDocumentForm({ ...documentForm, paymentId: event.target.value })} className="w-full border border-outline-variant rounded-md px-3 py-3 bg-surface">
                  <option value="">Aucune opération précise</option>
                  {(documentModalVendor.payments || []).map(payment => (
                    <option key={payment.id} value={payment.id}>{payment.label} - {euro.format(payment.amount)} - {new Date(payment.dueDate || payment.paidAt).toLocaleDateString('fr-FR')}</option>
                  ))}
                </select>
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
