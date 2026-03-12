// ── Drop this DocViewer section INTO your existing PolicyApproval.jsx ──────
// Add this import at the top of PolicyApproval.jsx:
//   import { FileText, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
//
// Add this component ABOVE the export default in PolicyApproval.jsx:

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, XCircle, Eye } from 'lucide-react';

const DOC_API = 'http://localhost:8080/api/documents';

const DOC_STATUS = {
  PENDING_REVIEW: { label:'Pending', bg:'#fff9e6', color:'#ffb800' },
  VERIFIED:       { label:'Verified', bg:'#e6fff5', color:'#01b574' },
  REJECTED:       { label:'Rejected', bg:'#fff0f0', color:'#ee5d50' },
};

export function DocViewer({ applicationId }) {
  const [docs,   setDocs]   = useState([]);
  const [loading,setLoading]= useState(true);
  const [saving, setSaving] = useState(null); // docId being updated

  useEffect(() => {
    if (!applicationId) return;
    axios.get(`${DOC_API}/application/${applicationId}`)
      .then(r => setDocs(Array.isArray(r.data) ? r.data : []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [applicationId]);

  const updateStatus = async (docId, status) => {
    setSaving(docId);
    try {
      const res = await axios.put(`${DOC_API}/${docId}/status`, { status });
      setDocs(prev => prev.map(d => d.id === docId ? res.data : d));
    } catch { /* silent */ }
    finally { setSaving(null); }
  };

  if (loading) return <p style={{ color:'#a3aed0', fontSize:'13px', padding:'8px 0' }}>⏳ Loading documents...</p>;
  if (docs.length === 0) return (
    <div style={{ backgroundColor:'#f8fafc', borderRadius:'10px', padding:'16px', textAlign:'center' }}>
      <p style={{ margin:0, color:'#a3aed0', fontSize:'13px' }}>📂 No documents uploaded yet</p>
    </div>
  );

  // Group by category
  const idDocs   = docs.filter(d => d.category === 'ID_PROOF');
  const insDocs  = docs.filter(d => d.category === 'INSURANCE_SPECIFIC');

  const DocCard = ({ doc }) => {
    const sc = DOC_STATUS[doc.status] || DOC_STATUS.PENDING_REVIEW;
    return (
      <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', border:'1px solid #e9edf7', marginBottom:'8px', backgroundColor:'white', flexWrap:'wrap' }}>
        <FileText size={15} color="#a3aed0" style={{ flexShrink:0 }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontSize:'12px', fontWeight:700, color:'#1b2559' }}>
            {doc.documentType?.replace(/_/g,' ')}
          </p>
          <p style={{ margin:'1px 0 0', fontSize:'11px', color:'#a3aed0' }}>
            {doc.originalFileName} · {Math.round(doc.fileSize/1024)} KB
          </p>
        </div>
        <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'10px', fontWeight:700, backgroundColor:sc.bg, color:sc.color, flexShrink:0 }}>
          {sc.label}
        </span>
        <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
          <a href={`${DOC_API}/${doc.id}/view`} target="_blank" rel="noreferrer"
            style={{ padding:'5px 10px', borderRadius:'7px', border:'1px solid #4318ff', color:'#4318ff', fontSize:'11px', fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:'4px' }}>
            <Eye size={11}/> View
          </a>
          {doc.status !== 'VERIFIED' && (
            <button onClick={() => updateStatus(doc.id, 'VERIFIED')} disabled={saving===doc.id}
              style={{ padding:'5px 10px', borderRadius:'7px', border:'none', backgroundColor:'#01b574', color:'white', fontSize:'11px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              ✓ Verify
            </button>
          )}
          {doc.status !== 'REJECTED' && (
            <button onClick={() => updateStatus(doc.id, 'REJECTED')} disabled={saving===doc.id}
              style={{ padding:'5px 10px', borderRadius:'7px', border:'none', backgroundColor:'#fff0f0', color:'#ee5d50', fontSize:'11px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              ✕ Reject
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {idDocs.length > 0 && (
        <div style={{ marginBottom:'14px' }}>
          <p style={{ margin:'0 0 8px', fontSize:'11px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>🪪 IDENTITY PROOF</p>
          {idDocs.map(d => <DocCard key={d.id} doc={d}/>)}
        </div>
      )}
      {insDocs.length > 0 && (
        <div>
          <p style={{ margin:'0 0 8px', fontSize:'11px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>📄 INSURANCE DOCUMENTS</p>
          {insDocs.map(d => <DocCard key={d.id} doc={d}/>)}
        </div>
      )}
      <div style={{ backgroundColor:'#f8fafc', borderRadius:'8px', padding:'8px 12px', marginTop:'8px', display:'flex', gap:'16px' }}>
        <span style={{ fontSize:'11px', color:'#a3aed0' }}>Total: <strong style={{ color:'#1b2559' }}>{docs.length}</strong></span>
        <span style={{ fontSize:'11px', color:'#01b574' }}>✓ Verified: <strong>{docs.filter(d=>d.status==='VERIFIED').length}</strong></span>
        <span style={{ fontSize:'11px', color:'#ee5d50' }}>✕ Rejected: <strong>{docs.filter(d=>d.status==='REJECTED').length}</strong></span>
        <span style={{ fontSize:'11px', color:'#ffb800' }}>⏳ Pending: <strong>{docs.filter(d=>d.status==='PENDING_REVIEW').length}</strong></span>
      </div>
    </div>
  );
}