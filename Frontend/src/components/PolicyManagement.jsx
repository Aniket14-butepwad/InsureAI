import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Search, ChevronDown } from 'lucide-react';
import axios from 'axios';

const BASE = 'http://localhost:8080/api/policies';

const TYPES = ['HEALTH', 'LIFE', 'MOTOR', 'TWO_WHEELER', 'TRAVEL', 'HOME'];
const FREQS = ['MONTHLY', 'QUARTERLY', 'YEARLY'];
const STATUSES = ['ACTIVE', 'DRAFT', 'INACTIVE'];

// ── Styles ─────────────────────────────────────────────────────────────────
const S = {
  card:     { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  badge:    (s) => ({
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
    backgroundColor: s === 'ACTIVE' ? '#e6fff5' : s === 'DRAFT' ? '#fff9e6' : '#fff0f0',
    color:           s === 'ACTIVE' ? '#01b574' : s === 'DRAFT' ? '#ffb800' : '#ee5d50',
  }),
  input:    { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e9edf7', outline: 'none', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  label:    { fontSize: '12px', fontWeight: 700, color: '#a3aed0', marginBottom: '6px', display: 'block' },
  btn:      (color, outline) => ({
    padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
    border: outline ? `1px solid ${color}` : 'none',
    backgroundColor: outline ? 'transparent' : color,
    color: outline ? color : 'white',
    fontFamily: "'Plus Jakarta Sans',sans-serif",
  }),
  overlay:  { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:    { backgroundColor: 'white', borderRadius: '20px', width: '720px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' },
};

// ── Type-specific fields ───────────────────────────────────────────────────
const TYPE_FIELDS = {
  HEALTH: [
    { key: 'minAge',               label: 'Min Age',               type: 'number' },
    { key: 'maxAge',               label: 'Max Age',               type: 'number' },
    { key: 'roomRentLimit',        label: 'Room Rent Limit',       type: 'text' },
    { key: 'preExistingWaiting',   label: 'Pre-Existing Waiting',  type: 'text' },
    { key: 'cashlessHospitals',    label: 'Cashless Hospitals',    type: 'text' },
    { key: 'copayPercentage',      label: 'Copay %',               type: 'text' },
    { key: 'dayCareProcedures',    label: 'Day Care Procedures',   type: 'text' },
    { key: 'maternityBenefit',     label: 'Maternity Benefit',     type: 'bool' },
    { key: 'covidCover',           label: 'Covid Cover',           type: 'bool' },
    { key: 'ayushCover',           label: 'AYUSH Cover',           type: 'bool' },
  ],
  LIFE: [
    { key: 'minAge',               label: 'Min Age',               type: 'number' },
    { key: 'maxAge',               label: 'Max Age',               type: 'number' },
    { key: 'policyTerm',           label: 'Policy Term',           type: 'text' },
    { key: 'premiumPaymentTerm',   label: 'Premium Payment Term',  type: 'text' },
    { key: 'sumAssured',           label: 'Sum Assured (₹)',       type: 'number' },
    { key: 'deathBenefit',         label: 'Death Benefit',         type: 'bool' },
    { key: 'maturityBenefit',      label: 'Maturity Benefit',      type: 'bool' },
    { key: 'surrenderValue',       label: 'Surrender Value',       type: 'bool' },
    { key: 'smokingAllowed',       label: 'Smoking Allowed',       type: 'bool' },
    { key: 'criticalIllnessCover', label: 'Critical Illness Cover',type: 'bool' },
  ],
  MOTOR: [
    { key: 'vehicleType',          label: 'Vehicle Type',          type: 'text' },
    { key: 'idvAmount',            label: 'IDV Amount (₹)',        type: 'number' },
    { key: 'zeroDep',              label: 'Zero Dep',              type: 'bool' },
    { key: 'roadsideAssistance',   label: 'Roadside Assistance',   type: 'bool' },
    { key: 'engineProtection',     label: 'Engine Protection',     type: 'bool' },
    { key: 'ncbProtection',        label: 'NCB Protection',        type: 'bool' },
    { key: 'personalAccident',     label: 'Personal Accident',     type: 'bool' },
    { key: 'consumablesCover',     label: 'Consumables Cover',     type: 'bool' },
    { key: 'keyReplacement',       label: 'Key Replacement',       type: 'bool' },
    { key: 'invoiceCover',         label: 'Invoice Cover',         type: 'bool' },
  ],
  TWO_WHEELER: [
    { key: 'vehicleType',          label: 'Vehicle Type',          type: 'text' },
    { key: 'idvAmount',            label: 'IDV Amount (₹)',        type: 'number' },
    { key: 'zeroDep',              label: 'Zero Dep',              type: 'bool' },
    { key: 'roadsideAssistance',   label: 'Roadside Assistance',   type: 'bool' },
    { key: 'engineProtection',     label: 'Engine Protection',     type: 'bool' },
    { key: 'ncbProtection',        label: 'NCB Protection',        type: 'bool' },
    { key: 'personalAccident',     label: 'Personal Accident',     type: 'bool' },
    { key: 'consumablesCover',     label: 'Consumables Cover',     type: 'bool' },
  ],
  TRAVEL: [
    { key: 'minAge',               label: 'Min Age',               type: 'number' },
    { key: 'maxAge',               label: 'Max Age',               type: 'number' },
    { key: 'travelDestination',    label: 'Travel Destination',    type: 'text' },
    { key: 'tripDuration',         label: 'Trip Duration',         type: 'text' },
    { key: 'medicalCoverAmount',   label: 'Medical Cover (₹)',     type: 'number' },
    { key: 'medicalEmergency',     label: 'Medical Emergency',     type: 'bool' },
    { key: 'tripCancellation',     label: 'Trip Cancellation',     type: 'bool' },
    { key: 'baggageLoss',          label: 'Baggage Loss',          type: 'bool' },
    { key: 'flightDelay',          label: 'Flight Delay',          type: 'bool' },
    { key: 'adventureSports',      label: 'Adventure Sports',      type: 'bool' },
    { key: 'passportLoss',         label: 'Passport Loss',         type: 'bool' },
  ],
  HOME: [
    { key: 'propertyType',         label: 'Property Type',         type: 'text' },
    { key: 'constructionType',     label: 'Construction Type',     type: 'text' },
    { key: 'propertyAge',          label: 'Property Age',          type: 'text' },
    { key: 'sumInsuredProperty',   label: 'Sum Insured (₹)',       type: 'number' },
    { key: 'structureCover',       label: 'Structure Cover',       type: 'bool' },
    { key: 'contentCover',         label: 'Content Cover',         type: 'bool' },
    { key: 'naturalDisaster',      label: 'Natural Disaster',      type: 'bool' },
    { key: 'burglaryProtection',   label: 'Burglary Protection',   type: 'bool' },
    { key: 'alternateAccommodation',label:'Alternate Accommodation',type: 'bool' },
    { key: 'publicLiability',      label: 'Public Liability',      type: 'bool' },
    { key: 'valueablesCover',      label: 'Valuables Cover',       type: 'bool' }, // extra 'e' — matches Java entity
  ],
};

// ── Empty form factory ─────────────────────────────────────────────────────
const emptyForm = () => ({
  policyName: '', policyNumber: '', policyType: 'HEALTH', company: '', description: '',
  premiumAmount: '', premiumFrequency: 'MONTHLY', coverageAmount: '', keyFeatures: '',
  riders: '', taxBenefit: false, claimSettlementRatio: '', policyTerm: '', status: 'ACTIVE',
  // health
  minAge: '', maxAge: '', roomRentLimit: '', preExistingWaiting: '', cashlessHospitals: '',
  copayPercentage: '', dayCareProcedures: '', maternityBenefit: false, covidCover: false, ayushCover: false,
  // life
  sumAssured: '', premiumPaymentTerm: '', deathBenefit: false, maturityBenefit: false,
  surrenderValue: false, smokingAllowed: false, criticalIllnessCover: false,
  // motor / two-wheeler
  vehicleType: '', idvAmount: '', zeroDep: false, roadsideAssistance: false, engineProtection: false,
  ncbProtection: false, personalAccident: false, consumablesCover: false, keyReplacement: false,
  invoiceCover: false, pucCompliance: false,
  // travel
  travelDestination: '', tripDuration: '', medicalCoverAmount: '', medicalEmergency: false,
  tripCancellation: false, baggageLoss: false, flightDelay: false, adventureSports: false, passportLoss: false,
  // home
  propertyType: '', constructionType: '', propertyAge: '', sumInsuredProperty: '',
  structureCover: false, contentCover: false, naturalDisaster: false, burglaryProtection: false,
  alternateAccommodation: false, publicLiability: false, valueablesCover: false,
});

// ── PolicyManagement (default export) ─────────────────────────────────────
export default function PolicyManagement() {
  const [policies,    setPolicies]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [filterType,  setFilterType]  = useState('ALL');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [form,        setForm]        = useState(emptyForm());
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState('');
  const [deleteId,    setDeleteId]    = useState(null);

  // ── Fetch all policies ───────────────────────────────────────────────────
  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE);
      // API may return a plain array OR a paginated object like { content: [...] }
      const data = res.data;
      const list = Array.isArray(data) ? data : (data.content ?? data.data ?? []);
      setPolicies(list);
    } catch {
      showToast('❌ Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPolicies(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ── Open modal for create ────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  // ── Open modal for edit ──────────────────────────────────────────────────
  const openEdit = async (policy) => {
    try {
      const res = await axios.get(`${BASE}/${policy.id}`);
      const p = res.data;
      const detail = p.healthDetail || p.lifeDetail || p.motorDetail || p.travelDetail || p.homeDetail || {};
      setForm({ ...emptyForm(), ...p, ...detail });
      setEditingId(p.id);
      setModalOpen(true);
    } catch {
      showToast('❌ Failed to load policy details');
    }
  };

  // ── Save (create or update) ──────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.policyName || !form.policyNumber || !form.company) {
      showToast('⚠️ Policy Name, Number and Company are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${BASE}/${editingId}`, form);
        showToast('✅ Policy updated successfully!');
      } else {
        await axios.post(BASE, form);
        showToast('✅ Policy created successfully!');
      }
      setModalOpen(false);
      fetchPolicies();
    } catch {
      showToast('❌ Failed to save policy. Check all required fields.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE}/${id}`);
      showToast('🗑️ Policy deleted');
      setDeleteId(null);
      fetchPolicies();
    } catch {
      showToast('❌ Failed to delete policy');
    }
  };

  // ── Form helpers ─────────────────────────────────────────────────────────
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const FormInput = ({ fkey, label, type = 'text' }) => (
    <div>
      <label style={S.label}>{label}</label>
      <input
        type={type}
        value={form[fkey] ?? ''}
        onChange={e => set(fkey, type === 'number' ? +e.target.value : e.target.value)}
        style={S.input}
      />
    </div>
  );

  const FormSelect = ({ fkey, label, options }) => (
    <div style={{ position: 'relative' }}>
      <label style={S.label}>{label}</label>
      <select
        value={form[fkey]}
        onChange={e => set(fkey, e.target.value)}
        style={{ ...S.input, appearance: 'none', paddingRight: '32px' }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: '12px', bottom: '12px', color: '#a3aed0', pointerEvents: 'none' }} />
    </div>
  );

  const FormToggle = ({ fkey, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e9edf7' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1b2559' }}>{label}</span>
      <div
        onClick={() => set(fkey, !form[fkey])}
        style={{ width: '42px', height: '24px', borderRadius: '12px', backgroundColor: form[fkey] ? '#4318ff' : '#e9edf7', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
      >
        <div style={{ position: 'absolute', top: '3px', left: form[fkey] ? '21px' : '3px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = policies.filter(p => {
    const matchSearch = p.policyName?.toLowerCase().includes(search.toLowerCase()) ||
                        p.policyNumber?.toLowerCase().includes(search.toLowerCase()) ||
                        p.company?.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'ALL' || p.policyType === filterType;
    return matchSearch && matchType;
  });

  const counts = {
    ACTIVE:   policies.filter(p => p.status === 'ACTIVE').length,
    DRAFT:    policies.filter(p => p.status === 'DRAFT').length,
    INACTIVE: policies.filter(p => p.status === 'INACTIVE').length,
  };

  const typeFields = TYPE_FIELDS[form.policyType] || [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 999, backgroundColor: '#1b2559', color: 'white', padding: '12px 22px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[
          ['Active Policies',   counts.ACTIVE,   '#e6fff5', '#01b574'],
          ['Draft Policies',    counts.DRAFT,    '#fff9e6', '#ffb800'],
          ['Inactive Policies', counts.INACTIVE, '#fff0f0', '#ee5d50'],
        ].map(([l, v, bg, c], i) => (
          <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px' }}>
            <div style={{ backgroundColor: bg, padding: '12px 16px', borderRadius: '10px', color: c, fontWeight: 800, fontSize: '20px' }}>{v}</div>
            <p style={{ margin: 0, fontWeight: 700, color: '#1b2559' }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={S.card}>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ margin: 0, color: '#1b2559', fontSize: '17px', fontWeight: 800 }}>Policy Inventory</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f4f7fe', borderRadius: '10px', padding: '8px 14px', width: '220px' }}>
              <Search size={14} color="#a3aed0" />
              <input
                placeholder="Search policies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '100%', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              />
            </div>
            {/* Type filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e9edf7', outline: 'none', fontSize: '13px', fontFamily: "'Plus Jakarta Sans',sans-serif", color: '#1b2559' }}
            >
              <option value="ALL">All Types</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {/* New Policy */}
            <button onClick={openCreate} style={{ ...S.btn('#4318ff'), display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> New Policy
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#a3aed0', padding: '40px' }}>⏳ Loading policies...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#a3aed0', padding: '40px' }}>No policies found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#a3aed0', fontSize: '11px', fontWeight: 700, borderBottom: '1px solid #f4f7fe' }}>
                  {['POLICY NAME', 'TYPE', 'COMPANY', 'PREMIUM', 'COVERAGE', 'STATUS', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '10px 8px', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f4f7fe', fontSize: '14px' }}>
                    <td style={{ padding: '14px 8px' }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#1b2559' }}>{p.policyName}</p>
                      <span style={{ fontSize: '11px', color: '#a3aed0' }}>{p.policyNumber}</span>
                    </td>
                    <td><span style={{ background: '#f4f7fe', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#4318ff' }}>{p.policyType}</span></td>
                    <td style={{ color: '#1b2559', fontWeight: 600 }}>{p.company}</td>
                    <td style={{ color: '#4318ff', fontWeight: 700 }}>₹{p.premiumAmount?.toLocaleString('en-IN')}<span style={{ fontSize: '11px', fontWeight: 400, color: '#a3aed0' }}>/{p.premiumFrequency?.toLowerCase()}</span></td>
                    <td style={{ fontWeight: 600, color: '#1b2559' }}>₹{p.coverageAmount?.toLocaleString('en-IN')}</td>
                    <td><span style={S.badge(p.status)}>● {p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4318ff', padding: '4px' }} title="Edit">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ee5d50', padding: '4px' }} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete confirmation ── */}
      {deleteId && (
        <div style={S.overlay}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '380px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', color: '#1b2559' }}>Delete Policy?</h3>
            <p style={{ color: '#a3aed0', margin: '0 0 24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteId(null)} style={{ ...S.btn('#4318ff', true), flex: 1 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ ...S.btn('#ee5d50'), flex: 1 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div style={S.overlay}>
          <div style={S.modal}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#1b2559', fontSize: '20px', fontWeight: 800 }}>
                {editingId ? 'Edit Policy' : 'Create New Policy'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#a3aed0' }}>
                <X size={20} />
              </button>
            </div>

            {/* ── Section: Common fields ── */}
            <p style={{ margin: '0 0 12px', fontWeight: 800, color: '#4318ff', fontSize: '12px', letterSpacing: '1px' }}>BASIC INFORMATION</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <FormInput fkey="policyName"   label="Policy Name *" />
              <FormInput fkey="policyNumber" label="Policy Number *" />
              <FormInput fkey="company"      label="Company Name *" />
              <FormSelect fkey="policyType"  label="Insurance Type" options={TYPES} />
              <FormSelect fkey="premiumFrequency" label="Premium Frequency" options={FREQS} />
              <FormInput  fkey="premiumAmount"    label="Premium Amount (₹)" type="number" />
              <FormInput  fkey="coverageAmount"   label="Coverage Amount (₹)" type="number" />
              <FormInput  fkey="policyTerm"       label="Policy Term (e.g. 1 year)" />
              <FormInput  fkey="claimSettlementRatio" label="Claim Settlement Ratio" />
              <FormSelect fkey="status"      label="Status" options={STATUSES} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={S.label}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  style={{ ...S.input, resize: 'vertical' }}
                  placeholder="Brief description of the policy..."
                />
              </div>
              <FormInput fkey="keyFeatures" label="Key Features (comma-separated)" />
              <FormInput fkey="riders"      label="Riders / Add-ons (comma-separated)" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <FormToggle fkey="taxBenefit" label="Tax Benefit (80C / 80D eligible)" />
            </div>

            {/* ── Section: Type-specific fields ── */}
            {typeFields.length > 0 && (
              <>
                <div style={{ height: '1px', backgroundColor: '#f4f7fe', margin: '4px 0 20px' }} />
                <p style={{ margin: '0 0 14px', fontWeight: 800, color: '#4318ff', fontSize: '12px', letterSpacing: '1px' }}>
                  {form.policyType} SPECIFIC DETAILS
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  {typeFields.map(f =>
                    f.type === 'bool'
                      ? <FormToggle key={f.key} fkey={f.key} label={f.label} />
                      : <FormInput  key={f.key} fkey={f.key} label={f.label} type={f.type} />
                  )}
                </div>
              </>
            )}

            {/* Modal footer */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOpen(false)} style={S.btn('#4318ff', true)}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ ...S.btn('#4318ff'), opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : editingId ? 'Update Policy' : 'Create Policy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

