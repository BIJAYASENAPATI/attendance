import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    Calendar, Clock, Plus, Trash2, X, Check, MapPin, AlertTriangle,
    Zap, Edit3, ChevronDown, Sliders, Target, Info, User, Save,
    Settings2, CalendarOff, ArrowRight, CalendarPlus, ShieldAlert,
    Eye, Activity, CheckCircle2, XCircle, Layers, ChevronRight
} from 'lucide-react';
import {
    useGetAllServiceZonesQuery,
    useCreateSlotMutation,
    useGetSlotsByServiceZoneQuery,
    useDeleteSlotMutation,
    useGetAllBookingsQuery,
    useAutoGenerateSlotsMutation,
    useUpdateSlotMutation,
    useUpdateServiceZoneMutation,
    useCreateServiceZoneMutation,
    useGetAllStaffsQuery,
    useUpdateServiceZoneInactivePeriodsMutation,
    useGetAllServicesQuery,
} from '../../app/service/slice';

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
    <style>{`
        button, a, [role="button"] { cursor: pointer !important; }
        button:disabled { cursor: not-allowed !important; }
        .slot-card { transition: all 0.18s cubic-bezier(.4,0,.2,1); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .slot-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .modal-enter { animation: fadeSlideIn 0.22s ease; }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .add-method-btn { transition: all 0.2s cubic-bezier(.4,0,.2,1); }
        .add-method-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
        .cal-day-btn { transition: all 0.12s ease; }
        .cal-day-btn:hover:not(:disabled) { transform: scale(1.08); }
        @keyframes calPop { from { opacity:0; transform:translateY(6px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .cal-pop { animation: calPop 0.18s ease; }
    `}</style>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
};
const toMinutes      = (t) => { if (!t) return 0; const p = t.split(':').map(Number); return p[0]*60+p[1]; };
const minutesToStr   = (m) => { const h = Math.floor(Math.max(0,m)/60)%24; const mm = Math.max(0,m)%60; return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`; };
const normalizeTime  = (t) => { if (!t) return ''; const p = t.split(':'); return `${p[0].padStart(2,'0')}:${p[1].padStart(2,'0')}`; };
const toApiTime      = (t) => { if (!t) return t; return t.split(':').length===3 ? t : `${t}:00`; };
const todayStr       = () => new Date().toISOString().split('T')[0];
const dateLabel      = (d) => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : null;

// ─── Zone status (mirrors backend) ───────────────────────────────────────────
const getZoneStatus = (zone) => {
    const now       = new Date();
    const todayDate = new Date(todayStr()+'T00:00:00');
    if (zone.is_manually_inactive) {
        if (zone.manual_inactive_until && now > new Date(zone.manual_inactive_until)) return 'active';
        return 'manually_inactive';
    }
    for (const p of (zone.inactive_periods||[])) {
        if (!p.from_date) continue;
        const from = new Date(p.from_date+'T00:00:00');
        const to   = p.to_date ? new Date(p.to_date+'T00:00:00') : null;
        if (todayDate >= from && (!to || todayDate <= to)) return 'temporarily_inactive';
    }
    const activation = zone.activation_start_date ? new Date(zone.activation_start_date+'T00:00:00') : null;
    const expiry     = zone.expiry_date            ? new Date(zone.expiry_date+'T00:00:00')            : null;
    if (activation && todayDate < activation) return 'not_started';
    if (expiry     && todayDate > expiry)     return 'expired';
    return 'active';
};

// ─── Custom Date Picker ───────────────────────────────────────────────────────
const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const CustomDatePicker = ({ value, onChange, minDate }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const parseDate = (s) => { if (!s) return new Date(); const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); };
    const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const sel = parseDate(value);
    const [vy, setVy] = useState(sel.getFullYear());
    const [vm, setVm] = useState(sel.getMonth());
    useEffect(()=>{ const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener('mousedown',h); return()=>document.removeEventListener('mousedown',h); },[]);
    const today = new Date(); today.setHours(0,0,0,0);
    const minD = minDate ? parseDate(minDate) : null;
    const fd = new Date(vy,vm,1).getDay();
    const dim = new Date(vy,vm+1,0).getDate();
    const cells=[]; for(let i=0;i<fd;i++)cells.push(null); for(let d=1;d<=dim;d++)cells.push(d); while(cells.length%7!==0)cells.push(null);
    const prevM=()=>{if(vm===0){setVm(11);setVy(y=>y-1);}else setVm(m=>m-1);};
    const nextM=()=>{if(vm===11){setVm(0);setVy(y=>y+1);}else setVm(m=>m+1);};
    const selectDay=(d)=>{ if(!d)return; const p=new Date(vy,vm,d); if(minD&&p<minD)return; onChange(toYMD(p)); setOpen(false); };
    const display=value?parseDate(value).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'Select date';
    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={()=>{setOpen(o=>!o);setVy(sel.getFullYear());setVm(sel.getMonth());}}
                className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                <Calendar size={14} className="text-blue-500 flex-shrink-0"/>
                <span className="flex-1 text-left text-gray-800 font-medium">{display}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${open?'rotate-180':''}`}/>
            </button>
            {open&&(
                <div className="cal-pop absolute left-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{width:280}}>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
                        <button onClick={prevM} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white"><ChevronDown size={14} className="rotate-90"/></button>
                        <p className="text-white font-bold text-sm">{MONTHS[vm]} {vy}</p>
                        <button onClick={nextM} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white"><ChevronDown size={14} className="-rotate-90"/></button>
                    </div>
                    <div className="grid grid-cols-7 bg-blue-50 px-2 pt-2 pb-1">{DAY_NAMES.map(d=><div key={d} className="text-center text-[10px] font-bold text-blue-400 uppercase py-1">{d}</div>)}</div>
                    <div className="grid grid-cols-7 gap-0.5 px-2 pb-3 pt-1 bg-white">
                        {cells.map((d,i)=>{
                            if(!d)return<div key={i}/>;
                            const cd=new Date(vy,vm,d); cd.setHours(0,0,0,0);
                            const isTod=cd.getTime()===today.getTime(), isSel=value&&toYMD(cd)===value, isDis=minD&&cd<minD;
                            return(<button key={i} type="button" onClick={()=>selectDay(d)} disabled={isDis}
                                className={`cal-day-btn w-full aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition-all
                                    ${isSel?'bg-blue-500 text-white shadow-md scale-110':isTod?'bg-blue-100 text-blue-700 ring-2 ring-blue-400 ring-offset-1':isDis?'text-gray-200 cursor-not-allowed':'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>{d}</button>);
                        })}
                    </div>
                    <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between bg-gray-50">
                        <button onClick={()=>{onChange(toYMD(today));setOpen(false);}} className="text-xs font-bold text-blue-500 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50">Today</button>
                        <button onClick={()=>setOpen(false)} className="text-xs font-medium text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Inactive Period Manager ──────────────────────────────────────────────────
const BLANK_P = { id:null, from_date:'', to_date:'', from_time:'', to_time:'', reason:'' };
const InactivePeriodManager = ({ periods=[], onChange }) => {
    const [adding, setAdding] = useState(false);
    const [form,   setForm]   = useState(BLANK_P);
    const [err,    setErr]    = useState('');
    const [editId, setEditId] = useState(null);
    const validate=()=>{ if(!form.from_date)return'Start date required.'; if(form.to_date&&form.to_date<form.from_date)return'End date must be ≥ start.'; if((form.from_time&&!form.to_time)||(!form.from_time&&form.to_time))return'Provide both times or neither.'; if(form.from_time&&form.to_time&&form.from_time>=form.to_time)return'End time must be after start.'; return null; };
    const save=()=>{ const e=validate(); if(e){setErr(e);return;} const entry={...form,id:editId??Date.now()}; onChange(editId!==null?periods.map(p=>p.id===editId?entry:p):[...periods,entry]); setAdding(false);setForm(BLANK_P);setEditId(null);setErr(''); };
    const edit=(p)=>{setForm({...p});setEditId(p.id);setAdding(true);setErr('');};
    const del=(id)=>onChange(periods.filter(p=>p.id!==id));
    return(
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Temporary Inactive Periods</p>
                {!adding&&<button type="button" onClick={()=>{setAdding(true);setForm(BLANK_P);setEditId(null);setErr('');}} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg"><Plus size={12}/>Add Period</button>}
            </div>
            {adding&&(
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">From Date *</label><input type="date" value={form.from_date} onChange={e=>{setForm(p=>({...p,from_date:e.target.value}));setErr('');}} className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white"/></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">To Date (optional)</label><input type="date" value={form.to_date} min={form.from_date||todayStr()} onChange={e=>{setForm(p=>({...p,to_date:e.target.value}));setErr('');}} className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white"/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">From Time (optional)</label><input type="time" value={form.from_time} onChange={e=>{setForm(p=>({...p,from_time:e.target.value}));setErr('');}} className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white"/></div>
                        <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">To Time (optional)</label><input type="time" value={form.to_time} onChange={e=>{setForm(p=>({...p,to_time:e.target.value}));setErr('');}} className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white"/></div>
                    </div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason</label><input type="text" value={form.reason} placeholder="e.g. Public holiday…" onChange={e=>setForm(p=>({...p,reason:e.target.value}))} className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white"/></div>
                    {err&&<div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2"><AlertTriangle size={13} className="text-red-500"/><p className="text-xs font-semibold text-red-700">{err}</p></div>}
                    <div className="flex gap-2">
                        <button type="button" onClick={()=>{setAdding(false);setForm(BLANK_P);setEditId(null);setErr('');}} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={save} className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold">{editId!==null?'Update':'Add Period'}</button>
                    </div>
                </div>
            )}
            {periods.length===0&&!adding&&<p className="text-xs text-gray-400 italic py-1">No inactive periods set.</p>}
            {periods.map(p=>{
                const now=new Date(todayStr()+'T00:00:00'),from=new Date(p.from_date+'T00:00:00'),to=p.to_date?new Date(p.to_date+'T00:00:00'):null;
                const st=now<from?'upcoming':(to&&now>to)?'ended':'active';
                const cc={active:'border-amber-300 bg-amber-50',upcoming:'border-blue-200 bg-blue-50',ended:'border-gray-200 bg-gray-50'};
                const bc={active:'bg-amber-500 text-white',upcoming:'bg-blue-500 text-white',ended:'bg-gray-400 text-white'};
                return(
                    <div key={p.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 ${cc[st]}`}>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-bold text-gray-800">{dateLabel(p.from_date)}{p.to_date?` → ${dateLabel(p.to_date)}`:' (open-ended)'}</span>
                                {p.from_time&&p.to_time&&<span className="text-xs text-gray-500">{p.from_time} – {p.to_time}</span>}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bc[st]}`}>{st.toUpperCase()}</span>
                            </div>
                            {p.reason&&<p className="text-xs text-gray-500 italic truncate">{p.reason}</p>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <button type="button" onClick={()=>edit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={13}/></button>
                            <button type="button" onClick={()=>del(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13}/></button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Zone Form ────────────────────────────────────────────────────────────────
// NOTE: No date-range conflict check — multiple zones on the same/overlapping
//       dates are explicitly allowed. Activation date is restricted to today+.
const EMPTY_ZONE = {
    zone_name:'', zone_description:'', staff_in_charge:'',
    is_time_fixed:false, is_no_of_slots_fixed:false,
    each_slot_time:'', start_time:'', end_time:'', no_of_slots:'',
    activation_start_date:'', expiry_date:'', inactivePeriods:[]
};

const ZoneForm = ({
    formData, onChange, onPeriodsChange, staffList,
    onSubmit, onCancel, isLoading, submitLabel, extApiError=''
}) => {
    // Only validate that expiry >= activation; NO overlap/conflict check at all.
    const dateError = useMemo(() => {
        if (extApiError) return extApiError;
        if (formData.activation_start_date && formData.expiry_date) {
            if (formData.expiry_date < formData.activation_start_date)
                return 'Expiry date must be on or after the activation date.';
        }
        return null;
    }, [formData.activation_start_date, formData.expiry_date, extApiError]);

    return (
        <form onSubmit={onSubmit} className="p-6 space-y-5 max-h-[76vh] overflow-y-auto">
            {dateError && (
                <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3">
                    <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5"/>
                    <div>
                        <p className="text-sm font-bold text-red-800">Invalid Date</p>
                        <p className="text-xs text-red-600 mt-0.5">{dateError}</p>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Zone Name */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Zone Name *</label>
                    <input name="zone_name" value={formData.zone_name} onChange={onChange} required
                        placeholder="e.g. Morning Slot, VIP Zone"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"/>
                </div>
                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea name="zone_description" value={formData.zone_description} onChange={onChange}
                        placeholder="Optional description" rows={2}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"/>
                </div>
                {/* Staff */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Staff in Charge *</label>
                    <select name="staff_in_charge" value={formData.staff_in_charge} onChange={onChange} required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="">Select Staff Member</option>
                        {staffList.map(s=><option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                    </select>
                </div>
                {/* Times */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Start Time</label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={onChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">End Time</label>
                    <input type="time" name="end_time" value={formData.end_time} onChange={onChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                {/* Slots / Duration */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">No. of Slots</label>
                    <input type="number" name="no_of_slots" value={formData.no_of_slots} onChange={onChange}
                        placeholder="e.g. 10"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Slot Duration (mins)</label>
                    <input type="number" name="each_slot_time" value={formData.each_slot_time} onChange={onChange}
                        placeholder="e.g. 30"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
                </div>
                {/* Activation Date — min = today, no past dates allowed */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Activation Date *
                        <span className="ml-1 text-blue-500 normal-case font-normal text-[10px]">(today or future)</span>
                    </label>
                    <input
                        type="date"
                        name="activation_start_date"
                        value={formData.activation_start_date}
                        onChange={onChange}
                        required
                        min={todayStr()}   // ← blocks past dates in the browser date-picker
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${dateError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    <p className="text-[11px] text-gray-400 mt-1 ml-1">Cannot be in the past</p>
                </div>
                {/* Expiry Date */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Expiry Date <span className="font-normal text-gray-400">(optional)</span></label>
                    <input
                        type="date"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={onChange}
                        min={formData.activation_start_date || todayStr()}
                        className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${dateError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                </div>
                {/* Checkboxes */}
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="is_time_fixed" checked={formData.is_time_fixed} onChange={onChange} className="w-5 h-5 text-blue-600 rounded-md"/>
                        <span className="text-sm text-gray-700 font-semibold">Fixed Time</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="is_no_of_slots_fixed" checked={formData.is_no_of_slots_fixed} onChange={onChange} className="w-5 h-5 text-purple-600 rounded-md"/>
                        <span className="text-sm text-gray-700 font-semibold">Fixed No. of Slots</span>
                    </label>
                </div>
                {/* Inactive periods */}
                <div className="md:col-span-2 border-2 border-amber-100 rounded-2xl p-4 bg-gradient-to-br from-amber-50/60 to-orange-50/40">
                    <InactivePeriodManager periods={formData.inactivePeriods||[]} onChange={onPeriodsChange}/>
                </div>
            </div>
            <div className="flex gap-3 pt-2 border-t-2 border-gray-100">
                <button type="button" onClick={onCancel}
                    className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading || !!dateError}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold text-sm disabled:opacity-50 shadow-lg">
                    {isLoading ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
};

// ─── Create Zone Modal (2-step: pick service → fill form) ────────────────────
const CreateZoneModal = ({ onClose, onCreate, staffList, suggestedActivation }) => {
    const { data: servicesRaw = [] } = useGetAllServicesQuery();
    const services = Array.isArray(servicesRaw) ? servicesRaw : (servicesRaw?.data || servicesRaw?.services || []);

    const { data: zonesResp } = useGetAllServiceZonesQuery();
    const allZonesRaw = useMemo(() => zonesResp?.data||zonesResp||[], [zonesResp]);

    const [step,        setStep]       = useState(1);
    const [selectedSvc, setSelectedSvc] = useState(null);
    const [svcSearch,   setSvcSearch]  = useState('');

    // Clamp suggestedActivation to today if it falls in the past
    const safeActivation = useMemo(() => {
        const today = todayStr();
        if (!suggestedActivation) return today;
        return suggestedActivation < today ? today : suggestedActivation;
    }, [suggestedActivation]);

    const [form,     setForm]     = useState({ ...EMPTY_ZONE, activation_start_date: safeActivation });
    const [apiError, setApiError] = useState('');
    const [busy,     setBusy]     = useState(false);

    const filteredServices = useMemo(() =>
        services.filter(s => (s.name||s.service_name||'').toLowerCase().includes(svcSearch.toLowerCase())),
    [services, svcSearch]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        let finalValue = type === 'checkbox' ? checked : value;

        // Silently clamp activation_start_date to today if user somehow picks past date
        if (name === 'activation_start_date' && finalValue && finalValue < todayStr()) {
            finalValue = todayStr();
        }

        setForm(f => ({ ...f, [name]: finalValue }));
        if (['activation_start_date','expiry_date'].includes(name)) setApiError('');
    };

    const handleSelectService = (svc) => { setSelectedSvc(svc); setStep(2); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setApiError('');
        try {
            await onCreate({ ...form, service_id: selectedSvc.id });
            onClose();
        } catch (err) {
            const msg = err?.data?.message || 'Failed to create zone';
            setApiError(msg);
        } finally {
            setBusy(false);
        }
    };

    const zonesForService = useMemo(() =>
        selectedSvc ? allZonesRaw.filter(z => String(z.service_id) === String(selectedSvc.id)) : [],
    [allZonesRaw, selectedSvc]);

    const svcName = selectedSvc?.name || selectedSvc?.service_name || '';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden modal-enter">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                            <CalendarPlus size={22} className="text-white"/>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-xl">Create Service Zone</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step===1?'bg-white text-blue-600':'bg-white/20 text-white/70'}`}>
                                    1 · Select Service
                                </span>
                                <ChevronRight size={12} className="text-white/50"/>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step===2?'bg-white text-blue-600':'bg-white/20 text-white/70'}`}>
                                    2 · Zone Details
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center">
                        <X size={18} className="text-white"/>
                    </button>
                </div>

                {/* Step 1 — Pick a Service */}
                {step === 1 && (
                    <div className="p-6">
                        <p className="text-sm font-semibold text-gray-600 mb-4">
                            Which service should this zone belong to?
                        </p>
                        <div className="relative mb-4">
                            <input
                                type="text" value={svcSearch}
                                onChange={e=>setSvcSearch(e.target.value)}
                                placeholder="Search services…"
                                className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-400 outline-none"
                            />
                            <Eye size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        </div>

                        {services.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">No services found.</div>
                        ) : filteredServices.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm">No services match "{svcSearch}".</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                                {filteredServices.map(svc => {
                                    const name  = svc.name || svc.service_name || `Service #${svc.id}`;
                                    const desc  = svc.description || svc.service_description || '';
                                    const zones = allZonesRaw.filter(z=>String(z.service_id)===String(svc.id));
                                    const activeZ = zones.filter(z=>getZoneStatus(z)==='active').length;
                                    return (
                                        <button key={svc.id} onClick={()=>handleSelectService(svc)}
                                            className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-all group">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-purple-200 transition-all">
                                                <Layers size={18} className="text-blue-600"/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-gray-900 truncate">{name}</p>
                                                {desc && <p className="text-xs text-gray-500 truncate mt-0.5">{desc}</p>}
                                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                        {zones.length} zone{zones.length!==1?'s':''}
                                                    </span>
                                                    {activeZ>0&&<span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">{activeZ} active</span>}
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-colors"/>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
                            <button onClick={onClose} className="px-5 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-semibold">Cancel</button>
                        </div>
                    </div>
                )}

                {/* Step 2 — Fill zone details */}
                {step === 2 && (
                    <>
                        <div className="px-6 pt-4 pb-0">
                            <div className="flex items-center gap-2 mb-1">
                                <button onClick={()=>setStep(1)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors">
                                    ← Back
                                </button>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg">
                                    <Layers size={13} className="text-blue-600"/>
                                    <span className="text-xs font-bold text-blue-800">Service: {svcName}</span>
                                </div>
                            </div>
                        </div>
                        <ZoneForm
                            formData={form}
                            onChange={handleChange}
                            onPeriodsChange={p=>setForm(f=>({...f,inactivePeriods:p}))}
                            staffList={staffList}
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                            isLoading={busy}
                            submitLabel="Create Zone"
                            extApiError={apiError}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// ─── View Zones Modal (Active + Expired tabs) ─────────────────────────────────
const ViewZonesModal = ({ onClose, zonesWithStatus, onCreateZone, initialTab='active' }) => {
    const [tab, setTab] = useState(initialTab);

    const activeZones  = useMemo(() => zonesWithStatus.filter(z => ['active','not_started','temporarily_inactive','manually_inactive'].includes(z._status)), [zonesWithStatus]);
    const expiredZones = useMemo(() => zonesWithStatus.filter(z => z._status === 'expired'), [zonesWithStatus]);
    const displayed    = tab === 'active' ? activeZones : expiredZones;

    const STATUS_STYLE = {
        active:               { label:'Active',         bg:'bg-green-100', text:'text-green-700', dot:'bg-green-500'  },
        not_started:          { label:'Upcoming',       bg:'bg-cyan-100',  text:'text-cyan-700',  dot:'bg-cyan-500'   },
        temporarily_inactive: { label:'Temp. Inactive', bg:'bg-amber-100', text:'text-amber-700', dot:'bg-amber-500'  },
        manually_inactive:    { label:'Deactivated',    bg:'bg-red-100',   text:'text-red-700',   dot:'bg-red-500'    },
        expired:              { label:'Expired',        bg:'bg-gray-100',  text:'text-gray-600',  dot:'bg-gray-400'   },
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden modal-enter">
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-7 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center"><Eye size={22} className="text-white"/></div>
                        <div>
                            <h2 className="text-white font-bold text-xl">Service Zones</h2>
                            <p className="text-slate-300 text-sm mt-0.5">{zonesWithStatus.length} total · {activeZones.length} active · {expiredZones.length} expired</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center"><X size={18} className="text-white"/></button>
                </div>

                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button onClick={()=>setTab('active')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all border-b-2 ${tab==='active'?'border-green-500 text-green-700 bg-white':'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <CheckCircle2 size={16} className={tab==='active'?'text-green-500':'text-gray-400'}/>
                        Active Zones
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tab==='active'?'bg-green-100 text-green-700':'bg-gray-200 text-gray-500'}`}>{activeZones.length}</span>
                    </button>
                    <button onClick={()=>setTab('expired')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-all border-b-2 ${tab==='expired'?'border-orange-500 text-orange-700 bg-white':'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <CalendarOff size={16} className={tab==='expired'?'text-orange-500':'text-gray-400'}/>
                        Expired Zones
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tab==='expired'?'bg-orange-100 text-orange-700':'bg-gray-200 text-gray-500'}`}>{expiredZones.length}</span>
                    </button>
                </div>

                <div className="p-5 max-h-[55vh] overflow-y-auto space-y-3">
                    {displayed.length === 0 ? (
                        <div className="text-center py-14">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                {tab==='active'?<CheckCircle2 size={28} className="text-gray-300"/>:<CalendarOff size={28} className="text-gray-300"/>}
                            </div>
                            <p className="text-gray-500 font-semibold text-sm">No {tab} zones found</p>
                            {tab==='active' && (
                                <button onClick={()=>{ onClose(); onCreateZone(); }}
                                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-sm shadow-md">
                                    <CalendarPlus size={15}/> Create Zone
                                </button>
                            )}
                        </div>
                    ) : (
                        displayed.map(zone => {
                            const st = STATUS_STYLE[zone._status] || STATUS_STYLE.active;
                            return (
                                <div key={zone.id} className="flex items-start gap-4 p-4 bg-white border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-3 h-3 rounded-full ${st.dot} shadow-sm`}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="font-bold text-gray-900 text-sm">{zone.zone_name}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                                            {zone.start_time && zone.end_time && (
                                                <span className="flex items-center gap-1"><Clock size={11}/>{formatTime(normalizeTime(zone.start_time))} – {formatTime(normalizeTime(zone.end_time))}</span>
                                            )}
                                            {zone.no_of_slots && <span className="flex items-center gap-1"><MapPin size={11}/>{zone.no_of_slots} slots</span>}
                                            {zone.each_slot_time && <span>{zone.each_slot_time} min/slot</span>}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                                            <Calendar size={11}/>
                                            <span>{dateLabel(zone.activation_start_date)}{zone.expiry_date ? ` → ${dateLabel(zone.expiry_date)}` : ' → No expiry'}</span>
                                        </div>
                                        {zone._status === 'expired' && zone.expiry_date && (
                                            <p className="text-[11px] text-orange-500 font-semibold mt-1 flex items-center gap-1">
                                                <CalendarOff size={10}/> Expired {dateLabel(zone.expiry_date)}
                                            </p>
                                        )}
                                        {zone._status === 'manually_inactive' && zone.manual_inactive_reason && (
                                            <p className="text-[11px] text-red-500 font-medium mt-1 truncate">Reason: {zone.manual_inactive_reason}</p>
                                        )}
                                    </div>
                                    {zone.service_name && (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 flex-shrink-0">{zone.service_name}</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <p className="text-xs text-gray-500">{displayed.length} zone{displayed.length!==1?'s':''} shown</p>
                    <div className="flex items-center gap-2">
                        {tab === 'expired' && expiredZones.length > 0 && (
                            <button onClick={()=>{ onClose(); onCreateZone(); }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-sm hover:from-orange-600 hover:to-amber-600 transition-all">
                                <CalendarPlus size={13}/> Create New Zone
                            </button>
                        )}
                        <button onClick={onClose} className="px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-semibold">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Zone Slot Badge ──────────────────────────────────────────────────────────
const ZoneSlotBadge = ({ zone, date, bookingBySlotId }) => {
    const { data: slots=[] } = useGetSlotsByServiceZoneQuery({ service_zone_id:zone.id, date }, { skip:!zone.id||!date });
    const created=slots.length, max=zone.no_of_slots??null, booked=slots.filter(s=>!!bookingBySlotId[String(s.id)]).length;
    return(
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {max!==null&&<span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${created>=max?'bg-red-100 text-red-600':'bg-emerald-100 text-emerald-700'}`}>{created}/{max}</span>}
            {booked>0&&<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{booked} booked</span>}
        </div>
    );
};

// ─── Edit Zone Settings Modal ─────────────────────────────────────────────────
const EditZoneSettingsModal = ({ zone, onClose, onSave }) => {
    const [form, setForm] = useState({ start_time:zone.start_time?normalizeTime(zone.start_time):'', end_time:zone.end_time?normalizeTime(zone.end_time):'', no_of_slots:zone.no_of_slots??'', each_slot_time:zone.each_slot_time??'' });
    const [err, setErr]   = useState('');
    const [busy, setBusy] = useState(false);
    const handleChange = (e) => { setForm(f=>({...f,[e.target.name]:e.target.value})); setErr(''); };
    const validate=()=>{ if(form.start_time&&form.end_time&&toMinutes(form.start_time)>=toMinutes(form.end_time))return'End time must be after start time'; if(form.no_of_slots!==''&&Number(form.no_of_slots)<1)return'Total slots must be positive'; if(form.each_slot_time!==''&&Number(form.each_slot_time)<1)return'Duration must be at least 1 minute'; return null; };
    const handleSave=async()=>{ const e=validate(); if(e){setErr(e);return;} setBusy(true); try{ await onSave({ start_time:form.start_time?toApiTime(form.start_time):null, end_time:form.end_time?toApiTime(form.end_time):null, no_of_slots:form.no_of_slots!==''?Number(form.no_of_slots):null, each_slot_time:form.each_slot_time!==''?Number(form.each_slot_time):null }); onClose(); }catch(e){setErr(e?.data?.message||'Failed to save');}finally{setBusy(false);} };
    const preview=useMemo(()=>{ if(!form.start_time||!form.end_time)return null; const t=toMinutes(form.end_time)-toMinutes(form.start_time); if(t<=0)return null; const d=Number(form.each_slot_time); return{t,count:d>=1?Math.floor(t/d):null}; },[form]);
    return(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg modal-enter overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Settings2 size={20} className="text-white"/></div><div><h2 className="text-white font-bold text-lg">Zone Settings</h2><p className="text-indigo-200 text-sm truncate max-w-[240px]">{zone.zone_name}</p></div></div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"><X size={16} className="text-white"/></button>
                </div>
                <div className="p-6 space-y-5">
                    <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Clock size={12} className="text-indigo-500"/>Operating Hours</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Time</label><input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/></div>
                            <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">End Time</label><input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/></div>
                        </div>
                    </div>
                    <div><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Target size={12} className="text-indigo-500"/>Slot Configuration</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Total Slots <span className="font-normal text-gray-400">(max)</span></label><input type="number" name="no_of_slots" value={form.no_of_slots} onChange={handleChange} min={1} placeholder="e.g. 20" className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/><p className="text-[11px] text-gray-400 mt-1">Leave empty for unlimited</p></div>
                            <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Slot Duration <span className="font-normal text-gray-400">(min)</span></label><input type="number" name="each_slot_time" value={form.each_slot_time} onChange={handleChange} min={1} max={1440} placeholder="e.g. 30" className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"/></div>
                        </div>
                    </div>
                    {preview&&<div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-xl p-4"><p className="text-xs font-bold text-indigo-700 mb-2 flex items-center gap-1.5"><Zap size={12}/>Auto-generate preview</p><div className="flex items-center gap-4 flex-wrap"><div className="text-center"><p className="text-xl font-bold text-indigo-700">{preview.t}</p><p className="text-[11px] text-indigo-500 font-medium">total mins</p></div>{preview.count!=null&&<><div className="text-indigo-300 font-bold text-lg">÷</div><div className="text-center"><p className="text-xl font-bold text-indigo-700">{form.each_slot_time}</p><p className="text-[11px] text-indigo-500 font-medium">min/slot</p></div><div className="text-indigo-300 font-bold text-lg">=</div><div className="text-center"><p className="text-2xl font-bold text-purple-700">{preview.count}</p><p className="text-[11px] text-purple-500 font-medium">slots fit</p></div></>}</div></div>}
                    {err&&<div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-lg px-3 py-2.5"><AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5"/><p className="text-xs text-red-700 font-medium">{err}</p></div>}
                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5"><Info size={13} className="text-blue-500 flex-shrink-0 mt-0.5"/><p className="text-xs text-blue-700">Changes apply to <strong>new slots only</strong>. Existing booked slots are not affected.</p></div>
                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm">Cancel</button>
                        <button onClick={handleSave} disabled={busy} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 shadow-lg">
                            {busy?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>:<><Save size={14}/>Save Settings</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Edit Slot Modal ──────────────────────────────────────────────────────────
const EditSlotModal = ({ slot, zone, existingSlots, onClose, onSave }) => {
    const defaultDuration = parseInt(zone?.each_slot_time) || 30;
    const [start, setStart]   = useState(normalizeTime(slot.start_time));
    const [dur,   setDur]     = useState(slot.duration_minutes||30);
    const [err,   setErr]     = useState('');
    const [busy,  setBusy]    = useState(false);
    const end = minutesToStr(toMinutes(start)+parseInt(dur));
    const validate=()=>{ if(parseInt(dur)<1)return'Duration must be ≥ 1'; if(zone?.start_time&&toMinutes(start)<toMinutes(normalizeTime(zone.start_time)))return`Before zone open (${formatTime(normalizeTime(zone.start_time))})`; if(zone?.end_time&&toMinutes(end)>toMinutes(normalizeTime(zone.end_time)))return`After zone close (${formatTime(normalizeTime(zone.end_time))})`; const c=existingSlots.find(s=>s.id!==slot.id&&toMinutes(normalizeTime(s.start_time))<toMinutes(end)&&toMinutes(normalizeTime(s.end_time))>toMinutes(start)); if(c)return`Conflicts with ${formatTime(c.start_time)}–${formatTime(c.end_time)}`; return null; };
    const handleSave=async()=>{ const e=validate(); if(e){setErr(e);return;} setBusy(true); try{await onSave(slot,{start_time:toApiTime(start),duration_minutes:parseInt(dur)});onClose();}catch(e){setErr(e?.data?.message||'Failed to save');}finally{setBusy(false);} };
    return(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-enter overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Edit3 size={20} className="text-white"/></div><div><h2 className="text-white font-bold text-lg">Edit Slot</h2><p className="text-violet-100 text-sm">{formatTime(normalizeTime(slot.start_time))} · {slot.duration_minutes}m</p></div></div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"><X size={16} className="text-white"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Start Time</label><input type="time" value={start} onChange={e=>{setStart(e.target.value);setErr('');}} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"/></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Duration (min)</label><input type="number" min={1} max={defaultDuration} value={dur} onChange={e=>{setDur(e.target.value);setErr('');}} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"/></div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3"><p className="text-xs font-bold text-gray-600 mb-1">Preview:</p><p className="text-sm font-bold text-violet-700">{formatTime(start)} → {formatTime(end)} ({dur} min)</p></div>
                    {err&&<div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-lg px-3 py-2.5"><AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5"/><p className="text-xs text-red-700 font-medium">{err}</p></div>}
                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm">Cancel</button>
                        <button onClick={handleSave} disabled={busy} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 shadow-lg">
                            {busy?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</>:<><Save size={14}/>Save</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Add Slot Method Modal ────────────────────────────────────────────────────
const AddSlotMethodModal = ({ onClose, onChoose, zone, existingSlots }) => {
    const maxSlots      = zone?.no_of_slots ?? null;
    const createdCount  = existingSlots.length;
    const remainSlots   = maxSlots !== null ? maxSlots - createdCount : null;

    const zoneEndMin   = zone?.end_time   ? toMinutes(normalizeTime(zone.end_time))   : null;
    const zoneStartMin = zone?.start_time ? toMinutes(normalizeTime(zone.start_time)) : null;

    const { remainTimeMin, nextFreeStr } = useMemo(() => {
        if (zoneStartMin === null) return { remainTimeMin: null, nextFreeStr: '09:00' };
        const zE = zoneEndMin ?? (zoneStartMin + 480);
        const occupied = [...existingSlots]
            .map(s => { const st = toMinutes(normalizeTime(s.start_time)); return [st, st + (s.duration_minutes || zone?.each_slot_time || 30)]; })
            .sort((a, b) => a[0] - b[0]);
        let freeTotal = 0, cursor = zoneStartMin, firstFreeMin = null;
        for (const [oS, oE] of occupied) {
            if (oS > cursor) {
                if (firstFreeMin === null) firstFreeMin = cursor;
                freeTotal += oS - cursor;
            }
            cursor = Math.max(cursor, oE);
        }
        if (cursor < zE) {
            if (firstFreeMin === null) firstFreeMin = cursor;
            freeTotal += zE - cursor;
        }
        const nf = firstFreeMin ?? zoneStartMin;
        return { remainTimeMin: zoneEndMin !== null ? Math.max(0, freeTotal) : null, nextFreeStr: minutesToStr(nf) };
    }, [existingSlots, zoneStartMin, zoneEndMin]);

    const hasPartial = existingSlots.length > 0 && (remainSlots !== 0 || remainTimeMin !== 0);
    const fmtMins = (m) => { if (m === null) return '—'; if (m >= 60) return `${Math.floor(m/60)}h ${m%60>0?m%60+'m':''}`.trim(); return `${m}m`; };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg modal-enter overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-bold text-lg">Add Slots</h2>
                        <p className="text-blue-100 text-sm mt-0.5">{zone?.zone_name} · Choose creation method</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"><X size={16} className="text-white"/></button>
                </div>

                {hasPartial && (
                    <div className="mx-5 mt-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Info size={12} className="text-amber-600"/> Remaining Capacity
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl border border-amber-200 p-3 text-center shadow-sm">
                                <p className="text-2xl font-bold text-amber-700">{remainSlots ?? '∞'}</p>
                                <p className="text-[10px] font-bold text-amber-500 uppercase mt-0.5">Slots Left</p>
                            </div>
                            <div className="bg-white rounded-xl border border-blue-200 p-3 text-center shadow-sm">
                                <p className="text-2xl font-bold text-blue-700">{fmtMins(remainTimeMin)}</p>
                                <p className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">Time Left</p>
                            </div>
                            <div className="bg-white rounded-xl border border-emerald-200 p-3 text-center shadow-sm">
                                <p className="text-lg font-bold text-emerald-700">{formatTime(nextFreeStr)}</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase mt-0.5">Next Start</p>
                            </div>
                        </div>
                        {zoneEndMin !== null && zoneStartMin !== null && (
                            <div className="mt-3 flex items-center justify-center gap-2 bg-white/70 border border-amber-100 rounded-lg px-3 py-2 flex-wrap">
                                <Clock size={12} className="text-amber-600 flex-shrink-0"/>
                                <span className="text-xs font-semibold text-gray-700">
                                    Zone: <strong className="text-amber-800">{formatTime(minutesToStr(zoneStartMin))}</strong>
                                    <span className="mx-1 text-gray-400">→</span>
                                    <strong className="text-amber-800">{formatTime(minutesToStr(zoneEndMin))}</strong>
                                </span>
                                {remainTimeMin !== null && remainTimeMin > 0 && (
                                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">
                                        {fmtMins(remainTimeMin)} free across gaps
                                    </span>
                                )}
                            </div>
                        )}
                        {remainTimeMin === 0 && (
                            <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <AlertTriangle size={12} className="text-red-500"/>
                                <span className="text-xs font-semibold text-red-700">No time remaining in zone window</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-5 grid gap-3">
                    {[
                        {id:'auto',   icon:Zap,     title:'Auto Generator',  desc:'Fill remaining window with slots automatically', bg:'bg-blue-50',    border:'border-blue-200',    iconBg:'bg-blue-100',    iconColor:'text-blue-600'},
                        {id:'manual', icon:Sliders, title:'Manual Addition',  desc:'Add a single slot at a specific time',            bg:'bg-emerald-50', border:'border-emerald-200', iconBg:'bg-emerald-100', iconColor:'text-emerald-600'},
                    ].map(m => (
                        <button key={m.id}
                            onClick={() => onChoose(m.id, { nextFreeStr, remainSlots, remainTimeMin, zoneEndMin })}
                            className={`add-method-btn flex items-center gap-4 p-4 rounded-xl border-2 ${m.border} ${m.bg} text-left group`}>
                            <div className={`w-12 h-12 ${m.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <m.icon size={22} className={m.iconColor}/>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 text-sm">{m.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                                {hasPartial && m.id==='auto' && remainTimeMin !== null && remainTimeMin > 0 && (
                                    <p className="text-[10px] font-bold text-blue-600 mt-1">
                                        → Will start at {formatTime(nextFreeStr)}{remainSlots!==null?`, up to ${remainSlots} slot${remainSlots!==1?'s':''}` :''}
                                    </p>
                                )}
                                {hasPartial && m.id==='manual' && (
                                    <p className="text-[10px] font-bold text-emerald-600 mt-1">
                                        → Suggested start: {formatTime(nextFreeStr)}
                                    </p>
                                )}
                            </div>
                            <ChevronDown size={18} className="text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform"/>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── Auto Slot Generator Modal ────────────────────────────────────────────────
const AutoSlotGeneratorModal = ({ zone, date, onClose, onCreate, onCreateManual, hints, existingSlots = [] }) => {
    const remainSlotsCap  = hints?.remainSlots ?? null;
    const defaultDuration = parseInt(zone?.each_slot_time) || 30;
    const zoneStartMin_   = zone?.start_time ? toMinutes(normalizeTime(zone.start_time)) : 0;
    const zoneEndMin_     = zone?.end_time   ? toMinutes(normalizeTime(zone.end_time))   : 1440;
    const rawSmartStart   = hints?.nextFreeStr || (zone?.start_time ? normalizeTime(zone.start_time) : '09:00');
    const smartStart      = minutesToStr(Math.min(Math.max(toMinutes(rawSmartStart), zoneStartMin_), Math.max(zoneStartMin_, zoneEndMin_ - defaultDuration)));

    const [mode, setMode] = useState('auto');
    const [autoDuration, setAutoDuration] = useState(defaultDuration);

    const handleAutoDuration = (val) => {
        const d = Math.min(Math.max(1, parseInt(val) || 1), defaultDuration);
        setAutoDuration(d);
    };

    const buildAutoRows = (dur) => {
        const duration  = Math.max(1, parseInt(dur) || defaultDuration);
        const zoneStart = zoneStartMin_;
        const zoneEnd   = zoneEndMin_;
        const cap       = remainSlotsCap ?? Math.floor((zoneEnd - zoneStart) / duration);

        const occupied = existingSlots
            .map(s => { const st = toMinutes(normalizeTime(s.start_time)); return [st, st + (s.duration_minutes || defaultDuration)]; })
            .sort((a, b) => a[0] - b[0]);

        const gaps = [];
        let cursor = zoneStart;
        for (const [oS, oE] of occupied) {
            if (oS > cursor) gaps.push([cursor, oS]);
            cursor = Math.max(cursor, oE);
        }
        if (cursor < zoneEnd) gaps.push([cursor, zoneEnd]);

        const autoRows = [];
        for (const [gS, gE] of gaps) {
            let t = gS;
            while (t + duration <= gE && autoRows.length < cap) {
                autoRows.push({ id:autoRows.length, startTime:minutesToStr(t), endTime:minutesToStr(t+duration), slotDuration:duration, err:'' });
                t += duration;
            }
            if (autoRows.length >= cap) break;
        }
        return autoRows;
    };

    const autoRows    = useMemo(() => buildAutoRows(autoDuration), [autoDuration, existingSlots, zoneStartMin_, zoneEndMin_, remainSlotsCap]);
    const autoCount   = autoRows.length;

    const buildSmartRows = (dur) => {
        const duration  = Math.max(1, parseInt(dur) || defaultDuration);
        const zoneStart = zone?.start_time ? toMinutes(normalizeTime(zone.start_time)) : 0;
        const zoneEnd   = zone?.end_time   ? toMinutes(normalizeTime(zone.end_time))   : zoneStart + 480;
        const cap       = remainSlotsCap ?? Math.floor((zoneEnd - zoneStart) / duration);

        const occupied = existingSlots
            .map(s => { const st=toMinutes(normalizeTime(s.start_time)); return [st, st+(s.duration_minutes||defaultDuration)]; })
            .sort((a,b)=>a[0]-b[0]);

        const gaps = [];
        let cursor = zoneStart;
        for (const [oStart, oEnd] of occupied) {
            if (oStart > cursor) gaps.push([cursor, oStart]);
            cursor = Math.max(cursor, oEnd);
        }
        if (cursor < zoneEnd) gaps.push([cursor, zoneEnd]);

        const freeRows = [];
        for (const [gStart, gEnd] of gaps) {
            let t = gStart;
            while (t + duration <= gEnd && freeRows.length < cap) {
                freeRows.push({ id:freeRows.length, startTime:minutesToStr(t), endTime:minutesToStr(t+duration), slotDuration:duration, err:'', suggested:true });
                t += duration;
            }
            if (freeRows.length >= cap) break;
        }

        if (freeRows.length === 0) {
            freeRows.push({ id:0, startTime:minutesToStr(zoneStart), endTime:minutesToStr(zoneStart+duration), slotDuration:duration, err:'', suggested:false });
        }
        return freeRows;
    };

    const [customDuration, setCustomDuration] = useState(defaultDuration);
    const [rows, setRows] = useState(() => buildSmartRows(defaultDuration));

    const handleCustomDurationChange = (val) => {
        const d = Math.min(Math.max(1, parseInt(val) || 1), defaultDuration);
        setCustomDuration(d);
        setRows(buildSmartRows(d));
    };

    const checkConflict = (newStart, newEnd) => {
        const s = toMinutes(newStart), e = toMinutes(newEnd);
        return existingSlots.find(ex => {
            const es = toMinutes(normalizeTime(ex.start_time));
            const ee = toMinutes(normalizeTime(ex.end_time || minutesToStr(es + (ex.duration_minutes || defaultDuration))));
            return s < ee && e > es;
        }) || null;
    };

    const updateRow = (id, field, val) => {
        setRows(rs => rs.map(r => {
            if (r.id !== id) return r;
            let newStart = r.startTime;
            let newDur   = r.slotDuration !== undefined ? r.slotDuration : customDuration;

            if (field === 'startTime') newStart = val;
            if (field === 'slotDuration') newDur = Math.min(Math.max(1, parseInt(val)||1), customDuration);

            const newEnd = minutesToStr(toMinutes(newStart) + newDur);
            const zoneStart = zone?.start_time ? toMinutes(normalizeTime(zone.start_time)) : null;
            const zoneEnd   = zone?.end_time   ? toMinutes(normalizeTime(zone.end_time))   : null;
            let err = '';
            if (zoneStart !== null && toMinutes(newStart) < zoneStart)
                err = `Start before zone open (${formatTime(normalizeTime(zone.start_time))})`;
            else if (zoneEnd !== null && toMinutes(newEnd) > zoneEnd)
                err = `End exceeds zone close (${formatTime(normalizeTime(zone.end_time))})`;
            else {
                const conflict = checkConflict(newStart, newEnd);
                if (conflict) {
                    const cs = formatTime(normalizeTime(conflict.start_time));
                    const ce = formatTime(normalizeTime(conflict.end_time || minutesToStr(toMinutes(normalizeTime(conflict.start_time)) + (conflict.duration_minutes || defaultDuration))));
                    err = `Slot time already taken (${cs} – ${ce})`;
                }
            }
            return { ...r, startTime:newStart, endTime:newEnd, slotDuration:newDur, err };
        }));
    };

    const rowDuration = (r) => {
        if (r.slotDuration && r.slotDuration > 0) return r.slotDuration;
        const d = toMinutes(r.endTime) - toMinutes(r.startTime);
        return d > 0 ? d : 0;
    };

    const validateRows = () => {
        let hasErr = false;
        const validated = rows.map(r => {
            let err = r.err || '';
            if (!r.startTime) err = 'Start time required';
            else if (!r.endTime) err = 'End time required';
            else if (toMinutes(r.endTime) <= toMinutes(r.startTime)) err = 'End must be after start';
            else if (!err) {
                const conflict = checkConflict(r.startTime, r.endTime);
                if (conflict) {
                    const cs = formatTime(normalizeTime(conflict.start_time));
                    const ce = formatTime(normalizeTime(conflict.end_time || minutesToStr(toMinutes(normalizeTime(conflict.start_time)) + (conflict.duration_minutes || defaultDuration))));
                    err = `Slot time already taken (${cs} – ${ce})`;
                }
            }
            if (err) hasErr = true;
            return { ...r, err };
        });
        setRows(validated);
        return !hasErr;
    };

    const [err, setErr]     = useState('');
    const [busy, setBusy]   = useState(false);
    const [progress, setProgress] = useState(null);

    const hasSmartHints = hints && (hints.remainSlots !== null || hints.remainTimeMin !== null);

    const handleAuto = async () => {
        if (autoDuration < 1) { setErr('Duration must be ≥ 1 minute'); return; }
        if (autoCount < 1) { setErr('No free slots found in zone window'); return; }
        setErr(''); setBusy(true);
        const total = autoRows.length;
        let done = 0;
        const errors = [];
        for (const r of autoRows) {
            try {
                await onCreateManual({ date, start_time:toApiTime(r.startTime), duration_minutes:r.slotDuration });
                done++;
                setProgress({ done, total });
            } catch(e) { errors.push(`Slot ${done+1}: ${e?.data?.message||'failed'}`); }
        }
        setBusy(false); setProgress(null);
        if (errors.length) { setErr(errors.join(' · ')); } else { onClose(); }
    };

    const handleCustom = async () => {
        if (!validateRows()) { setErr('Fix errors in the slot rows above'); return; }
        setErr(''); setBusy(true);
        const total = rows.length;
        let done = 0;
        const errors = [];
        for (const r of rows) {
            try {
                await onCreateManual({ date, start_time:toApiTime(r.startTime), duration_minutes:rowDuration(r) });
                done++;
                setProgress({ done, total });
            } catch(e) { errors.push(`Slot ${done+1}: ${e?.data?.message||'failed'}`); }
        }
        setBusy(false); setProgress(null);
        if (errors.length) { setErr(errors.join(' · ')); } else { onClose(); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg modal-enter overflow-hidden flex flex-col max-h-[92vh]">

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Zap size={20} className="text-white"/></div>
                        <div><h2 className="text-white font-bold text-lg">⚡ Auto Generator</h2><p className="text-blue-100 text-sm">{zone?.zone_name} · {date}</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"><X size={16} className="text-white"/></button>
                </div>

                <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <button onClick={()=>{setMode('auto');setErr('');}}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all border-b-2 ${mode==='auto'?'border-blue-500 text-blue-700 bg-white':'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <Zap size={14} className={mode==='auto'?'text-blue-500':'text-gray-400'}/> Auto Fill
                        <span className="text-[10px] font-medium text-gray-400 normal-case">sequential</span>
                    </button>
                    <button onClick={()=>{setMode('custom');setErr('');}}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all border-b-2 ${mode==='custom'?'border-purple-500 text-purple-700 bg-white':'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        <Sliders size={14} className={mode==='custom'?'text-purple-500':'text-gray-400'}/> Custom Schedule
                        <span className="text-[10px] font-medium text-gray-400 normal-case">per slot</span>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1">
                    <div className="p-6 space-y-4">

                        {hasSmartHints && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Zap size={10}/> Smart Fill — Based on existing slots
                                </p>
                                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-700">
                                    {hints.remainSlots !== null && (
                                        <span className="flex items-center gap-1 bg-white border border-blue-200 rounded-lg px-2 py-1 font-semibold">
                                            <Target size={11} className="text-blue-500"/>
                                            {hints.remainSlots} slot{hints.remainSlots!==1?'s':''} remaining
                                        </span>
                                    )}
                                    {(mode === 'auto' ? autoRows : rows).length > 0 && (() => {
                                        const activeRows = mode === 'auto' ? autoRows : rows;
                                        return (
                                            <span className="flex items-center gap-1 bg-white border border-emerald-200 rounded-lg px-2 py-1 font-semibold">
                                                <Check size={11} className="text-emerald-500"/>
                                                {formatTime(activeRows[0].startTime)} – {formatTime(activeRows[activeRows.length-1].endTime)}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}

                        {mode === 'auto' && (
                            <div className="space-y-3">
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1.5">Slot Duration (minutes)</label>
                                            <input type="number" min={1} max={defaultDuration} value={autoDuration}
                                                onChange={e => handleAutoDuration(e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-400 outline-none bg-white"/>
                                            <p className="text-[10px] text-blue-500 font-semibold mt-1">Max: {defaultDuration} min (zone slot duration)</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[10px] font-bold text-blue-500 uppercase">Free slots found</p>
                                            <p className="text-2xl font-bold text-blue-700">{autoCount}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[28px_1fr_1fr_48px] gap-2 px-1">
                                    <div/><p className="text-[10px] font-bold text-gray-400 uppercase">Start</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">End <span className="normal-case font-normal">(auto)</span></p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Min</p>
                                </div>

                                {autoRows.map((r, idx) => (
                                    <div key={r.id} className="rounded-xl border-2 border-blue-200 bg-blue-50 overflow-hidden">
                                        <div className="grid grid-cols-[28px_1fr_1fr_48px] gap-2 items-center px-3 py-2">
                                            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
                                                <span className="text-[10px] font-bold text-white">{idx+1}</span>
                                            </div>
                                            <div className="w-full px-2 py-1.5 border border-blue-200 rounded-lg text-xs font-semibold bg-white text-blue-900">{formatTime(r.startTime)}</div>
                                            <div className="w-full px-2 py-1.5 border border-gray-100 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500 flex items-center gap-1">
                                                <span className="text-[9px] text-gray-300">→</span><span>{formatTime(r.endTime)}</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-[11px] font-bold px-1 py-1 rounded-md block bg-emerald-100 text-emerald-700">{r.slotDuration}m</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {autoCount === 0 && (
                                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                        <AlertTriangle size={14} className="text-amber-500"/>
                                        <p className="text-xs font-semibold text-amber-700">No free windows found in zone window</p>
                                    </div>
                                )}

                                {/* Timeline */}
                                {(() => {
                                    const zS = zoneStartMin_, zE = zoneEndMin_, total = zE - zS;
                                    if (total <= 0) return null;
                                    const occupied = existingSlots.map(s=>{const st=toMinutes(normalizeTime(s.start_time));return[st,st+(s.duration_minutes||30)];}).sort((a,b)=>a[0]-b[0]);
                                    const suggested = autoRows.map(r=>[toMinutes(r.startTime),toMinutes(r.endTime)]);
                                    const allEvents=[...occupied.map(([s,e])=>({type:'occupied',s,e})),...suggested.map(([s,e])=>({type:'new',s,e}))].sort((a,b)=>a.s-b.s);
                                    const segments=[]; let cur=zS;
                                    for(const ev of allEvents){if(ev.s>cur)segments.push({type:'free',s:cur,e:ev.s});segments.push({type:ev.type,s:ev.s,e:ev.e});cur=Math.max(cur,ev.e);}
                                    if(cur<zE)segments.push({type:'free',s:cur,e:zE});
                                    return(
                                        <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Activity size={10} className="text-blue-500"/> Zone Timeline</p>
                                                <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400">
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-300 inline-block"/>Taken</span>
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400 inline-block"/>New</span>
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-100 border border-gray-200 inline-block"/>Free</span>
                                                </div>
                                            </div>
                                            <div className="flex h-5 w-full rounded-lg overflow-hidden border border-gray-100">
                                                {segments.map((seg,i)=>{const pct=((seg.e-seg.s)/total*100).toFixed(2);const bg=seg.type==='occupied'?'bg-gray-300':seg.type==='new'?'bg-blue-400':'bg-gray-50';return<div key={i} style={{width:`${pct}%`}} className={`${bg} h-full`} title={`${minutesToStr(seg.s)}–${minutesToStr(seg.e)}`}/>;})}
                                            </div>
                                            <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                                                <span>{formatTime(minutesToStr(zS))}</span><span>{formatTime(minutesToStr(Math.round((zS+zE)/2)))}</span><span>{formatTime(minutesToStr(zE))}</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-blue-700">Ready to create</p>
                                        <p className="text-[10px] text-blue-500 mt-0.5">{existingSlots.length>0?`${existingSlots.length} existing slot${existingSlots.length!==1?'s':''} skipped`:'Full zone scanned'}</p>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">{autoCount} <span className="text-sm font-semibold text-blue-500">slot{autoCount!==1?'s':''}</span></p>
                                </div>

                                {progress && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-bold text-blue-700">Creating slots…</p>
                                            <p className="text-xs font-bold text-blue-600">{progress.done}/{progress.total}</p>
                                        </div>
                                        <div className="w-full bg-blue-200 rounded-full h-1.5">
                                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{width:`${(progress.done/progress.total)*100}%`}}/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'custom' && (
                            <div className="space-y-3">
                                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1.5">Slot Duration (minutes)</label>
                                            <input type="number" min={1} max={defaultDuration} value={customDuration}
                                                onChange={e => handleCustomDurationChange(e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg text-sm font-bold text-purple-900 focus:ring-2 focus:ring-purple-400 outline-none bg-white" placeholder="e.g. 30"/>
                                            <p className="text-[10px] text-purple-500 font-semibold mt-1">Max: {defaultDuration} min (zone slot duration)</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[10px] font-bold text-purple-500 uppercase">Free slots found</p>
                                            <p className="text-2xl font-bold text-purple-700">{rows.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[28px_1fr_1fr_48px_28px] gap-2 px-1">
                                    <div/><p className="text-[10px] font-bold text-gray-400 uppercase">Start</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">End <span className="normal-case font-normal">(auto)</span></p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Min</p><div/>
                                </div>

                                {rows.map((r, idx) => (
                                    <div key={r.id} className={`rounded-xl border-2 overflow-hidden transition-all ${r.err?r.err.includes('already taken')?'border-orange-300 bg-orange-50':'border-red-300 bg-red-50':r.suggested?'border-purple-300 bg-purple-50':'border-gray-200 bg-white hover:border-purple-300'}`}>
                                        <div className="grid grid-cols-[28px_1fr_1fr_48px_28px] gap-2 items-center px-3 py-2">
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${r.suggested?'bg-purple-500':'bg-gray-300'}`}>
                                                <span className="text-[10px] font-bold text-white">{idx+1}</span>
                                            </div>
                                            <input type="time" value={r.startTime}
                                                onChange={e => updateRow(r.id,'startTime',e.target.value)}
                                                className="w-full px-2 py-1.5 border border-purple-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-purple-400 outline-none bg-white text-purple-900"/>
                                            <div className="w-full px-2 py-1.5 border border-gray-100 rounded-lg text-xs font-semibold bg-gray-50 text-gray-500 flex items-center gap-1">
                                                <span className="text-[9px] text-gray-300">→</span><span>{r.endTime ? formatTime(r.endTime) : '—'}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5">
                                                <button type="button" disabled={rowDuration(r)>=customDuration}
                                                    onClick={()=>updateRow(r.id,'slotDuration',rowDuration(r)+1)}
                                                    className={`w-5 h-4 flex items-center justify-center rounded text-[10px] font-bold leading-none transition-colors ${rowDuration(r)>=customDuration?'text-gray-200 cursor-not-allowed':'text-purple-500 hover:bg-purple-100'}`}>▲</button>
                                                <span className={`text-[11px] font-bold px-1 rounded ${r.err?'text-red-600':rowDuration(r)>0?'text-emerald-700':'text-red-500'}`}>{rowDuration(r)>0?rowDuration(r)+'m':'!'}</span>
                                                <button type="button" disabled={rowDuration(r)<=1}
                                                    onClick={()=>updateRow(r.id,'slotDuration',rowDuration(r)-1)}
                                                    className={`w-5 h-4 flex items-center justify-center rounded text-[10px] font-bold leading-none transition-colors ${rowDuration(r)<=1?'text-gray-200 cursor-not-allowed':'text-purple-500 hover:bg-purple-100'}`}>▼</button>
                                            </div>
                                            <button type="button"
                                                onClick={()=>setRows(rs=>rs.filter(x=>x.id!==r.id).map((x,i)=>({...x,id:i})))}
                                                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0">
                                                <X size={11}/>
                                            </button>
                                        </div>
                                        {r.err && (
                                            <div className={`px-3 pb-2 flex items-center gap-1.5 ${r.err.includes('already taken')?'bg-orange-50':''}`}>
                                                <AlertTriangle size={11} className={`flex-shrink-0 ${r.err.includes('already taken')?'text-orange-500':'text-red-500'}`}/>
                                                <p className={`text-[10px] font-semibold ${r.err.includes('already taken')?'text-orange-600':'text-red-600'}`}>{r.err}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button type="button"
                                    onClick={()=>setRows(rs=>{
                                        const prevEnd=rs.length>0?rs[rs.length-1].endTime:smartStart;
                                        return[...rs,{id:rs.length,startTime:prevEnd,endTime:minutesToStr(toMinutes(prevEnd)+customDuration),slotDuration:customDuration,err:'',suggested:false}];
                                    })}
                                    className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-purple-300 rounded-xl text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors">
                                    <Plus size={13}/> Add Another Slot
                                </button>

                                {/* Timeline */}
                                {(() => {
                                    const zS=zone?.start_time?toMinutes(normalizeTime(zone.start_time)):0;
                                    const zE=zone?.end_time?toMinutes(normalizeTime(zone.end_time)):zS+480;
                                    const total=zE-zS; if(total<=0)return null;
                                    const occupied=existingSlots.map(s=>{const st=toMinutes(normalizeTime(s.start_time));return[st,st+(s.duration_minutes||30)];}).sort((a,b)=>a[0]-b[0]);
                                    const suggested=rows.map(r=>[toMinutes(r.startTime),toMinutes(r.endTime)]);
                                    const segments=[];let cur=zS;
                                    const allEvents=[...occupied.map(([s,e])=>({type:'occupied',s,e})),...suggested.map(([s,e])=>({type:'new',s,e}))].sort((a,b)=>a.s-b.s);
                                    for(const ev of allEvents){if(ev.s>cur)segments.push({type:'free',s:cur,e:ev.s});segments.push({type:ev.type,s:ev.s,e:ev.e});cur=Math.max(cur,ev.e);}
                                    if(cur<zE)segments.push({type:'free',s:cur,e:zE});
                                    return(
                                        <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Activity size={10} className="text-purple-500"/> Zone Timeline</p>
                                                <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400">
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-300 inline-block"/>Taken</span>
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-purple-400 inline-block"/>New</span>
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-100 border border-gray-200 inline-block"/>Free</span>
                                                </div>
                                            </div>
                                            <div className="flex h-5 w-full rounded-lg overflow-hidden border border-gray-100">
                                                {segments.map((seg,i)=>{const pct=((seg.e-seg.s)/total*100).toFixed(2);const bg=seg.type==='occupied'?'bg-gray-300':seg.type==='new'?'bg-purple-400':'bg-gray-50';return<div key={i} style={{width:`${pct}%`}} className={`${bg} h-full`} title={`${minutesToStr(seg.s)}–${minutesToStr(seg.e)}`}/>;})}
                                            </div>
                                            <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                                                <span>{formatTime(minutesToStr(zS))}</span><span>{formatTime(minutesToStr(Math.round((zS+zE)/2)))}</span><span>{formatTime(minutesToStr(zE))}</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-purple-700">Ready to create</p>
                                        <p className="text-[10px] text-purple-500 mt-0.5">{existingSlots.length>0?`${existingSlots.length} existing slot${existingSlots.length!==1?'s':''} skipped`:'Full zone scanned'}</p>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-700">{rows.length} <span className="text-sm font-semibold text-purple-500">slot{rows.length!==1?'s':''}</span></p>
                                </div>

                                {progress && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs font-bold text-blue-700">Creating slots…</p>
                                            <p className="text-xs font-bold text-blue-600">{progress.done}/{progress.total}</p>
                                        </div>
                                        <div className="w-full bg-blue-200 rounded-full h-1.5">
                                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{width:`${(progress.done/progress.total)*100}%`}}/>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {err && <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-lg px-3 py-2.5"><AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5"/><p className="text-xs text-red-700 font-medium">{err}</p></div>}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
                    <button onClick={onClose} disabled={busy} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm disabled:opacity-50">Cancel</button>
                    {mode === 'auto' ? (
                        <button onClick={handleAuto} disabled={busy||autoCount<1}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 shadow-lg flex items-center justify-center gap-2">
                            {busy?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Creating…</>:<><Check size={15}/>Create {autoCount > 0 ? autoCount+' ' : ''}Slot{autoCount!==1?'s':''}</>}
                        </button>
                    ) : (
                        <button onClick={handleCustom} disabled={busy}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 shadow-lg flex items-center justify-center gap-2">
                            {busy?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Creating…</>:<><Check size={15}/>Create {rows.length} Slot{rows.length!==1?'s':''}</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Manual Slot Modal ────────────────────────────────────────────────────────
const ManualSlotModal = ({ zone, date, onClose, onCreate, hints }) => {
    const defaultDuration = parseInt(zone?.each_slot_time) || 30;
    const smartStart = hints?.nextFreeStr || (zone?.start_time ? normalizeTime(zone.start_time) : '09:00');

    const [form, setForm] = useState({ startTime: smartStart, duration: zone?.each_slot_time || 30 });
    const [err, setErr]   = useState('');
    const [busy, setBusy] = useState(false);

    const endTime = minutesToStr(toMinutes(form.startTime) + parseInt(form.duration || 0));
    const hasSmartHints = hints && (hints.remainSlots !== null || hints.remainTimeMin !== null);

    const handle = async () => {
        if (!form.duration || parseInt(form.duration) < 1) { setErr('Duration must be ≥ 1 minute'); return; }
        setBusy(true);
        try { await onCreate({ date, start_time:toApiTime(form.startTime), duration_minutes:parseInt(form.duration) }); onClose(); }
        catch(e) { setErr(e?.data?.message || 'Failed to create'); }
        finally { setBusy(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md modal-enter overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Sliders size={20} className="text-white"/></div>
                        <div><h2 className="text-white font-bold text-lg">🎯 Manual Addition</h2><p className="text-emerald-100 text-sm">{zone?.zone_name} · {date}</p></div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center"><X size={16} className="text-white"/></button>
                </div>
                <div className="p-6 space-y-4">
                    {hasSmartHints && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Check size={10}/> Smart Suggestion
                            </p>
                            <div className="flex items-center gap-3 flex-wrap text-xs">
                                {hints.remainSlots !== null && (
                                    <span className="flex items-center gap-1 bg-white border border-emerald-200 rounded-lg px-2 py-1 font-semibold text-emerald-700">
                                        <Target size={11} className="text-emerald-500"/>{hints.remainSlots} slot{hints.remainSlots !== 1 ? 's' : ''} remaining
                                    </span>
                                )}
                                {hints.remainTimeMin !== null && hints.remainTimeMin > 0 && (
                                    <span className="flex items-center gap-1 bg-white border border-teal-200 rounded-lg px-2 py-1 font-semibold text-teal-700">
                                        <Clock size={11} className="text-teal-500"/>
                                        {hints.remainTimeMin >= 60 ? `${Math.floor(hints.remainTimeMin/60)}h ${hints.remainTimeMin%60>0?hints.remainTimeMin%60+'m':''}`.trim() : `${hints.remainTimeMin}m`} available
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Start Time *
                                {hasSmartHints && <span className="ml-1 text-emerald-500 normal-case font-normal">(suggested)</span>}
                            </label>
                            <input type="time" value={form.startTime}
                                onChange={e=>setForm(f=>({...f,startTime:e.target.value}))}
                                className="w-full px-3 py-2.5 border-2 border-emerald-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Duration (min) *</label>
                            <input type="number" min={1} max={defaultDuration} value={form.duration}
                                onChange={e=>setForm(f=>({...f,duration:e.target.value}))}
                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"/>
                        </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-emerald-800 mb-0.5">Preview</p>
                            <p className="text-sm font-bold text-emerald-900">{formatTime(form.startTime)} → {formatTime(endTime)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-emerald-700">{form.duration}<span className="text-xs font-medium ml-0.5">min</span></p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase">duration</p>
                        </div>
                    </div>
                    {err && <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-lg px-3 py-2.5"><AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5"/><p className="text-xs text-red-700 font-medium">{err}</p></div>}
                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm">Cancel</button>
                        <button onClick={handle} disabled={busy} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm disabled:opacity-50 shadow-lg">
                            {busy ? 'Creating…' : 'Create Slot'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, subLabel, color }) => {
    const c = { blue:'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700', green:'border-green-200 bg-gradient-to-br from-green-50 to-green-100 text-green-700', purple:'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700', teal:'border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700' };
    return(
        <div className={`rounded-xl p-4 sm:p-5 border-2 ${c[color]||c.teal} shadow-sm hover:shadow-md transition-shadow`}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold">{value}</p>
            {subLabel&&<p className="text-xs mt-1.5 opacity-60 font-medium leading-tight">{subLabel}</p>}
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
const SlotManagementPage = () => {
    const today = todayStr();

    const [selectedDate,      setSelectedDate]      = useState(today);
    const [selectedZone,      setSelectedZone]      = useState(null);
    const [showMethodChooser, setShowMethodChooser] = useState(false);
    const [activeMethod,      setActiveMethod]      = useState(null);
    const [slotHints,         setSlotHints]         = useState(null);
    const [showDeleteModal,   setShowDeleteModal]   = useState(false);
    const [slotToDelete,      setSlotToDelete]      = useState(null);
    const [deleteSuccess,     setDeleteSuccess]     = useState(false);
    const [editSlot,          setEditSlot]          = useState(null);
    const [showZoneSettings,  setShowZoneSettings]  = useState(false);
    const [showCreateZone,    setShowCreateZone]    = useState(false);
    const [createZoneHint,    setCreateZoneHint]    = useState(null);
    const [showViewZones,     setShowViewZones]     = useState(false);
    const [viewZonesTab,      setViewZonesTab]      = useState('active');

    const { data: zonesResp, isLoading: zonesLoading, refetch: refetchZones } = useGetAllServiceZonesQuery();
    const allZonesRaw = useMemo(() => zonesResp?.data||zonesResp||[], [zonesResp]);

    const { data: staffRaw=[] } = useGetAllStaffsQuery();
    const staffList = Array.isArray(staffRaw) ? staffRaw : (staffRaw?.data||[]);

    const { data: bookingsRaw=[] } = useGetAllBookingsQuery();
    const allBookings = Array.isArray(bookingsRaw) ? bookingsRaw : (bookingsRaw?.data??[]);

    const bookingBySlotId = useMemo(() => {
        const m={}; allBookings.forEach(b=>{ const id=b.slot_id??b.slot?.id; if(id!=null)m[String(id)]=b; }); return m;
    }, [allBookings]);

    const zonesWithStatus = useMemo(() => allZonesRaw.map(z=>({...z,_status:getZoneStatus(z)})), [allZonesRaw]);
    const usableZones     = useMemo(() => zonesWithStatus.filter(z=>z._status==='active'||z._status==='not_started'), [zonesWithStatus]);
    const expiredZones    = useMemo(() => zonesWithStatus.filter(z=>z._status==='expired'), [zonesWithStatus]);
    const hasAnyZones     = allZonesRaw.length > 0;
    const allExpired      = hasAnyZones && usableZones.length === 0;

    const latestExpired = useMemo(() => {
        if(!expiredZones.length)return null;
        return [...expiredZones].sort((a,b)=>new Date(b.expiry_date||'1970-01-01')-new Date(a.expiry_date||'1970-01-01'))[0];
    }, [expiredZones]);

    // Always clamp to today so the pre-filled date is never in the past
    const suggestedActivation = useMemo(() => {
        if(!latestExpired?.expiry_date) return today;
        const d = new Date(latestExpired.expiry_date+'T00:00:00');
        d.setDate(d.getDate()+1);
        const next = d.toISOString().split('T')[0];
        return next < today ? today : next;
    }, [latestExpired, today]);

    const inferredServiceId = useMemo(() => allZonesRaw[0]?.service_id||1, [allZonesRaw]);

    const { data:slots=[], isLoading:slotsLoading, isError:slotsError, refetch:refetchSlots } =
        useGetSlotsByServiceZoneQuery({ service_zone_id:selectedZone?.id, date:selectedDate }, { skip:!selectedZone||!selectedDate });

    const [createSlot]            = useCreateSlotMutation();
    const [deleteSlot]            = useDeleteSlotMutation();
    const [autoGenerateSlots]     = useAutoGenerateSlotsMutation();
    const [updateSlot]            = useUpdateSlotMutation();
    const [updateServiceZone]     = useUpdateServiceZoneMutation();
    const [createServiceZone]     = useCreateServiceZoneMutation();
    const [updateInactivePeriods] = useUpdateServiceZoneInactivePeriodsMutation();

    useEffect(() => {
        if(!selectedZone)return;
        const fresh = allZonesRaw.find(z=>z.id===selectedZone.id);
        if(fresh)setSelectedZone(fresh);
    }, [allZonesRaw]);

    const enrichedSlots = useMemo(() => slots.map(s => {
        const booking = bookingBySlotId[String(s.id)]??null;
        return {...s, is_booked:!!booking, booking};
    }), [slots, bookingBySlotId]);

    const zoneMaxSlots   = selectedZone?.no_of_slots??null;
    const createdSlots   = enrichedSlots.length;
    const bookedSlots    = enrichedSlots.filter(s=>s.is_booked).length;
    const availableSlots = Math.max(0, createdSlots-bookedSlots);
    const remaining      = zoneMaxSlots!==null ? zoneMaxSlots-createdSlots : null;
    const canCreate      = zoneMaxSlots===null || createdSlots<zoneMaxSlots;
    const utilRate       = zoneMaxSlots>0 ? Math.round((bookedSlots/zoneMaxSlots)*100) : (createdSlots>0?Math.round((bookedSlots/createdSlots)*100):0);

    const handleManualCreate     = async (d) => { await createSlot({service_zone_id:selectedZone.id,...d}).unwrap(); refetchSlots(); };
    const handleAutoGenerate     = async (d) => { await autoGenerateSlots({service_zone_id:selectedZone.id,...d}).unwrap(); refetchSlots(); };
    const handleEditSlot         = async (s,u) => { await updateSlot({id:s.id,...u}).unwrap(); refetchSlots(); };
    const handleSaveZoneSettings = async (u)   => { await updateServiceZone({id:selectedZone.id,data:u}).unwrap(); await refetchZones(); };

    const handleCreateZone = async (form) => {
        const result = await createServiceZone({
            ...form,
            service_id:      Number(form.service_id||inferredServiceId),
            no_of_slots:     form.no_of_slots    ? Number(form.no_of_slots)    : null,
            each_slot_time:  form.each_slot_time ? Number(form.each_slot_time) : null,
            staff_in_charge: Number(form.staff_in_charge),
        }).unwrap();
        const newId = result?.data?.id||result?.id;
        if(newId&&form.inactivePeriods?.length){
            await updateInactivePeriods({id:newId,inactive_periods:form.inactivePeriods}).unwrap().catch(()=>{});
        }
        const refetched = await refetchZones();
        if(newId){
            const zones=(refetched.data?.data||refetched.data||[]);
            const nz=zones.find(z=>z.id===newId);
            if(nz)setSelectedZone(nz);
        }
    };

    const handleDeleteSlot = async () => {
        try {
            await deleteSlot(slotToDelete.id).unwrap();
            setDeleteSuccess(true);
            setTimeout(()=>{ setShowDeleteModal(false); setSlotToDelete(null); setDeleteSuccess(false); refetchSlots(); },1500);
        } catch { alert('Failed to delete'); }
    };

    const openCreateZone = (hint=null) => { setCreateZoneHint(hint); setShowCreateZone(true); };

    return (
        <>
            <GlobalStyles/>
            <div className="p-4 sm:p-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Slot Management</h1>
                        <p className="text-gray-500 text-sm">Manage time slots and service zones</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
                        {/* View Zones split button */}
                        <div className="flex items-center gap-0 bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <button onClick={() => { setViewZonesTab('active'); setShowViewZones(true); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors border-r border-gray-200">
                                <CheckCircle2 size={15} className="text-emerald-500"/> Active Zones
                                {usableZones.length > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{usableZones.length}</span>}
                            </button>
                            <button onClick={() => { setViewZonesTab('expired'); setShowViewZones(true); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-orange-700 hover:bg-orange-50 transition-colors">
                                <CalendarOff size={15} className="text-orange-400"/> Expired
                                {expiredZones.length > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full">{expiredZones.length}</span>}
                            </button>
                        </div>
                        {/* Add Service Zone */}
                        <button onClick={() => openCreateZone()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all hover:shadow-xl">
                            <CalendarPlus size={17}/> Add Service Zone
                        </button>
                    </div>
                </div>

                {/* CASE 1: Zero zones */}
                {!zonesLoading && !hasAnyZones && (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <MapPin size={36} className="text-blue-500"/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Service Zones Yet</h2>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Create a service zone first to start managing time slots and bookings.</p>
                        <button onClick={()=>openCreateZone()}
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                            <CalendarPlus size={18}/> Create First Zone
                        </button>
                    </div>
                )}

                {/* CASE 2: All expired */}
                {!zonesLoading && allExpired && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 mb-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <CalendarOff size={26} className="text-white"/>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="text-lg font-bold text-gray-900">All Service Zones Have Expired</h3>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-orange-200 text-orange-800 rounded-full">{expiredZones.length} expired</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    {latestExpired ? <>Zone <strong>"{latestExpired.zone_name}"</strong> expired on <strong>{dateLabel(latestExpired.expiry_date)}</strong>.</> : 'Your zones no longer cover the current date.'}
                                </p>
                                <p className="text-xs text-orange-700 font-medium flex items-center gap-1">
                                    <Info size={12}/> Create a new zone starting from <strong className="ml-0.5">{dateLabel(suggestedActivation)}</strong> to continue.
                                </p>
                            </div>
                            <button onClick={()=>openCreateZone(suggestedActivation)}
                                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all flex-shrink-0">
                                <CalendarPlus size={16}/> Create New Zone <ArrowRight size={15}/>
                            </button>
                        </div>
                        <div className="mt-4 pt-4 border-t border-orange-200">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expired Zones</p>
                            <div className="flex flex-wrap gap-2">
                                {expiredZones.map(z=>(
                                    <div key={z.id} className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-orange-200 rounded-lg">
                                        <MapPin size={11} className="text-orange-400"/>
                                        <span className="text-xs font-semibold text-gray-700">{z.zone_name}</span>
                                        <span className="text-[10px] text-orange-500 font-medium">· expired {dateLabel(z.expiry_date)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Zone Selector */}
                {usableZones.length > 0 && (
                    <div className="bg-white rounded-xl p-5 border border-gray-200 mb-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                            <h3 className="font-semibold text-gray-900">Select Service Zone</h3>
                            <div className="flex items-center gap-2 flex-wrap">
                                {selectedZone && (
                                    <>
                                        <button onClick={()=>setShowZoneSettings(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border-2 border-indigo-200 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors">
                                            <Settings2 size={15}/> Zone Settings
                                        </button>
                                        <button onClick={()=>{ if(canCreate)setShowMethodChooser(true); }} disabled={!canCreate}
                                            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium shadow ${canCreate?'bg-blue-500 hover:bg-blue-600':'bg-gray-300 opacity-60'}`}>
                                            <Plus size={16}/> Add Slot
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {usableZones.map(zone => {
                                const isActive   = selectedZone?.id === zone.id;
                                const notStarted = zone._status === 'not_started';
                                return (
                                    <button key={zone.id} onClick={()=>setSelectedZone(zone)}
                                        className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all
                                            ${isActive?'border-blue-500 bg-blue-50 shadow-md':notStarted?'border-cyan-200 bg-cyan-50 hover:border-cyan-400':'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive?'bg-blue-500':notStarted?'bg-cyan-400':'bg-gray-200'}`}>
                                            <MapPin size={18} className={isActive||notStarted?'text-white':'text-gray-600'}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <p className={`font-semibold truncate text-sm ${isActive?'text-blue-700':'text-gray-900'}`}>{zone.zone_name}</p>
                                                {notStarted&&<span className="text-[10px] font-bold px-1.5 py-0.5 bg-cyan-100 text-cyan-700 rounded-full">Upcoming</span>}
                                            </div>
                                            {zone.start_time&&zone.end_time&&<p className="text-xs text-gray-500 mt-0.5">{formatTime(normalizeTime(zone.start_time))}–{formatTime(normalizeTime(zone.end_time))}</p>}
                                            {zone.activation_start_date&&<p className="text-[11px] text-gray-400 mt-0.5">{dateLabel(zone.activation_start_date)}{zone.expiry_date?` → ${dateLabel(zone.expiry_date)}`:' → No expiry'}</p>}
                                            <ZoneSlotBadge zone={zone} date={selectedDate} bookingBySlotId={bookingBySlotId}/>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Selected zone detail */}
                {selectedZone && (
                    <>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-5 mb-6 shadow-lg">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={24} className="text-white"/></div>
                                    <div>
                                        <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-0.5">Active Zone</p>
                                        <h3 className="text-lg sm:text-xl font-bold text-white">{selectedZone.zone_name}</h3>
                                        <div className="flex items-center gap-2 flex-wrap mt-1">
                                            {selectedZone.start_time&&selectedZone.end_time&&<span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Clock size={10}/>{formatTime(normalizeTime(selectedZone.start_time))} – {formatTime(normalizeTime(selectedZone.end_time))}</span>}
                                            {selectedZone.each_slot_time&&<span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">{selectedZone.each_slot_time} min/slot</span>}
                                            {selectedZone.no_of_slots&&<span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">Max {selectedZone.no_of_slots} slots</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <button onClick={()=>setShowZoneSettings(true)} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                                        <Settings2 size={13}/> Edit Settings
                                    </button>
                                    <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2.5 border border-white/20">
                                        <Calendar size={18} className="text-white/70"/>
                                        <span className="text-white font-semibold text-sm">{new Date(selectedDate+'T00:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                            <div className="col-span-2 sm:col-span-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Select Date</label>
                                <CustomDatePicker value={selectedDate} onChange={setSelectedDate}/>
                            </div>
                            <StatCard label="Total Slots" value={zoneMaxSlots??'∞'} subLabel={zoneMaxSlots!==null?`${remaining} remaining`:'No limit'} color="teal"/>
                            <StatCard label="Created"     value={createdSlots}       subLabel={`of ${zoneMaxSlots??'∞'}`}                             color="blue"/>
                            <StatCard label="Available"   value={availableSlots}     subLabel="not booked"                                             color="green"/>
                            <StatCard label="Booked"      value={bookedSlots}        subLabel={`${utilRate}% util.`}                                   color="purple"/>
                        </div>

                        {/* Slots grid */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Slots for {selectedDate}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">{createdSlots} created · {bookedSlots} booked</p>
                                </div>
                                {canCreate&&<button onClick={()=>setShowMethodChooser(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600"><Plus size={14}/>Add</button>}
                            </div>

                            {slotsLoading ? (
                                <div className="text-center py-12"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"/><p className="text-gray-400 text-sm">Loading slots…</p></div>
                            ) : slotsError ? (
                                <div className="text-center py-12 bg-red-50 rounded-xl"><X size={24} className="text-red-500 mx-auto mb-2"/><p className="text-red-600 font-medium text-sm">Failed to load</p><button onClick={()=>refetchSlots()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm">Retry</button></div>
                            ) : enrichedSlots.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <Calendar size={48} className="mx-auto text-gray-300 mb-3"/>
                                    <p className="text-gray-600 font-medium mb-1">No slots for this date</p>
                                    {canCreate&&<button onClick={()=>setShowMethodChooser(true)} className="mt-4 px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium shadow">Add First Slot</button>}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {enrichedSlots.map(slot=>{
                                        const isBooked=slot.is_booked, dur=slot.duration_minutes||30;
                                        const customer=slot.booking?.customer?`${slot.booking.customer.first_name} ${slot.booking.customer.last_name}`.trim():null;
                                        return(
                                            <div key={slot.id} className={`slot-card rounded-xl border-2 overflow-hidden relative group ${isBooked?'border-blue-300 bg-blue-50':'border-teal-300 bg-teal-50'}`}>
                                                <div className="absolute top-2 right-2 z-10">{isBooked&&<div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><User size={10} className="text-white"/></div>}</div>
                                                <div className={`${isBooked?'bg-blue-600':'bg-teal-500'} text-white px-4 py-3`}>
                                                    <div className="flex items-center gap-2 mb-0.5"><Clock size={13}/><span className="text-sm font-bold">{formatTime(normalizeTime(slot.start_time))}</span><span className="text-xs opacity-80 ml-auto">{dur}m</span></div>
                                                    <p className="text-xs opacity-90">→ {formatTime(normalizeTime(slot.end_time))}</p>
                                                </div>
                                                <div className="px-4 py-3 space-y-2">
                                                    <span className={`text-xs font-bold ${isBooked?'text-blue-700':'text-teal-700'}`}>{isBooked?'Booked':'Available'}</span>
                                                    {isBooked&&customer&&<div className="bg-blue-100 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-1.5"><User size={11} className="text-blue-600"/><span className="text-xs font-bold text-blue-800 truncate">{customer}</span></div>}
                                                </div>
                                                {!isBooked&&(
                                                    <div className="border-t border-gray-200 px-4 py-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80">
                                                        <button onClick={()=>setEditSlot(slot)} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg border border-violet-200"><Edit3 size={11}/>Edit</button>
                                                        <button onClick={()=>{setSlotToDelete(slot);setShowDeleteModal(true);}} className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13}/></button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Modals */}
                {showMethodChooser     && <AddSlotMethodModal onClose={()=>setShowMethodChooser(false)} onChoose={(m,h)=>{setShowMethodChooser(false);setSlotHints(h);setActiveMethod(m);}} zone={selectedZone} existingSlots={enrichedSlots}/>}
                {activeMethod==='auto' && <AutoSlotGeneratorModal zone={selectedZone} date={selectedDate} onClose={()=>{setActiveMethod(null);setSlotHints(null);}} onCreate={handleAutoGenerate} onCreateManual={handleManualCreate} hints={slotHints} existingSlots={enrichedSlots}/>}
                {activeMethod==='manual'&&<ManualSlotModal zone={selectedZone} date={selectedDate} onClose={()=>{setActiveMethod(null);setSlotHints(null);}} onCreate={handleManualCreate} hints={slotHints}/>}
                {editSlot              && <EditSlotModal slot={editSlot} zone={selectedZone} existingSlots={enrichedSlots} onClose={()=>setEditSlot(null)} onSave={handleEditSlot}/>}
                {showZoneSettings&&selectedZone&&<EditZoneSettingsModal zone={selectedZone} onClose={()=>setShowZoneSettings(false)} onSave={handleSaveZoneSettings}/>}

                {showCreateZone && (
                    <CreateZoneModal
                        onClose={()=>setShowCreateZone(false)}
                        onCreate={handleCreateZone}
                        staffList={staffList}
                        suggestedActivation={createZoneHint}
                    />
                )}

                {showViewZones && (
                    <ViewZonesModal
                        onClose={()=>setShowViewZones(false)}
                        zonesWithStatus={zonesWithStatus}
                        initialTab={viewZonesTab}
                        onCreateZone={()=>{ setShowViewZones(false); openCreateZone(); }}
                    />
                )}

                {/* Delete Slot Modal */}
                {showDeleteModal&&(
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm modal-enter">
                            <div className="p-8 text-center">
                                {!deleteSuccess ? (
                                    <>
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={28} className="text-red-500"/></div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Delete Slot</h2>
                                        <p className="text-gray-600 font-semibold mb-6">{formatTime(normalizeTime(slotToDelete?.start_time))} ({slotToDelete?.duration_minutes}m)</p>
                                        <div className="flex gap-3">
                                            <button onClick={()=>setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-sm">Cancel</button>
                                            <button onClick={handleDeleteSlot} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium text-sm">Delete</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-green-600"/></div>
                                        <h3 className="text-xl font-bold text-gray-900">Deleted!</h3>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SlotManagementPage;