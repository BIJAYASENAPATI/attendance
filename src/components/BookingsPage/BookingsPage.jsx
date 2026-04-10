import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import "./BookingsPage.css"
import {
  Calendar, Clock, Search, Filter, Plus, Edit2, Trash2, X, Check,
  AlertCircle, MoreVertical, ChevronLeft, ChevronRight, Users, Phone,
  Mail, MapPin, DollarSign, FileText, Repeat, UserX, RefreshCw,
  Tag, Pencil, CheckCircle2, Circle, Layers, ShieldCheck, CalendarDays, ArrowLeft,
  User, Lock, Loader2, ExternalLink,
} from 'lucide-react';
import {
  useGetAllBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useGetAllBookingStatusesQuery,
  useCreateBookingStatusMutation,
  useUpdateBookingStatusEntityMutation,
  useDeleteBookingStatusEntityMutation,
  useGetCustomersByBusinessQuery,
  useGetServicesByBusinessQuery,
  useGetSlotsByServiceZoneQuery,
  useGetAllServiceZonesQuery,
  useCreateCustomerMutation,
  useGetPricesByBusinessQuery,
  useCreateServicePriceMutation,
  useCreateSlotMutation,
} from '../../app/service/slice';

// INLINE CUSTOMER CREATION MODAL
const BLANK_CUSTOMER = {
  first_name: '', last_name: '', middle_name: '',
  email_id: '', mobile_country_code: '+91', mobile_number: '',
  alternate_mobile_number_country_code: '+91', alternate_mobile_number: '',
  username: '', password: '',
};

const InlineCustomerCreationModal = ({ onClose, onCustomerCreated, initialSearch = '' }) => {
  const [form, setForm] = useState(() => {
    const isPhone = /^\d{10}$/.test(initialSearch);
    return { ...BLANK_CUSTOMER, ...(isPhone ? { mobile_number: initialSearch } : {}) };
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await createCustomer(form).unwrap();
      setSuccess(true);
      setTimeout(() => {
        onCustomerCreated(result);
        onClose();
      }, 800);
    } catch (err) {
      setError(err?.data?.message || 'Failed to create customer. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto">
        <div className="flex justify-between items-start px-6 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              Create New Customer
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-10">Add customer details to continue with booking</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm text-red-600">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User size={14} className="text-blue-500" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Information</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">First Name <span className="text-red-500">*</span></label>
                  <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required placeholder="John"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Doe"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Middle Name</label>
                <input type="text" name="middle_name" value={form.middle_name} onChange={handleChange} placeholder="(optional)"
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Mail size={14} className="text-emerald-500" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Details</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email_id" value={form.email_id} onChange={handleChange} required placeholder="john@example.com"
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input name="mobile_country_code" value={form.mobile_country_code} onChange={handleChange} placeholder="+91"
                    className="w-20 text-center px-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  <input name="mobile_number" value={form.mobile_number} onChange={handleChange} required placeholder="9876543210"
                    className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Alternate Mobile</label>
                <div className="flex gap-2">
                  <input name="alternate_mobile_number_country_code" value={form.alternate_mobile_number_country_code} onChange={handleChange} placeholder="+91"
                    className="w-20 text-center px-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  <input name="alternate_mobile_number" value={form.alternate_mobile_number} onChange={handleChange} placeholder="9876543210"
                    className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Lock size={14} className="text-purple-500" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Login Credentials</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Username <span className="text-red-500">*</span></label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} required placeholder="johndoe"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Password <span className="text-red-500">*</span></label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 chars"
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">Once created, you can immediately select this customer for your booking.</p>
            </div>

            <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-2">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={isCreating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg">
                {isCreating ? <><Loader2 size={14} className="animate-spin" /> Creating Customer...</> : <><Check size={14} /> Create & Continue</>}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Customer Created!</h3>
            <p className="text-sm text-gray-500">Returning to booking form...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// CALENDAR HELPERS
const toYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const todayYMD = toYMD(new Date());

const fmtTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const STATUS_STYLE = {
  confirmed: { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', border: '#bfdbfe' },
  pending:   { bg: '#fffbeb', text: '#b45309', dot: '#f59e0b', border: '#fde68a' },
  completed: { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e', border: '#bbf7d0' },
  cancelled: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', border: '#fecaca' },
  'no-show': { bg: '#fff7ed', text: '#c2410c', dot: '#f97316', border: '#fed7aa' },
  default:   { bg: '#f8fafc', text: '#475569', dot: '#94a3b8', border: '#e2e8f0' },
};
const getStatusStyle = (s = '') => STATUS_STYLE[s.toLowerCase()] || STATUS_STYLE.default;

// ─── Single booking card in calendar panel ────────────────────────────────
const CalBookingCard = ({ booking }) => {
  const st = getStatusStyle(booking.booking_status?.status || '');
  const name = [booking.customer?.first_name, booking.customer?.last_name].filter(Boolean).join(' ') || 'Unknown';
  const startTime = booking.slot?.start_time ? fmtTime(booking.slot.start_time) : null;
  const endTime   = booking.slot?.end_time   ? fmtTime(booking.slot.end_time)   : null;

  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${st.border}`,
      borderLeft: `4px solid ${st.dot}`,
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all .18s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg,${st.dot}33,${st.dot}88)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 17, color: st.text, border: `1.5px solid ${st.border}`,
      }}>
        {name[0]?.toUpperCase() || '?'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
        <p style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{booking.service?.name || '—'}</p>
      </div>

      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        {startTime && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 5 }}>
            <Clock size={11} color="#94a3b8" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
              {startTime}{endTime ? ` – ${endTime}` : ''}
            </span>
          </div>
        )}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999,
          background: st.bg, color: st.text, border: `1px solid ${st.border}`,
          display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'capitalize',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.dot, display: 'inline-block' }} />
          {booking.booking_status?.status || 'Unknown'}
        </span>
      </div>
    </div>
  );
};

// CALENDAR VIEW COMPONENT
const CalendarView = ({ bookings, isLoading, onBack }) => {
  const now = new Date();
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayYMD);

  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      const d = b.slot?.date || b.booking_date || b.date || b.created_at?.slice(0, 10);
      if (!d) return;
      if (!map[d]) map[d] = [];
      map[d].push(b);
    });
    return map;
  }, [bookings]);

  const selectedBookings = useMemo(() => {
    const list = bookingsByDate[selectedDate] || [];
    return [...list].sort((a, b) =>
      (a.slot?.start_time || '').localeCompare(b.slot?.start_time || '')
    );
  }, [bookingsByDate, selectedDate]);

  const stats = useMemo(() => {
    const total     = selectedBookings.length;
    const confirmed = selectedBookings.filter(b => b.booking_status?.status?.toLowerCase() === 'confirmed').length;
    const pending   = selectedBookings.filter(b => b.booking_status?.status?.toLowerCase() === 'pending').length;
    const completed = selectedBookings.filter(b => b.booking_status?.status?.toLowerCase() === 'completed').length;
    return { total, confirmed, pending, completed };
  }, [selectedBookings]);

  const calCells = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [calYear, calMonth]);

  const makeYMD = (day) =>
    `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };
  const goToday = () => {
    const t = new Date();
    setCalYear(t.getFullYear());
    setCalMonth(t.getMonth());
    setSelectedDate(todayYMD);
  };

  const selectDate = (ymd) => setSelectedDate(ymd);

  const quickPills = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + (i - 1));
      const ymd = toYMD(d);
      let label;
      if (i === 0) label = 'Yesterday';
      else if (i === 1) label = 'Today';
      else if (i === 2) label = 'Tomorrow';
      else label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      return { ymd, label, count: (bookingsByDate[ymd] || []).length };
    });
  }, [bookingsByDate]);

  const panelLabel = () => {
    if (selectedDate === todayYMD) return "Today's Bookings";
    const tom = new Date(); tom.setDate(tom.getDate() + 1);
    if (selectedDate === toYMD(tom)) return "Tomorrow's Bookings";
    const d = new Date(selectedDate + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const panelTag = () => {
    if (selectedDate === todayYMD) return '📅 Today';
    if (selectedDate < todayYMD)   return '📆 Past';
    return '🗓 Upcoming';
  };

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button
            onClick={onBack}
            style={{ display:'flex', alignItems:'center', gap:6, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'7px 14px', color:'#475569', fontSize:13, fontWeight:600, cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', transition:'all .15s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#2563eb'; e.currentTarget.style.color='#2563eb'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#475569'; }}
          >
            <ArrowLeft size={14}/> Back to List
          </button>
          <div>
            <h2 style={{ fontWeight:800, fontSize:20, color:'#0f172a', margin:0 }}>Calendar View</h2>
            <p style={{ fontSize:12, color:'#94a3b8', margin:'2px 0 0' }}>Click any date to view its bookings</p>
          </div>
        </div>
        <button
          onClick={goToday}
          style={{ background:'linear-gradient(135deg,#2563eb,#3b82f6)', border:'none', borderRadius:10, padding:'8px 18px', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,.35)', transition:'all .18s' }}
          onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e=>e.currentTarget.style.transform='none'}
        >
          Jump to Today
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'310px 1fr', gap:20, alignItems:'start' }}>
        <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #e8ecf4', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)', padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <button onClick={prevMonth} style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.28)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}>
                <ChevronLeft size={16} color="#fff"/>
              </button>
              <div style={{ textAlign:'center' }}>
                <p style={{ color:'#fff', fontWeight:800, fontSize:16, margin:0 }}>{MONTHS[calMonth]}</p>
                <p style={{ color:'rgba(255,255,255,.65)', fontSize:12, margin:'2px 0 0' }}>{calYear}</p>
              </div>
              <button onClick={nextMonth} style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.28)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}>
                <ChevronRight size={16} color="#fff"/>
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
              {WEEKDAYS.map(d => (
                <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'rgba(255,255,255,.6)', padding:'4px 0', textTransform:'uppercase', letterSpacing:'.05em' }}>{d}</div>
              ))}
            </div>
          </div>

          <div style={{ padding:'12px 14px 16px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
              {calCells.map((day, idx) => {
                if (!day) return <div key={`blank-${idx}`} />;
                const ymd        = makeYMD(day);
                const isToday    = ymd === todayYMD;
                const isSelected = ymd === selectedDate;
                const isPast     = ymd < todayYMD;
                const count      = (bookingsByDate[ymd] || []).length;
                return (
                  <button
                    key={ymd}
                    onClick={() => selectDate(ymd)}
                    style={{
                      position:'relative', width:'100%', aspectRatio:'1', borderRadius:10,
                      border: isSelected ? '2px solid #2563eb' : isToday ? '2px solid #93c5fd' : '2px solid transparent',
                      background: isSelected ? 'linear-gradient(135deg,#2563eb,#3b82f6)' : isToday ? '#eff6ff' : 'transparent',
                      color: isSelected ? '#fff' : isToday ? '#1d4ed8' : isPast ? '#94a3b8' : '#1e293b',
                      fontWeight: isSelected || isToday ? 700 : 500,
                      fontSize: 12.5, cursor:'pointer',
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                      gap:2, transition:'all .15s', padding:'4px 2px',
                    }}
                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background='#f1f5f9'; e.currentTarget.style.borderColor='#cbd5e1'; } }}
                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = isToday ? '#eff6ff' : 'transparent'; e.currentTarget.style.borderColor = isToday ? '#93c5fd' : 'transparent'; } }}
                  >
                    {day}
                    {count > 0 && (
                      <span style={{ fontSize:8, fontWeight:700, background: isSelected ? 'rgba(255,255,255,.3)' : '#2563eb', color:'#fff', borderRadius:999, padding:'1px 4px', minWidth:14, textAlign:'center', lineHeight:'14px' }}>
                        {count > 9 ? '9+' : count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ display:'flex', gap:14, marginTop:14, paddingTop:12, borderTop:'1px solid #f1f5f9', flexWrap:'wrap' }}>
              {[
                { label:'Selected',     el: <span style={{ width:14, height:14, borderRadius:4, background:'#2563eb', display:'inline-block' }} /> },
                { label:'Today',        el: <span style={{ width:14, height:14, borderRadius:4, background:'#eff6ff', border:'2px solid #93c5fd', display:'inline-block' }} /> },
                { label:'Has bookings', el: <span style={{ width:6, height:6, borderRadius:'50%', background:'#2563eb', display:'inline-block', marginRight:2 }} /> },
              ].map(({ label, el }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  {el}
                  <span style={{ fontSize:10, color:'#64748b', fontWeight:600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display:'flex', gap:8, marginBottom:16, overflowX:'auto', paddingBottom:4, flexWrap:'wrap' }}>
            {quickPills.map(({ ymd, label, count }) => {
              const active = ymd === selectedDate;
              return (
                <button key={ymd} onClick={() => selectDate(ymd)}
                  style={{
                    padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0,
                    background: active ? 'linear-gradient(135deg,#2563eb,#3b82f6)' : '#fff',
                    color: active ? '#fff' : '#475569',
                    border: active ? 'none' : '1.5px solid #e2e8f0',
                    boxShadow: active ? '0 4px 14px rgba(37,99,235,.3)' : '0 1px 4px rgba(0,0,0,.05)',
                    display:'flex', alignItems:'center', gap:6, transition:'all .18s',
                  }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.borderColor='#2563eb'; }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.borderColor='#e2e8f0'; }}
                >
                  {label}
                  {count > 0 && (
                    <span style={{ background: active ? 'rgba(255,255,255,.25)' : '#eff6ff', color: active ? '#fff' : '#2563eb', fontSize:10, fontWeight:800, borderRadius:999, padding:'1px 6px', minWidth:16, textAlign:'center' }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ background:'linear-gradient(135deg,#1d4ed8,#2563eb 60%,#3b82f6)', borderRadius:18, padding:'18px 22px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, boxShadow:'0 8px 28px rgba(37,99,235,.25)' }}>
            <div>
              <p style={{ color:'rgba(255,255,255,.65)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:3 }}>{panelTag()}</p>
              <h3 style={{ color:'#fff', fontWeight:800, fontSize:18, margin:0 }}>{panelLabel()}</h3>
              <p style={{ color:'rgba(255,255,255,.6)', fontSize:12, margin:'4px 0 0' }}>
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              </p>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[
                { label:'Total',     val: stats.total,     bg:'rgba(255,255,255,.15)', border:'rgba(255,255,255,.2)' },
                { label:'Confirmed', val: stats.confirmed, bg:'rgba(34,197,94,.2)',    border:'rgba(134,239,172,.35)' },
                { label:'Pending',   val: stats.pending,   bg:'rgba(251,191,36,.2)',   border:'rgba(253,224,71,.35)' },
                { label:'Done',      val: stats.completed, bg:'rgba(99,102,241,.2)',   border:'rgba(165,180,252,.35)' },
              ].map(({ label, val, bg, border }) => (
                <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:12, padding:'8px 14px', textAlign:'center', minWidth:56 }}>
                  <p style={{ color:'#fff', fontWeight:800, fontSize:18, lineHeight:1, margin:0 }}>{val}</p>
                  <p style={{ color:'rgba(255,255,255,.6)', fontSize:9.5, fontWeight:600, marginTop:3, textTransform:'uppercase', letterSpacing:'.07em' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 0', background:'#fff', borderRadius:18, border:'1.5px solid #e8ecf4' }}>
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              <span style={{ marginLeft:10, color:'#64748b', fontWeight:600, fontSize:14 }}>Loading bookings…</span>
            </div>
          ) : selectedBookings.length === 0 ? (
            <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid #e8ecf4', padding:'48px 24px', textAlign:'center' }}>
              <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#dbeafe,#bfdbfe)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                <CalendarDays size={26} color="#2563eb"/>
              </div>
              <p style={{ fontWeight:800, fontSize:15, color:'#1e293b', marginBottom:6 }}>No bookings for this day</p>
              <p style={{ fontSize:12, color:'#94a3b8' }}>
                {selectedDate > todayYMD ? 'No bookings scheduled yet.' : selectedDate === todayYMD ? 'No bookings for today.' : 'No bookings on this date.'}
              </p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {selectedBookings.map((b, i) => <CalBookingCard key={b.id || i} booking={b} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// INLINE SERVICE PRICE FORM (shown inside booking modal when no price exists)
const InlineServicePriceForm = ({ serviceId, onPriceSaved }) => {
  const [createServicePrice, { isLoading: saving }] = useCreateServicePriceMutation();
  const [priceForm, setPriceForm] = useState({
    price: '',
    is_gst_applicable: false,
    cgst_percent: '',
    sgst_percent: '',
    igst_percent: '',
    sac_code: '',
  });
  const [priceError, setPriceError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPriceForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const totalGst = (parseFloat(priceForm.cgst_percent) || 0) +
                   (parseFloat(priceForm.sgst_percent) || 0) +
                   (parseFloat(priceForm.igst_percent) || 0);
  const baseAmt  = parseFloat(priceForm.price) || 0;
  const totalAmt = priceForm.is_gst_applicable
    ? (baseAmt * (1 + totalGst / 100)).toFixed(2)
    : baseAmt.toFixed(2);

  const handleSave = async (e) => {
    e.preventDefault();
    setPriceError('');
    if (!priceForm.price || parseFloat(priceForm.price) <= 0) {
      setPriceError('Please enter a valid price.');
      return;
    }
    try {
      const payload = {
        service_id: Number(serviceId),
        price: parseFloat(priceForm.price),
        total_price: parseFloat(totalAmt),
        is_gst_applicable: priceForm.is_gst_applicable,
        cgst_percent: parseFloat(priceForm.cgst_percent) || 0,
        sgst_percent: parseFloat(priceForm.sgst_percent) || 0,
        igst_percent: parseFloat(priceForm.igst_percent) || 0,
        sac_code: priceForm.sac_code,
      };
      const result = await createServicePrice(payload).unwrap();
      const saved = result?.data || result;
      onPriceSaved({ ...payload, ...saved });
    } catch (err) {
      setPriceError(err?.data?.message || 'Failed to save price. Please try again.');
    }
  };

  return (
    <div className="bg-white border-t-2 border-amber-200 p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <DollarSign size={13} className="text-white" />
        </div>
        <p className="text-sm font-bold text-gray-800">Set Service Price</p>
        <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">REQUIRED</span>
      </div>

      {priceError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600 font-semibold">
          <AlertCircle size={13} className="flex-shrink-0" />
          {priceError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">
            Base Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={priceForm.price}
            onChange={handleChange}
            placeholder="e.g. 1000"
            min="0"
            step="0.01"
            className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">SAC Code</label>
          <input
            type="text"
            name="sac_code"
            value={priceForm.sac_code}
            onChange={handleChange}
            placeholder="e.g. 998729"
            className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* GST toggle */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
        <input
          type="checkbox"
          id="inline_gst"
          name="is_gst_applicable"
          checked={priceForm.is_gst_applicable}
          onChange={handleChange}
          className="w-4 h-4 accent-amber-500 cursor-pointer"
        />
        <label htmlFor="inline_gst" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
          GST Applicable
        </label>
      </div>

      {priceForm.is_gst_applicable && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'CGST %', name: 'cgst_percent' },
            { label: 'SGST %', name: 'sgst_percent' },
            { label: 'IGST %', name: 'igst_percent' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">{label}</label>
              <input
                type="number"
                name={name}
                value={priceForm[name]}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
              />
            </div>
          ))}
          <div className="col-span-3 flex items-center justify-between px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xs text-amber-700 font-semibold">Total GST: {totalGst}%</span>
            <span className="text-xs text-amber-700 font-semibold">Total: ₹{totalAmt}</span>
          </div>
        </div>
      )}

      {/* Live preview */}
      {baseAmt > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
          <span className="text-xs font-bold text-green-700">Total Payable</span>
          <span className="text-lg font-bold text-green-900">
            ₹{parseFloat(totalAmt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !priceForm.price}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        {saving
          ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving Price…</>
          : <><Check size={16} /> Save Price & Continue Booking</>
        }
      </button>
    </div>
  );
};

// CREATE BOOKING MODAL
const CreateBookingModal = ({ onClose, customers, services, statuses, allServiceZones, onCreated }) => {
  const modalContentRef = useRef(null);

  const [createForm, setCreateForm] = useState({
    slot_id: '', customer_id: '', service_id: '', booking_status_id: '',
    amount: '', gst_percent: '0', total_amount: '', sac_code: '', discount_percent: '0'
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedServiceZoneId, setSelectedServiceZoneId] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);
  const [showInlinePriceForm, setShowInlinePriceForm] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const customerDropdownRef = useRef(null);
  const { refetch: refetchCustomers } = useGetCustomersByBusinessQuery();

  // ── Inline slot management panel state ─────────────────────────────────
  const [showSlotPanel, setShowSlotPanel] = useState(false);
  const [slotPanelTab, setSlotPanelTab] = useState('manual'); // 'auto' | 'manual' | 'bulk'
  const [slotCreatedMsg, setSlotCreatedMsg] = useState('');
  const [createSlot, { isLoading: creatingSlot }] = useCreateSlotMutation();

  // Manual tab state
  const [slotForm, setSlotForm] = useState({ start_time: '', end_time: '', capacity: 1 });
  const [showSlotForm, setShowSlotForm] = useState(false); // kept for compat

  // Auto-generator tab state
  const [autoSlot, setAutoSlot] = useState({
    start_time: '09:00', end_time: '17:00', duration: 30, gap: 0, capacity: 1,
  });
  const [autoPreview, setAutoPreview] = useState([]);
  const [autoGenerating, setAutoGenerating] = useState(false);

  // Bulk upload tab state
  const [bulkText, setBulkText] = useState('');
  const [bulkParsed, setBulkParsed] = useState([]);
  const [bulkErrors, setBulkErrors] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);

  // Manual tab inline error (replaces alert)
  const [manualError, setManualError] = useState('');

  // Fetch all prices for the business so we can auto-fill
  const businessId = localStorage.getItem('business_id');
  const { data: pricesResponse } = useGetPricesByBusinessQuery(businessId);
  const allPrices = useMemo(() => pricesResponse?.data || pricesResponse || [], [pricesResponse]);

  const { data: slotsData = [], isLoading: slotsLoading, refetch: refetchSlots } = useGetSlotsByServiceZoneQuery(
    { service_zone_id: selectedServiceZoneId, date: selectedDate },
    { skip: !selectedServiceZoneId || !selectedDate }
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target))
        setShowCustomerDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
    const phone = (c.mobile_number || '').toLowerCase();
    const q = customerSearch.toLowerCase();
    return fullName.includes(q) || phone.includes(q);
  });

  const handleCustomerSelect = useCallback((customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(`${customer.first_name} ${customer.last_name}`);
    setCreateForm(prev => ({ ...prev, customer_id: customer.id }));
    setShowCustomerDropdown(false);
  }, []);

  const handleCustomerSearchChange = useCallback((e) => {
    const val = e.target.value;
    setCustomerSearch(val);
    setShowCustomerDropdown(true);
    if (!val) { setSelectedCustomer(null); setCreateForm(prev => ({ ...prev, customer_id: '' })); }
  }, []);

  const handleCustomerCreated = useCallback((newCustomer) => {
    const customer = newCustomer?.data || newCustomer;
    setSelectedCustomer(customer);
    setCustomerSearch(`${customer.first_name} ${customer.last_name}`);
    setCreateForm(prev => ({ ...prev, customer_id: customer.id }));
    setShowCustomerDropdown(false);
    refetchCustomers();
  }, [refetchCustomers]);

  // Auto-recalculate total when amount / gst / discount changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const amt = parseFloat(createForm.amount) || 0;
      const gst = parseFloat(createForm.gst_percent) || 0;
      const disc = parseFloat(createForm.discount_percent) || 0;
      if (amt > 0) {
        const total = (amt * (1 + gst / 100) * (1 - disc / 100)).toFixed(2);
        setCreateForm(prev => prev.total_amount !== total ? { ...prev, total_amount: total } : prev);
      } else {
        setCreateForm(prev => ({ ...prev, total_amount: '' }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [createForm.amount, createForm.gst_percent, createForm.discount_percent]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleServiceChange = useCallback((serviceId) => {
    const confirmedStatus = statuses.find(s => s.status?.toLowerCase() === 'confirmed');
    const matchedPrice = Array.isArray(allPrices)
      ? allPrices.find(p => String(p.service_id) === String(serviceId))
      : null;
    setServicePrice(matchedPrice || null);
    const zones = allServiceZones.filter(z => String(z.service_id) === String(serviceId));
    setSelectedServiceZoneId(zones.length > 0 ? zones[0].id : null);
    setSelectedSlot(null);
    setSelectedDate('');
    // Reset slot panel when service changes
    setShowSlotPanel(false);
    setSlotPanelTab('manual');
    setSlotForm({ start_time: '', end_time: '', capacity: 1 });
    setAutoPreview([]);
    setBulkText('');
    setBulkParsed([]);
    setBulkErrors([]);
    setSlotCreatedMsg('');

    if (matchedPrice) {
      const baseAmt = Number(matchedPrice.price) || 0;
      const gstPct = matchedPrice.is_gst_applicable
        ? (
            (Number(matchedPrice.cgst_percent) || 0) +
            (Number(matchedPrice.sgst_percent) || 0) +
            (Number(matchedPrice.igst_percent) || 0)
          )
        : 0;
      const sacCode = matchedPrice.sac_code || '';
      const total = (baseAmt * (1 + gstPct / 100)).toFixed(2);
      setCreateForm(prev => ({
        ...prev,
        service_id: serviceId,
        slot_id: '',
        booking_status_id: confirmedStatus ? String(confirmedStatus.id) : prev.booking_status_id,
        amount: String(baseAmt),
        gst_percent: String(gstPct),
        sac_code: sacCode,
        discount_percent: '0',
        total_amount: total,
      }));
    } else {
      setCreateForm(prev => ({
        ...prev,
        service_id: serviceId,
        slot_id: '',
        booking_status_id: confirmedStatus ? String(confirmedStatus.id) : prev.booking_status_id,
        amount: '',
        gst_percent: '0',
        sac_code: '',
        discount_percent: '0',
        total_amount: '',
      }));
    }
  }, [allServiceZones, statuses, allPrices]);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCreateForm(prev => ({ ...prev, slot_id: '' }));
    // Reset slot panel when date changes
    setShowSlotPanel(false);
    setSlotPanelTab('manual');
    setSlotForm({ start_time: '', end_time: '', capacity: 1 });
    setAutoPreview([]);
    setBulkText('');
    setBulkParsed([]);
    setBulkErrors([]);
    setSlotCreatedMsg('');
  }, []);

  const handleSlotSelect = useCallback((slot) => {
    if (slot.is_booked || slot.status === 'booked') return;
    setSelectedSlot(slot);
    setCreateForm(prev => ({ ...prev, slot_id: slot.id }));
  }, []);

  // ── Inline slot management handlers ─────────────────────────────────────
  // Derive the active zone object so we can read no_of_slots, each_slot_time, start_time, end_time
  const activeZone = useMemo(
    () => allServiceZones.find(z => z.id === selectedServiceZoneId) || null,
    [allServiceZones, selectedServiceZoneId]
  );

  // Zone capacity info
  const zoneMaxSlots    = activeZone?.no_of_slots ?? null;
  const currentSlotCount = slotsData.length;
  const capacityFull    = zoneMaxSlots !== null && currentSlotCount >= zoneMaxSlots;
  const remainingSlots  = zoneMaxSlots !== null ? Math.max(0, zoneMaxSlots - currentSlotCount) : null;

  // Time helpers (scoped)
  const slotToMins = (t) => { if (!t) return 0; const [h, m] = t.split(':').map(Number); return h * 60 + m; };

  // Check if a proposed [start, end) overlaps any existing slot in slotsData
  const hasTimeConflict = useCallback((start_time, end_time) => {
    const ps = slotToMins(start_time);
    const pe = slotToMins(end_time);
    return slotsData.some(s => {
      const es = slotToMins(s.start_time);
      const ee = slotToMins(s.end_time);
      return ps < ee && pe > es; // overlap
    });
  }, [slotsData]);

  // Manual
  const handleSlotFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setSlotForm(prev => ({ ...prev, [name]: value }));
    setManualError('');
  }, []);

  const handleCreateSlot = useCallback(async () => {
    if (!slotForm.start_time || !slotForm.end_time) return;
    // Capacity check
    if (capacityFull) {
      setManualError(`Zone capacity full — max ${zoneMaxSlots} slot${zoneMaxSlots !== 1 ? 's' : ''} allowed for this date.`);
      return;
    }
    // Conflict check
    if (hasTimeConflict(slotForm.start_time, slotForm.end_time)) {
      setManualError(`A slot already exists at ${fmtTime(slotForm.start_time)} – ${fmtTime(slotForm.end_time)}. Choose a different time.`);
      return;
    }
    // End must be after start
    if (slotToMins(slotForm.end_time) <= slotToMins(slotForm.start_time)) {
      setManualError('End time must be after start time.');
      return;
    }
    setManualError('');
    try {
      await createSlot({
        service_zone_id: selectedServiceZoneId,
        date: selectedDate,
        start_time: slotForm.start_time,
        end_time: slotForm.end_time,
        capacity: parseInt(slotForm.capacity) || 1,
      }).unwrap();
      setSlotCreatedMsg(`Slot ${fmtTime(slotForm.start_time)} – ${fmtTime(slotForm.end_time)} created!`);
      setSlotForm({ start_time: '', end_time: '', capacity: 1 });
      refetchSlots();
    } catch (err) {
      setManualError(err?.data?.message || 'Failed to create slot. Please try again.');
    }
  }, [createSlot, selectedServiceZoneId, selectedDate, slotForm, refetchSlots, capacityFull, zoneMaxSlots, hasTimeConflict]);

  // Auto-generator: generate preview with conflict + capacity flags
  const handleAutoGenerate = useCallback(() => {
    const { start_time, end_time, duration, gap, capacity } = autoSlot;
    if (!start_time || !end_time || !duration) return;
    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const fromMins = (m) => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
    const startM = toMins(start_time);
    const endM   = toMins(end_time);
    const slots  = [];
    let cur = startM;
    while (cur + Number(duration) <= endM) {
      const st = fromMins(cur);
      const et = fromMins(cur + Number(duration));
      const conflict = hasTimeConflict(st, et);
      slots.push({ start_time: st, end_time: et, capacity: Number(capacity) || 1, conflict });
      cur += Number(duration) + Number(gap);
    }
    setAutoPreview(slots);
  }, [autoSlot, hasTimeConflict]);

  const handleAutoSaveAll = useCallback(async () => {
    const eligible = autoPreview.filter(s => !s.conflict);
    if (!eligible.length) return;
    // Capacity check: don't exceed zone limit
    const canAdd = zoneMaxSlots !== null ? Math.max(0, zoneMaxSlots - currentSlotCount) : eligible.length;
    const toCreate = eligible.slice(0, canAdd);
    if (toCreate.length === 0) {
      setSlotCreatedMsg(`Zone capacity full — no slots created.`);
      setAutoPreview([]);
      return;
    }
    setAutoGenerating(true);
    let count = 0;
    for (const s of toCreate) {
      try {
        await createSlot({ service_zone_id: selectedServiceZoneId, date: selectedDate, start_time: s.start_time, end_time: s.end_time, capacity: s.capacity }).unwrap();
        count++;
      } catch (_) {}
    }
    setAutoGenerating(false);
    const skipped = eligible.length - toCreate.length;
    setSlotCreatedMsg(`${count} slot${count !== 1 ? 's' : ''} created!${skipped > 0 ? ` (${skipped} skipped — capacity limit)` : ''}`);
    setAutoPreview([]);
    refetchSlots();
  }, [autoPreview, createSlot, selectedServiceZoneId, selectedDate, refetchSlots, zoneMaxSlots, currentSlotCount]);

  // Bulk upload: parse CSV/text with conflict detection
  const handleBulkParse = useCallback(() => {
    const lines = bulkText.trim().split('\n').filter(Boolean);
    const parsed = [];
    const errors = [];
    lines.forEach((line, i) => {
      const parts = line.split(',').map(s => s.trim());
      const [start_time, end_time, cap] = parts;
      const timeRe = /^\d{1,2}:\d{2}$/;
      if (!timeRe.test(start_time) || !timeRe.test(end_time)) {
        errors.push({ line: i + 1, msg: `Line ${i + 1}: invalid format — use HH:MM, HH:MM[, capacity]` });
      } else if (slotToMins(end_time) <= slotToMins(start_time)) {
        errors.push({ line: i + 1, msg: `Line ${i + 1}: end time must be after start time` });
      } else if (hasTimeConflict(start_time, end_time)) {
        errors.push({ line: i + 1, msg: `Line ${i + 1}: ${fmtTime(start_time)}–${fmtTime(end_time)} conflicts with an existing slot` });
      } else {
        parsed.push({ start_time, end_time, capacity: parseInt(cap) || 1 });
      }
    });
    setBulkParsed(parsed);
    setBulkErrors(errors);
  }, [bulkText, hasTimeConflict]);

  const handleBulkSave = useCallback(async () => {
    if (!bulkParsed.length) return;
    // Capacity check
    const canAdd = zoneMaxSlots !== null ? Math.max(0, zoneMaxSlots - currentSlotCount) : bulkParsed.length;
    const toCreate = bulkParsed.slice(0, canAdd);
    if (toCreate.length === 0) {
      setSlotCreatedMsg('Zone capacity full — no slots uploaded.');
      setBulkParsed([]);
      return;
    }
    setBulkUploading(true);
    let count = 0;
    for (const s of toCreate) {
      try {
        await createSlot({ service_zone_id: selectedServiceZoneId, date: selectedDate, ...s }).unwrap();
        count++;
      } catch (_) {}
    }
    setBulkUploading(false);
    const skipped = bulkParsed.length - toCreate.length;
    setSlotCreatedMsg(`${count} slot${count !== 1 ? 's' : ''} uploaded!${skipped > 0 ? ` (${skipped} skipped — capacity limit)` : ''}`);
    setBulkText('');
    setBulkParsed([]);
    setBulkErrors([]);
    refetchSlots();
  }, [bulkParsed, createSlot, selectedServiceZoneId, selectedDate, refetchSlots, zoneMaxSlots, currentSlotCount]);

  const formatSlotTime = (slot) => {
    if (!slot) return '';
    const fmt = (t) => { if (!t) return ''; const [h, m] = t.split(':'); const hour = parseInt(h); return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`; };
    const start = fmt(slot.start_time || slot.time); const end = fmt(slot.end_time);
    return end ? `${start} - ${end}` : start;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!servicePrice) {
      alert('Please configure a service price before creating a booking.');
      return;
    }
    try {
      await createBooking({
        ...createForm,
        amount: parseFloat(createForm.amount),
        gst_percent: parseFloat(createForm.gst_percent),
        discount_percent: parseFloat(createForm.discount_percent),
        total_amount: parseFloat(createForm.total_amount)
      }).unwrap();
      setBookingConfirmed(true);
      onCreated();
      setTimeout(() => onClose(), 1200);
    } catch (err) { alert(err?.data?.message || 'Failed to create booking'); }
  };

  const nextDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().split('T')[0]; });

  const servicePriceGstLabel = useMemo(() => {
    if (!servicePrice || !servicePrice.is_gst_applicable) return null;
    const total = (Number(servicePrice.cgst_percent) || 0) +
                  (Number(servicePrice.sgst_percent) || 0) +
                  (Number(servicePrice.igst_percent) || 0);
    return total > 0 ? `${total}%` : null;
  }, [servicePrice]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full mx-auto my-4 flex flex-col shadow-2xl transform transition-all duration-300 animate-slideUp" style={{ height: 'calc(100vh - 2rem)', maxHeight: 'calc(80vh - 2rem)' }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-shrink-0 rounded-t-2xl sm:rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Calendar size={18} className="text-white" />
              </div>
              Create New Booking
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 ml-0 sm:ml-12">Select customer, service, and available slot</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border border-white/30 backdrop-blur-sm group"
          >
            <X size={18} className="text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div ref={modalContentRef} className="overflow-y-auto flex-1 p-3 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
          <form id="create-booking-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

            {/* Customer & Service Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

              {/* Customer Field */}
              <div ref={customerDropdownRef} className="relative group">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Users size={12} className="text-white" />
                  </div>
                  Customer
                  <span className="text-red-500">*</span>
                </label>
                <input type="text" required value={createForm.customer_id} onChange={() => {}} className="sr-only" tabIndex={-1} aria-hidden="true" />
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={handleCustomerSearchChange}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="Search by name or phone..."
                    autoComplete="off"
                    className={`w-full pl-10 pr-10 py-3 sm:py-3.5 text-sm sm:text-base border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 shadow-sm hover:shadow-md ${
                      selectedCustomer
                        ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 shadow-blue-100'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  />
                  {selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setCustomerSearch('');
                        setCreateForm(prev => ({ ...prev, customer_id: '' }));
                        setShowCustomerDropdown(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-95 p-1 rounded-lg hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {selectedCustomer && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg">
                      {selectedCustomer.first_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-blue-900 truncate">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                      <p className="text-xs text-blue-600 flex items-center gap-1">
                        <Phone size={10} />
                        {selectedCustomer.mobile_number}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <Check size={14} className="text-white font-bold" />
                    </div>
                  </div>
                )}

                {showCustomerDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden ring-4 ring-blue-500/10">
                    {filteredCustomers.length === 0 ? (
                      <div className="px-4 sm:px-6 py-6 sm:py-8 text-center bg-gradient-to-br from-gray-50 to-blue-50/30">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Users size={28} className="text-gray-400" />
                        </div>
                        <p className="text-sm sm:text-base font-bold text-gray-800 mb-1">No customer found</p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-5">
                          {customerSearch ? `No results for "${customerSearch}"` : 'Start typing to search'}
                        </p>
                        <button
                          type="button"
                          onClick={() => { setShowCustomerDropdown(false); setShowCreateCustomer(true); }}
                          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-purple-700 font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 active:scale-95"
                        >
                          <Plus size={16} /> Create New Customer
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-48 sm:max-h-56 overflow-y-auto custom-scrollbar">
                          {filteredCustomers.map(c => {
                            const isActive = selectedCustomer?.id === c.id;
                            const fullName = `${c.first_name} ${c.last_name}`;
                            const q = customerSearch.toLowerCase();
                            const idx = fullName.toLowerCase().indexOf(q);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onMouseDown={() => handleCustomerSelect(c)}
                                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 text-left transition-all duration-200 ${
                                  isActive
                                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500'
                                    : 'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 border-l-4 border-transparent'
                                } border-b border-gray-100 last:border-0 group`}
                              >
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md transition-all duration-200 ${
                                  isActive
                                    ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 scale-110'
                                    : 'bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105'
                                }`}>
                                  {c.first_name?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">
                                    {q && idx !== -1 ? (
                                      <>
                                        {fullName.slice(0, idx)}
                                        <span className="bg-yellow-200 text-yellow-900 rounded px-1 py-0.5">
                                          {fullName.slice(idx, idx + q.length)}
                                        </span>
                                        {fullName.slice(idx + q.length)}
                                      </>
                                    ) : fullName}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <Phone size={10} />
                                    {c.mobile_number}
                                  </p>
                                </div>
                                {isActive && (
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                    <Check size={14} className="text-white font-bold" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <div className="border-t-2 border-gray-100 px-3 sm:px-4 py-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm">
                          <button
                            type="button"
                            onClick={() => { setShowCustomerDropdown(false); setShowCreateCustomer(true); }}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-purple-700 font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-105 active:scale-95"
                          >
                            <Plus size={16} /> Create New Customer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Service Field */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Layers size={12} className="text-white" />
                  </div>
                  Service
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="service_id"
                    value={createForm.service_id}
                    onChange={e => handleServiceChange(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-200 cursor-pointer bg-white hover:border-purple-300 shadow-sm hover:shadow-md appearance-none group-hover:border-purple-300"
                  >
                    <option value="">Select Service</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Layers size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight size={18} className="text-gray-400 rotate-90 group-hover:text-purple-500 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Slot Selection */}
            {createForm.service_id && (
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden animate-slideDown">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Select Booking Date</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Choose a date to view available time slots</p>
                  </div>
                </div>

                {!selectedServiceZoneId && (
                  <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl sm:rounded-2xl shadow-sm">
                    <p className="text-xs sm:text-sm text-yellow-800 font-semibold flex items-center gap-2">
                      <AlertCircle size={16} />
                      No service zone found for this service.
                    </p>
                  </div>
                )}

                <div className="mb-5 relative z-10">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <CalendarDays size={16} className="text-blue-600" />
                    Choose Date
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5">
                    {nextDays.map((date, index) => {
                      const d = new Date(date);
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const isSelected = selectedDate === date;
                      const isToday = index === 0;
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => handleDateChange(date)}
                          className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                            isSelected
                              ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl scale-105 ring-4 ring-blue-500/30'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-1'
                          }`}
                        >
                          {isToday && !isSelected && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                              <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full shadow-lg animate-pulse">
                                TODAY
                              </span>
                            </div>
                          )}
                          <div className={`text-[10px] sm:text-xs font-bold mb-1 ${isSelected ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-600'}`}>
                            {dayName}
                          </div>
                          <div className={`text-base sm:text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900 group-hover:text-blue-600'}`}>
                            {dayNum}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && selectedServiceZoneId ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-blue-100 shadow-lg relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Clock size={16} className="text-purple-600" />
                        Available Time Slots
                      </label>
                      <span className="text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    {slotsLoading ? (
                      <div className="text-center py-12">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-500 text-xs sm:text-sm font-semibold">Loading available slots...</p>
                      </div>
                    ) : slotsData.length > 0 ? (
                      <>
                        {/* ── Slot success / capacity banner ── */}
                        {slotCreatedMsg && (
                          <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3 mb-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check size={13} className="text-white" />
                            </div>
                            <p className="text-sm font-bold text-green-800">{slotCreatedMsg}</p>
                            <button type="button" onClick={() => setSlotCreatedMsg('')} className="ml-auto text-green-400 hover:text-green-600 cursor-pointer"><X size={14}/></button>
                          </div>
                        )}

                        {/* Capacity full warning */}
                        {capacityFull && (
                          <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-3 mb-3">
                            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-amber-800">Zone Capacity Full</p>
                              <p className="text-xs text-amber-600">{currentSlotCount}/{zoneMaxSlots} slots created — delete a slot to add more.</p>
                            </div>
                          </div>
                        )}

                        {/* Slot grid header with Add Slot button */}
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-500">
                            {currentSlotCount} slot{currentSlotCount !== 1 ? 's' : ''}
                            {zoneMaxSlots !== null && <span className="text-gray-400"> / {zoneMaxSlots} max</span>}
                          </p>
                          {!capacityFull && !showSlotPanel && (
                            <button
                              type="button"
                              onClick={() => { setShowSlotPanel(true); setSlotPanelTab('manual'); }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-2 border-indigo-200 rounded-lg cursor-pointer transition-all"
                            >
                              <Plus size={12}/> Add Slot
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 max-h-80 overflow-y-auto p-1 sm:p-2 custom-scrollbar">
                          {slotsData.map(slot => {
                            const isBooked = slot.is_booked || slot.status === 'booked';
                            const isSelected = selectedSlot?.id === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => handleSlotSelect(slot)}
                                disabled={isBooked}
                                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 group ${
                                  isSelected
                                    ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white shadow-2xl scale-105 border-2 border-blue-400 cursor-pointer ring-4 ring-blue-500/30'
                                    : isBooked
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 border-2 border-gray-200'
                                      : 'bg-white border-2 border-blue-200 text-blue-700 hover:border-blue-400 hover:shadow-xl hover:scale-105 hover:-translate-y-1 cursor-pointer'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-1.5 mb-2">
                                  <Clock size={14} className={`${isSelected ? 'text-white' : isBooked ? 'text-gray-400' : 'text-blue-600 group-hover:text-blue-700'}`} />
                                  <span className="text-xs sm:text-sm font-bold">{formatSlotTime(slot)}</span>
                                </div>
                                {isBooked ? (
                                  <div className="text-[10px] font-bold text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">BOOKED</div>
                                ) : (
                                  <div className={`text-[10px] font-semibold ${isSelected ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-600'}`}>Available</div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {selectedSlot && (
                          <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-xl sm:rounded-2xl shadow-lg">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <Check size={18} className="text-white font-bold" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-green-900">
                                  Slot Selected: {formatSlotTime(selectedSlot)}
                                </p>
                                <p className="text-[10px] sm:text-xs text-green-700 mt-0.5">
                                  Ready to confirm booking ✓
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Slot panel inline (when slots already exist and panel is open) */}
                        {showSlotPanel && !capacityFull && (
                          <div className="mt-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center"><Clock size={15} className="text-white"/></div>
                                <div>
                                  <p className="text-white font-bold text-sm">Add More Slots</p>
                                  <p className="text-indigo-200 text-xs">{zoneMaxSlots !== null ? `${remainingSlots} remaining (limit ${zoneMaxSlots})` : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                </div>
                              </div>
                              <button type="button" onClick={() => { setShowSlotPanel(false); setAutoPreview([]); setBulkText(''); setBulkParsed([]); setBulkErrors([]); setManualError(''); }}
                                className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                <X size={14} className="text-white"/>
                              </button>
                            </div>
                            <div className="flex border-b border-gray-100 bg-gray-50">
                              {[
                                { id: 'auto', icon: <RefreshCw size={13}/>, label: 'Auto' },
                                { id: 'manual', icon: <Plus size={13}/>, label: 'Manual' },
                                { id: 'bulk', icon: <Layers size={13}/>, label: 'Bulk' },
                              ].map(tab => (
                                <button key={tab.id} type="button" onClick={() => setSlotPanelTab(tab.id)}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold cursor-pointer border-b-2 transition-all ${slotPanelTab === tab.id ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                                  {tab.icon} {tab.label}
                                </button>
                              ))}
                            </div>
                            <div className="p-4 space-y-4">
                              {/* AUTO */}
                              {slotPanelTab === 'auto' && (
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-500">Auto-generate new slots around the existing ones.</p>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Window Start</label>
                                      <input type="time" value={autoSlot.start_time} onChange={e => { setAutoSlot(p => ({...p, start_time: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Window End</label>
                                      <input type="time" value={autoSlot.end_time} onChange={e => { setAutoSlot(p => ({...p, end_time: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Duration (min)</label>
                                      <input type="number" min="5" value={autoSlot.duration} onChange={e => { setAutoSlot(p => ({...p, duration: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Gap (min)</label>
                                      <input type="number" min="0" value={autoSlot.gap} onChange={e => { setAutoSlot(p => ({...p, gap: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                  </div>
                                  <button type="button" onClick={handleAutoGenerate}
                                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2">
                                    <RefreshCw size={14}/> Preview
                                  </button>
                                  {autoPreview.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-bold text-gray-700">{autoPreview.filter(s=>!s.conflict).length} new · <span className="text-red-500">{autoPreview.filter(s=>s.conflict).length} conflict</span></p>
                                      <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                                        {autoPreview.map((s, i) => (
                                          <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${s.conflict ? 'bg-red-50 border border-red-200' : 'bg-indigo-50'}`}>
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.conflict ? 'bg-red-400' : 'bg-indigo-400'}`}/>
                                            <span className={`text-xs font-semibold ${s.conflict ? 'text-red-500 line-through' : 'text-indigo-700'}`}>{fmtTime(s.start_time)} – {fmtTime(s.end_time)}</span>
                                            {s.conflict ? <span className="ml-auto text-[10px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded">CONFLICT</span> : <span className="ml-auto text-xs text-gray-400">Cap: {s.capacity}</span>}
                                          </div>
                                        ))}
                                      </div>
                                      <button type="button" onClick={handleAutoSaveAll} disabled={autoGenerating || autoPreview.filter(s=>!s.conflict).length===0}
                                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                                        {autoGenerating ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Saving…</> : <><Check size={15}/> Save {autoPreview.filter(s=>!s.conflict).length} Slots</>}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* MANUAL */}
                              {slotPanelTab === 'manual' && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                                      <input type="time" name="start_time" value={slotForm.start_time} onChange={handleSlotFormChange}
                                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white ${manualError ? 'border-red-300' : 'border-gray-200'}`}/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">End Time <span className="text-red-500">*</span></label>
                                      <input type="time" name="end_time" value={slotForm.end_time} onChange={handleSlotFormChange}
                                        className={`w-full px-3 py-2.5 text-sm border-2 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white ${manualError ? 'border-red-300' : 'border-gray-200'}`}/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Capacity</label>
                                      <input type="number" name="capacity" value={slotForm.capacity} min="1" onChange={handleSlotFormChange}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                  </div>
                                  {slotForm.start_time && slotForm.end_time && !manualError && hasTimeConflict(slotForm.start_time, slotForm.end_time) && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
                                      <AlertCircle size={13} className="text-red-500 flex-shrink-0"/>
                                      <span className="text-xs font-semibold text-red-700">A slot at {fmtTime(slotForm.start_time)} – {fmtTime(slotForm.end_time)} already exists.</span>
                                    </div>
                                  )}
                                  {slotForm.start_time && slotForm.end_time && !manualError && !hasTimeConflict(slotForm.start_time, slotForm.end_time) && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                                      <Clock size={13} className="text-indigo-500"/>
                                      <span className="text-xs font-semibold text-indigo-700">{fmtTime(slotForm.start_time)} – {fmtTime(slotForm.end_time)}</span>
                                      <span className="text-xs text-gray-400 ml-auto">Cap: {slotForm.capacity}</span>
                                    </div>
                                  )}
                                  {manualError && (
                                    <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-xl px-3 py-2.5">
                                      <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5"/>
                                      <p className="text-xs font-semibold text-red-700">{manualError}</p>
                                    </div>
                                  )}
                                  <button type="button" onClick={handleCreateSlot}
                                    disabled={creatingSlot || !slotForm.start_time || !slotForm.end_time || (slotForm.start_time && slotForm.end_time && hasTimeConflict(slotForm.start_time, slotForm.end_time))}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 cursor-pointer transition-all">
                                    {creatingSlot ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Saving…</> : <><Plus size={15}/> Add Slot</>}
                                  </button>
                                </div>
                              )}
                              {/* BULK */}
                              {slotPanelTab === 'bulk' && (
                                <div className="space-y-3">
                                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                                    <p className="text-xs font-bold text-amber-800 mb-0.5">Format: HH:MM, HH:MM[, capacity] — one per line</p>
                                    <p className="text-xs text-amber-600 font-mono">09:00, 09:30, 2</p>
                                  </div>
                                  <textarea value={bulkText} onChange={e => { setBulkText(e.target.value); setBulkParsed([]); setBulkErrors([]); }}
                                    placeholder={"09:00, 09:30, 2\n09:30, 10:00"} rows={4}
                                    className="w-full px-3 py-2.5 text-sm font-mono border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none resize-none bg-white"/>
                                  <button type="button" onClick={handleBulkParse} disabled={!bulkText.trim()}
                                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                                    <Layers size={14}/> Parse &amp; Preview
                                  </button>
                                  {bulkErrors.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 space-y-1">
                                      {bulkErrors.map((e, i) => <p key={i} className="text-xs text-red-600">{e.msg}</p>)}
                                    </div>
                                  )}
                                  {bulkParsed.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-xs font-bold text-gray-700">{bulkParsed.length} valid slot{bulkParsed.length!==1?'s':''} ready:</p>
                                      <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                                        {bulkParsed.map((s, i) => (
                                          <div key={i} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-1.5">
                                            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"/>
                                            <span className="text-xs font-semibold text-green-700">{fmtTime(s.start_time)} – {fmtTime(s.end_time)}</span>
                                            <span className="ml-auto text-xs text-gray-400">Cap: {s.capacity}</span>
                                          </div>
                                        ))}
                                      </div>
                                      <button type="button" onClick={handleBulkSave} disabled={bulkUploading}
                                        className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                                        {bulkUploading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Uploading…</> : <><Check size={15}/> Upload {Math.min(bulkParsed.length, remainingSlots ?? bulkParsed.length)} Slots</>}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      // ── NO SLOTS — full slot management panel ───────────────────────
                      <div className="space-y-3">
                        {/* Success banner */}
                        {slotCreatedMsg && (
                          <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 rounded-xl px-4 py-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check size={13} className="text-white" />
                            </div>
                            <p className="text-sm font-bold text-green-800">{slotCreatedMsg} Select a slot above.</p>
                            <button type="button" onClick={() => setSlotCreatedMsg('')} className="ml-auto text-green-400 hover:text-green-600 cursor-pointer"><X size={14}/></button>
                          </div>
                        )}

                        {/* Empty state prompt */}
                        {!showSlotPanel && (
                          <div className="text-center py-10 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-dashed border-orange-200">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 border-orange-200">
                              <Clock size={26} className="text-orange-500" />
                            </div>
                            <p className="font-bold text-gray-800 mb-1 text-sm sm:text-base">No Slots Available</p>
                            <p className="text-xs sm:text-sm text-gray-500 mb-5">
                              No slots for <span className="font-semibold text-orange-600">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            </p>
                            <button
                              type="button"
                              onClick={() => { setShowSlotPanel(true); setSlotPanelTab('manual'); }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                            >
                              <Plus size={16} /> Add First Slot
                            </button>
                          </div>
                        )}

                        {/* Slot panel */}
                        {showSlotPanel && (
                          <div className="bg-white border-2 border-indigo-100 rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center"><Clock size={15} className="text-white"/></div>
                                <div>
                                  <p className="text-white font-bold text-sm">Create Slots</p>
                                  <p className="text-indigo-200 text-xs">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                </div>
                              </div>
                              <button type="button" onClick={() => { setShowSlotPanel(false); setAutoPreview([]); setBulkText(''); setBulkParsed([]); setBulkErrors([]); setManualError(''); }}
                                className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                <X size={14} className="text-white"/>
                              </button>
                            </div>
                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 bg-gray-50">
                              {[
                                { id: 'auto', icon: <RefreshCw size={13}/>, label: 'Auto Generate' },
                                { id: 'manual', icon: <Plus size={13}/>, label: 'Manual Add' },
                                { id: 'bulk', icon: <Layers size={13}/>, label: 'Bulk Upload' },
                              ].map(tab => (
                                <button key={tab.id} type="button" onClick={() => setSlotPanelTab(tab.id)}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 ${slotPanelTab === tab.id ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
                                  {tab.icon} {tab.label}
                                </button>
                              ))}
                            </div>
                            <div className="p-4 space-y-4">
                              {/* AUTO */}
                              {slotPanelTab === 'auto' && (
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-500">Set a time window and duration to auto-generate all slots for this date.</p>
                                  {zoneMaxSlots !== null && <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">Zone allows {zoneMaxSlots} slot{zoneMaxSlots !== 1 ? 's' : ''} — {remainingSlots} remaining</p>}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Window Start <span className="text-red-500">*</span></label>
                                      <input type="time" value={autoSlot.start_time} onChange={e => { setAutoSlot(p => ({...p, start_time: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Window End <span className="text-red-500">*</span></label>
                                      <input type="time" value={autoSlot.end_time} onChange={e => { setAutoSlot(p => ({...p, end_time: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Duration (min)</label>
                                      <input type="number" min="5" value={autoSlot.duration} onChange={e => { setAutoSlot(p => ({...p, duration: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Gap (min)</label>
                                      <input type="number" min="0" value={autoSlot.gap} onChange={e => { setAutoSlot(p => ({...p, gap: e.target.value})); setAutoPreview([]); }}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Capacity per Slot</label>
                                      <input type="number" min="1" value={autoSlot.capacity} onChange={e => setAutoSlot(p => ({...p, capacity: e.target.value}))}
                                        className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                    </div>
                                  </div>
                                  <button type="button" onClick={handleAutoGenerate}
                                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2">
                                    <RefreshCw size={14}/> Preview Slots
                                  </button>
                                  {autoPreview.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-gray-700">
                                          {autoPreview.filter(s => !s.conflict).length} new · <span className="text-red-500">{autoPreview.filter(s => s.conflict).length} conflict</span>
                                        </p>
                                        <button type="button" onClick={() => setAutoPreview([])} className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">Clear</button>
                                      </div>
                                      <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                        {autoPreview.map((s, i) => (
                                          <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${s.conflict ? 'bg-red-50 border border-red-200' : 'bg-indigo-50'}`}>
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.conflict ? 'bg-red-400' : 'bg-indigo-400'}`}/>
                                            <span className={`text-xs font-semibold ${s.conflict ? 'text-red-600 line-through' : 'text-indigo-700'}`}>{fmtTime(s.start_time)} – {fmtTime(s.end_time)}</span>
                                            {s.conflict
                                              ? <span className="ml-auto text-[10px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded">CONFLICT</span>
                                              : <span className="ml-auto text-xs text-gray-400">Cap: {s.capacity}</span>
                                            }
                                          </div>
                                        ))}
                                      </div>
                                      {zoneMaxSlots !== null && autoPreview.filter(s => !s.conflict).length > remainingSlots && (
                                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                          <AlertCircle size={13} className="text-amber-500 flex-shrink-0"/>
                                          <p className="text-xs text-amber-700">Only {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} can be added (zone limit). Others will be skipped.</p>
                                        </div>
                                      )}
                                      <button type="button" onClick={handleAutoSaveAll} disabled={autoGenerating || autoPreview.filter(s => !s.conflict).length === 0}
                                        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                                        {autoGenerating
                                          ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Saving…</>
                                          : <><Check size={15}/> Save {autoPreview.filter(s => !s.conflict).length} New Slots</>
                                        }
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* MANUAL */}
                              {slotPanelTab === 'manual' && (
                                <div className="space-y-4">
                                  <p className="text-xs text-gray-500">Add slots one at a time. After saving you can keep adding more.</p>
                                  {zoneMaxSlots !== null && (
                                    capacityFull
                                      ? <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2.5"><AlertCircle size={14} className="text-amber-500 flex-shrink-0"/><p className="text-xs font-bold text-amber-800">Zone capacity full ({zoneMaxSlots}/{zoneMaxSlots}). No more slots can be added.</p></div>
                                      : <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">{remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining (zone limit: {zoneMaxSlots})</p>
                                  )}
                                  {!capacityFull && (
                                    <>
                                      <div className="grid grid-cols-3 gap-3">
                                        <div>
                                          <label className="block text-xs font-bold text-gray-600 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                                          <input type="time" name="start_time" value={slotForm.start_time} onChange={handleSlotFormChange}
                                            className={`w-full px-3 py-2.5 text-sm border-2 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white ${manualError ? 'border-red-300' : 'border-gray-200'}`}/>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-bold text-gray-600 mb-1.5">End Time <span className="text-red-500">*</span></label>
                                          <input type="time" name="end_time" value={slotForm.end_time} onChange={handleSlotFormChange}
                                            className={`w-full px-3 py-2.5 text-sm border-2 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white ${manualError ? 'border-red-300' : 'border-gray-200'}`}/>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-bold text-gray-600 mb-1.5">Capacity</label>
                                          <input type="number" name="capacity" value={slotForm.capacity} min="1" onChange={handleSlotFormChange}
                                            className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none bg-white"/>
                                        </div>
                                      </div>
                                      {/* Conflict / error indicator */}
                                      {slotForm.start_time && slotForm.end_time && !manualError && hasTimeConflict(slotForm.start_time, slotForm.end_time) && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
                                          <AlertCircle size={13} className="text-red-500 flex-shrink-0"/>
                                          <span className="text-xs font-semibold text-red-700">A slot at {fmtTime(slotForm.start_time)} – {fmtTime(slotForm.end_time)} already exists.</span>
                                        </div>
                                      )}
                                      {slotForm.start_time && slotForm.end_time && !manualError && !hasTimeConflict(slotForm.start_time, slotForm.end_time) && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                                          <Clock size={13} className="text-indigo-500"/>
                                          <span className="text-xs font-semibold text-indigo-700">{fmtTime(slotForm.start_time)} – {fmtTime(slotForm.end_time)}</span>
                                          <span className="text-xs text-gray-400 ml-auto">Capacity: {slotForm.capacity}</span>
                                        </div>
                                      )}
                                      {manualError && (
                                        <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-xl px-3 py-2.5">
                                          <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5"/>
                                          <p className="text-xs font-semibold text-red-700">{manualError}</p>
                                        </div>
                                      )}
                                      <button type="button" onClick={handleCreateSlot}
                                        disabled={creatingSlot || !slotForm.start_time || !slotForm.end_time || (slotForm.start_time && slotForm.end_time && hasTimeConflict(slotForm.start_time, slotForm.end_time))}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]">
                                        {creatingSlot ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Saving…</> : <><Plus size={15}/> Add Slot</>}
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                              {/* BULK */}
                              {slotPanelTab === 'bulk' && (
                                <div className="space-y-4">
                                  {zoneMaxSlots !== null && (
                                    capacityFull
                                      ? <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-200 rounded-xl px-3 py-2.5"><AlertCircle size={14} className="text-amber-500 flex-shrink-0"/><p className="text-xs font-bold text-amber-800">Zone capacity full ({zoneMaxSlots}/{zoneMaxSlots}). No more slots can be added.</p></div>
                                      : <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">{remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining (zone limit: {zoneMaxSlots})</p>
                                  )}
                                  {!capacityFull && (
                                    <>
                                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                                        <p className="text-xs font-bold text-amber-800 mb-1">CSV Format — one slot per line:</p>
                                        <pre className="text-xs text-amber-700 font-mono">HH:MM, HH:MM[, capacity]{'\n'}09:00, 09:30, 2{'\n'}09:30, 10:00</pre>
                                      </div>
                                      <textarea value={bulkText} onChange={e => { setBulkText(e.target.value); setBulkParsed([]); setBulkErrors([]); }}
                                        placeholder={"09:00, 09:30, 2\n09:30, 10:00\n10:00, 10:30, 3"} rows={5}
                                        className="w-full px-3 py-2.5 text-sm font-mono border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none resize-none bg-white"/>
                                      <button type="button" onClick={handleBulkParse} disabled={!bulkText.trim()}
                                        className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                                        <Layers size={14}/> Parse &amp; Preview
                                      </button>
                                      {bulkErrors.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 space-y-1">
                                          {bulkErrors.map((e, i) => <p key={i} className="text-xs text-red-600">{e.msg}</p>)}
                                        </div>
                                      )}
                                      {bulkParsed.length > 0 && (
                                        <div className="space-y-2">
                                          <p className="text-xs font-bold text-gray-700">{bulkParsed.length} valid slot{bulkParsed.length !== 1 ? 's' : ''} ready:</p>
                                          <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                                            {bulkParsed.map((s, i) => (
                                              <div key={i} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-1.5">
                                                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"/>
                                                <span className="text-xs font-semibold text-green-700">{fmtTime(s.start_time)} – {fmtTime(s.end_time)}</span>
                                                <span className="ml-auto text-xs text-gray-400">Cap: {s.capacity}</span>
                                              </div>
                                            ))}
                                          </div>
                                          {zoneMaxSlots !== null && bulkParsed.length > remainingSlots && (
                                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                              <AlertCircle size={13} className="text-amber-500 flex-shrink-0"/>
                                              <p className="text-xs text-amber-700">Only {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} can be added (zone limit). First {remainingSlots} will be uploaded.</p>
                                            </div>
                                          )}
                                          <button type="button" onClick={handleBulkSave} disabled={bulkUploading}
                                            className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                                            {bulkUploading
                                              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Uploading…</>
                                              : <><Check size={15}/> Upload {Math.min(bulkParsed.length, remainingSlots ?? bulkParsed.length)} Slots</>
                                            }
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      // ── END NO SLOTS ─────────────────────────────────────────────────
                    )}
                  </div>
                ) : selectedDate && !selectedServiceZoneId ? (
                  <div className="bg-white rounded-2xl p-5 border-2 border-red-100 shadow-lg relative z-10">
                    <div className="text-center py-12">
                      <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
                      <p className="font-bold text-red-700 mb-1">No Service Zone Found</p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* ── BOOKING DETAILS ── shown after slot is selected */}
            {selectedSlot && (
              <div className="space-y-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-200 shadow-xl animate-slideDown">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-white" />
                  </div>
                  Booking Details
                </h3>

                {/* ── Dynamic status badge ── */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-500 ${
                  bookingConfirmed
                    ? 'bg-green-50 border-green-200'
                    : creating
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-500 ${
                    bookingConfirmed ? 'bg-green-500' : creating ? 'bg-orange-400' : 'bg-blue-400'
                  }`}>
                    {creating && !bookingConfirmed
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
                      : <Check size={16} className="text-white" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                      bookingConfirmed ? 'text-green-600' : creating ? 'text-orange-500' : 'text-blue-500'
                    }`}>
                      Booking Status
                    </p>
                    <p className={`text-sm font-bold transition-colors duration-500 ${
                      bookingConfirmed ? 'text-green-900' : creating ? 'text-orange-800' : 'text-blue-800'
                    }`}>
                      {bookingConfirmed ? 'Confirmed ✓' : creating ? 'Processing…' : 'In Progress'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 transition-all duration-500 ${
                    bookingConfirmed
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : creating
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    {bookingConfirmed ? 'CONFIRMED' : creating ? 'PROCESSING' : 'AUTO-SET'}
                  </span>
                </div>

                {/* ── No service price: warning + inline price form ── */}
                {!servicePrice ? (
                  <div className="border-2 border-amber-300 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50">
                      <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-amber-800">No service price configured</p>
                        <p className="text-xs text-amber-600">Add a price below — your booking form stays intact.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowInlinePriceForm(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
                          showInlinePriceForm
                            ? 'bg-amber-200 text-amber-900 border-amber-400'
                            : 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                        }`}
                      >
                        {showInlinePriceForm ? <><X size={12} /> Hide Form</> : <><Plus size={12} /> Add Service Price Now</>}
                      </button>
                    </div>

                    {showInlinePriceForm && (
                      <InlineServicePriceForm
                        serviceId={createForm.service_id}
                        onPriceSaved={(savedPrice) => {
                          setServicePrice(savedPrice);
                          setShowInlinePriceForm(false);
                          const confirmedStatus = statuses.find(s => s.status?.toLowerCase() === 'confirmed');
                          const baseAmt = Number(savedPrice.price) || 0;
                          const gstPct = savedPrice.is_gst_applicable
                            ? ((Number(savedPrice.cgst_percent) || 0) + (Number(savedPrice.sgst_percent) || 0) + (Number(savedPrice.igst_percent) || 0))
                            : 0;
                          const total = (baseAmt * (1 + gstPct / 100)).toFixed(2);
                          setCreateForm(prev => ({
                            ...prev,
                            booking_status_id: confirmedStatus ? String(confirmedStatus.id) : prev.booking_status_id,
                            amount: String(baseAmt),
                            gst_percent: String(gstPct),
                            sac_code: savedPrice.sac_code || '',
                            discount_percent: '0',
                            total_amount: total,
                          }));
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {/* ── Service price info banner ── */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Service Price (Auto-filled)</p>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                          FROM SERVICE
                        </span>
                      </div>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div>
                          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-0.5">Base Price</p>
                          <p className="text-xl font-bold text-blue-900">₹{Number(servicePrice.price).toLocaleString('en-IN')}</p>
                        </div>
                        {servicePriceGstLabel && (
                          <div>
                            <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-0.5">GST</p>
                            <p className="text-xl font-bold text-blue-900">{servicePriceGstLabel}</p>
                          </div>
                        )}
                        {servicePrice.sac_code && (
                          <div>
                            <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-0.5">SAC Code</p>
                            <p className="text-sm font-bold text-blue-900 font-mono">{servicePrice.sac_code}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-0.5">Total</p>
                          <p className="text-xl font-bold text-blue-900">₹{Number(servicePrice.total_price).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>

                    {/* ── Editable amount ── */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign size={14} className="text-green-600" />
                        Amount (₹)
                        <span className="text-[10px] font-medium text-gray-400 ml-1">— edit if needed</span>
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        name="amount"
                        value={createForm.amount}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. 10000"
                        autoComplete="off"
                        className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200"
                      />
                    </div>

                    {/* ── GST % and Discount % ── */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                          GST %
                          <span className="text-[10px] font-medium text-gray-400 ml-1">— edit if needed</span>
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          name="gst_percent"
                          value={createForm.gst_percent}
                          onChange={handleInputChange}
                          placeholder="18"
                          autoComplete="off"
                          className="w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Discount %</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          name="discount_percent"
                          value={createForm.discount_percent}
                          onChange={handleInputChange}
                          placeholder="0"
                          autoComplete="off"
                          className="w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* ── SAC Code and Total ── */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">SAC Code</label>
                        <input
                          type="text"
                          name="sac_code"
                          value={createForm.sac_code}
                          onChange={handleInputChange}
                          placeholder="998729"
                          autoComplete="off"
                          className="w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                          Total Amount (₹)
                          <span className="text-[10px] font-medium text-gray-400 ml-1">— auto-calculated</span>
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          name="total_amount"
                          value={createForm.total_amount}
                          onChange={handleInputChange}
                          required
                          placeholder="Auto-calculated"
                          autoComplete="off"
                          className="w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-blue-300 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gradient-to-br from-blue-50 to-purple-50 font-bold shadow-sm hover:shadow-md transition-all duration-200"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ── Total payable banner ── */}
                {createForm.total_amount && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-2xl">
                    <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
                      <DollarSign size={18} />
                      Total Payable
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight">
                      ₹{parseFloat(createForm.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Warning when no price + slot selected */}
            {selectedSlot && !servicePrice && (
              <p className="text-xs text-amber-600 font-semibold text-center flex items-center justify-center gap-1.5">
                <AlertCircle size={13} />
                Configure a service price before creating the booking
              </p>
            )}
          </form>
        </div>

        {/* ── Action Buttons — fixed footer outside scroll area ── */}
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 sm:gap-4 px-3 sm:px-6 py-4 bg-white border-t border-gray-100 rounded-b-2xl sm:rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-200 font-bold text-gray-700 cursor-pointer text-sm sm:text-base hover:scale-105 active:scale-95 hover:border-gray-400 shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-booking-form"
            disabled={creating || !selectedSlot || !servicePrice}
            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold disabled:opacity-60 disabled:cursor-not-allowed shadow-xl cursor-pointer text-sm sm:text-base hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {creating ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check size={20} />
                <span className="hidden sm:inline">Create Booking</span>
                <span className="sm:hidden">Create</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showCreateCustomer && (
        <InlineCustomerCreationModal
          onClose={() => setShowCreateCustomer(false)}
          onCustomerCreated={handleCustomerCreated}
          initialSearch={customerSearch}
        />
      )}
    </div>
  );
};

// RESCHEDULE MODAL
const RescheduleModal = ({ booking, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reschedule Booking</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"><X size={20} /></button>
      </div>
      {booking && (
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Customer</p><p className="font-semibold text-gray-900">{booking.customer?.first_name} {booking.customer?.last_name}</p></div>
          <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-600">Service</p><p className="font-semibold text-gray-900">{booking.service?.name}</p></div>
        </div>
      )}
      <form className="space-y-4">
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">New Date</label><input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">New Time</label><input type="time" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Reason (Optional)</label><textarea rows="3" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Reason for rescheduling..." /></div>
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">Cancel</button>
          <button type="submit" className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">Reschedule</button>
        </div>
      </form>
    </div>
  </div>
);

// CANCEL MODAL
const CancelModal = ({ booking, onClose, onConfirm, updating }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cancel Booking</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"><X size={20} /></button>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg mb-4"><AlertCircle className="text-red-500" size={24} /><div><p className="font-semibold text-gray-900">Are you sure?</p><p className="text-sm text-gray-600">This action cannot be undone</p></div></div>
        {booking && (
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600">Booking ID:</span><span className="font-semibold">{booking.booking_id}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Customer:</span><span className="font-semibold">{booking.customer?.first_name} {booking.customer?.last_name}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Service:</span><span className="font-semibold">{booking.service?.name}</span></div>
          </div>
        )}
      </div>
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">Keep Booking</button>
        <button type="button" onClick={onConfirm} disabled={updating} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-60 cursor-pointer">
          {updating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Cancel Booking'}
        </button>
      </div>
    </div>
  </div>
);

// UPDATE STATUS MODAL
const UpdateStatusModal = ({ booking, statuses, onClose, onConfirm, updating, getStatusBadge }) => {
  const [newStatusId, setNewStatusId] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Update Booking Status</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"><X size={20} /></button>
        </div>
        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Booking</p>
          <p className="font-semibold text-gray-900">{booking?.booking_id}</p>
          <p className="text-sm text-gray-600 mt-1">Current: <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(booking?.booking_status?.status)}`}>{booking?.booking_status?.status || '—'}</span></p>
        </div>
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select New Status</label>
          {statuses.map(s => (
            <button key={s.id} onClick={() => setNewStatusId(String(s.id))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left font-medium cursor-pointer ${String(newStatusId) === String(s.id) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
              {String(newStatusId) === String(s.id) && <Check size={16} className="text-blue-500 flex-shrink-0" />}
              <span>{s.status}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium cursor-pointer">Cancel</button>
          <button onClick={() => onConfirm(newStatusId)} disabled={!newStatusId || updating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-60 cursor-pointer">
            {updating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={16} /> Update Status</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// BOOKING STATUS MANAGEMENT
const STATUS_COLORS = [
  { label: 'Blue',   value: 'blue',   bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',   border: 'border-blue-200'   },
  { label: 'Green',  value: 'green',  bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  border: 'border-green-200'  },
  { label: 'Yellow', value: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', border: 'border-yellow-200' },
  { label: 'Red',    value: 'red',    bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500',    border: 'border-red-200'    },
  { label: 'Purple', value: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', border: 'border-purple-200' },
  { label: 'Orange', value: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', border: 'border-orange-200' },
  { label: 'Gray',   value: 'gray',   bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-400',   border: 'border-gray-200'   },
  { label: 'Teal',   value: 'teal',   bg: 'bg-teal-100',   text: 'text-teal-700',   dot: 'bg-teal-500',   border: 'border-teal-200'   },
];

const autoColor = (s = '') => {
  const n = s.toLowerCase();
  if (n.includes('confirm'))                                                  return 'blue';
  if (n.includes('complet') || n.includes('done') || n.includes('success'))  return 'green';
  if (n.includes('pend')    || n.includes('wait'))                            return 'yellow';
  if (n.includes('cancel')  || n.includes('reject') || n.includes('fail'))   return 'red';
  if (n.includes('no-show') || n.includes('noshow') || n.includes('absent')) return 'orange';
  if (n.includes('reschedul') || n.includes('postpone'))                     return 'purple';
  return 'gray';
};

const getColorConfig = (v) => STATUS_COLORS.find(c => c.value === v) || STATUS_COLORS[6];

const StatusFormModal = ({ editingStatus, onClose, onSaved }) => {
  const [statusName, setStatusName] = useState(editingStatus?.status || '');
  const [selectedColor, setSelectedColor] = useState(editingStatus?.color || autoColor(editingStatus?.status || ''));
  const [createBookingStatus, { isLoading: creating }]       = useCreateBookingStatusMutation();
  const [updateBookingStatusEntity, { isLoading: updating }] = useUpdateBookingStatusEntityMutation();
  const isEdit   = !!editingStatus;
  const isSaving = creating || updating;

  useEffect(() => { if (!isEdit && statusName) setSelectedColor(autoColor(statusName)); }, [statusName, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusName.trim()) return;
    try {
      if (isEdit) await updateBookingStatusEntity({ id: editingStatus.id, status: statusName.trim() }).unwrap();
      else        await createBookingStatus({ status: statusName.trim() }).unwrap();
      onSaved(); onClose();
    } catch (err) { alert(err?.data?.message || 'Failed to save status'); }
  };

  const color = getColorConfig(selectedColor);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className={`bg-gradient-to-r ${isEdit ? 'from-indigo-600 to-purple-600' : 'from-blue-600 to-blue-500'} px-6 py-5 flex items-center justify-between`}>
          <div>
            <h2 className="text-white font-bold text-lg">{isEdit ? 'Edit Status' : 'Create Booking Status'}</h2>
            <p className="text-blue-100 text-sm mt-0.5">Define a status label for your bookings</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer"><X size={16} className="text-white" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status Name *</label>
            <input type="text" value={statusName} onChange={e => setStatusName(e.target.value)} placeholder="e.g. Confirmed, Pending, No-Show..." required autoFocus
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Badge Color</label>
            <div className="grid grid-cols-4 gap-2">
              {STATUS_COLORS.map(c => (
                <button key={c.value} type="button" onClick={() => setSelectedColor(c.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${selectedColor === c.value ? `${c.border} ${c.bg} shadow-md scale-105` : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className={`w-3 h-3 rounded-full ${c.dot} flex-shrink-0`} />
                  <span className={`text-xs font-semibold ${selectedColor === c.value ? c.text : 'text-gray-600'}`}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          {statusName && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${color.bg} ${color.text}`}>
                <div className={`w-2 h-2 rounded-full ${color.dot}`} />{statusName}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm cursor-pointer">Cancel</button>
            <button type="submit" disabled={isSaving || !statusName.trim()} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium text-sm disabled:opacity-50 shadow-lg cursor-pointer">
              {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteStatusModal = ({ status, onClose, onConfirm, deleting }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-red-500" /></div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Delete Status</h2>
        <p className="text-gray-500 text-sm mb-1">Permanently delete</p>
        <p className="text-gray-900 font-bold text-lg mb-6">"{status?.status}"</p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-left">
          <p className="text-xs text-amber-700 font-medium">⚠️ Bookings using this status may be affected.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm cursor-pointer">Cancel</button>
          <button onClick={onConfirm} disabled={deleting} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium text-sm disabled:opacity-50 cursor-pointer">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const BookingStatusManagement = () => {
  const { data: statuses = [], isLoading } = useGetAllBookingStatusesQuery();
  const [deleteBookingStatusEntity, { isLoading: deleteLoading }] = useDeleteBookingStatusEntityMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStatus,   setEditingStatus]   = useState(null);
  const [deletingStatus,  setDeletingStatus]  = useState(null);

  const handleDelete = async () => {
    try {
      await deleteBookingStatusEntity(deletingStatus.id).unwrap();
      setDeletingStatus(null);
    } catch (err) {
      alert(err?.data?.message || 'Failed to delete booking status');
    }
  };

  const SYSTEM_HINTS = ['Confirmed', 'Pending', 'Completed', 'Cancelled', 'No-Show'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ShieldCheck size={22} className="text-blue-500" />Booking Status Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Define and manage the status labels used across all bookings</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold text-sm shadow-lg transition-all cursor-pointer hover:scale-105">
          <Plus size={18} /> Add Status
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Statuses</p>
          <p className="text-2xl font-bold text-gray-900">{statuses.length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Active</p>
          <p className="text-2xl font-bold text-blue-700">{statuses.length}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-100 col-span-2">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">💡 Tip</p>
          <p className="text-xs text-amber-700">Suggested: <span className="font-semibold">{SYSTEM_HINTS.join(', ')}</span></p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-500 text-sm">Loading statuses...</p></div>
      ) : statuses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Layers size={28} className="text-blue-500" /></div>
          <p className="font-bold text-gray-800 text-lg mb-1">No booking statuses yet</p>
          <p className="text-sm text-gray-500 mb-5">Create your first status to start managing bookings</p>
          <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold text-sm cursor-pointer shadow-lg">Create First Status</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map(status => {
            const color = getColorConfig(autoColor(status.status));
            return (
              <div key={status.id} className={`bg-white rounded-2xl border-2 ${color.border} p-5 hover:shadow-lg transition-all group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${color.bg} rounded-xl flex items-center justify-center`}><div className={`w-4 h-4 rounded-full ${color.dot}`} /></div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingStatus(status)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => setDeletingStatus(status)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${color.bg} ${color.text}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />{status.status}
                  </span>
                  <span className="text-xs text-gray-400">badge preview</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{new Date(status.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditingStatus(status)} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer">Edit</button>
                    <button onClick={() => setDeletingStatus(status)} className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={() => setShowCreateModal(true)}
            className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-5 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group min-h-[160px]">
            <div className="w-10 h-10 bg-white rounded-xl border-2 border-gray-200 group-hover:border-blue-300 flex items-center justify-center transition-colors">
              <Plus size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">Add New Status</p>
          </button>
        </div>
      )}

      {showCreateModal && <StatusFormModal editingStatus={null} onClose={() => setShowCreateModal(false)} onSaved={() => setShowCreateModal(false)} />}
      {editingStatus  && <StatusFormModal editingStatus={editingStatus} onClose={() => setEditingStatus(null)} onSaved={() => setEditingStatus(null)} />}
      {deletingStatus && <DeleteStatusModal status={deletingStatus} onClose={() => setDeletingStatus(null)} onConfirm={handleDelete} deleting={deleteLoading} />}
    </div>
  );
};

// MAIN BOOKINGS PAGE
const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: bookings = [], isLoading: bkLoading, refetch } = useGetAllBookingsQuery();
  const { data: statuses = [] } = useGetAllBookingStatusesQuery();
  const { data: customers = [] } = useGetCustomersByBusinessQuery();
  const { data: services = [] }  = useGetServicesByBusinessQuery();
  const { data: allServiceZonesResponse } = useGetAllServiceZonesQuery();
  const allServiceZones = allServiceZonesResponse?.data || allServiceZonesResponse || [];

  const [updateBookingStatus, { isLoading: updating }] = useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: deleting }]       = useDeleteBookingMutation();

  const [waitlist] = useState([
    { id: 'WL001', customer: { name: 'Alice Cooper', phone: '+91 98765 43220', avatar: '👩‍🦰' }, service: 'Facial Treatment',    preferredDate: '2026-02-16', preferredTime: 'Morning (9AM - 12PM)',   addedOn: '2026-02-14', priority: 'high'   },
    { id: 'WL002', customer: { name: 'Tom Hardy',    phone: '+91 98765 43221', avatar: '👨‍🦱' }, service: 'Deep Tissue Massage', preferredDate: '2026-02-17', preferredTime: 'Afternoon (2PM - 5PM)', addedOn: '2026-02-14', priority: 'medium' },
  ]);

  const getStatusBadge = (status = '') => {
    const colors = { confirmed: 'bg-blue-100 text-blue-700', pending: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', 'no-show': 'bg-orange-100 text-orange-700' };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const statusConfig = {
    all: { label: 'All Bookings', count: bookings.length },
    ...Object.fromEntries(statuses.map(s => [s.status?.toLowerCase(), { label: s.status, count: bookings.filter(b => b.booking_status?.status?.toLowerCase() === s.status?.toLowerCase()).length }]))
  };

  const filteredBookings = bookings.filter(b => {
    const bStatus = b.booking_status?.status?.toLowerCase() || '';
    const matchesStatus = selectedStatus === 'all' || bStatus === selectedStatus;
    const name = `${b.customer?.first_name || ''} ${b.customer?.last_name || ''}`;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || (b.booking_id || '').toLowerCase().includes(searchQuery.toLowerCase()) || (b.service?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    const cancelStatus = statuses.find(s => s.status?.toUpperCase() === 'CANCELLED');
    if (!cancelStatus) { alert('No "CANCELLED" status found'); return; }
    try { await updateBookingStatus({ id: selectedBooking.id, booking_status_id: cancelStatus.id }).unwrap(); setShowCancelModal(false); setSelectedBooking(null); refetch(); }
    catch (err) { alert(err?.data?.message || 'Failed to cancel booking'); }
  };

  const handleUpdateStatus = async (newStatusId) => {
    if (!selectedBooking || !newStatusId) return;
    try { await updateBookingStatus({ id: selectedBooking.id, booking_status_id: newStatusId }).unwrap(); setShowUpdateStatusModal(false); setSelectedBooking(null); refetch(); }
    catch (err) { alert(err?.data?.message || 'Failed to update status'); }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try { await deleteBooking(bookingId).unwrap(); refetch(); }
    catch (err) { alert(err?.data?.message || 'Failed to delete booking'); }
  };

  const TABS = [
    { key: 'all',         label: 'All Bookings' },
    { key: 'calendar',    label: 'Calendar View' },
    { key: 'waitlist',    label: `Waitlist (${waitlist.length})` },
    { key: 'status-mgmt', label: 'Status Management' },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl font-medium cursor-pointer">
            <Plus size={20} /> New Booking
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
            {tab.key === 'status-mgmt' && <Tag size={15} />}
            {tab.key === 'calendar' && <CalendarDays size={15} />}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'all' && (
        <>
          <div className="flex items-center gap-3 mb-6 overflow-x-auto">
            {Object.entries(statusConfig).map(([key, config]) => (
              <button key={key} onClick={() => setSelectedStatus(key)}
                className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${selectedStatus === key ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
                {config.label} <span className="ml-2">({config.count})</span>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search by customer name, booking ID, or service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"><Filter size={18} /> More Filters</button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {bkLoading ? (
              <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /><span className="ml-3 text-gray-500">Loading bookings...</span></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>{['Booking ID','Customer','Service','Amount','Total','Status','Actions'].map(h => <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-700 uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBookings.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                        <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">No bookings found</p>
                        <p className="text-sm mt-1">{searchQuery ? `No results for "${searchQuery}"` : 'Create your first booking'}</p>
                      </td></tr>
                    ) : filteredBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4"><span className="font-semibold text-gray-900">{booking.booking_id || `#${booking.id}`}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">{(booking.customer?.first_name?.[0] || '?').toUpperCase()}</div>
                            <div><p className="font-semibold text-gray-900">{booking.customer?.first_name} {booking.customer?.last_name}</p><p className="text-sm text-gray-500">{booking.customer?.mobile_number}</p></div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><p className="font-medium text-gray-900">{booking.service?.name || '—'}</p></td>
                        <td className="px-6 py-4"><span className="font-semibold text-gray-900">₹{Number(booking.amount || 0).toLocaleString('en-IN')}</span>{booking.gst_percent && <p className="text-xs text-gray-400">+{booking.gst_percent}% GST</p>}</td>
                        <td className="px-6 py-4"><span className="font-bold text-blue-700">₹{Number(booking.total_amount || 0).toLocaleString('en-IN')}</span></td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.booking_status?.status)}`}>{booking.booking_status?.status || 'Unknown'}</span></td>
                        <td className="px-6 py-4">
                          <div className="action-buttons-group">
                            <button onClick={() => { setSelectedBooking(booking); setShowUpdateStatusModal(true); }} className="action-btn action-btn--update" title="Update Status"><RefreshCw size={14} className="action-btn__icon" /><span className="action-btn__label">Update</span></button>
                            <button onClick={() => { setSelectedBooking(booking); setShowRescheduleModal(true); }} className="action-btn action-btn--reschedule" title="Reschedule"><Clock size={14} className="action-btn__icon" /><span className="action-btn__label">Reschedule</span></button>
                            <button onClick={() => { setSelectedBooking(booking); setShowCancelModal(true); }} className="action-btn action-btn--cancel" title="Cancel Booking"><X size={14} className="action-btn__icon" /><span className="action-btn__label">Cancel</span></button>
                            <button onClick={() => handleDeleteBooking(booking.id)} disabled={deleting} className="action-btn action-btn--delete" title="Delete"><Trash2 size={14} className="action-btn__icon" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">Showing <span className="font-semibold">{filteredBookings.length}</span> of <span className="font-semibold">{bookings.length}</span> bookings</div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer"><ChevronLeft size={18} /></button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold cursor-pointer">1</button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">2</button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer">3</button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors cursor-pointer"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'calendar' && (
        <CalendarView bookings={bookings} isLoading={bkLoading} onBack={() => setActiveTab('all')} />
      )}

      {activeTab === 'waitlist' && (
        <div className="space-y-4">
          {waitlist.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl">{item.customer.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{item.customer.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.priority === 'high' ? 'bg-red-100 text-red-700' : item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item.priority.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Phone size={14} />{item.customer.phone}</span>
                      <span className="flex items-center gap-1"><FileText size={14} />{item.service}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} />{item.preferredDate} • {item.preferredTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Added on {item.addedOn}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">Create Booking</button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">Contact</button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'status-mgmt' && <BookingStatusManagement />}

      {showCreateModal && (
        <CreateBookingModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => refetch()}
          customers={customers}
          services={services}
          statuses={statuses}
          allServiceZones={allServiceZones}
        />
      )}
      {showRescheduleModal && selectedBooking && (
        <RescheduleModal booking={selectedBooking} onClose={() => { setShowRescheduleModal(false); setSelectedBooking(null); }} />
      )}
      {showCancelModal && selectedBooking && (
        <CancelModal booking={selectedBooking} onClose={() => { setShowCancelModal(false); setSelectedBooking(null); }} onConfirm={handleCancelBooking} updating={updating} />
      )}
      {showUpdateStatusModal && selectedBooking && (
        <UpdateStatusModal booking={selectedBooking} statuses={statuses} onClose={() => { setShowUpdateStatusModal(false); setSelectedBooking(null); }} onConfirm={handleUpdateStatus} updating={updating} getStatusBadge={getStatusBadge} />
      )}
    </div>
  );
};

export default BookingsPage;
