// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     useGetServiceByIdQuery,
//     useDeleteServiceMutation,
// } from "../../../../app/service/slice";
// import {
//     ArrowLeft, Edit2, Trash2, Check, X,
//     FileText, Database, MapPin, DollarSign, Package,
// } from "lucide-react";

// const GlobalStyles = () => (
//     <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
//         * { font-family: 'DM Sans', sans-serif; }

//         @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
//         @keyframes shimmer  { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
//         @keyframes pulseRing { 0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,.35); } 50% { box-shadow:0 0 0 8px rgba(99,102,241,0); } }

//         .page-enter     { animation: fadeInUp .45s cubic-bezier(.22,1,.36,1) both; }
//         .page-enter.d1  { animation-delay:.07s; }
//         .page-enter.d2  { animation-delay:.14s; }
//         .page-enter.d3  { animation-delay:.21s; }
//         .fade-enter     { animation: fadeIn .3s ease both; }

//         .shimmer-bg {
//             background: linear-gradient(90deg,#f1f5f9 25%,#e8eef5 50%,#f1f5f9 75%);
//             background-size: 400px 100%; animation: shimmer 1.4s infinite linear;
//         }
//         .icon-btn {
//             display:inline-flex; align-items:center; justify-content:center;
//             border-radius:10px; padding:9px; cursor:pointer; border:none; outline:none;
//             transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
//         }
//         .icon-btn:hover  { transform: translateY(-2px) scale(1.1); }
//         .icon-btn:active { transform: scale(.93); }

//         .quick-link {
//             display:flex; align-items:center; gap:8px;
//             padding:10px 16px; border-radius:14px; font-size:13px; font-weight:700;
//             border:1.5px solid transparent; cursor:pointer;
//             transition: transform .15s ease, box-shadow .15s ease;
//         }
//         .quick-link:hover { transform: translateY(-2px); }

//         .primary-btn {
//             display:inline-flex; align-items:center; justify-content:center; gap:8px;
//             cursor:pointer; border:none; outline:none; position:relative; overflow:hidden;
//             transition: transform .18s ease, box-shadow .18s ease;
//             animation: pulseRing 2.8s infinite;
//         }
//         .primary-btn:hover  { transform:translateY(-2px); box-shadow:0 8px 28px rgba(79,70,229,.4); }
//         .primary-btn:active { transform:scale(.97); }

//         .modal-overlay { animation: fadeIn .2s ease both; }
//         .modal-card    { animation: fadeInUp .28s cubic-bezier(.22,1,.36,1) both; }

//         [data-tip] { position: relative; }
//         [data-tip]::after {
//             content: attr(data-tip); position: absolute; bottom: calc(100% + 7px); left: 50%;
//             transform: translateX(-50%) scale(.85); background: #1e293b; color: #fff;
//             font-size: 11px; font-weight: 600; white-space: nowrap; padding: 4px 9px;
//             border-radius: 7px; opacity: 0; pointer-events: none;
//             transition: opacity .15s ease, transform .15s ease; z-index: 99;
//         }
//         [data-tip]:hover::after { opacity: 1; transform: translateX(-50%) scale(1); }
//     `}</style>
// );

// const GetServiceById = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const { data, isLoading, isError } = useGetServiceByIdQuery(id);
//     const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteSuccess, setDeleteSuccess] = useState(false);

//     const quickLinks = [
//         { label: "Descriptions", path: `/dashboard/services/${id}/descriptions`, icon: <FileText size={14} />, bg: "#faf5ff", color: "#9333ea", border: "#e9d5ff", shadow: "rgba(168,85,247,.25)" },
//         { label: "Metadata", path: `/dashboard/services/${id}/metadata`, icon: <Database size={14} />, bg: "#fffbeb", color: "#d97706", border: "#fde68a", shadow: "rgba(245,158,11,.25)" },
//         { label: "Prices", path: `/dashboard/services/${id}/prices`, icon: <DollarSign size={14} />, bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", shadow: "rgba(34,197,94,.25)" },
//         { label: "Zones", path: `/dashboard/services/${id}/zones`, icon: <MapPin size={14} />, bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", shadow: "rgba(59,130,246,.25)" },
//     ];

//     const handleDelete = async () => {
//         try {
//             await deleteService(id).unwrap();
//             setDeleteSuccess(true);
//             setTimeout(() => navigate(-1), 1800);
//         } catch (err) {
//             alert(err?.data?.message || "Failed to delete service");
//         }
//     };

//     /* ── Loading ── */
//     if (isLoading) return (
//         <>
//             <GlobalStyles />
//             <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
//                 <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
//                     <div className="shimmer-bg h-4 w-20 rounded-lg" />
//                     <div className="shimmer-bg h-40 w-full rounded-2xl" />
//                     <div className="bg-white rounded-2xl p-8 border border-slate-100 space-y-4" style={{ boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
//                         {[...Array(2)].map((_, i) => <div key={i} className="space-y-2"><div className="shimmer-bg h-3 w-24 rounded" /><div className="shimmer-bg h-5 w-3/4 rounded-lg" /></div>)}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );

//     /* ── Error ── */
//     if (isError || !data) return (
//         <>
//             <GlobalStyles />
//             <div className="min-h-screen flex items-center justify-center px-4 fade-enter"
//                 style={{ background: "linear-gradient(135deg,#f0f4ff,#f8fafc)" }}>
//                 <div className="text-center">
//                     <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
//                         style={{ background: "linear-gradient(135deg,#fee2e2,#fecaca)" }}>
//                         <X size={22} style={{ color: "#dc2626" }} />
//                     </div>
//                     <p className="text-slate-700 font-bold mb-1">Service not found</p>
//                     <p className="text-sm text-slate-400 mb-5">It may have been deleted or the link is invalid.</p>
//                     <button onClick={() => navigate(-1)}
//                         className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         </>
//     );

//     const service = data.service || data.data || data;

//     return (
//         <>
//             <GlobalStyles />
//             <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>

//                 {/* Back */}
//                 <button onClick={() => navigate(-1)}
//                     className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 text-sm font-medium cursor-pointer transition-colors group page-enter">
//                     <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
//                     Back to Services
//                 </button>

//                 <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

//                     {/* Header Gradient Card */}
//                     <div className="page-enter rounded-2xl p-6 sm:p-8 mb-5"
//                         style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1 55%,#818cf8)", boxShadow: "0 12px 40px rgba(79,70,229,.28)" }}>
//                         <div className="flex items-start justify-between gap-4">
//                             <div className="flex items-center gap-4">
//                                 <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center"
//                                     style={{ background: "rgba(255,255,255,.18)", backdropFilter: "blur(8px)" }}>
//                                     <Package size={24} style={{ color: "#fff" }} />
//                                 </div>
//                                 <div>
//                                     <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Service Details</p>
//                                     <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">{service.name || "—"}</h1>
//                                     <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-bold ${service.pre_payment_required ? "bg-orange-400/30 text-orange-100" : "bg-green-400/25 text-green-100"
//                                         }`}>
//                                         <span className={`w-1.5 h-1.5 rounded-full ${service.pre_payment_required ? "bg-orange-300" : "bg-green-300"}`} />
//                                         {service.pre_payment_required ? "Pre-payment Required" : "No Advance Required"}
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="flex gap-2 flex-shrink-0">
//                                 <button data-tip="Edit"
//                                     onClick={() => navigate(`/dashboard/services/update/${id}`)}
//                                     className="icon-btn"
//                                     style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
//                                     <Edit2 size={16} />
//                                 </button>
//                                 <button data-tip="Delete"
//                                     onClick={() => { setDeleteSuccess(false); setShowDeleteModal(true); }}
//                                     className="icon-btn"
//                                     style={{ background: "rgba(239,68,68,.25)", color: "#fca5a5" }}>
//                                     <Trash2 size={16} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div className="page-enter d1 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 mb-5"
//                         style={{ boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
//                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Description</p>
//                         <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
//                             {service.description || <em className="text-slate-300">No description provided.</em>}
//                         </p>
//                     </div>

//                     {/* Manage Quick Links */}
//                     <div className="page-enter d2 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 mb-5"
//                         style={{ boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
//                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Manage</p>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                             {quickLinks.map(({ label, path, icon, bg, color, border, shadow }) => (
//                                 <button key={label} onClick={() => navigate(path)}
//                                     className="quick-link"
//                                     style={{ background: bg, color, borderColor: border }}
//                                     onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 18px ${shadow}`}
//                                     onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
//                                     {icon} {label}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                 </div>
//             </div>

//             {/* Delete Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay"
//                     style={{ background: "rgba(15,23,42,.5)", backdropFilter: "blur(4px)" }}>
//                     <div className="bg-white rounded-3xl p-7 w-full max-w-sm modal-card"
//                         style={{ boxShadow: "0 24px 64px rgba(0,0,0,.18)" }}>
//                         {!deleteSuccess ? (
//                             <>
//                                 <div className="flex justify-between items-start mb-5">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#fef2f2" }}>
//                                             <Trash2 size={18} style={{ color: "#dc2626" }} />
//                                         </div>
//                                         <div>
//                                             <h2 className="text-base font-bold text-slate-900">Delete Service</h2>
//                                             <p className="text-xs text-slate-400">This cannot be undone</p>
//                                         </div>
//                                     </div>
//                                     <button onClick={() => setShowDeleteModal(false)}
//                                         className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
//                                         <X size={17} className="text-slate-400" />
//                                     </button>
//                                 </div>
//                                 <div className="rounded-2xl p-4 mb-6" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
//                                     <p className="text-sm text-slate-600">
//                                         Are you sure you want to delete <span className="font-bold text-slate-900">{service.name}</span>?
//                                     </p>
//                                 </div>
//                                 <div className="flex gap-3">
//                                     <button onClick={() => setShowDeleteModal(false)}
//                                         className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
//                                         Cancel
//                                     </button>
//                                     <button onClick={handleDelete} disabled={isDeleting}
//                                         className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-60"
//                                         style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 16px rgba(239,68,68,.35)" }}>
//                                         {isDeleting ? "Deleting…" : "Delete"}
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="text-center py-6 fade-enter">
//                                 <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
//                                     style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)" }}>
//                                     <Check size={30} style={{ color: "#16a34a" }} />
//                                 </div>
//                                 <h3 className="text-base font-bold text-slate-900 mb-1">Deleted!</h3>
//                                 <p className="text-sm text-slate-400">Redirecting you back…</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default GetServiceById;











import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetServiceByIdQuery,
    useDeleteServiceMutation,
    useUpdateServiceMutation,
    useGetPricesByBusinessQuery,
    useCreateServicePriceMutation,
    useUpdateServicePriceMutation,
    useDeleteServicePriceMutation,
    useGetDescriptionsByServiceQuery,
    useCreateServiceDescriptionMutation,
    useUpdateServiceDescriptionMutation,
    useDeleteServiceDescriptionMutation,
    useGetAllServiceMetadataQuery,
    useCreateServiceMetadataMutation,
    useUpdateServiceMetadataMutation,
    useDeleteServiceMetadataMutation,
    useGetAllServiceZonesQuery,
    useGetAllStaffsQuery,
    useCreateServiceZoneMutation,
    useUpdateServiceZoneMutation,
    useDeleteServiceZoneMutation,
    useAssignStaffToZoneMutation,
    useGetStaffByServiceZoneQuery,
    useRemoveStaffFromZoneMutation,
    useToggleServiceZoneManualInactiveMutation,
    useUpdateServiceZoneInactivePeriodsMutation,
} from "../../../../app/service/slice";
import { jwtDecode } from "jwt-decode";
import {
    ArrowLeft, Edit2, Trash2, Check, X, Save, Loader2,
    FileText, Database, MapPin, DollarSign, Package,
    Plus, IndianRupee, Calculator, Eye, ChevronRight,
    MoreVertical, UserPlus, UserMinus, Users, Clock,
    Pencil, AlertTriangle, Info, Pause, Play, Ban,
    Calendar, CalendarOff, ChevronDown, ChevronUp,
    Filter, Sparkles,
} from "lucide-react";

/* ─── Global Styles ──────────────────────────────────────────────────────── */
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        button, a, [role="button"] { cursor: pointer !important; }
        button:disabled { cursor: not-allowed !important; opacity: .6; }

        @keyframes fadeInUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn   { from { opacity:0; transform:scale(.95); } to { opacity:1; transform:scale(1); } }
        @keyframes popIn     { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        @keyframes shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes spin      { to { transform:rotate(360deg); } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }

        .gsb-enter   { animation: fadeInUp .38s cubic-bezier(.22,1,.36,1) both; }
        .gsb-scale   { animation: scaleIn .28s cubic-bezier(.22,1,.36,1) both; }
        .gsb-pop     { animation: popIn .38s cubic-bezier(.22,1,.36,1) both; }
        .gsb-slide   { animation: slideRight .28s cubic-bezier(.22,1,.36,1) both; }
        .gsb-fade    { animation: fadeIn .22s ease both; }

        .gsb-shimmer {
            background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
            background-size: 400px 100%; animation: shimmer 1.4s infinite linear; border-radius: 8px;
        }

        .gsb-tab { transition: all .18s ease; border-bottom: 2px solid transparent; }
        .gsb-tab:hover { color: #4f46e5; }
        .gsb-tab-active { color: #4f46e5 !important; border-bottom-color: #4f46e5 !important; }

        .gsb-card { transition: transform .18s, box-shadow .18s, border-color .18s; }
        .gsb-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.09) !important; }

        .gsb-btn-primary {
            background: linear-gradient(135deg,#4f46e5,#6366f1) !important;
            box-shadow: 0 4px 14px rgba(79,70,229,.3);
            transition: filter .18s, transform .14s !important;
        }
        .gsb-btn-primary:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }

        .gsb-input { outline: none; transition: border-color .18s, box-shadow .18s; }
        .gsb-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.15) !important; }
        .gsb-input[type=number]::-webkit-inner-spin-button,
        .gsb-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .gsb-input[type=number] { -moz-appearance: textfield; appearance: textfield; }

        .gsb-overlay {
            position: fixed; inset: 0; z-index: 60;
            background: rgba(15,23,42,.55); backdrop-filter: blur(5px);
            display: flex; align-items: center; justify-content: center; padding: 16px;
        }

        .gsb-icon-btn {
            display: inline-flex; align-items: center; justify-content: center;
            border-radius: 10px; padding: 8px; border: none; outline: none;
            transition: transform .15s, box-shadow .15s, background .15s;
        }
        .gsb-icon-btn:hover { transform: translateY(-1px) scale(1.08); }

        .zone-status-active          { background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; }
        .zone-status-manually_inactive { background:#fee2e2; color:#dc2626; border:1px solid #fecaca; }
        .zone-status-temporarily_inactive { background:#fef3c7; color:#d97706; border:1px solid #fde68a; }
        .zone-status-expired         { background:#f1f5f9; color:#64748b; border:1px solid #e2e8f0; }
        .zone-status-not_started     { background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; }
    `}</style>
);

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const Spin = () => (
    <span style={{ width:13,height:13,border:"2px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block" }} />
);

const inputStyle = { width:"100%",padding:"10px 13px",fontSize:13,fontWeight:500,border:"1.5px solid #e2e8f0",borderRadius:12,background:"#fff",color:"#1e293b",fontFamily:"inherit",outline:"none" };

const today = () => new Date().toISOString().split("T")[0];
const parseDate = (d) => d ? new Date(d + "T00:00:00") : null;
const dateLabel = (d) => d ? new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : null;

const getZoneStatus = (zone) => {
    const now = new Date(), todayStr = today(), todayDate = parseDate(todayStr);
    const nowT = new Date().toTimeString().slice(0,5);
    if (zone.is_manually_inactive) {
        if (zone.manual_inactive_until && now > new Date(zone.manual_inactive_until)) return "active";
        return "manually_inactive";
    }
    for (const p of (zone.inactive_periods||[])) {
        if (!p.from_date) continue;
        const from = parseDate(p.from_date), to = p.to_date ? parseDate(p.to_date) : null;
        if (todayDate >= from && (!to || todayDate <= to)) {
            if (p.from_time && p.to_time) { if (nowT >= p.from_time && nowT <= p.to_time) return "temporarily_inactive"; }
            else return "temporarily_inactive";
        }
    }
    const actDate = zone.activation_start_date ? parseDate(zone.activation_start_date) : null;
    const expDate = zone.expiry_date ? parseDate(zone.expiry_date) : null;
    if (actDate && todayDate < actDate) return "not_started";
    if (expDate && todayDate > expDate) return "expired";
    return "active";
};

/* ─── Section: Edit Service ──────────────────────────────────────────────── */
const EditServiceSection = ({ service, onSaved }) => {
    const [updateService, { isLoading }] = useUpdateServiceMutation();
    const [form, setForm] = useState({ name: service?.name||"", description: service?.description||"", pre_payment_required: service?.pre_payment_required||false });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setForm({ name: service?.name||"", description: service?.description||"", pre_payment_required: service?.pre_payment_required||false });
    }, [service]);

    const handleChange = e => { const {name,value,type,checked}=e.target; setForm(p=>({...p,[name]:type==="checkbox"?checked:value})); };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await updateService({ id: service.id, data: form }).unwrap();
            setSuccess(true); onSaved?.();
            setTimeout(() => setSuccess(false), 2000);
        } catch(err) { alert(err?.data?.message||"Failed to update"); }
    };

    if (success) return (
        <div style={{ textAlign:"center", padding:"40px 0" }} className="gsb-fade">
            <div className="gsb-pop" style={{ width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 6px 20px rgba(34,197,94,.35)" }}>
                <Check size={28} color="#fff" />
            </div>
            <p style={{ fontWeight:800,fontSize:15,color:"#0f172a",marginBottom:4 }}>Service Updated!</p>
            <p style={{ fontSize:13,color:"#64748b" }}>Changes saved successfully.</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:18 }}>
            <div>
                <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7 }}>Service Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Deep Cleaning, Hair Cut"
                    className="gsb-input" style={inputStyle} />
            </div>
            <div>
                <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7 }}>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                    placeholder="Describe what this service includes…" className="gsb-input"
                    style={{ ...inputStyle, resize:"none", lineHeight:1.6 }} />
                <p style={{ fontSize:11,color:"#94a3b8",marginTop:5,fontWeight:500 }}>{form.description.length} characters</p>
            </div>
            <div onClick={() => setForm(p=>({...p,pre_payment_required:!p.pre_payment_required}))}
                style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderRadius:14,cursor:"pointer",userSelect:"none",border:`2px solid ${form.pre_payment_required?"#fdba74":"#e2e8f0"}`,background:form.pre_payment_required?"#fff7ed":"#f8fafc",transition:"all .18s" }}>
                <div>
                    <p style={{ fontSize:13,fontWeight:700,color:"#1e293b",margin:0 }}>Require Pre-payment</p>
                    <p style={{ fontSize:11,color:"#64748b",marginTop:3,marginBottom:0 }}>Customers must pay before service is confirmed</p>
                </div>
                <div style={{ position:"relative",width:44,height:24,borderRadius:999,flexShrink:0,background:form.pre_payment_required?"#f97316":"#cbd5e1",transition:"background .2s" }}>
                    <div style={{ position:"absolute",top:3,left:3,width:18,height:18,background:"#fff",borderRadius:"50%",boxShadow:"0 1px 4px rgba(0,0,0,.18)",transition:"transform .2s",transform:form.pre_payment_required?"translateX(20px)":"translateX(0)" }} />
                </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
                <button type="submit" disabled={isLoading} className="gsb-btn-primary"
                    style={{ flex:1,padding:"12px",borderRadius:14,border:"none",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                    {isLoading ? <><Spin /> Updating…</> : <><Save size={14} /> Save Changes</>}
                </button>
            </div>
        </form>
    );
};

/* ─── Section: Descriptions ──────────────────────────────────────────────── */
const DescriptionsSection = ({ serviceId }) => {
    const { data: descriptions=[], isLoading, refetch } = useGetDescriptionsByServiceQuery(serviceId);
    const [createDesc, { isLoading: isCreating }] = useCreateServiceDescriptionMutation();
    const [updateDesc, { isLoading: isUpdating }] = useUpdateServiceDescriptionMutation();
    const [deleteDesc, { isLoading: isDeleting }] = useDeleteServiceDescriptionMutation();

    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [form, setForm] = useState({ description_key:"", description_value:"" });
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const openCreate = () => { setForm({description_key:"",description_value:""}); setEditItem(null); setShowForm(true); };
    const openEdit = d => { setForm({description_key:d.description_key,description_value:d.description_value}); setEditItem(d); setShowForm(true); };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editItem) await updateDesc({ id:editItem.id, data:form }).unwrap();
            else await createDesc({ ...form, service_id: Number(serviceId) }).unwrap();
            refetch(); setShowForm(false); setEditItem(null);
        } catch(err) { alert(err?.data?.message||"Failed"); }
    };

    const handleDelete = async () => {
        try {
            await deleteDesc(deleteTarget.id).unwrap();
            setDeleteSuccess(true); refetch();
            setTimeout(() => { setDeleteTarget(null); setDeleteSuccess(false); }, 1500);
        } catch(err) { alert(err?.data?.message||"Failed"); }
    };

    const colors = [
        {grad:"from-blue-500 to-cyan-500",bg:"#eff6ff",text:"#2563eb"},
        {grad:"from-indigo-500 to-purple-500",bg:"#eef2ff",text:"#4f46e5"},
        {grad:"from-emerald-500 to-teal-500",bg:"#f0fdf4",text:"#16a34a"},
        {grad:"from-rose-500 to-orange-500",bg:"#fff1f2",text:"#e11d48"},
    ];

    if (isLoading) return <div style={{ display:"flex",flexDirection:"column",gap:12 }}>{[...Array(3)].map((_,i)=><div key={i} className="gsb-shimmer" style={{height:80}} />)}</div>;

    return (
        <div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
                <p style={{ fontSize:12,fontWeight:700,color:"#64748b" }}>{descriptions.length} description{descriptions.length!==1?"s":""}</p>
                <button onClick={openCreate} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#4f46e5,#6366f1)",color:"#fff",fontSize:12,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 12px rgba(79,70,229,.3)" }}>
                    <Plus size={13} /> Add Description
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="gsb-scale" style={{ background:"#f8fafc",border:"1.5px solid #e0e7ff",borderRadius:16,padding:"18px 20px",marginBottom:16 }}>
                    <p style={{ fontWeight:800,fontSize:13,color:"#0f172a",marginBottom:14 }}>{editItem?"Edit":"New"} Description</p>
                    <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:12 }}>
                        <div>
                            <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Key *</label>
                            <input type="text" value={form.description_key} onChange={e=>setForm(p=>({...p,description_key:e.target.value}))} required placeholder="e.g. What's included" className="gsb-input" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#6366f1",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Value *</label>
                            <textarea value={form.description_value} onChange={e=>setForm(p=>({...p,description_value:e.target.value}))} required rows={3} placeholder="Description content…" className="gsb-input" style={{...inputStyle,resize:"none"}} />
                        </div>
                        <div style={{ display:"flex",gap:9 }}>
                            <button type="button" onClick={()=>setShowForm(false)} style={{ flex:1,padding:"10px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                            <button type="submit" disabled={isCreating||isUpdating} className="gsb-btn-primary" style={{ flex:1,padding:"10px",borderRadius:12,border:"none",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                                {(isCreating||isUpdating) ? <><Spin /> Saving…</> : <><Check size={13} /> {editItem?"Update":"Create"}</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {descriptions.length === 0 && !showForm ? (
                <div style={{ textAlign:"center",padding:"40px 20px",background:"#f8fafc",borderRadius:16,border:"1.5px dashed #e2e8f0" }}>
                    <FileText size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }} />
                    <p style={{ fontWeight:700,color:"#1e293b",marginBottom:4 }}>No descriptions yet</p>
                    <p style={{ fontSize:12,color:"#94a3b8" }}>Click "Add Description" to get started</p>
                </div>
            ) : (
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12 }}>
                    {descriptions.map((d,i) => {
                        const c = colors[i%colors.length];
                        return (
                            <div key={d.id} className="gsb-card" style={{ background:"#fff",borderRadius:16,border:"1.5px solid #f1f5f9",padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                                <div style={{ display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:999,background:c.bg,color:c.text,fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>
                                    {d.description_key}
                                </div>
                                <p style={{ fontSize:13,color:"#475569",lineHeight:1.6,marginBottom:14 }}>{d.description_value}</p>
                                <div style={{ display:"flex",gap:8 }}>
                                    <button onClick={()=>openEdit(d)} style={{ flex:1,padding:"8px",borderRadius:10,border:"1px solid #e2e8f0",background:"#f8fafc",fontSize:12,fontWeight:700,color:"#475569",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .15s" }}
                                        onMouseEnter={e=>{e.currentTarget.style.background="#eff6ff";e.currentTarget.style.color="#2563eb";}}
                                        onMouseLeave={e=>{e.currentTarget.style.background="#f8fafc";e.currentTarget.style.color="#475569";}}>
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button onClick={()=>setDeleteTarget(d)} style={{ padding:"8px 12px",borderRadius:10,border:"1px solid #fee2e2",background:"#fff1f2",fontSize:12,fontWeight:700,color:"#dc2626",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5,transition:"all .15s" }}
                                        onMouseEnter={e=>e.currentTarget.style.background="#fee2e2"}
                                        onMouseLeave={e=>e.currentTarget.style.background="#fff1f2"}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete confirm */}
            {deleteTarget && (
                <div className="gsb-overlay">
                    <div className="gsb-scale" style={{ background:"#fff",borderRadius:24,padding:"26px",width:"100%",maxWidth:370,boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
                        {!deleteSuccess ? (
                            <>
                                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                                    <div style={{ width:40,height:40,borderRadius:13,background:"#fff1f2",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={17} color="#dc2626" /></div>
                                    <div><p style={{ fontWeight:800,fontSize:14,color:"#0f172a",margin:0 }}>Delete Description</p><p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>This cannot be undone</p></div>
                                </div>
                                <div style={{ background:"#fff1f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 14px",marginBottom:18 }}>
                                    <p style={{ fontSize:13,color:"#475569",margin:0 }}>Delete <strong style={{color:"#0f172a"}}>{deleteTarget.description_key}</strong>?</p>
                                </div>
                                <div style={{ display:"flex",gap:9 }}>
                                    <button onClick={()=>setDeleteTarget(null)} style={{ flex:1,padding:"11px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                                    <button onClick={handleDelete} disabled={isDeleting} style={{ flex:1,padding:"11px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",boxShadow:"0 4px 14px rgba(239,68,68,.3)",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                                        {isDeleting?<><Spin />Deleting…</>:<><Trash2 size={13}/>Delete</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign:"center",padding:"16px 0" }}>
                                <div className="gsb-pop" style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}><Check size={26} color="#fff" /></div>
                                <p style={{ fontWeight:800,color:"#15803d",fontSize:14 }}>Deleted!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Section: Metadata ──────────────────────────────────────────────────── */
const MetadataSection = ({ serviceId }) => {
    const { data: allMeta=[], isLoading, refetch } = useGetAllServiceMetadataQuery();
    const metadata = allMeta.filter(m => String(m.service_id) === String(serviceId));
    const [createMeta,{isLoading:isCreating}] = useCreateServiceMetadataMutation();
    const [updateMeta,{isLoading:isUpdating}] = useUpdateServiceMetadataMutation();
    const [deleteMeta,{isLoading:isDeleting}] = useDeleteServiceMetadataMutation();
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [form, setForm] = useState({ metadata_name:"", metadata_value_type:"text" });
    const VALUE_TYPES = ["text","option","date"];

    const openCreate = () => { setForm({metadata_name:"",metadata_value_type:"text"}); setEditItem(null); setShowForm(true); };
    const openEdit = m => { setForm({metadata_name:m.metadata_name,metadata_value_type:m.metadata_value_type}); setEditItem(m); setShowForm(true); };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editItem) await updateMeta({ id:editItem.id, body:form }).unwrap();
            else await createMeta({ ...form, service_id: Number(serviceId) }).unwrap();
            refetch(); setShowForm(false); setEditItem(null);
        } catch(err) { alert(err?.data?.message||"Failed"); }
    };

    const handleDelete = async () => {
        try {
            await deleteMeta(deleteTarget.id).unwrap();
            setDeleteSuccess(true); refetch();
            setTimeout(()=>{ setDeleteTarget(null); setDeleteSuccess(false); },1500);
        } catch(err) { alert(err?.data?.message||"Failed"); }
    };

    const typeBadge = { text:"#eff6ff/#2563eb", option:"#f5f3ff/#7c3aed", date:"#fff1f2/#e11d48" };
    const typeColors = { text:{bg:"#eff6ff",color:"#2563eb"}, option:{bg:"#f5f3ff",color:"#7c3aed"}, date:{bg:"#fff1f2",color:"#e11d48"} };

    if (isLoading) return <div style={{display:"flex",flexDirection:"column",gap:12}}>{[...Array(3)].map((_,i)=><div key={i} className="gsb-shimmer" style={{height:72}}/>)}</div>;

    return (
        <div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
                <p style={{ fontSize:12,fontWeight:700,color:"#64748b" }}>{metadata.length} field{metadata.length!==1?"s":""}</p>
                <button onClick={openCreate} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#8b5cf6)",color:"#fff",fontSize:12,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 12px rgba(124,58,237,.3)" }}>
                    <Plus size={13} /> New Field
                </button>
            </div>

            {showForm && (
                <div className="gsb-scale" style={{ background:"#faf5ff",border:"1.5px solid #e9d5ff",borderRadius:16,padding:"18px 20px",marginBottom:16 }}>
                    <p style={{ fontWeight:800,fontSize:13,color:"#0f172a",marginBottom:14 }}>{editItem?"Edit":"New"} Metadata Field</p>
                    <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:12 }}>
                        <div>
                            <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Field Name *</label>
                            <input type="text" value={form.metadata_name} onChange={e=>setForm(p=>({...p,metadata_name:e.target.value}))} required placeholder="Enter field name…" className="gsb-input" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8 }}>Type</label>
                            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
                                {VALUE_TYPES.map(t=>(
                                    <button key={t} type="button" onClick={()=>setForm(p=>({...p,metadata_value_type:t}))}
                                        style={{ padding:"9px",borderRadius:10,border:`1.5px solid ${form.metadata_value_type===t?"#7c3aed":"#e2e8f0"}`,background:form.metadata_value_type===t?"#7c3aed":"#fff",color:form.metadata_value_type===t?"#fff":"#475569",fontSize:12,fontWeight:700,fontFamily:"inherit",transition:"all .15s" }}>
                                        {t.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display:"flex",gap:9 }}>
                            <button type="button" onClick={()=>setShowForm(false)} style={{ flex:1,padding:"10px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                            <button type="submit" disabled={isCreating||isUpdating} style={{ flex:1,padding:"10px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#7c3aed,#8b5cf6)",boxShadow:"0 4px 12px rgba(124,58,237,.3)",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                                {(isCreating||isUpdating)?<><Spin/>Saving…</>:<><Check size={13}/>{editItem?"Update":"Create"}</>}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {metadata.length===0 && !showForm ? (
                <div style={{ textAlign:"center",padding:"40px 20px",background:"#f8fafc",borderRadius:16,border:"1.5px dashed #e2e8f0" }}>
                    <Database size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }} />
                    <p style={{ fontWeight:700,color:"#1e293b",marginBottom:4 }}>No metadata fields</p>
                    <p style={{ fontSize:12,color:"#94a3b8" }}>Add custom fields to enhance this service</p>
                </div>
            ) : (
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12 }}>
                    {metadata.map(m=>{
                        const tc = typeColors[m.metadata_value_type]||typeColors.text;
                        return (
                            <div key={m.id} className="gsb-card" style={{ background:"#fff",borderRadius:14,border:"1.5px solid #f1f5f9",padding:"14px 16px",boxShadow:"0 2px 8px rgba(0,0,0,.04)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10 }}>
                                <div>
                                    <span style={{ display:"inline-block",padding:"2px 8px",borderRadius:999,background:tc.bg,color:tc.color,fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5 }}>{m.metadata_value_type}</span>
                                    <p style={{ fontWeight:700,fontSize:13,color:"#1e293b",margin:0 }}>{m.metadata_name}</p>
                                </div>
                                <div style={{ display:"flex",gap:5,flexShrink:0 }}>
                                    <button onClick={()=>openEdit(m)} className="gsb-icon-btn" style={{ background:"#eff6ff",color:"#2563eb" }}><Pencil size={13}/></button>
                                    <button onClick={()=>setDeleteTarget(m)} className="gsb-icon-btn" style={{ background:"#fff1f2",color:"#dc2626" }}><Trash2 size={13}/></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {deleteTarget && (
                <div className="gsb-overlay">
                    <div className="gsb-scale" style={{ background:"#fff",borderRadius:24,padding:"26px",width:"100%",maxWidth:370,boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
                        {!deleteSuccess ? (
                            <>
                                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                                    <div style={{ width:40,height:40,borderRadius:13,background:"#fff1f2",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={17} color="#dc2626"/></div>
                                    <div><p style={{ fontWeight:800,fontSize:14,color:"#0f172a",margin:0 }}>Delete Field</p><p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>Cannot be undone</p></div>
                                </div>
                                <div style={{ background:"#fff1f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 14px",marginBottom:18 }}>
                                    <p style={{ fontSize:13,color:"#475569",margin:0 }}>Delete <strong style={{color:"#0f172a"}}>{deleteTarget.metadata_name}</strong>?</p>
                                </div>
                                <div style={{ display:"flex",gap:9 }}>
                                    <button onClick={()=>setDeleteTarget(null)} style={{ flex:1,padding:"11px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                                    <button onClick={handleDelete} disabled={isDeleting} style={{ flex:1,padding:"11px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                                        {isDeleting?<><Spin/>Deleting…</>:<><Trash2 size={13}/>Delete</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign:"center",padding:"16px 0" }}>
                                <div className="gsb-pop" style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}><Check size={26} color="#fff"/></div>
                                <p style={{ fontWeight:800,color:"#15803d",fontSize:14 }}>Deleted!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Section: Prices ────────────────────────────────────────────────────── */
const PricesSection = ({ serviceId }) => {
    const businessId = (() => { try { const t=localStorage.getItem("token"); return t?jwtDecode(t).business_id:null; } catch{return null;} })();
    const { data: pricesResp, refetch } = useGetPricesByBusinessQuery(businessId, { skip: !businessId });
    const allPrices = Array.isArray(pricesResp?.data||pricesResp) ? (pricesResp?.data||pricesResp) : [];
    const price = allPrices.find(p => p.service_id === Number(serviceId));

    const [createPrice, {isLoading:isCreating}] = useCreateServicePriceMutation();
    const [updatePrice, {isLoading:isUpdating}] = useUpdateServicePriceMutation();
    const [deletePrice, {isLoading:isDeleting}] = useDeleteServicePriceMutation();

    const [mode, setMode] = useState("view"); // view | edit | create | delete
    const [form, setForm] = useState({ price:"", sac_code:"", is_gst_applicable:false, cgst_percent:0, sgst_percent:0, igst_percent:0 });
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (price) setForm({ price:price.price||"", sac_code:price.sac_code||"", is_gst_applicable:price.is_gst_applicable||false, cgst_percent:price.cgst_percent||0, sgst_percent:price.sgst_percent||0, igst_percent:price.igst_percent||0 });
    }, [price]);

    const calcTotal = () => {
        const base = Number(form.price)||0;
        if (!form.is_gst_applicable) return base;
        const tax = (base*(Number(form.cgst_percent)+Number(form.sgst_percent)+Number(form.igst_percent)))/100;
        return base+tax;
    };

    const handleChange = e => { const{name,value,type,checked}=e.target; setForm(p=>({...p,[name]:type==="checkbox"?checked:value})); };

    const handleCreate = async e => {
        e.preventDefault();
        try {
            await createPrice({ service_id:Number(serviceId), price:Number(form.price), sac_code:form.sac_code, is_gst_applicable:form.is_gst_applicable, cgst_percent:Number(form.cgst_percent), sgst_percent:Number(form.sgst_percent), igst_percent:Number(form.igst_percent) }).unwrap();
            setSuccess("created"); refetch(); setTimeout(()=>{ setSuccess(null); setMode("view"); }, 2000);
        } catch(err) { alert(err?.data?.message||"Failed"); }
    };

    const handleUpdate = async e => {
        e.preventDefault();
        try {
            await updatePrice({ id:price.id, price:Number(form.price), sac_code:form.sac_code, is_gst_applicable:form.is_gst_applicable, cgst_percent:Number(form.cgst_percent), sgst_percent:Number(form.sgst_percent), igst_percent:Number(form.igst_percent) }).unwrap();
            setSuccess("updated"); refetch(); setTimeout(()=>{ setSuccess(null); setMode("view"); }, 2000);
        } catch(err) { alert(err?.data?.message||"Failed"); }
    };

    const handleDelete = async () => {
        try {
            await deletePrice(price.id).unwrap();
            setSuccess("deleted"); refetch();
            setTimeout(()=>{ setSuccess(null); setMode("create"); }, 2000);
        } catch(err) { alert(err?.data?.message||"Failed"); }
    };

    if (success) return (
        <div style={{ textAlign:"center",padding:"40px 0" }} className="gsb-fade">
            <div className="gsb-pop" style={{ width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 6px 20px rgba(34,197,94,.35)" }}>
                <Check size={28} color="#fff"/>
            </div>
            <p style={{ fontWeight:800,fontSize:15,color:"#0f172a",marginBottom:4 }}>
                {success==="created"?"Price Set!":success==="updated"?"Price Updated!":"Price Deleted!"}
            </p>
            <p style={{ fontSize:13,color:"#64748b" }}>{success==="deleted"?"Price removed.": `₹${calcTotal().toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} saved.`}</p>
        </div>
    );

    // Form JSX (shared for create/edit)
    const formJSX = (
        <form onSubmit={mode==="create"?handleCreate:handleUpdate} style={{ display:"flex",flexDirection:"column",gap:15 }}>
            <div style={{ display:"flex",gap:10 }}>
                <div style={{ flex:1 }}>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#16a34a",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Base Price (₹) *</label>
                    <div style={{ position:"relative" }}>
                        <IndianRupee size={13} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",pointerEvents:"none" }} />
                        <input type="number" name="price" value={form.price} onChange={handleChange} required step="0.01" placeholder="0.00"
                            onFocus={e=>e.target.select()} autoComplete="off" className="gsb-input" style={{...inputStyle,paddingLeft:30}} />
                    </div>
                </div>
                <div style={{ flex:1 }}>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#16a34a",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>SAC Code</label>
                    <input type="text" name="sac_code" value={form.sac_code} onChange={handleChange} placeholder="e.g. 998314" autoComplete="off" className="gsb-input" style={inputStyle} />
                </div>
            </div>
            <div onClick={()=>setForm(p=>({...p,is_gst_applicable:!p.is_gst_applicable}))}
                style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:12,cursor:"pointer",userSelect:"none",border:`2px solid ${form.is_gst_applicable?"#fdba74":"#e2e8f0"}`,background:form.is_gst_applicable?"#fff7ed":"#f8fafc",transition:"all .15s" }}>
                <div>
                    <p style={{ fontSize:13,fontWeight:700,color:"#1e293b",margin:0 }}>GST Applicable</p>
                    <p style={{ fontSize:11,color:"#64748b",marginTop:2,marginBottom:0 }}>Include tax in final price</p>
                </div>
                <div style={{ position:"relative",width:40,height:22,borderRadius:999,flexShrink:0,background:form.is_gst_applicable?"#f97316":"#cbd5e1",transition:"background .2s" }}>
                    <div style={{ position:"absolute",top:2,left:2,width:18,height:18,background:"#fff",borderRadius:"50%",boxShadow:"0 1px 4px rgba(0,0,0,.18)",transition:"transform .2s",transform:form.is_gst_applicable?"translateX(18px)":"translateX(0)" }} />
                </div>
            </div>
            {form.is_gst_applicable && (
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
                    {[["cgst_percent","CGST %"],["sgst_percent","SGST %"],["igst_percent","IGST %"]].map(([field,label])=>(
                        <div key={field}>
                            <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5 }}>{label}</label>
                            <input type="number" name={field} value={form[field]} onChange={handleChange} step="0.01" autoComplete="off"
                                onFocus={e=>e.target.select()} className="gsb-input" style={{...inputStyle,padding:"8px 10px"}} />
                        </div>
                    ))}
                </div>
            )}
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderRadius:12,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1px solid #bbf7d0" }}>
                <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                    <Calculator size={14} color="#16a34a"/>
                    <span style={{ fontSize:12,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:"0.08em" }}>Total Amount</span>
                </div>
                <span style={{ fontSize:18,fontWeight:900,color:"#15803d" }}>₹{calcTotal().toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
            </div>
            <div style={{ display:"flex",gap:9 }}>
                <button type="button" onClick={()=>setMode(price?"view":"view")} style={{ flex:1,padding:"11px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                <button type="submit" disabled={isCreating||isUpdating||!form.price} className="gsb-btn-primary"
                    style={{ flex:1,padding:"11px",borderRadius:12,border:"none",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                    {(isCreating||isUpdating)?<><Spin/>Saving…</>:<><Save size={13}/>{mode==="create"?"Set Price":"Save Changes"}</>}
                </button>
            </div>
        </form>
    );

    if (mode==="view" && !price) return (
        <div style={{ textAlign:"center",padding:"40px 20px",background:"#f8fafc",borderRadius:16,border:"1.5px dashed #e2e8f0" }}>
            <DollarSign size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }}/>
            <p style={{ fontWeight:700,color:"#1e293b",marginBottom:4 }}>No price set</p>
            <p style={{ fontSize:12,color:"#94a3b8",marginBottom:18 }}>Set a price to enable billing for this service</p>
            <button onClick={()=>setMode("create")} style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"10px 22px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#16a34a,#22c55e)",color:"#fff",fontSize:13,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 14px rgba(22,163,74,.3)" }}>
                <Plus size={14}/> Set Price
            </button>
        </div>
    );

    if (mode==="view" && price) return (
        <div>
            <div style={{ padding:"18px 20px",borderRadius:16,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1px solid #bbf7d0",marginBottom:16 }}>
                <p style={{ fontSize:10,fontWeight:800,color:"#15803d",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>Total Price</p>
                <p style={{ fontSize:30,fontWeight:900,color:"#14532d",margin:0 }}>₹{Number(price.total_price||0).toLocaleString()}</p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
                {[["Base Price",`₹${price.price||0}`],["SAC Code",price.sac_code||"—"],["GST",price.is_gst_applicable?"Applicable":"Not Applicable"],["CGST",`${price.cgst_percent||0}%`],["SGST",`${price.sgst_percent||0}%`],["IGST",`${price.igst_percent||0}%`]].map(([label,val])=>(
                    <div key={label} style={{ padding:"10px 13px",borderRadius:11,background:"#f8fafc",border:"1px solid #f1f5f9" }}>
                        <p style={{ fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 3px" }}>{label}</p>
                        <p style={{ fontSize:13,fontWeight:700,color:"#1e293b",margin:0 }}>{val}</p>
                    </div>
                ))}
            </div>
            <button onClick={()=>setMode("edit")}
                style={{ width:"100%",padding:"11px",borderRadius:12,border:"1.5px solid #bfdbfe",background:"#eff6ff",fontSize:13,fontWeight:700,color:"#2563eb",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .15s" }}
                onMouseEnter={e=>e.currentTarget.style.background="#dbeafe"}
                onMouseLeave={e=>e.currentTarget.style.background="#eff6ff"}>
                <Edit2 size={13}/> Edit Price
            </button>
        </div>
    );

    if (mode==="create"||mode==="edit") return formJSX;
};

/* ─── Section: Zones (simplified inline) ────────────────────────────────── */
const ZonesSection = ({ serviceId }) => {
    const { data: zonesResp, isLoading, refetch } = useGetAllServiceZonesQuery(undefined, { refetchOnMountOrArgChange: true });
    const allZones = zonesResp?.data || zonesResp || [];
    const serviceZones = allZones.filter(z => String(z.service_id) === String(serviceId)).map(z => ({ ...z, zone_status: getZoneStatus(z) }));
    const { data: staffListRaw=[] } = useGetAllStaffsQuery();
    const staffList = Array.isArray(staffListRaw) ? staffListRaw : staffListRaw?.data||[];
    const [createZone,{isLoading:isCreating}] = useCreateServiceZoneMutation();
    const [updateZone,{isLoading:isUpdating}] = useUpdateServiceZoneMutation();
    const [deleteZone] = useDeleteServiceZoneMutation();
    const [toggleInactive,{isLoading:isToggling}] = useToggleServiceZoneManualInactiveMutation();
    const [updatePeriods] = useUpdateServiceZoneInactivePeriodsMutation();

    const emptyForm = { zone_name:"",zone_description:"",staff_in_charge:"",start_time:"",end_time:"",no_of_slots:"",each_slot_time:"",activation_start_date:"",expiry_date:"",is_time_fixed:false,is_no_of_slots_fixed:false };
    const [showCreate, setShowCreate] = useState(false);
    const [editZone, setEditZone] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [expandedZone, setExpandedZone] = useState(null);
    const [createForm, setCreateForm] = useState(emptyForm);
    const [editForm, setEditForm] = useState(emptyForm);

    const onChange = (setter) => e => { const{name,value,type,checked}=e.target; setter(p=>({...p,[name]:type==="checkbox"?checked:value})); };

    const handleCreate = async e => {
        e.preventDefault();
        try {
            await createZone({ ...createForm,service_id:Number(serviceId),no_of_slots:createForm.no_of_slots?Number(createForm.no_of_slots):null,each_slot_time:createForm.each_slot_time?Number(createForm.each_slot_time):null,staff_in_charge:Number(createForm.staff_in_charge) }).unwrap();
            setShowCreate(false); setCreateForm(emptyForm); refetch();
        } catch(err) { alert(err?.data?.message||"Failed to create zone"); }
    };

    const handleUpdate = async e => {
        e.preventDefault();
        try {
            await updateZone({ id:editZone.id,data:{...editForm,no_of_slots:editForm.no_of_slots?Number(editForm.no_of_slots):null,each_slot_time:editForm.each_slot_time?Number(editForm.each_slot_time):null,staff_in_charge:Number(editForm.staff_in_charge)} }).unwrap();
            setEditZone(null); refetch();
        } catch(err) { alert(err?.data?.message||"Failed to update zone"); }
    };

    const handleDelete = async () => {
        try { await deleteZone(deleteTarget.id).unwrap(); setDeleteSuccess(true); refetch(); setTimeout(()=>{ setDeleteTarget(null); setDeleteSuccess(false); },1500); }
        catch(err) { alert(err?.data?.message||"Failed"); }
    };

    const openEdit = z => {
        setEditForm({ zone_name:z.zone_name||"",zone_description:z.zone_description||"",staff_in_charge:z.staff_in_charge||"",start_time:z.start_time||"",end_time:z.end_time||"",no_of_slots:z.no_of_slots||"",each_slot_time:z.each_slot_time||"",activation_start_date:z.activation_start_date?.split("T")[0]||"",expiry_date:z.expiry_date?.split("T")[0]||"",is_time_fixed:z.is_time_fixed||false,is_no_of_slots_fixed:z.is_no_of_slots_fixed||false });
        setEditZone(z);
    };

    const statusColors = { active:{bg:"#dcfce7",color:"#15803d",label:"Active"}, manually_inactive:{bg:"#fee2e2",color:"#dc2626",label:"Deactivated"}, temporarily_inactive:{bg:"#fef3c7",color:"#d97706",label:"Temp. Inactive"}, expired:{bg:"#f1f5f9",color:"#64748b",label:"Expired"}, not_started:{bg:"#eff6ff",color:"#2563eb",label:"Not Started"} };

    const ZoneFormFields = ({ form, setter, onSubmit, onCancel, isLoading, label }) => (
        <form onSubmit={onSubmit} style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Zone Name *</label>
                    <input name="zone_name" value={form.zone_name} onChange={onChange(setter)} required placeholder="e.g. Morning Slot" className="gsb-input" style={inputStyle} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Staff in Charge *</label>
                    <select name="staff_in_charge" value={form.staff_in_charge} onChange={onChange(setter)} required className="gsb-input" style={{...inputStyle,appearance:"none"}}>
                        <option value="">Select Staff…</option>
                        {staffList.map(s=><option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Start Time</label>
                    <input type="time" name="start_time" value={form.start_time} onChange={onChange(setter)} className="gsb-input" style={inputStyle} />
                </div>
                <div>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>End Time</label>
                    <input type="time" name="end_time" value={form.end_time} onChange={onChange(setter)} className="gsb-input" style={inputStyle} />
                </div>
                <div>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>No. of Slots</label>
                    <input type="number" name="no_of_slots" value={form.no_of_slots} onChange={onChange(setter)} placeholder="e.g. 10" className="gsb-input" style={inputStyle} />
                </div>
                <div>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Slot Duration (min)</label>
                    <input type="number" name="each_slot_time" value={form.each_slot_time} onChange={onChange(setter)} placeholder="e.g. 30" className="gsb-input" style={inputStyle} />
                </div>
                <div>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Activation Date *</label>
                    <input type="date" name="activation_start_date" value={form.activation_start_date} onChange={onChange(setter)} required className="gsb-input" style={inputStyle} />
                </div>
                <div>
                    <label style={{ display:"block",fontSize:10,fontWeight:800,color:"#2563eb",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Expiry Date</label>
                    <input type="date" name="expiry_date" value={form.expiry_date} onChange={onChange(setter)} className="gsb-input" style={inputStyle} />
                </div>
            </div>
            <div style={{ display:"flex",gap:9 }}>
                <button type="button" onClick={onCancel} style={{ flex:1,padding:"10px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                <button type="submit" disabled={isLoading} style={{ flex:1,padding:"10px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#2563eb,#4f46e5)",boxShadow:"0 4px 12px rgba(37,99,235,.3)",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                    {isLoading?<><Spin/>Saving…</>:<><Check size={13}/>{label}</>}
                </button>
            </div>
        </form>
    );

    if (isLoading) return <div style={{display:"flex",flexDirection:"column",gap:12}}>{[...Array(2)].map((_,i)=><div key={i} className="gsb-shimmer" style={{height:90}}/>)}</div>;

    return (
        <div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
                <p style={{ fontSize:12,fontWeight:700,color:"#64748b" }}>{serviceZones.length} zone{serviceZones.length!==1?"s":""}</p>
                <button onClick={()=>setShowCreate(true)} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#2563eb,#4f46e5)",color:"#fff",fontSize:12,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 12px rgba(37,99,235,.3)" }}>
                    <Plus size={13}/> Add Zone
                </button>
            </div>

            {showCreate && (
                <div className="gsb-scale" style={{ background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:16,padding:"18px 20px",marginBottom:16 }}>
                    <p style={{ fontWeight:800,fontSize:13,color:"#0f172a",marginBottom:14 }}>Create Zone</p>
                    <ZoneFormFields form={createForm} setter={setCreateForm} onSubmit={handleCreate} onCancel={()=>setShowCreate(false)} isLoading={isCreating} label="Create Zone" />
                </div>
            )}

            {serviceZones.length===0 && !showCreate ? (
                <div style={{ textAlign:"center",padding:"40px 20px",background:"#f8fafc",borderRadius:16,border:"1.5px dashed #e2e8f0" }}>
                    <MapPin size={28} color="#cbd5e1" style={{ margin:"0 auto 10px",display:"block" }}/>
                    <p style={{ fontWeight:700,color:"#1e293b",marginBottom:4 }}>No zones yet</p>
                    <p style={{ fontSize:12,color:"#94a3b8" }}>Create zones to manage time slots and staff</p>
                </div>
            ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                    {serviceZones.map(zone=>{
                        const sc = statusColors[zone.zone_status]||statusColors.active;
                        const isExpanded = expandedZone===zone.id;
                        return (
                            <div key={zone.id} style={{ background:"#fff",borderRadius:16,border:"1.5px solid #f1f5f9",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
                                {editZone?.id===zone.id ? (
                                    <div style={{ padding:"16px" }}>
                                        <p style={{ fontWeight:800,fontSize:13,color:"#0f172a",marginBottom:14 }}>Edit Zone</p>
                                        <ZoneFormFields form={editForm} setter={setEditForm} onSubmit={handleUpdate} onCancel={()=>setEditZone(null)} isLoading={isUpdating} label="Save Changes" />
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px" }}>
                                            <div style={{ width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#2563eb,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                                                <MapPin size={18} color="#fff"/>
                                            </div>
                                            <div style={{ flex:1,minWidth:0 }}>
                                                <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3 }}>
                                                    <p style={{ fontWeight:800,fontSize:14,color:"#0f172a",margin:0 }}>{zone.zone_name}</p>
                                                    <span style={{ padding:"2px 9px",borderRadius:999,fontSize:10,fontWeight:700,background:sc.bg,color:sc.color }}>{sc.label}</span>
                                                </div>
                                                <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>
                                                    {dateLabel(zone.activation_start_date)}{zone.expiry_date?` → ${dateLabel(zone.expiry_date)}`:" · No expiry"}
                                                    {zone.no_of_slots?` · ${zone.no_of_slots} slots`:""}
                                                    {zone.each_slot_time?` · ${zone.each_slot_time} min`:""}
                                                </p>
                                            </div>
                                            <div style={{ display:"flex",gap:5,flexShrink:0,alignItems:"center" }}>
                                                {zone.zone_status!=="expired" && (
                                                    zone.zone_status==="manually_inactive" ?
                                                    <button onClick={async()=>{ try{await toggleInactive({id:zone.id,is_manually_inactive:false}).unwrap();refetch();}catch{alert("Failed");} }} disabled={isToggling}
                                                        style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:10,border:"1px solid #bbf7d0",background:"#f0fdf4",color:"#16a34a",fontSize:11,fontWeight:700,fontFamily:"inherit" }}>
                                                        <Play size={11}/> Reactivate
                                                    </button> :
                                                    <button onClick={async()=>{ if(window.confirm("Deactivate this zone?")){ try{await toggleInactive({id:zone.id,is_manually_inactive:true,reason:"Manually deactivated"}).unwrap();refetch();}catch{alert("Failed");} } }}
                                                        style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:10,border:"1px solid #fecaca",background:"#fff1f2",color:"#dc2626",fontSize:11,fontWeight:700,fontFamily:"inherit" }}>
                                                        <Ban size={11}/> Deactivate
                                                    </button>
                                                )}
                                                <button onClick={()=>openEdit(zone)} className="gsb-icon-btn" style={{ background:"#eff6ff",color:"#2563eb" }}><Pencil size={13}/></button>
                                                <button onClick={()=>{ setDeleteTarget(zone); setDeleteSuccess(false); }} className="gsb-icon-btn" style={{ background:"#fff1f2",color:"#dc2626" }}><Trash2 size={13}/></button>
                                                <button onClick={()=>setExpandedZone(isExpanded?null:zone.id)} className="gsb-icon-btn" style={{ background:"#f8fafc",color:"#64748b" }}>
                                                    {isExpanded?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
                                                </button>
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div style={{ borderTop:"1px solid #f1f5f9",padding:"14px 16px",background:"#f8fafc" }} className="gsb-fade">
                                                <ZoneStaffPanel zone={zone} allStaff={staffList} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {deleteTarget && (
                <div className="gsb-overlay">
                    <div className="gsb-scale" style={{ background:"#fff",borderRadius:24,padding:"26px",width:"100%",maxWidth:370,boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
                        {!deleteSuccess ? (
                            <>
                                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                                    <div style={{ width:40,height:40,borderRadius:13,background:"#fff1f2",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={17} color="#dc2626"/></div>
                                    <div><p style={{ fontWeight:800,fontSize:14,color:"#0f172a",margin:0 }}>Delete Zone</p><p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>Cannot be undone</p></div>
                                </div>
                                <div style={{ background:"#fff1f2",border:"1px solid #fecaca",borderRadius:12,padding:"12px 14px",marginBottom:18 }}>
                                    <p style={{ fontSize:13,color:"#475569",margin:0 }}>Delete <strong style={{color:"#0f172a"}}>{deleteTarget.zone_name}</strong>?</p>
                                </div>
                                <div style={{ display:"flex",gap:9 }}>
                                    <button onClick={()=>setDeleteTarget(null)} style={{ flex:1,padding:"11px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                                    <button onClick={handleDelete} style={{ flex:1,padding:"11px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7 }}>
                                        <Trash2 size={13}/> Delete
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign:"center",padding:"16px 0" }}>
                                <div className="gsb-pop" style={{ width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px" }}><Check size={26} color="#fff"/></div>
                                <p style={{ fontWeight:800,color:"#15803d",fontSize:14 }}>Deleted!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Zone Staff Panel ───────────────────────────────────────────────────── */
const ZoneStaffPanel = ({ zone, allStaff }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [showAssign, setShowAssign] = useState(false);
    const { data: assignedStaff=[], refetch } = useGetStaffByServiceZoneQuery(zone.id);
    const [assignStaff,{isLoading:isAssigning}] = useAssignStaffToZoneMutation();
    const [removeStaff] = useRemoveStaffFromZoneMutation();

    const assignedIds = assignedStaff.map(r=>r.staff_id);
    const available = allStaff.filter(s=>!assignedIds.includes(s.id));

    const handleAssign = async () => {
        if (!selectedIds.length) return;
        try { await assignStaff({ service_zone_id:zone.id, staff_ids:selectedIds }).unwrap(); setSelectedIds([]); setShowAssign(false); refetch(); }
        catch(err) { alert(err?.data?.message||"Failed"); }
    };

    return (
        <div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
                <p style={{ fontSize:12,fontWeight:700,color:"#64748b",margin:0,display:"flex",alignItems:"center",gap:6 }}>
                    <Users size={13}/> Assigned Staff ({assignedStaff.length})
                </p>
                <button onClick={()=>setShowAssign(v=>!v)} style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2563eb,#4f46e5)",color:"#fff",fontSize:11,fontWeight:700,fontFamily:"inherit" }}>
                    <UserPlus size={12}/> Assign Staff
                </button>
            </div>

            {showAssign && (
                <div style={{ background:"#fff",borderRadius:12,border:"1.5px solid #bfdbfe",padding:"14px",marginBottom:12 }}>
                    {available.length===0 ? <p style={{ fontSize:12,color:"#94a3b8",fontStyle:"italic" }}>All staff already assigned.</p> : (
                        <>
                            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12,maxHeight:160,overflowY:"auto" }}>
                                {available.map(s=>{
                                    const sel = selectedIds.includes(s.id);
                                    return (
                                        <button key={s.id} onClick={()=>setSelectedIds(p=>p.includes(s.id)?p.filter(x=>x!==s.id):[...p,s.id])}
                                            style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,border:`1.5px solid ${sel?"#4f46e5":"#e2e8f0"}`,background:sel?"#eef2ff":"#fff",fontFamily:"inherit",transition:"all .15s" }}>
                                            <div style={{ width:28,height:28,borderRadius:8,background:sel?"linear-gradient(135deg,#4f46e5,#6366f1)":"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:sel?"#fff":"#64748b",flexShrink:0 }}>
                                                {(s.first_name?.[0]||"")+(s.last_name?.[0]||"")}
                                            </div>
                                            <span style={{ fontSize:12,fontWeight:600,color:sel?"#4f46e5":"#475569",flex:1,textAlign:"left",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{s.first_name} {s.last_name}</span>
                                            {sel && <Check size={12} color="#4f46e5"/>}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ display:"flex",gap:8 }}>
                                <button onClick={()=>setShowAssign(false)} style={{ flex:1,padding:"8px",borderRadius:10,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:12,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                                <button onClick={handleAssign} disabled={isAssigning||!selectedIds.length} style={{ flex:1,padding:"8px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2563eb,#4f46e5)",fontSize:12,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                                    {isAssigning?<><Spin/>Assigning…</>:`Assign${selectedIds.length?` (${selectedIds.length})`:""}`}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {assignedStaff.length===0 ? (
                <p style={{ fontSize:12,color:"#94a3b8",fontStyle:"italic" }}>No staff assigned yet.</p>
            ) : (
                <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                    {assignedStaff.map(record=>{
                        const s=record.staff; if(!s) return null;
                        return (
                            <div key={record.id} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:10,background:"#fff",border:"1px solid #e2e8f0" }}>
                                <div style={{ width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#60a5fa,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0 }}>
                                    {(s.first_name?.[0]||"")+(s.last_name?.[0]||"")}
                                </div>
                                <span style={{ fontSize:12,fontWeight:600,color:"#0f172a" }}>{s.first_name} {s.last_name}</span>
                                <button onClick={async()=>{ try{await removeStaff(record.id).unwrap();refetch();}catch{alert("Failed");} }}
                                    style={{ padding:"3px",borderRadius:6,border:"none",background:"transparent",color:"#94a3b8",display:"flex",alignItems:"center",transition:"color .15s" }}
                                    onMouseEnter={e=>e.currentTarget.style.color="#dc2626"}
                                    onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>
                                    <UserMinus size={13}/>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const GetServiceById = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch } = useGetServiceByIdQuery(id);
    const [deleteService,{isLoading:isDeleting}] = useDeleteServiceMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { id:"overview",  label:"Overview",     icon:<Package size={14}/>,    color:"#4f46e5" },
        { id:"edit",      label:"Edit",          icon:<Edit2 size={14}/>,      color:"#0ea5e9" },
        { id:"prices",    label:"Prices",        icon:<DollarSign size={14}/>, color:"#16a34a" },
        { id:"descriptions",label:"Descriptions",icon:<FileText size={14}/>,  color:"#9333ea" },
        { id:"metadata",  label:"Metadata",      icon:<Database size={14}/>,   color:"#d97706" },
        { id:"zones",     label:"Zones",         icon:<MapPin size={14}/>,     color:"#2563eb" },
    ];

    const handleDelete = async () => {
        try {
            await deleteService(id).unwrap();
            setDeleteSuccess(true);
            setTimeout(()=>navigate(-1),1800);
        } catch(err) { alert(err?.data?.message||"Failed to delete service"); }
    };

    if (isLoading) return (
        <>
            <GlobalStyles />
            <div style={{ minHeight:"100vh",background:"linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)",padding:"24px 16px" }}>
                <div style={{ maxWidth:780,margin:"0 auto" }}>
                    <div className="gsb-shimmer" style={{ height:16,width:80,marginBottom:20 }}/>
                    <div className="gsb-shimmer" style={{ height:140,borderRadius:20,marginBottom:16 }}/>
                    <div className="gsb-shimmer" style={{ height:48,borderRadius:14,marginBottom:16 }}/>
                    {[...Array(3)].map((_,i)=><div key={i} className="gsb-shimmer" style={{ height:70,borderRadius:14,marginBottom:12 }}/>)}
                </div>
            </div>
        </>
    );

    if (isError||!data) return (
        <>
            <GlobalStyles />
            <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#f0f4ff,#f8fafc)" }}>
                <div style={{ textAlign:"center" }}>
                    <div style={{ width:56,height:56,borderRadius:16,background:"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}><X size={22} color="#dc2626"/></div>
                    <p style={{ fontWeight:700,color:"#1e293b",marginBottom:5 }}>Service not found</p>
                    <button onClick={()=>navigate(-1)} style={{ padding:"10px 20px",borderRadius:12,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Go Back</button>
                </div>
            </div>
        </>
    );

    const service = data.service || data.data || data;

    return (
        <>
            <GlobalStyles />
            <div style={{ minHeight:"100vh",background:"linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
                <div style={{ maxWidth:820,margin:"0 auto",padding:"24px 16px 40px" }}>

                    {/* Back */}
                    <button onClick={()=>navigate(-1)} className="gsb-enter"
                        style={{ display:"flex",alignItems:"center",gap:7,marginBottom:20,fontSize:13,fontWeight:600,color:"#64748b",background:"none",border:"none",fontFamily:"inherit",padding:0,transition:"color .15s" }}
                        onMouseEnter={e=>e.currentTarget.style.color="#4f46e5"}
                        onMouseLeave={e=>e.currentTarget.style.color="#64748b"}>
                        <ArrowLeft size={15}/> Back to Services
                    </button>

                    {/* Header Card */}
                    <div className="gsb-enter" style={{ borderRadius:22,padding:"22px 26px",marginBottom:18,background:"linear-gradient(135deg,#4f46e5,#6366f1 55%,#818cf8)",boxShadow:"0 12px 40px rgba(79,70,229,.28)" }}>
                        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16 }}>
                            <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                                <div style={{ width:54,height:54,borderRadius:16,background:"rgba(255,255,255,.18)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                                    <span style={{ fontSize:22,fontWeight:900,color:"#fff" }}>{(service.name||"?")[0].toUpperCase()}</span>
                                </div>
                                <div>
                                    <p style={{ color:"rgba(255,255,255,.65)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:3,margin:"0 0 3px" }}>Service Details</p>
                                    <h1 style={{ fontSize:22,fontWeight:800,color:"#fff",margin:0,lineHeight:1.2 }}>{service.name||"—"}</h1>
                                    <span style={{ display:"inline-flex",alignItems:"center",gap:5,marginTop:7,padding:"3px 10px",borderRadius:999,fontSize:11,fontWeight:700,background:service.pre_payment_required?"rgba(249,115,22,.25)":"rgba(34,197,94,.2)",color:service.pre_payment_required?"#fed7aa":"#bbf7d0" }}>
                                        <span style={{ width:5,height:5,borderRadius:"50%",background:service.pre_payment_required?"#fb923c":"#4ade80" }}/>
                                        {service.pre_payment_required?"Pre-payment Required":"No Advance Required"}
                                    </span>
                                </div>
                            </div>
                            <button onClick={()=>{ setDeleteSuccess(false); setShowDeleteModal(true); }}
                                style={{ width:34,height:34,borderRadius:10,background:"rgba(239,68,68,.25)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s" }}
                                onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.4)"}
                                onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,.25)"}>
                                <Trash2 size={15} color="#fca5a5"/>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display:"flex",gap:0,background:"#fff",borderRadius:16,border:"1.5px solid #f1f5f9",padding:"4px",marginBottom:20,overflowX:"auto",boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
                        {tabs.map(tab=>(
                            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                                style={{
                                    display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:12,
                                    fontSize:12,fontWeight:700,whiteSpace:"nowrap",border:"none",fontFamily:"inherit",
                                    transition:"all .18s",
                                    background:activeTab===tab.id?tab.color:"transparent",
                                    color:activeTab===tab.id?"#fff":"#64748b",
                                    boxShadow:activeTab===tab.id?"0 3px 10px rgba(0,0,0,.15)":"none",
                                }}>
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div key={activeTab} className="gsb-enter" style={{ background:"#fff",borderRadius:20,border:"1.5px solid #f1f5f9",padding:"22px 24px",boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>

                        {activeTab==="overview" && (
                            <div>
                                <p style={{ fontSize:10,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12 }}>Description</p>
                                <p style={{ fontSize:14,color:"#475569",lineHeight:1.7,marginBottom:20 }}>
                                    {service.description || <em style={{color:"#cbd5e1"}}>No description provided.</em>}
                                </p>
                                <div style={{ height:1,background:"linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)",marginBottom:20 }}/>
                                <p style={{ fontSize:10,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12 }}>Quick Actions</p>
                                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10 }}>
                                    {tabs.filter(t=>t.id!=="overview").map(tab=>(
                                        <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                                            style={{ display:"flex",alignItems:"center",gap:8,padding:"12px 14px",borderRadius:14,border:`1.5px solid`,borderColor:tab.color+"33",background:tab.color+"11",color:tab.color,fontSize:13,fontWeight:700,fontFamily:"inherit",transition:"all .18s",cursor:"pointer" }}
                                            onMouseEnter={e=>{ e.currentTarget.style.background=tab.color+"22"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 6px 16px ${tab.color}33`; }}
                                            onMouseLeave={e=>{ e.currentTarget.style.background=tab.color+"11"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="none"; }}>
                                            {tab.icon} {tab.label} <ChevronRight size={12} style={{marginLeft:"auto"}}/>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab==="edit" && (
                            <EditServiceSection service={service} onSaved={refetch} />
                        )}

                        {activeTab==="prices" && (
                            <PricesSection serviceId={id} />
                        )}

                        {activeTab==="descriptions" && (
                            <DescriptionsSection serviceId={id} />
                        )}

                        {activeTab==="metadata" && (
                            <MetadataSection serviceId={id} />
                        )}

                        {activeTab==="zones" && (
                            <ZonesSection serviceId={id} />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="gsb-overlay">
                    <div className="gsb-scale" style={{ background:"#fff",borderRadius:24,padding:"26px",width:"100%",maxWidth:370,boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
                        {!deleteSuccess ? (
                            <>
                                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18 }}>
                                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                                        <div style={{ width:40,height:40,borderRadius:13,background:"#fff1f2",display:"flex",alignItems:"center",justifyContent:"center" }}><Trash2 size={17} color="#dc2626"/></div>
                                        <div>
                                            <p style={{ fontWeight:800,fontSize:15,color:"#0f172a",margin:0 }}>Delete Service</p>
                                            <p style={{ fontSize:11,color:"#94a3b8",margin:0 }}>This cannot be undone</p>
                                        </div>
                                    </div>
                                    <button onClick={()=>setShowDeleteModal(false)} style={{ padding:6,borderRadius:9,border:"none",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center" }}>
                                        <X size={14} color="#64748b"/>
                                    </button>
                                </div>
                                <div style={{ background:"#fff1f2",border:"1px solid #fecaca",borderRadius:13,padding:"13px 15px",marginBottom:20 }}>
                                    <p style={{ fontSize:13,color:"#475569",margin:0 }}>Delete <strong style={{color:"#0f172a"}}>{service.name}</strong>?</p>
                                </div>
                                <div style={{ display:"flex",gap:9 }}>
                                    <button onClick={()=>setShowDeleteModal(false)} style={{ flex:1,padding:12,borderRadius:13,border:"1.5px solid #e2e8f0",background:"#fff",fontSize:13,fontWeight:600,color:"#475569",fontFamily:"inherit" }}>Cancel</button>
                                    <button onClick={handleDelete} disabled={isDeleting}
                                        style={{ flex:1,padding:12,borderRadius:13,border:"none",background:"linear-gradient(135deg,#ef4444,#dc2626)",boxShadow:"0 4px 16px rgba(239,68,68,.3)",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                                        {isDeleting?<><Spin/>Deleting…</>:<><Trash2 size={13}/>Delete</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign:"center",padding:"16px 0" }}>
                                <div className="gsb-pop" style={{ width:62,height:62,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 6px 24px rgba(34,197,94,.35)" }}>
                                    <Check size={28} color="#fff"/>
                                </div>
                                <p style={{ fontWeight:800,fontSize:15,color:"#0f172a",marginBottom:5 }}>Deleted!</p>
                                <p style={{ fontSize:13,color:"#94a3b8" }}>Redirecting you back…</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default GetServiceById;