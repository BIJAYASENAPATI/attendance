import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    useGetServicesByBusinessQuery,
    useDeleteServiceMutation,
    useGetPricesByBusinessQuery,
    useUpdateServiceMutation,
    useCreateServiceMutation,
} from "../../../../app/service/slice";
import {
    ArrowLeft, Plus, Search, Package, X, Check, Eye, Edit2, Trash2,
    FileText, Database, MapPin, ChevronUp, ChevronDown, DollarSign, Power,
    Save,
} from "lucide-react";

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
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(.94) translateY(14px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes popIn { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }

        .page-enter  { animation: fadeInUp .45s cubic-bezier(.22,1,.36,1) both; }
        .row-enter   { animation: rowSlide .35s cubic-bezier(.22,1,.36,1) both; }
        .fade-enter  { animation: fadeIn .3s ease both; }
        .modal-enter { animation: scaleIn .28s cubic-bezier(.22,1,.36,1) both; }
        .pop-enter   { animation: popIn .38s cubic-bezier(.22,1,.36,1) both; }

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
        .status-dot { width:7px; height:7px; border-radius:50%; display:inline-block; flex-shrink:0; }
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

        /* ── Create Service Modal inputs ── */
        .csm-input {
            width: 100%; padding: 11px 14px; font-size: 13px; font-weight: 500;
            border: 1.5px solid #e2e8f0; border-radius: 13px; background: #fff;
            outline: none; color: #1e293b; font-family: inherit;
            transition: border-color .15s, box-shadow .15s;
        }
        .csm-input:focus { border-color: #a5b4fc; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
        .csm-input::placeholder { color: #94a3b8; }
    `}</style>
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

/* ─── Inline Create Service Modal ───────────────────────────────────────────
   Opens as an overlay ON TOP of the CategoryServicesPage.
   No navigation — stays on the same route.
────────────────────────────────────────────────────────────────────────────── */
const CreateServiceModal = ({ categoryId, categoryName, onClose, onCreated }) => {
    const [createService, { isLoading }] = useCreateServiceMutation();
    const [success, setSuccess]   = useState(false);
    const [createdName, setCreatedName] = useState("");
    const [form, setForm] = useState({ name: "", description: "", pre_payment_required: false });
    const nameRef = useRef(null);

    useEffect(() => { setTimeout(() => nameRef.current?.focus(), 120); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createService({ ...form, category_id: Number(categoryId) }).unwrap();
            setCreatedName(form.name);
            setSuccess(true);
            onCreated?.();
        } catch (err) {
            alert(err?.data?.message || "Failed to create service");
        }
    };

    const handleCreateAnother = () => {
        setForm({ name: "", description: "", pre_payment_required: false });
        setSuccess(false);
        setCreatedName("");
        setTimeout(() => nameRef.current?.focus(), 120);
    };

    return (
        /* Dark backdrop */
        <div
            style={{
                position: "fixed", inset: 0, zIndex: 200,
                background: "rgba(15,23,42,0.55)",
                backdropFilter: "blur(5px)",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
                animation: "fadeIn .2s ease both",
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Modal card */}
            <div
                className="modal-enter"
                style={{
                    background: "#fff", borderRadius: 24, width: "100%", maxWidth: 520,
                    overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.22)",
                }}
            >
                {/* Gradient header */}
                <div style={{
                    background: "linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)",
                    padding: "18px 22px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 12,
                            background: "rgba(255,255,255,.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Save size={17} color="#fff" />
                        </div>
                        <div>
                            <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0 }}>Create New Service</p>
                            <p style={{ color: "rgba(255,255,255,.65)", fontSize: 11, marginTop: 2, marginBottom: 0 }}>
                                Adding to <strong style={{ color: "rgba(255,255,255,.9)" }}>{categoryName}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >
                        <X size={14} color="#fff" />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "22px 24px 24px" }}>
                    {!success ? (
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                            {/* Service Name */}
                            <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>
                                    SERVICE NAME <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <input
                                    ref={nameRef}
                                    type="text" name="name"
                                    value={form.name} onChange={handleChange} required
                                    placeholder="e.g. Premium Haircut, Deep Cleaning"
                                    className="csm-input"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>
                                    DESCRIPTION <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <textarea
                                    name="description" value={form.description}
                                    onChange={handleChange} required rows={4}
                                    placeholder="What does this service include?"
                                    className="csm-input"
                                    style={{ resize: "none", lineHeight: 1.6 }}
                                />
                                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>
                                    {form.description.length} characters
                                </p>
                            </div>

                            {/* Pre-payment toggle */}
                            <div
                                onClick={() => setForm(prev => ({ ...prev, pre_payment_required: !prev.pre_payment_required }))}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                                    padding: "13px 16px", borderRadius: 14, cursor: "pointer", userSelect: "none",
                                    border: `2px solid ${form.pre_payment_required ? "#fdba74" : "#e2e8f0"}`,
                                    background: form.pre_payment_required ? "#fff7ed" : "#f8fafc",
                                    transition: "all .18s",
                                }}
                            >
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Require Pre-payment</p>
                                    <p style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>Customers must pay before the service is confirmed</p>
                                </div>
                                <div style={{
                                    position: "relative", width: 44, height: 24, borderRadius: 999, flexShrink: 0,
                                    background: form.pre_payment_required ? "#f97316" : "#cbd5e1",
                                    transition: "background .2s",
                                }}>
                                    <div style={{
                                        position: "absolute", top: 3, left: 3, width: 18, height: 18,
                                        background: "#fff", borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,.18)",
                                        transition: "transform .2s",
                                        transform: form.pre_payment_required ? "translateX(20px)" : "translateX(0)",
                                    }} />
                                </div>
                            </div>

                            {/* Category pill */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em" }}>Category</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#3730a3" }}>{categoryName}</span>
                            </div>

                            <div style={{ height: 1, background: "linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} />

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="button" onClick={onClose}
                                    style={{ flex: 1, padding: "12px", borderRadius: 14, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit", cursor: "pointer" }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !form.name.trim()}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: 14, border: "none",
                                        fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                        background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                                        boxShadow: "0 4px 16px rgba(79,70,229,.3)",
                                        opacity: (isLoading || !form.name.trim()) ? 0.6 : 1,
                                        cursor: (isLoading || !form.name.trim()) ? "not-allowed" : "pointer",
                                        transition: "opacity .15s",
                                    }}
                                >
                                    {isLoading
                                        ? <><span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} /> Creating…</>
                                        : <><Save size={14} /> Create Service</>
                                    }
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* ── Success state ── */
                        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
                            <div
                                className="pop-enter"
                                style={{
                                    width: 62, height: 62, borderRadius: "50%",
                                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                                    boxShadow: "0 6px 24px rgba(34,197,94,.35)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 14px",
                                }}
                            >
                                <Check size={28} color="#fff" />
                            </div>
                            <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 5 }}>Service Created!</p>
                            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
                                <strong style={{ color: "#0f172a" }}>{createdName}</strong> has been added to{" "}
                                <strong style={{ color: "#0f172a" }}>{categoryName}</strong>.
                            </p>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button onClick={onClose}
                                    style={{ flex: 1, padding: "11px", borderRadius: 13, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit", cursor: "pointer" }}>
                                    Done
                                </button>
                                <button
                                    onClick={handleCreateAnother}
                                    style={{
                                        flex: 1, padding: "11px", borderRadius: 13, border: "none",
                                        fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                                        background: "linear-gradient(135deg,#4f46e5,#6366f1)",
                                        boxShadow: "0 4px 14px rgba(79,70,229,.3)", cursor: "pointer",
                                    }}
                                >
                                    <Plus size={14} /> Create Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── CategoryServicesPage ──────────────────────────────────────────────────── */
const CategoryServicesPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const categoryName = location.state?.categoryName || "Category";

    const [searchTerm, setSearchTerm]           = useState("");
    const [showDeleteModal, setShowDeleteModal]  = useState(false);
    const [selectedService, setSelectedService]  = useState(null);
    const [deleteSuccess, setDeleteSuccess]      = useState(false);
    const [sort, setSort]                        = useState({ key: null, dir: "asc" });
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [disableReason, setDisableReason]      = useState("");
    const [serviceToDisable, setServiceToDisable] = useState(null);

    // ── NEW: controls the inline Create Service modal ──
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data: response, isLoading, error, refetch } = useGetServicesByBusinessQuery();
    const allServices  = response || [];
    const businessId   = localStorage.getItem("business_id");
    const { data: pricesResponse } = useGetPricesByBusinessQuery(businessId);
    const allPrices = pricesResponse?.data || pricesResponse || [];

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

    const [deleteService, { isLoading: isDeleting }]  = useDeleteServiceMutation();
    const [updateService, { isLoading: isUpdating }]  = useUpdateServiceMutation();

    const toggleSort = (key) =>
        setSort(p => p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });

    const handleOpenDelete   = (s)  => { setSelectedService(s); setDeleteSuccess(false); setShowDeleteModal(true); };
    const handleCloseDelete  = ()   => { setShowDeleteModal(false); setSelectedService(null); setDeleteSuccess(false); };
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

    const Th = ({ label, col, className = "" }) => (
        <th onClick={() => col && toggleSort(col)}
            className={`px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest select-none whitespace-nowrap ${col ? "cursor-pointer hover:text-indigo-600 transition-colors" : ""} ${className}`}>
            {label}{col && <SortIcon active={sort.key === col} dir={sort.dir} />}
        </th>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 p-8 fade-enter">
            <GlobalStyles />
            <button onClick={handleBackToCategories}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm font-medium transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
            </button>
            <div className="text-center py-12"><p className="text-red-500 font-semibold">Error loading services</p></div>
        </div>
    );

    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Back */}
                    <button onClick={handleBackToCategories}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 text-sm font-medium transition-colors group page-enter">
                        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Categories
                    </button>

                    {/* Header banner */}
                    <div className="page-enter rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                        style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1 55%,#818cf8)", boxShadow: "0 12px 40px rgba(79,70,229,.28)" }}>
                        <div>
                            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Services</p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{categoryName}</h1>
                            <p className="text-indigo-200 text-sm mt-1">
                                {categoryServices.length} service{categoryServices.length !== 1 ? "s" : ""}&nbsp;·&nbsp;
                                Total value: <span className="text-white font-bold">₹{totalPrice.toLocaleString()}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex flex-col items-center px-5 py-3 rounded-2xl"
                                style={{ background: "rgba(34,197,94,.22)", backdropFilter: "blur(8px)", border: "1px solid rgba(134,239,172,.35)", minWidth: 90 }}>
                                <span className="text-2xl font-bold text-white leading-none">{activeCount}</span>
                                <span className="text-green-200 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">Active</span>
                            </div>
                            <div className="flex flex-col items-center px-5 py-3 rounded-2xl"
                                style={{ background: "rgba(255,255,255,.12)", backdropFilter: "blur(8px)", minWidth: 110 }}>
                                <span className="text-2xl font-bold text-white leading-none">₹{totalPrice > 0 ? totalPrice.toLocaleString() : "0"}</span>
                                <span className="text-indigo-200 text-[11px] font-semibold mt-0.5 uppercase tracking-wide">Total Value</span>
                            </div>

                            {/* ── Opens modal instead of navigating away ── */}
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="create-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-700"
                                style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,.12)" }}
                            >
                                <Plus size={16} /> Create Service
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="page-enter search-wrap mb-6" style={{ animationDelay: ".06s" }}>
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                        <input type="text" placeholder="Search by name or description…" value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-10 py-3.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none transition-all placeholder-slate-400 font-medium"
                            style={{ boxShadow: "0 2px 12px rgba(0,0,0,.04)" }} />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
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
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
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
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 fade-enter" style={{ boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{ background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)" }}>
                                <Package size={28} className="text-indigo-400" />
                            </div>
                            <p className="text-slate-700 font-bold text-lg mb-1">{searchTerm ? `No results for "${searchTerm}"` : "No services yet"}</p>
                            <p className="text-sm text-slate-400 mb-7">{searchTerm ? "Try a different search term" : "Add your first service to get started"}</p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="create-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                                    style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>
                                    <Plus size={16} /> Add First Service
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden page-enter"
                            style={{ animationDelay: ".12s", boxShadow: "0 4px 28px rgba(0,0,0,.07)" }}>
                            <div className="table-scroll overflow-x-auto">
                                <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                                    <thead>
                                        <tr style={{ background: "linear-gradient(90deg,#f8faff,#f1f5fe)" }}>
                                            <Th label="#" className="w-14 text-center" />
                                            <Th label="Service"     col="name"        className="min-w-[190px]" />
                                            <Th label="Description" col="description" className="col-desc min-w-[220px]" />
                                            <Th label="Price"       col="price"       className="w-40" />
                                            <Th label="Status"      col="status"      className="col-status w-28" />
                                            <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-36">Manage</th>
                                            <th className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-32">Actions</th>
                                        </tr>
                                        <tr><td colSpan={7}><div style={{ height:1, background:"linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} /></td></tr>
                                    </thead>
                                    <tbody>
                                        {filteredServices.map((service, idx) => (
                                            <tr key={service.id}
                                                onClick={() => navigate(`/dashboard/services/${service.id}`)}
                                                className="table-row border-b border-slate-50 row-enter"
                                                style={{ animationDelay: `${idx * 0.04}s` }}>

                                                <td className="px-5 py-5 text-center">
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                                                        style={{ background:"#eef2ff", color:"#4f46e5" }}>{idx + 1}</span>
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
                                                        <button data-tip="View Prices"
                                                            onClick={e => { e.stopPropagation(); navigate(`/dashboard/services/${service.id}/prices`); }}
                                                            className="icon-btn eye-btn" style={{ background:"#eef2ff", color:"#4f46e5" }}>
                                                            <Eye size={15} />
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5 col-status"><StatusPill status={service.status || "active"} /></td>

                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-1.5">
                                                        <button data-tip="Descriptions"
                                                            onClick={e => { e.stopPropagation(); navigate(`/dashboard/services/${service.id}/descriptions`); }}
                                                            className="icon-btn desc-btn" style={{ background:"#faf5ff", color:"#9333ea" }}>
                                                            <FileText size={15} />
                                                        </button>
                                                        <button data-tip="Metadata"
                                                            onClick={e => { e.stopPropagation(); navigate(`/dashboard/services/${service.id}/metadata`); }}
                                                            className="icon-btn meta-btn" style={{ background:"#fffbeb", color:"#d97706" }}>
                                                            <Database size={15} />
                                                        </button>
                                                        <button data-tip="Zones"
                                                            onClick={e => { e.stopPropagation(); navigate(`/dashboard/services/${service.id}/zones`); }}
                                                            className="icon-btn zone-btn" style={{ background:"#eff6ff", color:"#2563eb" }}>
                                                            <MapPin size={15} />
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <div className="flex items-center gap-1.5">
                                                        <button data-tip={service.status?.toLowerCase() === "active" ? "Disable Service" : "Enable Service"}
                                                            onClick={e => { e.stopPropagation(); handleToggleService(service); }}
                                                            className={`icon-btn ${service.status?.toLowerCase() === "active" ? "disable-btn" : "enable-btn"}`}
                                                            style={{ background: service.status?.toLowerCase() === "active" ? "#fffbeb" : "#f0fdf4", color: service.status?.toLowerCase() === "active" ? "#d97706" : "#16a34a" }}>
                                                            <Power size={15} />
                                                        </button>
                                                        <button data-tip="Edit"
                                                            onClick={e => { e.stopPropagation(); navigate(`/dashboard/services/update/${service.id}`); }}
                                                            className="icon-btn edit-btn" style={{ background:"#f0fdf4", color:"#16a34a" }}>
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button data-tip="Delete"
                                                            onClick={e => { e.stopPropagation(); handleOpenDelete(service); }}
                                                            className="icon-btn del-btn" style={{ background:"#fef2f2", color:"#dc2626" }}>
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

            {/* ══ Create Service Modal — renders on top, no navigation ══ */}
            {showCreateModal && (
                <CreateServiceModal
                    categoryId={categoryId}
                    categoryName={categoryName}
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => refetch?.()}
                />
            )}

            {/* Disable Modal */}
            {showDisableModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
                    style={{ background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)", animation:"fadeIn .2s ease" }}>
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md modal-enter" style={{ boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Disable Service</h2>
                                <p className="text-sm text-slate-500 mt-1">{serviceToDisable?.name}</p>
                            </div>
                            <button onClick={closeDisableModal} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={18} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Disabling <span className="text-red-500">*</span></label>
                            <textarea value={disableReason} onChange={e => setDisableReason(e.target.value)}
                                placeholder="e.g., Under maintenance, Staff unavailable, Equipment repair..." rows={4}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all resize-none" />
                            <p className="text-xs text-slate-500 mt-2">This service will not be available for new bookings until re-enabled.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={closeDisableModal}
                                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border-2 border-slate-200 hover:bg-slate-50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleDisableConfirm} disabled={!disableReason.trim() || isUpdating}
                                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60"
                                style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", boxShadow:"0 4px 16px rgba(245,158,11,.35)" }}>
                                {isUpdating ? "Disabling..." : "Disable Service"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
                    style={{ background:"rgba(15,23,42,.5)", backdropFilter:"blur(4px)", animation:"fadeIn .2s ease" }}>
                    <div className="bg-white rounded-3xl p-7 w-full max-w-sm modal-enter" style={{ boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
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
                                    <button onClick={handleCloseDelete} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
                                        <X size={17} className="text-slate-400" />
                                    </button>
                                </div>
                                <div className="rounded-2xl p-4 mb-6" style={{ background:"#fef2f2", border:"1px solid #fecaca" }}>
                                    <p className="text-sm text-slate-600">Are you sure you want to delete <span className="font-bold text-slate-900">{selectedService?.name}</span>?</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleCloseDelete}
                                        className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteSubmit} disabled={isDeleting}
                                        className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-60"
                                        style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", boxShadow:"0 4px 16px rgba(239,68,68,.35)" }}>
                                        {isDeleting ? "Deleting…" : "Delete"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6 fade-enter">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ background:"linear-gradient(135deg,#dcfce7,#bbf7d0)" }}>
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