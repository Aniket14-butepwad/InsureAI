import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import axios from 'axios';

const APPS_URL = 'http://localhost:8080/api/applications';

const TYPE_EMOJI = {
  HEALTH:      '🏥',
  LIFE:        '🛡️',
  MOTOR:       '🚗',
  TWO_WHEELER: '🏍️',
  TRAVEL:      '✈️',
  HOME:        '🏠',
};

const STATUS_CONFIG = {
  PENDING:      { label: 'Pending Review',  className: 'badge pending'  },
  UNDER_REVIEW: { label: 'Under Review',    className: 'badge pending'  },
  APPROVED:     { label: 'Active',          className: 'status active'  },
  REJECTED:     { label: 'Rejected',        className: 'status warning' },
};

// ── Certificate generator ─────────────────────────────────────────────────
function generateCertificate(app) {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <title>Policy Certificate - ${app.applicationNumber}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Arial',sans-serif;background:white;color:#1a1a2e}
    .page{width:210mm;min-height:297mm;padding:18mm;position:relative}
    .header{background:linear-gradient(135deg,#0b1437 0%,#4318ff 100%);color:white;padding:30px 36px;border-radius:14px;margin-bottom:28px}
    .header h1{font-size:26px;font-weight:900;letter-spacing:3px}.header h1 span{color:#6ad2ff}
    .header p{font-size:12px;opacity:.75;margin-top:5px}
    .cert-title{text-align:center;margin:20px 0}
    .cert-title h2{font-size:20px;color:#1b2559;font-weight:800;text-transform:uppercase;letter-spacing:4px}
    .divider{height:3px;background:linear-gradient(90deg,#4318ff,#6ad2ff);border-radius:2px;margin:10px auto;width:100px}
    .app-no{text-align:center;background:#f4f7fe;border-radius:8px;padding:10px;margin-bottom:22px;font-size:12px;color:#a3aed0}
    .app-no strong{color:#4318ff;font-size:14px}
    .approved-box{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #10b981;border-radius:12px;padding:14px 18px;text-align:center;margin:20px 0}
    .al{font-size:11px;color:#10b981;font-weight:800;letter-spacing:1px}
    .av{font-size:18px;color:#065f46;font-weight:900;margin-top:3px}
    .sec h3{font-size:10px;font-weight:800;color:#4318ff;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #e9edf7;margin-top:18px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .field{background:#f8fafc;padding:10px 13px;border-radius:8px}
    .fl{font-size:10px;color:#a3aed0;font-weight:700;text-transform:uppercase}
    .fv{font-size:13px;color:#1b2559;font-weight:700;margin-top:2px}
    .full{grid-column:span 2}
    .footer{border-top:2px solid #f4f7fe;padding-top:18px;margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .sig{text-align:center}.sig-line{height:1px;background:#1b2559;margin:36px 0 7px}
    .sig-lbl{font-size:10px;color:#a3aed0;font-weight:600}
    .disc{font-size:9px;color:#a3aed0;margin-top:14px;line-height:1.6;text-align:center;grid-column:span 2}
    .wm{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);font-size:72px;font-weight:900;color:rgba(67,24,255,.04);pointer-events:none;white-space:nowrap}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="wm">INSUREAI</div>
  <div class="page">
    <div class="header"><h1>INSURE<span>AI</span></h1><p>AI-Powered Insurance Management Platform · India</p></div>
    <div class="cert-title"><h2>Insurance Policy Certificate</h2><div class="divider"></div></div>
    <div class="app-no">Reference: <strong>${app.applicationNumber}</strong></div>
    <div class="approved-box"><div class="al">POLICY STATUS</div><div class="av">✓ APPROVED &amp; ACTIVE</div></div>
    <div class="sec"><h3>Policyholder Details</h3>
      <div class="grid">
        <div class="field"><div class="fl">Full Name</div><div class="fv">${app.applicantName}</div></div>
        <div class="field"><div class="fl">Email</div><div class="fv">${app.applicantEmail}</div></div>
        <div class="field"><div class="fl">Mobile</div><div class="fv">${app.applicantPhone||'—'}</div></div>
        <div class="field"><div class="fl">Date of Birth</div><div class="fv">${app.applicantDob||'—'}</div></div>
        <div class="field full"><div class="fl">Address</div><div class="fv">${app.applicantAddress||'—'}</div></div>
        <div class="field"><div class="fl">Nominee</div><div class="fv">${app.nomineeName||'—'}</div></div>
        <div class="field"><div class="fl">Relationship</div><div class="fv">${app.nomineeRelation||'—'}</div></div>
      </div>
    </div>
    <div class="sec"><h3>Policy Details</h3>
      <div class="grid">
        <div class="field"><div class="fl">Policy Name</div><div class="fv">${app.policyName}</div></div>
        <div class="field"><div class="fl">Policy Number</div><div class="fv">${app.policyNumber}</div></div>
        <div class="field"><div class="fl">Type</div><div class="fv">${app.policyType}</div></div>
        <div class="field"><div class="fl">Insurer</div><div class="fv">${app.company}</div></div>
        <div class="field"><div class="fl">Premium</div><div class="fv">Rs. ${Number(app.premiumAmount).toLocaleString('en-IN')} / ${app.premiumFrequency?.toLowerCase()}</div></div>
        <div class="field"><div class="fl">Sum Insured</div><div class="fv">Rs. ${Number(app.coverageAmount).toLocaleString('en-IN')}</div></div>
        <div class="field"><div class="fl">Applied On</div><div class="fv">${new Date(app.appliedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div></div>
        <div class="field"><div class="fl">Approved On</div><div class="fv">${new Date(app.updatedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div></div>
      </div>
    </div>
    <div class="footer">
      <div class="sig"><div class="sig-line"></div><div class="sig-lbl">Authorized Signatory — InsureAI</div></div>
      <div class="sig"><div class="sig-line"></div><div class="sig-lbl">Policyholder Signature</div></div>
      <p class="disc">Computer-generated certificate valid without physical signature. For claims: support@insureai.in · IRDAI Reg: InsureAI-2026</p>
    </div>
  </div>
  <script>window.onload=()=>window.print()</script>
  </body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const w   = window.open(url, '_blank');
  if (w) w.focus();
}

// ── Expandable policy card ────────────────────────────────────────────────
function PolicyCard({ app }) {
  const [open, setOpen] = useState(false);
  const sc = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING;
  const emoji = TYPE_EMOJI[app.policyType] || '📄';

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="policy-card glass" style={{ marginBottom: '14px' }}>

      {/* ── Card top — always visible ── */}
      <div className="policy-top" style={{ cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>{emoji}</span>
          <div>
            <h3 style={{ margin: '0 0 4px' }}>{app.policyName}</h3>
            <p className="policy-id">
              {app.policyNumber} &nbsp;·&nbsp; {app.company} &nbsp;·&nbsp;
              <span style={{ color: '#a3aed0' }}>Applied {fmtDate(app.appliedAt)}</span>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span className={sc.className}>{sc.label}</span>
          {open ? <ChevronUp size={16} color="#a3aed0"/> : <ChevronDown size={16} color="#a3aed0"/>}
        </div>
      </div>

      {/* ── Quick info row ── */}
      <div className="policy-info">
        <div>
          <span>Coverage</span>
          <strong>₹{app.coverageAmount?.toLocaleString('en-IN')}</strong>
        </div>
        <div>
          <span>Premium</span>
          <strong>₹{app.premiumAmount?.toLocaleString('en-IN')}<span style={{ fontWeight: 400, fontSize: '11px', color: '#a3aed0' }}>/{app.premiumFrequency?.toLowerCase()}</span></strong>
        </div>
        <div>
          <span>Type</span>
          <strong>{app.policyType?.replace('_', ' ')}</strong>
        </div>
      </div>

      {/* ── Expandable detail panel ── */}
      <div style={{ maxHeight: open ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
        <div style={{ borderTop: '1px solid #f0f3fa', paddingTop: '16px', marginTop: '4px' }}>

          {/* Detail rows */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              ['Policy Number',  app.policyNumber],
              ['Insurance Type', app.policyType?.replace('_', '-')],
              ['Applicant',      app.applicantName],
              ['Mobile',         app.applicantPhone],
              ['Date of Birth',  app.applicantDob],
              ['Nominee',        app.nomineeName ? `${app.nomineeName} (${app.nomineeRelation})` : '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ background: '#f8fafc', padding: '10px 13px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#a3aed0', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#1b2559', fontWeight: 700 }}>{value || '—'}</p>
              </div>
            ))}
            <div style={{ background: '#f8fafc', padding: '10px 13px', borderRadius: '8px', gridColumn: 'span 2' }}>
              <p style={{ margin: '0 0 2px', fontSize: '10px', color: '#a3aed0', fontWeight: 700, textTransform: 'uppercase' }}>Address</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#1b2559', fontWeight: 700 }}>{app.applicantAddress || '—'}</p>
            </div>
          </div>

          {/* Admin note */}
          {app.adminRemarks && (
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#0369a1', fontWeight: 700 }}>📝 Admin Note</p>
              <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#0c4a6e' }}>{app.adminRemarks}</p>
            </div>
          )}

          {/* Action row */}
          <div className="policy-actions">
            {app.status === 'APPROVED' && (
              <button className="primary-btn" onClick={() => generateCertificate(app)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={14}/> Download Certificate
              </button>
            )}
            {(app.status === 'PENDING' || app.status === 'UNDER_REVIEW') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '13px', fontWeight: 700 }}>
                <Clock size={14}/> Under review — we'll notify you soon
              </div>
            )}
            {app.status === 'REJECTED' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '13px', fontWeight: 700 }}>
                <XCircle size={14}/> Application rejected — contact your agent
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Policies component (drop-in replacement) ─────────────────────────
export default function Policies() {
  const [apps,    setApps]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    axios.get(`${APPS_URL}/user/${userId}`)
      .then(r => { const d = r.data; setApps(Array.isArray(d) ? d : (d.content ?? [])); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    ALL:      apps.length,
    APPROVED: apps.filter(a => a.status === 'APPROVED').length,
    PENDING:  apps.filter(a => a.status === 'PENDING' || a.status === 'UNDER_REVIEW').length,
    REJECTED: apps.filter(a => a.status === 'REJECTED').length,
  };

  const filtered = filter === 'ALL' ? apps
    : filter === 'PENDING' ? apps.filter(a => a.status === 'PENDING' || a.status === 'UNDER_REVIEW')
    : apps.filter(a => a.status === filter);

  const FILTERS = [
    ['ALL',      'All',        counts.ALL],
    ['APPROVED', 'Active',     counts.APPROVED],
    ['PENDING',  'In Review',  counts.PENDING],
    ['REJECTED', 'Rejected',   counts.REJECTED],
  ];

  return (
    <div className="page-wrap">
      <h2 className="page-title">Your Policies</h2>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '7px 16px', borderRadius: '20px', border: '1.5px solid',
              borderColor: filter === key ? 'var(--primary, #4318ff)' : '#e2e8f0',
              backgroundColor: filter === key ? 'var(--primary, #4318ff)' : 'white',
              color: filter === key ? 'white' : '#64748b',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {label} <span style={{ opacity: 0.8 }}>({count})</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#a3aed0' }}>
          ⏳ Loading your policies...
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="recommend-card glass" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛡️</div>
          <h3>{filter === 'ALL' ? 'No policies yet' : `No ${filter.toLowerCase()} policies`}</h3>
          <p style={{ color: '#a3aed0', margin: '6px 0 0', fontSize: '13px' }}>
            {filter === 'ALL'
              ? 'Contact your agent or browse plans to apply for insurance.'
              : 'Try a different filter above.'}
          </p>
        </div>
      )}

      {/* Policy cards */}
      {!loading && filtered.length > 0 && (
        <div className="policy-grid" style={{ gridTemplateColumns: '1fr' }}>
          {filtered.map(app => <PolicyCard key={app.id} app={app} />)}
        </div>
      )}
    </div>
  );
}
