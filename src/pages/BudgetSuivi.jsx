import React, { useState } from 'react';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import useStore from '../store/useStore';

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export default function BudgetSuivi() {
  const activeWedding = useStore(state => state.activeWedding);
  const vendors = useStore(state => state.vendors);
  const updateWedding = useStore(state => state.updateWedding);
  const addVendorPayment = useStore(state => state.addVendorPayment);
  const deleteVendorPayment = useStore(state => state.deleteVendorPayment);
  const updateVendorFinancials = useStore(state => state.updateVendorFinancials);

  const [baseBudget, setBaseBudget] = useState(activeWedding?.baseBudget || 0);
  const [paymentForms, setPaymentForms] = useState({});

  const committed = vendors.reduce((sum, vendor) => sum + (Number(vendor.budget) || 0), 0);
  const paid = vendors.reduce((sum, vendor) => sum + (Number(vendor.paid) || 0), 0);
  const base = Number(baseBudget) || 0;
  const remaining = base - committed;
  const paidRate = committed > 0 ? Math.min(100, Math.round((paid / committed) * 100)) : 0;

  const updatePaymentForm = (vendorId, patch) => {
    setPaymentForms(prev => ({
      ...prev,
      [vendorId]: {
        label: 'Acompte',
        amount: '',
        kind: 'acompte',
        ...prev[vendorId],
        ...patch
      }
    }));
  };

  const submitPayment = async (e, vendorId) => {
    e.preventDefault();
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

  return (
    <>
      <TopAppBar title="Budget & Paiements" role="FINANCE" />
      <main className="pt-28 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">Suivi financier</p>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">Budget de base, acomptes et factures</h1>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateWedding({ baseBudget: base });
            }}
            className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-end"
          >
            <label>
              <span className="block text-xs uppercase tracking-widest text-secondary mb-1">Budget souhaité</span>
              <input type="number" min="0" value={baseBudget} onChange={e => setBaseBudget(e.target.value)} className="border border-outline-variant rounded-md bg-surface px-4 py-2 w-full sm:w-48" />
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

        <section className="space-y-5">
          {vendors.map(vendor => {
            const vendorPaidRate = vendor.budget > 0 ? Math.min(100, Math.round((vendor.paid / vendor.budget) * 100)) : 0;
            const form = paymentForms[vendor.id] || { label: 'Acompte', amount: '', kind: 'acompte' };
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

                    <form onSubmit={(e) => submitPayment(e, vendor.id)} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input value={form.label} onChange={e => updatePaymentForm(vendor.id, { label: e.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface sm:col-span-1" placeholder="Libellé" />
                      <select value={form.kind} onChange={e => updatePaymentForm(vendor.id, { kind: e.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface">
                        <option value="acompte">Acompte</option>
                        <option value="facture">Facture</option>
                        <option value="solde">Solde</option>
                      </select>
                      <input type="number" min="0" step="0.01" value={form.amount} onChange={e => updatePaymentForm(vendor.id, { amount: e.target.value })} className="border border-outline-variant rounded-md px-3 py-2 bg-surface" placeholder="Montant" />
                      <button className="bg-primary text-on-primary rounded-md px-3 py-2 font-label-sm uppercase tracking-widest">Ajouter</button>
                    </form>
                  </div>
                </div>

                <div className="mt-5 border-t border-outline-variant/40 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Historique paiements</p>
                    <button
                      onClick={() => {
                        const newBudget = window.prompt('Nouveau devis total (€) :', vendor.budget || 0);
                        if (newBudget !== null) updateVendorFinancials(vendor.id, { budget: Number(newBudget) || 0 });
                      }}
                      className="text-primary text-sm hover:underline"
                    >
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
              </article>
            );
          })}
        </section>
      </main>
      <BottomNavBar />
    </>
  );
}
