import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetServiceByIdQuery, useGetAllServiceZonesQuery, useCreateServiceZoneMutation,
    useUpdateServiceZoneMutation, useDeleteServiceZoneMutation, useGetAllStaffsQuery,
    useAssignStaffToZoneMutation, useGetStaffByServiceZoneQuery, useRemoveStaffFromZoneMutation,
    useToggleServiceZoneManualInactiveMutation, useUpdateServiceZoneInactivePeriodsMutation,
} from "../../../../app/service/slice";
import {
    ArrowLeft, Plus, MapPin, Trash2, X, Check, Clock, Users, Edit, ChevronDown, ChevronUp,
    UserPlus, UserMinus, Sparkles, Filter, AlertCircle, Pause, Play, Moon, Calendar,
    AlertTriangle, Info, Ban, CalendarOff,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const nowTime = () => new Date().toTimeString().slice(0, 5);
const parseDate = (d) => (d ? new Date(d + "T00:00:00") : null);
const dateLabel = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

// ─── Zone status (mirrors backend computeZoneStatus) ─────────────────────────
const getZoneStatus = (zone) => {
    const now = new Date(), todayStr = today(), todayDate = parseDate(todayStr), nowT = nowTime();
    if (zone.is_manually_inactive) {
        if (zone.manual_inactive_until && now > new Date(zone.manual_inactive_until)) return "active";
        return "manually_inactive";
    }
    for (const p of (zone.inactive_periods || [])) {
        if (!p.from_date) continue;
        const fromDate = parseDate(p.from_date), toDate = p.to_date ? parseDate(p.to_date) : null;
        const dateInRange = todayDate >= fromDate && (!toDate || todayDate <= toDate);
        if (!dateInRange) continue;
        if (p.from_time && p.to_time) {
            if (nowT >= p.from_time && nowT <= p.to_time) return "temporarily_inactive";
        } else return "temporarily_inactive";
    }
    const activationDate = zone.activation_start_date ? parseDate(zone.activation_start_date) : null;
    const expiryDate = zone.expiry_date ? parseDate(zone.expiry_date) : null;
    if (activationDate && todayDate < activationDate) return "not_started";
    if (expiryDate && todayDate > expiryDate) return "expired";
    return "active";
};

const STATUS_META = {
    active:               { label: "Active",               bg: "from-green-500 to-emerald-500", icon: null },
    not_started:          { label: "Not Started",          bg: "from-blue-500 to-cyan-500",     icon: null },
    expired:              { label: "Expired",              bg: "from-gray-400 to-gray-500",     icon: null },
    temporarily_inactive: { label: "Temp. Inactive",       bg: "from-amber-500 to-orange-500",  icon: Pause },
    manually_inactive:    { label: "Manually Deactivated", bg: "from-red-500 to-rose-500",      icon: Ban   },
};

const ZoneStatusBadge = ({ status }) => {
    const m = STATUS_META[status] || STATUS_META.active, Icon = m.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-gradient-to-r ${m.bg} text-white rounded-full shadow-sm`}>
            {Icon && <Icon size={10} />}{m.label}
        </span>
    );
};

// ─── DateTime helpers ─────────────────────────────────────────────────────────
const nowDatetimeStr   = () => { const d = new Date(); d.setMinutes(d.getMinutes() + 1); return d.toISOString().slice(0, 16); };
const datetimeFromNow  = (minutes) => new Date(Date.now() + minutes * 60 * 1000).toISOString().slice(0, 16);
const formatDatetime   = (dt) => dt ? new Date(dt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) : "";

// ─── Silent date clamp — snaps past activation dates to today without any alert ──
const clampActivationDate = (name, value) => {
    if (name === "activation_start_date" && value) {
        const todayStr = today();
        if (value < todayStr) return todayStr;   // silently snap to today
    }
    return value;
};

// ─── Inactive Period Manager ──────────────────────────────────────────────────
const BLANK_PERIOD = { id: null, from_date: "", to_date: "", from_time: "", to_time: "", reason: "" };

const InactivePeriodManager = ({ periods = [], onChange }) => {
    const [adding, setAdding] = useState(false), [form, setForm] = useState(BLANK_PERIOD);
    const [err, setErr] = useState(""), [editId, setEditId] = useState(null);

    const validate = () => {
        if (!form.from_date) return "Start date is required.";
        if (form.to_date && form.to_date < form.from_date) return "End date must be on or after start date.";
        if ((form.from_time && !form.to_time) || (!form.from_time && form.to_time)) return "Provide both start and end times, or leave both empty.";
        if (form.from_time && form.to_time && form.from_time >= form.to_time) return "End time must be after start time.";
        return null;
    };

    const handleSave = () => {
        const e = validate(); if (e) { setErr(e); return; }
        setErr(""); const entry = { ...form, id: editId ?? Date.now() };
        onChange(editId !== null ? periods.map(p => p.id === editId ? entry : p) : [...periods, entry]);
        setAdding(false); setForm(BLANK_PERIOD); setEditId(null);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Pause size={12} className="text-amber-500" /> Temporary Inactive Periods
                </p>
                {!adding && (
                    <button type="button" onClick={() => { setAdding(true); setForm(BLANK_PERIOD); setEditId(null); setErr(""); }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all">
                        <Plus size={12} /> Add Period
                    </button>
                )}
            </div>

            {adding && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-amber-800">{editId !== null ? "Edit" : "New"} Inactive Period</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">From Date *</label>
                            <input type="date" value={form.from_date}
                                onChange={e => { setForm(p => ({ ...p, from_date: e.target.value })); setErr(""); }}
                                className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">To Date <span className="font-normal text-gray-400">(optional)</span></label>
                            <input type="date" value={form.to_date} min={form.from_date || today()}
                                onChange={e => { setForm(p => ({ ...p, to_date: e.target.value })); setErr(""); }}
                                className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">From Time <span className="font-normal text-gray-400">(optional)</span></label>
                            <input type="time" value={form.from_time}
                                onChange={e => { setForm(p => ({ ...p, from_time: e.target.value })); setErr(""); }}
                                className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">To Time <span className="font-normal text-gray-400">(optional)</span></label>
                            <input type="time" value={form.to_time}
                                onChange={e => { setForm(p => ({ ...p, to_time: e.target.value })); setErr(""); }}
                                className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason</label>
                        <input type="text" value={form.reason} placeholder="e.g. Public holiday, Maintenance..."
                            onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white" />
                    </div>
                    {err && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                            <p className="text-xs font-semibold text-red-700">{err}</p>
                        </div>
                    )}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex items-start gap-2">
                        <Info size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-blue-700">Zone auto-reactivates once the period ends — no manual action needed.</p>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => { setAdding(false); setForm(BLANK_PERIOD); setEditId(null); setErr(""); }}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={handleSave}
                            className="flex-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm">
                            {editId !== null ? "Update" : "Add Period"}
                        </button>
                    </div>
                </div>
            )}

            {periods.length === 0 && !adding && <p className="text-xs text-gray-400 italic py-2">No inactive periods set.</p>}

            {periods.map(p => {
                const now = parseDate(today()), from = parseDate(p.from_date), to = p.to_date ? parseDate(p.to_date) : null;
                const pStatus = now < from ? "upcoming" : (to && now > to) ? "ended" : "active";
                const colors  = { active: "border-amber-300 bg-amber-50", upcoming: "border-blue-200 bg-blue-50", ended: "border-gray-200 bg-gray-50" };
                const badges  = { active: "bg-amber-500 text-white",      upcoming: "bg-blue-500 text-white",     ended: "bg-gray-400 text-white"   };
                return (
                    <div key={p.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 ${colors[pStatus]}`}>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-bold text-gray-800">
                                    {dateLabel(p.from_date)}{p.to_date ? ` → ${dateLabel(p.to_date)}` : " (open-ended)"}
                                </span>
                                {p.from_time && p.to_time && (
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {p.from_time} – {p.to_time}</span>
                                )}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badges[pStatus]}`}>{pStatus.toUpperCase()}</span>
                            </div>
                            {p.reason && <p className="text-xs text-gray-500 italic truncate">{p.reason}</p>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <button type="button" onClick={() => { setForm({ ...p }); setEditId(p.id); setAdding(true); setErr(""); }}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={13} /></button>
                            <button type="button" onClick={() => onChange(periods.filter(x => x.id !== p.id))}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Zone Form ────────────────────────────────────────────────────────────────
const emptyForm = {
    zone_name: "", zone_description: "", staff_in_charge: "",
    is_time_fixed: false, is_no_of_slots_fixed: false,
    each_slot_time: "", start_time: "", end_time: "", no_of_slots: "",
    activation_start_date: "", expiry_date: "", inactivePeriods: [],
};

const ZoneForm = ({ formData, onChange, onInactivePeriodsChange, staffList, onSubmit, onCancel, isLoading, submitLabel, duplicateError, showInactivePeriods = true }) => (
    <form onSubmit={onSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
        {duplicateError && (
            <div className="flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-red-800">Date Range Conflict</p>
                    <p className="text-xs text-red-600 mt-0.5">{duplicateError}</p>
                </div>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Zone Name *</label>
                <input name="zone_name" value={formData.zone_name} onChange={onChange} required placeholder="e.g. Morning Slot, VIP Zone"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Description</label>
                <textarea name="zone_description" value={formData.zone_description} onChange={onChange} placeholder="Optional description" rows={2}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Staff in Charge *</label>
                <select name="staff_in_charge" value={formData.staff_in_charge} onChange={onChange} required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all">
                    <option value="">Select Staff Member</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Start Time</label>
                <input type="time" name="start_time" value={formData.start_time} onChange={onChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">End Time</label>
                <input type="time" name="end_time" value={formData.end_time} onChange={onChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">No. of Slots</label>
                <input type="number" name="no_of_slots" value={formData.no_of_slots} onChange={onChange} placeholder="e.g. 10"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Slot Duration (mins)</label>
                <input type="number" name="each_slot_time" value={formData.each_slot_time} onChange={onChange} placeholder="e.g. 30"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Activation Date *</label>
                <input type="date" name="activation_start_date" value={formData.activation_start_date} onChange={onChange} required
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${duplicateError ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Expiry Date</label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={onChange}
                    min={formData.activation_start_date || undefined}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${duplicateError ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100">
                <label className="flex items-center gap-3 group cursor-pointer">
                    <input type="checkbox" name="is_time_fixed" checked={formData.is_time_fixed} onChange={onChange} className="w-5 h-5 text-blue-600 rounded-md" />
                    <span className="text-sm text-gray-700 font-semibold group-hover:text-blue-700 transition-colors">Fixed Time</span>
                </label>
                <label className="flex items-center gap-3 group cursor-pointer">
                    <input type="checkbox" name="is_no_of_slots_fixed" checked={formData.is_no_of_slots_fixed} onChange={onChange} className="w-5 h-5 text-purple-600 rounded-md" />
                    <span className="text-sm text-gray-700 font-semibold group-hover:text-purple-700 transition-colors">Fixed No. of Slots</span>
                </label>
            </div>
            {showInactivePeriods && (
                <div className="md:col-span-2 border-2 border-amber-100 rounded-2xl p-5 bg-gradient-to-br from-amber-50/60 to-orange-50/40">
                    <InactivePeriodManager periods={formData.inactivePeriods || []} onChange={onInactivePeriodsChange} />
                </div>
            )}
        </div>
        <div className="flex gap-4 pt-4 border-t-2 border-gray-100">
            <button type="button" onClick={onCancel}
                className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all">Cancel</button>
            <button type="submit" disabled={isLoading}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold text-sm disabled:opacity-50 shadow-lg transition-all">
                {isLoading ? "Saving..." : submitLabel}
            </button>
        </div>
    </form>
);

// ─── Zone Staff Panel ─────────────────────────────────────────────────────────
const ZoneStaffPanel = ({ zone, allStaff }) => {
    const [selectedStaffIds, setSelectedStaffIds] = useState([]), [showAssignPanel, setShowAssignPanel] = useState(false);
    const { data: assignedStaff = [], refetch } = useGetStaffByServiceZoneQuery(zone.id);
    const [assignStaff, { isLoading: isAssigning }] = useAssignStaffToZoneMutation();
    const [removeStaff] = useRemoveStaffFromZoneMutation();

    const assignedIds    = assignedStaff.map(r => r.staff_id);
    const availableStaff = allStaff.filter(s => !assignedIds.includes(s.id));

    const handleAssign = async () => {
        if (!selectedStaffIds.length) return;
        try {
            await assignStaff({ service_zone_id: zone.id, staff_ids: selectedStaffIds }).unwrap();
            setSelectedStaffIds([]); setShowAssignPanel(false); refetch();
        } catch (err) { alert(err?.data?.message || "Failed to assign staff"); }
    };

    return (
        <div className="border-t-2 border-gray-100 bg-gradient-to-br from-slate-50 to-blue-50 px-6 py-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"><Users size={16} className="text-white" /></div>
                    <span className="text-sm font-bold text-gray-700">Assigned Staff <span className="text-blue-600">({assignedStaff.length})</span></span>
                </div>
                <button onClick={() => setShowAssignPanel(v => !v)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg hover:scale-105">
                    <UserPlus size={15} /> Assign Staff
                </button>
            </div>

            {showAssignPanel && (
                <div className="mb-5 p-5 bg-white rounded-2xl border-2 border-blue-200 shadow-lg">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Select staff to assign</p>
                    {availableStaff.length === 0 ? (
                        <p className="text-sm text-gray-400 italic py-4">All staff already assigned.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 max-h-48 overflow-y-auto">
                                {availableStaff.map(s => {
                                    const selected = selectedStaffIds.includes(s.id);
                                    return (
                                        <button key={s.id} type="button"
                                            onClick={() => setSelectedStaffIds(p => p.includes(s.id) ? p.filter(x => x !== s.id) : [...p, s.id])}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm transition-all ${selected ? "border-blue-400 bg-blue-50 text-blue-700 shadow-md" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}>
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                                                {s.first_name?.[0]}{s.last_name?.[0]}
                                            </div>
                                            <span className="font-semibold truncate">{s.first_name} {s.last_name}</span>
                                            {selected && <Check size={16} className="ml-auto flex-shrink-0 text-blue-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => { setShowAssignPanel(false); setSelectedStaffIds([]); }}
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-semibold">Cancel</button>
                                <button onClick={handleAssign} disabled={isAssigning || !selectedStaffIds.length}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg">
                                    {isAssigning ? "Assigning..." : `Assign${selectedStaffIds.length ? ` (${selectedStaffIds.length})` : ""}`}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {assignedStaff.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-2">No staff assigned yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assignedStaff.map(record => {
                        const s = record.staff; if (!s) return null;
                        return (
                            <div key={record.id} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                    {s.first_name?.[0]}{s.last_name?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{s.first_name} {s.last_name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{s.role}</p>
                                </div>
                                <button onClick={async () => { try { await removeStaff(record.id).unwrap(); refetch(); } catch { alert("Failed to remove staff"); } }}
                                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><UserMinus size={16} /></button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ServiceZonesPage = () => {
    const { id: serviceId } = useParams(), navigate = useNavigate();
    const [showAllZones, setShowAllZones] = useState(false);

    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service || serviceData?.data || serviceData;

    const { data: zonesResponse, isLoading, refetch } = useGetAllServiceZonesQuery(undefined, { refetchOnMountOrArgChange: true });
    const allZones = zonesResponse?.data || zonesResponse || [];

    const serviceZones = useMemo(() => {
        const filtered = allZones
            .filter(z => String(z.service_id) === String(serviceId))
            .map(z => ({ ...z, zone_status: getZoneStatus(z) }));
        return showAllZones ? filtered : filtered.filter(z => z.zone_status !== "expired");
    }, [allZones, serviceId, showAllZones]);

    const { data: staffListRaw = [] } = useGetAllStaffsQuery();
    const staffList = Array.isArray(staffListRaw) ? staffListRaw : staffListRaw?.data || [];

    const [createServiceZone, { isLoading: isCreating }] = useCreateServiceZoneMutation();
    const [updateServiceZone, { isLoading: isUpdating }] = useUpdateServiceZoneMutation();
    const [deleteServiceZone]                            = useDeleteServiceZoneMutation();
    const [toggleManualInactive, { isLoading: isToggling }] = useToggleServiceZoneManualInactiveMutation();
    const [updateInactivePeriods]                        = useUpdateServiceZoneInactivePeriodsMutation();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingZone,     setEditingZone]     = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedZone,    setSelectedZone]    = useState(null);
    const [deleteSuccess,   setDeleteSuccess]   = useState(false);
    const [expandedZone,    setExpandedZone]    = useState(null);
    const [createForm,      setCreateForm]      = useState(emptyForm);
    const [editForm,        setEditForm]        = useState(emptyForm);
    const [createDupError,  setCreateDupError]  = useState("");
    const [editDupError,    setEditDupError]    = useState("");
    const [deactivateModal, setDeactivateModal] = useState({ open: false, zone: null, reason: "", until: "", indefinite: false, error: "" });

    // ── onChange handlers ─────────────────────────────────────────────────────
    const handleCreateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCreateForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        if (["activation_start_date", "expiry_date"].includes(name)) setCreateDupError("");
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
        if (["activation_start_date", "expiry_date"].includes(name)) setEditDupError("");
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const result = await createServiceZone({
                ...createForm,
                service_id:     Number(serviceId),
                no_of_slots:    createForm.no_of_slots    ? Number(createForm.no_of_slots)    : null,
                each_slot_time: createForm.each_slot_time ? Number(createForm.each_slot_time) : null,
                staff_in_charge: Number(createForm.staff_in_charge),
            }).unwrap();
            const newId = result?.data?.id || result?.id;
            if (newId && createForm.inactivePeriods?.length) {
                await updateInactivePeriods({ id: newId, inactive_periods: createForm.inactivePeriods }).unwrap().catch(() => {});
            }
            setShowCreateModal(false); setCreateForm(emptyForm); setCreateDupError(""); refetch();
        } catch (err) {
            const msg = err?.data?.message || "";
            if (msg.toLowerCase().includes("exist") || msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("overlap")) {
                setCreateDupError(msg);
            } else {
                alert(msg || "Failed to create zone");
            }
        }
    };

    const openEdit = (zone) => {
        setEditDupError("");
        setEditForm({
            zone_name:             zone.zone_name             || "",
            zone_description:      zone.zone_description      || "",
            staff_in_charge:       zone.staff_in_charge       || "",
            is_time_fixed:         zone.is_time_fixed         || false,
            is_no_of_slots_fixed:  zone.is_no_of_slots_fixed  || false,
            each_slot_time:        zone.each_slot_time        || "",
            start_time:            zone.start_time            || "",
            end_time:              zone.end_time              || "",
            no_of_slots:           zone.no_of_slots           || "",
            activation_start_date: zone.activation_start_date?.split("T")[0] || "",
            expiry_date:           zone.expiry_date?.split("T")[0]           || "",
            inactivePeriods:       zone.inactive_periods      || [],
        });
        setEditingZone(zone);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateServiceZone({
                id: editingZone.id,
                data: {
                    ...editForm,
                    no_of_slots:     editForm.no_of_slots    ? Number(editForm.no_of_slots)    : null,
                    each_slot_time:  editForm.each_slot_time ? Number(editForm.each_slot_time) : null,
                    staff_in_charge: Number(editForm.staff_in_charge),
                },
            }).unwrap();
            await updateInactivePeriods({ id: editingZone.id, inactive_periods: editForm.inactivePeriods || [] }).unwrap().catch(() => {});
            setEditingZone(null); setEditDupError(""); refetch();
        } catch (err) {
            const msg = err?.data?.message || "";
            if (msg.toLowerCase().includes("exist") || msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("overlap")) {
                setEditDupError(msg);
            } else {
                alert(msg || "Failed to update zone");
            }
        }
    };

    const handleDeactivateSubmit = async () => {
        const { zone, reason, until, indefinite } = deactivateModal;
        if (!reason.trim())           { setDeactivateModal(p => ({ ...p, error: "Please provide a reason." })); return; }
        if (!indefinite && !until)    { setDeactivateModal(p => ({ ...p, error: "Choose a reactivation date or select 'No end date'." })); return; }
        try {
            const result = await toggleManualInactive({ id: zone.id, is_manually_inactive: true, reason: reason.trim(), until: indefinite ? undefined : until }).unwrap();
            setDeactivateModal({ open: false, zone: null, reason: "", until: "", indefinite: false, error: "" }); refetch();
            if (editingZone && editingZone.id === zone.id) {
                const updated = result?.data || {};
                setEditingZone(z => ({ ...z, is_manually_inactive: true, manual_inactive_until: updated.manual_inactive_until ?? (indefinite ? null : until), manual_inactive_reason: updated.manual_inactive_reason ?? reason.trim(), zone_status: "manually_inactive" }));
            }
        } catch (err) { setDeactivateModal(p => ({ ...p, error: err?.data?.message || "Failed to deactivate zone." })); }
    };

    const formatTime    = (t) => { if (!t) return null; const [h, m] = t.split(":"), hour = Number(h); return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`; };
    const getStaffName  = (id) => { const s = staffList.find(st => st.id === Number(id)); return s ? `${s.first_name} ${s.last_name}` : `Staff #${id}`; };

    const totalSlots  = serviceZones.reduce((s, z) => s + (z.no_of_slots || 0), 0);
    const activeCount = serviceZones.filter(z => z.zone_status === "active").length;
    const pauseCount  = serviceZones.filter(z => ["temporarily_inactive", "manually_inactive"].includes(z.zone_status)).length;

    return (
        <div>
            <div className="mb-8">
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 text-sm font-semibold transition-colors group cursor-pointer">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Services
                </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service Zones</h1>
                            <Sparkles className="text-yellow-500" size={28} />
                        </div>
                        {service?.name && (
                            <p className="text-gray-500 flex items-center gap-2 text-sm font-medium"><MapPin size={16} className="text-blue-500" /> {service.name}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowAllZones(v => !v)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all font-semibold text-sm">
                            <Filter size={18} /> {showAllZones ? "Hide Expired" : "Show All"}
                        </button>
                        <button onClick={() => { setShowCreateModal(true); setCreateDupError(""); }}
                            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg font-semibold">
                            <Plus size={20} /> Add Zone
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total",    value: serviceZones.length, color: "from-blue-500 to-blue-600",    bg: "from-blue-50 to-purple-50",   Icon: MapPin },
                    { label: "Active",   value: activeCount,         color: "from-green-500 to-emerald-600", bg: "from-green-50 to-emerald-50", Icon: Check  },
                    { label: "Inactive", value: pauseCount,          color: "from-red-500 to-rose-500",     bg: "from-red-50 to-rose-50",      Icon: Ban    },
                    { label: "Slots",    value: totalSlots,          color: "from-purple-500 to-pink-600",  bg: "from-purple-50 to-pink-50",   Icon: Clock  },
                ].map(({ label, value, color, bg, Icon }) => (
                    <div key={label} className={`bg-gradient-to-br ${bg} rounded-2xl p-5 border-2 border-gray-200 hover:shadow-lg transition-all`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</p>
                            <div className={`w-9 h-9 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md`}><Icon size={16} className="text-white" /></div>
                        </div>
                        <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Zone list */}
            {isLoading ? (
                <div className="text-center py-16 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-300">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
                    <p className="text-gray-600 font-semibold">Loading zones...</p>
                </div>
            ) : serviceZones.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5"><MapPin size={36} className="text-blue-500" /></div>
                    <p className="text-gray-700 font-bold text-lg mb-2">No zones found</p>
                    <p className="text-sm text-gray-500 mb-6">Create zones to manage time slots and staff.</p>
                    <button onClick={() => setShowCreateModal(true)}
                        className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-sm shadow-lg">Add First Zone</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {serviceZones.map(zone => {
                        const isExpanded      = expandedZone === zone.id;
                        const isManualInactive = zone.zone_status === "manually_inactive";
                        const cardBorder = isManualInactive
                            ? "border-red-200"
                            : zone.zone_status === "temporarily_inactive" ? "border-amber-200"
                            : zone.zone_status === "expired"              ? "border-gray-200 opacity-60"
                            : "border-gray-200 hover:border-blue-300";

                        return (
                            <div key={zone.id} className={`bg-white rounded-2xl border-2 ${cardBorder} overflow-hidden transition-all hover:shadow-lg`}>
                                {isManualInactive && (
                                    <div className="flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
                                        <CalendarOff size={14} className="text-red-400 flex-shrink-0" />
                                        <p className="text-xs font-semibold text-red-700 flex-1 min-w-0 truncate">
                                            <span className="font-bold">Reason:</span> {zone.manual_inactive_reason || "—"}
                                            {zone.manual_inactive_until  && <span className="ml-2 text-red-500">· Auto-reactivates {formatDatetime(zone.manual_inactive_until)}</span>}
                                            {!zone.manual_inactive_until && <span className="ml-2 text-red-400"> · No end date set</span>}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                                        isManualInactive                          ? "bg-gradient-to-br from-red-400 to-rose-500"
                                        : zone.zone_status === "temporarily_inactive" ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                        : zone.zone_status === "expired"              ? "bg-gray-100"
                                        : zone.zone_status === "not_started"          ? "bg-gradient-to-br from-blue-400 to-cyan-400"
                                        : "bg-gradient-to-br from-blue-500 to-purple-500"
                                    }`}>
                                        {isManualInactive                          ? <Ban   size={24} className="text-white" />
                                        : zone.zone_status === "temporarily_inactive" ? <Pause size={24} className="text-white" />
                                        : <MapPin size={24} className={zone.zone_status === "expired" ? "text-gray-400" : "text-white"} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-bold text-lg text-gray-900">{zone.zone_name}</h3>
                                            <ZoneStatusBadge status={zone.zone_status} />
                                            {zone.is_time_fixed        && <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100   text-blue-700   rounded-full border border-blue-200">Fixed Time</span>}
                                            {zone.is_no_of_slots_fixed && <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full border border-purple-200">Fixed Slots</span>}
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} />
                                                {dateLabel(zone.activation_start_date)}{zone.expiry_date ? ` → ${dateLabel(zone.expiry_date)}` : " → No expiry"}
                                            </span>
                                            {zone.no_of_slots   && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100 font-semibold">{zone.no_of_slots} slots</span>}
                                            {zone.each_slot_time && <span className="px-2 py-0.5 bg-blue-50   text-blue-700   rounded-full border border-blue-100   font-semibold">{zone.each_slot_time} min</span>}
                                        </div>
                                        {zone.zone_description && <p className="text-xs text-gray-400 mt-1">{zone.zone_description}</p>}
                                    </div>

                                    {zone.start_time && zone.end_time && (
                                        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100 flex-shrink-0">
                                            <Clock size={13} className="text-blue-500" />{formatTime(zone.start_time)} – {formatTime(zone.end_time)}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {zone.zone_status !== "expired" && zone.zone_status !== "not_started" && (
                                            isManualInactive ? (
                                                <button onClick={async () => { try { await toggleManualInactive({ id: zone.id, is_manually_inactive: false }).unwrap(); refetch(); } catch (err) { alert(err?.data?.message || "Failed to reactivate zone"); } }} disabled={isToggling}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 border-2 border-green-200 rounded-xl hover:bg-green-100 text-xs font-bold transition-all disabled:opacity-50">
                                                    <Play size={13} /> Reactivate
                                                </button>
                                            ) : (
                                                <button onClick={() => setDeactivateModal({ open: true, zone, reason: "", until: "", indefinite: false, error: "" })}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 border-2 border-red-200 rounded-xl hover:bg-red-100 text-xs font-bold transition-all">
                                                    <Ban size={13} /> Deactivate
                                                </button>
                                            )
                                        )}
                                        <button onClick={() => openEdit(zone)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all hover:scale-110"><Edit size={18} /></button>
                                        <button onClick={() => { setSelectedZone(zone); setDeleteSuccess(false); setShowDeleteModal(true); }} className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all hover:scale-110"><Trash2 size={18} /></button>
                                        <button onClick={() => setExpandedZone(isExpanded ? null : zone.id)} className="p-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all hover:scale-110">
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <>
                                        <div className="border-t-2 border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                            <div className="px-6 py-4"><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Staff in Charge</p><p className="text-sm font-semibold text-gray-800">{getStaffName(zone.staff_in_charge)}</p></div>
                                            <div className="px-6 py-4"><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Time Window</p><p className="text-sm font-semibold text-gray-800">{zone.start_time && zone.end_time ? `${formatTime(zone.start_time)} – ${formatTime(zone.end_time)}` : "Not set"}</p></div>
                                            <div className="px-6 py-4"><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Slots / Duration</p><p className="text-sm font-semibold text-gray-800">{zone.no_of_slots ? `${zone.no_of_slots} slots` : "—"}{zone.each_slot_time ? ` · ${zone.each_slot_time} min each` : ""}</p></div>
                                            <div className="px-6 py-4"><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Active Period</p><p className="text-sm font-semibold text-gray-800">{dateLabel(zone.activation_start_date) || "—"}{zone.expiry_date ? ` → ${dateLabel(zone.expiry_date)}` : " → No expiry"}</p></div>
                                        </div>

                                        {(zone.inactive_periods || []).length > 0 && (
                                            <div className="border-t-2 border-amber-100 px-6 py-5 bg-amber-50/30">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Moon size={15} className="text-amber-500" />
                                                    <p className="text-sm font-bold text-gray-700">Temporary Inactive Periods</p>
                                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{zone.inactive_periods.length}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {zone.inactive_periods.map(p => {
                                                        const now = parseDate(today()), from = parseDate(p.from_date), to = p.to_date ? parseDate(p.to_date) : null;
                                                        const isAct = now >= from && (!to || now <= to), isUp = now < from;
                                                        return (
                                                            <div key={p.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${isAct ? "bg-amber-50 border-amber-200" : isUp ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
                                                                <Pause size={12} className={`flex-shrink-0 mt-0.5 ${isAct ? "text-amber-500" : isUp ? "text-blue-400" : "text-gray-400"}`} />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-gray-800">
                                                                        {dateLabel(p.from_date)}{p.to_date ? ` → ${dateLabel(p.to_date)}` : " (open-ended)"}
                                                                        {p.from_time && p.to_time && <span className="font-normal text-gray-500"> · {p.from_time}–{p.to_time}</span>}
                                                                    </p>
                                                                    {p.reason && <p className="text-[11px] text-gray-500 italic">{p.reason}</p>}
                                                                </div>
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${isAct ? "bg-amber-500 text-white" : isUp ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                                                                    {isAct ? "NOW" : isUp ? "UPCOMING" : "ENDED"}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <ZoneStaffPanel zone={zone} allStaff={staffList} />
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── DEACTIVATE MODAL ── */}
            {deactivateModal.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-rose-500 px-7 py-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-bold text-lg">Deactivate Zone</h2>
                                <p className="text-red-100 text-sm mt-0.5 truncate max-w-[260px]">{deactivateModal.zone?.zone_name}</p>
                            </div>
                            <button onClick={() => setDeactivateModal({ open: false, zone: null, reason: "", until: "", indefinite: false, error: "" })}
                                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all cursor-pointer">
                                <X size={18} className="text-white" />
                            </button>
                        </div>
                        <div className="p-7 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Reason <span className="text-red-500">*</span></label>
                                <textarea value={deactivateModal.reason}
                                    onChange={e => setDeactivateModal(p => ({ ...p, reason: e.target.value, error: "" }))}
                                    placeholder="e.g. Staff on leave, equipment maintenance, public holiday..." rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Auto-Reactivate On <span className="text-red-500">*</span></label>
                                {!deactivateModal.indefinite && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {[
                                            { label: "30 min",       mins: 30   },
                                            { label: "1 hour",       mins: 60   },
                                            { label: "2 hours",      mins: 120  },
                                            { label: "4 hours",      mins: 240  },
                                            { label: "Tonight 10 PM", mins: null, fn: () => { const d = new Date(); d.setHours(22,0,0,0); return d.toISOString().slice(0,16); } },
                                            { label: "Tomorrow 8 AM", mins: null, fn: () => { const d = new Date(); d.setDate(d.getDate()+1); d.setHours(8,0,0,0); return d.toISOString().slice(0,16); } },
                                            { label: "1 day",        mins: 1440  },
                                            { label: "3 days",       mins: 4320  },
                                            { label: "1 week",       mins: 10080 },
                                        ].map(({ label, mins, fn }) => {
                                            const val = fn ? fn() : datetimeFromNow(mins);
                                            const isActive = deactivateModal.until === val;
                                            return (
                                                <button key={label} type="button"
                                                    onClick={() => setDeactivateModal(p => ({ ...p, until: val, indefinite: false, error: "" }))}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${isActive ? "bg-red-500 text-white border-red-500 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600"}`}>
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                <input type="datetime-local" value={deactivateModal.until} min={nowDatetimeStr()} disabled={deactivateModal.indefinite}
                                    onChange={e => setDeactivateModal(p => ({ ...p, until: e.target.value, indefinite: false, error: "" }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all disabled:opacity-40 disabled:bg-gray-50" />
                                <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Pick any date &amp; time — minutes, hours, or days from now</p>
                            </div>
                            <label onClick={() => setDeactivateModal(p => ({ ...p, indefinite: !p.indefinite, until: !p.indefinite ? "" : p.until, error: "" }))}
                                className="flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer select-none transition-all"
                                style={{ borderColor: deactivateModal.indefinite ? "#f43f5e" : "#e5e7eb", background: deactivateModal.indefinite ? "#fff1f2" : "#f9fafb" }}>
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${deactivateModal.indefinite ? "bg-red-500 border-red-500" : "border-gray-300"}`}>
                                    {deactivateModal.indefinite && <Check size={12} className="text-white" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">No end date (indefinite)</p>
                                    <p className="text-xs text-gray-500">Zone stays deactivated until you manually reactivate it</p>
                                </div>
                            </label>
                            {(deactivateModal.until || deactivateModal.indefinite) && deactivateModal.reason.trim() && (
                                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                                    <CalendarOff size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-red-700">
                                        <span className="font-bold">{deactivateModal.zone?.zone_name}</span> will be deactivated
                                        {deactivateModal.indefinite ? " indefinitely — reactivate it manually when ready" : ` until ${formatDatetime(deactivateModal.until)} — it will automatically become active after that`}.
                                    </p>
                                </div>
                            )}
                            {deactivateModal.error && (
                                <div className="flex items-center gap-2 text-sm text-red-600 font-semibold"><AlertCircle size={15} /> {deactivateModal.error}</div>
                            )}
                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setDeactivateModal({ open: false, zone: null, reason: "", until: "", indefinite: false, error: "" })}
                                    className="flex-1 py-3.5 border-2 border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">Cancel</button>
                                <button onClick={handleDeactivateSubmit} disabled={isToggling}
                                    className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl text-sm font-bold hover:from-red-600 hover:to-rose-600 disabled:opacity-50 shadow-lg transition-all cursor-pointer">
                                    {isToggling ? "Deactivating..." : "Confirm Deactivation"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CREATE MODAL ── */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between">
                            <div><h2 className="text-white font-bold text-xl">Create Service Zone</h2><p className="text-blue-100 text-sm mt-0.5">{service?.name}</p></div>
                            <button onClick={() => { setShowCreateModal(false); setCreateDupError(""); }}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all cursor-pointer"><X size={20} className="text-white" /></button>
                        </div>
                        <ZoneForm
                            formData={createForm}
                            onChange={handleCreateChange}
                            onInactivePeriodsChange={periods => setCreateForm(f => ({ ...f, inactivePeriods: periods }))}
                            staffList={staffList}
                            onSubmit={handleCreate}
                            onCancel={() => { setShowCreateModal(false); setCreateDupError(""); }}
                            isLoading={isCreating}
                            submitLabel="Create Zone"
                            duplicateError={createDupError}
                        />
                    </div>
                </div>
            )}

            {/* ── EDIT MODAL ── */}
            {editingZone && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex items-center justify-between">
                            <div><h2 className="text-white font-bold text-xl">Edit Zone</h2><p className="text-white/70 text-sm mt-0.5">{editingZone.zone_name}</p></div>
                            <button onClick={() => { setEditingZone(null); setEditDupError(""); }}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all cursor-pointer"><X size={20} className="text-white" /></button>
                        </div>
                        <ZoneForm
                            formData={editForm}
                            onChange={handleEditChange}
                            onInactivePeriodsChange={periods => setEditForm(f => ({ ...f, inactivePeriods: periods }))}
                            staffList={staffList}
                            onSubmit={handleUpdate}
                            onCancel={() => { setEditingZone(null); setEditDupError(""); }}
                            isLoading={isUpdating}
                            submitLabel="Save Changes"
                            duplicateError={editDupError}
                            showInactivePeriods={false}
                        />
                    </div>
                </div>
            )}

            {/* ── DELETE MODAL ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                        <div className="p-10 text-center">
                            {!deleteSuccess ? (
                                <>
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5"><Trash2 size={36} className="text-red-500" /></div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Zone</h2>
                                    <p className="text-gray-500 text-sm mb-1">Permanently delete</p>
                                    <p className="text-gray-900 font-bold text-lg mb-8">"{selectedZone?.zone_name}"</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setShowDeleteModal(false)}
                                            className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-sm cursor-pointer">Cancel</button>
                                        <button onClick={async () => {
                                            try {
                                                await deleteServiceZone(selectedZone.id).unwrap();
                                                setDeleteSuccess(true);
                                                setTimeout(() => { setShowDeleteModal(false); setSelectedZone(null); setDeleteSuccess(false); refetch(); }, 1500);
                                            } catch { alert("Failed to delete zone"); }
                                        }} className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg cursor-pointer">Delete</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce"><Check size={36} className="text-green-600" /></div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Deleted!</h3>
                                    <p className="text-gray-500 text-sm">Zone removed successfully.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceZonesPage;