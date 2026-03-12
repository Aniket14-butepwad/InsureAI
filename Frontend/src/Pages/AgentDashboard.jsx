import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, ShieldCheck, FileBarChart,
  UserCircle, LogOut, Briefcase, Users2, Search, Plus,
  Mail, Phone, Calendar, CheckCircle2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import axios from 'axios';
import './AgentDashboard.css';
import PolicyCatalog from '../components/PolicyCatalog';

const getUserProfile = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('No userId');
  const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
  return res.data;
};

const S = {
  wrapper: { display:'flex', height:'100vh', width:'100vw', backgroundColor:'#f0f2f8', fontFamily:"'Plus Jakarta Sans',sans-serif", overflow:'hidden' },
  sidebar: { width:'240px', minWidth:'240px', backgroundColor:'#1a1f3a', display:'flex', flexDirection:'column' },
  main:    { flex:1, display:'flex', flexDirection:'column', overflowY:'auto' },
  topbar:  { height:'68px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', backgroundColor:'white', borderBottom:'1px solid #eef0f7', position:'sticky', top:0, zIndex:10 },
  content: { padding:'28px', display:'flex', flexDirection:'column', gap:'24px' },
  card:    { backgroundColor:'white', borderRadius:'14px', padding:'22px', boxShadow:'0 3px 16px rgba(0,0,0,0.06)' },
  navBtn:  (on) => ({ display:'flex', alignItems:'center', gap:'10px', padding:'11px 18px', margin:'2px 10px', borderRadius:'9px', border:'none', cursor:'pointer', fontWeight:600, fontSize:'13px', textAlign:'left', width:'calc(100% - 20px)', backgroundColor: on ? '#6366f1' : 'transparent', color: on ? 'white' : '#8a9bb8', transition:'all 0.2s' }),
};

const D_AREA = [
  { day:'Mon',sales:4 },{ day:'Tue',sales:7 },{ day:'Wed',sales:5 },
  { day:'Thu',sales:12 },{ day:'Fri',sales:9 },{ day:'Sat',sales:15 },{ day:'Sun',sales:8 },
];
const D_PIE = [
  { name:'Life (LIC)',value:550 },{ name:'Health',value:320 },
  { name:'Two-Wheeler',value:410 },{ name:'ULIP',value:180 },
];
const D_BAR = [
  { group:'21-30',count:210 },{ group:'31-45',count:580 },
  { group:'46-60',count:340 },{ group:'60+',count:120 },
];
const D_RETENTION = [
  { month:'Oct',renewals:40,churn:5 },{ month:'Nov',renewals:45,churn:8 },
  { month:'Dec',renewals:60,churn:3 },{ month:'Jan',renewals:55,churn:12 },
  { month:'Feb',renewals:75,churn:4 },
];
const PIE_COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444'];

const CLIENTS = [
  { id:1, name:'Arjun Sharma',   email:'arjun.sharma@outlook.in', policy:'Star Health Premier', status:'Active',  join:'15 Jan 2026' },
  { id:2, name:'Priya Deshmukh', email:'priya.d@gmail.com',       policy:'HDFC Life Sanchay',  status:'Pending', join:'10 Feb 2026' },
  { id:3, name:'Rajesh Kumar',   email:'kumar.rajesh@yahoo.in',   policy:'Digit Two-Wheeler',  status:'Active',  join:'20 Nov 2025' },
];

const POLICIES = [
  { id:1, company:'Star Health',   title:'Senior Citizens Red Carpet', coverage:'₹5L-₹25L',   premium:'₹1,850/mo', comm:'15%', tags:['No Medical','Entry 75 yrs'],  riders:['OPD Cover','Hospital Cash'] },
  { id:2, company:'HDFC Life',     title:'Click 2 Protect Super',      coverage:'₹1 Crore',   premium:'₹850/mo',   comm:'25%', tags:['Tax Saver','Spouse Cover'],   riders:['Critical Illness','Accidental Death'] },
  { id:3, company:'ICICI Lombard', title:'Comprehensive Car Insurance', coverage:'IDV Basis',  premium:'₹650/mo',   comm:'10%', tags:['Zero Dep','Roadside Assist'], riders:['Engine Protect','Consumables'] },
  { id:4, company:'LIC of India',  title:'New Jeevan Anand',           coverage:'₹10L+Bonus', premium:'₹4,200/mo', comm:'35%', tags:['Guaranteed Returns','Bonus'],  riders:['Term Rider','Critical Illness'] },
];

const AgentDashboard = () => {
  const [tab,     setTab]     = useState('dashboard');
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getUserProfile()
      .then(d  => { setUser(d);  setLoading(false); })
      .catch(() => { setError('Failed to load profile.'); setLoading(false); });
  }, []);

  const StatCard = ({ icon, label, value, color }) => (
    <div style={S.card}>
      <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
        <div style={{ backgroundColor:color+'20', padding:'12px', borderRadius:'10px', color, display:'flex' }}>{icon}</div>
        <div>
          <p style={{ margin:0, fontSize:'12px', color:'#a3aed0', fontWeight:600 }}>{label}</p>
          <p style={{ margin:0, fontSize:'20px', fontWeight:800, color:'#1b2559' }}>{value}</p>
        </div>
      </div>
    </div>
  );

  const DashboardTab = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'18px' }}>
        <StatCard icon={<Users2 size={20}/>}      label="Total Clients"   value="1,284"      color="#3b82f6" />
        <StatCard icon={<Briefcase size={20}/>}   label="Policies Sold"   value="92"         color="#10b981" />
        <StatCard icon={<ShieldCheck size={20}/>} label="Active Schemes"  value="14"         color="#8b5cf6" />
        <StatCard icon={<span style={{fontWeight:800,fontSize:'16px'}}>₹</span>} label="Total Revenue" value="₹4,52,400" color="#f59e0b" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'18px' }}>
        <div style={S.card}>
          <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Weekly Sales Performance</h4>
          <AreaChart width={500} height={240} data={D_AREA} margin={{ top:5, right:20, bottom:5, left:0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3fa"/>
            <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12}/>
            <YAxis axisLine={false} tickLine={false} fontSize={12}/>
            <Tooltip/>
            <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fill="url(#salesGrad)"/>
          </AreaChart>
        </div>

        <div style={S.card}>
          <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Most Popular Policies</h4>
          <PieChart width={280} height={240}>
            <Pie data={D_PIE} cx={130} cy={100} innerRadius={60} outerRadius={85} paddingAngle={6} dataKey="value">
              {D_PIE.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
            </Pie>
            <Tooltip/>
            <Legend verticalAlign="bottom" iconSize={10}/>
          </PieChart>
        </div>
      </div>

      <div style={S.card}>
        <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Buyer Age Demographics</h4>
        <BarChart width={880} height={220} data={D_BAR} margin={{ top:5, right:20, bottom:5, left:0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3fa"/>
          <XAxis dataKey="group" axisLine={false} tickLine={false} fontSize={12}/>
          <YAxis axisLine={false} tickLine={false} fontSize={12}/>
          <Tooltip cursor={{ fill:'#f8fafc' }}/>
          <Bar dataKey="count" fill="#6366f1" radius={[6,6,0,0]} barSize={55}/>
        </BarChart>
      </div>
    </div>
  );

  const ClientsTab = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', backgroundColor:'white', borderRadius:'10px', padding:'10px 16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', width:'300px' }}>
          <Search size={15} color="#a3aed0"/>
          <input placeholder="Search by Name or Mobile..." style={{ border:'none', outline:'none', fontSize:'13px', width:'100%' }}/>
        </div>
        <button style={{ backgroundColor:'#6366f1', color:'white', border:'none', padding:'10px 18px', borderRadius:'10px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
          <Plus size={14}/> New Prospect
        </button>
      </div>
      <div style={S.card}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ textAlign:'left', color:'#a3aed0', fontSize:'12px', borderBottom:'1px solid #f4f7fe' }}>
              {['NAME','EMAIL','LINKED POLICY','REG. DATE','STATUS'].map(h => <th key={h} style={{ padding:'10px 8px' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map(c => (
              <tr key={c.id} style={{ borderBottom:'1px solid #f4f7fe', fontSize:'14px' }}>
                <td style={{ padding:'14px 8px', fontWeight:700, color:'#1b2559' }}>{c.name}</td>
                <td style={{ color:'#64748b' }}>{c.email}</td>
                <td><span style={{ backgroundColor:'#ede9fe', color:'#6366f1', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:600 }}>{c.policy}</span></td>
                <td style={{ color:'#64748b' }}>{c.join}</td>
                <td><span style={{ backgroundColor: c.status==='Active'?'#e6fff5':'#fff9e6', color: c.status==='Active'?'#01b574':'#ffb800', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  

  const ReportsTab = () => (
    <div style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'18px' }}>
        {[
          { icon:'🎯', label:'Lead Conversion',    value:'24%',         note:'+3% from last month' },
          { icon:'⏳', label:'Renewal Pipeline',   value:'₹8.4 Lakh',   note:'Due in next 30 days' },
          { icon:'🔥', label:'Cross-Sell Targets', value:'112 Clients',  note:'Motor without Life' },
        ].map((c,i) => (
          <div key={i} style={{ ...S.card, borderLeft: i===0?'4px solid #6366f1':'none' }}>
            <p style={{ margin:'0 0 4px', fontSize:'13px', fontWeight:600, color:'#64748b' }}>{c.icon} {c.label}</p>
            <h2 style={{ margin:'0 0 4px', color:'#1b2559', fontSize:'24px', fontWeight:800 }}>{c.value}</h2>
            <p style={{ margin:0, fontSize:'12px', color:'#a3aed0' }}>{c.note}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'18px' }}>
        <div style={S.card}>
          <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Customer Retention Analysis</h4>
          <BarChart width={500} height={240} data={D_RETENTION} margin={{ top:5, right:20, bottom:5, left:0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3fa"/>
            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12}/>
            <YAxis axisLine={false} tickLine={false} fontSize={12}/>
            <Tooltip/><Legend/>
            <Bar name="Renewals" dataKey="renewals" fill="#10b981" radius={[4,4,0,0]}/>
            <Bar name="Lapsed"   dataKey="churn"    fill="#ef4444" radius={[4,4,0,0]}/>
          </BarChart>
        </div>

        <div style={S.card}>
          <h4 style={{ margin:'0 0 16px', color:'#1b2559', fontWeight:700 }}>Sales Funnel</h4>
          {[
            { label:'New Leads', count:450, w:'100%', color:'#6366f1' },
            { label:'Interested',count:120, w:'27%',  color:'#8b5cf6' },
            { label:'Quoted',    count:85,  w:'19%',  color:'#a78bfa' },
            { label:'Converted', count:42,  w:'9%',   color:'#c4b5fd' },
          ].map((f,i) => (
            <div key={i} style={{ marginBottom:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                <span style={{ fontSize:'13px', fontWeight:600, color:'#1b2559' }}>{f.label}</span>
                <span style={{ fontSize:'13px', fontWeight:700, color:'#6366f1' }}>{f.count}</span>
              </div>
              <div style={{ height:'8px', backgroundColor:'#f4f7fe', borderRadius:'8px' }}>
                <div style={{ height:'100%', width:f.w, backgroundColor:f.color, borderRadius:'8px' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <h4 style={{ margin:'0 0 14px', color:'#1b2559', fontWeight:700 }}>Download Documents</h4>
        {['Annual_Commission_Statement_2025.pdf','Regional_Sales_Benchmark.csv','Product_Comparison_Sheet_v4.pdf'].map((f,i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', backgroundColor:'#f8fafc', borderRadius:'10px', marginBottom:'8px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <FileBarChart size={16} color="#64748b"/>
              <span style={{ fontSize:'13px', fontWeight:600, color:'#1b2559' }}>{f}</span>
            </div>
            <button style={{ padding:'5px 14px', borderRadius:'8px', border:'none', backgroundColor:'#6366f1', color:'white', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileTab = () => {
    const initials = n => n ? n.split(' ').map(x=>x[0]).join('').toUpperCase() : '??';
    const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-IN',{ year:'numeric', month:'long', day:'numeric' }) : 'N/A';
    if (loading) return <div style={S.card}><p>⏳ Loading profile...</p></div>;
    if (error)   return <div style={S.card}><p style={{color:'red'}}>❌ {error}</p></div>;
    if (!user)   return <div style={S.card}><p>No data. Please login again.</p></div>;
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        <div style={{ ...S.card, display:'flex', alignItems:'center', gap:'20px' }}>
          <div style={{ width:'70px', height:'70px', borderRadius:'50%', backgroundColor:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'24px', fontWeight:800 }}>
            {initials(user.fullName)}
          </div>
          <div>
            <h2 style={{ margin:0, color:'#1b2559' }}>{user.fullName}</h2>
            <p style={{ margin:0, color:'#a3aed0' }}>Insurance Advisor | {user.role}</p>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'14px' }}>
          {[
            { icon:<Mail size={15}/>,      label:'Email',        value:user.email },
            { icon:<Phone size={15}/>,     label:'Mobile',       value:`+91 ${user.phone}` },
            { icon:<Calendar size={15}/>,  label:'Member Since', value:fmtDate(user.createdAt) },
            { icon:<UserCircle size={15}/>,label:'Role',         value:user.role },
          ].map((item,i) => (
            <div key={i} style={{ ...S.card, display:'flex', alignItems:'center', gap:'14px', padding:'16px 20px' }}>
              <div style={{ color:'#6366f1' }}>{item.icon}</div>
              <div>
                <p style={{ margin:0, fontSize:'11px', color:'#a3aed0', fontWeight:600 }}>{item.label}</p>
                <p style={{ margin:0, fontWeight:700, color:'#1b2559', fontSize:'14px' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...S.card, display:'flex', alignItems:'center', gap:'12px', backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0', padding:'16px 20px' }}>
          <CheckCircle2 size={20} color="#16a34a"/>
          <p style={{ margin:0, fontWeight:600, color:'#15803d' }}>IRDAI Certified Agent — InsureAI Platform</p>
        </div>
      </div>
    );
  };

  const TABS = {
    dashboard: <DashboardTab/>,
    clients:   <ClientsTab/>,
     policy: <PolicyCatalog />,
    reports:   <ReportsTab/>,
    profile:   <ProfileTab/>,
  };

  const NAV = [
    ['dashboard','Dashboard',      <LayoutDashboard size={17}/>],
    ['clients',  'My Clients',     <Users           size={17}/>],
    ['policy',   'Policy Catalog', <ShieldCheck     size={17}/>],
    ['reports',  'Reports',        <FileBarChart    size={17}/>],
    ['profile',  'My Profile',     <UserCircle      size={17}/>],
  ];

  return (
    <div style={S.wrapper}>
      <aside style={S.sidebar}>
        <div style={{ padding:'28px 20px 16px' }}>
          <h2 style={{ margin:0, fontSize:'17px', fontWeight:800, color:'white' }}>INSURE<span style={{ color:'#6366f1' }}>CORE</span></h2>
        </div>
        <nav style={{ flex:1 }}>
          {NAV.map(([key,label,icon]) => (
            <button key={key} style={S.navBtn(tab===key)} onClick={() => setTab(key)}>
              {icon} {label}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid #2a2f52' }}>
          <p style={{ margin:0, fontSize:'11px', color:'#8a9bb8' }}>Logged in as</p>
          <p style={{ margin:0, fontSize:'13px', fontWeight:700, color:'white' }}>{user?.fullName || '...'}</p>
        </div>
      </aside>

      <main style={S.main}>
        <header style={S.topbar}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', backgroundColor:'#f4f7fe', borderRadius:'25px', padding:'8px 16px', width:'280px' }}>
            <Search size={14} color="#a3aed0"/>
            <input placeholder="Search clients, policies..." style={{ border:'none', outline:'none', background:'transparent', fontSize:'13px', width:'100%' }}/>
          </div>
          <button style={{ backgroundColor:'#fff0f0', color:'#ee5d50', border:'none', padding:'8px 16px', borderRadius:'9px', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
            <LogOut size={14}/> Logout
          </button>
        </header>

        <div style={S.content}>
          <h1 style={{ margin:0, fontSize:'26px', fontWeight:800, color:'#1b2559' }}>
            {NAV.find(([k]) => k===tab)?.[1]}
          </h1>
          {TABS[tab]}
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
