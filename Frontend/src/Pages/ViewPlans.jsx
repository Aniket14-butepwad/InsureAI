import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search, X, Upload, CheckCircle, AlertCircle, FileText,
  Eye, ChevronRight, ArrowLeft, Shield, Star, BadgeCheck,
  Building2, TrendingUp, Clock, IndianRupee
} from 'lucide-react';

const API    = 'http://localhost:8080/api';
const MAX_KB = 300;

// ── Type config ───────────────────────────────────────────────────────────
const TYPE_CFG = {
  HEALTH:      { emoji:'🏥', color:'#10b981', bg:'#ecfdf5', label:'Health'       },
  LIFE:        { emoji:'🛡️', color:'#6366f1', bg:'#eef2ff', label:'Life'         },
  MOTOR:       { emoji:'🚗', color:'#f59e0b', bg:'#fffbeb', label:'Motor'        },
  TWO_WHEELER: { emoji:'🏍️', color:'#ef4444', bg:'#fef2f2', label:'Two-Wheeler'  },
  TRAVEL:      { emoji:'✈️', color:'#0ea5e9', bg:'#f0f9ff', label:'Travel'       },
  HOME:        { emoji:'🏠', color:'#d97706', bg:'#fef9ef', label:'Home'         },
};

// ── Required docs per type ────────────────────────────────────────────────
const REQUIRED_DOCS = {
  HEALTH: { insuranceDocs: [
    { type:'MEDICAL_REPORT',    label:'Medical Report',        hint:'Recent health checkup (within 6 months)', required:true  },
    { type:'BLOOD_TEST',        label:'Blood Test Report',     hint:'CBC, Blood Sugar, Lipid Profile',         required:true  },
    { type:'ECG',               label:'ECG Report',            hint:'Required for age 45+',                    required:false },
    { type:'PRESCRIPTION',      label:'Current Prescriptions', hint:'If any ongoing medication',               required:false },
    { type:'DISCHARGE_SUMMARY', label:'Discharge Summary',     hint:'If hospitalized in last 2 years',         required:false },
  ]},
  LIFE: { insuranceDocs: [
    { type:'MEDICAL_REPORT', label:'Medical Examination Report', hint:'From IRDAI-approved doctor',     required:true  },
    { type:'BLOOD_TEST',     label:'Blood Test Report',          hint:'HIV, Blood Sugar, Lipid Panel',  required:true  },
    { type:'ECG',            label:'ECG Report',                 hint:'For sum assured above 50 Lakh',  required:false },
    { type:'INCOME_PROOF',   label:'Income Proof',               hint:'Latest 2 salary slips or ITR',  required:true  },
  ]},
  MOTOR: { insuranceDocs: [
    { type:'RC_BOOK',            label:'RC Book',                    hint:'Original RC or smart card scan', required:true  },
    { type:'DRIVING_LICENSE',    label:'Driving License',            hint:'Valid & non-expired DL',         required:true  },
    { type:'PUC_CERTIFICATE',    label:'PUC Certificate',            hint:'Valid Pollution Under Control',  required:true  },
    { type:'VEHICLE_INSPECTION', label:'Vehicle Inspection Report',  hint:'For vehicles older than 5 years',required:false },
  ]},
  TWO_WHEELER: { insuranceDocs: [
    { type:'RC_BOOK',         label:'RC Book',         hint:'Vehicle registration certificate', required:true },
    { type:'DRIVING_LICENSE', label:'Driving License', hint:'Valid 2-wheeler category DL',      required:true },
    { type:'PUC_CERTIFICATE', label:'PUC Certificate', hint:'Valid pollution certificate',      required:true },
  ]},
  TRAVEL: { insuranceDocs: [
    { type:'TRAVEL_ITINERARY',   label:'Travel Itinerary',         hint:'Flight/train booking confirmation', required:true  },
    { type:'VISA_COPY',          label:'Visa Copy',                hint:'For international destinations',   required:false },
    { type:'PREVIOUS_INSURANCE', label:'Previous Travel Insurance',hint:'If claiming renewal discount',     required:false },
  ]},
  HOME: { insuranceDocs: [
    { type:'PROPERTY_DOCUMENTS', label:'Property Documents',        hint:'Sale deed / ownership proof', required:true  },
    { type:'SALE_DEED',          label:'Sale Deed / Agreement',     hint:'Registered sale deed copy',   required:true  },
    { type:'NOC',                label:'NOC from Society',          hint:'No Objection Certificate',    required:false },
    { type:'VALUATION_REPORT',   label:'Property Valuation Report', hint:'From certified valuer',       required:false },
  ]},
};

const ID_TYPES = [
  { type:'AADHAAR',         label:'Aadhaar Card'   },
  { type:'PAN',             label:'PAN Card'        },
  { type:'PASSPORT',        label:'Passport'        },
  { type:'VOTER_ID',        label:'Voter ID'        },
  { type:'DRIVING_LICENSE', label:'Driving License' },
];

// ── Shared styles ─────────────────────────────────────────────────────────
const S = {
  input:   { width:'100%', padding:'10px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', outline:'none', fontSize:'14px', boxSizing:'border-box', fontFamily:"'Plus Jakarta Sans',sans-serif" },
  label:   { fontSize:'12px', fontWeight:700, color:'#64748b', marginBottom:'5px', display:'block' },
  btn:     (c,outline) => ({ padding:'10px 20px', borderRadius:'10px', fontWeight:700, fontSize:'13px', cursor:'pointer', border:outline?`1.5px solid ${c}`:'none', backgroundColor:outline?'transparent':c, color:outline?c:'white', fontFamily:"'Plus Jakarta Sans',sans-serif", transition:'opacity 0.2s' }),
  stepDot: (active,done) => ({ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'11px', backgroundColor:done?'#10b981':active?'#4318ff':'#f1f5f9', color:done||active?'white':'#94a3b8', flexShrink:0, transition:'all 0.3s' }),
  docRow:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', marginBottom:'8px', gap:'10px', flexWrap:'wrap', backgroundColor:'white' },
  upBtn:   (done) => ({ padding:'6px 13px', borderRadius:'8px', border:`1px dashed ${done?'#10b981':'#4318ff'}`, backgroundColor:done?'#ecfdf5':'#f5f3ff', color:done?'#10b981':'#4318ff', fontWeight:700, fontSize:'11px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', whiteSpace:'nowrap', fontFamily:"'Plus Jakarta Sans',sans-serif" }),
};

// ── Doc upload row ────────────────────────────────────────────────────────
function DocRow({ doc, applicationId, userId, category, uploaded, onUploaded, onRemove }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState('');

  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return; setErr('');
    if (file.size > MAX_KB*1024) { setErr(`Max ${MAX_KB}KB. Yours: ${Math.round(file.size/1024)}KB`); e.target.value=''; return; }
    if (!['image/jpeg','image/jpg','image/png','application/pdf'].includes(file.type)) { setErr('Only JPG, PNG or PDF'); e.target.value=''; return; }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('applicationId', applicationId);
      fd.append('userId',        userId);
      fd.append('documentType',  doc.type);
      fd.append('category',      category);
      fd.append('file',          file);
      const res = await axios.post(`${API}/documents/upload`, fd, { headers:{ 'Content-Type':'multipart/form-data' } });
      onUploaded(doc.type, res.data);
    } catch(ex) { setErr(ex?.response?.data?.error||'Upload failed'); }
    finally { setBusy(false); e.target.value=''; }
  };

  return (
    <div>
      <div style={S.docRow}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:'#1e293b', fontSize:'13px', display:'flex', alignItems:'center', gap:'5px' }}>
            {uploaded ? <CheckCircle size={12} color="#10b981"/> : <FileText size={12} color="#94a3b8"/>}
            {doc.label}
            {doc.required && <span style={{ color:'#ef4444', fontSize:'10px' }}>*</span>}
          </div>
          <p style={{ margin:'2px 0 0', fontSize:'11px', color:'#94a3b8' }}>{doc.hint}</p>
          {uploaded && <p style={{ margin:'2px 0 0', fontSize:'11px', color:'#10b981', fontWeight:600 }}>✓ {uploaded.originalFileName} ({Math.round(uploaded.fileSize/1024)}KB)</p>}
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {uploaded ? (
            <>
              <a href={`${API}/documents/${uploaded.id}/view`} target="_blank" rel="noreferrer"
                style={{ ...S.upBtn(true), textDecoration:'none' }}><Eye size={11}/> View</a>
              <button onClick={() => onRemove(doc.type)} style={{ border:'none', background:'none', cursor:'pointer', color:'#ef4444', padding:'4px' }}><X size={13}/></button>
            </>
          ) : (
            <>
              <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display:'none' }} onChange={handle}/>
              <button style={S.upBtn(false)} onClick={() => ref.current.click()} disabled={busy}>
                {busy ? '⏳' : <><Upload size={11}/> Upload</>}
              </button>
            </>
          )}
        </div>
      </div>
      {err && <p style={{ margin:'-4px 0 6px', fontSize:'11px', color:'#ef4444', fontWeight:600 }}>⚠️ {err}</p>}
    </div>
  );
}

// ── Apply slide panel (Step 1 → 2 → 3) ───────────────────────────────────
function ApplyPanel({ policy, open, onClose, onSuccess }) {
  const [step,  setStep]  = useState(1);
  const [form,  setForm]  = useState({ applicantName:'', applicantEmail:'', applicantPhone:'', applicantDob:'', applicantAddress:'', nomineeName:'', nomineeRelation:'', remarks:'' });
  const [appId, setAppId] = useState(null);
  const [idType,setIdType]= useState('AADHAAR');
  const [docs,  setDocs]  = useState({});
  const [busy,  setBusy]  = useState(false);
  const [err,   setErr]   = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (open) {
      setStep(1); setDocs({}); setAppId(null); setErr('');
      setForm({ applicantName:localStorage.getItem('userName')||'', applicantEmail:localStorage.getItem('userEmail')||'', applicantPhone:'', applicantDob:'', applicantAddress:'', nomineeName:'', nomineeRelation:'', remarks:'' });
    }
  }, [open]);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const typeKey = policy?.policyType?.toUpperCase() || 'HEALTH';
  const docCfg  = REQUIRED_DOCS[typeKey] || REQUIRED_DOCS.HEALTH;
  const reqDocs = docCfg.insuranceDocs.filter(d => d.required);
  const hasId   = !!docs[idType];
  const doneReq = reqDocs.filter(d => !!docs[d.type]).length;
  const allDone = hasId && doneReq === reqDocs.length;
  const total   = Object.keys(docs).length;
  const needed  = 1 + reqDocs.length;
  const pct     = Math.min(100, Math.round((total/needed)*100));

  const handleStep1 = async () => {
    if (!form.applicantName||!form.applicantEmail||!form.applicantPhone||!form.applicantDob||!form.applicantAddress) { setErr('Please fill all required fields *'); return; }
    if (!userId) { setErr('You must be logged in to apply.'); return; }
    setErr(''); setBusy(true);
    try {
      const res = await axios.post(`${API}/applications`, { userId:Number(userId), policyId:policy.id, ...form });
      setAppId(res.data.id); setStep(2);
    } catch(ex) { setErr(ex?.response?.data||'Failed to save. Try again.'); }
    finally { setBusy(false); }
  };

  const STEPS = ['Personal Details','Upload Documents','Confirmation'];
  if (!policy) return null;

  return (
    <>
      {open && <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.4)', zIndex:60 }} onClick={onClose}/>}
      <div style={{ position:'fixed', top:0, right:0, width:'500px', maxWidth:'100vw', height:'100vh', backgroundColor:'white', zIndex:61, boxShadow:'-8px 0 40px rgba(0,0,0,0.18)', transform:open?'translateX(0)':'translateX(100%)', transition:'transform 0.35s cubic-bezier(0.4,0,0.2,1)', display:'flex', flexDirection:'column', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* Header */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid #f1f5f9', flexShrink:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <p style={{ margin:'0 0 2px', fontSize:'10px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>APPLICATION FORM</p>
              <h3 style={{ margin:0, fontSize:'15px', fontWeight:800, color:'#1e293b' }}>{policy.policyName}</h3>
              <p style={{ margin:'2px 0 0', fontSize:'11px', color:'#94a3b8' }}>{policy.company} · ₹{policy.premiumAmount?.toLocaleString('en-IN')}/{policy.premiumFrequency?.toLowerCase()}</p>
            </div>
            <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', color:'#94a3b8', padding:'4px' }}><X size={18}/></button>
          </div>
          {/* Steps */}
          <div style={{ display:'flex', alignItems:'center', marginTop:'14px' }}>
            {STEPS.map((label,i) => (
              <React.Fragment key={i}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
                  <div style={S.stepDot(step===i+1, step>i+1)}>{step>i+1?'✓':i+1}</div>
                  <span style={{ fontSize:'9px', fontWeight:700, color:step===i+1?'#4318ff':step>i+1?'#10b981':'#94a3b8', whiteSpace:'nowrap' }}>{label}</span>
                </div>
                {i<STEPS.length-1 && <div style={{ flex:1, height:'2px', backgroundColor:step>i+1?'#10b981':'#e2e8f0', margin:'0 4px', marginBottom:'16px' }}/>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 22px' }}>

          {/* Step 1 */}
          {step===1 && (
            <div>
              <p style={{ margin:'0 0 14px', fontSize:'10px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>PERSONAL DETAILS</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
                {[['applicantName','Full Name *','text'],['applicantEmail','Email *','email'],['applicantPhone','Mobile *','tel'],['applicantDob','DOB * (DD-MM-YYYY)','text']].map(([k,l,t]) => (
                  <div key={k}><label style={S.label}>{l}</label><input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} style={S.input}/></div>
                ))}
                <div style={{ gridColumn:'span 2' }}><label style={S.label}>Full Address *</label><textarea value={form.applicantAddress} onChange={e=>set('applicantAddress',e.target.value)} rows={2} style={{ ...S.input, resize:'vertical' }}/></div>
              </div>
              <p style={{ margin:'0 0 10px', fontSize:'10px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>NOMINEE DETAILS</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px' }}>
                {[['nomineeName','Nominee Name'],['nomineeRelation','Relationship']].map(([k,l]) => (
                  <div key={k}><label style={S.label}>{l}</label><input value={form[k]} onChange={e=>set(k,e.target.value)} style={S.input}/></div>
                ))}
              </div>
              <div><label style={S.label}>Additional Remarks</label><textarea value={form.remarks} onChange={e=>set('remarks',e.target.value)} rows={2} style={{ ...S.input, resize:'vertical' }} placeholder="Any conditions or notes..."/></div>
              {err && <p style={{ color:'#ef4444', fontSize:'12px', fontWeight:600, marginTop:'10px' }}>⚠️ {err}</p>}
            </div>
          )}

          {/* Step 2 */}
          {step===2 && appId && (
            <div>
              <div style={{ backgroundColor:'#f8fafc', borderRadius:'10px', padding:'12px', marginBottom:'14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div><p style={{ margin:0, fontWeight:800, color:'#1e293b', fontSize:'13px' }}>📎 Upload Documents</p><p style={{ margin:'2px 0 0', fontSize:'11px', color:'#94a3b8' }}>Max 300KB · JPG, PNG, PDF · * = mandatory</p></div>
                <div style={{ textAlign:'right' }}><p style={{ margin:0, fontSize:'20px', fontWeight:900, color:allDone?'#10b981':'#4318ff' }}>{total}/{needed}</p><p style={{ margin:0, fontSize:'10px', color:'#94a3b8' }}>uploaded</p></div>
              </div>
              <div style={{ height:'3px', backgroundColor:'#e2e8f0', borderRadius:'4px', marginBottom:'16px' }}>
                <div style={{ height:'100%', width:`${pct}%`, backgroundColor:allDone?'#10b981':'#4318ff', borderRadius:'4px', transition:'width 0.4s' }}/>
              </div>

              <p style={{ margin:'0 0 8px', fontSize:'10px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>① IDENTITY PROOF *</p>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px', flexWrap:'wrap' }}>
                <span style={{ fontSize:'11px', color:'#64748b', fontWeight:600 }}>Select:</span>
                <select value={idType} onChange={e=>setIdType(e.target.value)} style={{ padding:'6px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', outline:'none', fontSize:'12px', fontFamily:'inherit' }}>
                  {ID_TYPES.map(d => <option key={d.type} value={d.type}>{d.label}</option>)}
                </select>
              </div>
              <DocRow key={idType} doc={{ ...ID_TYPES.find(d=>d.type===idType), hint:'Clear scan, front & back', required:true }} applicationId={appId} userId={Number(userId)} category="ID_PROOF" uploaded={docs[idType]} onUploaded={(t,r)=>setDocs(p=>({...p,[t]:r}))} onRemove={t=>setDocs(p=>{const n={...p};delete n[t];return n;})}/>

              <p style={{ margin:'14px 0 8px', fontSize:'10px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>② {TYPE_CFG[typeKey]?.label?.toUpperCase()} DOCUMENTS</p>
              {docCfg.insuranceDocs.map(doc => (
                <DocRow key={doc.type} doc={doc} applicationId={appId} userId={Number(userId)} category="INSURANCE_SPECIFIC" uploaded={docs[doc.type]} onUploaded={(t,r)=>setDocs(p=>({...p,[t]:r}))} onRemove={t=>setDocs(p=>{const n={...p};delete n[t];return n;})}/>
              ))}

              <div style={{ borderRadius:'10px', padding:'11px 14px', backgroundColor:allDone?'#ecfdf5':'#fffbeb', border:`1px solid ${allDone?'#a7f3d0':'#fde68a'}`, display:'flex', alignItems:'center', gap:'8px', marginTop:'10px' }}>
                {allDone?<CheckCircle size={16} color="#10b981"/>:<AlertCircle size={16} color="#f59e0b"/>}
                <div>
                  <p style={{ margin:0, fontWeight:800, fontSize:'12px', color:allDone?'#065f46':'#92400e' }}>{allDone?'All required documents uploaded!':'Mandatory documents pending'}</p>
                  <p style={{ margin:0, fontSize:'11px', color:allDone?'#059669':'#b45309' }}>
                    {allDone?'You can proceed.':`Still needed: ${!hasId?'ID Proof':''}${!hasId&&doneReq<reqDocs.length?', ':''}${doneReq<reqDocs.length?`${reqDocs.length-doneReq} insurance doc(s)`:''}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step===3 && (
            <div>
              <div style={{ backgroundColor:'#ecfdf5', border:'1px solid #a7f3d0', borderRadius:'12px', padding:'16px', marginBottom:'18px', display:'flex', alignItems:'center', gap:'12px' }}>
                <span style={{ fontSize:'28px' }}>✅</span>
                <div><p style={{ margin:0, fontWeight:800, color:'#065f46' }}>Application Submitted!</p><p style={{ margin:'2px 0 0', fontSize:'12px', color:'#059669' }}>Admin will review your documents and approve shortly.</p></div>
              </div>
              {[['Policy',policy.policyName],['Company',policy.company],['Premium',`₹${policy.premiumAmount?.toLocaleString('en-IN')}/${policy.premiumFrequency?.toLowerCase()}`],['Coverage',`₹${policy.coverageAmount?.toLocaleString('en-IN')}`],['Applicant',form.applicantName],['Mobile',form.applicantPhone],['Nominee',form.nomineeName||'—'],['Documents',`${total} file(s) uploaded`]].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f1f5f9' }}>
                  <span style={{ fontSize:'12px', color:'#94a3b8', fontWeight:600 }}>{l}</span>
                  <span style={{ fontSize:'13px', color:'#1e293b', fontWeight:700 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 22px', borderTop:'1px solid #f1f5f9', display:'flex', gap:'8px', flexShrink:0 }}>
          {step===1 && <><button onClick={onClose} style={{ ...S.btn('#64748b',true), flex:1 }}>Cancel</button><button onClick={handleStep1} disabled={busy} style={{ ...S.btn('#4318ff'), flex:2, opacity:busy?0.7:1 }}>{busy?'Saving...':'Next: Upload Documents →'}</button></>}
          {step===2 && <><button onClick={()=>setStep(1)} style={S.btn('#64748b',true)}>← Back</button><button onClick={()=>setStep(3)} disabled={!allDone} style={{ ...S.btn('#4318ff'), flex:2, opacity:allDone?1:0.5 }}>Submit Application →</button><button onClick={()=>setStep(3)} style={{ ...S.btn('#94a3b8',true), fontSize:'11px' }}>Skip</button></>}
          {step===3 && <button onClick={()=>{onSuccess();onClose();}} style={{ ...S.btn('#4318ff'), flex:1 }}>Done</button>}
        </div>
      </div>
    </>
  );
}

// ── Full-screen policy detail overlay ────────────────────────────────────
function PolicyDetailOverlay({ policy, onClose, onApply, isApplied }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const tc      = TYPE_CFG[policy.policyType] || TYPE_CFG.HEALTH;
  const docCfg  = REQUIRED_DOCS[policy.policyType] || REQUIRED_DOCS.HEALTH;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const StatBox = ({ label, value, sub, accent }) => (
    <div style={{ backgroundColor:'white', borderRadius:'14px', padding:'18px 20px', border:'1px solid #f1f5f9', flex:1 }}>
      <p style={{ margin:'0 0 6px', fontSize:'11px', fontWeight:800, color:'#94a3b8', letterSpacing:'0.5px', textTransform:'uppercase' }}>{label}</p>
      <p style={{ margin:'0 0 2px', fontSize:'22px', fontWeight:900, color: accent||'#1e293b' }}>{value}</p>
      {sub && <p style={{ margin:0, fontSize:'11px', color:'#94a3b8' }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, backgroundColor:'#f8fafc', overflowY:'auto', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Top bar */}
      <div style={{ position:'sticky', top:0, backgroundColor:'white', borderBottom:'1px solid #e2e8f0', padding:'0 32px', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:10, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={onClose} style={{ display:'flex', alignItems:'center', gap:'7px', border:'none', background:'none', cursor:'pointer', fontWeight:700, fontSize:'14px', color:'#64748b', fontFamily:'inherit' }}>
          <ArrowLeft size={16}/> Back to Plans
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'11px', fontWeight:700, color:tc.color, backgroundColor:tc.bg, padding:'4px 12px', borderRadius:'20px' }}>{tc.emoji} {tc.label} Insurance</span>
        </div>
      </div>

      {/* Hero section */}
      <div style={{ background:`linear-gradient(135deg, ${tc.color}15 0%, ${tc.color}05 100%)`, borderBottom:'1px solid #e2e8f0', padding:'36px 32px 32px' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'18px', marginBottom:'24px' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'18px', backgroundColor:tc.bg, border:`2px solid ${tc.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', flexShrink:0 }}>
              {tc.emoji}
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ margin:'0 0 6px', fontSize:'26px', fontWeight:900, color:'#1e293b', lineHeight:1.2 }}>{policy.policyName}</h1>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                <span style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'14px', color:'#64748b', fontWeight:600 }}>
                  <Building2 size={14}/> {policy.company}
                </span>
                <span style={{ fontSize:'12px', color:'#94a3b8' }}>·</span>
                <span style={{ fontSize:'13px', color:'#64748b', fontWeight:600 }}>#{policy.policyNumber}</span>
                {policy.claimSettlementRatio && (
                  <>
                    <span style={{ fontSize:'12px', color:'#94a3b8' }}>·</span>
                    <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'13px', color:'#10b981', fontWeight:700 }}>
                      <BadgeCheck size={14}/> {policy.claimSettlementRatio} claim ratio
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stat boxes */}
          <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
            <StatBox label="Monthly / Annual Premium" value={`₹${policy.premiumAmount?.toLocaleString('en-IN')}`} sub={`per ${policy.premiumFrequency?.toLowerCase()}`} accent="#4318ff"/>
            <StatBox label="Sum Insured" value={`₹${policy.coverageAmount?.toLocaleString('en-IN')}`} sub="total coverage"/>
            {policy.claimSettlementRatio && <StatBox label="Claim Settlement" value={policy.claimSettlementRatio} sub="industry leading" accent="#10b981"/>}
            {policy.taxBenefit && <StatBox label="Tax Benefit" value="Yes" sub="Under 80C / 80D" accent="#f59e0b"/>}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'24px' }}>

          {/* Left column */}
          <div style={{ display:'flex', flexDirection:'column', gap:'22px' }}>

            {/* About */}
            {policy.description && (
              <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'22px', border:'1px solid #f1f5f9' }}>
                <h3 style={{ margin:'0 0 12px', fontSize:'14px', fontWeight:800, color:'#1e293b' }}>About this Plan</h3>
                <p style={{ margin:0, fontSize:'14px', color:'#64748b', lineHeight:1.8 }}>{policy.description}</p>
              </div>
            )}

            {/* Policy details table */}
            <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'22px', border:'1px solid #f1f5f9' }}>
              <h3 style={{ margin:'0 0 16px', fontSize:'14px', fontWeight:800, color:'#1e293b' }}>Policy Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
                {[
                  ['Policy Number',     policy.policyNumber],
                  ['Insurance Type',    policy.policyType?.replace('_',' ')],
                  ['Company',          policy.company],
                  ['Premium Amount',   `₹${policy.premiumAmount?.toLocaleString('en-IN')} / ${policy.premiumFrequency?.toLowerCase()}`],
                  ['Coverage Amount',  `₹${policy.coverageAmount?.toLocaleString('en-IN')}`],
                  ['Tax Benefit',      policy.taxBenefit ? '✅ Yes (80C/80D)' : '❌ No'],
                  ['Claim Settlement', policy.claimSettlementRatio || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #f8fafc' }}>
                    <span style={{ fontSize:'13px', color:'#64748b', fontWeight:600 }}>{label}</span>
                    <span style={{ fontSize:'13px', color:'#1e293b', fontWeight:700 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required documents */}
            <div style={{ backgroundColor:'white', borderRadius:'16px', padding:'22px', border:'1px solid #f1f5f9' }}>
              <h3 style={{ margin:'0 0 4px', fontSize:'14px', fontWeight:800, color:'#1e293b' }}>Documents Required to Apply</h3>
              <p style={{ margin:'0 0 16px', fontSize:'12px', color:'#94a3b8' }}>You will need to upload these when applying</p>

              <p style={{ margin:'0 0 8px', fontSize:'11px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>🪪 IDENTITY PROOF (any one)</p>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
                {ID_TYPES.map(d => (
                  <span key={d.type} style={{ padding:'5px 12px', borderRadius:'20px', backgroundColor:'#f1f5f9', color:'#64748b', fontSize:'12px', fontWeight:600 }}>{d.label}</span>
                ))}
              </div>

              <p style={{ margin:'0 0 8px', fontSize:'11px', fontWeight:800, color:'#4318ff', letterSpacing:'1px' }}>📄 {tc.label.toUpperCase()} SPECIFIC DOCUMENTS</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {docCfg.insuranceDocs.map(doc => (
                  <div key={doc.type} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', backgroundColor:'#f8fafc', borderRadius:'10px' }}>
                    <div style={{ width:'6px', height:'6px', borderRadius:'50%', backgroundColor: doc.required?'#ef4444':'#94a3b8', flexShrink:0 }}/>
                    <div>
                      <span style={{ fontSize:'13px', fontWeight:700, color:'#1e293b' }}>{doc.label}</span>
                      {doc.required && <span style={{ fontSize:'10px', color:'#ef4444', fontWeight:700, marginLeft:'6px' }}>REQUIRED</span>}
                      <p style={{ margin:'1px 0 0', fontSize:'11px', color:'#94a3b8' }}>{doc.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — sticky apply card */}
          <div>
            <div style={{ position:'sticky', top:'80px', backgroundColor:'white', borderRadius:'16px', padding:'22px', border:`2px solid ${tc.color}30`, boxShadow:`0 8px 32px ${tc.color}18` }}>
              <p style={{ margin:'0 0 4px', fontSize:'11px', fontWeight:800, color:tc.color, letterSpacing:'0.5px' }}>QUICK SUMMARY</p>
              <h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:800, color:'#1e293b' }}>{policy.policyName}</h3>

              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
                <span style={{ fontSize:'13px', color:'#64748b' }}>Premium</span>
                <span style={{ fontSize:'14px', fontWeight:800, color:'#4318ff' }}>₹{policy.premiumAmount?.toLocaleString('en-IN')}<span style={{ fontSize:'11px', fontWeight:500, color:'#94a3b8' }}>/{policy.premiumFrequency?.toLowerCase()}</span></span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
                <span style={{ fontSize:'13px', color:'#64748b' }}>Coverage</span>
                <span style={{ fontSize:'14px', fontWeight:800, color:'#1e293b' }}>₹{policy.coverageAmount?.toLocaleString('en-IN')}</span>
              </div>
              {policy.claimSettlementRatio && (
                <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
                  <span style={{ fontSize:'13px', color:'#64748b' }}>Claim Ratio</span>
                  <span style={{ fontSize:'14px', fontWeight:800, color:'#10b981' }}>{policy.claimSettlementRatio}</span>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', marginBottom:'16px' }}>
                <span style={{ fontSize:'13px', color:'#64748b' }}>Tax Benefit</span>
                <span style={{ fontSize:'14px', fontWeight:800, color: policy.taxBenefit?'#10b981':'#94a3b8' }}>{policy.taxBenefit?'Yes (80C/80D)':'No'}</span>
              </div>

              {isApplied ? (
                <div style={{ width:'100%', padding:'14px', borderRadius:'12px', backgroundColor:'#ecfdf5', border:'2px solid #a7f3d0', textAlign:'center', color:'#059669', fontWeight:800, fontSize:'14px' }}>
                  ✓ Already Applied
                </div>
              ) : (
                <button
                  onClick={() => setApplyOpen(true)}
                  style={{ width:'100%', padding:'14px', borderRadius:'12px', border:'none', background:`linear-gradient(135deg, #4318ff, #6366f1)`, color:'white', fontWeight:800, fontSize:'15px', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(67,24,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                  Apply Now <ChevronRight size={16}/>
                </button>
              )}

              <p style={{ margin:'12px 0 0', fontSize:'11px', color:'#94a3b8', textAlign:'center', lineHeight:1.5 }}>
                By applying you agree to our terms. Admin will review and contact you within 24–48 hrs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar (mobile-style) */}
      <div style={{ position:'sticky', bottom:0, backgroundColor:'white', borderTop:'1px solid #e2e8f0', padding:'14px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div>
          <p style={{ margin:0, fontSize:'13px', fontWeight:800, color:'#1e293b' }}>{policy.policyName}</p>
          <p style={{ margin:0, fontSize:'12px', color:'#94a3b8' }}>₹{policy.premiumAmount?.toLocaleString('en-IN')} / {policy.premiumFrequency?.toLowerCase()} · Coverage ₹{policy.coverageAmount?.toLocaleString('en-IN')}</p>
        </div>
        {isApplied ? (
          <div style={{ padding:'12px 24px', borderRadius:'10px', backgroundColor:'#ecfdf5', color:'#059669', fontWeight:800, fontSize:'14px' }}>✓ Applied</div>
        ) : (
          <button onClick={() => setApplyOpen(true)} style={{ padding:'12px 28px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,#4318ff,#6366f1)', color:'white', fontWeight:800, fontSize:'15px', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(67,24,255,0.3)', display:'flex', alignItems:'center', gap:'8px' }}>
            Apply Now <ChevronRight size={15}/>
          </button>
        )}
      </div>

      {/* Apply panel */}
      <ApplyPanel
        policy={policy}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onSuccess={() => { onApply(policy.id); setApplyOpen(false); onClose(); }}
      />
    </div>
  );
}

// ── Main ViewPlans page ───────────────────────────────────────────────────
export default function ViewPlans() {
  const { type }                = useParams();
  const navigate                = useNavigate();
  const [policies,  setPolicies]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [selType,   setSelType]   = useState(type?.toUpperCase() || 'ALL');
  const [detail,    setDetail]    = useState(null);   // policy whose detail is open
  const [applied,   setApplied]   = useState([]);     // already-applied policyIds
  const [toast,     setToast]     = useState('');

  const isLoggedIn = !!localStorage.getItem('userId');
  const showToast  = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  useEffect(() => {
    axios.get(`${API}/policies/active`)
      .then(r => { const d=r.data; setPolicies(Array.isArray(d)?d:(d.content??[])); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (!uid) return;
    axios.get(`${API}/applications/user/${uid}`)
      .then(r => {
        const d = r.data;
        const list = Array.isArray(d) ? d : (d.content ?? []);
        setApplied(list.filter(a => a.status !== 'REJECTED').map(a => a.policyId));
      }).catch(() => {});
  }, []);

  const TYPES   = ['ALL', ...Object.keys(TYPE_CFG)];
  const filtered = policies.filter(p => {
    const q = search.toLowerCase();
    return (p.policyName?.toLowerCase().includes(q) || p.company?.toLowerCase().includes(q))
      && (selType === 'ALL' || p.policyType === selType);
  });

  const handleCardClick = (policy) => setDetail(policy);

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {toast && <div style={{ position:'fixed', top:'20px', right:'24px', zIndex:200, backgroundColor:'#1e293b', color:'white', padding:'12px 20px', borderRadius:'12px', fontWeight:600, fontSize:'14px' }}>{toast}</div>}

      {/* Nav */}
      <nav style={{ backgroundColor:'white', borderBottom:'1px solid #e2e8f0', padding:'0 32px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button onClick={() => navigate(-1)} style={{ border:'none', background:'none', cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:600, fontFamily:'inherit' }}>
            <ArrowLeft size={15}/> Back
          </button>
          <span style={{ color:'#e2e8f0' }}>|</span>
          <h1 style={{ margin:0, fontSize:'17px', fontWeight:900, color:'#1e293b' }}>
            INSURE<span style={{ color:'#4318ff' }}>AI</span>
            <span style={{ fontWeight:500, color:'#94a3b8', fontSize:'13px', marginLeft:'8px' }}>Insurance Plans</span>
          </h1>
        </div>
        {!isLoggedIn && (
          <button onClick={() => navigate('/login')} style={S.btn('#4318ff')}>Login to Apply</button>
        )}
      </nav>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'28px 24px' }}>
        {/* Search */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', backgroundColor:'white', borderRadius:'12px', padding:'12px 18px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', marginBottom:'16px' }}>
          <Search size={15} color="#94a3b8"/>
          <input placeholder="Search by policy name or company..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ border:'none', outline:'none', fontSize:'14px', width:'100%', fontFamily:'inherit' }}/>
          {search && <button onClick={()=>setSearch('')} style={{ border:'none', background:'none', cursor:'pointer', color:'#94a3b8' }}><X size={14}/></button>}
        </div>

        {/* Type filter chips */}
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'22px' }}>
          {TYPES.map(t => {
            const c = TYPE_CFG[t];
            return (
              <button key={t} onClick={() => setSelType(t)}
                style={{ padding:'7px 16px', borderRadius:'20px', border:'1.5px solid', borderColor:selType===t?(c?.color||'#4318ff'):'#e2e8f0', backgroundColor:selType===t?(c?.bg||'#eef2ff'):'white', color:selType===t?(c?.color||'#4318ff'):'#64748b', fontWeight:700, fontSize:'12px', cursor:'pointer', fontFamily:'inherit' }}>
                {c?.emoji} {c?.label||'All Types'}
              </button>
            );
          })}
        </div>

        <p style={{ margin:'0 0 16px', fontSize:'13px', color:'#94a3b8', fontWeight:600 }}>
          {loading ? 'Loading...' : `${filtered.length} plan${filtered.length!==1?'s':''} found`}
        </p>

        {/* Cards */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'80px', color:'#94a3b8' }}>⏳ Loading plans...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px', backgroundColor:'white', borderRadius:'16px', border:'1px dashed #e2e8f0' }}>
            <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔍</div>
            <p style={{ fontWeight:700, color:'#1e293b' }}>No plans found</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'16px' }}>
            {filtered.map(p => {
              const tc = TYPE_CFG[p.policyType] || TYPE_CFG.HEALTH;
              const isApplied = applied.includes(p.id);
              return (
                <div key={p.id}
                  style={{ backgroundColor:'white', borderRadius:'16px', padding:'20px', border:'1px solid #e2e8f0', cursor:'pointer', transition:'all 0.2s', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.11)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.transform='none'; }}
                  onClick={() => handleCardClick(p)}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <div style={{ width:'44px', height:'44px', borderRadius:'12px', backgroundColor:tc.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>{tc.emoji}</div>
                    {isApplied
                      ? <span style={{ fontSize:'11px', fontWeight:700, color:'#10b981', backgroundColor:'#ecfdf5', padding:'3px 10px', borderRadius:'20px' }}>✓ Applied</span>
                      : <span style={{ fontSize:'11px', fontWeight:700, color:tc.color, backgroundColor:tc.bg, padding:'3px 10px', borderRadius:'20px' }}>{tc.label}</span>
                    }
                  </div>
                  <h3 style={{ margin:'0 0 4px', fontSize:'15px', fontWeight:800, color:'#1e293b' }}>{p.policyName}</h3>
                  <p style={{ margin:'0 0 14px', fontSize:'12px', color:'#64748b' }}>{p.company}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', backgroundColor:'#f8fafc', padding:'10px 12px', borderRadius:'10px', marginBottom:'14px' }}>
                    <div><p style={{ margin:0, fontSize:'10px', color:'#94a3b8', fontWeight:700 }}>PREMIUM</p><p style={{ margin:0, fontWeight:800, color:'#4318ff', fontSize:'14px' }}>₹{p.premiumAmount?.toLocaleString('en-IN')}<span style={{ fontSize:'10px', color:'#94a3b8', fontWeight:400 }}>/{p.premiumFrequency?.toLowerCase()}</span></p></div>
                    <div style={{ textAlign:'right' }}><p style={{ margin:0, fontSize:'10px', color:'#94a3b8', fontWeight:700 }}>COVERAGE</p><p style={{ margin:0, fontWeight:800, color:'#1e293b', fontSize:'14px' }}>₹{p.coverageAmount?.toLocaleString('en-IN')}</p></div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', color:'#4318ff', fontWeight:700, fontSize:'13px' }}>
                    <span>View Full Details</span>
                    <ChevronRight size={16}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-screen detail overlay */}
      {detail && (
        <PolicyDetailOverlay
          policy={detail}
          onClose={() => setDetail(null)}
          isApplied={applied.includes(detail.id)}
          onApply={(policyId) => {
            setApplied(p => [...p, policyId]);
            setDetail(null);
            showToast('✅ Application submitted successfully!');
          }}
        />
      )}
    </div>
  );
}