// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import {
//     useGetServicesByBusinessQuery,
//     useDeleteServiceMutation,
//     useGetPricesByBusinessQuery,
//     useUpdateServiceMutation,
//     useCreateServiceMutation,
//     useGetAllServiceCategoriesQuery,
//     useCreateServicePriceMutation,
//     useUpdateServicePriceMutation,
//     useDeleteServicePriceMutation,
//     useGetDescriptionsByServiceQuery,
//     useCreateServiceDescriptionMutation,
//     useUpdateServiceDescriptionMutation,
//     useDeleteServiceDescriptionMutation,
//     useGetAllServiceMetadataQuery,
//     useCreateServiceMetadataMutation,
//     useUpdateServiceMetadataMutation,
//     useDeleteServiceMetadataMutation,
//     useGetAllServiceZonesQuery,
//     useCreateServiceZoneMutation,
//     useUpdateServiceZoneMutation,
//     useDeleteServiceZoneMutation,
//     useGetAllStaffsQuery,
// } from '../../../../app/service/slice';
// import {
//     ArrowLeft, Plus, Search, Package, X, Check, Eye, Edit2, Trash2,
//     FileText, Database, MapPin, ChevronUp, ChevronDown, DollarSign, Power,
//     Save, AlertCircle, Pencil, ChevronLeft, Calculator, Tag, AlertTriangle, Clock, Users, Calendar,
// } from 'lucide-react';

// const GlobalStyles = () => (
//     <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
//         * { font-family: 'DM Sans', sans-serif; }
//         button, a, [role="button"] { cursor: pointer !important; }
//         @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
//         @keyframes rowSlide { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
//         @keyframes shimmer  { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
//         @keyframes pulseRing { 0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,.35); } 50% { box-shadow:0 0 0 8px rgba(99,102,241,0); } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes popIn {
//             0%   { transform: scale(0); opacity: 0; }
//             60%  { transform: scale(1.18); }
//             100% { transform: scale(1);   opacity: 1; }
//         }
//         @keyframes fadeInScale {
//             from { opacity: 0; transform: scale(.96); }
//             to   { opacity: 1; transform: scale(1); }
//         }
//         .page-enter { animation: fadeInUp .45s cubic-bezier(.22,1,.36,1) both; }
//         .row-enter  { animation: rowSlide .35s cubic-bezier(.22,1,.36,1) both; }
//         .fade-enter { animation: fadeIn .3s ease both; }
//         .sm-pop     { animation: popIn .38s cubic-bezier(.22,1,.36,1) both; }
//         .sm-modal   { animation: fadeInScale .28s cubic-bezier(.22,1,.36,1) both; }
//         .shimmer-bg {
//             background: linear-gradient(90deg,#f1f5f9 25%,#e8eef5 50%,#f1f5f9 75%);
//             background-size: 400px 100%;
//             animation: shimmer 1.4s infinite linear;
//         }
//         .table-row { transition: background .18s ease; cursor: pointer !important; }
//         .table-row:hover { background: linear-gradient(90deg,#f8faff,#f5f7ff) !important; }
//         .icon-btn {
//             display: inline-flex; align-items: center; justify-content: center;
//             border-radius: 10px; padding: 8px;
//             transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
//             cursor: pointer !important; border: none; outline: none;
//         }
//         .icon-btn:hover  { transform: translateY(-2px) scale(1.12); }
//         .icon-btn:active { transform: scale(.93); }
//         .eye-btn:hover     { box-shadow: 0 4px 14px rgba(99,102,241,.3); }
//         .desc-btn:hover    { box-shadow: 0 4px 14px rgba(168,85,247,.3); }
//         .meta-btn:hover    { box-shadow: 0 4px 14px rgba(245,158,11,.3); }
//         .zone-btn:hover    { box-shadow: 0 4px 14px rgba(59,130,246,.3); }
//         .edit-btn:hover    { box-shadow: 0 4px 14px rgba(16,185,129,.3); }
//         .del-btn:hover     { box-shadow: 0 4px 14px rgba(239,68,68,.3); }
//         .disable-btn:hover { box-shadow: 0 4px 14px rgba(245,158,11,.3); }
//         .enable-btn:hover  { box-shadow: 0 4px 14px rgba(16,185,129,.3); }
//         .create-btn {
//             position: relative; overflow: hidden;
//             animation: pulseRing 2.8s infinite;
//             transition: transform .18s ease, box-shadow .18s ease;
//             cursor: pointer !important;
//         }
//         .create-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,.45); }
//         .create-btn:active { transform: scale(.97); }
//         .create-btn::after {
//             content:''; position:absolute; inset:0;
//             background: linear-gradient(135deg,rgba(255,255,255,.18),transparent);
//             pointer-events: none;
//         }
//         .search-wrap { position: relative; }
//         .search-wrap input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,.15); border-color: #a5b4fc; }
//         .modal-overlay { animation: fadeIn .2s ease both; }
//         .modal-card    { animation: fadeInUp .28s cubic-bezier(.22,1,.36,1) both; }
//         .status-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }
//         .sm-input { outline: none; transition: border-color .18s, box-shadow .18s; }
//         .sm-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.16) !important; }
//         [data-tip] { position: relative; }
//         [data-tip]::after {
//             content: attr(data-tip);
//             position: absolute; bottom: calc(100% + 7px); left: 50%;
//             transform: translateX(-50%) scale(.85);
//             background: #1e293b; color: #fff; font-size: 11px; font-weight: 600;
//             white-space: nowrap; padding: 4px 9px; border-radius: 7px;
//             opacity: 0; pointer-events: none;
//             transition: opacity .15s ease, transform .15s ease; z-index: 99;
//         }
//         [data-tip]:hover::after { opacity: 1; transform: translateX(-50%) scale(1); }
//         .table-scroll::-webkit-scrollbar { height: 5px; }
//         .table-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
//         .table-scroll::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }
//         @media (max-width: 900px) { .col-desc   { display: none; } }
//         @media (max-width: 768px) { .col-status { display: none; } }
//     `}</style>
// );

// const Spin = () => (
//     <span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
// );

// const StatusPill = ({ status }) => {
//     const map = {
//         active:   { dot:"#22c55e", text:"#15803d", bg:"#f0fdf4", border:"#bbf7d0", label:"Active" },
//         pending:  { dot:"#f59e0b", text:"#b45309", bg:"#fffbeb", border:"#fde68a", label:"Pending" },
//         inactive: { dot:"#f59e0b", text:"#b45309", bg:"#fffbeb", border:"#fde68a", label:"Disabled" },
//         deleted:  { dot:"#ef4444", text:"#dc2626", bg:"#fef2f2", border:"#fecaca", label:"Deleted" },
//     };
//     const cfg = map[status?.toLowerCase()] || map.active;
//     return (
//         <span style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.text }}
//             className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold">
//             <span className="status-dot" style={{ background:cfg.dot }} />
//             {cfg.label}
//         </span>
//     );
// };

// const SortIcon = ({ active, dir }) => (
//     <span className="inline-flex flex-col ml-1 leading-none">
//         <ChevronUp   size={9} style={{ opacity: active && dir==="asc"  ? 1 : .3, color: active ? "#6366f1" : undefined }} />
//         <ChevronDown size={9} style={{ opacity: active && dir==="desc" ? 1 : .3, color: active ? "#6366f1" : undefined }} />
//     </span>
// );

// /* ═══════════════════════════════════════════════════════════════════════════
//    VIEW PRICE MODAL — full create / edit / delete inline
//    ═══════════════════════════════════════════════════════════════════════════ */
// const ViewPriceModal = ({ service, onClose, allPrices, onRefetch }) => {

//     /* find existing price for this service */
//     const existingPrice = useMemo(() => {
//         if (!Array.isArray(allPrices)) return null;
//         return allPrices.find(p => p.service_id === service.id) || null;
//     }, [allPrices, service.id]);

//     /* view: "detail" | "create" | "edit" | "delete" */
//     const [view, setView]       = useState("detail");
//     const [actionDone, setActionDone] = useState(false);

//     /* mutations */
//     const [createPrice, { isLoading: creating }] = useCreateServicePriceMutation();
//     const [updatePrice, { isLoading: updating }] = useUpdateServicePriceMutation();
//     const [deletePrice, { isLoading: deleting }] = useDeleteServicePriceMutation();

//     /* shared form state */
//     const emptyForm = { price: "", sac_code: "", is_gst_applicable: false, cgst_percent: 0, sgst_percent: 0, igst_percent: 0 };
//     const [form, setForm] = useState(emptyForm);

//     useEffect(() => {
//         if (view === "edit" && existingPrice) {
//             setForm({
//                 price:             existingPrice.price             ?? "",
//                 sac_code:          existingPrice.sac_code          ?? "",
//                 is_gst_applicable: existingPrice.is_gst_applicable ?? false,
//                 cgst_percent:      existingPrice.cgst_percent      ?? 0,
//                 sgst_percent:      existingPrice.sgst_percent      ?? 0,
//                 igst_percent:      existingPrice.igst_percent      ?? 0,
//             });
//         }
//         if (view === "create") { setForm(emptyForm); }
//         setActionDone(false);
//     }, [view]);

//     const handleChange = e => {
//         const { name, value, type, checked } = e.target;
//         setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//     };

//     const calcTotal = () => {
//         const base = Number(form.price) || 0;
//         if (!form.is_gst_applicable) return base.toFixed(2);
//         const tax = base * (Number(form.cgst_percent) + Number(form.sgst_percent) + Number(form.igst_percent)) / 100;
//         return (base + tax).toFixed(2);
//     };

//     const handleCreate = async e => {
//         e.preventDefault();
//         try {
//             await createPrice({
//                 service_id:        service.id,
//                 price:             Number(form.price),
//                 sac_code:          form.sac_code,
//                 is_gst_applicable: form.is_gst_applicable,
//                 cgst_percent:      Number(form.cgst_percent),
//                 sgst_percent:      Number(form.sgst_percent),
//                 igst_percent:      Number(form.igst_percent),
//             }).unwrap();
//             setActionDone(true);
//             onRefetch?.();
//             setTimeout(() => { setActionDone(false); setView("detail"); }, 1800);
//         } catch (err) { alert(err?.data?.message || "Failed to create price"); }
//     };

//     const handleUpdate = async e => {
//         e.preventDefault();
//         try {
//             await updatePrice({
//                 id:                existingPrice.id,
//                 price:             Number(form.price),
//                 sac_code:          form.sac_code,
//                 is_gst_applicable: form.is_gst_applicable,
//                 cgst_percent:      Number(form.cgst_percent),
//                 sgst_percent:      Number(form.sgst_percent),
//                 igst_percent:      Number(form.igst_percent),
//             }).unwrap();
//             setActionDone(true);
//             onRefetch?.();
//             setTimeout(() => { setActionDone(false); setView("detail"); }, 1800);
//         } catch (err) { alert(err?.data?.message || "Failed to update price"); }
//     };

//     const handleDelete = async () => {
//         try {
//             await deletePrice(existingPrice.id).unwrap();
//             setActionDone(true);
//             onRefetch?.();
//             setTimeout(onClose, 1600);
//         } catch (err) { alert(err?.data?.message || "Failed to delete price"); }
//     };

//     /* ── shared sub-components ── */
//     const SuccessScreen = ({ msg }) => (
//         <div style={{ textAlign:"center", padding:"32px 0 16px" }}>
//             <div className="sm-pop" style={{
//                 width:62, height:62, borderRadius:"50%",
//                 background:"linear-gradient(135deg,#22c55e,#16a34a)",
//                 boxShadow:"0 6px 24px rgba(34,197,94,.35)",
//                 display:"flex", alignItems:"center", justifyContent:"center",
//                 margin:"0 auto 14px",
//             }}>
//                 <Check size={28} color="#fff" />
//             </div>
//             <p style={{ fontWeight:800, fontSize:15, color:"#0f172a" }}>{msg}</p>
//         </div>
//     );

//     const BackBtn = () => (
//         <button onClick={() => setView("detail")} style={{
//             display:"inline-flex", alignItems:"center", gap:5, background:"none",
//             border:"none", fontSize:12, fontWeight:700, color:"#6366f1", cursor:"pointer", marginBottom:16,
//         }}>
//             <ChevronLeft size={14} /> Back to details
//         </button>
//     );

//     /* ── price form (create + edit) ── */
//     const PriceForm = ({ onSubmit, isLoading: loading, submitLabel }) => (
//         <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

//             {/* Base price + SAC side by side */}
//             <div style={{ display:"flex", gap:12 }}>
//                 <div style={{ flex:1 }}>
//                     <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6366f1", textTransform:"uppercase", letterSpacing:".07em", marginBottom:6 }}>
//                         Base Price (₹) *
//                     </label>
//                     <div style={{ position:"relative" }}>
//                         <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#94a3b8", fontWeight:700 }}>₹</span>
//                         <input type="number" name="price" value={form.price} onChange={handleChange}
//                             required step="0.01" min="0" placeholder="0.00" className="sm-input"
//                             style={{ width:"100%", padding:"11px 12px 11px 26px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, fontWeight:600, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
//                     </div>
//                 </div>
//                 <div style={{ flex:1 }}>
//                     <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6366f1", textTransform:"uppercase", letterSpacing:".07em", marginBottom:6 }}>
//                         SAC Code
//                     </label>
//                     <div style={{ position:"relative" }}>
//                         <Tag size={12} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }} />
//                         <input type="text" name="sac_code" value={form.sac_code} onChange={handleChange}
//                             placeholder="998314" className="sm-input"
//                             style={{ width:"100%", padding:"11px 12px 11px 28px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:13, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
//                     </div>
//                 </div>
//             </div>

//             {/* GST toggle */}
//             <div onClick={() => setForm(p => ({ ...p, is_gst_applicable: !p.is_gst_applicable }))}
//                 style={{
//                     display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
//                     padding:"12px 15px", borderRadius:13, cursor:"pointer", userSelect:"none",
//                     border:`2px solid ${form.is_gst_applicable ? "#93c5fd" : "#e2e8f0"}`,
//                     background: form.is_gst_applicable ? "#eff6ff" : "#f8fafc",
//                     transition:"all .18s",
//                 }}>
//                 <div>
//                     <p style={{ fontSize:13, fontWeight:700, color:"#1e293b", margin:0 }}>GST Applicable</p>
//                     <p style={{ fontSize:11, color:"#64748b", marginTop:2, margin:0 }}>Apply tax rates to this price</p>
//                 </div>
//                 <div style={{ position:"relative", width:44, height:24, borderRadius:999, flexShrink:0, background: form.is_gst_applicable ? "#3b82f6" : "#cbd5e1", transition:"background .2s" }}>
//                     <div style={{ position:"absolute", top:3, left:3, width:18, height:18, background:"#fff", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,.18)", transition:"transform .2s", transform: form.is_gst_applicable ? "translateX(20px)" : "translateX(0)" }} />
//                 </div>
//             </div>

//             {/* GST fields */}
//             {form.is_gst_applicable && (
//                 <div style={{ display:"flex", gap:10, padding:"12px 14px", background:"#eff6ff", borderRadius:12, border:"1.5px solid #bfdbfe" }}>
//                     {[["CGST %","cgst_percent"],["SGST %","sgst_percent"],["IGST %","igst_percent"]].map(([lbl, name]) => (
//                         <div key={name} style={{ flex:1 }}>
//                             <label style={{ display:"block", fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", marginBottom:5 }}>{lbl}</label>
//                             <input type="number" name={name} value={form[name]} onChange={handleChange}
//                                 step="0.01" min="0" className="sm-input"
//                                 style={{ width:"100%", padding:"9px 10px", border:"1.5px solid #bfdbfe", borderRadius:9, fontSize:13, fontWeight:600, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Live total */}
//             <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", borderRadius:14, padding:"13px 16px", border:"1.5px solid #bbf7d0" }}>
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: form.is_gst_applicable ? 6 : 0 }}>
//                     <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>Subtotal</span>
//                     <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>₹{form.price || "0.00"}</span>
//                 </div>
//                 {form.is_gst_applicable && (
//                     <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
//                         <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>
//                             GST ({(+form.cgst_percent + +form.sgst_percent + +form.igst_percent).toFixed(2)}%)
//                         </span>
//                         <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>
//                             ₹{(parseFloat(calcTotal()) - Number(form.price || 0)).toFixed(2)}
//                         </span>
//                     </div>
//                 )}
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #a7f3d0", paddingTop:8, marginTop: form.is_gst_applicable ? 0 : 4 }}>
//                     <div style={{ display:"flex", alignItems:"center", gap:6 }}>
//                         <Calculator size={13} color="#16a34a" />
//                         <span style={{ fontSize:13, fontWeight:800, color:"#15803d" }}>Total Payable</span>
//                     </div>
//                     <span style={{ fontSize:22, fontWeight:800, color:"#15803d" }}>₹{calcTotal()}</span>
//                 </div>
//             </div>

//             {/* Buttons */}
//             <div style={{ display:"flex", gap:10 }}>
//                 <button type="button" onClick={() => setView("detail")}
//                     style={{ flex:1, padding:12, borderRadius:13, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                     Cancel
//                 </button>
//                 <button type="submit" disabled={loading || !form.price}
//                     style={{
//                         flex:2, padding:12, borderRadius:13, border:"none",
//                         fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                         display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                         background:"linear-gradient(135deg,#2563eb,#4f46e5)",
//                         boxShadow:"0 4px 16px rgba(37,99,235,.32)",
//                         cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
//                     }}>
//                     {loading ? <><Spin /> Saving…</> : <><Save size={14} /> {submitLabel}</>}
//                 </button>
//             </div>
//         </form>
//     );

//     /* ── modal overlay wrapper ── */
//     return (
//         <div style={{
//             position:"fixed", inset:0, zIndex:50,
//             background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)",
//             display:"flex", alignItems:"center", justifyContent:"center", padding:16,
//         }} className="modal-overlay">
//             <div className="sm-modal" style={{
//                 background:"#fff", borderRadius:24, padding:26,
//                 width:"100%", maxWidth:560, boxShadow:"0 32px 80px rgba(0,0,0,.22)",
//                 maxHeight:"92vh", overflowY:"auto",
//             }}>

//                 {/* ── MODAL HEADER (always shown) ── */}
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
//                     <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                         <div style={{
//                             width:40, height:40, borderRadius:13,
//                             background: view === "delete" ? "#fef2f2"
//                                       : view === "edit"   ? "linear-gradient(135deg,#f0fdf4,#dcfce7)"
//                                       : view === "create" ? "linear-gradient(135deg,#e0e7ff,#c7d2fe)"
//                                       : "linear-gradient(135deg,#f0fdf4,#dcfce7)",
//                             display:"flex", alignItems:"center", justifyContent:"center",
//                         }}>
//                             {view === "delete" ? <Trash2 size={18} color="#dc2626" />
//                            : view === "edit"   ? <Edit2  size={18} color="#16a34a" />
//                            : view === "create" ? <Plus   size={18} color="#4f46e5" />
//                            : <DollarSign size={18} color="#16a34a" />}
//                         </div>
//                         <div>
//                             <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>
//                                 {view === "delete" ? "Delete Price"
//                                : view === "edit"   ? "Edit Price"
//                                : view === "create" ? "Create Price"
//                                : "Price Details"}
//                             </h2>
//                             <p style={{ fontSize:12, color:"#64748b", marginTop:2, margin:0 }}>{service.name}</p>
//                         </div>
//                     </div>
//                     <button onClick={onClose} style={{ padding:7, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}>
//                         <X size={14} color="#64748b" />
//                     </button>
//                 </div>

//                 {/* ══════════ DETAIL VIEW ══════════ */}
//                 {view === "detail" && (
//                     <>
//                         {existingPrice ? (
//                             <>
//                                 {/* Hero price card */}
//                                 <div style={{
//                                     background:"linear-gradient(135deg,#4f46e5,#6366f1 60%,#818cf8)",
//                                     borderRadius:18, padding:"20px 22px", marginBottom:18,
//                                     boxShadow:"0 8px 28px rgba(79,70,229,.25)",
//                                 }}>
//                                     <p style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>
//                                         Final Payable Amount
//                                     </p>
//                                     <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:10 }}>
//                                         <span style={{ fontSize:14, color:"#a5f3fc", fontWeight:700 }}>₹</span>
//                                         <span style={{ fontSize:42, fontWeight:900, color:"#fff", lineHeight:1 }}>
//                                             {existingPrice.total_price}
//                                         </span>
//                                     </div>
//                                     <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
//                                         <span style={{ fontSize:12, color:"rgba(255,255,255,.65)", fontWeight:600 }}>
//                                             Base: <strong style={{ color:"#fff" }}>₹{existingPrice.price}</strong>
//                                         </span>
//                                         <span style={{ fontSize:12, color:"rgba(255,255,255,.65)", fontWeight:600 }}>
//                                             GST: <strong style={{ color: existingPrice.is_gst_applicable ? "#86efac" : "rgba(255,255,255,.45)" }}>
//                                                 {existingPrice.is_gst_applicable ? "Active" : "None"}
//                                             </strong>
//                                         </span>
//                                         {existingPrice.sac_code && (
//                                             <span style={{ fontSize:12, color:"rgba(255,255,255,.65)", fontWeight:600 }}>
//                                                 SAC: <strong style={{ color:"#fff" }}>{existingPrice.sac_code}</strong>
//                                             </span>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Detail rows */}
//                                 <div style={{ background:"#f8fafc", borderRadius:14, padding:"4px 16px", marginBottom:18, border:"1px solid #e2e8f0" }}>
//                                     {[
//                                         ["Base Price",  `₹${existingPrice.price}`],
//                                         ["SAC Code",    existingPrice.sac_code || "—"],
//                                         ["GST Status",  existingPrice.is_gst_applicable ? "Applicable" : "Not Applicable"],
//                                         ...(existingPrice.is_gst_applicable ? [
//                                             ["CGST Rate", `${existingPrice.cgst_percent || 0}%`],
//                                             ["SGST Rate", `${existingPrice.sgst_percent || 0}%`],
//                                             ["IGST Rate", `${existingPrice.igst_percent || 0}%`],
//                                         ] : []),
//                                         ["Total Price", `₹${existingPrice.total_price}`],
//                                     ].map(([label, value], i, arr) => (
//                                         <div key={label} style={{
//                                             display:"flex", justifyContent:"space-between", alignItems:"center",
//                                             padding:"11px 0",
//                                             borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none",
//                                         }}>
//                                             <span style={{ fontSize:12, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:".04em" }}>{label}</span>
//                                             <span style={{ fontSize: label === "Total Price" ? 16 : 14, fontWeight: label === "Total Price" ? 800 : 600, color: label === "Total Price" ? "#15803d" : "#1e293b" }}>
//                                                 {value}
//                                             </span>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Action buttons */}
//                                 <div style={{ display:"flex", gap:10, marginBottom:12 }}>
//                                     <button onClick={() => setView("edit")}
//                                         style={{
//                                             flex:1, padding:"11px 0", borderRadius:13,
//                                             border:"1.5px solid #bbf7d0", background:"#f0fdf4",
//                                             fontSize:13, fontWeight:700, color:"#16a34a",
//                                             display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer",
//                                         }}>
//                                         <Edit2 size={14} /> Edit Price
//                                     </button>
//                                     <button onClick={() => setView("delete")}
//                                         style={{
//                                             flex:1, padding:"11px 0", borderRadius:13,
//                                             border:"1.5px solid #fecaca", background:"#fef2f2",
//                                             fontSize:13, fontWeight:700, color:"#dc2626",
//                                             display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer",
//                                         }}>
//                                         <Trash2 size={14} /> Delete
//                                     </button>
//                                 </div>

//                             </>
//                         ) : (
//                             /* no price yet */
//                             <div style={{ textAlign:"center", padding:"24px 0" }}>
//                                 <div style={{
//                                     width:64, height:64, borderRadius:20,
//                                     background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)",
//                                     display:"flex", alignItems:"center", justifyContent:"center",
//                                     margin:"0 auto 16px",
//                                 }}>
//                                     <DollarSign size={28} color="#6366f1" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", marginBottom:6 }}>No Price Configured</p>
//                                 <p style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>
//                                     This service has no price set yet. Add one to enable bookings and billing.
//                                 </p>
//                                 <button onClick={() => setView("create")}
//                                     style={{
//                                         padding:"12px 28px", borderRadius:13, border:"none",
//                                         background:"linear-gradient(135deg,#4f46e5,#6366f1)",
//                                         fontSize:13, fontWeight:700, color:"#fff",
//                                         display:"inline-flex", alignItems:"center", gap:7,
//                                         cursor:"pointer", boxShadow:"0 4px 16px rgba(79,70,229,.32)",
//                                     }}>
//                                     <Plus size={15} /> Configure Price
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {/* ══════════ CREATE VIEW ══════════ */}
//                 {view === "create" && (
//                     <>
//                         <BackBtn />
//                         {actionDone
//                             ? <SuccessScreen msg="Price Created!" />
//                             : <PriceForm onSubmit={handleCreate} isLoading={creating} submitLabel="Create Price" />
//                         }
//                     </>
//                 )}

//                 {/* ══════════ EDIT VIEW ══════════ */}
//                 {view === "edit" && (
//                     <>
//                         <BackBtn />
//                         {actionDone
//                             ? <SuccessScreen msg="Price Updated!" />
//                             : <PriceForm onSubmit={handleUpdate} isLoading={updating} submitLabel="Save Changes" />
//                         }
//                     </>
//                 )}

//                 {/* ══════════ DELETE VIEW ══════════ */}
//                 {view === "delete" && (
//                     <>
//                         <BackBtn />
//                         {actionDone ? (
//                             <SuccessScreen msg="Price Deleted!" />
//                         ) : (
//                             <>
//                                 <div style={{
//                                     background:"#fef2f2", borderRadius:14, padding:16,
//                                     border:"1.5px solid #fecaca", marginBottom:18,
//                                     display:"flex", gap:12, alignItems:"flex-start",
//                                 }}>
//                                     <AlertTriangle size={18} color="#dc2626" style={{ flexShrink:0, marginTop:2 }} />
//                                     <div>
//                                         <p style={{ fontSize:13, fontWeight:700, color:"#dc2626", marginBottom:4 }}>This cannot be undone</p>
//                                         <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, margin:0 }}>
//                                             You're about to delete the price for <strong style={{ color:"#1e293b" }}>{service.name}</strong>. This will affect billing calculations.
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {existingPrice && (
//                                     <div style={{ background:"#f8fafc", borderRadius:13, padding:"13px 16px", marginBottom:18, border:"1px solid #e2e8f0" }}>
//                                         <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", marginBottom:10 }}>Price being deleted</p>
//                                         <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
//                                             <span style={{ fontSize:13, color:"#64748b" }}>Base Price</span>
//                                             <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>₹{existingPrice.price}</span>
//                                         </div>
//                                         {existingPrice.sac_code && (
//                                             <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
//                                                 <span style={{ fontSize:13, color:"#64748b" }}>SAC Code</span>
//                                                 <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>{existingPrice.sac_code}</span>
//                                             </div>
//                                         )}
//                                         <div style={{ display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid #e2e8f0", marginTop:4 }}>
//                                             <span style={{ fontSize:13, color:"#64748b" }}>Total Price</span>
//                                             <span style={{ fontSize:18, fontWeight:800, color:"#dc2626" }}>₹{existingPrice.total_price}</span>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div style={{ display:"flex", gap:10 }}>
//                                     <button onClick={() => setView("detail")}
//                                         style={{ flex:1, padding:12, borderRadius:13, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                                         Cancel
//                                     </button>
//                                     <button onClick={handleDelete} disabled={deleting}
//                                         style={{
//                                             flex:1, padding:12, borderRadius:13, border:"none",
//                                             fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                                             display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                                             background:"linear-gradient(135deg,#ef4444,#dc2626)",
//                                             boxShadow:"0 4px 16px rgba(239,68,68,.32)",
//                                             cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.6 : 1,
//                                         }}>
//                                         {deleting ? <><Spin /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
//                                     </button>
//                                 </div>
//                             </>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// /* ─── View Description Modal ─────────────────────────────────────────────────── */
// const ViewDescriptionModal = ({ service, onClose }) => {
//     const { data: descriptions = [], isLoading, refetch } = useGetDescriptionsByServiceQuery(service.id);
//     const [createDesc] = useCreateServiceDescriptionMutation();
//     const [updateDesc] = useUpdateServiceDescriptionMutation();
//     const [deleteDesc] = useDeleteServiceDescriptionMutation();

//     // view: "list" | "create" | "edit" | "delete"
//     const [view, setView] = useState("list");
//     const [selectedDesc, setSelectedDesc] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const [form, setForm] = useState({ description_key: "", description_value: "" });

//     const Spin = () => (
//         <span style={{ width:16, height:16, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
//     );
//     const BackBtn = ({ label = "Back", to = "list" }) => (
//         <button onClick={() => { setView(to); setSuccess(false); setForm({ description_key:"", description_value:"" }); setSelectedDesc(null); }}
//             style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#6366f1", background:"#eef2ff", border:"none", borderRadius:9, padding:"5px 12px", cursor:"pointer", marginBottom:16 }}>
//             <ChevronLeft size={14} /> {label}
//         </button>
//     );

//     const openEdit = (desc) => {
//         setSelectedDesc(desc);
//         setForm({ description_key: desc.description_key, description_value: desc.description_value });
//         setView("edit");
//     };
//     const openDelete = (desc) => { setSelectedDesc(desc); setView("delete"); };

//     const handleCreate = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             await createDesc({ service_id: service.id, ...form }).unwrap();
//             setSuccess(true);
//             refetch();
//             setTimeout(() => { setSuccess(false); setView("list"); setForm({ description_key:"", description_value:"" }); }, 1800);
//         } catch(err) { alert(err?.data?.message || "Failed to create"); }
//         finally { setLoading(false); }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             await updateDesc({ id: selectedDesc.id, data: form }).unwrap();
//             setSuccess(true);
//             refetch();
//             setTimeout(() => { setSuccess(false); setView("list"); setSelectedDesc(null); }, 1800);
//         } catch(err) { alert(err?.data?.message || "Failed to update"); }
//         finally { setLoading(false); }
//     };

//     const handleDelete = async () => {
//         setLoading(true);
//         try {
//             await deleteDesc(selectedDesc.id).unwrap();
//             refetch();
//             setTimeout(() => { setView("list"); setSelectedDesc(null); setLoading(false); }, 1400);
//         } catch(err) { alert(err?.data?.message || "Failed to delete"); setLoading(false); }
//     };

//     const DescForm = ({ onSubmit, submitLabel }) => (
//         <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
//             <div>
//                 <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:6 }}>Information Type (Key) <span style={{color:"#ef4444"}}>*</span></label>
//                 <input
//                     value={form.description_key}
//                     onChange={e => setForm(f => ({...f, description_key: e.target.value}))}
//                     required placeholder="e.g. Warranty, Duration, Requirements"
//                     style={{ width:"100%", padding:"10px 13px", borderRadius:11, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }}
//                 />
//             </div>
//             <div>
//                 <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:6 }}>Description Detail (Value) <span style={{color:"#ef4444"}}>*</span></label>
//                 <textarea
//                     value={form.description_value}
//                     onChange={e => setForm(f => ({...f, description_value: e.target.value}))}
//                     required rows={4} placeholder="e.g. 2 years parts and labor warranty included"
//                     style={{ width:"100%", padding:"10px 13px", borderRadius:11, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", resize:"vertical", background:"#f8fafc" }}
//                 />
//             </div>
//             <div style={{ display:"flex", gap:10, marginTop:4 }}>
//                 <button type="button" onClick={() => setView("list")}
//                     style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                     Cancel
//                 </button>
//                 <button type="submit" disabled={loading || !form.description_key || !form.description_value}
//                     style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                         display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                         background:"linear-gradient(135deg,#7c3aed,#6366f1)",
//                         boxShadow:"0 4px 16px rgba(99,102,241,.32)",
//                         cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
//                     {loading ? <><Spin /> Saving…</> : <><Save size={14} /> {submitLabel}</>}
//                 </button>
//             </div>
//         </form>
//     );

//     const tagColors = [
//         { bg:"#eff6ff", color:"#2563eb" }, { bg:"#f5f3ff", color:"#7c3aed" },
//         { bg:"#f0fdf4", color:"#16a34a" }, { bg:"#fff7ed", color:"#ea580c" },
//         { bg:"#fdf2f8", color:"#be185d" }, { bg:"#ecfdf5", color:"#059669" },
//     ];

//     return (
//         <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
//             <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:580, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"90vh", overflowY:"auto" }}>

//                 {/* ── Header ── */}
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
//                     <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                         <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#faf5ff,#f3e8ff)", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                             <FileText size={18} color="#9333ea" />
//                         </div>
//                         <div>
//                             <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>
//                                 {view === "list" ? "Descriptions" : view === "create" ? "Add Description" : view === "edit" ? "Edit Description" : "Delete Description"}
//                             </h2>
//                             <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{service.name}</p>
//                         </div>
//                     </div>
//                     <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}><X size={14} color="#64748b" /></button>
//                 </div>

//                 {/* ── LIST VIEW ── */}
//                 {view === "list" && (
//                     <>
//                         {isLoading ? (
//                             <div style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontSize:13 }}>Loading…</div>
//                         ) : descriptions.length === 0 ? (
//                             /* Empty state */
//                             <div style={{ textAlign:"center", padding:"32px 16px" }}>
//                                 <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
//                                     <FileText size={30} color="#a78bfa" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 6px" }}>No Descriptions Yet</p>
//                                 <p style={{ fontSize:13, color:"#64748b", margin:"0 0 22px", lineHeight:1.5 }}>This service has no descriptions set.<br/>Add one to provide more details.</p>
//                                 <button onClick={() => setView("create")}
//                                     style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#7c3aed,#6366f1)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:"0 4px 16px rgba(99,102,241,.3)", display:"inline-flex", alignItems:"center", gap:7 }}>
//                                     <Plus size={15} /> Add Description
//                                 </button>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Description cards */}
//                                 <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
//                                     {descriptions.map((desc, i) => {
//                                         const tc = tagColors[i % tagColors.length];
//                                         return (
//                                             <div key={desc.id} style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:"14px 16px", background:"#fafbff" }}>
//                                                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
//                                                     <div style={{ flex:1, minWidth:0 }}>
//                                                         <span style={{ display:"inline-block", background:tc.bg, color:tc.color, fontSize:11, fontWeight:800, borderRadius:8, padding:"3px 10px", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.05em" }}>
//                                                             {desc.description_key}
//                                                         </span>
//                                                         <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:0, whiteSpace:"pre-wrap" }}>
//                                                             {desc.description_value}
//                                                         </p>
//                                                     </div>
//                                                     <div style={{ display:"flex", gap:6, flexShrink:0 }}>
//                                                         <button onClick={() => openEdit(desc)}
//                                                             style={{ padding:"6px 10px", borderRadius:9, border:"1.5px solid #e0e7ff", background:"#eef2ff", color:"#4f46e5", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
//                                                             <Edit2 size={12} /> Edit
//                                                         </button>
//                                                         <button onClick={() => openDelete(desc)}
//                                                             style={{ padding:"6px 8px", borderRadius:9, border:"1.5px solid #fee2e2", background:"#fff5f5", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center" }}>
//                                                             <Trash2 size={13} />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>

//                             </>
//                         )}
//                     </>
//                 )}

//                 {/* ── CREATE VIEW ── */}
//                 {view === "create" && (
//                     <>
//                         <BackBtn label="Back to list" />
//                         {success ? (
//                             <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
//                                 <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 24px rgba(99,102,241,.35)" }}>
//                                     <Check size={30} color="#fff" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Description Added!</p>
//                                 <p style={{ fontSize:12, color:"#64748b" }}>{form.description_key} has been created.</p>
//                             </div>
//                         ) : (
//                             <DescForm onSubmit={handleCreate} submitLabel="Add Description" />
//                         )}
//                     </>
//                 )}

//                 {/* ── EDIT VIEW ── */}
//                 {view === "edit" && (
//                     <>
//                         <BackBtn label="Back to list" />
//                         {success ? (
//                             <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
//                                 <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 24px rgba(34,197,94,.3)" }}>
//                                     <Check size={30} color="#fff" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Updated Successfully!</p>
//                                 <p style={{ fontSize:12, color:"#64748b" }}>Changes saved for "{form.description_key}".</p>
//                             </div>
//                         ) : (
//                             <DescForm onSubmit={handleUpdate} submitLabel="Save Changes" />
//                         )}
//                     </>
//                 )}

//                 {/* ── DELETE VIEW ── */}
//                 {view === "delete" && selectedDesc && (
//                     <>
//                         <BackBtn label="Cancel" />
//                         <div style={{ background:"#fff5f5", borderRadius:14, border:"1.5px solid #fee2e2", padding:16, marginBottom:16, display:"flex", gap:12, alignItems:"flex-start" }}>
//                             <AlertTriangle size={20} color="#ef4444" style={{ flexShrink:0, marginTop:1 }} />
//                             <div>
//                                 <p style={{ fontSize:13, fontWeight:800, color:"#dc2626", margin:"0 0 4px" }}>Delete this description?</p>
//                                 <p style={{ fontSize:12, color:"#64748b", margin:0 }}>This action cannot be undone.</p>
//                             </div>
//                         </div>
//                         {/* Detail card */}
//                         <div style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:14, background:"#fafbff", marginBottom:18 }}>
//                             <span style={{ display:"inline-block", background:"#eff6ff", color:"#2563eb", fontSize:11, fontWeight:800, borderRadius:8, padding:"3px 10px", marginBottom:7, textTransform:"uppercase" }}>
//                                 {selectedDesc.description_key}
//                             </span>
//                             <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:0 }}>{selectedDesc.description_value}</p>
//                         </div>
//                         <div style={{ display:"flex", gap:10 }}>
//                             <button onClick={() => setView("list")}
//                                 style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                                 Cancel
//                             </button>
//                             <button onClick={handleDelete} disabled={loading}
//                                 style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                                     display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                                     background:"linear-gradient(135deg,#dc2626,#ef4444)",
//                                     boxShadow:"0 4px 16px rgba(239,68,68,.3)",
//                                     cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
//                                 {loading ? <><Spin /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
//                             </button>
//                         </div>
//                     </>
//                 )}

//             </div>
//         </div>
//     );
// };

// /* ─── View Metadata Modal ─────────────────────────────────────────────────── */
// const VALUE_TYPES = ["text", "option", "date"];
// const META_TYPE_COLORS = {
//     text:   { bg:"#eff6ff", color:"#2563eb" },
//     option: { bg:"#f5f3ff", color:"#7c3aed" },
//     date:   { bg:"#fff7ed", color:"#ea580c" },
// };

// const ViewMetadataModal = ({ service, onClose }) => {
//     const { data: allMetadata = [], isLoading, refetch } = useGetAllServiceMetadataQuery();
//     const metadata = useMemo(() => allMetadata.filter(m => String(m.service_id) === String(service.id)), [allMetadata, service.id]);

//     const [createMeta] = useCreateServiceMetadataMutation();
//     const [updateMeta] = useUpdateServiceMetadataMutation();
//     const [deleteMeta] = useDeleteServiceMetadataMutation();

//     // view: "list" | "create" | "edit" | "delete"
//     const [view, setView]           = useState("list");
//     const [selected, setSelected]   = useState(null);
//     const [loading, setLoading]     = useState(false);
//     const [success, setSuccess]     = useState(false);
//     const [form, setForm]           = useState({ metadata_name:"", metadata_value_type:"text" });

//     const Spin = () => (
//         <span style={{ width:15, height:15, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
//     );
//     const BackBtn = () => (
//         <button onClick={() => { setView("list"); setSuccess(false); setSelected(null); setForm({ metadata_name:"", metadata_value_type:"text" }); }}
//             style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#ca8a04", background:"#fef9c3", border:"none", borderRadius:9, padding:"5px 12px", cursor:"pointer", marginBottom:16 }}>
//             <ChevronLeft size={14} /> Back
//         </button>
//     );

//     const openEdit = (m) => { setSelected(m); setForm({ metadata_name: m.metadata_name, metadata_value_type: m.metadata_value_type }); setView("edit"); };
//     const openDelete = (m) => { setSelected(m); setView("delete"); };

//     const handleCreate = async (e) => {
//         e.preventDefault(); setLoading(true);
//         try {
//             await createMeta({ ...form, service_id: Number(service.id) }).unwrap();
//             setSuccess(true); refetch();
//             setTimeout(() => { setSuccess(false); setView("list"); setForm({ metadata_name:"", metadata_value_type:"text" }); }, 1800);
//         } catch(err) { alert(err?.data?.message || "Failed to create"); }
//         finally { setLoading(false); }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault(); setLoading(true);
//         try {
//             await updateMeta({ id: selected.id, body: form }).unwrap();
//             setSuccess(true); refetch();
//             setTimeout(() => { setSuccess(false); setView("list"); setSelected(null); }, 1800);
//         } catch(err) { alert(err?.data?.message || "Failed to update"); }
//         finally { setLoading(false); }
//     };

//     const handleDelete = async () => {
//         setLoading(true);
//         try {
//             await deleteMeta(selected.id).unwrap(); refetch();
//             setTimeout(() => { setView("list"); setSelected(null); setLoading(false); }, 1400);
//         } catch(err) { alert(err?.data?.message || "Failed to delete"); setLoading(false); }
//     };

//     const MetaForm = ({ onSubmit, submitLabel }) => (
//         <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
//             <div>
//                 <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:6 }}>Metadata Name <span style={{color:"#ef4444"}}>*</span></label>
//                 <input value={form.metadata_name} onChange={e => setForm(f => ({...f, metadata_name: e.target.value}))}
//                     required placeholder="e.g. Warranty Period, Material Type"
//                     style={{ width:"100%", padding:"10px 13px", borderRadius:11, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }} />
//             </div>
//             <div>
//                 <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:8 }}>Input Type</label>
//                 <div style={{ display:"flex", gap:8 }}>
//                     {VALUE_TYPES.map(t => {
//                         const active = form.metadata_value_type === t;
//                         return <button key={t} type="button" onClick={() => setForm(f => ({...f, metadata_value_type: t}))}
//                             style={{ flex:1, padding:"8px 0", borderRadius:10, border:`1.5px solid ${active ? "#ca8a04" : "#e2e8f0"}`, background: active ? "#ca8a04" : "#f8fafc", color: active ? "#fff" : "#475569", fontSize:11, fontWeight:800, textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}>
//                             {t}
//                         </button>;
//                     })}
//                 </div>
//             </div>
//             <div style={{ display:"flex", gap:10, marginTop:4 }}>
//                 <button type="button" onClick={() => setView("list")}
//                     style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                     Cancel
//                 </button>
//                 <button type="submit" disabled={loading || !form.metadata_name}
//                     style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                         display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                         background:"linear-gradient(135deg,#ca8a04,#d97706)",
//                         boxShadow:"0 4px 16px rgba(202,138,4,.3)",
//                         cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
//                     {loading ? <><Spin /> Saving…</> : <><Save size={14} /> {submitLabel}</>}
//                 </button>
//             </div>
//         </form>
//     );

//     const headerTitle = view === "list" ? "Metadata" : view === "create" ? "Add Metadata Field" : view === "edit" ? "Edit Metadata" : "Delete Metadata";

//     return (
//         <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
//             <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:560, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"90vh", overflowY:"auto" }}>

//                 {/* Header */}
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
//                     <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                         <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#fef3c7,#fde68a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                             <Database size={18} color="#ca8a04" />
//                         </div>
//                         <div>
//                             <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>{headerTitle}</h2>
//                             <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{service.name}</p>
//                         </div>
//                     </div>
//                     <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}><X size={14} color="#64748b" /></button>
//                 </div>

//                 {/* LIST */}
//                 {view === "list" && (
//                     <>
//                         {isLoading ? (
//                             <div style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontSize:13 }}>Loading…</div>
//                         ) : metadata.length === 0 ? (
//                             <div style={{ textAlign:"center", padding:"32px 16px" }}>
//                                 <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#fef3c7,#fde68a)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
//                                     <Database size={30} color="#ca8a04" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 6px" }}>No Metadata Yet</p>
//                                 <p style={{ fontSize:13, color:"#64748b", margin:"0 0 22px", lineHeight:1.5 }}>No custom fields defined.<br/>Add one to enhance this service.</p>
//                                 <button onClick={() => setView("create")}
//                                     style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#ca8a04,#d97706)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:"0 4px 16px rgba(202,138,4,.3)", display:"inline-flex", alignItems:"center", gap:7 }}>
//                                     <Plus size={15} /> Add Metadata Field
//                                 </button>
//                             </div>
//                         ) : (
//                             <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
//                                 {metadata.map(m => {
//                                     const tc = META_TYPE_COLORS[m.metadata_value_type] || META_TYPE_COLORS.text;
//                                     return (
//                                         <div key={m.id} style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:"14px 16px", background:"#fafbff", display:"flex", alignItems:"center", gap:12 }}>
//                                             <div style={{ flex:1, minWidth:0 }}>
//                                                 <span style={{ display:"inline-block", background:tc.bg, color:tc.color, fontSize:10, fontWeight:800, borderRadius:7, padding:"2px 9px", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" }}>
//                                                     {m.metadata_value_type}
//                                                 </span>
//                                                 <p style={{ fontSize:14, fontWeight:700, color:"#0f172a", margin:0 }}>{m.metadata_name}</p>
//                                             </div>
//                                             <div style={{ display:"flex", gap:6, flexShrink:0 }}>
//                                                 <button onClick={() => openEdit(m)}
//                                                     style={{ padding:"6px 10px", borderRadius:9, border:"1.5px solid #fde68a", background:"#fef9c3", color:"#ca8a04", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
//                                                     <Edit2 size={12} /> Edit
//                                                 </button>
//                                                 <button onClick={() => openDelete(m)}
//                                                     style={{ padding:"6px 8px", borderRadius:9, border:"1.5px solid #fee2e2", background:"#fff5f5", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center" }}>
//                                                     <Trash2 size={13} />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {/* CREATE */}
//                 {view === "create" && (
//                     <>
//                         <BackBtn />
//                         {success ? (
//                             <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
//                                 <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#ca8a04,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 24px rgba(202,138,4,.3)" }}>
//                                     <Check size={30} color="#fff" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Field Added!</p>
//                                 <p style={{ fontSize:12, color:"#64748b" }}>"{form.metadata_name}" has been created.</p>
//                             </div>
//                         ) : <MetaForm onSubmit={handleCreate} submitLabel="Add Field" />}
//                     </>
//                 )}

//                 {/* EDIT */}
//                 {view === "edit" && (
//                     <>
//                         <BackBtn />
//                         {success ? (
//                             <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
//                                 <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
//                                     <Check size={30} color="#fff" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Updated!</p>
//                                 <p style={{ fontSize:12, color:"#64748b" }}>"{form.metadata_name}" saved.</p>
//                             </div>
//                         ) : <MetaForm onSubmit={handleUpdate} submitLabel="Save Changes" />}
//                     </>
//                 )}

//                 {/* DELETE */}
//                 {view === "delete" && selected && (
//                     <>
//                         <BackBtn />
//                         <div style={{ background:"#fff5f5", borderRadius:14, border:"1.5px solid #fee2e2", padding:16, marginBottom:16, display:"flex", gap:12, alignItems:"flex-start" }}>
//                             <AlertTriangle size={20} color="#ef4444" style={{ flexShrink:0, marginTop:1 }} />
//                             <div>
//                                 <p style={{ fontSize:13, fontWeight:800, color:"#dc2626", margin:"0 0 4px" }}>Delete this metadata field?</p>
//                                 <p style={{ fontSize:12, color:"#64748b", margin:0 }}>This action cannot be undone.</p>
//                             </div>
//                         </div>
//                         <div style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:14, background:"#fafbff", marginBottom:18 }}>
//                             <span style={{ display:"inline-block", background:"#fef9c3", color:"#ca8a04", fontSize:10, fontWeight:800, borderRadius:7, padding:"2px 9px", marginBottom:6, textTransform:"uppercase" }}>
//                                 {selected.metadata_value_type}
//                             </span>
//                             <p style={{ fontSize:14, fontWeight:700, color:"#0f172a", margin:0 }}>{selected.metadata_name}</p>
//                         </div>
//                         <div style={{ display:"flex", gap:10 }}>
//                             <button onClick={() => setView("list")}
//                                 style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                                 Cancel
//                             </button>
//                             <button onClick={handleDelete} disabled={loading}
//                                 style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                                     display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                                     background:"linear-gradient(135deg,#dc2626,#ef4444)",
//                                     boxShadow:"0 4px 16px rgba(239,68,68,.3)",
//                                     cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
//                                 {loading ? <><span style={{ width:15, height:15, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
//                             </button>
//                         </div>
//                     </>
//                 )}

//             </div>
//         </div>
//     );
// };

// /* ─── Zone Form (defined OUTSIDE ViewZoneModal to prevent remount on every keystroke) ── */
// const ZoneForm = ({ form, setForm, staffList, onSubmit, onCancel, loading, submitLabel }) => (
//     <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>
//         {[
//             { name:"zone_name",   label:"Zone Name *",        type:"text",   extra:{ required:true, placeholder:"e.g. Morning Slot, VIP Zone" } },
//             { name:"zone_description", label:"Description",  type:"text",   extra:{ placeholder:"Optional" } },
//         ].map(({ name, label, type, extra }) => (
//             <div key={name}>
//                 <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>{label}</label>
//                 <input type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} {...extra}
//                     style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }} />
//             </div>
//         ))}
//         <div>
//             <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>Staff in Charge *</label>
//             <select value={form.staff_in_charge} onChange={e => setForm(f => ({ ...f, staff_in_charge: e.target.value }))} required
//                 style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", background:"#f8fafc" }}>
//                 <option value="">Select Staff Member</option>
//                 {staffList.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
//             </select>
//         </div>
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
//             {[
//                 { name:"start_time",            label:"Start Time",          type:"time",   extra:{} },
//                 { name:"end_time",              label:"End Time",            type:"time",   extra:{} },
//                 { name:"no_of_slots",           label:"No. of Slots",        type:"number", extra:{ placeholder:"e.g. 10" } },
//                 { name:"each_slot_time",        label:"Slot Duration (min)", type:"number", extra:{ placeholder:"e.g. 30" } },
//                 { name:"activation_start_date", label:"Activation Date *",   type:"date",   extra:{ required:true } },
//                 { name:"expiry_date",           label:"Expiry Date",         type:"date",   extra:{ min: form.activation_start_date || undefined } },
//             ].map(({ name, label, type, extra }) => (
//                 <div key={name}>
//                     <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>{label}</label>
//                     <input type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} {...extra}
//                         style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }} />
//                 </div>
//             ))}
//         </div>
//         <div style={{ display:"flex", gap:10, marginTop:4 }}>
//             <button type="button" onClick={onCancel}
//                 style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                 Cancel
//             </button>
//             <button type="submit" disabled={loading}
//                 style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                     display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                     background:"linear-gradient(135deg,#2563eb,#4f46e5)",
//                     boxShadow:"0 4px 16px rgba(37,99,235,.3)",
//                     cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
//                 {loading
//                     ? <><span style={{ width:15, height:15, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} /> Saving…</>
//                     : <><Save size={14} /> {submitLabel}</>}
//             </button>
//         </div>
//     </form>
// );

// /* ─── View Zone Modal ─────────────────────────────────────────────────── */
// const ViewZoneModal = ({ service, onClose }) => {
//     const { data: zonesResponse, isLoading, refetch } = useGetAllServiceZonesQuery(undefined, { refetchOnMountOrArgChange: true });
//     const allZones = zonesResponse?.data || zonesResponse || [];
//     const zones = useMemo(() => allZones.filter(z => String(z.service_id) === String(service.id)), [allZones, service.id]);

//     const { data: staffListRaw = [] } = useGetAllStaffsQuery();
//     const staffList = Array.isArray(staffListRaw) ? staffListRaw : staffListRaw?.data || [];

//     const [createZone] = useCreateServiceZoneMutation();
//     const [updateZone] = useUpdateServiceZoneMutation();
//     const [deleteZone] = useDeleteServiceZoneMutation();

//     const [view, setView]         = useState("list");
//     const [selected, setSelected] = useState(null);
//     const [loading, setLoading]   = useState(false);
//     const [success, setSuccess]   = useState(false);

//     const emptyForm = { zone_name:"", zone_description:"", staff_in_charge:"", start_time:"", end_time:"", no_of_slots:"", each_slot_time:"", activation_start_date:"", expiry_date:"" };
//     const [form, setForm] = useState(emptyForm);

//     const BackBtn = () => (
//         <button onClick={() => { setView("list"); setSuccess(false); setSelected(null); setForm(emptyForm); }}
//             style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#2563eb", background:"#eff6ff", border:"none", borderRadius:9, padding:"5px 12px", cursor:"pointer", marginBottom:16 }}>
//             <ChevronLeft size={14} /> Back
//         </button>
//     );

//     const openEdit = (z) => {
//         setSelected(z);
//         setForm({ zone_name: z.zone_name||"", zone_description: z.zone_description||"", staff_in_charge: z.staff_in_charge||"", start_time: z.start_time||"", end_time: z.end_time||"", no_of_slots: z.no_of_slots||"", each_slot_time: z.each_slot_time||"", activation_start_date: z.activation_start_date?.split("T")[0]||"", expiry_date: z.expiry_date?.split("T")[0]||"" });
//         setView("edit");
//     };
//     const openDelete = (z) => { setSelected(z); setView("delete"); };

//     const getStaffName = (id) => { const s = staffList.find(st => st.id === Number(id)); return s ? `${s.first_name} ${s.last_name}` : `Staff #${id}`; };
//     const fmtTime = (t) => { if (!t) return null; const [h,m] = t.split(":"), hr = Number(h); return `${hr%12||12}:${m} ${hr>=12?"PM":"AM"}`; };
//     const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : null;

//     const handleCreate = async (e) => {
//         e.preventDefault(); setLoading(true);
//         try {
//             await createZone({ ...form, service_id: Number(service.id), no_of_slots: form.no_of_slots ? Number(form.no_of_slots) : null, each_slot_time: form.each_slot_time ? Number(form.each_slot_time) : null, staff_in_charge: Number(form.staff_in_charge) }).unwrap();
//             setSuccess(true); refetch();
//             setTimeout(() => { setSuccess(false); setView("list"); setForm(emptyForm); }, 1800);
//         } catch(err) { alert(err?.data?.message || "Failed to create zone"); }
//         finally { setLoading(false); }
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault(); setLoading(true);
//         try {
//             await updateZone({ id: selected.id, data: { ...form, no_of_slots: form.no_of_slots ? Number(form.no_of_slots) : null, each_slot_time: form.each_slot_time ? Number(form.each_slot_time) : null, staff_in_charge: Number(form.staff_in_charge) } }).unwrap();
//             setSuccess(true); refetch();
//             setTimeout(() => { setSuccess(false); setView("list"); setSelected(null); }, 1800);
//         } catch(err) { alert(err?.data?.message || "Failed to update zone"); }
//         finally { setLoading(false); }
//     };

//     const handleDelete = async () => {
//         setLoading(true);
//         try {
//             await deleteZone(selected.id).unwrap(); refetch();
//             setTimeout(() => { setView("list"); setSelected(null); setLoading(false); }, 1400);
//         } catch(err) { alert(err?.data?.message || "Failed to delete zone"); setLoading(false); }
//     };

//     const headerTitle = view === "list" ? "Service Zones" : view === "create" ? "Add Zone" : view === "edit" ? "Edit Zone" : "Delete Zone";

//     return (
//         <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
//             <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:600, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"92vh", overflowY:"auto" }}>

//                 {/* Header */}
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
//                     <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                         <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                             <MapPin size={18} color="#2563eb" />
//                         </div>
//                         <div>
//                             <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>{headerTitle}</h2>
//                             <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{service.name}</p>
//                         </div>
//                     </div>
//                     <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}><X size={14} color="#64748b" /></button>
//                 </div>

//                 {/* LIST */}
//                 {view === "list" && (
//                     <>
//                         {isLoading ? (
//                             <div style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontSize:13 }}>Loading…</div>
//                         ) : zones.length === 0 ? (
//                             <div style={{ textAlign:"center", padding:"32px 16px" }}>
//                                 <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
//                                     <MapPin size={30} color="#2563eb" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 6px" }}>No Zones Yet</p>
//                                 <p style={{ fontSize:13, color:"#64748b", margin:"0 0 22px", lineHeight:1.5 }}>No zones configured for this service.<br/>Add one to manage time slots and staff.</p>
//                                 <button onClick={() => setView("create")}
//                                     style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#2563eb,#4f46e5)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,.3)", display:"inline-flex", alignItems:"center", gap:7 }}>
//                                     <Plus size={15} /> Add Zone
//                                 </button>
//                             </div>
//                         ) : (
//                             <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
//                                 {zones.map(z => (
//                                     <div key={z.id} style={{ borderRadius:14, border:"1.5px solid #e0e7ff", padding:"14px 16px", background:"#f8faff" }}>
//                                         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
//                                             <div style={{ flex:1, minWidth:0 }}>
//                                                 <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
//                                                     <p style={{ fontSize:14, fontWeight:800, color:"#1e3a8a", margin:0 }}>{z.zone_name}</p>
//                                                     {z.no_of_slots && <span style={{ fontSize:11, background:"#dbeafe", color:"#2563eb", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>{z.no_of_slots} slots</span>}
//                                                     {z.each_slot_time && <span style={{ fontSize:11, background:"#ede9fe", color:"#7c3aed", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>{z.each_slot_time}min</span>}
//                                                 </div>
//                                                 <div style={{ display:"flex", flexWrap:"wrap", gap:10, fontSize:12, color:"#64748b" }}>
//                                                     {z.staff_in_charge && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Users size={11} /> {getStaffName(z.staff_in_charge)}</span>}
//                                                     {z.start_time && z.end_time && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={11} /> {fmtTime(z.start_time)} – {fmtTime(z.end_time)}</span>}
//                                                     {z.activation_start_date && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Calendar size={11} /> {fmtDate(z.activation_start_date)}{z.expiry_date ? ` → ${fmtDate(z.expiry_date)}` : ""}</span>}
//                                                 </div>
//                                                 {z.zone_description && <p style={{ fontSize:12, color:"#94a3b8", margin:"5px 0 0", fontStyle:"italic" }}>{z.zone_description}</p>}
//                                             </div>
//                                             <div style={{ display:"flex", gap:6, flexShrink:0 }}>
//                                                 <button onClick={() => openEdit(z)}
//                                                     style={{ padding:"6px 10px", borderRadius:9, border:"1.5px solid #bfdbfe", background:"#eff6ff", color:"#2563eb", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
//                                                     <Edit2 size={12} /> Edit
//                                                 </button>
//                                                 <button onClick={() => openDelete(z)}
//                                                     style={{ padding:"6px 8px", borderRadius:9, border:"1.5px solid #fee2e2", background:"#fff5f5", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center" }}>
//                                                     <Trash2 size={13} />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <button onClick={() => setView("create")}
//                                     style={{ width:"100%", padding:"10px 0", borderRadius:13, border:"1.5px dashed #bfdbfe", background:"#eff6ff", fontSize:13, fontWeight:700, color:"#2563eb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:4 }}>
//                                     <Plus size={14} /> Add Zone
//                                 </button>
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {/* CREATE */}
//                 {view === "create" && (
//                     <>
//                         <BackBtn />
//                         {success ? (
//                             <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
//                                 <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#2563eb,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 24px rgba(37,99,235,.3)" }}>
//                                     <Check size={30} color="#fff" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Zone Created!</p>
//                                 <p style={{ fontSize:12, color:"#64748b" }}>"{form.zone_name}" has been added.</p>
//                             </div>
//                         ) : <ZoneForm form={form} setForm={setForm} staffList={staffList} onSubmit={handleCreate} onCancel={() => { setView("list"); setForm(emptyForm); }} loading={loading} submitLabel="Create Zone" />}
//                     </>
//                 )}

//                 {/* EDIT */}
//                 {view === "edit" && (
//                     <>
//                         <BackBtn />
//                         {success ? (
//                             <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
//                                 <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
//                                     <Check size={30} color="#fff" />
//                                 </div>
//                                 <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Zone Updated!</p>
//                                 <p style={{ fontSize:12, color:"#64748b" }}>Changes saved for "{form.zone_name}".</p>
//                             </div>
//                         ) : <ZoneForm form={form} setForm={setForm} staffList={staffList} onSubmit={handleUpdate} onCancel={() => { setView("list"); setSelected(null); setForm(emptyForm); }} loading={loading} submitLabel="Save Changes" />}
//                     </>
//                 )}

//                 {/* DELETE */}
//                 {view === "delete" && selected && (
//                     <>
//                         <BackBtn />
//                         <div style={{ background:"#fff5f5", borderRadius:14, border:"1.5px solid #fee2e2", padding:16, marginBottom:16, display:"flex", gap:12, alignItems:"flex-start" }}>
//                             <AlertTriangle size={20} color="#ef4444" style={{ flexShrink:0, marginTop:1 }} />
//                             <div>
//                                 <p style={{ fontSize:13, fontWeight:800, color:"#dc2626", margin:"0 0 4px" }}>Delete this zone?</p>
//                                 <p style={{ fontSize:12, color:"#64748b", margin:0 }}>This action cannot be undone.</p>
//                             </div>
//                         </div>
//                         <div style={{ borderRadius:14, border:"1.5px solid #e0e7ff", padding:14, background:"#f8faff", marginBottom:18 }}>
//                             <p style={{ fontSize:14, fontWeight:800, color:"#1e3a8a", margin:"0 0 6px" }}>{selected.zone_name}</p>
//                             <div style={{ display:"flex", flexWrap:"wrap", gap:10, fontSize:12, color:"#64748b" }}>
//                                 {selected.staff_in_charge && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Users size={11} /> {getStaffName(selected.staff_in_charge)}</span>}
//                                 {selected.start_time && selected.end_time && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={11} /> {fmtTime(selected.start_time)} – {fmtTime(selected.end_time)}</span>}
//                             </div>
//                         </div>
//                         <div style={{ display:"flex", gap:10 }}>
//                             <button onClick={() => setView("list")}
//                                 style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
//                                 Cancel
//                             </button>
//                             <button onClick={handleDelete} disabled={loading}
//                                 style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
//                                     display:"flex", alignItems:"center", justifyContent:"center", gap:7,
//                                     background:"linear-gradient(135deg,#dc2626,#ef4444)",
//                                     boxShadow:"0 4px 16px rgba(239,68,68,.3)",
//                                     cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
//                                 {loading ? <><span style={{ width:15, height:15, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
//                             </button>
//                         </div>
//                     </>
//                 )}

//             </div>
//         </div>
//     );
// };

// /* ─── Edit Service Modal ─────────────────────────────────────────────────── */
// const EditServiceModal = ({ service, categories, onClose, onSuccess }) => {
//     const [formData, setFormData] = useState({
//         name: service.name || "",
//         description: service.description || "",
//         category_id: service.category_id || "",
//         pre_payment_required: service.pre_payment_required || false,
//     });
//     const [updateService, { isLoading }] = useUpdateServiceMutation();
//     const [success, setSuccess] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await updateService({ id: service.id, data: formData }).unwrap();
//             setSuccess(true);
//             onSuccess?.();
//             setTimeout(onClose, 1500);
//         } catch (err) { alert(err?.data?.message || "Failed to update service"); }
//     };

//     const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

//     return (
//         <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
//             <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:620, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"90vh", overflowY:"auto" }}>
//                 {!success ? (
//                     <>
//                         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
//                             <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                                 <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                                     <Pencil size={18} color="#16a34a" />
//                                 </div>
//                                 <div>
//                                     <h2 style={{ fontSize:18, fontWeight:800, color:"#0f172a", margin:0 }}>Edit Service</h2>
//                                     <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Update service details</p>
//                                 </div>
//                             </div>
//                             <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc" }}><X size={14} color="#64748b" /></button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div style={{ display:"grid", gap:16, marginBottom:20 }}>
//                                 <div>
//                                     <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#475569", marginBottom:8 }}>Service Name *</label>
//                                     <input type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} required className="sm-input"
//                                         style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#475569", marginBottom:8 }}>Description *</label>
//                                     <textarea value={formData.description} onChange={e => handleChange("description", e.target.value)} required rows={4} className="sm-input"
//                                         style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, color:"#1e293b", background:"#fff", fontFamily:"inherit", resize:"vertical" }} />
//                                 </div>
//                                 <div>
//                                     <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#475569", marginBottom:8 }}>Category *</label>
//                                     <select value={formData.category_id} onChange={e => handleChange("category_id", e.target.value)} required className="sm-input"
//                                         style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, color:"#1e293b", background:"#fff", fontFamily:"inherit", appearance:"none" }}>
//                                         <option value="">Select Category</option>
//                                         {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                                     </select>
//                                 </div>
//                                 <div onClick={() => handleChange("pre_payment_required", !formData.pre_payment_required)}
//                                     style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"13px 16px", borderRadius:14, cursor:"pointer", userSelect:"none", border:`2px solid ${formData.pre_payment_required ? "#fdba74" : "#e2e8f0"}`, background: formData.pre_payment_required ? "#fff7ed" : "#f8fafc", transition:"all .18s" }}>
//                                     <div>
//                                         <p style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>Require Pre-payment</p>
//                                         <p style={{ fontSize:11, color:"#64748b", marginTop:3 }}>Customers must pay before confirmation</p>
//                                     </div>
//                                     <div style={{ position:"relative", width:44, height:24, borderRadius:999, flexShrink:0, background: formData.pre_payment_required ? "#f97316" : "#cbd5e1", transition:"background .2s" }}>
//                                         <div style={{ position:"absolute", top:3, left:3, width:18, height:18, background:"#fff", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,.18)", transition:"transform .2s", transform: formData.pre_payment_required ? "translateX(20px)" : "translateX(0)" }} />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div style={{ display:"flex", gap:10 }}>
//                                 <button type="button" onClick={onClose} style={{ flex:1, padding:12, borderRadius:13, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit" }}>Cancel</button>
//                                 <button type="submit" disabled={isLoading}
//                                     style={{ flex:1, padding:12, borderRadius:13, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:"linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow:"0 4px 16px rgba(37,99,235,.32)" }}>
//                                     {isLoading ? <><Spin /> Saving...</> : <><Save size={14} /> Save Changes</>}
//                                 </button>
//                             </div>
//                         </form>
//                     </>
//                 ) : (
//                     <div style={{ textAlign:"center", padding:"16px 0" }}>
//                         <div className="sm-pop" style={{ width:62, height:62, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)", boxShadow:"0 6px 24px rgba(34,197,94,.35)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
//                             <Check size={28} color="#fff" />
//                         </div>
//                         <p style={{ fontWeight:800, fontSize:15, color:"#0f172a", marginBottom:5 }}>Updated!</p>
//                         <p style={{ fontSize:13, color:"#94a3b8" }}>Service updated successfully.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// /* ─── Create Service Modal ───────────────────────────────────────────────── */
// const CreateServiceModal = ({ categoryId, categoryName, onClose, onCreated }) => {
//     const [createService, { isLoading }] = useCreateServiceMutation();
//     const [success, setSuccess] = useState(false);
//     const [createdName, setCreatedName] = useState("");
//     const [form, setForm] = useState({ name: "", description: "", pre_payment_required: false });
//     const nameRef = useRef(null);
//     useEffect(() => { setTimeout(() => nameRef.current?.focus(), 120); }, []);

//     const handleChange = e => {
//         const { name, value, type, checked } = e.target;
//         setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//     };

//     const handleSubmit = async e => {
//         e.preventDefault();
//         try {
//             await createService({ ...form, category_id: Number(categoryId) }).unwrap();
//             setCreatedName(form.name);
//             setSuccess(true);
//             onCreated?.();
//             setTimeout(onClose, 2200);
//         } catch (err) { alert(err?.data?.message || "Failed to create service"); }
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay" style={{ background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)" }}>
//             <div className="modal-card bg-white rounded-3xl w-full max-w-lg overflow-hidden" style={{ boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
//                 <div style={{ background:"linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)", padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//                     <div style={{ display:"flex", alignItems:"center", gap:11 }}>
//                         <div style={{ width:38, height:38, borderRadius:12, background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                             <Save size={17} color="#fff" />
//                         </div>
//                         <div>
//                             <p style={{ color:"#fff", fontWeight:800, fontSize:14, margin:0 }}>Create New Service</p>
//                             <p style={{ color:"rgba(255,255,255,.65)", fontSize:11, marginTop:2, marginBottom:0 }}>
//                                 Adding to <strong style={{ color:"rgba(255,255,255,.9)" }}>{categoryName}</strong>
//                             </p>
//                         </div>
//                     </div>
//                     <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, background:"rgba(255,255,255,.16)", border:"1px solid rgba(255,255,255,.28)", display:"flex", alignItems:"center", justifyContent:"center" }}>
//                         <X size={14} color="#fff" />
//                     </button>
//                 </div>
//                 <div style={{ padding:"22px 24px 24px" }}>
//                     {!success ? (
//                         <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
//                             <div>
//                                 <label style={{ display:"block", fontSize:10, fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>
//                                     Service Name <span style={{ color:"#ef4444" }}>*</span>
//                                 </label>
//                                 <input ref={nameRef} type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Premium Haircut, Deep Cleaning" className="sm-input"
//                                     style={{ width:"100%", padding:"11px 14px", fontSize:13, fontWeight:500, border:"1.5px solid #e2e8f0", borderRadius:13, background:"#fff", color:"#1e293b", fontFamily:"inherit" }} />
//                             </div>
//                             <div>
//                                 <label style={{ display:"block", fontSize:10, fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>
//                                     Description <span style={{ color:"#ef4444" }}>*</span>
//                                 </label>
//                                 <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="What does this service include?" className="sm-input"
//                                     style={{ width:"100%", padding:"11px 14px", fontSize:13, fontWeight:500, border:"1.5px solid #e2e8f0", borderRadius:13, background:"#fff", color:"#1e293b", fontFamily:"inherit", resize:"none", lineHeight:1.6 }} />
//                                 <p style={{ fontSize:11, color:"#94a3b8", marginTop:5, fontWeight:500 }}>{form.description.length} characters</p>
//                             </div>
//                             <div onClick={() => setForm(prev => ({ ...prev, pre_payment_required: !prev.pre_payment_required }))}
//                                 style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"13px 16px", borderRadius:14, cursor:"pointer", userSelect:"none", border:`2px solid ${form.pre_payment_required ? "#fdba74" : "#e2e8f0"}`, background: form.pre_payment_required ? "#fff7ed" : "#f8fafc", transition:"all .18s" }}>
//                                 <div>
//                                     <p style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>Require Pre-payment</p>
//                                     <p style={{ fontSize:11, color:"#64748b", marginTop:3 }}>Customers must pay before the service is confirmed</p>
//                                 </div>
//                                 <div style={{ position:"relative", width:44, height:24, borderRadius:999, flexShrink:0, background: form.pre_payment_required ? "#f97316" : "#cbd5e1", transition:"background .2s" }}>
//                                     <div style={{ position:"absolute", top:3, left:3, width:18, height:18, background:"#fff", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,.18)", transition:"transform .2s", transform: form.pre_payment_required ? "translateX(20px)" : "translateX(0)" }} />
//                                 </div>
//                             </div>
//                             <div style={{ height:1, background:"linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} />
//                             <div style={{ display:"flex", gap:10 }}>
//                                 <button type="button" onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:14, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>Cancel</button>
//                                 <button type="submit" disabled={isLoading || !form.name.trim()}
//                                     style={{ flex:1, padding:"12px", borderRadius:14, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow:"0 4px 16px rgba(37,99,235,.32)", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1 }}>
//                                     {isLoading ? <><Spin /> Creating…</> : <><Save size={14} /> Create Service</>}
//                                 </button>
//                             </div>
//                         </form>
//                     ) : (
//                         <div style={{ textAlign:"center", padding:"20px 0 8px" }}>
//                             <div className="sm-pop" style={{ width:62, height:62, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)", boxShadow:"0 6px 24px rgba(34,197,94,.35)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
//                                 <Check size={28} color="#fff" />
//                             </div>
//                             <p style={{ fontWeight:800, fontSize:15, color:"#0f172a", marginBottom:5 }}>Service Created!</p>
//                             <p style={{ fontSize:13, color:"#64748b" }}><strong style={{ color:"#0f172a" }}>{createdName}</strong> has been added successfully.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// /* ═══════════════════════════════════════════════════════════════════════════
//    MAIN PAGE
//    ═══════════════════════════════════════════════════════════════════════════ */
// const CategoryServicesPage = () => {
//     const { categoryId } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const categoryName = location.state?.categoryName || "Category";

//     const [searchTerm, setSearchTerm]             = useState("");
//     const [showDeleteModal, setShowDeleteModal]     = useState(false);
//     const [selectedService, setSelectedService]     = useState(null);
//     const [deleteSuccess, setDeleteSuccess]         = useState(false);
//     const [sort, setSort]                           = useState({ key: null, dir: "asc" });
//     const [showDisableModal, setShowDisableModal]   = useState(false);
//     const [disableReason, setDisableReason]         = useState("");
//     const [serviceToDisable, setServiceToDisable]   = useState(null);
//     const [showCreateModal, setShowCreateModal]     = useState(false);
//     const [showPriceModal, setShowPriceModal]       = useState(false);
//     const [showDescriptionModal, setShowDescriptionModal] = useState(false);
//     const [showMetadataModal, setShowMetadataModal] = useState(false);
//     const [showZoneModal, setShowZoneModal]         = useState(false);
//     const [showEditModal, setShowEditModal]         = useState(false);

//     const { data: response, isLoading, error, refetch } = useGetServicesByBusinessQuery();
//     const allServices = response || [];
//     const businessId = localStorage.getItem("business_id");
//     const { data: pricesResponse, refetch: refetchPrices } = useGetPricesByBusinessQuery(businessId);
//     const allPrices = pricesResponse?.data || pricesResponse || [];
//     const { data: categoriesResp } = useGetAllServiceCategoriesQuery();
//     const categories = useMemo(() => {
//         const raw = categoriesResp?.data || categoriesResp || [];
//         return Array.isArray(raw) ? raw : [];
//     }, [categoriesResp]);

//     const categoryServices = useMemo(
//         () => allServices.filter(s => s.category_id === Number(categoryId)),
//         [allServices, categoryId]
//     );

//     const getServiceTotal = (service) => {
//         const matched = Array.isArray(allPrices) ? allPrices.filter(p => p.service_id === service.id) : [];
//         if (matched.length > 0) return matched.reduce((sum, p) => sum + (Number(p.total_price) || Number(p.price) || 0), 0);
//         return Number(service.total_price) || Number(service.price) || 0;
//     };

//     const activeCount = useMemo(
//         () => categoryServices.filter(s => { const st = s.status?.toLowerCase(); return !st || st === "active"; }).length,
//         [categoryServices]
//     );

//     const totalPrice = useMemo(
//         () => categoryServices.reduce((sum, s) => sum + getServiceTotal(s), 0),
//         [categoryServices, allPrices]
//     );

//     const filteredServices = useMemo(() => {
//         let list = categoryServices;
//         if (searchTerm.trim()) {
//             const q = searchTerm.toLowerCase();
//             list = list.filter(s => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
//         }
//         if (sort.key) {
//             list = [...list].sort((a, b) => {
//                 const av = a[sort.key] ?? ""; const bv = b[sort.key] ?? "";
//                 return sort.dir === "asc" ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
//             });
//         }
//         return list;
//     }, [searchTerm, categoryServices, sort]);

//     const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
//     const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

//     const toggleSort = key => setSort(p => p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });

//     const handleOpenDelete  = s => { setSelectedService(s); setDeleteSuccess(false); setShowDeleteModal(true); };
//     const handleCloseDelete = ()  => { setShowDeleteModal(false); setSelectedService(null); setDeleteSuccess(false); };
//     const handleDeleteSubmit = async () => {
//         try { await deleteService(selectedService.id).unwrap(); setDeleteSuccess(true); setTimeout(handleCloseDelete, 1500); }
//         catch (err) { alert(err?.data?.message || "Failed to delete service"); }
//     };

//     const handleToggleService = async (service) => {
//         if (service.status?.toLowerCase() === "active") { setServiceToDisable(service); setShowDisableModal(true); }
//         else {
//             try { await updateService({ id: service.id, data: { status: "active", disable_reason: null } }).unwrap(); }
//             catch { alert("Failed to enable service"); }
//         }
//     };

//     const handleDisableConfirm = async () => {
//         if (!disableReason.trim()) { alert("Please provide a reason"); return; }
//         try {
//             await updateService({ id: serviceToDisable.id, data: { status: "inactive", disable_reason: disableReason } }).unwrap();
//             setShowDisableModal(false); setDisableReason(""); setServiceToDisable(null);
//         } catch { alert("Failed to disable service"); }
//     };

//     const handleBackToCategories = () => navigate('/dashboard', { state: { activeMenu: 'Services Management' } });
//     const closeDisableModal = () => { setShowDisableModal(false); setDisableReason(""); setServiceToDisable(null); };

//     const handleViewPrice       = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowPriceModal(true); };
//     const handleViewDescription = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowDescriptionModal(true); };
//     const handleViewMetadata    = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowMetadataModal(true); };
//     const handleViewZone        = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowZoneModal(true); };
//     const handleEditService     = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowEditModal(true); };

//     const Th = ({ label, col, className = "" }) => (
//         <th onClick={() => col && toggleSort(col)}
//             className={`px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest select-none whitespace-nowrap ${col ? "cursor-pointer hover:text-indigo-600 transition-colors" : ""} ${className}`}>
//             {label}{col && <SortIcon active={sort.key === col} dir={sort.dir} />}
//         </th>
//     );

//     if (error) return (
//         <div className="min-h-screen bg-slate-50 p-8 fade-enter">
//             <GlobalStyles />
//             <button onClick={handleBackToCategories} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm font-medium transition-colors group">
//                 <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
//             </button>
//             <div className="text-center py-12"><p className="text-red-500 font-semibold">Error loading services</p></div>
//         </div>
//     );

//     return (
//         <>
//             <GlobalStyles />
//             <div className="min-h-screen" style={{ background:"linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
//                 <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//                     <button onClick={handleBackToCategories}
//                         className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 text-sm font-medium transition-colors group page-enter">
//                         <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Categories
//                     </button>

//                     {/* Header */}
//                     <div className="page-enter rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
//                         style={{ background:"linear-gradient(135deg,#4f46e5,#6366f1 55%,#818cf8)", boxShadow:"0 12px 40px rgba(79,70,229,.28)" }}>
//                         <div>
//                             <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Services</p>
//                             <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{categoryName}</h1>
//                             <p className="text-indigo-200 text-sm mt-1">
//                                 {categoryServices.length} service{categoryServices.length !== 1 ? "s" : ""}&nbsp;·&nbsp;
//                                 Total value: <span className="text-white font-bold">₹{totalPrice.toLocaleString()}</span>
//                             </p>
//                         </div>
//                         <div className="flex items-center gap-3 flex-wrap">
//                             <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ background:"rgba(34,197,94,.22)", backdropFilter:"blur(8px)", border:"1px solid rgba(134,239,172,.35)", minWidth:90 }}>
//                                 <span className="text-2xl font-bold text-white leading-none">{activeCount}</span>
//                                 <span className="text-green-200 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">Active</span>
//                             </div>
//                             <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ background:"rgba(255,255,255,.12)", backdropFilter:"blur(8px)", minWidth:110 }}>
//                                 <span className="text-2xl font-bold text-white leading-none">₹{totalPrice > 0 ? totalPrice.toLocaleString() : "0"}</span>
//                                 <span className="text-indigo-200 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">Total Value</span>
//                             </div>
//                             <button onClick={() => setShowCreateModal(true)} className="create-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-700" style={{ background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,.12)" }}>
//                                 <Plus size={16} /> Create Service
//                             </button>
//                         </div>
//                     </div>

//                     {/* Search */}
//                     <div className="page-enter search-wrap mb-6" style={{ animationDelay:".06s" }}>
//                         <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
//                         <input type="text" placeholder="Search by name or description…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                             className="w-full pl-11 pr-10 py-3.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none transition-all placeholder-slate-400 font-medium"
//                             style={{ boxShadow:"0 2px 12px rgba(0,0,0,.04)" }} />
//                         {searchTerm && (
//                             <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
//                                 <X size={15} />
//                             </button>
//                         )}
//                     </div>

//                     <div className="flex items-center justify-between mb-3 px-1">
//                         <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
//                             {filteredServices.length} result{filteredServices.length !== 1 ? "s" : ""}
//                             {searchTerm && ` for "${searchTerm}"`}
//                         </p>
//                     </div>

//                     {/* Table */}
//                     {isLoading ? (
//                         <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
//                             {[...Array(6)].map((_, i) => (
//                                 <div key={i} className="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
//                                     <div className="shimmer-bg rounded-full w-7 h-7" />
//                                     <div className="shimmer-bg rounded-xl h-12 w-12" />
//                                     <div className="flex-1 space-y-2">
//                                         <div className="shimmer-bg rounded h-3.5 w-40" />
//                                         <div className="shimmer-bg rounded h-3 w-64" />
//                                     </div>
//                                     <div className="shimmer-bg rounded-xl h-8 w-24" />
//                                     <div className="shimmer-bg rounded-full h-7 w-16" />
//                                     <div className="flex gap-2">{[...Array(5)].map((__, j) => <div key={j} className="shimmer-bg rounded-xl h-9 w-9" />)}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : filteredServices.length === 0 ? (
//                         <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 fade-enter" style={{ boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
//                             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)" }}>
//                                 <Package size={28} className="text-indigo-400" />
//                             </div>
//                             <p className="text-slate-700 font-bold text-lg mb-1">{searchTerm ? `No results for "${searchTerm}"` : "No services yet"}</p>
//                             <p className="text-sm text-slate-400 mb-7">{searchTerm ? "Try a different search term" : "Add your first service to get started"}</p>
//                             {!searchTerm && (
//                                 <button onClick={() => setShowCreateModal(true)} className="create-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background:"linear-gradient(135deg,#4f46e5,#6366f1)" }}>
//                                     <Plus size={16} /> Add First Service
//                                 </button>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden page-enter" style={{ animationDelay:".12s", boxShadow:"0 4px 28px rgba(0,0,0,.07)" }}>
//                             <div className="table-scroll overflow-x-auto">
//                                 <table className="w-full text-sm" style={{ borderCollapse:"separate", borderSpacing:0 }}>
//                                     <thead>
//                                         <tr style={{ background:"linear-gradient(90deg,#f8faff,#f1f5fe)" }}>
//                                             <Th label="#" className="w-14 text-center" />
//                                             <Th label="Service" col="name" className="min-w-[190px]" />
//                                             <Th label="Description" col="description" className="col-desc min-w-[220px]" />
//                                             <Th label="Price" col="price" className="w-40" />
//                                             <Th label="Status" col="status" className="col-status w-28" />
//                                             <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-36">Manage</th>
//                                             <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-32">Actions</th>
//                                         </tr>
//                                         <tr><td colSpan={7}><div style={{ height:1, background:"linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} /></td></tr>
//                                     </thead>
//                                     <tbody>
//                                         {filteredServices.map((service, idx) => (
//                                             <tr key={service.id} className="table-row border-b border-slate-50 row-enter" style={{ animationDelay:`${idx * 0.04}s` }}>

//                                                 <td className="px-5 py-5 text-center">
//                                                     <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold" style={{ background:"#eef2ff", color:"#4f46e5" }}>{idx + 1}</span>
//                                                 </td>

//                                                 <td className="px-5 py-5">
//                                                     <div className="flex items-center gap-3">
//                                                         {service.image
//                                                             ? <img src={service.image} alt={service.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100" style={{ boxShadow:"0 2px 8px rgba(0,0,0,.08)" }} />
//                                                             : <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)" }}><Package size={18} className="text-indigo-400" /></div>
//                                                         }
//                                                         <div>
//                                                             <p className="font-semibold text-slate-800 leading-snug line-clamp-1">{service.name}</p>
//                                                             {service.pre_payment_required && (
//                                                                 <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:"#fff7ed", color:"#c2410c" }}>PREPAY</span>
//                                                             )}
//                                                             {service.status?.toLowerCase() === "inactive" && service.disable_reason && (
//                                                                 <p className="text-[10px] text-yellow-600 mt-0.5 line-clamp-1" title={service.disable_reason}>{service.disable_reason}</p>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </td>

//                                                 <td className="px-5 py-5 col-desc">
//                                                     <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 max-w-xs">{service.description || <em>No description</em>}</p>
//                                                 </td>

//                                                 <td className="px-5 py-5">
//                                                     <div className="flex items-center gap-2">
//                                                         <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
//                                                             <DollarSign size={12} style={{ color:"#16a34a" }} />
//                                                             <span className="font-bold text-sm" style={{ color:"#15803d" }}>₹{getServiceTotal(service) > 0 ? getServiceTotal(service).toLocaleString() : "0"}</span>
//                                                         </div>
//                                                         <button data-tip="View Price" onClick={e => handleViewPrice(e, service)} className="icon-btn eye-btn" style={{ background:"#eef2ff", color:"#4f46e5" }}>
//                                                             <Eye size={15} />
//                                                         </button>
//                                                     </div>
//                                                 </td>

//                                                 <td className="px-5 py-5 col-status"><StatusPill status={service.status || "active"} /></td>

//                                                 <td className="px-5 py-5">
//                                                     <div className="flex items-center gap-1.5">
//                                                         <button data-tip="Description" onClick={e => handleViewDescription(e, service)} className="icon-btn desc-btn" style={{ background:"#faf5ff", color:"#9333ea" }}>
//                                                             <FileText size={15} />
//                                                         </button>
//                                                         <button data-tip="Metadata" onClick={e => handleViewMetadata(e, service)} className="icon-btn meta-btn" style={{ background:"#fffbeb", color:"#d97706" }}>
//                                                             <Database size={15} />
//                                                         </button>
//                                                         <button data-tip="Zone" onClick={e => handleViewZone(e, service)} className="icon-btn zone-btn" style={{ background:"#eff6ff", color:"#2563eb" }}>
//                                                             <MapPin size={15} />
//                                                         </button>
//                                                     </div>
//                                                 </td>

//                                                 <td className="px-5 py-5">
//                                                     <div className="flex items-center gap-1.5">
//                                                         <button data-tip={service.status?.toLowerCase() === "active" ? "Disable" : "Enable"}
//                                                             onClick={e => { e.stopPropagation(); handleToggleService(service); }}
//                                                             className={`icon-btn ${service.status?.toLowerCase() === "active" ? "disable-btn" : "enable-btn"}`}
//                                                             style={{ background: service.status?.toLowerCase() === "active" ? "#fffbeb" : "#f0fdf4", color: service.status?.toLowerCase() === "active" ? "#d97706" : "#16a34a" }}>
//                                                             <Power size={15} />
//                                                         </button>
//                                                         <button data-tip="Edit" onClick={e => handleEditService(e, service)} className="icon-btn edit-btn" style={{ background:"#f0fdf4", color:"#16a34a" }}>
//                                                             <Edit2 size={15} />
//                                                         </button>
//                                                         <button data-tip="Delete" onClick={e => { e.stopPropagation(); handleOpenDelete(service); }} className="icon-btn del-btn" style={{ background:"#fef2f2", color:"#dc2626" }}>
//                                                             <Trash2 size={15} />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50" style={{ background:"#f8faff" }}>
//                                 <p className="text-xs text-slate-400 font-medium">
//                                     Showing <span className="font-bold text-slate-600">{filteredServices.length}</span> of <span className="font-bold text-slate-600">{categoryServices.length}</span> services
//                                 </p>
//                                 <p className="text-xs text-slate-400 font-medium hidden sm:block">
//                                     Total value: <span className="font-bold" style={{ color:"#4f46e5" }}>₹{totalPrice.toLocaleString()}</span>
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* ── MODALS ── */}

//             {showPriceModal && selectedService && (
//                 <ViewPriceModal
//                     service={selectedService}
//                     allPrices={allPrices}
//                     onClose={() => { setShowPriceModal(false); setSelectedService(null); }}
//                     onRefetch={() => { refetchPrices(); }}
//                 />
//             )}

//             {showDescriptionModal && selectedService && (
//                 <ViewDescriptionModal service={selectedService} onClose={() => { setShowDescriptionModal(false); setSelectedService(null); }} />
//             )}

//             {showMetadataModal && selectedService && (
//                 <ViewMetadataModal service={selectedService} onClose={() => { setShowMetadataModal(false); setSelectedService(null); }} />
//             )}

//             {showZoneModal && selectedService && (
//                 <ViewZoneModal service={selectedService} onClose={() => { setShowZoneModal(false); setSelectedService(null); }} />
//             )}

//             {showEditModal && selectedService && (
//                 <EditServiceModal
//                     service={selectedService}
//                     categories={categories}
//                     onClose={() => { setShowEditModal(false); setSelectedService(null); }}
//                     onSuccess={() => refetch()}
//                 />
//             )}

//             {showCreateModal && (
//                 <CreateServiceModal
//                     categoryId={categoryId}
//                     categoryName={categoryName}
//                     onClose={() => setShowCreateModal(false)}
//                     onCreated={() => refetch()}
//                 />
//             )}

//             {/* Disable Modal */}
//             {showDisableModal && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay" style={{ background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)" }}>
//                     <div className="bg-white rounded-3xl p-8 w-full max-w-md modal-card" style={{ boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
//                         <div className="flex justify-between items-start mb-5">
//                             <div>
//                                 <h2 className="text-xl font-bold text-slate-900">Disable Service</h2>
//                                 <p className="text-sm text-slate-500 mt-1">{serviceToDisable?.name}</p>
//                             </div>
//                             <button onClick={closeDisableModal} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} className="text-slate-400" /></button>
//                         </div>
//                         <div className="mb-6">
//                             <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Disabling <span className="text-red-500">*</span></label>
//                             <textarea value={disableReason} onChange={e => setDisableReason(e.target.value)}
//                                 placeholder="e.g., Under maintenance, Staff unavailable, Equipment repair..." rows={4}
//                                 className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-none" />
//                             <p className="text-xs text-slate-500 mt-2">This service will not be available for new bookings until re-enabled.</p>
//                         </div>
//                         <div className="flex gap-3">
//                             <button onClick={closeDisableModal} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
//                             <button onClick={handleDisableConfirm} disabled={!disableReason.trim() || isUpdating}
//                                 className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60"
//                                 style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", boxShadow:"0 4px 16px rgba(245,158,11,.35)" }}>
//                                 {isUpdating ? "Disabling..." : "Disable Service"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Service Modal */}
//             {showDeleteModal && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay" style={{ background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)" }}>
//                     <div className="bg-white rounded-3xl p-7 w-full max-w-sm modal-card" style={{ boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
//                         {!deleteSuccess ? (
//                             <>
//                                 <div className="flex justify-between items-start mb-5">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background:"#fef2f2" }}>
//                                             <Trash2 size={18} style={{ color:"#dc2626" }} />
//                                         </div>
//                                         <div>
//                                             <h2 className="text-base font-bold text-slate-900">Delete Service</h2>
//                                             <p className="text-xs text-slate-400">This cannot be undone</p>
//                                         </div>
//                                     </div>
//                                     <button onClick={handleCloseDelete} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"><X size={17} className="text-slate-400" /></button>
//                                 </div>
//                                 <div className="rounded-2xl p-4 mb-6" style={{ background:"#fef2f2", border:"1px solid #fecaca" }}>
//                                     <p className="text-sm text-slate-600">Are you sure you want to delete <span className="font-bold text-slate-900">{selectedService?.name}</span>?</p>
//                                 </div>
//                                 <div className="flex gap-3">
//                                     <button onClick={handleCloseDelete} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
//                                     <button onClick={handleDeleteSubmit} disabled={isDeleting}
//                                         className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60"
//                                         style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", boxShadow:"0 4px 16px rgba(239,68,68,.35)" }}>
//                                         {isDeleting ? "Deleting…" : "Delete"}
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="text-center py-6 fade-enter">
//                                 <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:"linear-gradient(135deg,#dcfce7,#bbf7d0)" }}>
//                                     <Check size={30} style={{ color:"#16a34a" }} />
//                                 </div>
//                                 <h3 className="text-base font-bold text-slate-900 mb-1">Deleted!</h3>
//                                 <p className="text-sm text-slate-400">Service removed successfully.</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default CategoryServicesPage;



















import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    useGetServicesByBusinessQuery,
    useDeleteServiceMutation,
    useGetPricesByBusinessQuery,
    useUpdateServiceMutation,
    useCreateServiceMutation,
    useGetAllServiceCategoriesQuery,
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
    useCreateServiceZoneMutation,
    useUpdateServiceZoneMutation,
    useDeleteServiceZoneMutation,
    useGetAllStaffsQuery,
} from '../../../../app/service/slice';
import {
    ArrowLeft, Plus, Search, Package, X, Check, Eye, Edit2, Trash2,
    FileText, Database, MapPin, ChevronUp, ChevronDown, DollarSign, Power,
    Save, AlertCircle, Pencil, ChevronLeft, Calculator, Tag, AlertTriangle, Clock, Users, Calendar,
} from 'lucide-react';

// ─── Date helpers ─────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

const DATE_SHORTCUTS = [
    { label: 'Today',      fn: () => todayStr() },
    {
        label: 'Tomorrow', fn: () => {
            const d = new Date(); d.setDate(d.getDate() + 1);
            return d.toISOString().split('T')[0];
        }
    },
    {
        label: 'Next Week', fn: () => {
            const d = new Date(); d.setDate(d.getDate() + 7);
            return d.toISOString().split('T')[0];
        }
    },
    {
        label: 'Next Month', fn: () => {
            const d = new Date(); d.setMonth(d.getMonth() + 1);
            return d.toISOString().split('T')[0];
        }
    },
];

const formatActivationLabel = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
};

const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        button, a, [role="button"] { cursor: pointer !important; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes rowSlide { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmer  { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
        @keyframes pulseRing { 0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,.35); } 50% { box-shadow:0 0 0 8px rgba(99,102,241,0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn {
            0%   { transform: scale(0); opacity: 0; }
            60%  { transform: scale(1.18); }
            100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(.96); }
            to   { opacity: 1; transform: scale(1); }
        }
        .page-enter { animation: fadeInUp .45s cubic-bezier(.22,1,.36,1) both; }
        .row-enter  { animation: rowSlide .35s cubic-bezier(.22,1,.36,1) both; }
        .fade-enter { animation: fadeIn .3s ease both; }
        .sm-pop     { animation: popIn .38s cubic-bezier(.22,1,.36,1) both; }
        .sm-modal   { animation: fadeInScale .28s cubic-bezier(.22,1,.36,1) both; }
        .shimmer-bg {
            background: linear-gradient(90deg,#f1f5f9 25%,#e8eef5 50%,#f1f5f9 75%);
            background-size: 400px 100%;
            animation: shimmer 1.4s infinite linear;
        }
        .table-row { transition: background .18s ease; cursor: pointer !important; }
        .table-row:hover { background: linear-gradient(90deg,#f8faff,#f5f7ff) !important; }
        .icon-btn {
            display: inline-flex; align-items: center; justify-content: center;
            border-radius: 10px; padding: 8px;
            transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
            cursor: pointer !important; border: none; outline: none;
        }
        .icon-btn:hover  { transform: translateY(-2px) scale(1.12); }
        .icon-btn:active { transform: scale(.93); }
        .eye-btn:hover     { box-shadow: 0 4px 14px rgba(99,102,241,.3); }
        .desc-btn:hover    { box-shadow: 0 4px 14px rgba(168,85,247,.3); }
        .meta-btn:hover    { box-shadow: 0 4px 14px rgba(245,158,11,.3); }
        .zone-btn:hover    { box-shadow: 0 4px 14px rgba(59,130,246,.3); }
        .edit-btn:hover    { box-shadow: 0 4px 14px rgba(16,185,129,.3); }
        .del-btn:hover     { box-shadow: 0 4px 14px rgba(239,68,68,.3); }
        .disable-btn:hover { box-shadow: 0 4px 14px rgba(245,158,11,.3); }
        .enable-btn:hover  { box-shadow: 0 4px 14px rgba(16,185,129,.3); }
        .create-btn {
            position: relative; overflow: hidden;
            animation: pulseRing 2.8s infinite;
            transition: transform .18s ease, box-shadow .18s ease;
            cursor: pointer !important;
        }
        .create-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,.45); }
        .create-btn:active { transform: scale(.97); }
        .create-btn::after {
            content:''; position:absolute; inset:0;
            background: linear-gradient(135deg,rgba(255,255,255,.18),transparent);
            pointer-events: none;
        }
        .search-wrap { position: relative; }
        .search-wrap input:focus { box-shadow: 0 0 0 3px rgba(99,102,241,.15); border-color: #a5b4fc; }
        .modal-overlay { animation: fadeIn .2s ease both; }
        .modal-card    { animation: fadeInUp .28s cubic-bezier(.22,1,.36,1) both; }
        .status-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }
        .sm-input { outline: none; transition: border-color .18s, box-shadow .18s; }
        .sm-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.16) !important; }
        [data-tip] { position: relative; }
        [data-tip]::after {
            content: attr(data-tip);
            position: absolute; bottom: calc(100% + 7px); left: 50%;
            transform: translateX(-50%) scale(.85);
            background: #1e293b; color: #fff; font-size: 11px; font-weight: 600;
            white-space: nowrap; padding: 4px 9px; border-radius: 7px;
            opacity: 0; pointer-events: none;
            transition: opacity .15s ease, transform .15s ease; z-index: 99;
        }
        [data-tip]:hover::after { opacity: 1; transform: translateX(-50%) scale(1); }
        .table-scroll::-webkit-scrollbar { height: 5px; }
        .table-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .table-scroll::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }
        @media (max-width: 900px) { .col-desc   { display: none; } }
        @media (max-width: 768px) { .col-status { display: none; } }

        /* Date shortcut chips */
        .date-chip {
            padding: 4px 11px; border-radius: 8px; font-size: 11px; font-weight: 700;
            border: 1.5px solid #e2e8f0; background: #fff; color: #475569;
            cursor: pointer; font-family: inherit; transition: all .15s;
        }
        .date-chip:hover { border-color: #93c5fd; background: #eff6ff; color: #2563eb; }
        .date-chip.active { border-color: #2563eb; background: #2563eb; color: #fff; }
    `}</style>
);

const Spin = () => (
    <span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
);

const StatusPill = ({ status }) => {
    const map = {
        active:   { dot:"#22c55e", text:"#15803d", bg:"#f0fdf4", border:"#bbf7d0", label:"Active" },
        pending:  { dot:"#f59e0b", text:"#b45309", bg:"#fffbeb", border:"#fde68a", label:"Pending" },
        inactive: { dot:"#f59e0b", text:"#b45309", bg:"#fffbeb", border:"#fde68a", label:"Disabled" },
        deleted:  { dot:"#ef4444", text:"#dc2626", bg:"#fef2f2", border:"#fecaca", label:"Deleted" },
    };
    const cfg = map[status?.toLowerCase()] || map.active;
    return (
        <span style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.text }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="status-dot" style={{ background:cfg.dot }} />
            {cfg.label}
        </span>
    );
};

const SortIcon = ({ active, dir }) => (
    <span className="inline-flex flex-col ml-1 leading-none">
        <ChevronUp   size={9} style={{ opacity: active && dir==="asc"  ? 1 : .3, color: active ? "#6366f1" : undefined }} />
        <ChevronDown size={9} style={{ opacity: active && dir==="desc" ? 1 : .3, color: active ? "#6366f1" : undefined }} />
    </span>
);

/* ═══════════════════════════════════════════════════════════════════════════
   VIEW PRICE MODAL — full create / edit / delete inline
   ═══════════════════════════════════════════════════════════════════════════ */
const ViewPriceModal = ({ service, onClose, allPrices, onRefetch }) => {

    const existingPrice = useMemo(() => {
        if (!Array.isArray(allPrices)) return null;
        return allPrices.find(p => p.service_id === service.id) || null;
    }, [allPrices, service.id]);

    const [view, setView]       = useState("detail");
    const [actionDone, setActionDone] = useState(false);

    const [createPrice, { isLoading: creating }] = useCreateServicePriceMutation();
    const [updatePrice, { isLoading: updating }] = useUpdateServicePriceMutation();
    const [deletePrice, { isLoading: deleting }] = useDeleteServicePriceMutation();

    const emptyForm = { price: "", sac_code: "", is_gst_applicable: false, cgst_percent: 0, sgst_percent: 0, igst_percent: 0 };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (view === "edit" && existingPrice) {
            setForm({
                price:             existingPrice.price             ?? "",
                sac_code:          existingPrice.sac_code          ?? "",
                is_gst_applicable: existingPrice.is_gst_applicable ?? false,
                cgst_percent:      existingPrice.cgst_percent      ?? 0,
                sgst_percent:      existingPrice.sgst_percent      ?? 0,
                igst_percent:      existingPrice.igst_percent      ?? 0,
            });
        }
        if (view === "create") { setForm(emptyForm); }
        setActionDone(false);
    }, [view]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const calcTotal = () => {
        const base = Number(form.price) || 0;
        if (!form.is_gst_applicable) return base.toFixed(2);
        const tax = base * (Number(form.cgst_percent) + Number(form.sgst_percent) + Number(form.igst_percent)) / 100;
        return (base + tax).toFixed(2);
    };

    const handleCreate = async e => {
        e.preventDefault();
        try {
            await createPrice({
                service_id:        service.id,
                price:             Number(form.price),
                sac_code:          form.sac_code,
                is_gst_applicable: form.is_gst_applicable,
                cgst_percent:      Number(form.cgst_percent),
                sgst_percent:      Number(form.sgst_percent),
                igst_percent:      Number(form.igst_percent),
            }).unwrap();
            setActionDone(true);
            onRefetch?.();
            setTimeout(() => { setActionDone(false); setView("detail"); }, 1800);
        } catch (err) { alert(err?.data?.message || "Failed to create price"); }
    };

    const handleUpdate = async e => {
        e.preventDefault();
        try {
            await updatePrice({
                id:                existingPrice.id,
                price:             Number(form.price),
                sac_code:          form.sac_code,
                is_gst_applicable: form.is_gst_applicable,
                cgst_percent:      Number(form.cgst_percent),
                sgst_percent:      Number(form.sgst_percent),
                igst_percent:      Number(form.igst_percent),
            }).unwrap();
            setActionDone(true);
            onRefetch?.();
            setTimeout(() => { setActionDone(false); setView("detail"); }, 1800);
        } catch (err) { alert(err?.data?.message || "Failed to update price"); }
    };

    const handleDelete = async () => {
        try {
            await deletePrice(existingPrice.id).unwrap();
            setActionDone(true);
            onRefetch?.();
            setTimeout(onClose, 1600);
        } catch (err) { alert(err?.data?.message || "Failed to delete price"); }
    };

    const SuccessScreen = ({ msg }) => (
        <div style={{ textAlign:"center", padding:"32px 0 16px" }}>
            <div className="sm-pop" style={{
                width:62, height:62, borderRadius:"50%",
                background:"linear-gradient(135deg,#22c55e,#16a34a)",
                boxShadow:"0 6px 24px rgba(34,197,94,.35)",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 14px",
            }}>
                <Check size={28} color="#fff" />
            </div>
            <p style={{ fontWeight:800, fontSize:15, color:"#0f172a" }}>{msg}</p>
        </div>
    );

    const BackBtn = () => (
        <button onClick={() => setView("detail")} style={{
            display:"inline-flex", alignItems:"center", gap:5, background:"none",
            border:"none", fontSize:12, fontWeight:700, color:"#6366f1", cursor:"pointer", marginBottom:16,
        }}>
            <ChevronLeft size={14} /> Back to details
        </button>
    );

    const PriceForm = ({ onSubmit, isLoading: loading, submitLabel }) => (
        <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"flex", gap:12 }}>
                <div style={{ flex:1 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6366f1", textTransform:"uppercase", letterSpacing:".07em", marginBottom:6 }}>
                        Base Price (₹) *
                    </label>
                    <div style={{ position:"relative" }}>
                        <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#94a3b8", fontWeight:700 }}>₹</span>
                        <input type="number" name="price" value={form.price} onChange={handleChange}
                            required step="0.01" min="0" placeholder="0.00" className="sm-input"
                            style={{ width:"100%", padding:"11px 12px 11px 26px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, fontWeight:600, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
                    </div>
                </div>
                <div style={{ flex:1 }}>
                    <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6366f1", textTransform:"uppercase", letterSpacing:".07em", marginBottom:6 }}>
                        SAC Code
                    </label>
                    <div style={{ position:"relative" }}>
                        <Tag size={12} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8" }} />
                        <input type="text" name="sac_code" value={form.sac_code} onChange={handleChange}
                            placeholder="998314" className="sm-input"
                            style={{ width:"100%", padding:"11px 12px 11px 28px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:13, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
                    </div>
                </div>
            </div>

            <div onClick={() => setForm(p => ({ ...p, is_gst_applicable: !p.is_gst_applicable }))}
                style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
                    padding:"12px 15px", borderRadius:13, cursor:"pointer", userSelect:"none",
                    border:`2px solid ${form.is_gst_applicable ? "#93c5fd" : "#e2e8f0"}`,
                    background: form.is_gst_applicable ? "#eff6ff" : "#f8fafc",
                    transition:"all .18s",
                }}>
                <div>
                    <p style={{ fontSize:13, fontWeight:700, color:"#1e293b", margin:0 }}>GST Applicable</p>
                    <p style={{ fontSize:11, color:"#64748b", marginTop:2, margin:0 }}>Apply tax rates to this price</p>
                </div>
                <div style={{ position:"relative", width:44, height:24, borderRadius:999, flexShrink:0, background: form.is_gst_applicable ? "#3b82f6" : "#cbd5e1", transition:"background .2s" }}>
                    <div style={{ position:"absolute", top:3, left:3, width:18, height:18, background:"#fff", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,.18)", transition:"transform .2s", transform: form.is_gst_applicable ? "translateX(20px)" : "translateX(0)" }} />
                </div>
            </div>

            {form.is_gst_applicable && (
                <div style={{ display:"flex", gap:10, padding:"12px 14px", background:"#eff6ff", borderRadius:12, border:"1.5px solid #bfdbfe" }}>
                    {[["CGST %","cgst_percent"],["SGST %","sgst_percent"],["IGST %","igst_percent"]].map(([lbl, name]) => (
                        <div key={name} style={{ flex:1 }}>
                            <label style={{ display:"block", fontSize:10, fontWeight:800, color:"#64748b", textTransform:"uppercase", marginBottom:5 }}>{lbl}</label>
                            <input type="number" name={name} value={form[name]} onChange={handleChange}
                                step="0.01" min="0" className="sm-input"
                                style={{ width:"100%", padding:"9px 10px", border:"1.5px solid #bfdbfe", borderRadius:9, fontSize:13, fontWeight:600, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
                        </div>
                    ))}
                </div>
            )}

            <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", borderRadius:14, padding:"13px 16px", border:"1.5px solid #bbf7d0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: form.is_gst_applicable ? 6 : 0 }}>
                    <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>Subtotal</span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>₹{form.price || "0.00"}</span>
                </div>
                {form.is_gst_applicable && (
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ fontSize:12, color:"#64748b", fontWeight:600 }}>
                            GST ({(+form.cgst_percent + +form.sgst_percent + +form.igst_percent).toFixed(2)}%)
                        </span>
                        <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>
                            ₹{(parseFloat(calcTotal()) - Number(form.price || 0)).toFixed(2)}
                        </span>
                    </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #a7f3d0", paddingTop:8, marginTop: form.is_gst_applicable ? 0 : 4 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <Calculator size={13} color="#16a34a" />
                        <span style={{ fontSize:13, fontWeight:800, color:"#15803d" }}>Total Payable</span>
                    </div>
                    <span style={{ fontSize:22, fontWeight:800, color:"#15803d" }}>₹{calcTotal()}</span>
                </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
                <button type="button" onClick={() => setView("detail")}
                    style={{ flex:1, padding:12, borderRadius:13, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                    Cancel
                </button>
                <button type="submit" disabled={loading || !form.price}
                    style={{
                        flex:2, padding:12, borderRadius:13, border:"none",
                        fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                        background:"linear-gradient(135deg,#2563eb,#4f46e5)",
                        boxShadow:"0 4px 16px rgba(37,99,235,.32)",
                        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
                    }}>
                    {loading ? <><Spin /> Saving…</> : <><Save size={14} /> {submitLabel}</>}
                </button>
            </div>
        </form>
    );

    return (
        <div style={{
            position:"fixed", inset:0, zIndex:50,
            background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)",
            display:"flex", alignItems:"center", justifyContent:"center", padding:16,
        }} className="modal-overlay">
            <div className="sm-modal" style={{
                background:"#fff", borderRadius:24, padding:26,
                width:"100%", maxWidth:560, boxShadow:"0 32px 80px rgba(0,0,0,.22)",
                maxHeight:"92vh", overflowY:"auto",
            }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{
                            width:40, height:40, borderRadius:13,
                            background: view === "delete" ? "#fef2f2"
                                      : view === "edit"   ? "linear-gradient(135deg,#f0fdf4,#dcfce7)"
                                      : view === "create" ? "linear-gradient(135deg,#e0e7ff,#c7d2fe)"
                                      : "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                            {view === "delete" ? <Trash2 size={18} color="#dc2626" />
                           : view === "edit"   ? <Edit2  size={18} color="#16a34a" />
                           : view === "create" ? <Plus   size={18} color="#4f46e5" />
                           : <DollarSign size={18} color="#16a34a" />}
                        </div>
                        <div>
                            <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>
                                {view === "delete" ? "Delete Price"
                               : view === "edit"   ? "Edit Price"
                               : view === "create" ? "Create Price"
                               : "Price Details"}
                            </h2>
                            <p style={{ fontSize:12, color:"#64748b", marginTop:2, margin:0 }}>{service.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ padding:7, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}>
                        <X size={14} color="#64748b" />
                    </button>
                </div>

                {view === "detail" && (
                    <>
                        {existingPrice ? (
                            <>
                                <div style={{
                                    background:"linear-gradient(135deg,#4f46e5,#6366f1 60%,#818cf8)",
                                    borderRadius:18, padding:"20px 22px", marginBottom:18,
                                    boxShadow:"0 8px 28px rgba(79,70,229,.25)",
                                }}>
                                    <p style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", marginBottom:6 }}>
                                        Final Payable Amount
                                    </p>
                                    <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:10 }}>
                                        <span style={{ fontSize:14, color:"#a5f3fc", fontWeight:700 }}>₹</span>
                                        <span style={{ fontSize:42, fontWeight:900, color:"#fff", lineHeight:1 }}>
                                            {existingPrice.total_price}
                                        </span>
                                    </div>
                                    <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                                        <span style={{ fontSize:12, color:"rgba(255,255,255,.65)", fontWeight:600 }}>
                                            Base: <strong style={{ color:"#fff" }}>₹{existingPrice.price}</strong>
                                        </span>
                                        <span style={{ fontSize:12, color:"rgba(255,255,255,.65)", fontWeight:600 }}>
                                            GST: <strong style={{ color: existingPrice.is_gst_applicable ? "#86efac" : "rgba(255,255,255,.45)" }}>
                                                {existingPrice.is_gst_applicable ? "Active" : "None"}
                                            </strong>
                                        </span>
                                        {existingPrice.sac_code && (
                                            <span style={{ fontSize:12, color:"rgba(255,255,255,.65)", fontWeight:600 }}>
                                                SAC: <strong style={{ color:"#fff" }}>{existingPrice.sac_code}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ background:"#f8fafc", borderRadius:14, padding:"4px 16px", marginBottom:18, border:"1px solid #e2e8f0" }}>
                                    {[
                                        ["Base Price",  `₹${existingPrice.price}`],
                                        ["SAC Code",    existingPrice.sac_code || "—"],
                                        ["GST Status",  existingPrice.is_gst_applicable ? "Applicable" : "Not Applicable"],
                                        ...(existingPrice.is_gst_applicable ? [
                                            ["CGST Rate", `${existingPrice.cgst_percent || 0}%`],
                                            ["SGST Rate", `${existingPrice.sgst_percent || 0}%`],
                                            ["IGST Rate", `${existingPrice.igst_percent || 0}%`],
                                        ] : []),
                                        ["Total Price", `₹${existingPrice.total_price}`],
                                    ].map(([label, value], i, arr) => (
                                        <div key={label} style={{
                                            display:"flex", justifyContent:"space-between", alignItems:"center",
                                            padding:"11px 0",
                                            borderBottom: i < arr.length - 1 ? "1px solid #e2e8f0" : "none",
                                        }}>
                                            <span style={{ fontSize:12, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:".04em" }}>{label}</span>
                                            <span style={{ fontSize: label === "Total Price" ? 16 : 14, fontWeight: label === "Total Price" ? 800 : 600, color: label === "Total Price" ? "#15803d" : "#1e293b" }}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                                    <button onClick={() => setView("edit")}
                                        style={{
                                            flex:1, padding:"11px 0", borderRadius:13,
                                            border:"1.5px solid #bbf7d0", background:"#f0fdf4",
                                            fontSize:13, fontWeight:700, color:"#16a34a",
                                            display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer",
                                        }}>
                                        <Edit2 size={14} /> Edit Price
                                    </button>
                                    <button onClick={() => setView("delete")}
                                        style={{
                                            flex:1, padding:"11px 0", borderRadius:13,
                                            border:"1.5px solid #fecaca", background:"#fef2f2",
                                            fontSize:13, fontWeight:700, color:"#dc2626",
                                            display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer",
                                        }}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign:"center", padding:"24px 0" }}>
                                <div style={{
                                    width:64, height:64, borderRadius:20,
                                    background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    margin:"0 auto 16px",
                                }}>
                                    <DollarSign size={28} color="#6366f1" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", marginBottom:6 }}>No Price Configured</p>
                                <p style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>
                                    This service has no price set yet.
                                </p>
                                <button onClick={() => setView("create")}
                                    style={{
                                        padding:"12px 28px", borderRadius:13, border:"none",
                                        background:"linear-gradient(135deg,#4f46e5,#6366f1)",
                                        fontSize:13, fontWeight:700, color:"#fff",
                                        display:"inline-flex", alignItems:"center", gap:7,
                                        cursor:"pointer", boxShadow:"0 4px 16px rgba(79,70,229,.32)",
                                    }}>
                                    <Plus size={15} /> Configure Price
                                </button>
                            </div>
                        )}
                    </>
                )}

                {view === "create" && (
                    <>
                        <BackBtn />
                        {actionDone ? <SuccessScreen msg="Price Created!" /> : <PriceForm onSubmit={handleCreate} isLoading={creating} submitLabel="Create Price" />}
                    </>
                )}

                {view === "edit" && (
                    <>
                        <BackBtn />
                        {actionDone ? <SuccessScreen msg="Price Updated!" /> : <PriceForm onSubmit={handleUpdate} isLoading={updating} submitLabel="Save Changes" />}
                    </>
                )}

                {view === "delete" && (
                    <>
                        <BackBtn />
                        {actionDone ? (
                            <SuccessScreen msg="Price Deleted!" />
                        ) : (
                            <>
                                <div style={{
                                    background:"#fef2f2", borderRadius:14, padding:16,
                                    border:"1.5px solid #fecaca", marginBottom:18,
                                    display:"flex", gap:12, alignItems:"flex-start",
                                }}>
                                    <AlertTriangle size={18} color="#dc2626" style={{ flexShrink:0, marginTop:2 }} />
                                    <div>
                                        <p style={{ fontSize:13, fontWeight:700, color:"#dc2626", marginBottom:4 }}>This cannot be undone</p>
                                        <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, margin:0 }}>
                                            You're about to delete the price for <strong style={{ color:"#1e293b" }}>{service.name}</strong>.
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display:"flex", gap:10 }}>
                                    <button onClick={() => setView("detail")}
                                        style={{ flex:1, padding:12, borderRadius:13, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                                        Cancel
                                    </button>
                                    <button onClick={handleDelete} disabled={deleting}
                                        style={{
                                            flex:1, padding:12, borderRadius:13, border:"none",
                                            fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                                            display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                                            background:"linear-gradient(135deg,#ef4444,#dc2626)",
                                            boxShadow:"0 4px 16px rgba(239,68,68,.32)",
                                            cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.6 : 1,
                                        }}>
                                        {deleting ? <><Spin /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── View Description Modal ─────────────────────────────────────────────────── */
const ViewDescriptionModal = ({ service, onClose }) => {
    const { data: descriptions = [], isLoading, refetch } = useGetDescriptionsByServiceQuery(service.id);
    const [createDesc] = useCreateServiceDescriptionMutation();
    const [updateDesc] = useUpdateServiceDescriptionMutation();
    const [deleteDesc] = useDeleteServiceDescriptionMutation();

    const [view, setView] = useState("list");
    const [selectedDesc, setSelectedDesc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({ description_key: "", description_value: "" });

    const SpinInner = () => (
        <span style={{ width:16, height:16, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
    );
    const BackBtn = ({ label = "Back", to = "list" }) => (
        <button onClick={() => { setView(to); setSuccess(false); setForm({ description_key:"", description_value:"" }); setSelectedDesc(null); }}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#6366f1", background:"#eef2ff", border:"none", borderRadius:9, padding:"5px 12px", cursor:"pointer", marginBottom:16 }}>
            <ChevronLeft size={14} /> {label}
        </button>
    );

    const openEdit = (desc) => {
        setSelectedDesc(desc);
        setForm({ description_key: desc.description_key, description_value: desc.description_value });
        setView("edit");
    };
    const openDelete = (desc) => { setSelectedDesc(desc); setView("delete"); };

    const handleCreate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await createDesc({ service_id: service.id, ...form }).unwrap();
            setSuccess(true); refetch();
            setTimeout(() => { setSuccess(false); setView("list"); setForm({ description_key:"", description_value:"" }); }, 1800);
        } catch(err) { alert(err?.data?.message || "Failed to create"); }
        finally { setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await updateDesc({ id: selectedDesc.id, data: form }).unwrap();
            setSuccess(true); refetch();
            setTimeout(() => { setSuccess(false); setView("list"); setSelectedDesc(null); }, 1800);
        } catch(err) { alert(err?.data?.message || "Failed to update"); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteDesc(selectedDesc.id).unwrap(); refetch();
            setTimeout(() => { setView("list"); setSelectedDesc(null); setLoading(false); }, 1400);
        } catch(err) { alert(err?.data?.message || "Failed to delete"); setLoading(false); }
    };

    const DescForm = ({ onSubmit, submitLabel }) => (
        <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:6 }}>Information Type (Key) <span style={{color:"#ef4444"}}>*</span></label>
                <input value={form.description_key} onChange={e => setForm(f => ({...f, description_key: e.target.value}))} required placeholder="e.g. Warranty, Duration, Requirements"
                    style={{ width:"100%", padding:"10px 13px", borderRadius:11, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }} />
            </div>
            <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:6 }}>Description Detail (Value) <span style={{color:"#ef4444"}}>*</span></label>
                <textarea value={form.description_value} onChange={e => setForm(f => ({...f, description_value: e.target.value}))} required rows={4} placeholder="e.g. 2 years parts and labor warranty included"
                    style={{ width:"100%", padding:"10px 13px", borderRadius:11, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", resize:"vertical", background:"#f8fafc" }} />
            </div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setView("list")}
                    style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                    Cancel
                </button>
                <button type="submit" disabled={loading || !form.description_key || !form.description_value}
                    style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                        background:"linear-gradient(135deg,#7c3aed,#6366f1)",
                        boxShadow:"0 4px 16px rgba(99,102,241,.32)",
                        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                    {loading ? <><SpinInner /> Saving…</> : <><Save size={14} /> {submitLabel}</>}
                </button>
            </div>
        </form>
    );

    const tagColors = [
        { bg:"#eff6ff", color:"#2563eb" }, { bg:"#f5f3ff", color:"#7c3aed" },
        { bg:"#f0fdf4", color:"#16a34a" }, { bg:"#fff7ed", color:"#ea580c" },
        { bg:"#fdf2f8", color:"#be185d" }, { bg:"#ecfdf5", color:"#059669" },
    ];

    return (
        <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
            <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:580, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"90vh", overflowY:"auto" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#faf5ff,#f3e8ff)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <FileText size={18} color="#9333ea" />
                        </div>
                        <div>
                            <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>
                                {view === "list" ? "Descriptions" : view === "create" ? "Add Description" : view === "edit" ? "Edit Description" : "Delete Description"}
                            </h2>
                            <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{service.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}><X size={14} color="#64748b" /></button>
                </div>

                {view === "list" && (
                    <>
                        {isLoading ? (
                            <div style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontSize:13 }}>Loading…</div>
                        ) : descriptions.length === 0 ? (
                            <div style={{ textAlign:"center", padding:"32px 16px" }}>
                                <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#f5f3ff,#ede9fe)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                                    <FileText size={30} color="#a78bfa" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 6px" }}>No Descriptions Yet</p>
                                <p style={{ fontSize:13, color:"#64748b", margin:"0 0 22px", lineHeight:1.5 }}>Add one to provide more details.</p>
                                <button onClick={() => setView("create")}
                                    style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#7c3aed,#6366f1)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:7 }}>
                                    <Plus size={15} /> Add Description
                                </button>
                            </div>
                        ) : (
                            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
                                {descriptions.map((desc, i) => {
                                    const tc = tagColors[i % tagColors.length];
                                    return (
                                        <div key={desc.id} style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:"14px 16px", background:"#fafbff" }}>
                                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                                                <div style={{ flex:1, minWidth:0 }}>
                                                    <span style={{ display:"inline-block", background:tc.bg, color:tc.color, fontSize:11, fontWeight:800, borderRadius:8, padding:"3px 10px", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                                                        {desc.description_key}
                                                    </span>
                                                    <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:0, whiteSpace:"pre-wrap" }}>{desc.description_value}</p>
                                                </div>
                                                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                                                    <button onClick={() => openEdit(desc)}
                                                        style={{ padding:"6px 10px", borderRadius:9, border:"1.5px solid #e0e7ff", background:"#eef2ff", color:"#4f46e5", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
                                                        <Edit2 size={12} /> Edit
                                                    </button>
                                                    <button onClick={() => openDelete(desc)}
                                                        style={{ padding:"6px 8px", borderRadius:9, border:"1.5px solid #fee2e2", background:"#fff5f5", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center" }}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <button onClick={() => setView("create")}
                                    style={{ width:"100%", padding:"10px 0", borderRadius:13, border:"1.5px dashed #c4b5fd", background:"#faf5ff", fontSize:13, fontWeight:700, color:"#7c3aed", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:4 }}>
                                    <Plus size={14} /> Add Description
                                </button>
                            </div>
                        )}
                    </>
                )}

                {view === "create" && (
                    <>
                        <BackBtn label="Back to list" />
                        {success ? (
                            <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
                                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                                    <Check size={30} color="#fff" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>Description Added!</p>
                            </div>
                        ) : <DescForm onSubmit={handleCreate} submitLabel="Add Description" />}
                    </>
                )}

                {view === "edit" && (
                    <>
                        <BackBtn label="Back to list" />
                        {success ? (
                            <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
                                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                                    <Check size={30} color="#fff" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>Updated Successfully!</p>
                            </div>
                        ) : <DescForm onSubmit={handleUpdate} submitLabel="Save Changes" />}
                    </>
                )}

                {view === "delete" && selectedDesc && (
                    <>
                        <BackBtn label="Cancel" />
                        <div style={{ background:"#fff5f5", borderRadius:14, border:"1.5px solid #fee2e2", padding:16, marginBottom:16, display:"flex", gap:12, alignItems:"flex-start" }}>
                            <AlertTriangle size={20} color="#ef4444" style={{ flexShrink:0, marginTop:1 }} />
                            <div>
                                <p style={{ fontSize:13, fontWeight:800, color:"#dc2626", margin:"0 0 4px" }}>Delete this description?</p>
                                <p style={{ fontSize:12, color:"#64748b", margin:0 }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <div style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:14, background:"#fafbff", marginBottom:18 }}>
                            <span style={{ display:"inline-block", background:"#eff6ff", color:"#2563eb", fontSize:11, fontWeight:800, borderRadius:8, padding:"3px 10px", marginBottom:7, textTransform:"uppercase" }}>
                                {selectedDesc.description_key}
                            </span>
                            <p style={{ fontSize:13, color:"#475569", lineHeight:1.6, margin:0 }}>{selectedDesc.description_value}</p>
                        </div>
                        <div style={{ display:"flex", gap:10 }}>
                            <button onClick={() => setView("list")}
                                style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={loading}
                                style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                                    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                                    background:"linear-gradient(135deg,#dc2626,#ef4444)",
                                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                                {loading ? <><Spin /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── View Metadata Modal ─────────────────────────────────────────────────── */
const VALUE_TYPES = ["text", "option", "date"];
const META_TYPE_COLORS = {
    text:   { bg:"#eff6ff", color:"#2563eb" },
    option: { bg:"#f5f3ff", color:"#7c3aed" },
    date:   { bg:"#fff7ed", color:"#ea580c" },
};

const ViewMetadataModal = ({ service, onClose }) => {
    const { data: allMetadata = [], isLoading, refetch } = useGetAllServiceMetadataQuery();
    const metadata = useMemo(() => allMetadata.filter(m => String(m.service_id) === String(service.id)), [allMetadata, service.id]);

    const [createMeta] = useCreateServiceMetadataMutation();
    const [updateMeta] = useUpdateServiceMetadataMutation();
    const [deleteMeta] = useDeleteServiceMetadataMutation();

    const [view, setView]         = useState("list");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState(false);
    const [form, setForm]         = useState({ metadata_name:"", metadata_value_type:"text" });

    const SpinInner = () => (
        <span style={{ width:15, height:15, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
    );
    const BackBtn = () => (
        <button onClick={() => { setView("list"); setSuccess(false); setSelected(null); setForm({ metadata_name:"", metadata_value_type:"text" }); }}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#ca8a04", background:"#fef9c3", border:"none", borderRadius:9, padding:"5px 12px", cursor:"pointer", marginBottom:16 }}>
            <ChevronLeft size={14} /> Back
        </button>
    );

    const openEdit = (m) => { setSelected(m); setForm({ metadata_name: m.metadata_name, metadata_value_type: m.metadata_value_type }); setView("edit"); };
    const openDelete = (m) => { setSelected(m); setView("delete"); };

    const handleCreate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await createMeta({ ...form, service_id: Number(service.id) }).unwrap();
            setSuccess(true); refetch();
            setTimeout(() => { setSuccess(false); setView("list"); setForm({ metadata_name:"", metadata_value_type:"text" }); }, 1800);
        } catch(err) { alert(err?.data?.message || "Failed to create"); }
        finally { setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await updateMeta({ id: selected.id, body: form }).unwrap();
            setSuccess(true); refetch();
            setTimeout(() => { setSuccess(false); setView("list"); setSelected(null); }, 1800);
        } catch(err) { alert(err?.data?.message || "Failed to update"); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteMeta(selected.id).unwrap(); refetch();
            setTimeout(() => { setView("list"); setSelected(null); setLoading(false); }, 1400);
        } catch(err) { alert(err?.data?.message || "Failed to delete"); setLoading(false); }
    };

    const MetaForm = ({ onSubmit, submitLabel }) => (
        <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:6 }}>Metadata Name <span style={{color:"#ef4444"}}>*</span></label>
                <input value={form.metadata_name} onChange={e => setForm(f => ({...f, metadata_name: e.target.value}))} required placeholder="e.g. Warranty Period, Material Type"
                    style={{ width:"100%", padding:"10px 13px", borderRadius:11, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }} />
            </div>
            <div>
                <label style={{ fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:8 }}>Input Type</label>
                <div style={{ display:"flex", gap:8 }}>
                    {VALUE_TYPES.map(t => {
                        const active = form.metadata_value_type === t;
                        return <button key={t} type="button" onClick={() => setForm(f => ({...f, metadata_value_type: t}))}
                            style={{ flex:1, padding:"8px 0", borderRadius:10, border:`1.5px solid ${active ? "#ca8a04" : "#e2e8f0"}`, background: active ? "#ca8a04" : "#f8fafc", color: active ? "#fff" : "#475569", fontSize:11, fontWeight:800, textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}>
                            {t}
                        </button>;
                    })}
                </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" onClick={() => setView("list")}
                    style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                    Cancel
                </button>
                <button type="submit" disabled={loading || !form.metadata_name}
                    style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                        background:"linear-gradient(135deg,#ca8a04,#d97706)",
                        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                    {loading ? <><SpinInner /> Saving…</> : <><Save size={14} /> {submitLabel}</>}
                </button>
            </div>
        </form>
    );

    return (
        <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
            <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:560, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"90vh", overflowY:"auto" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#fef3c7,#fde68a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Database size={18} color="#ca8a04" />
                        </div>
                        <div>
                            <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>
                                {view === "list" ? "Metadata" : view === "create" ? "Add Metadata Field" : view === "edit" ? "Edit Metadata" : "Delete Metadata"}
                            </h2>
                            <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{service.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}><X size={14} color="#64748b" /></button>
                </div>

                {view === "list" && (
                    <>
                        {isLoading ? (
                            <div style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontSize:13 }}>Loading…</div>
                        ) : metadata.length === 0 ? (
                            <div style={{ textAlign:"center", padding:"32px 16px" }}>
                                <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#fef3c7,#fde68a)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                                    <Database size={30} color="#ca8a04" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 6px" }}>No Metadata Yet</p>
                                <p style={{ fontSize:13, color:"#64748b", margin:"0 0 22px" }}>No custom fields defined.</p>
                                <button onClick={() => setView("create")}
                                    style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#ca8a04,#d97706)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:7 }}>
                                    <Plus size={15} /> Add Metadata Field
                                </button>
                            </div>
                        ) : (
                            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                {metadata.map(m => {
                                    const tc = META_TYPE_COLORS[m.metadata_value_type] || META_TYPE_COLORS.text;
                                    return (
                                        <div key={m.id} style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:"14px 16px", background:"#fafbff", display:"flex", alignItems:"center", gap:12 }}>
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <span style={{ display:"inline-block", background:tc.bg, color:tc.color, fontSize:10, fontWeight:800, borderRadius:7, padding:"2px 9px", marginBottom:5, textTransform:"uppercase" }}>
                                                    {m.metadata_value_type}
                                                </span>
                                                <p style={{ fontSize:14, fontWeight:700, color:"#0f172a", margin:0 }}>{m.metadata_name}</p>
                                            </div>
                                            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                                                <button onClick={() => openEdit(m)}
                                                    style={{ padding:"6px 10px", borderRadius:9, border:"1.5px solid #fde68a", background:"#fef9c3", color:"#ca8a04", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button onClick={() => openDelete(m)}
                                                    style={{ padding:"6px 8px", borderRadius:9, border:"1.5px solid #fee2e2", background:"#fff5f5", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center" }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <button onClick={() => setView("create")}
                                    style={{ width:"100%", padding:"10px 0", borderRadius:13, border:"1.5px dashed #fde68a", background:"#fef9c3", fontSize:13, fontWeight:700, color:"#ca8a04", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:4 }}>
                                    <Plus size={14} /> Add Field
                                </button>
                            </div>
                        )}
                    </>
                )}

                {view === "create" && (
                    <>
                        <BackBtn />
                        {success ? (
                            <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
                                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#ca8a04,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                                    <Check size={30} color="#fff" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>Field Added!</p>
                            </div>
                        ) : <MetaForm onSubmit={handleCreate} submitLabel="Add Field" />}
                    </>
                )}

                {view === "edit" && (
                    <>
                        <BackBtn />
                        {success ? (
                            <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
                                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                                    <Check size={30} color="#fff" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>Updated!</p>
                            </div>
                        ) : <MetaForm onSubmit={handleUpdate} submitLabel="Save Changes" />}
                    </>
                )}

                {view === "delete" && selected && (
                    <>
                        <BackBtn />
                        <div style={{ background:"#fff5f5", borderRadius:14, border:"1.5px solid #fee2e2", padding:16, marginBottom:16, display:"flex", gap:12, alignItems:"flex-start" }}>
                            <AlertTriangle size={20} color="#ef4444" style={{ flexShrink:0, marginTop:1 }} />
                            <div>
                                <p style={{ fontSize:13, fontWeight:800, color:"#dc2626", margin:"0 0 4px" }}>Delete this metadata field?</p>
                                <p style={{ fontSize:12, color:"#64748b", margin:0 }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <div style={{ borderRadius:14, border:"1.5px solid #f1f5f9", padding:14, background:"#fafbff", marginBottom:18 }}>
                            <span style={{ display:"inline-block", background:"#fef9c3", color:"#ca8a04", fontSize:10, fontWeight:800, borderRadius:7, padding:"2px 9px", marginBottom:6, textTransform:"uppercase" }}>
                                {selected.metadata_value_type}
                            </span>
                            <p style={{ fontSize:14, fontWeight:700, color:"#0f172a", margin:0 }}>{selected.metadata_name}</p>
                        </div>
                        <div style={{ display:"flex", gap:10 }}>
                            <button onClick={() => setView("list")}
                                style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={loading}
                                style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                                    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                                    background:"linear-gradient(135deg,#dc2626,#ef4444)",
                                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                                {loading ? <><Spin /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   ZONE FORM — defined OUTSIDE ViewZoneModal to prevent remount on keystroke
   Activation Date: today or future only + quick-pick shortcuts
   Multiple zones may share the same date (no frontend overlap restriction)
   ═══════════════════════════════════════════════════════════════════════════ */
const ZoneForm = ({ form, setForm, staffList, onSubmit, onCancel, loading, submitLabel }) => {
    const activationLabel = formatActivationLabel(form.activation_start_date);

    return (
        <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:13 }}>

            {/* Zone Name & Description */}
            {[
                { name:"zone_name",        label:"Zone Name *",  type:"text", extra:{ required:true, placeholder:"e.g. Morning Slot, VIP Zone" } },
                { name:"zone_description", label:"Description",  type:"text", extra:{ placeholder:"Optional" } },
            ].map(({ name, label, type, extra }) => (
                <div key={name}>
                    <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>{label}</label>
                    <input type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} {...extra}
                        style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }} />
                </div>
            ))}

            {/* Staff in Charge */}
            <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>Staff in Charge *</label>
                <select value={form.staff_in_charge} onChange={e => setForm(f => ({ ...f, staff_in_charge: e.target.value }))} required
                    style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", background:"#f8fafc" }}>
                    <option value="">Select Staff Member</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
                </select>
            </div>

            {/* Time & Slot fields */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                    { name:"start_time",     label:"Start Time",          type:"time",   extra:{} },
                    { name:"end_time",       label:"End Time",            type:"time",   extra:{} },
                    { name:"no_of_slots",    label:"No. of Slots",        type:"number", extra:{ placeholder:"e.g. 10", min:"1" } },
                    { name:"each_slot_time", label:"Slot Duration (min)", type:"number", extra:{ placeholder:"e.g. 30", min:"1" } },
                ].map(({ name, label, type, extra }) => (
                    <div key={name}>
                        <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>{label}</label>
                        <input type={type} value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} {...extra}
                            style={{ width:"100%", padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#f8fafc" }} />
                    </div>
                ))}
            </div>

            {/* ── Activation Date with quick-pick shortcuts ── */}
            <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                    Activation Date <span style={{ color:"#ef4444" }}>*</span>
                </label>

                {/* Quick-pick shortcut chips */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                    {DATE_SHORTCUTS.map(({ label, fn }) => {
                        const val = fn();
                        const isActive = form.activation_start_date === val;
                        return (
                            <button
                                key={label}
                                type="button"
                                className={`date-chip${isActive ? " active" : ""}`}
                                onClick={() => setForm(f => ({
                                    ...f,
                                    activation_start_date: val,
                                    // auto-bump expiry if it would now be before activation
                                    expiry_date: f.expiry_date && f.expiry_date < val ? val : f.expiry_date,
                                }))}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Date input — min = today, past dates blocked */}
                <input
                    type="date"
                    value={form.activation_start_date}
                    min={todayStr()}
                    required
                    onChange={e => {
                        const val = e.target.value;
                        setForm(f => ({
                            ...f,
                            activation_start_date: val,
                            expiry_date: f.expiry_date && f.expiry_date < val ? val : f.expiry_date,
                        }));
                    }}
                    style={{
                        width:"100%", padding:"9px 12px", borderRadius:10,
                        border:"1.5px solid #2563eb", fontSize:13, fontFamily:"inherit",
                        outline:"none", boxSizing:"border-box", background:"#eff6ff",
                    }}
                />

                {/* Confirmation label */}
                {activationLabel && (
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6, padding:"6px 10px", background:"#eff6ff", borderRadius:8, border:"1px solid #bfdbfe" }}>
                        <Calendar size={12} color="#2563eb" style={{ flexShrink:0 }} />
                        <p style={{ fontSize:11, color:"#2563eb", fontWeight:600, margin:0 }}>
                            Activates: {activationLabel}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Expiry Date ── */}
            <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.04em" }}>
                    Expiry Date{" "}
                    <span style={{ fontSize:10, fontWeight:500, color:"#94a3b8", textTransform:"none" }}>(optional — leave empty for no expiry)</span>
                </label>
                <input
                    type="date"
                    value={form.expiry_date}
                    min={form.activation_start_date || todayStr()}
                    onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                    style={{
                        width:"100%", padding:"9px 12px", borderRadius:10,
                        border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit",
                        outline:"none", boxSizing:"border-box", background:"#f8fafc",
                    }}
                />
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button type="button" onClick={onCancel}
                    style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                    Cancel
                </button>
                <button type="submit" disabled={loading}
                    style={{
                        flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                        background:"linear-gradient(135deg,#2563eb,#4f46e5)",
                        boxShadow:"0 4px 16px rgba(37,99,235,.3)",
                        cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
                    }}>
                    {loading
                        ? <><span style={{ width:15, height:15, border:"2.5px solid rgba(255,255,255,.35)", borderTop:"2.5px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} /> Saving…</>
                        : <><Save size={14} /> {submitLabel}</>}
                </button>
            </div>
        </form>
    );
};

/* ─── View Zone Modal ─────────────────────────────────────────────────────── */
const ViewZoneModal = ({ service, onClose }) => {
    const { data: zonesResponse, isLoading, refetch } = useGetAllServiceZonesQuery(undefined, { refetchOnMountOrArgChange: true });
    const allZones = zonesResponse?.data || zonesResponse || [];
    const zones = useMemo(() => allZones.filter(z => String(z.service_id) === String(service.id)), [allZones, service.id]);

    const { data: staffListRaw = [] } = useGetAllStaffsQuery();
    const staffList = Array.isArray(staffListRaw) ? staffListRaw : staffListRaw?.data || [];

    const [createZone] = useCreateServiceZoneMutation();
    const [updateZone] = useUpdateServiceZoneMutation();
    const [deleteZone] = useDeleteServiceZoneMutation();

    const [view, setView]         = useState("list");
    const [selected, setSelected] = useState(null);
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState(false);

    const emptyForm = {
        zone_name:"", zone_description:"", staff_in_charge:"",
        start_time:"", end_time:"", no_of_slots:"", each_slot_time:"",
        activation_start_date:"", expiry_date:"",
    };
    const [form, setForm] = useState(emptyForm);

    const BackBtn = () => (
        <button onClick={() => { setView("list"); setSuccess(false); setSelected(null); setForm(emptyForm); }}
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#2563eb", background:"#eff6ff", border:"none", borderRadius:9, padding:"5px 12px", cursor:"pointer", marginBottom:16 }}>
            <ChevronLeft size={14} /> Back
        </button>
    );

    const openEdit = (z) => {
        setSelected(z);
        setForm({
            zone_name:             z.zone_name             || "",
            zone_description:      z.zone_description      || "",
            staff_in_charge:       z.staff_in_charge       || "",
            start_time:            z.start_time            || "",
            end_time:              z.end_time              || "",
            no_of_slots:           z.no_of_slots           || "",
            each_slot_time:        z.each_slot_time        || "",
            activation_start_date: z.activation_start_date?.split("T")[0] || "",
            expiry_date:           z.expiry_date?.split("T")[0]           || "",
        });
        setView("edit");
    };
    const openDelete = (z) => { setSelected(z); setView("delete"); };

    const getStaffName = (id) => { const s = staffList.find(st => st.id === Number(id)); return s ? `${s.first_name} ${s.last_name}` : `Staff #${id}`; };
    const fmtTime = (t) => { if (!t) return null; const [h,m] = t.split(":"), hr = Number(h); return `${hr%12||12}:${m} ${hr>=12?"PM":"AM"}`; };
    const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : null;

    const handleCreate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await createZone({
                ...form,
                service_id:     Number(service.id),
                no_of_slots:    form.no_of_slots    ? Number(form.no_of_slots)    : null,
                each_slot_time: form.each_slot_time ? Number(form.each_slot_time) : null,
                staff_in_charge: Number(form.staff_in_charge),
            }).unwrap();
            setSuccess(true); refetch();
            setTimeout(() => { setSuccess(false); setView("list"); setForm(emptyForm); }, 1800);
        } catch(err) { alert(err?.data?.message || "Failed to create zone"); }
        finally { setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await updateZone({
                id: selected.id,
                data: {
                    ...form,
                    no_of_slots:     form.no_of_slots    ? Number(form.no_of_slots)    : null,
                    each_slot_time:  form.each_slot_time ? Number(form.each_slot_time) : null,
                    staff_in_charge: Number(form.staff_in_charge),
                },
            }).unwrap();
            setSuccess(true); refetch();
            setTimeout(() => { setSuccess(false); setView("list"); setSelected(null); }, 1800);
        } catch(err) { alert(err?.data?.message || "Failed to update zone"); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteZone(selected.id).unwrap(); refetch();
            setTimeout(() => { setView("list"); setSelected(null); setLoading(false); }, 1400);
        } catch(err) { alert(err?.data?.message || "Failed to delete zone"); setLoading(false); }
    };

    const headerTitle = view === "list" ? "Service Zones" : view === "create" ? "Add Zone" : view === "edit" ? "Edit Zone" : "Delete Zone";

    return (
        <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
            <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:600, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"92vh", overflowY:"auto" }}>

                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <MapPin size={18} color="#2563eb" />
                        </div>
                        <div>
                            <h2 style={{ fontSize:17, fontWeight:800, color:"#0f172a", margin:0 }}>{headerTitle}</h2>
                            <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{service.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc", cursor:"pointer" }}><X size={14} color="#64748b" /></button>
                </div>

                {/* LIST */}
                {view === "list" && (
                    <>
                        {isLoading ? (
                            <div style={{ textAlign:"center", padding:"32px 0", color:"#94a3b8", fontSize:13 }}>Loading…</div>
                        ) : zones.length === 0 ? (
                            <div style={{ textAlign:"center", padding:"32px 16px" }}>
                                <div style={{ width:72, height:72, borderRadius:20, background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                                    <MapPin size={30} color="#2563eb" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 6px" }}>No Zones Yet</p>
                                <p style={{ fontSize:13, color:"#64748b", margin:"0 0 22px", lineHeight:1.5 }}>No zones configured for this service.<br/>Add one to manage time slots and staff.</p>
                                <button onClick={() => setView("create")}
                                    style={{ padding:"12px 28px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#2563eb,#4f46e5)", color:"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,.3)", display:"inline-flex", alignItems:"center", gap:7 }}>
                                    <Plus size={15} /> Add Zone
                                </button>
                            </div>
                        ) : (
                            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                {zones.map(z => (
                                    <div key={z.id} style={{ borderRadius:14, border:"1.5px solid #e0e7ff", padding:"14px 16px", background:"#f8faff" }}>
                                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                                                    <p style={{ fontSize:14, fontWeight:800, color:"#1e3a8a", margin:0 }}>{z.zone_name}</p>
                                                    {z.no_of_slots    && <span style={{ fontSize:11, background:"#dbeafe", color:"#2563eb", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>{z.no_of_slots} slots</span>}
                                                    {z.each_slot_time && <span style={{ fontSize:11, background:"#ede9fe", color:"#7c3aed", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>{z.each_slot_time}min</span>}
                                                </div>
                                                <div style={{ display:"flex", flexWrap:"wrap", gap:10, fontSize:12, color:"#64748b" }}>
                                                    {z.staff_in_charge && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Users size={11} /> {getStaffName(z.staff_in_charge)}</span>}
                                                    {z.start_time && z.end_time && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={11} /> {fmtTime(z.start_time)} – {fmtTime(z.end_time)}</span>}
                                                    {z.activation_start_date && (
                                                        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                                                            <Calendar size={11} />
                                                            {fmtDate(z.activation_start_date?.split("T")[0])}{z.expiry_date ? ` → ${fmtDate(z.expiry_date?.split("T")[0])}` : " → No expiry"}
                                                        </span>
                                                    )}
                                                </div>
                                                {z.zone_description && <p style={{ fontSize:12, color:"#94a3b8", margin:"5px 0 0", fontStyle:"italic" }}>{z.zone_description}</p>}
                                            </div>
                                            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                                                <button onClick={() => openEdit(z)}
                                                    style={{ padding:"6px 10px", borderRadius:9, border:"1.5px solid #bfdbfe", background:"#eff6ff", color:"#2563eb", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button onClick={() => openDelete(z)}
                                                    style={{ padding:"6px 8px", borderRadius:9, border:"1.5px solid #fee2e2", background:"#fff5f5", color:"#ef4444", cursor:"pointer", display:"flex", alignItems:"center" }}>
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => { setForm(emptyForm); setView("create"); }}
                                    style={{ width:"100%", padding:"10px 0", borderRadius:13, border:"1.5px dashed #bfdbfe", background:"#eff6ff", fontSize:13, fontWeight:700, color:"#2563eb", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:4 }}>
                                    <Plus size={14} /> Add Zone
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* CREATE */}
                {view === "create" && (
                    <>
                        <BackBtn />
                        {success ? (
                            <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
                                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#2563eb,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 24px rgba(37,99,235,.3)" }}>
                                    <Check size={30} color="#fff" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Zone Created!</p>
                                <p style={{ fontSize:12, color:"#64748b" }}>"{form.zone_name}" has been added.</p>
                            </div>
                        ) : (
                            <ZoneForm
                                form={form}
                                setForm={setForm}
                                staffList={staffList}
                                onSubmit={handleCreate}
                                onCancel={() => { setView("list"); setForm(emptyForm); }}
                                loading={loading}
                                submitLabel="Create Zone"
                            />
                        )}
                    </>
                )}

                {/* EDIT */}
                {view === "edit" && (
                    <>
                        <BackBtn />
                        {success ? (
                            <div className="sm-pop" style={{ textAlign:"center", padding:"24px 0" }}>
                                <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                                    <Check size={30} color="#fff" />
                                </div>
                                <p style={{ fontSize:16, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>Zone Updated!</p>
                                <p style={{ fontSize:12, color:"#64748b" }}>Changes saved for "{form.zone_name}".</p>
                            </div>
                        ) : (
                            <ZoneForm
                                form={form}
                                setForm={setForm}
                                staffList={staffList}
                                onSubmit={handleUpdate}
                                onCancel={() => { setView("list"); setSelected(null); setForm(emptyForm); }}
                                loading={loading}
                                submitLabel="Save Changes"
                            />
                        )}
                    </>
                )}

                {/* DELETE */}
                {view === "delete" && selected && (
                    <>
                        <BackBtn />
                        <div style={{ background:"#fff5f5", borderRadius:14, border:"1.5px solid #fee2e2", padding:16, marginBottom:16, display:"flex", gap:12, alignItems:"flex-start" }}>
                            <AlertTriangle size={20} color="#ef4444" style={{ flexShrink:0, marginTop:1 }} />
                            <div>
                                <p style={{ fontSize:13, fontWeight:800, color:"#dc2626", margin:"0 0 4px" }}>Delete this zone?</p>
                                <p style={{ fontSize:12, color:"#64748b", margin:0 }}>This action cannot be undone.</p>
                            </div>
                        </div>
                        <div style={{ borderRadius:14, border:"1.5px solid #e0e7ff", padding:14, background:"#f8faff", marginBottom:18 }}>
                            <p style={{ fontSize:14, fontWeight:800, color:"#1e3a8a", margin:"0 0 6px" }}>{selected.zone_name}</p>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:10, fontSize:12, color:"#64748b" }}>
                                {selected.staff_in_charge && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Users size={11} /> {getStaffName(selected.staff_in_charge)}</span>}
                                {selected.start_time && selected.end_time && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={11} /> {fmtTime(selected.start_time)} – {fmtTime(selected.end_time)}</span>}
                            </div>
                        </div>
                        <div style={{ display:"flex", gap:10 }}>
                            <button onClick={() => setView("list")}
                                style={{ flex:1, padding:11, borderRadius:12, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={loading}
                                style={{ flex:2, padding:11, borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit",
                                    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                                    background:"linear-gradient(135deg,#dc2626,#ef4444)",
                                    boxShadow:"0 4px 16px rgba(239,68,68,.3)",
                                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                                {loading ? <><Spin /> Deleting…</> : <><Trash2 size={14} /> Confirm Delete</>}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

/* ─── Edit Service Modal ─────────────────────────────────────────────────── */
const EditServiceModal = ({ service, categories, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: service.name || "",
        description: service.description || "",
        category_id: service.category_id || "",
        pre_payment_required: service.pre_payment_required || false,
    });
    const [updateService, { isLoading }] = useUpdateServiceMutation();
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateService({ id: service.id, data: formData }).unwrap();
            setSuccess(true);
            onSuccess?.();
            setTimeout(onClose, 1500);
        } catch (err) { alert(err?.data?.message || "Failed to update service"); }
    };

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <div style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} className="modal-overlay">
            <div className="sm-modal" style={{ background:"#fff", borderRadius:24, padding:26, width:"100%", maxWidth:620, boxShadow:"0 32px 80px rgba(0,0,0,.22)", maxHeight:"90vh", overflowY:"auto" }}>
                {!success ? (
                    <>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                    <Pencil size={18} color="#16a34a" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize:18, fontWeight:800, color:"#0f172a", margin:0 }}>Edit Service</h2>
                                    <p style={{ fontSize:12, color:"#64748b", marginTop:2 }}>Update service details</p>
                                </div>
                            </div>
                            <button onClick={onClose} style={{ padding:6, borderRadius:9, border:"none", background:"#f8fafc" }}><X size={14} color="#64748b" /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display:"grid", gap:16, marginBottom:20 }}>
                                <div>
                                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#475569", marginBottom:8 }}>Service Name *</label>
                                    <input type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} required className="sm-input"
                                        style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, color:"#1e293b", background:"#fff", fontFamily:"inherit" }} />
                                </div>
                                <div>
                                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#475569", marginBottom:8 }}>Description *</label>
                                    <textarea value={formData.description} onChange={e => handleChange("description", e.target.value)} required rows={4} className="sm-input"
                                        style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, color:"#1e293b", background:"#fff", fontFamily:"inherit", resize:"vertical" }} />
                                </div>
                                <div>
                                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#475569", marginBottom:8 }}>Category *</label>
                                    <select value={formData.category_id} onChange={e => handleChange("category_id", e.target.value)} required className="sm-input"
                                        style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, color:"#1e293b", background:"#fff", fontFamily:"inherit", appearance:"none" }}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div onClick={() => handleChange("pre_payment_required", !formData.pre_payment_required)}
                                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"13px 16px", borderRadius:14, cursor:"pointer", userSelect:"none", border:`2px solid ${formData.pre_payment_required ? "#fdba74" : "#e2e8f0"}`, background: formData.pre_payment_required ? "#fff7ed" : "#f8fafc", transition:"all .18s" }}>
                                    <div>
                                        <p style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>Require Pre-payment</p>
                                        <p style={{ fontSize:11, color:"#64748b", marginTop:3 }}>Customers must pay before confirmation</p>
                                    </div>
                                    <div style={{ position:"relative", width:44, height:24, borderRadius:999, flexShrink:0, background: formData.pre_payment_required ? "#f97316" : "#cbd5e1", transition:"background .2s" }}>
                                        <div style={{ position:"absolute", top:3, left:3, width:18, height:18, background:"#fff", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,.18)", transition:"transform .2s", transform: formData.pre_payment_required ? "translateX(20px)" : "translateX(0)" }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display:"flex", gap:10 }}>
                                <button type="button" onClick={onClose} style={{ flex:1, padding:12, borderRadius:13, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit" }}>Cancel</button>
                                <button type="submit" disabled={isLoading}
                                    style={{ flex:1, padding:12, borderRadius:13, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:"linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow:"0 4px 16px rgba(37,99,235,.32)" }}>
                                    {isLoading ? <><Spin /> Saving...</> : <><Save size={14} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign:"center", padding:"16px 0" }}>
                        <div className="sm-pop" style={{ width:62, height:62, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)", boxShadow:"0 6px 24px rgba(34,197,94,.35)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                            <Check size={28} color="#fff" />
                        </div>
                        <p style={{ fontWeight:800, fontSize:15, color:"#0f172a", marginBottom:5 }}>Updated!</p>
                        <p style={{ fontSize:13, color:"#94a3b8" }}>Service updated successfully.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Create Service Modal ───────────────────────────────────────────────── */
const CreateServiceModal = ({ categoryId, categoryName, onClose, onCreated }) => {
    const [createService, { isLoading }] = useCreateServiceMutation();
    const [success, setSuccess] = useState(false);
    const [createdName, setCreatedName] = useState("");
    const [form, setForm] = useState({ name: "", description: "", pre_payment_required: false });
    const nameRef = useRef(null);
    useEffect(() => { setTimeout(() => nameRef.current?.focus(), 120); }, []);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await createService({ ...form, category_id: Number(categoryId) }).unwrap();
            setCreatedName(form.name);
            setSuccess(true);
            onCreated?.();
            setTimeout(onClose, 2200);
        } catch (err) { alert(err?.data?.message || "Failed to create service"); }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay" style={{ background:"rgba(15,23,42,.55)", backdropFilter:"blur(5px)" }}>
            <div className="modal-card bg-white rounded-3xl w-full max-w-lg overflow-hidden" style={{ boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
                <div style={{ background:"linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)", padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                        <div style={{ width:38, height:38, borderRadius:12, background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Save size={17} color="#fff" />
                        </div>
                        <div>
                            <p style={{ color:"#fff", fontWeight:800, fontSize:14, margin:0 }}>Create New Service</p>
                            <p style={{ color:"rgba(255,255,255,.65)", fontSize:11, marginTop:2, marginBottom:0 }}>
                                Adding to <strong style={{ color:"rgba(255,255,255,.9)" }}>{categoryName}</strong>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width:30, height:30, borderRadius:9, background:"rgba(255,255,255,.16)", border:"1px solid rgba(255,255,255,.28)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <X size={14} color="#fff" />
                    </button>
                </div>
                <div style={{ padding:"22px 24px 24px" }}>
                    {!success ? (
                        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
                            <div>
                                <label style={{ display:"block", fontSize:10, fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>
                                    Service Name <span style={{ color:"#ef4444" }}>*</span>
                                </label>
                                <input ref={nameRef} type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Premium Haircut, Deep Cleaning" className="sm-input"
                                    style={{ width:"100%", padding:"11px 14px", fontSize:13, fontWeight:500, border:"1.5px solid #e2e8f0", borderRadius:13, background:"#fff", color:"#1e293b", fontFamily:"inherit" }} />
                            </div>
                            <div>
                                <label style={{ display:"block", fontSize:10, fontWeight:800, color:"#6366f1", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:7 }}>
                                    Description <span style={{ color:"#ef4444" }}>*</span>
                                </label>
                                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="What does this service include?" className="sm-input"
                                    style={{ width:"100%", padding:"11px 14px", fontSize:13, fontWeight:500, border:"1.5px solid #e2e8f0", borderRadius:13, background:"#fff", color:"#1e293b", fontFamily:"inherit", resize:"none", lineHeight:1.6 }} />
                                <p style={{ fontSize:11, color:"#94a3b8", marginTop:5, fontWeight:500 }}>{form.description.length} characters</p>
                            </div>
                            <div onClick={() => setForm(prev => ({ ...prev, pre_payment_required: !prev.pre_payment_required }))}
                                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"13px 16px", borderRadius:14, cursor:"pointer", userSelect:"none", border:`2px solid ${form.pre_payment_required ? "#fdba74" : "#e2e8f0"}`, background: form.pre_payment_required ? "#fff7ed" : "#f8fafc", transition:"all .18s" }}>
                                <div>
                                    <p style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>Require Pre-payment</p>
                                    <p style={{ fontSize:11, color:"#64748b", marginTop:3 }}>Customers must pay before the service is confirmed</p>
                                </div>
                                <div style={{ position:"relative", width:44, height:24, borderRadius:999, flexShrink:0, background: form.pre_payment_required ? "#f97316" : "#cbd5e1", transition:"background .2s" }}>
                                    <div style={{ position:"absolute", top:3, left:3, width:18, height:18, background:"#fff", borderRadius:"50%", boxShadow:"0 1px 4px rgba(0,0,0,.18)", transition:"transform .2s", transform: form.pre_payment_required ? "translateX(20px)" : "translateX(0)" }} />
                                </div>
                            </div>
                            <div style={{ height:1, background:"linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} />
                            <div style={{ display:"flex", gap:10 }}>
                                <button type="button" onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:14, border:"1.5px solid #e2e8f0", background:"#fff", fontSize:13, fontWeight:600, color:"#475569", fontFamily:"inherit", cursor:"pointer" }}>Cancel</button>
                                <button type="submit" disabled={isLoading || !form.name.trim()}
                                    style={{ flex:1, padding:"12px", borderRadius:14, border:"none", fontSize:13, fontWeight:700, color:"#fff", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:7, background:"linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow:"0 4px 16px rgba(37,99,235,.32)", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1 }}>
                                    {isLoading ? <><Spin /> Creating…</> : <><Save size={14} /> Create Service</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign:"center", padding:"20px 0 8px" }}>
                            <div className="sm-pop" style={{ width:62, height:62, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)", boxShadow:"0 6px 24px rgba(34,197,94,.35)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                                <Check size={28} color="#fff" />
                            </div>
                            <p style={{ fontWeight:800, fontSize:15, color:"#0f172a", marginBottom:5 }}>Service Created!</p>
                            <p style={{ fontSize:13, color:"#64748b" }}><strong style={{ color:"#0f172a" }}>{createdName}</strong> has been added successfully.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
const CategoryServicesPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const categoryName = location.state?.categoryName || "Category";

    const [searchTerm, setSearchTerm]             = useState("");
    const [showDeleteModal, setShowDeleteModal]     = useState(false);
    const [selectedService, setSelectedService]     = useState(null);
    const [deleteSuccess, setDeleteSuccess]         = useState(false);
    const [sort, setSort]                           = useState({ key: null, dir: "asc" });
    const [showDisableModal, setShowDisableModal]   = useState(false);
    const [disableReason, setDisableReason]         = useState("");
    const [serviceToDisable, setServiceToDisable]   = useState(null);
    const [showCreateModal, setShowCreateModal]     = useState(false);
    const [showPriceModal, setShowPriceModal]       = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showMetadataModal, setShowMetadataModal] = useState(false);
    const [showZoneModal, setShowZoneModal]         = useState(false);
    const [showEditModal, setShowEditModal]         = useState(false);

    const { data: response, isLoading, error, refetch } = useGetServicesByBusinessQuery();
    const allServices = response || [];
    const businessId = localStorage.getItem("business_id");
    const { data: pricesResponse, refetch: refetchPrices } = useGetPricesByBusinessQuery(businessId);
    const allPrices = pricesResponse?.data || pricesResponse || [];
    const { data: categoriesResp } = useGetAllServiceCategoriesQuery();
    const categories = useMemo(() => {
        const raw = categoriesResp?.data || categoriesResp || [];
        return Array.isArray(raw) ? raw : [];
    }, [categoriesResp]);

    const categoryServices = useMemo(
        () => allServices.filter(s => s.category_id === Number(categoryId)),
        [allServices, categoryId]
    );

    const getServiceTotal = (service) => {
        const matched = Array.isArray(allPrices) ? allPrices.filter(p => p.service_id === service.id) : [];
        if (matched.length > 0) return matched.reduce((sum, p) => sum + (Number(p.total_price) || Number(p.price) || 0), 0);
        return Number(service.total_price) || Number(service.price) || 0;
    };

    const activeCount = useMemo(
        () => categoryServices.filter(s => { const st = s.status?.toLowerCase(); return !st || st === "active"; }).length,
        [categoryServices]
    );

    const totalPrice = useMemo(
        () => categoryServices.reduce((sum, s) => sum + getServiceTotal(s), 0),
        [categoryServices, allPrices]
    );

    const filteredServices = useMemo(() => {
        let list = categoryServices;
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(s => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
        }
        if (sort.key) {
            list = [...list].sort((a, b) => {
                const av = a[sort.key] ?? ""; const bv = b[sort.key] ?? "";
                return sort.dir === "asc" ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
            });
        }
        return list;
    }, [searchTerm, categoryServices, sort]);

    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

    const toggleSort = key => setSort(p => p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });

    const handleOpenDelete  = s => { setSelectedService(s); setDeleteSuccess(false); setShowDeleteModal(true); };
    const handleCloseDelete = ()  => { setShowDeleteModal(false); setSelectedService(null); setDeleteSuccess(false); };
    const handleDeleteSubmit = async () => {
        try { await deleteService(selectedService.id).unwrap(); setDeleteSuccess(true); setTimeout(handleCloseDelete, 1500); }
        catch (err) { alert(err?.data?.message || "Failed to delete service"); }
    };

    const handleToggleService = async (service) => {
        if (service.status?.toLowerCase() === "active") { setServiceToDisable(service); setShowDisableModal(true); }
        else {
            try { await updateService({ id: service.id, data: { status: "active", disable_reason: null } }).unwrap(); }
            catch { alert("Failed to enable service"); }
        }
    };

    const handleDisableConfirm = async () => {
        if (!disableReason.trim()) { alert("Please provide a reason"); return; }
        try {
            await updateService({ id: serviceToDisable.id, data: { status: "inactive", disable_reason: disableReason } }).unwrap();
            setShowDisableModal(false); setDisableReason(""); setServiceToDisable(null);
        } catch { alert("Failed to disable service"); }
    };

    const handleBackToCategories = () => navigate('/dashboard', { state: { activeMenu: 'Services Management' } });
    const closeDisableModal = () => { setShowDisableModal(false); setDisableReason(""); setServiceToDisable(null); };

    const handleViewPrice       = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowPriceModal(true); };
    const handleViewDescription = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowDescriptionModal(true); };
    const handleViewMetadata    = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowMetadataModal(true); };
    const handleViewZone        = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowZoneModal(true); };
    const handleEditService     = (e, s) => { e.stopPropagation(); setSelectedService(s); setShowEditModal(true); };

    const Th = ({ label, col, className = "" }) => (
        <th onClick={() => col && toggleSort(col)}
            className={`px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest select-none whitespace-nowrap ${col ? "cursor-pointer hover:text-indigo-600 transition-colors" : ""} ${className}`}>
            {label}{col && <SortIcon active={sort.key === col} dir={sort.dir} />}
        </th>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 p-8 fade-enter">
            <GlobalStyles />
            <button onClick={handleBackToCategories} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm font-medium transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>
            <div className="text-center py-12"><p className="text-red-500 font-semibold">Error loading services</p></div>
        </div>
    );

    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen" style={{ background:"linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <button onClick={handleBackToCategories}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 text-sm font-medium transition-colors group page-enter">
                        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Categories
                    </button>

                    {/* Header */}
                    <div className="page-enter rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                        style={{ background:"linear-gradient(135deg,#4f46e5,#6366f1 55%,#818cf8)", boxShadow:"0 12px 40px rgba(79,70,229,.28)" }}>
                        <div>
                            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Services</p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{categoryName}</h1>
                            <p className="text-indigo-200 text-sm mt-1">
                                {categoryServices.length} service{categoryServices.length !== 1 ? "s" : ""}&nbsp;·&nbsp;
                                Total value: <span className="text-white font-bold">₹{totalPrice.toLocaleString()}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ background:"rgba(34,197,94,.22)", backdropFilter:"blur(8px)", border:"1px solid rgba(134,239,172,.35)", minWidth:90 }}>
                                <span className="text-2xl font-bold text-white leading-none">{activeCount}</span>
                                <span className="text-green-200 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">Active</span>
                            </div>
                            <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ background:"rgba(255,255,255,.12)", backdropFilter:"blur(8px)", minWidth:110 }}>
                                <span className="text-2xl font-bold text-white leading-none">₹{totalPrice > 0 ? totalPrice.toLocaleString() : "0"}</span>
                                <span className="text-indigo-200 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">Total Value</span>
                            </div>
                            <button onClick={() => setShowCreateModal(true)} className="create-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-700" style={{ background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,.12)" }}>
                                <Plus size={16} /> Create Service
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="page-enter search-wrap mb-6" style={{ animationDelay:".06s" }}>
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                        <input type="text" placeholder="Search by name or description…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-10 py-3.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none transition-all placeholder-slate-400 font-medium"
                            style={{ boxShadow:"0 2px 12px rgba(0,0,0,.04)" }} />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-3 px-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            {filteredServices.length} result{filteredServices.length !== 1 ? "s" : ""}
                            {searchTerm && ` for "${searchTerm}"`}
                        </p>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 px-6 py-5 border-b border-slate-50">
                                    <div className="shimmer-bg rounded-full w-7 h-7" />
                                    <div className="shimmer-bg rounded-xl h-12 w-12" />
                                    <div className="flex-1 space-y-2">
                                        <div className="shimmer-bg rounded h-3.5 w-40" />
                                        <div className="shimmer-bg rounded h-3 w-64" />
                                    </div>
                                    <div className="shimmer-bg rounded-xl h-8 w-24" />
                                    <div className="shimmer-bg rounded-full h-7 w-16" />
                                    <div className="flex gap-2">{[...Array(5)].map((__, j) => <div key={j} className="shimmer-bg rounded-xl h-9 w-9" />)}</div>
                                </div>
                            ))}
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 fade-enter" style={{ boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)" }}>
                                <Package size={28} className="text-indigo-400" />
                            </div>
                            <p className="text-slate-700 font-bold text-lg mb-1">{searchTerm ? `No results for "${searchTerm}"` : "No services yet"}</p>
                            <p className="text-sm text-slate-400 mb-7">{searchTerm ? "Try a different search term" : "Add your first service to get started"}</p>
                            {!searchTerm && (
                                <button onClick={() => setShowCreateModal(true)} className="create-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background:"linear-gradient(135deg,#4f46e5,#6366f1)" }}>
                                    <Plus size={16} /> Add First Service
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden page-enter" style={{ animationDelay:".12s", boxShadow:"0 4px 28px rgba(0,0,0,.07)" }}>
                            <div className="table-scroll overflow-x-auto">
                                <table className="w-full text-sm" style={{ borderCollapse:"separate", borderSpacing:0 }}>
                                    <thead>
                                        <tr style={{ background:"linear-gradient(90deg,#f8faff,#f1f5fe)" }}>
                                            <Th label="#" className="w-14 text-center" />
                                            <Th label="Service" col="name" className="min-w-[190px]" />
                                            <Th label="Description" col="description" className="col-desc min-w-[220px]" />
                                            <Th label="Price" col="price" className="w-40" />
                                            <Th label="Status" col="status" className="col-status w-28" />
                                            <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-36">Manage</th>
                                            <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-32">Actions</th>
                                        </tr>
                                        <tr><td colSpan={7}><div style={{ height:1, background:"linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} /></td></tr>
                                    </thead>
                                    <tbody>
                                        {filteredServices.map((service, idx) => (
                                            <tr key={service.id} className="table-row border-b border-slate-50 row-enter" style={{ animationDelay:`${idx * 0.04}s` }}>

                                                <td className="px-5 py-5 text-center">
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold" style={{ background:"#eef2ff", color:"#4f46e5" }}>{idx + 1}</span>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-3">
                                                        {service.image
                                                            ? <img src={service.image} alt={service.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100" style={{ boxShadow:"0 2px 8px rgba(0,0,0,.08)" }} />
                                                            : <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background:"linear-gradient(135deg,#e0e7ff,#c7d2fe)" }}><Package size={18} className="text-indigo-400" /></div>
                                                        }
                                                        <div>
                                                            <p className="font-semibold text-slate-800 leading-snug line-clamp-1">{service.name}</p>
                                                            {service.pre_payment_required && (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:"#fff7ed", color:"#c2410c" }}>PREPAY</span>
                                                            )}
                                                            {service.status?.toLowerCase() === "inactive" && service.disable_reason && (
                                                                <p className="text-[10px] text-yellow-600 mt-0.5 line-clamp-1" title={service.disable_reason}>{service.disable_reason}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 col-desc">
                                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 max-w-xs">{service.description || <em>No description</em>}</p>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
                                                            <DollarSign size={12} style={{ color:"#16a34a" }} />
                                                            <span className="font-bold text-sm" style={{ color:"#15803d" }}>₹{getServiceTotal(service) > 0 ? getServiceTotal(service).toLocaleString() : "0"}</span>
                                                        </div>
                                                        <button data-tip="View Price" onClick={e => handleViewPrice(e, service)} className="icon-btn eye-btn" style={{ background:"#eef2ff", color:"#4f46e5" }}>
                                                            <Eye size={15} />
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 col-status"><StatusPill status={service.status || "active"} /></td>

                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-1.5">
                                                        <button data-tip="Description" onClick={e => handleViewDescription(e, service)} className="icon-btn desc-btn" style={{ background:"#faf5ff", color:"#9333ea" }}>
                                                            <FileText size={15} />
                                                        </button>
                                                        <button data-tip="Metadata" onClick={e => handleViewMetadata(e, service)} className="icon-btn meta-btn" style={{ background:"#fffbeb", color:"#d97706" }}>
                                                            <Database size={15} />
                                                        </button>
                                                        <button data-tip="Zone" onClick={e => handleViewZone(e, service)} className="icon-btn zone-btn" style={{ background:"#eff6ff", color:"#2563eb" }}>
                                                            <MapPin size={15} />
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-1.5">
                                                        <button data-tip={service.status?.toLowerCase() === "active" ? "Disable" : "Enable"}
                                                            onClick={e => { e.stopPropagation(); handleToggleService(service); }}
                                                            className={`icon-btn ${service.status?.toLowerCase() === "active" ? "disable-btn" : "enable-btn"}`}
                                                            style={{ background: service.status?.toLowerCase() === "active" ? "#fffbeb" : "#f0fdf4", color: service.status?.toLowerCase() === "active" ? "#d97706" : "#16a34a" }}>
                                                            <Power size={15} />
                                                        </button>
                                                        <button data-tip="Edit" onClick={e => handleEditService(e, service)} className="icon-btn edit-btn" style={{ background:"#f0fdf4", color:"#16a34a" }}>
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button data-tip="Delete" onClick={e => { e.stopPropagation(); handleOpenDelete(service); }} className="icon-btn del-btn" style={{ background:"#fef2f2", color:"#dc2626" }}>
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50" style={{ background:"#f8faff" }}>
                                <p className="text-xs text-slate-400 font-medium">
                                    Showing <span className="font-bold text-slate-600">{filteredServices.length}</span> of <span className="font-bold text-slate-600">{categoryServices.length}</span> services
                                </p>
                                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                                    Total value: <span className="font-bold" style={{ color:"#4f46e5" }}>₹{totalPrice.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODALS ── */}

            {showPriceModal && selectedService && (
                <ViewPriceModal
                    service={selectedService}
                    allPrices={allPrices}
                    onClose={() => { setShowPriceModal(false); setSelectedService(null); }}
                    onRefetch={() => { refetchPrices(); }}
                />
            )}

            {showDescriptionModal && selectedService && (
                <ViewDescriptionModal service={selectedService} onClose={() => { setShowDescriptionModal(false); setSelectedService(null); }} />
            )}

            {showMetadataModal && selectedService && (
                <ViewMetadataModal service={selectedService} onClose={() => { setShowMetadataModal(false); setSelectedService(null); }} />
            )}

            {showZoneModal && selectedService && (
                <ViewZoneModal service={selectedService} onClose={() => { setShowZoneModal(false); setSelectedService(null); }} />
            )}

            {showEditModal && selectedService && (
                <EditServiceModal
                    service={selectedService}
                    categories={categories}
                    onClose={() => { setShowEditModal(false); setSelectedService(null); }}
                    onSuccess={() => refetch()}
                />
            )}

            {showCreateModal && (
                <CreateServiceModal
                    categoryId={categoryId}
                    categoryName={categoryName}
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => refetch()}
                />
            )}

            {/* Disable Modal */}
            {showDisableModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay" style={{ background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)" }}>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md modal-card" style={{ boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Disable Service</h2>
                                <p className="text-sm text-slate-500 mt-1">{serviceToDisable?.name}</p>
                            </div>
                            <button onClick={closeDisableModal} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} className="text-slate-400" /></button>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Disabling <span className="text-red-500">*</span></label>
                            <textarea value={disableReason} onChange={e => setDisableReason(e.target.value)}
                                placeholder="e.g., Under maintenance, Staff unavailable, Equipment repair..." rows={4}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-none" />
                            <p className="text-xs text-slate-500 mt-2">This service will not be available for new bookings until re-enabled.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={closeDisableModal} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
                            <button onClick={handleDisableConfirm} disabled={!disableReason.trim() || isUpdating}
                                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60"
                                style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", boxShadow:"0 4px 16px rgba(245,158,11,.35)" }}>
                                {isUpdating ? "Disabling..." : "Disable Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Service Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay" style={{ background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)" }}>
                    <div className="bg-white rounded-3xl p-7 w-full max-w-sm modal-card" style={{ boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
                        {!deleteSuccess ? (
                            <>
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background:"#fef2f2" }}>
                                            <Trash2 size={18} style={{ color:"#dc2626" }} />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-slate-900">Delete Service</h2>
                                            <p className="text-xs text-slate-400">This cannot be undone</p>
                                        </div>
                                    </div>
                                    <button onClick={handleCloseDelete} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors"><X size={17} className="text-slate-400" /></button>
                                </div>
                                <div className="rounded-2xl p-4 mb-6" style={{ background:"#fef2f2", border:"1px solid #fecaca" }}>
                                    <p className="text-sm text-slate-600">Are you sure you want to delete <span className="font-bold text-slate-900">{selectedService?.name}</span>?</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleCloseDelete} className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
                                    <button onClick={handleDeleteSubmit} disabled={isDeleting}
                                        className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60"
                                        style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", boxShadow:"0 4px 16px rgba(239,68,68,.35)" }}>
                                        {isDeleting ? "Deleting…" : "Delete"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6 fade-enter">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:"linear-gradient(135deg,#dcfce7,#bbf7d0)" }}>
                                    <Check size={30} style={{ color:"#16a34a" }} />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-1">Deleted!</h3>
                                <p className="text-sm text-slate-400">Service removed successfully.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CategoryServicesPage;