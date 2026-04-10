import React, { useState } from 'react';
import {
  Search, Plus, Edit, Trash2, Calendar, Clock, DollarSign, Award,
  CheckCircle, UserCheck, Mail, Phone, X, Save, Star, TrendingUp,
  Shield, Zap, Users, ChevronRight
} from 'lucide-react';
import {
  useGetAllStaffsQuery,
  useGetSingleStaffQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useCreateStaffMutation,
  useGetAllBusinessesQuery
} from "../../app/service/slice";

/* ─── Global Styles ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

    .staff-root * { font-family: 'Sora', sans-serif; }
    .staff-root .mono { font-family: 'DM Mono', monospace; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    @keyframes pulse-ring {
      0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
      50%       { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes spin-slow { to { transform: rotate(360deg); } }

    .fade-up  { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .fade-up-1 { animation-delay: 0.05s; }
    .fade-up-2 { animation-delay: 0.10s; }
    .fade-up-3 { animation-delay: 0.15s; }
    .fade-up-4 { animation-delay: 0.20s; }

    .shimmer-bg {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 600px 100%;
      animation: shimmer 1.5s infinite linear;
    }

    .staff-card {
      position: relative;
      background: #fff;
      border: 1px solid rgba(226,232,240,0.8);
      border-radius: 20px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      overflow: hidden;
      cursor: default;
    }
    .staff-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(168,85,247,0.04) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 20px;
      pointer-events: none;
    }
    .staff-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 60px rgba(99,102,241,0.15), 0 8px 24px rgba(0,0,0,0.06);
      border-color: rgba(99,102,241,0.3);
    }
    .staff-card:hover::before { opacity: 1; }

    .stat-card {
      border-radius: 20px;
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
      cursor: default;
      position: relative;
      overflow: hidden;
    }
    .stat-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 16px 40px rgba(0,0,0,0.12);
    }

    .tab-btn {
      position: relative;
      padding: 12px 20px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.2s ease;
      cursor: pointer;
      white-space: nowrap;
    }
    .tab-btn.active {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      box-shadow: 0 4px 16px rgba(99,102,241,0.4);
    }
    .tab-btn:not(.active) {
      color: #64748b;
      background: transparent;
    }
    .tab-btn:not(.active):hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 0 4px 20px rgba(99,102,241,0.4);
      position: relative;
      overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      pointer-events: none;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(99,102,241,0.55);
    }
    .btn-primary:active { transform: scale(0.97); }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
      color: #475569;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-ghost:hover {
      background: #fff;
      border-color: #6366f1;
      color: #6366f1;
      box-shadow: 0 4px 12px rgba(99,102,241,0.15);
      transform: translateY(-1px);
    }

    .btn-edit {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 10px rgba(99,102,241,0.35);
    }
    .btn-edit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99,102,241,0.5);
    }
    .btn-edit:active { transform: scale(0.95); }

    .btn-delete {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 9px 12px;
      background: #fff0f0;
      color: #ef4444;
      border-radius: 12px;
      border: 1.5px solid #fecaca;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-delete:hover {
      background: #ef4444;
      color: #fff;
      border-color: #ef4444;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(239,68,68,0.4);
    }
    .btn-delete:active { transform: scale(0.95); }

    .search-input {
      width: 100%;
      padding: 14px 16px 14px 48px;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      font-size: 14px;
      font-family: 'Sora', sans-serif;
      background: #fff;
      color: #1e293b;
      transition: all 0.2s ease;
      outline: none;
    }
    .search-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
    }
    .search-input::placeholder { color: #94a3b8; }

    .avatar-ring {
      animation: pulse-ring 3s ease infinite;
    }

    .modal-overlay {
      animation: fadeUp 0.2s ease both;
      background: rgba(15,23,42,0.6);
      backdrop-filter: blur(6px);
    }
    .modal-card {
      animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      font-family: 'Sora', sans-serif;
      color: #1e293b;
      background: #f8fafc;
      transition: all 0.2s ease;
      outline: none;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: #6366f1;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }
    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 6px;
    }

    .toggle-track {
      width: 40px; height: 22px;
      border-radius: 11px;
      position: relative;
      transition: background 0.2s ease;
      cursor: pointer;
      flex-shrink: 0;
      border: none;
    }
    .toggle-thumb {
      position: absolute;
      top: 3px;
      width: 16px; height: 16px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      transition: transform 0.2s ease;
    }

    .badge-active {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #15803d;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Decorative mesh bg for root */
    .mesh-bg {
      background-color: #f0f4ff;
      background-image:
        radial-gradient(at 20% 10%, rgba(99,102,241,0.12) 0%, transparent 55%),
        radial-gradient(at 80% 90%, rgba(168,85,247,0.10) 0%, transparent 55%),
        radial-gradient(at 60% 40%, rgba(59,130,246,0.07) 0%, transparent 45%);
      min-height: 100vh;
    }
  `}</style>
);

/* ─── Avatar Gradient ───────────────────────────────────────────────────────── */
const GRAD_SETS = [
  ['#6366f1','#8b5cf6'], ['#3b82f6','#06b6d4'],
  ['#10b981','#14b8a6'], ['#f59e0b','#f97316'],
  ['#ec4899','#f43f5e'], ['#8b5cf6','#6366f1'],
];
const avatarGrad = (name = '') =>
  GRAD_SETS[(name.charCodeAt(0) || 0) % GRAD_SETS.length];

/* ─── Stat Card ─────────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, from, to, delay = '' }) => (
  <div className={`stat-card fade-up ${delay} p-6`}
    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
    <div style={{ position:'absolute', top:16, right:16, width:60, height:60,
      borderRadius:'50%', background:'rgba(255,255,255,0.12)' }} />
    <div style={{
      width: 44, height: 44, borderRadius: 14,
      background: 'rgba(255,255,255,0.22)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 16, backdropFilter: 'blur(4px)'
    }}>
      <Icon size={20} color="#fff" />
    </div>
    <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
      textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
    <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</p>
  </div>
);

/* ─── Staff Card ─────────────────────────────────────────────────────────────── */
const StaffCard = ({ member, onEdit, onDelete, onSchedule, delay = '' }) => {
  const [g1, g2] = avatarGrad(member.first_name);
  return (
    <div className={`staff-card fade-up ${delay}`}>
      {/* Top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${g1}, ${g2})` }} />

      <div style={{ padding: '20px 20px 16px' }}>
        {/* Avatar + Name */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: `linear-gradient(135deg, ${g1}, ${g2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0,
            boxShadow: `0 6px 20px ${g1}55`
          }}>
            {member.first_name?.[0]}{member.last_name?.[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 2 }}>
              {member.first_name} {member.last_name}
            </p>
            <p style={{ fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>
              {member.role || 'Staff Member'}
            </p>
          </div>
          <span className="badge-active" style={{ flexShrink:0 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e',
              display:'inline-block', boxShadow:'0 0 6px #22c55e' }} />
            Active
          </span>
        </div>

        {/* Contact info */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18,
          padding:'12px 14px', background:'#f8fafc', borderRadius:12, border:'1px solid #f1f5f9' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:7, background:'#ede9fe',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Mail size={11} color="#7c3aed" />
            </div>
            <span style={{ fontSize:12, color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {member.email_id}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:7, background:'#dbeafe',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Phone size={11} color="#2563eb" />
            </div>
            <span style={{ fontSize:12, color:'#475569' }}>{member.mobile_number || '—'}</span>
          </div>
        </div>

        {/* Rating row */}
        {/* <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:16 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < 4 ? '#f59e0b' : 'none'}
              color={i < 4 ? '#f59e0b' : '#d1d5db'} />
          ))}
          <span style={{ fontSize:11, color:'#94a3b8', marginLeft:4 }}>4.0 / 5.0</span>
        </div> */}

        {/* Action buttons */}
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-ghost" style={{ flex:1 }} onClick={onSchedule}>
            <Clock size={13} /> Schedule
          </button>
          <button className="btn-edit" style={{ flex:1 }} onClick={onEdit}>
            <Edit size={13} /> Edit
          </button>
          <button className="btn-delete" onClick={onDelete}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main StaffPage ─────────────────────────────────────────────────────────── */
const StaffPage = () => {
  const [activeTab, setActiveTab]     = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStaffId, setEditingStaffId]   = useState(null);
  const [deletingStaffId, setDeletingStaffId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStaff, setSelectedStaff]     = useState(null);

  const { data: staffList = [], isLoading, refetch } = useGetAllStaffsQuery();

  const filtered = staffList.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'all',        label: 'All Staff' },
    { id: 'roles',      label: 'Roles & Permissions' },
    { id: 'schedule',   label: 'Working Hours' },
    { id: 'leave',      label: 'Leave Management' },
    { id: 'commission', label: 'Performance' },
  ];

  return (
    <div className="staff-root mesh-bg" style={{ padding:'32px 28px', minHeight:'100vh' }}>
      <GlobalStyles />

      {/* ── Header ── */}
      <div className="fade-up" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <p style={{ fontSize:12, fontWeight:700, color:'#6366f1', textTransform:'uppercase',
            letterSpacing:'0.1em', marginBottom:4 }}>Team Management</p>
          <h1 style={{ fontSize:28, fontWeight:800, color:'#0f172a', lineHeight:1.1, margin:0 }}>
            Staff Dashboard
          </h1>
          <p style={{ fontSize:13, color:'#64748b', marginTop:6 }}>
            {staffList.length} team member{staffList.length !== 1 ? 's' : ''} · All departments
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Add Staff Member
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        <StatCard icon={Users}      label="Total Staff"  value={staffList.length} from="#6366f1" to="#8b5cf6" delay="fade-up-1" />
        <StatCard icon={CheckCircle} label="Active"      value={staffList.length} from="#10b981" to="#06b6d4" delay="fade-up-2" />
        <StatCard icon={Calendar}   label="On Leave"     value="0"                from="#f59e0b" to="#f97316" delay="fade-up-3" />
        <StatCard icon={Star}       label="Avg Rating"   value=""              from="#ec4899" to="#8b5cf6" delay="fade-up-4" />
      </div>

      {/* ── Tabs ── */}
      <div className="fade-up" style={{
        display:'flex', gap:6, marginBottom:24, padding:'6px',
        background:'#fff', borderRadius:16, width:'fit-content',
        boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:'1px solid #f1f5f9'
      }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'all' && (
        <>
          {/* ── Search ── */}
          <div className="fade-up" style={{ position:'relative', marginBottom:24, maxWidth:460 }}>
            <Search size={16} color="#94a3b8" style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
            <input className="search-input" type="text"
              placeholder="Search by name or email…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{
                position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                background:'#e2e8f0', border:'none', borderRadius:6, padding:'3px 6px',
                cursor:'pointer', display:'flex', alignItems:'center'
              }}>
                <X size={12} color="#64748b" />
              </button>
            )}
          </div>

          {/* ── Staff Grid ── */}
          {isLoading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{ borderRadius:20, overflow:'hidden', height:260 }}>
                  <div className="shimmer-bg" style={{ height:'100%' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 20px',
              background:'#fff', borderRadius:24, border:'2px dashed #e2e8f0' }}>
              <div style={{ width:64, height:64, background:'#f1f5f9', borderRadius:20,
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Users size={28} color="#94a3b8" />
              </div>
              <p style={{ fontWeight:700, color:'#1e293b', marginBottom:6 }}>No staff found</p>
              <p style={{ fontSize:13, color:'#94a3b8' }}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Add your first staff member'}
              </p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20 }}>
              {filtered.map((member, idx) => (
                <StaffCard key={member.id} member={member}
                  delay={`fade-up-${(idx % 4) + 1}`}
                  onEdit={() => setEditingStaffId(member.id)}
                  onDelete={() => setDeletingStaffId(member.id)}
                  onSchedule={() => { setSelectedStaff(member); setShowScheduleModal(true); }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Modals ── */}
      {showCreateModal  && <CreateStaffModal  onClose={() => { setShowCreateModal(false);  refetch(); }} />}
      {editingStaffId   && <UpdateStaffModal  id={editingStaffId}  onClose={() => { setEditingStaffId(null);  refetch(); }} />}
      {deletingStaffId  && <DeleteStaffModal  id={deletingStaffId} onClose={() => setDeletingStaffId(null)} onSuccess={() => { setDeletingStaffId(null); refetch(); }} />}
      {showScheduleModal && selectedStaff && <ScheduleModal staff={selectedStaff} onClose={() => setShowScheduleModal(false)} />}
    </div>
  );
};

/* ─── Schedule Modal ────────────────────────────────────────────────────────── */
const ScheduleModal = ({ staff, onClose }) => {
  const DAYS = [
    { key:'monday',    short:'Mon', full:'Monday'    },
    { key:'tuesday',   short:'Tue', full:'Tuesday'   },
    { key:'wednesday', short:'Wed', full:'Wednesday' },
    { key:'thursday',  short:'Thu', full:'Thursday'  },
    { key:'friday',    short:'Fri', full:'Friday'    },
    { key:'saturday',  short:'Sat', full:'Saturday'  },
    { key:'sunday',    short:'Sun', full:'Sunday'    },
  ];

  const [schedule, setSchedule] = useState({
    monday:    { active:true,  start:'09:00', end:'18:00' },
    tuesday:   { active:true,  start:'09:00', end:'18:00' },
    wednesday: { active:true,  start:'09:00', end:'18:00' },
    thursday:  { active:true,  start:'09:00', end:'18:00' },
    friday:    { active:true,  start:'09:00', end:'18:00' },
    saturday:  { active:true,  start:'10:00', end:'16:00' },
    sunday:    { active:false, start:'',      end:''      },
  });

  const toggle = d => setSchedule(p => ({ ...p, [d]: { ...p[d], active: !p[d].active } }));
  const setTime = (d, f, v) => setSchedule(p => ({ ...p, [d]: { ...p[d], [f]: v } }));

  const totalH = Object.values(schedule).reduce((sum, s) => {
    if (!s.active || !s.start || !s.end) return sum;
    const [sh,sm] = s.start.split(':').map(Number);
    const [eh,em] = s.end.split(':').map(Number);
    return sum + (eh + em/60) - (sh + sm/60);
  }, 0);
  const activeDays = Object.values(schedule).filter(s => s.active).length;

  return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
      <div className="modal-card" style={{ background:'#fff', borderRadius:24, width:'100%', maxWidth:520, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.22)' }}>

        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', padding:'24px 24px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:14, background:'rgba(255,255,255,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
                <Clock size={20} color="#fff" />
              </div>
              <div>
                <p style={{ color:'#fff', fontWeight:800, fontSize:16 }}>Working Schedule</p>
                <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>{staff.first_name} {staff.last_name}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.2)',
              border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}>
              <X size={15} color="#fff" />
            </button>
          </div>
          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {[
              { label:'Work Days', val: activeDays },
              { label:'Weekly Hrs', val: `${totalH.toFixed(0)}h` },
              { label:'Days Off', val: 7 - activeDays },
            ].map(({label,val}) => (
              <div key={label} style={{ background:'rgba(255,255,255,0.15)', borderRadius:12,
                padding:'10px 12px', textAlign:'center', backdropFilter:'blur(4px)' }}>
                <p style={{ color:'#fff', fontWeight:800, fontSize:20, lineHeight:1 }}>{val}</p>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:10, marginTop:3 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Day rows */}
        <div style={{ padding:'16px 20px', maxHeight:340, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
          {DAYS.map(({key, short}) => {
            const s = schedule[key];
            return (
              <div key={key} style={{
                display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                borderRadius:14, border:`1px solid ${s.active ? '#e0e7ff' : '#f1f5f9'}`,
                background: s.active ? '#f5f3ff' : '#f8fafc',
                transition:'all 0.2s ease', opacity: s.active ? 1 : 0.65
              }}>
                <span style={{ width:32, fontSize:11, fontWeight:700, color: s.active ? '#6366f1' : '#94a3b8',
                  textTransform:'uppercase', letterSpacing:'0.05em' }}>{short}</span>

                <button className="toggle-track" onClick={() => toggle(key)}
                  style={{ background: s.active ? '#6366f1' : '#cbd5e1' }}>
                  <span className="toggle-thumb" style={{ transform: s.active ? 'translateX(18px)' : 'translateX(3px)' }} />
                </button>

                {s.active ? (
                  <div style={{ display:'flex', alignItems:'center', gap:8, flex:1 }}>
                    {['start','end'].map((field, fi) => (
                      <React.Fragment key={field}>
                        {fi === 1 && <span style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>→</span>}
                        <input type="time" value={s[field]}
                          onChange={e => setTime(key, field, e.target.value)}
                          style={{ flex:1, padding:'7px 10px', border:'1.5px solid #c7d2fe', borderRadius:10,
                            fontSize:12, fontFamily:'DM Mono, monospace', color:'#4338ca', background:'#fff',
                            outline:'none', cursor:'pointer' }} />
                      </React.Fragment>
                    ))}
                    {s.start && s.end && (() => {
                      const [sh,sm]=s.start.split(':').map(Number), [eh,em]=s.end.split(':').map(Number);
                      const h=(eh+em/60)-(sh+sm/60);
                      return h>0 ? <span style={{ fontSize:10, color:'#6366f1', fontWeight:700, width:28, textAlign:'right', flexShrink:0 }}>{h.toFixed(0)}h</span> : null;
                    })()}
                  </div>
                ) : (
                  <span style={{ fontSize:11, background:'#e2e8f0', color:'#94a3b8',
                    borderRadius:999, padding:'3px 12px', fontWeight:600 }}>Day Off</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 20px', borderTop:'1px solid #f1f5f9', display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'11px', border:'1.5px solid #e2e8f0',
            borderRadius:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:13,
            cursor:'pointer', fontFamily:'Sora, sans-serif', transition:'all 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background='#f8fafc'}>
            Cancel
          </button>
          <button onClick={onClose} className="btn-primary" style={{ flex:1, justifyContent:'center' }}>
            <Save size={14} /> Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Form Field Helper ─────────────────────────────────────────────────────── */
const Field = ({ label, name, type='text', value, onChange, required, as }) => (
  <div>
    <label className="form-label">{label}{required && <span style={{color:'#ef4444', marginLeft:2}}>*</span>}</label>
    {as === 'select' ? null : (
      <input className="form-input" type={type} name={name} value={value}
        onChange={onChange} required={required} />
    )}
  </div>
);

/* ─── Create Staff Modal ────────────────────────────────────────────────────── */
const CreateStaffModal = ({ onClose }) => {
  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const { data: businesses = [] } = useGetAllBusinessesQuery();
  const [form, setForm] = useState({
    first_name:'', last_name:'', email_id:'',
    mobile_number:'', username:'', password:'', role:'staff', business_id:''
  });
  const chg = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = async e => {
    e.preventDefault();
    try { await createStaff(form).unwrap(); onClose(); }
    catch (err) { alert(err?.data?.message || 'Failed to create staff'); }
  };

  const FIELDS = [
    { label:'First Name',  name:'first_name',     type:'text'     },
    { label:'Last Name',   name:'last_name',       type:'text'     },
    { label:'Email',       name:'email_id',        type:'email'    },
    { label:'Phone',       name:'mobile_number',   type:'text'     },
    { label:'Username',    name:'username',        type:'text'     },
    { label:'Password',    name:'password',        type:'password' },
  ];

  return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
      <div className="modal-card staff-root" style={{ background:'#fff', borderRadius:24, width:'100%', maxWidth:560, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.22)', maxHeight:'92vh', display:'flex', flexDirection:'column' }}>
        <div style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', padding:'24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <p style={{ color:'#fff', fontWeight:800, fontSize:17 }}>Add New Staff Member</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, marginTop:2 }}>Onboard a new team member</p>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.2)',
              border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}>
              <X size={15} color="#fff" />
            </button>
          </div>
        </div>

        <form onSubmit={submit} style={{ padding:'24px', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {FIELDS.map(f => (
              <div key={f.name}>
                <label className="form-label">{f.label} <span style={{color:'#ef4444'}}>*</span></label>
                <input className="form-input" type={f.type} name={f.name} value={form[f.name]} onChange={chg} required />
              </div>
            ))}
            <div style={{ gridColumn:'span 2' }}>
              <label className="form-label">Assign Business <span style={{color:'#ef4444'}}>*</span></label>
              <select className="form-input" name="business_id" value={form.business_id} onChange={chg} required style={{ cursor:'pointer' }}>
                <option value="">Select Business</option>
                {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, paddingTop:4 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'12px', border:'1.5px solid #e2e8f0',
              borderRadius:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:13,
              cursor:'pointer', fontFamily:'Sora, sans-serif', transition:'all 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background='#f8fafc'}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ flex:1, justifyContent:'center' }}>
              {isLoading ? 'Creating…' : <><Plus size={15} /> Create Member</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Update Staff Modal ────────────────────────────────────────────────────── */
const UpdateStaffModal = ({ id, onClose }) => {
  const { data, isLoading } = useGetSingleStaffQuery(id);
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [form, setForm] = useState({
    first_name:'', last_name:'', email_id:'', mobile_number:'', username:''
  });
  React.useEffect(() => {
    if (data) setForm({
      first_name: data.first_name || '', last_name: data.last_name || '',
      email_id: data.email_id || '', mobile_number: data.mobile_number || '',
      username: data.username || ''
    });
  }, [data]);
  const chg = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = async e => {
    e.preventDefault();
    try { await updateStaff({ id, body: form }).unwrap(); onClose(); }
    catch { alert('Update failed'); }
  };

  if (isLoading) return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
      <div style={{ background:'#fff', borderRadius:24, padding:40, textAlign:'center' }}>
        <p style={{ color:'#64748b' }}>Loading…</p>
      </div>
    </div>
  );

  const FIELDS = [
    { label:'First Name', name:'first_name' }, { label:'Last Name', name:'last_name' },
    { label:'Username',   name:'username'   }, { label:'Phone',     name:'mobile_number' },
  ];

  return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
      <div className="modal-card staff-root" style={{ background:'#fff', borderRadius:24, width:'100%', maxWidth:520, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.22)' }}>
        <div style={{ background:'linear-gradient(135deg,#3b82f6,#6366f1)', padding:'24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <p style={{ color:'#fff', fontWeight:800, fontSize:17 }}>Edit Staff Profile</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, marginTop:2 }}>Update {data?.first_name}'s details</p>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.2)',
              border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}>
              <X size={15} color="#fff" />
            </button>
          </div>
        </div>

        <form onSubmit={submit} style={{ padding:'24px', display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {FIELDS.map(f => (
              <div key={f.name}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" name={f.name} value={form[f.name]} onChange={chg} required />
              </div>
            ))}
            <div style={{ gridColumn:'span 2' }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email_id" value={form.email_id} onChange={chg} required />
            </div>
          </div>
          <div style={{ display:'flex', gap:10, paddingTop:4 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:'12px', border:'1.5px solid #e2e8f0',
              borderRadius:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:13,
              cursor:'pointer', fontFamily:'Sora, sans-serif', transition:'all 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background='#f8fafc'}>
              Cancel
            </button>
            <button type="submit" disabled={isUpdating} style={{
              flex:1, padding:'12px', background:'linear-gradient(135deg,#3b82f6,#6366f1)',
              border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:13,
              cursor:'pointer', fontFamily:'Sora, sans-serif', transition:'all 0.2s ease',
              boxShadow:'0 4px 16px rgba(59,130,246,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(59,130,246,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(59,130,246,0.4)'; }}>
              <Save size={14} /> {isUpdating ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Delete Staff Modal ────────────────────────────────────────────────────── */
const DeleteStaffModal = ({ id, onClose, onSuccess }) => {
  const { data: staffData, isLoading: isFetching } = useGetSingleStaffQuery(id);
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const del = async () => {
    try { await deleteStaff(id).unwrap(); onSuccess(); }
    catch { alert('Error deleting staff'); }
  };

  if (isFetching) return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}>
      <div style={{ background:'#fff', borderRadius:24, padding:40 }}><p style={{color:'#64748b'}}>Loading…</p></div>
    </div>
  );

  return (
    <div className="modal-overlay" style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
      <div className="modal-card staff-root" style={{ background:'#fff', borderRadius:24, width:'100%', maxWidth:380, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.22)' }}>
        <div style={{ padding:'36px 28px 28px', textAlign:'center' }}>
          <div style={{ width:72, height:72, background:'linear-gradient(135deg,#fecaca,#fca5a5)',
            borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px',
            boxShadow:'0 8px 24px rgba(239,68,68,0.25)' }}>
            <Trash2 size={30} color="#dc2626" />
          </div>
          <p style={{ fontSize:19, fontWeight:800, color:'#0f172a', marginBottom:6 }}>Delete Staff Account</p>
          <p style={{ fontSize:13, color:'#64748b', marginBottom:4 }}>You're about to permanently delete</p>
          <p style={{ fontSize:15, fontWeight:700, color:'#1e293b', marginBottom:6 }}>
            {staffData?.first_name} {staffData?.last_name}
          </p>
          <p style={{ fontSize:12, color:'#94a3b8', marginBottom:24, fontFamily:'DM Mono, monospace' }}>
            @{staffData?.username}
          </p>
          <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:12, padding:'10px 14px', marginBottom:24 }}>
            <p style={{ fontSize:12, color:'#c2410c', fontWeight:600 }}>⚠ This action cannot be undone.</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={onClose} disabled={isDeleting} style={{ flex:1, padding:'12px', border:'1.5px solid #e2e8f0',
              borderRadius:12, background:'#f8fafc', color:'#64748b', fontWeight:600, fontSize:13,
              cursor:'pointer', fontFamily:'Sora, sans-serif', transition:'all 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.background='#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background='#f8fafc'}>
              Cancel
            </button>
            <button onClick={del} disabled={isDeleting} style={{
              flex:1, padding:'12px', background:'linear-gradient(135deg,#ef4444,#dc2626)',
              border:'none', borderRadius:12, color:'#fff', fontWeight:700, fontSize:13,
              cursor:'pointer', fontFamily:'Sora, sans-serif', transition:'all 0.2s ease',
              boxShadow:'0 4px 16px rgba(239,68,68,0.4)',
              display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(239,68,68,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 16px rgba(239,68,68,0.4)'; }}>
              <Trash2 size={14} /> {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;