import React, { useState, useEffect } from 'react';
import { Search, X, ExternalLink, ChevronDown } from 'lucide-react';
import axios from 'axios';

const BASE = 'http://localhost:8080/api/policies';

const TYPES = ['ALL', 'HEALTH', 'LIFE', 'MOTOR', 'TWO_WHEELER', 'TRAVEL', 'HOME'];

const TYPE_COLOR = {
  HEALTH:      { bg: '#e6fff5', color: '#01b574' },
  LIFE:        { bg: '#ede9fe', color: '#6366f1' },
  MOTOR:       { bg: '#fff9e6', color: '#ffb800' },
  TWO_WHEELER: { bg: '#fff0f0', color: '#ee5d50' },
  TRAVEL:      { bg: '#e0f2fe', color: '#0284c7' },
  HOME:        { bg: '#fef9c3', color: '#ca8a04' },
};

const S = {
  card:   { backgroundColor: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 3px 16px rgba(0,0,0,0.06)' },
  input:  { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e9edf7', outline: 'none', fontSize: '13px', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif" },
  label:  { fontSize: '11px', fontWeight: 700, color: '#a3aed0', marginBottom: '4px', display: 'block' },
  overlay:{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal:  { backgroundColor: 'white', borderRadius: '20px', width: '680px', maxWidth: '95vw', maxHeight: '88vh', overflowY: 'auto', padding: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.22)' },
};

// ── Helpers ──────────────────────────────────────────────────────────────
const fmt = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

const DetailRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f4f7fe' }}>
    <span style={{ fontSize: '12px', color: '#a3aed0', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '13px', color: '#1b2559', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{value ?? '—'}</span>
  </div>
);

const BoolRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f4f7fe' }}>
    <span style={{ fontSize: '12px', color: '#a3aed0', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '12px', fontWeight: 700, color: value ? '#01b574' : '#ee5d50' }}>{value ? '✓ Yes' : '✗ No'}</span>
  </div>
);

// ── PolicyCatalog (default export) ────────────────────────────────────────
export default function PolicyCatalog() {
  const [policies,   setPolicies]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [activeType, setActiveType] = useState('ALL');
  const [selected,   setSelected]   = useState(null); // for detail modal
  const [toast,      setToast]      = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // ── Fetch active policies ────────────────────────────────────────────────
  useEffect(() => {
    axios.get(`${BASE}/active`)
      .then(res => { const d = res.data; setPolicies(Array.isArray(d) ? d : (d.content ?? d.data ?? [])); })
      .catch(()  => showToast('❌ Failed to load policies'))
      .finally(() => setLoading(false));
  }, []);

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = policies.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.policyName?.toLowerCase().includes(q) ||
                        p.company?.toLowerCase().includes(q)    ||
                        p.policyNumber?.toLowerCase().includes(q);
    const matchType   = activeType === 'ALL' || p.policyType === activeType;
    return matchSearch && matchType;
  });

  // ── WhatsApp share ───────────────────────────────────────────────────────
  const shareOnWhatsApp = (p) => {
    const msg = encodeURIComponent(
      `📋 *${p.policyName}* — ${p.company}\n` +
      `🏷️ Type: ${p.policyType}\n` +
      `💰 Premium: ₹${p.premiumAmount?.toLocaleString('en-IN')}/${p.premiumFrequency?.toLowerCase()}\n` +
      `🛡️ Coverage: ₹${p.coverageAmount?.toLocaleString('en-IN')}\n` +
      `✅ Settlement: ${p.claimSettlementRatio}\n\n` +
      `📞 Contact me to know more!`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  // ── Open detail modal ────────────────────────────────────────────────────
  const openDetail = async (p) => {
    try {
      const res = await axios.get(`${BASE}/${p.id}`);
      setSelected(res.data);
    } catch {
      showToast('❌ Could not load policy details');
    }
  };

  // ── Render type-specific detail section ──────────────────────────────────
  const TypeDetails = ({ p }) => {
    const type = p.policyType;
    if (type === 'HEALTH' && p.healthDetail) {
      const h = p.healthDetail;
      return (
        <>
          <p style={{ margin: '16px 0 8px', fontWeight: 800, fontSize: '11px', color: '#6366f1', letterSpacing: '1px' }}>HEALTH DETAILS</p>
          <DetailRow label="Age Range"              value={h.minAge && h.maxAge ? `${h.minAge} – ${h.maxAge} yrs` : null} />
          <DetailRow label="Room Rent Limit"        value={h.roomRentLimit} />
          <DetailRow label="Pre-Existing Waiting"   value={h.preExistingWaiting} />
          <DetailRow label="Cashless Hospitals"     value={h.cashlessHospitals} />
          <DetailRow label="Copay %"                value={h.copayPercentage} />
          <DetailRow label="Day Care Procedures"    value={h.dayCareProcedures} />
          <BoolRow   label="Maternity Benefit"      value={h.maternityBenefit} />
          <BoolRow   label="Covid Cover"            value={h.covidCover} />
          <BoolRow   label="AYUSH Cover"            value={h.ayushCover} />
        </>
      );
    }
    if (type === 'LIFE' && p.lifeDetail) {
      const l = p.lifeDetail;
      return (
        <>
          <p style={{ margin: '16px 0 8px', fontWeight: 800, fontSize: '11px', color: '#6366f1', letterSpacing: '1px' }}>LIFE DETAILS</p>
          <DetailRow label="Age Range"              value={l.minAge && l.maxAge ? `${l.minAge} – ${l.maxAge} yrs` : null} />
          <DetailRow label="Policy Term"            value={l.policyTerm} />
          <DetailRow label="Premium Payment Term"   value={l.premiumPaymentTerm} />
          <DetailRow label="Sum Assured"            value={fmt(l.sumAssured)} />
          <BoolRow   label="Death Benefit"          value={l.deathBenefit} />
          <BoolRow   label="Maturity Benefit"       value={l.maturityBenefit} />
          <BoolRow   label="Surrender Value"        value={l.surrenderValue} />
          <BoolRow   label="Critical Illness Cover" value={l.criticalIllnessCover} />
        </>
      );
    }
    if ((type === 'MOTOR' || type === 'TWO_WHEELER') && p.motorDetail) {
      const m = p.motorDetail;
      return (
        <>
          <p style={{ margin: '16px 0 8px', fontWeight: 800, fontSize: '11px', color: '#6366f1', letterSpacing: '1px' }}>MOTOR DETAILS</p>
          <DetailRow label="Vehicle Type"          value={m.vehicleType} />
          <DetailRow label="IDV Amount"            value={fmt(m.idvAmount)} />
          <BoolRow   label="Zero Depreciation"     value={m.zeroDep} />
          <BoolRow   label="Roadside Assistance"   value={m.roadsideAssistance} />
          <BoolRow   label="Engine Protection"     value={m.engineProtection} />
          <BoolRow   label="NCB Protection"        value={m.ncbProtection} />
          <BoolRow   label="Personal Accident"     value={m.personalAccident} />
          <BoolRow   label="Consumables Cover"     value={m.consumablesCover} />
          <BoolRow   label="Key Replacement"       value={m.keyReplacement} />
          <BoolRow   label="Invoice Cover"         value={m.invoiceCover} />
        </>
      );
    }
    if (type === 'TRAVEL' && p.travelDetail) {
      const t = p.travelDetail;
      return (
        <>
          <p style={{ margin: '16px 0 8px', fontWeight: 800, fontSize: '11px', color: '#6366f1', letterSpacing: '1px' }}>TRAVEL DETAILS</p>
          <DetailRow label="Age Range"             value={t.minAge && t.maxAge ? `${t.minAge} – ${t.maxAge} yrs` : null} />
          <DetailRow label="Destination"           value={t.travelDestination} />
          <DetailRow label="Trip Duration"         value={t.tripDuration} />
          <DetailRow label="Medical Cover"         value={fmt(t.medicalCoverAmount)} />
          <BoolRow   label="Medical Emergency"     value={t.medicalEmergency} />
          <BoolRow   label="Trip Cancellation"     value={t.tripCancellation} />
          <BoolRow   label="Baggage Loss"          value={t.baggageLoss} />
          <BoolRow   label="Flight Delay"          value={t.flightDelay} />
          <BoolRow   label="Adventure Sports"      value={t.adventureSports} />
          <BoolRow   label="Passport Loss"         value={t.passportLoss} />
        </>
      );
    }
    if (type === 'HOME' && p.homeDetail) {
      const h = p.homeDetail;
      return (
        <>
          <p style={{ margin: '16px 0 8px', fontWeight: 800, fontSize: '11px', color: '#6366f1', letterSpacing: '1px' }}>HOME DETAILS</p>
          <DetailRow label="Property Type"         value={h.propertyType} />
          <DetailRow label="Construction Type"     value={h.constructionType} />
          <DetailRow label="Property Age"          value={h.propertyAge} />
          <DetailRow label="Sum Insured"           value={fmt(h.sumInsuredProperty)} />
          <BoolRow   label="Structure Cover"       value={h.structureCover} />
          <BoolRow   label="Content Cover"         value={h.contentCover} />
          <BoolRow   label="Natural Disaster"      value={h.naturalDisaster} />
          <BoolRow   label="Burglary Protection"   value={h.burglaryProtection} />
          <BoolRow   label="Alternate Accommodation" value={h.alternateAccommodation} />
          <BoolRow   label="Public Liability"      value={h.publicLiability} />
          <BoolRow   label="Valuables Cover"       value={h.valueablesCover} />
        </>
      );
    }
    return null;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 999, backgroundColor: '#1a1f3a', color: 'white', padding: '12px 22px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Search + type filter bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', borderRadius: '10px', padding: '10px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: '280px' }}>
          <Search size={14} color="#a3aed0" />
          <input
            placeholder="Search by name, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '13px', width: '100%', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
          />
          {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#a3aed0', padding: 0 }}><X size={13} /></button>}
        </div>

        {/* Type filter chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              style={{
                padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '12px',
                backgroundColor: activeType === t ? '#6366f1' : 'white',
                color: activeType === t ? 'white' : '#64748b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.15s',
                fontFamily: "'Plus Jakarta Sans',sans-serif",
              }}
            >
              {t === 'ALL' ? 'All Plans' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Count summary */}
      <p style={{ margin: 0, fontSize: '13px', color: '#a3aed0', fontWeight: 600 }}>
        Showing <strong style={{ color: '#1b2559' }}>{filtered.length}</strong> of <strong style={{ color: '#1b2559' }}>{policies.length}</strong> active policies
      </p>

      {/* Loading / empty */}
      {loading && <div style={{ ...S.card, textAlign: 'center', padding: '60px', color: '#a3aed0' }}>⏳ Loading policies from database...</div>}
      {!loading && filtered.length === 0 && <div style={{ ...S.card, textAlign: 'center', padding: '60px', color: '#a3aed0' }}>No policies match your search.</div>}

      {/* Policy grid */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(p => {
            const tc = TYPE_COLOR[p.policyType] || { bg: '#f4f7fe', color: '#4318ff' };
            const features = p.keyFeatures ? p.keyFeatures.split(',').map(f => f.trim()).filter(Boolean) : [];
            const riders   = p.riders       ? p.riders.split(',').map(r => r.trim()).filter(Boolean)       : [];
            return (
              <div key={p.id} style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Top row: type badge + company */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ backgroundColor: tc.bg, color: tc.color, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                    {p.policyType.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '11px', color: '#a3aed0', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{p.company}</span>
                </div>

                {/* Policy name */}
                <h3 style={{ margin: 0, color: '#1b2559', fontSize: '15px', fontWeight: 800, lineHeight: 1.3 }}>{p.policyName}</h3>
                <p style={{ margin: 0, fontSize: '11px', color: '#a3aed0' }}>{p.policyNumber}</p>

                {/* Features tags */}
                {features.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {features.slice(0, 3).map((f, i) => (
                      <span key={i} style={{ fontSize: '11px', backgroundColor: '#f4f7fe', color: '#64748b', padding: '3px 8px', borderRadius: '6px' }}>{f}</span>
                    ))}
                    {features.length > 3 && <span style={{ fontSize: '11px', color: '#a3aed0' }}>+{features.length - 3} more</span>}
                  </div>
                )}

                {/* Premium + Coverage */}
                <div style={{ display: 'flex', gap: '20px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '10px', color: '#a3aed0', fontWeight: 600 }}>PREMIUM</p>
                    <p style={{ margin: 0, fontWeight: 800, color: '#6366f1', fontSize: '15px' }}>
                      ₹{p.premiumAmount?.toLocaleString('en-IN')}
                      <span style={{ fontSize: '11px', fontWeight: 400, color: '#a3aed0' }}>/{p.premiumFrequency?.toLowerCase()}</span>
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '10px', color: '#a3aed0', fontWeight: 600 }}>COVERAGE</p>
                    <p style={{ margin: 0, fontWeight: 800, color: '#1b2559', fontSize: '15px' }}>₹{p.coverageAmount?.toLocaleString('en-IN')}</p>
                  </div>
                  {p.claimSettlementRatio && (
                    <div>
                      <p style={{ margin: 0, fontSize: '10px', color: '#a3aed0', fontWeight: 600 }}>CLAIM RATIO</p>
                      <p style={{ margin: 0, fontWeight: 800, color: '#01b574', fontSize: '15px' }}>{p.claimSettlementRatio}</p>
                    </div>
                  )}
                </div>

                {/* Riders */}
                {riders.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {riders.map((r, i) => (
                      <span key={i} style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600 }}>+ {r}</span>
                    ))}
                  </div>
                )}

                {/* Tax benefit badge */}
                {p.taxBenefit && (
                  <span style={{ fontSize: '11px', color: '#01b574', fontWeight: 700, backgroundColor: '#e6fff5', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', width: 'fit-content' }}>
                    ✅ Tax Benefit (80C/80D)
                  </span>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    onClick={() => openDetail(p)}
                    style={{ flex: 1, padding: '9px', borderRadius: '9px', border: '1px solid #6366f1', color: '#6366f1', background: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  >
                    <ExternalLink size={13} /> View Details
                  </button>
                  <button
                    onClick={() => shareOnWhatsApp(p)}
                    style={{ flex: 1, padding: '9px', borderRadius: '9px', border: 'none', backgroundColor: '#25d366', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '12px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                  >
                    📲 WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <div style={S.overlay} onClick={() => setSelected(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ backgroundColor: (TYPE_COLOR[selected.policyType] || {}).bg, color: (TYPE_COLOR[selected.policyType] || {}).color, padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                  {selected.policyType?.replace('_', ' ')}
                </span>
                <h2 style={{ margin: '10px 0 4px', color: '#1b2559', fontSize: '20px', fontWeight: 800 }}>{selected.policyName}</h2>
                <p style={{ margin: 0, color: '#a3aed0', fontSize: '13px' }}>{selected.company} · {selected.policyNumber}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#a3aed0' }}><X size={20} /></button>
            </div>

            {/* Description */}
            {selected.description && (
              <p style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.6 }}>{selected.description}</p>
            )}

            {/* Common details */}
            <p style={{ margin: '0 0 8px', fontWeight: 800, fontSize: '11px', color: '#6366f1', letterSpacing: '1px' }}>PLAN OVERVIEW</p>
            <DetailRow label="Premium"                value={`₹${selected.premiumAmount?.toLocaleString('en-IN')} / ${selected.premiumFrequency?.toLowerCase()}`} />
            <DetailRow label="Coverage Amount"        value={fmt(selected.coverageAmount)} />
            <DetailRow label="Policy Term"            value={selected.policyTerm} />
            <DetailRow label="Claim Settlement Ratio" value={selected.claimSettlementRatio} />
            <DetailRow label="Tax Benefit"            value={selected.taxBenefit ? '✅ Yes (80C/80D)' : '✗ No'} />

            {selected.keyFeatures && (
              <div style={{ margin: '12px 0' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#a3aed0', fontWeight: 700 }}>KEY FEATURES</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selected.keyFeatures.split(',').map(f => f.trim()).filter(Boolean).map((f, i) => (
                    <span key={i} style={{ backgroundColor: '#f4f7fe', color: '#1b2559', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.riders && (
              <div style={{ margin: '12px 0' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#a3aed0', fontWeight: 700 }}>RIDERS / ADD-ONS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selected.riders.split(',').map(r => r.trim()).filter(Boolean).map((r, i) => (
                    <span key={i} style={{ backgroundColor: '#ede9fe', color: '#6366f1', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>+ {r}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Type-specific details */}
            <TypeDetails p={selected} />

            {/* Modal footer */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button
                onClick={() => shareOnWhatsApp(selected)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#25d366', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              >
                📲 Share on WhatsApp
              </button>
              <button
                onClick={() => setSelected(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #6366f1', color: '#6366f1', background: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

