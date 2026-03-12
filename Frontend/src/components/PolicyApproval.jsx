import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Eye, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { DocViewer } from './PolicyApprovalDocViewer';

const BASE = 'http://localhost:8080/api/applications';

const S = {
    card: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
    badge: (s) => {
        const map = {
            PENDING: { bg: '#fff9e6', color: '#ffb800' },
            APPROVED: { bg: '#e6fff5', color: '#01b574' },
            REJECTED: { bg: '#fff0f0', color: '#ee5d50' },
            UNDER_REVIEW: { bg: '#ede9fe', color: '#4318ff' },
        };
        const m = map[s] || { bg: '#f4f7fe', color: '#a3aed0' };
        return { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, backgroundColor: m.bg, color: m.color };
    },
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { backgroundColor: 'white', borderRadius: '20px', width: '640px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.22)' },
    input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e9edf7', outline: 'none', fontSize: '14px', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans',sans-serif" },
    btn: (c, outline) => ({ padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', border: outline ? `1px solid ${c}` : 'none', backgroundColor: outline ? 'transparent' : c, color: outline ? c : 'white', fontFamily: "'Plus Jakarta Sans',sans-serif" }),
};

const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f4f7fe' }}>
        <span style={{ fontSize: '12px', color: '#a3aed0', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#1b2559', fontWeight: 700 }}>{value || '—'}</span>
    </div>
);

export default function PolicyApproval() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [selected, setSelected] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [toast, setToast] = useState('');
    const [saving, setSaving] = useState(false);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const fetchApps = async () => {
        setLoading(true);
        try {
            const res = await axios.get(BASE);
            const data = res.data;
            setApps(Array.isArray(data) ? data : (data.content ?? []));
        } catch { showToast('❌ Failed to load applications'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchApps(); }, []);

    const updateStatus = async (id, status) => {
        setSaving(true);
        try {
            await axios.put(`${BASE}/${id}/status`, { status, adminRemarks: adminNote });
            showToast(status === 'APPROVED' ? '✅ Application Approved!' : status === 'REJECTED' ? '❌ Application Rejected' : '🔄 Status Updated');
            setSelected(null);
            setAdminNote('');
            fetchApps();
        } catch { showToast('❌ Failed to update status'); }
        finally { setSaving(false); }
    };

    const counts = {
        ALL: apps.length,
        PENDING: apps.filter(a => a.status === 'PENDING').length,
        UNDER_REVIEW: apps.filter(a => a.status === 'UNDER_REVIEW').length,
        APPROVED: apps.filter(a => a.status === 'APPROVED').length,
        REJECTED: apps.filter(a => a.status === 'REJECTED').length,
    };

    const filtered = apps.filter(a => {
        const q = search.toLowerCase();
        const matchSearch = a.applicantName?.toLowerCase().includes(q) ||
            a.applicationNumber?.toLowerCase().includes(q) ||
            a.policyName?.toLowerCase().includes(q);
        const matchFilter = filter === 'ALL' || a.status === filter;
        return matchSearch && matchFilter;
    });

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

            {toast && (
                <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 999, backgroundColor: '#1b2559', color: 'white', padding: '12px 22px', borderRadius: '12px', fontWeight: 600, fontSize: '14px' }}>
                    {toast}
                </div>
            )}

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                {[
                    ['Pending', counts.PENDING, '#fff9e6', '#ffb800', <Clock size={18} />],
                    ['Under Review', counts.UNDER_REVIEW, '#ede9fe', '#4318ff', <Eye size={18} />],
                    ['Approved', counts.APPROVED, '#e6fff5', '#01b574', <CheckCircle size={18} />],
                    ['Rejected', counts.REJECTED, '#fff0f0', '#ee5d50', <XCircle size={18} />],
                ].map(([label, count, bg, color, icon], i) => (
                    <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '14px', padding: '18px 20px', cursor: 'pointer', border: filter === label.replace(' ', '_').toUpperCase() ? `2px solid ${color}` : '2px solid transparent' }}
                        onClick={() => setFilter(filter === label.replace(' ', '_').toUpperCase() ? 'ALL' : label.replace(' ', '_').toUpperCase())}>
                        <div style={{ backgroundColor: bg, color, padding: '10px', borderRadius: '10px' }}>{icon}</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '11px', color: '#a3aed0', fontWeight: 700 }}>{label.toUpperCase()}</p>
                            <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1b2559' }}>{count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, color: '#1b2559', fontWeight: 800 }}>Policy Applications</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f4f7fe', borderRadius: '10px', padding: '8px 14px' }}>
                            <Search size={14} color="#a3aed0" />
                            <input placeholder="Search applicant or policy..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '200px', fontFamily: "'Plus Jakarta Sans',sans-serif" }} />
                        </div>
                        <select value={filter} onChange={e => setFilter(e.target.value)}
                            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e9edf7', outline: 'none', fontSize: '13px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                            {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(s => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#a3aed0', padding: '40px' }}>⏳ Loading applications...</p>
                ) : filtered.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#a3aed0', padding: '40px' }}>No applications found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#a3aed0', fontSize: '11px', fontWeight: 700, borderBottom: '1px solid #f4f7fe', letterSpacing: '0.5px' }}>
                                    {['APP NO.', 'APPLICANT', 'POLICY', 'PREMIUM', 'APPLIED ON', 'STATUS', 'ACTION'].map(h => (
                                        <th key={h} style={{ padding: '10px 8px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(a => (
                                    <tr key={a.id} style={{ borderBottom: '1px solid #f4f7fe', fontSize: '13px' }}>
                                        <td style={{ padding: '14px 8px', fontWeight: 700, color: '#4318ff' }}>{a.applicationNumber}</td>
                                        <td style={{ padding: '14px 8px' }}>
                                            <p style={{ margin: 0, fontWeight: 700, color: '#1b2559' }}>{a.applicantName}</p>
                                            <span style={{ fontSize: '11px', color: '#a3aed0' }}>{a.applicantEmail}</span>
                                        </td>
                                        <td style={{ padding: '14px 8px' }}>
                                            <p style={{ margin: 0, fontWeight: 600, color: '#1b2559' }}>{a.policyName}</p>
                                            <span style={{ fontSize: '11px', color: '#a3aed0' }}>{a.policyType}</span>
                                        </td>
                                        <td style={{ padding: '14px 8px', fontWeight: 700, color: '#4318ff' }}>
                                            ₹{a.premiumAmount?.toLocaleString('en-IN')}<span style={{ fontSize: '11px', color: '#a3aed0', fontWeight: 400 }}>/{a.premiumFrequency?.toLowerCase()}</span>
                                        </td>
                                        <td style={{ padding: '14px 8px', color: '#64748b' }}>{fmtDate(a.appliedAt)}</td>
                                        <td style={{ padding: '14px 8px' }}><span style={S.badge(a.status)}>● {a.status?.replace('_', ' ')}</span></td>
                                        <td style={{ padding: '14px 8px' }}>
                                            <button onClick={() => { setSelected(a); setAdminNote(a.adminRemarks || ''); }}
                                                style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #4318ff', color: '#4318ff', background: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selected && (
                <div style={S.overlay} onClick={() => setSelected(null)}>
                    <div style={S.modal} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#4318ff', fontWeight: 800 }}>{selected.applicationNumber}</p>
                                <h2 style={{ margin: 0, color: '#1b2559', fontSize: '18px', fontWeight: 800 }}>Review Application</h2>
                            </div>
                            <span style={S.badge(selected.status)}>● {selected.status?.replace('_', ' ')}</span>
                        </div>

                        <p style={{ margin: '0 0 10px', fontWeight: 800, fontSize: '11px', color: '#4318ff', letterSpacing: '1px' }}>APPLICANT DETAILS</p>
                        <Row label="Full Name" value={selected.applicantName} />
                        <Row label="Email" value={selected.applicantEmail} />
                        <Row label="Phone" value={selected.applicantPhone} />
                        <Row label="Date of Birth" value={selected.applicantDob} />
                        <Row label="Address" value={selected.applicantAddress} />
                        <Row label="Nominee" value={selected.nomineeName} />
                        <Row label="Nominee Relation" value={selected.nomineeRelation} />
                        {selected.remarks && <Row label="Customer Remarks" value={selected.remarks} />}

                        <p style={{ margin: '18px 0 10px', fontWeight: 800, fontSize: '11px', color: '#4318ff', letterSpacing: '1px' }}>POLICY DETAILS</p>
                        <Row label="Policy Name" value={selected.policyName} />
                        <Row label="Policy Number" value={selected.policyNumber} />
                        <Row label="Type" value={selected.policyType} />
                        <Row label="Company" value={selected.company} />
                        <Row label="Premium" value={`₹${selected.premiumAmount?.toLocaleString('en-IN')} / ${selected.premiumFrequency?.toLowerCase()}`} />
                        <Row label="Coverage" value={`₹${selected.coverageAmount?.toLocaleString('en-IN')}`} />
                        <Row label="Applied On" value={selected.appliedAt ? new Date(selected.appliedAt).toLocaleString('en-IN') : '—'} />
                        <p style={{ margin: '18px 0 10px', fontWeight: 800, fontSize: '11px', color: '#4318ff', letterSpacing: '1px' }}>
                            UPLOADED DOCUMENTS
                        </p>
                        <DocViewer applicationId={selected?.id} />

                        <div style={{ marginTop: '20px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 700, color: '#a3aed0', display: 'block', marginBottom: '6px' }}>ADMIN REMARKS (optional)</label>
                            <textarea
                                value={adminNote}
                                onChange={e => setAdminNote(e.target.value)}
                                rows={3}
                                placeholder="Add a note for the customer..."
                                style={{ ...S.input, resize: 'vertical' }}
                            />
                        </div>

                        {selected.status === 'PENDING' || selected.status === 'UNDER_REVIEW' ? (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button onClick={() => updateStatus(selected.id, 'REJECTED')} disabled={saving}
                                    style={{ ...S.btn('#ee5d50', true), flex: 1 }}>✕ Reject</button>
                                <button onClick={() => updateStatus(selected.id, 'UNDER_REVIEW')} disabled={saving}
                                    style={{ ...S.btn('#4318ff', true), flex: 1 }}>👁 Mark Under Review</button>
                                <button onClick={() => updateStatus(selected.id, 'APPROVED')} disabled={saving}
                                    style={{ ...S.btn('#01b574'), flex: 2 }}>✓ Approve & Issue Policy</button>
                            </div>
                        ) : (
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                {selected.status === 'APPROVED' && (
                                    <button onClick={() => updateStatus(selected.id, 'REJECTED')} disabled={saving}
                                        style={{ ...S.btn('#ee5d50', true), flex: 1 }}>Revoke Approval</button>
                                )}
                                <button onClick={() => setSelected(null)} style={{ ...S.btn('#4318ff', true), flex: 1 }}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

