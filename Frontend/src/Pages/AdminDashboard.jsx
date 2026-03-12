import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShieldCheck, FileCheck, ClipboardList,
  Users, UserRound, HardHat, LogOut, Search, Droplets,
  ArrowUpRight, ArrowDownRight, MapPin, Plus, Edit3, Trash2
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import PolicyManagement from '../components/PolicyManagement';
import PolicyApproval from '../components/PolicyApproval';


// ── API ────────────────────────────────────────────────────
const getUserProfile = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('No userId');
  const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
  return res.data;
};

// ── STYLES ─────────────────────────────────────────────────
const S = {
  wrapper:  { display:'flex', height:'100vh', width:'100vw', backgroundColor:'#f4f7fe', fontFamily:"'Plus Jakarta Sans',sans-serif", overflow:'hidden' },
  sidebar:  { width:'260px', minWidth:'260px', backgroundColor:'#0b1437', display:'flex', flexDirection:'column' },
  main:     { flex:1, display:'flex', flexDirection:'column', overflowY:'auto' },
  topbar:   { height:'72px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', backgroundColor:'white', borderBottom:'1px solid #f0f3fa', position:'sticky', top:0, zIndex:10 },
  content:  { padding:'32px', display:'flex', flexDirection:'column', gap:'28px' },
  card:     { backgroundColor:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' },
  navBtn:   (on) => ({ display:'flex', alignItems:'center', gap:'10px', padding:'12px 20px', margin:'3px 12px', borderRadius:'10px', border:'none', cursor:'pointer', fontWeight:600, fontSize:'14px', textAlign:'left', width:'calc(100% - 24px)', backgroundColor: on ? '#4318ff' : 'transparent', color: on ? 'white' : '#8a9bb8', transition:'all 0.2s' }),
  badge:    (c)  => ({ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, backgroundColor: c==='Live'?'#e6fff5':c==='Draft'?'#fff9e6':'#fff0f0', color: c==='Live'?'#01b574':c==='Draft'?'#ffb800':'#ee5d50' }),
};

// ── DATA ───────────────────────────────────────────────────
const D_BAR  = [{ name:'Health',views:8500,sales:3200 },{ name:'Life',views:6200,sales:1100 },{ name:'Motor',views:12000,sales:9500 },{ name:'Car',views:9000,sales:4200 }];
const D_PIE  = [{ name:'Male',value:58 },{ name:'Female',value:40 },{ name:'Other',value:2 }];
const D_AREA = [{ age:'18-25',count:450 },{ age:'26-35',count:890 },{ age:'36-45',count:670 },{ age:'46-60',count:320 }];
const CITIES = [{ city:'Mumbai',reach:92,color:'#4318ff' },{ city:'Delhi NCR',reach:85,color:'#6ad2ff' },{ city:'Bangalore',reach:78,color:'#312ecb' }];
const PIE_COLORS = ['#4318ff','#6ad2ff','#eff4fb'];

// ── COMPONENT ──────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab,     setTab]     = useState('Insights');
  const [risk,    setRisk]    = useState(45);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getUserProfile()
      .then(d  => { setUser(d);  setLoading(false); })
      .catch(() => { setError('Failed to load profile.'); setLoading(false); });
  }, []);

  // ── small helpers ──────────────────────────────────────
  const StatCard = ({ label, value, trend }) => (
    <div style={S.card}>
      <p style={{ color:'#a3aed0', fontSize:'13px', fontWeight:600, margin:'0 0 6px' }}>{label}</p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h3 style={{ margin:0, fontSize:'22px', fontWeight:800, color:'#1b2559' }}>{value}</h3>
        <span style={{ fontSize:'12px', fontWeight:700, padding:'3px 8px', borderRadius:'8px', backgroundColor: trend[0]==='+' ? '#e6fff5':'#fff0f0', color: trend[0]==='+' ? '#01b574':'#ee5d50', display:'flex', alignItems:'center', gap:'2px' }}>
          {trend[0]==='+' ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}{trend}
        </span>
      </div>
    </div>
  );

  // ── INSIGHTS charts — fixed pixel width/height ─────────
  const InsightsTab = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

      {/* stat row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
        <StatCard label="Weekly Collection"   value="₹4.25 Lac" trend="+12.5%" />
        <StatCard label="Monthly Revenue"     value="₹18.90 Cr" trend="+4.2%"  />
        <StatCard label="Total Policyholders" value="1,42,500"  trend="+8.1%"  />
        <StatCard label="Daily Views"         value="28,400"    trend="-1.2%"  />
      </div>

      {/* chart row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'20px' }}>

        {/* Bar chart — Views vs Sales */}
        <div style={S.card}>
          <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Most Viewed vs Purchased</h4>
          <BarChart width={500} height={260} data={D_BAR} margin={{ top:5, right:20, bottom:5, left:0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3fa" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip />
            <Legend iconType="circle" />
            <Bar name="Views" dataKey="views" fill="#e9edf7" radius={[5,5,0,0]} />
            <Bar name="Sales" dataKey="sales" fill="#4318ff" radius={[5,5,0,0]} />
          </BarChart>
        </div>

        {/* Pie chart — Gender */}
        <div style={S.card}>
          <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Gender Reach</h4>
          <PieChart width={300} height={260}>
            <Pie data={D_PIE} cx={140} cy={110} innerRadius={65} outerRadius={90} paddingAngle={5} dataKey="value">
              {D_PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </div>
      </div>

      {/* chart row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>

        {/* Area chart — Age Distribution */}
        <div style={S.card}>
          <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Customer Age Distribution</h4>
          <AreaChart width={460} height={250} data={D_AREA} margin={{ top:5, right:20, bottom:5, left:0 }}>
            <defs>
              <linearGradient id="ageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4318ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4318ff" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3fa" />
            <XAxis dataKey="age" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis axisLine={false} tickLine={false} fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#4318ff" strokeWidth={3} fill="url(#ageGrad)" />
          </AreaChart>
        </div>

        {/* City reach bars */}
        <div style={S.card}>
          <h4 style={{ margin:'0 0 20px', color:'#1b2559', fontWeight:700 }}>Top Performing Cities</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:'20px', marginTop:'10px' }}>
            {CITIES.map((c, i) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontWeight:700, color:'#1b2559' }}>{c.city}</span>
                  <span style={{ fontWeight:800, color:'#4318ff' }}>{c.reach}%</span>
                </div>
                <div style={{ height:'10px', backgroundColor:'#f4f7fe', borderRadius:'10px' }}>
                  <div style={{ height:'100%', width:`${c.reach}%`, backgroundColor:c.color, borderRadius:'10px', transition:'width 1.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── POLICY MANAGEMENT ──────────────────────────────────
  

  // ── POLICY APPROVAL ────────────────────────────────────
  const ApprovalsTab = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
        <div style={{ ...S.card, borderLeft:'4px solid #ffb800' }}><p style={{ margin:0, fontSize:'12px', color:'#a3aed0' }}>Pending</p><h3 style={{ margin:0 }}>18 Applications</h3></div>
        <div style={{ ...S.card, borderLeft:'4px solid #4318ff' }}><p style={{ margin:0, fontSize:'12px', color:'#a3aed0' }}>Avg. Time</p><h3 style={{ margin:0 }}>4.2 Hours</h3></div>
        <div style={{ ...S.card, borderLeft:'4px solid #01b574' }}><p style={{ margin:0, fontSize:'12px', color:'#a3aed0' }}>Approved Today</p><h3 style={{ margin:0 }}>142 Cases</h3></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'20px' }}>
        <div style={S.card}>
          <span style={{ backgroundColor:'#fff9e6', color:'#ffb800', padding:'4px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:800 }}>ID VERIFICATION PENDING</span>
          <h2 style={{ margin:'12px 0 4px', color:'#1b2559' }}>Rajesh Malhotra</h2>
          <p style={{ color:'#a3aed0', display:'flex', alignItems:'center', gap:'4px' }}><MapPin size={13}/> Borivali West, Mumbai</p>
          <div style={{ display:'flex', gap:'12px', marginTop:'28px' }}>
            <button style={{ flex:1, padding:'13px', borderRadius:'10px', border:'none', backgroundColor:'#ee5d50', color:'white', fontWeight:700, cursor:'pointer' }}>REJECT</button>
            <button style={{ flex:1, padding:'13px', borderRadius:'10px', border:'none', backgroundColor:'#4318ff', color:'white', fontWeight:700, cursor:'pointer' }}>REQUEST INFO</button>
            <button style={{ flex:2, padding:'13px', borderRadius:'10px', border:'none', backgroundColor:'#01b574', color:'white', fontWeight:700, cursor:'pointer' }}>APPROVE & ISSUE</button>
          </div>
        </div>
        <div style={S.card}>
          <p style={{ textAlign:'center', color:'#a3aed0', fontWeight:700, fontSize:'12px' }}>UNDERWRITING RISK</p>
          <div style={{ width:'100px', height:'160px', border:'4px solid #e9edf7', borderTop:'none', borderBottomLeftRadius:'30px', borderBottomRightRadius:'30px', position:'relative', overflow:'hidden', margin:'16px auto', backgroundColor:'white' }}>
            <div style={{ position:'absolute', bottom:0, width:'100%', height:`${risk}%`, background: risk > 60 ? '#ee5d50' : '#4318ff', transition:'1s' }}>
              <Droplets color="white" style={{ margin:'8px auto', display:'block', opacity:0.4 }} size={18}/>
            </div>
          </div>
          <h2 style={{ textAlign:'center', fontSize:'34px', margin:0, color:'#1b2559' }}>{risk}%</h2>
          <input type="range" min={0} max={100} value={risk} onChange={e => setRisk(+e.target.value)} style={{ width:'100%', accentColor:'#4318ff', marginTop:'12px' }}/>
        </div>
      </div>
    </div>
  );

  // ── CLAIMS ─────────────────────────────────────────────
  const ClaimsTab = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
        {[['Claims Today','42','#1b2559'],['Total Payout','₹1.42 Cr','#4318ff'],['In Survey','12','#ffb800'],['Rejected','04','#ee5d50']].map(([l,v,c],i) => (
          <div key={i} style={S.card}><p style={{ margin:0, fontSize:'12px', color:'#a3aed0' }}>{l}</p><h3 style={{ margin:0, color:c }}>{v}</h3></div>
        ))}
      </div>
      <div style={S.card}>
        <h3 style={{ margin:'0 0 16px', color:'#1b2559' }}>Claim #CL-99021-IND — Accident Claim</h3>
        <div style={{ display:'flex', gap:'12px' }}>
          <button style={{ flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #ee5d50', color:'#ee5d50', background:'none', fontWeight:700, cursor:'pointer' }}>Reject</button>
          <button style={{ flex:1, padding:'12px', borderRadius:'10px', border:'none', backgroundColor:'#4318ff', color:'white', fontWeight:700, cursor:'pointer' }}>Query</button>
          <button style={{ flex:2, padding:'12px', borderRadius:'10px', border:'none', backgroundColor:'#01b574', color:'white', fontWeight:700, cursor:'pointer' }}>Authorize Payment</button>
        </div>
      </div>
    </div>
  );

  // ── CRM ────────────────────────────────────────────────
  const CRMTab = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <div style={{ ...S.card, position:'relative' }}>
        <Search size={16} style={{ position:'absolute', left:'18px', top:'50%', transform:'translateY(-50%)', color:'#a3aed0' }}/>
        <input placeholder="Search by Name or Mobile..." style={{ width:'100%', padding:'13px 13px 13px 42px', borderRadius:'10px', border:'1px solid #e9edf7', outline:'none', fontSize:'14px', boxSizing:'border-box' }}/>
      </div>
      <div style={S.card}>
        <h3 style={{ margin:'0 0 20px', color:'#1b2559' }}>Customer Database</h3>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ textAlign:'left', color:'#a3aed0', fontSize:'12px', borderBottom:'1px solid #f4f7fe' }}>
              {['CUSTOMER','POLICIES','PREMIUM','KYC','ACTION'].map(h => <th key={h} style={{ padding:'10px 8px' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              { n:'Arjun Kapoor', l:'Pune',      p:3, v:'₹85,000', s:'Verified', c:'#01b574' },
              { n:'Sneha Reddy',  l:'Hyderabad', p:1, v:'₹12,400', s:'Pending',  c:'#ffb800' },
              { n:'Ishaan Verma', l:'Lucknow',   p:2, v:'₹42,000', s:'Verified', c:'#01b574' },
              { n:'Meera Nair',   l:'Kochi',     p:1, v:'₹5,600',  s:'Expired',  c:'#ee5d50' },
            ].map((u,i) => (
              <tr key={i} style={{ borderBottom:'1px solid #f4f7fe' }}>
                <td style={{ padding:'14px 8px' }}>
                  <p style={{ margin:0, fontWeight:700, color:'#1b2559' }}>{u.n}</p>
                  <span style={{ fontSize:'11px', color:'#a3aed0' }}>{u.l}</span>
                </td>
                <td style={{ fontWeight:600 }}>{u.p} Active</td>
                <td style={{ fontWeight:700, color:'#4318ff' }}>{u.v}</td>
                <td><span style={{ color:u.c, fontWeight:700, fontSize:'12px' }}>● {u.s}</span></td>
                <td><button style={{ padding:'5px 12px', borderRadius:'8px', border:'1px solid #4318ff', color:'#4318ff', background:'none', fontSize:'12px', cursor:'pointer' }}>Profile</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── AGENTS ─────────────────────────────────────────────
  const AgentsTab = () => (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
      {[['Total Active Agents','1,240','#1b2559'],['Commission Paid (MTD)','₹28.5 Lac','#01b574'],['Pending Licensing','14','#ee5d50']].map(([l,v,c],i) => (
        <div key={i} style={S.card}><p style={{ color:'#a3aed0', fontSize:'13px', margin:0 }}>{l}</p><h2 style={{ margin:'6px 0 0', color:c }}>{v}</h2></div>
      ))}
    </div>
  );

  // ── PROFILE ────────────────────────────────────────────
  const ProfileTab = () => {
    if (loading) return <div style={S.card}><p>⏳ Loading profile...</p></div>;
    if (error)   return <div style={S.card}><p style={{ color:'red' }}>❌ {error}</p></div>;
    if (!user)   return <div style={S.card}><p>No data. Please login again.</p></div>;
    return (
      <div style={S.card}>
        <div style={{ display:'flex', alignItems:'center', gap:'20px', paddingBottom:'24px', marginBottom:'24px', borderBottom:'1px solid #f4f7fe' }}>
          <div style={{ width:'72px', height:'72px', borderRadius:'50%', backgroundColor:'#4318ff', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'26px', fontWeight:800 }}>
            {user.fullName?.split(' ').map(n=>n[0]).join('').toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin:0, color:'#1b2559' }}>{user.fullName}</h2>
            <p style={{ margin:0, color:'#a3aed0' }}>{user.role} — InsureAI</p>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {[
            { label:'Full Name',      value: user.fullName },
            { label:'Email',          value: user.email },
            { label:'Phone',          value: `+91 ${user.phone}` },
            { label:'Role',           value: user.role },
            { label:'Member Since',   value: new Date(user.createdAt).toLocaleDateString('en-IN',{ year:'numeric', month:'long', day:'numeric' }) },
            { label:'Account Status', value:'✅ Active' },
          ].map((item,i) => (
            <div key={i} style={{ padding:'14px', background:'#f4f7fe', borderRadius:'10px' }}>
              <p style={{ margin:'0 0 4px', fontSize:'11px', color:'#a3aed0' }}>{item.label}</p>
              <p style={{ margin:0, fontWeight:700, color:'#1b2559' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── TAB MAP ────────────────────────────────────────────
  const TABS = {
    'Insights':          <InsightsTab />,
    'Policy Management': <PolicyManagement />,
    'Policy Approval': <PolicyApproval />,
    'Claims Approval':   <ClaimsTab />,
    'User CRM':          <CRMTab />,
    'Agent Portal':      <AgentsTab />,
    'Profile':           <ProfileTab />,
  };

  const NAV = [
    ['Insights',          <LayoutDashboard size={18}/>],
    ['Policy Management', <ClipboardList   size={18}/>],
    ['Policy Approval',   <FileCheck       size={18}/>],
    ['Claims Approval',   <ShieldCheck     size={18}/>],
    ['User CRM',          <Users           size={18}/>],
    ['Agent Portal',      <UserRound       size={18}/>],
    ['Profile',           <UserRound       size={18}/>],
  ];

  // ── RENDER ─────────────────────────────────────────────
  return (
    <div style={S.wrapper}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={{ padding:'32px 24px 20px' }}>
          <h2 style={{ margin:0, fontSize:'20px', fontWeight:800, color:'white' }}>INSURE<span style={{ color:'#4318ff' }}>AI</span></h2>
        </div>
        <nav style={{ flex:1 }}>
          {NAV.map(([label, icon]) => (
            <button key={label} style={S.navBtn(tab===label)} onClick={() => setTab(label)}>
              {icon} {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={S.main}>
        <header style={S.topbar}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', backgroundColor:'#f4f7fe', borderRadius:'25px', padding:'8px 16px', width:'320px' }}>
            <Search size={16} color="#a3aed0"/>
            <input placeholder="Search Policy or Aadhaar..." style={{ border:'none', outline:'none', background:'transparent', fontSize:'14px', width:'100%' }}/>
          </div>
          <button style={{ backgroundColor:'#fff0f0', color:'#ee5d50', border:'none', padding:'9px 18px', borderRadius:'10px', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>
            <LogOut size={15}/> LOGOUT
          </button>
        </header>

        <div style={S.content}>
          <h1 style={{ margin:0, fontSize:'28px', fontWeight:800, color:'#1b2559' }}>{tab}</h1>
          {TABS[tab]}
        </div>
      </main>
    </div>
  );
}
