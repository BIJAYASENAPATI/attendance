import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
    useGetAllServicesQuery,
    useGetAllServiceCategoriesQuery,
    useDeleteServiceMutation,
    useUpdateServiceMutation,
    useCreateServiceMutation,
    useCreateServiceCategoryMutation,
    useUpdateServiceCategoryMutation,
    useDeleteServiceCategoryMutation,
    useGetPricesByBusinessQuery,
    useCreateServicePriceMutation,
    useUpdateServicePriceMutation,
    useDeleteServicePriceMutation,
} from "../../../app/service/slice";
import {
    Search, Plus, Edit, Trash2, Check, X,
    ChevronDown, Grid, List, User,
    IndianRupee, FolderPlus, Sparkles, Tag,
    MoreVertical, Pencil, Loader2, Save, Eye, Calculator,
} from "lucide-react";

const GlobalStyles = () => (
    <style>{`
        * { box-sizing: border-box; }
        button, a, [role="button"] { cursor: pointer !important; }
        button:disabled { cursor: not-allowed !important; opacity: .6; }
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-14px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(.95); }
            to   { opacity: 1; transform: scale(1); }
        }
        @keyframes popIn {
            0%   { transform: scale(0); opacity: 0; }
            60%  { transform: scale(1.18); }
            100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position:  400px 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sm-panel { animation: slideDown .34s cubic-bezier(.22,1,.36,1) both; }
        .sm-modal { animation: fadeInScale .28s cubic-bezier(.22,1,.36,1) both; }
        .sm-pop   { animation: popIn .38s cubic-bezier(.22,1,.36,1) both; }
        .sm-shimmer {
            background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
            background-size: 400px 100%;
            animation: shimmer 1.4s infinite linear;
            border-radius: 10px;
        }
        .sm-row:hover { background: #eff6ff !important; }
        .sm-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 32px rgba(59,130,246,.13) !important;
            border-color: #bfdbfe !important;
        }
        .sm-card { transition: transform .18s, box-shadow .18s, border-color .18s; }
        .sm-btn-primary {
            background: linear-gradient(135deg,#2563eb,#4f46e5) !important;
            box-shadow: 0 4px 16px rgba(37,99,235,.32);
            transition: filter .18s, transform .14s !important;
        }
        .sm-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .sm-btn-primary:active { transform: scale(.97); }
        .sm-input { outline: none; transition: border-color .18s, box-shadow .18s; }
        .sm-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,.16) !important; }
        .sm-input[type=number]::-webkit-inner-spin-button,
        .sm-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .sm-input[type=number] { -moz-appearance: textfield; appearance: textfield; }
        .sm-chip { display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:999px;font-size:11px;font-weight:700;background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe;cursor:pointer;transition:background .14s; }
        .sm-chip:hover { background:#dbeafe; }
        .sm-tab-active { background:linear-gradient(135deg,#2563eb,#4f46e5)!important; color:#fff!important; border:none!important; box-shadow:0 3px 12px rgba(37,99,235,.3)!important; }
        .sm-tab { background:#fff;color:#475569;border:1.5px solid #e2e8f0;transition:all .16s; }
        .sm-tab:hover { background:#f8fafc; }
        .sm-edit-btn { background:#eff6ff!important;color:#2563eb!important;transition:background .14s; }
        .sm-edit-btn:hover { background:#dbeafe!important; }
        .sm-del-btn  { background:#fff1f2!important;color:#e11d48!important;transition:background .14s; }
        .sm-del-btn:hover  { background:#ffe4e6!important; }

        /* kebab trigger on tab hover */
        .cat-tab-wrapper { position: relative; display: inline-flex; }
        .cat-kebab-btn {
            opacity: 0; pointer-events: none;
            width: 18px; height: 18px; border-radius: 5px;
            background: transparent; border: none;
            display: flex; align-items: center; justify-content: center;
            transition: opacity .15s, background .13s;
            flex-shrink: 0;
        }
        .cat-tab-wrapper:hover .cat-kebab-btn {
            opacity: 1; pointer-events: auto;
        }
        .cat-kebab-btn:hover { background: rgba(0,0,0,.08) !important; }
        .sm-tab-active .cat-kebab-btn:hover { background: rgba(255,255,255,.25) !important; }

        /* shared centered overlay */
        .sm-overlay {
            position: fixed; inset: 0; z-index: 50;
            background: rgba(15,23,42,.55);
            backdrop-filter: blur(5px);
            display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        /* overlay without dark bg - for category modal */
        .sm-overlay-clear {
            position: fixed; inset: 0; z-index: 50;
            display: flex; align-items: center; justify-content: center; padding: 16px;
            pointer-events: none;
        }
        .sm-overlay-clear > * { pointer-events: auto; }
    `}</style>
);

const STATUS_STYLES = {
    Active:   { bg: "#dcfce7", color: "#15803d", dot: "#22c55e", border: "#bbf7d0" },
    Inactive: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316", border: "#fed7aa" },
};

const Spin = () => (
    <span style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
);

/* ─── Price Modal (View / Create / Edit / Delete) ───────────────────────── */
const PriceModal = ({ service, existingPrice, onClose, onSaved }) => {
    const [view, setView] = useState(existingPrice ? "view" : "create");
    const [createPrice, { isLoading: isCreating }] = useCreateServicePriceMutation();
    const [updatePrice, { isLoading: isUpdating }] = useUpdateServicePriceMutation();
    const [deletePrice, { isLoading: isDeleting }] = useDeleteServicePriceMutation();
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState(existingPrice ? {
        price: existingPrice.price || "",
        sac_code: existingPrice.sac_code || "",
        is_gst_applicable: existingPrice.is_gst_applicable || false,
        cgst_percent: existingPrice.cgst_percent || 0,
        sgst_percent: existingPrice.sgst_percent || 0,
        igst_percent: existingPrice.igst_percent || 0,
    } : { price: "", sac_code: "", is_gst_applicable: false, cgst_percent: 0, sgst_percent: 0, igst_percent: 0 });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const calcTotal = () => {
        const base = Number(form.price) || 0;
        if (!form.is_gst_applicable) return base;
        const tax = (base * (Number(form.cgst_percent) + Number(form.sgst_percent) + Number(form.igst_percent))) / 100;
        return base + tax;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createPrice({ service_id: Number(service.id), price: Number(form.price), sac_code: form.sac_code, is_gst_applicable: form.is_gst_applicable, cgst_percent: Number(form.cgst_percent), sgst_percent: Number(form.sgst_percent), igst_percent: Number(form.igst_percent) }).unwrap();
            setSuccess("created"); onSaved?.(); setTimeout(onClose, 2000);
        } catch (err) { alert(err?.data?.message || "Failed to create price"); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updatePrice({ id: existingPrice.id, price: Number(form.price), sac_code: form.sac_code, is_gst_applicable: form.is_gst_applicable, cgst_percent: Number(form.cgst_percent), sgst_percent: Number(form.sgst_percent), igst_percent: Number(form.igst_percent) }).unwrap();
            setSuccess("updated"); onSaved?.(); setTimeout(onClose, 2000);
        } catch (err) { alert(err?.data?.message || "Failed to update price"); }
    };

    const inputStyle = { width: "100%", padding: "10px 13px", fontSize: 13, fontWeight: 500, border: "1.5px solid #e2e8f0", borderRadius: 12, background: "#fff", color: "#1e293b", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

    const headerGrad = {
        view:   "linear-gradient(135deg,#4f46e5 0%,#6366f1 55%,#818cf8 100%)",
        create: "linear-gradient(135deg,#16a34a 0%,#22c55e 60%,#4ade80 100%)",
        edit:   "linear-gradient(135deg,#0ea5e9 0%,#2563eb 100%)",
    };

    const isSubmitting = isCreating || isUpdating;
    const submitLabel  = view === "create" ? "Set Price" : "Save Changes";

    const formJSX = (
        <form onSubmit={view === "create" ? handleCreate : handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            {/* Price + SAC row */}
            <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Base Price (₹) *</label>
                    <div style={{ position: "relative" }}>
                        <IndianRupee size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            step="0.01"
                            placeholder="0.00"
                            autoComplete="off"
                            className="sm-input"
                            style={{ ...inputStyle, paddingLeft: 30 }}
                        />
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>SAC Code</label>
                    <input
                        type="text"
                        name="sac_code"
                        value={form.sac_code}
                        onChange={handleChange}
                        placeholder="e.g. 998314"
                        autoComplete="off"
                        className="sm-input"
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* GST Toggle */}
            <div
                onClick={() => setForm(prev => ({ ...prev, is_gst_applicable: !prev.is_gst_applicable }))}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 12, cursor: "pointer", userSelect: "none", border: `2px solid ${form.is_gst_applicable ? "#fdba74" : "#e2e8f0"}`, background: form.is_gst_applicable ? "#fff7ed" : "#f8fafc", transition: "all .15s" }}
            >
                <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>GST Applicable</p>
                    <p style={{ fontSize: 11, color: "#64748b", marginTop: 2, marginBottom: 0 }}>Include tax in final price</p>
                </div>
                <div style={{ position: "relative", width: 40, height: 22, borderRadius: 999, flexShrink: 0, background: form.is_gst_applicable ? "#f97316" : "#cbd5e1", transition: "background .2s" }}>
                    <div style={{ position: "absolute", top: 2, left: 2, width: 18, height: 18, background: "#fff", borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,.18)", transition: "transform .2s", transform: form.is_gst_applicable ? "translateX(18px)" : "translateX(0)" }} />
                </div>
            </div>

            {/* GST fields */}
            {form.is_gst_applicable && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[["cgst_percent", "CGST %"], ["sgst_percent", "SGST %"], ["igst_percent", "IGST %"]].map(([field, label]) => (
                        <div key={field}>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{label}</label>
                            <input
                                type="number"
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                                step="0.01"
                                autoComplete="off"
                                className="sm-input"
                                style={{ ...inputStyle, padding: "8px 10px" }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Total */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Calculator size={14} color="#16a34a" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.08em" }}>Total Amount</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#15803d" }}>₹{calcTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 9 }}>
                <button type="button" onClick={() => existingPrice ? setView("view") : onClose()}
                    style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit", cursor: "pointer" }}>
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting || !form.price} className="sm-btn-primary"
                    style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    {isSubmitting ? <><Spin /> Saving…</> : <><Save size={13} /> {submitLabel}</>}
                </button>
            </div>
        </form>
    );

    return (
        <div className="sm-overlay">
            <div className="sm-modal" style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 500, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.22)" }}>

                {/* Header */}
                <div style={{ background: headerGrad[view], padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {view === "view" ? <Eye size={17} color="#fff" /> : view === "create" ? <Plus size={17} color="#fff" /> : <Edit size={17} color="#fff" />}
                        </div>
                        <div>
                            <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0 }}>
                                {view === "view" ? "Price Details" : view === "create" ? "Set Price" : "Edit Price"}
                            </p>
                            <p style={{ color: "rgba(255,255,255,.65)", fontSize: 11, marginTop: 2, marginBottom: 0 }}>{service?.name || service?.service_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <X size={13} color="#fff" />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "20px 22px 22px" }}>
                    {success ? (
                        <div style={{ textAlign: "center", padding: "18px 0 6px" }}>
                            <div className="sm-pop" style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 6px 24px rgba(34,197,94,.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                <Check size={26} color="#fff" />
                            </div>
                            <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>
                                {success === "created" ? "Price Set!" : "Price Updated!"}
                            </p>
                            <p style={{ fontSize: 13, color: "#64748b" }}>
                                ₹{calcTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} saved.
                            </p>
                        </div>
                    ) : view === "view" ? (
                        /* ── VIEW ── */
                        <div>
                            <div style={{ padding: "16px 18px", borderRadius: 16, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0", marginBottom: 16 }}>
                                <p style={{ fontSize: 10, fontWeight: 800, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Total Price</p>
                                <p style={{ fontSize: 28, fontWeight: 900, color: "#14532d", margin: 0 }}>₹{Number(existingPrice?.total_price || 0).toLocaleString()}</p>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                                {[
                                    ["Base Price", `₹${existingPrice?.price || 0}`],
                                    ["SAC Code", existingPrice?.sac_code || "—"],
                                    ["GST", existingPrice?.is_gst_applicable ? "Applicable" : "Not Applicable"],
                                    ["CGST", `${existingPrice?.cgst_percent || 0}%`],
                                    ["SGST", `${existingPrice?.sgst_percent || 0}%`],
                                    ["IGST", `${existingPrice?.igst_percent || 0}%`],
                                ].map(([label, val]) => (
                                    <div key={label} style={{ padding: "10px 13px", borderRadius: 11, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                                        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3, margin: "0 0 3px" }}>{label}</p>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>{val}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 9 }}>
                                <button onClick={() => setView("edit")}
                                    style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid #bfdbfe", background: "#eff6ff", fontSize: 13, fontWeight: 700, color: "#2563eb", fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .15s" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}>
                                    <Edit size={13} /> Edit Price
                                </button>
                            </div>
                        </div>
                    ) : formJSX}
                </div>
            </div>
        </div>
    );
};



/* ─── Create Category Modal (opens as overlay with dark backdrop) ─────────── */
const CreateCategoryPanel = ({ onClose, onCreated }) => {
    const [createCategory, { isLoading }] = useCreateServiceCategoryMutation();
    const [name, setName] = useState("");
    const [success, setSuccess] = useState(false);
    const [createdName, setCreatedName] = useState("");
    const inputRef = useRef(null);
    useEffect(() => { setTimeout(() => inputRef.current?.focus(), 120); }, []);

    let business_id = null;
    const token = localStorage.getItem("token");
    if (token) { try { const d = jwtDecode(token); business_id = d.business_id; } catch { } }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (!business_id) { alert("Business ID not found. Please login again."); return; }
        try {
            await createCategory({ name: name.trim(), business_id }).unwrap();
            setCreatedName(name.trim());
            setSuccess(true);
            onCreated?.();
            setTimeout(() => { setName(""); setSuccess(false); onClose(); }, 2400);
        } catch (err) { alert(err?.data?.message || "Failed to create category"); }
    };

    return (
        <div className="sm-overlay">
            <div className="sm-modal" style={{
                borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: 620,
                boxShadow: "0 32px 80px rgba(0,0,0,.28), 0 6px 28px rgba(99,102,241,.2)",
                border: "2px solid rgba(99,102,241,.25)",
            }}>
                {/* Gradient Header — matches the image exactly */}
                <div style={{
                    background: "linear-gradient(135deg,#1d4ed8 0%,#4f46e5 55%,#7c3aed 100%)",
                    padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 11,
                            background: "rgba(255,255,255,.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <FolderPlus size={17} color="#fff" />
                        </div>
                        <div>
                            <p style={{ color: "#fff", fontWeight: 800, fontSize: 14, margin: 0 }}>New Service Category</p>
                            <p style={{ color: "rgba(255,255,255,.65)", fontSize: 11, marginTop: 2, marginBottom: 0 }}>Group your services for easy navigation</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: "rgba(255,255,255,.16)",
                            border: "1px solid rgba(255,255,255,.28)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >
                        <X size={14} color="#fff" />
                    </button>
                </div>

                {/* Body — light gradient background */}
                <div style={{
                    background: "linear-gradient(135deg,#f0f7ff 0%,#f5f3ff 100%)",
                    padding: "20px 20px 22px",
                }}>
                    {!success ? (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: 190 }}>
                                    <label style={{
                                        display: "block", fontSize: 10, fontWeight: 800, color: "#6366f1",
                                        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7,
                                    }}>
                                        Category Name <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <div style={{ position: "relative" }}>
                                        <Tag size={14} style={{
                                            position: "absolute", left: 11, top: "50%",
                                            transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none",
                                        }} />
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            className="sm-input"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder='e.g. "Hair Styling", "Spa Services"…'
                                            required
                                            style={{
                                                width: "100%", padding: "11px 12px 11px 33px",
                                                border: "1.5px solid #c7d2fe", borderRadius: 12,
                                                fontSize: 13, color: "#1e293b", background: "#fff",
                                                fontFamily: "inherit",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        style={{
                                            padding: "11px 18px", borderRadius: 12,
                                            border: "1.5px solid #e0e7ff", background: "#fff",
                                            fontSize: 13, fontWeight: 600, color: "#64748b",
                                            fontFamily: "inherit", whiteSpace: "nowrap",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !name.trim()}
                                        className="sm-btn-primary"
                                        style={{
                                            padding: "11px 22px", borderRadius: 12, border: "none",
                                            fontSize: 13, fontWeight: 700, color: "#fff",
                                            fontFamily: "inherit", whiteSpace: "nowrap",
                                            display: "flex", alignItems: "center", gap: 7,
                                        }}
                                    >
                                        {isLoading ? <><Spin /> Creating…</> : <><Sparkles size={14} /> Create Category</>}
                                    </button>
                                </div>
                            </div>
                            <div style={{ marginTop: 13, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Quick fill:</span>
                                {["Hair Styling", "Spa Services", "Coaching", "Wellness", "Fitness", "Massage"].map(hint => (
                                    <button key={hint} type="button" className="sm-chip" onClick={() => setName(hint)}>
                                        <Plus size={9} /> {hint}
                                    </button>
                                ))}
                            </div>
                        </form>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <div className="sm-pop" style={{
                                width: 44, height: 44, borderRadius: "50%",
                                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                                boxShadow: "0 4px 16px rgba(34,197,94,.35)",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                                <Check size={22} color="#fff" />
                            </div>
                            <div>
                                <p style={{ fontWeight: 800, color: "#15803d", fontSize: 14, margin: 0 }}>Category created!</p>
                                <p style={{ fontSize: 12, color: "#64748b", marginTop: 2, marginBottom: 0 }}>
                                    <strong style={{ color: "#0f172a" }}>{createdName}</strong> is ready to use.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Edit Service Modal ─────────────────────────────────────────────────── */
const EditServiceModal = ({ service, categories, onClose }) => {
    const [updateService, { isLoading }] = useUpdateServiceMutation();
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: service?.name || service?.service_name || "",
        description: service?.description || service?.service_description || "",
        pre_payment_required: service?.pre_payment_required || false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateService({ id: service.id, data: form }).unwrap();
            setSuccess(true);
            setTimeout(onClose, 1800);
        } catch (err) { alert(err?.data?.message || "Failed to update service"); }
    };

    return (
        <div className="sm-overlay">
            <div className="sm-modal" style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 480, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.22)" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "22px 22px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 13, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Edit size={19} color="#2563eb" />
                        </div>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>Edit Service</p>
                            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{service?.name || service?.service_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ padding: 7, borderRadius: 9, border: "none", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={15} color="#64748b" />
                    </button>
                </div>

                <div style={{ height: 1, background: "#f1f5f9", margin: "0 22px" }} />

                {/* Body */}
                <div style={{ padding: "18px 22px 22px" }}>
                    {!success ? (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                                {/* Service Name */}
                                <div>
                                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>
                                        Service Name <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <input
                                        type="text" name="name" value={form.name} onChange={handleChange} required
                                        placeholder="e.g. Deep Cleaning, Hair Cut"
                                        className="sm-input"
                                        style={{ width: "100%", padding: "11px 14px", fontSize: 14, fontWeight: 500, border: "1.5px solid #e2e8f0", borderRadius: 14, background: "#fff", outline: "none", color: "#1e293b", fontFamily: "inherit" }}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 7 }}>
                                        Description <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <textarea
                                        name="description" value={form.description} onChange={handleChange} required
                                        rows={4} placeholder="Describe what this service includes…"
                                        className="sm-input"
                                        style={{ width: "100%", padding: "11px 14px", fontSize: 14, fontWeight: 500, border: "1.5px solid #e2e8f0", borderRadius: 14, background: "#fff", outline: "none", color: "#1e293b", fontFamily: "inherit", resize: "none", lineHeight: 1.6 }}
                                    />
                                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>{form.description.length} characters</p>
                                </div>

                                {/* Pre-payment Toggle */}
                                <div
                                    onClick={() => setForm(prev => ({ ...prev, pre_payment_required: !prev.pre_payment_required }))}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                                        padding: "14px 16px", borderRadius: 16, cursor: "pointer", userSelect: "none",
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

                                {/* Divider */}
                                <div style={{ height: 1, background: "linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} />

                                {/* Buttons */}
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button type="button" onClick={onClose}
                                        style={{ flex: 1, padding: "12px", borderRadius: 14, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit", cursor: "pointer" }}>
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isLoading || !form.name.trim()} className="sm-btn-primary"
                                        style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                        {isLoading ? <><Spin /> Updating…</> : <><Check size={14} /> Save Changes</>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
                            <div className="sm-pop" style={{ width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 6px 24px rgba(34,197,94,.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                                <Check size={28} color="#fff" />
                            </div>
                            <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 5 }}>Updated!</p>
                            <p style={{ fontSize: 13, color: "#94a3b8" }}>Service saved successfully.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Create Service Modal ───────────────────────────────────────────────── */
const CreateServiceModal = ({ category, onClose, onCreated }) => {
    const [createService, { isLoading }] = useCreateServiceMutation();
    const [success, setSuccess] = useState(false);
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
            await createService({ ...form, category_id: Number(category?.id) }).unwrap();
            setCreatedName(form.name);
            setSuccess(true);
            onCreated?.();
            setTimeout(onClose, 2200);
        } catch (err) { alert(err?.data?.message || "Failed to create service"); }
    };

    const handleReset = () => { setForm({ name: "", description: "", pre_payment_required: false }); setSuccess(false); setCreatedName(""); };

    return (
        <div className="sm-overlay">
            <div className="sm-modal" style={{
                background: "#fff", borderRadius: 24, width: "100%", maxWidth: 520,
                overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.22)",
            }}>
                {/* Header */}
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
                                Adding to <strong style={{ color: "rgba(255,255,255,.9)" }}>{category?.name}</strong>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width: 30, height: 30, borderRadius: 9,
                        background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
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
                                    Service Name <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <input
                                    ref={nameRef} type="text" name="name"
                                    value={form.name} onChange={handleChange} required
                                    placeholder="e.g. Premium Haircut, Deep Cleaning"
                                    className="sm-input"
                                    style={{ width: "100%", padding: "11px 14px", fontSize: 13, fontWeight: 500, border: "1.5px solid #e2e8f0", borderRadius: 13, background: "#fff", color: "#1e293b", fontFamily: "inherit" }}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 7 }}>
                                    Description <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <textarea
                                    name="description" value={form.description}
                                    onChange={handleChange} required rows={4}
                                    placeholder="What does this service include?"
                                    className="sm-input"
                                    style={{ width: "100%", padding: "11px 14px", fontSize: 13, fontWeight: 500, border: "1.5px solid #e2e8f0", borderRadius: 13, background: "#fff", color: "#1e293b", fontFamily: "inherit", resize: "none", lineHeight: 1.6 }}
                                />
                                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>{form.description.length} characters</p>
                            </div>

                            {/* Pre-payment Toggle */}
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
                                <div style={{ position: "relative", width: 44, height: 24, borderRadius: 999, flexShrink: 0, background: form.pre_payment_required ? "#f97316" : "#cbd5e1", transition: "background .2s" }}>
                                    <div style={{ position: "absolute", top: 3, left: 3, width: 18, height: 18, background: "#fff", borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,.18)", transition: "transform .2s", transform: form.pre_payment_required ? "translateX(20px)" : "translateX(0)" }} />
                                </div>
                            </div>

                            {/* Category pill */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em" }}>Category</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#3730a3" }}>{category?.name}</span>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} />

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: 10 }}>
                                <button type="button" onClick={onClose}
                                    style={{ flex: 1, padding: "12px", borderRadius: 14, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit", cursor: "pointer" }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading || !form.name.trim()} className="sm-btn-primary"
                                    style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                    {isLoading ? <><Spin /> Creating…</> : <><Save size={14} /> Create Service</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
                            <div className="sm-pop" style={{ width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 6px 24px rgba(34,197,94,.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                                <Check size={28} color="#fff" />
                            </div>
                            <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 5 }}>Service Created!</p>
                            <p style={{ fontSize: 13, color: "#64748b" }}>
                                <strong style={{ color: "#0f172a" }}>{createdName}</strong> has been added to <strong style={{ color: "#0f172a" }}>{category?.name}</strong>.
                            </p>
                            <button onClick={handleReset} className="sm-btn-primary"
                                style={{ marginTop: 18, padding: "10px 22px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7 }}>
                                <Plus size={14} /> Create Another
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Category Action Modal (Edit + Delete picker, then sub-modals) ──────── */
const CategoryActionModal = ({ category, onClose, onCatDeleted, onCreateService }) => {
    const [view, setView] = useState("pick");

    const [updateCategory, { isLoading: isUpdating }] = useUpdateServiceCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteServiceCategoryMutation();

    const [editName, setEditName] = useState(category?.name || "");
    const [editSuccess, setEditSuccess] = useState(false);
    const [delSuccess, setDelSuccess] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (view === "edit") setTimeout(() => inputRef.current?.focus(), 120);
    }, [view]);

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return;
        try {
            await updateCategory({ id: category.id, data: { name: editName.trim() } }).unwrap();
            setEditSuccess(true);
            setTimeout(onClose, 1800);
        } catch (err) { alert(err?.data?.message || "Failed to update"); }
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(category.id).unwrap();
            setDelSuccess(true);
            onCatDeleted?.();
            setTimeout(onClose, 1800);
        } catch (err) { alert(err?.data?.message || "Failed to delete"); }
    };

    return (
        <div className="sm-overlay-clear">
            <div className="sm-modal" style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 380, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.10)", border: "1.5px solid #e2e8f0" }}>

                {view === "pick" && (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "22px 22px 0" }}>
                            <div>
                                <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>Manage Category</p>
                                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                                    <span style={{ background: "#ede9fe", color: "#6366f1", fontWeight: 700, padding: "2px 9px", borderRadius: 999, fontSize: 11 }}>{category?.name}</span>
                                </p>
                            </div>
                            <button onClick={onClose} style={{ padding: 7, borderRadius: 9, border: "none", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <X size={15} color="#64748b" />
                            </button>
                        </div>

                        <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
                            {/* Create Service button */}
                            <button onClick={() => { onClose(); onCreateService?.(category); }}
                                style={{ width: "100%", padding: "16px 20px", borderRadius: 16, border: "1.5px solid #a5f3c0", background: "#f0fdf4", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#dcfce7"; e.currentTarget.style.borderColor = "#6ee7b7"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.borderColor = "#a5f3c0"; }}
                            >
                                <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#16a34a,#22c55e)", boxShadow: "0 4px 14px rgba(22,163,74,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Plus size={18} color="#fff" />
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <p style={{ fontWeight: 700, fontSize: 14, color: "#14532d" }}>Create Service</p>
                                    <p style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>Add a new service to this category</p>
                                </div>
                            </button>

                            <button onClick={() => setView("edit")}
                                style={{ width: "100%", padding: "16px 20px", borderRadius: 16, border: "1.5px solid #bfdbfe", background: "#eff6ff", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; e.currentTarget.style.borderColor = "#93c5fd"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
                            >
                                <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#2563eb,#3b82f6)", boxShadow: "0 4px 14px rgba(37,99,235,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Pencil size={18} color="#fff" />
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <p style={{ fontWeight: 700, fontSize: 14, color: "#1e3a8a" }}>Edit Category</p>
                                    <p style={{ fontSize: 11, color: "#3b82f6", marginTop: 2 }}>Rename this category</p>
                                </div>
                            </button>

                            <button onClick={() => setView("delete")}
                                style={{ width: "100%", padding: "16px 20px", borderRadius: 16, border: "1.5px solid #fecdd3", background: "#fff1f2", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all .15s", fontFamily: "inherit" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#ffe4e6"; e.currentTarget.style.borderColor = "#fca5a5"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#fecdd3"; }}
                            >
                                <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#e11d48,#f43f5e)", boxShadow: "0 4px 14px rgba(225,29,72,.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Trash2 size={18} color="#fff" />
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <p style={{ fontWeight: 700, fontSize: 14, color: "#881337" }}>Delete Category</p>
                                    <p style={{ fontSize: 11, color: "#e11d48", marginTop: 2 }}>Permanently remove this category</p>
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {view === "edit" && (
                    <>
                        <div style={{ background: "linear-gradient(135deg,#0ea5e9 0%,#2563eb 100%)", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Pencil size={17} color="#fff" />
                                </div>
                                <div>
                                    <p style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Edit Category</p>
                                    <p style={{ color: "rgba(255,255,255,.65)", fontSize: 11, marginTop: 1 }}>Update the name</p>
                                </div>
                            </div>
                            <button onClick={() => setView("pick")} style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <X size={14} color="#fff" />
                            </button>
                        </div>
                        <div style={{ padding: "20px 22px 22px" }}>
                            {!editSuccess ? (
                                <form onSubmit={handleEdit}>
                                    <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                                        Category Name <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <div style={{ position: "relative", marginBottom: 18 }}>
                                        <Tag size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                                        <input ref={inputRef} type="text" className="sm-input" value={editName} onChange={e => setEditName(e.target.value)} required
                                            style={{ width: "100%", padding: "12px 12px 12px 34px", border: "1.5px solid #bfdbfe", borderRadius: 12, fontSize: 13, color: "#1e293b", background: "#f8fafc", fontFamily: "inherit" }} />
                                    </div>
                                    <div style={{ display: "flex", gap: 9 }}>
                                        <button type="button" onClick={() => setView("pick")} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#64748b", fontFamily: "inherit" }}>Back</button>
                                        <button type="submit" disabled={isUpdating || !editName.trim()} className="sm-btn-primary"
                                            style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                            {isUpdating ? <><Spin /> Saving…</> : <><Check size={14} /> Save</>}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ textAlign: "center", padding: "14px 0 4px" }}>
                                    <div className="sm-pop" style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 6px 24px rgba(34,197,94,.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                        <Check size={26} color="#fff" />
                                    </div>
                                    <p style={{ fontWeight: 800, color: "#15803d", fontSize: 15, marginBottom: 4 }}>Updated!</p>
                                    <p style={{ fontSize: 13, color: "#64748b" }}>Category name saved.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {view === "delete" && (
                    <div style={{ padding: "24px 22px 22px" }}>
                        {!delSuccess ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Trash2 size={19} color="#e11d48" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>Delete Category</p>
                                            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>This cannot be undone</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setView("pick")} style={{ padding: 7, borderRadius: 9, border: "none", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <X size={15} color="#64748b" />
                                    </button>
                                </div>
                                <div style={{ background: "#fff1f2", border: "1px solid #ffe4e6", borderRadius: 13, padding: "13px 15px", marginBottom: 20 }}>
                                    <p style={{ fontSize: 13, color: "#475569" }}>
                                        Delete <strong style={{ color: "#0f172a" }}>{category?.name}</strong>?
                                    </p>
                                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 5 }}>Services in this category may be affected.</p>
                                </div>
                                <div style={{ display: "flex", gap: 9 }}>
                                    <button onClick={() => setView("pick")} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit" }}>Back</button>
                                    <button onClick={handleDelete} disabled={isDeleting}
                                        style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 16px rgba(239,68,68,.3)", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                        {isDeleting ? <><Spin /> Deleting…</> : <><Trash2 size={13} /> Delete</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: "center", padding: "14px 0 4px" }}>
                                <div className="sm-pop" style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 6px 24px rgba(34,197,94,.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                                    <Check size={26} color="#fff" />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>Deleted!</p>
                                <p style={{ fontSize: 13, color: "#94a3b8" }}>Category removed successfully.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Category Tab with hover ⋮ ─────────────────────────────────────────── */
const CategoryTab = ({ cat, isActive, onClick, onKebab }) => (
    <div className="cat-tab-wrapper">
        <button onClick={onClick} className={`sm-tab ${isActive ? "sm-tab-active" : ""}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 10px 8px 14px", borderRadius: 11, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {cat.name}
            {cat.count > 0 && (
                <span style={{ padding: "1px 7px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: isActive ? "rgba(255,255,255,.22)" : "#f1f5f9", color: isActive ? "#fff" : "#64748b" }}>
                    {cat.count}
                </span>
            )}
            <span
                className="cat-kebab-btn"
                onClick={(e) => { e.stopPropagation(); onKebab(cat); }}
                title="Manage"
                role="button"
            >
                <MoreVertical size={12} color={isActive ? "rgba(255,255,255,.85)" : "#64748b"} />
            </span>
        </button>
    </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const ServicesManagement = () => {
    const navigate = useNavigate();

    const [categorySearch, setCategorySearch] = useState("");
    const [serviceSearch, setServiceSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [viewMode, setViewMode] = useState("table");
    const [showNewCategory, setShowNewCategory] = useState(false);  // ← controls the modal
    const [editServiceTarget, setEditServiceTarget] = useState(null);
    const [catActionTarget, setCatActionTarget] = useState(null);
    const [showDeleteSvcModal, setShowDeleteSvcModal] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [deleteSvcSuccess, setDeleteSvcSuccess] = useState(false);
    const [createSvcTarget, setCreateSvcTarget] = useState(null); // category to create service in
    const [priceModal, setPriceModal] = useState(null); // { service, existingPrice }

    const { data: servicesResp, isLoading: servicesLoading } = useGetAllServicesQuery();
    const { data: categoriesResp, isLoading: categoriesLoading } = useGetAllServiceCategoriesQuery();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    // Fetch prices to display per-service price
    const businessId = useMemo(() => {
        try { const t = localStorage.getItem("token"); return t ? jwtDecode(t).business_id : null; } catch { return null; }
    }, []);
    const { data: pricesResp } = useGetPricesByBusinessQuery(businessId, { skip: !businessId });
    const allPrices = useMemo(() => {
        const raw = pricesResp?.data || pricesResp || [];
        return Array.isArray(raw) ? raw : [];
    }, [pricesResp]);

    const services = useMemo(() => {
        const raw = servicesResp?.data || servicesResp?.services || servicesResp || [];
        return Array.isArray(raw) ? raw : [];
    }, [servicesResp]);

    const categories = useMemo(() => {
        const raw = categoriesResp?.data || categoriesResp || [];
        return Array.isArray(raw) ? raw : [];
    }, [categoriesResp]);

    const categoryCounts = useMemo(() => {
        const c = { all: services.length };
        services.forEach(s => { const id = s.service_category_id || s.category_id; if (id) c[id] = (c[id] || 0) + 1; });
        return c;
    }, [services]);

    const topCategories = useMemo(() => {
        let cats = categories.map(c => ({ ...c, count: categoryCounts[c.id] || 0 }));
        if (categorySearch.trim()) { const t = categorySearch.toLowerCase(); cats = cats.filter(c => c.name.toLowerCase().includes(t)); }
        return cats.sort((a, b) => b.count - a.count);
    }, [categories, categoryCounts, categorySearch]);

    const filteredCategoriesForDropdown = useMemo(() => {
        if (!categorySearch.trim()) return categories;
        const t = categorySearch.toLowerCase();
        return categories.filter(c => c.name.toLowerCase().includes(t));
    }, [categories, categorySearch]);

    const filteredServices = useMemo(() => {
        let r = [...services];
        if (categoryFilter !== "all") r = r.filter(s => String(s.service_category_id || s.category_id) === String(categoryFilter));
        if (serviceSearch.trim()) {
            const t = serviceSearch.toLowerCase();
            r = r.filter(s => (s.name || s.service_name || "").toLowerCase().includes(t) || (s.description || s.service_description || "").toLowerCase().includes(t));
        }
        if (sortBy === "duration-high") r.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        else if (sortBy === "duration-low") r.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        else if (sortBy === "price-high") r.sort((a, b) => (b.price || 0) - (a.price || 0));
        else if (sortBy === "price-low") r.sort((a, b) => (a.price || 0) - (b.price || 0));
        return r;
    }, [services, categoryFilter, serviceSearch, sortBy]);

    const getCategoryName = (s) => { const id = s.service_category_id || s.category_id; return categories.find(c => c.id === id)?.name || "Uncategorized"; };
    const getStaff = (s) => { const st = s.staff || s.assigned_staff || []; return Array.isArray(st) ? st : []; };
    const getStatus = (s) => {
        const st = (s.status || "").toLowerCase();
        if (st === "active" || s.is_active === true) return "Active";
        if (st === "inactive" || st === "disabled" || s.is_active === false) return "Inactive";
        return "Active"; // default to Active if unknown
    };
    const getServicePrice = (s) => {
        // Try direct price fields first
        if (s.price && Number(s.price) > 0) return Number(s.price);
        if (s.total_price && Number(s.total_price) > 0) return Number(s.total_price);
        // Fall back to prices table
        const matched = allPrices.filter(p => p.service_id === s.id);
        if (matched.length > 0) return matched.reduce((sum, p) => sum + (Number(p.total_price) || Number(p.price) || 0), 0);
        return 0;
    };

    const handleRowClick = (s) => navigate(`/dashboard/services/category/${s.service_category_id || s.category_id}`, { state: { categoryName: getCategoryName(s) } });
    const handleEdit = (e, s) => { e.stopPropagation(); setEditServiceTarget(s); };
    const handleOpenDeleteSvc = (e, s) => { e.stopPropagation(); setServiceToDelete(s); setDeleteSvcSuccess(false); setShowDeleteSvcModal(true); };
    const handleCloseDeleteSvc = () => { setShowDeleteSvcModal(false); setServiceToDelete(null); setDeleteSvcSuccess(false); };
    const handleDeleteSvcConfirm = async () => {
        try { await deleteService(serviceToDelete.id).unwrap(); setDeleteSvcSuccess(true); setTimeout(handleCloseDeleteSvc, 1500); }
        catch (err) { alert(err?.data?.message || "Failed to delete service"); }
    };

    if (servicesLoading || categoriesLoading) {
        return (
            <>
                <GlobalStyles />
                <div style={{ minHeight: "100vh", background: "#f8fafc", padding: 24 }}>
                    <div className="sm-shimmer" style={{ height: 34, width: 240, marginBottom: 22 }} />
                    <div className="sm-shimmer" style={{ height: 46, marginBottom: 14 }} />
                    {[...Array(5)].map((_, i) => <div key={i} className="sm-shimmer" style={{ height: 68, marginBottom: 10 }} />)}
                </div>
            </>
        );
    }

    const inputStyle = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 13, color: "#334155", background: "#fff", outline: "none", fontFamily: "inherit", fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,.04)" };
    const selectStyle = { ...inputStyle, appearance: "none", padding: "10px 34px 10px 13px", cursor: "pointer" };

    return (
        <>
            <GlobalStyles />
            <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

                {/* ── Header ── */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b" }}>Services Management</h1>
                        {/* Clicking this opens the overlay modal */}
                        <button
                            onClick={() => setShowNewCategory(true)}
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 6px rgba(59,130,246,0.3)" }}
                        >
                            <FolderPlus size={18} /> New Category
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ padding: "0 24px 24px", maxWidth: 1400, margin: "0 auto" }}>

                    {/* Category tabs + search */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                        <div style={{ display: "flex", gap: 6, flex: 1, overflowX: "auto", minWidth: 0, paddingBottom: 2, paddingTop: 8 }}>
                            <button onClick={() => setCategoryFilter("all")} className={`sm-tab ${categoryFilter === "all" ? "sm-tab-active" : ""}`}
                                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 11, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", fontFamily: "inherit" }}>
                                All
                                <span style={{ padding: "1px 7px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: categoryFilter === "all" ? "rgba(255,255,255,.22)" : "#eff6ff", color: categoryFilter === "all" ? "#fff" : "#2563eb" }}>
                                    {categoryCounts.all || 0}
                                </span>
                            </button>
                            {topCategories.map(cat => (
                                <CategoryTab key={cat.id} cat={cat}
                                    isActive={categoryFilter === String(cat.id)}
                                    onClick={() => setCategoryFilter(String(cat.id))}
                                    onKebab={(c) => setCatActionTarget(c)}
                                />
                            ))}
                        </div>
                        <div style={{ position: "relative", width: 230, flexShrink: 0 }}>
                            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                            <input type="text" placeholder="Search categories…" value={categorySearch} onChange={e => setCategorySearch(e.target.value)}
                                className="sm-input" style={{ ...inputStyle, padding: "9px 30px 9px 30px" }} />
                            {categorySearch && (
                                <button onClick={() => setCategorySearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", padding: 3, borderRadius: 6, background: "transparent", border: "none" }}>
                                    <X size={11} color="#94a3b8" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Service search + dropdowns + view toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                        <div style={{ position: "relative", flex: 1, minWidth: 150 }}>
                            <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                            <input type="text" placeholder="Search services…" value={serviceSearch} onChange={e => setServiceSearch(e.target.value)}
                                className="sm-input" style={{ ...inputStyle, padding: "10px 30px 10px 32px" }} />
                            {serviceSearch && (
                                <button onClick={() => setServiceSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", padding: 3, borderRadius: 6, background: "transparent", border: "none" }}>
                                    <X size={11} color="#94a3b8" />
                                </button>
                            )}
                        </div>
                        <div style={{ position: "relative", width: 190, flexShrink: 0 }}>
                            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selectStyle}>
                                <option value="all">All Categories</option>
                                {filteredCategoriesForDropdown.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                        </div>
                        <div style={{ position: "relative", width: 190, flexShrink: 0 }}>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
                                <option value="default">Sort: Default</option>
                                <option value="duration-high">Duration ↓</option>
                                <option value="duration-low">Duration ↑</option>
                                <option value="price-high">Price ↓</option>
                                <option value="price-low">Price ↑</option>
                            </select>
                            <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                        </div>
                        <div style={{ display: "flex", gap: 3, padding: 4, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 11, flexShrink: 0 }}>
                            {[{ m: "table", I: List }, { m: "grid", I: Grid }].map(({ m, I }) => (
                                <button key={m} onClick={() => setViewMode(m)} style={{ padding: "7px 10px", borderRadius: 8, border: "none", background: viewMode === m ? "#eff6ff" : "transparent", color: viewMode === m ? "#2563eb" : "#94a3b8", transition: "all .15s" }}>
                                    <I size={16} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Empty state */}
                    {filteredServices.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 20, border: "1.5px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
                            <div style={{ width: 58, height: 58, borderRadius: 18, background: "linear-gradient(135deg,#eff6ff,#eef2ff)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                                <Search size={24} color="#6366f1" />
                            </div>
                            <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 5 }}>No services found</p>
                            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: categoryFilter !== "all" ? 20 : 0 }}>
                                {categoryFilter !== "all" ? "This category has no services yet." : "Try adjusting your filters or search terms"}
                            </p>
                            {categoryFilter !== "all" && (
                                <button
                                    onClick={() => {
                                        const cat = categories.find(c => String(c.id) === categoryFilter);
                                        if (cat) setCreateSvcTarget(cat);
                                    }}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8,
                                        padding: "11px 24px", borderRadius: 14,
                                        background: "linear-gradient(135deg,#16a34a,#22c55e)",
                                        color: "#fff", border: "none", fontSize: 13, fontWeight: 700,
                                        cursor: "pointer", boxShadow: "0 4px 16px rgba(22,163,74,.3)",
                                        transition: "transform .15s, filter .15s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
                                >
                                    <Plus size={15} /> Create Service
                                </button>
                            )}
                        </div>

                    ) : viewMode === "table" ? (
                        /* ══ TABLE ══ */
                        <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f1f5f9", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,.05)" }}>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9" }}>
                                            {["Service", "Price", "Staff", "Status", "Actions"].map((h, i) => (
                                                <th key={h} style={{ padding: "12px 18px", textAlign: i === 4 ? "center" : "left", fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredServices.map(service => {
                                            const status = getStatus(service);
                                            const ss = STATUS_STYLES[status];
                                            const staff = getStaff(service);
                                            return (
                                                <tr key={service.id} className="sm-row" onClick={() => handleRowClick(service)} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background .14s" }}>
                                                    <td style={{ padding: "14px 18px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                                            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, border: "1.5px solid #e0e7ff", background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                                                                    {(service.name || service.service_name || "?")[0].toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontWeight: 700, color: "#0f172a", fontSize: 13, marginBottom: 3 }}>{service.name || service.service_name}</p>
                                                                <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, background: "#ede9fe", padding: "1px 8px", borderRadius: 999 }}>{getCategoryName(service)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                                                        {(() => {
                                                            const svcPrice = getServicePrice(service);
                                                            const priceObj = allPrices.find(p => p.service_id === service.id || p.service_id === Number(service.id));
                                                            return svcPrice > 0 ? (
                                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                                                                        <IndianRupee size={12} color="#16a34a" />
                                                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>{svcPrice.toLocaleString()}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={e => { e.stopPropagation(); setPriceModal({ service, existingPrice: priceObj }); }}
                                                                        title="View / Edit Price"
                                                                        style={{ width: 28, height: 28, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
                                                                        onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; e.currentTarget.style.transform = "scale(1.1)"; }}
                                                                        onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.transform = ""; }}
                                                                    >
                                                                        <Eye size={13} color="#2563eb" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={e => { e.stopPropagation(); setPriceModal({ service, existingPrice: null }); }}
                                                                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 13px", borderRadius: 10, background: "#fafafa", border: "1.5px dashed #cbd5e1", cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
                                                                    onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.borderColor = "#86efac"; }}
                                                                    onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                                                                >
                                                                    <Plus size={12} color="#64748b" />
                                                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Set Price</span>
                                                                </button>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td style={{ padding: "14px 18px" }}>
                                                        <div style={{ display: "flex" }}>
                                                            {staff.slice(0, 3).length > 0 ? staff.slice(0, 3).map((_, i) => (
                                                                <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${["#60a5fa,#818cf8", "#34d399,#60a5fa", "#f472b6,#fb923c"][i % 3]})`, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                    <User size={11} color="#fff" />
                                                                </div>
                                                            )) : (
                                                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                    <User size={11} color="#94a3b8" />
                                                                </div>
                                                            )}
                                                            {staff.length > 3 && <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginLeft: 5, alignSelf: "center" }}>+{staff.length - 3}</span>}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: "14px 18px" }}>
                                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ss.dot, flexShrink: 0 }} />{status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "14px 18px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                                            <button onClick={e => handleEdit(e, service)} className="sm-edit-btn" style={{ padding: 7, borderRadius: 9, border: "none", display: "flex", alignItems: "center" }}><Edit size={14} /></button>
                                                            <button onClick={e => handleOpenDeleteSvc(e, service)} className="sm-del-btn" style={{ padding: 7, borderRadius: 9, border: "none", display: "flex", alignItems: "center" }}><Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderTop: "1px solid #f8fafc", flexWrap: "wrap", gap: 8 }}>
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                                    Showing <strong style={{ color: "#475569" }}>{filteredServices.length}</strong> service{filteredServices.length !== 1 ? "s" : ""}
                                </span>
                                <div style={{ display: "flex", gap: 5 }}>
                                    {["← Prev", "1", "Next →"].map((l, i) => (
                                        <button key={l} style={{ padding: "6px 13px", borderRadius: 9, fontSize: 12, fontWeight: 700, fontFamily: "inherit", border: i === 1 ? "none" : "1.5px solid #e2e8f0", background: i === 1 ? "linear-gradient(135deg,#2563eb,#4f46e5)" : "#fff", color: i === 1 ? "#fff" : "#475569" }}>{l}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    ) : (
                        /* ══ GRID ══ */
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                            {filteredServices.map(service => {
                                const status = getStatus(service);
                                const ss = STATUS_STYLES[status];
                                const staff = getStaff(service);
                                return (
                                    <div key={service.id} onClick={() => handleRowClick(service)} className="sm-card" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f1f5f9", overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,.04)" }}>
                                        <div style={{ height: 140, position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,.85)", lineHeight: 1, userSelect: "none" }}>
                                                {(service.name || service.service_name || "?")[0].toUpperCase()}
                                            </span>
                                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.15))" }} />
                                            <span style={{ position: "absolute", top: 10, right: 10, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 999, fontSize: 10, fontWeight: 800, background: ss.bg, color: ss.color, boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
                                                <span style={{ width: 5, height: 5, borderRadius: "50%", background: ss.dot }} />{status}
                                            </span>
                                        </div>
                                        <div style={{ padding: "14px" }}>
                                            <p style={{ fontWeight: 800, color: "#0f172a", fontSize: 13, marginBottom: 4 }}>{service.name || service.service_name}</p>
                                            <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, background: "#ede9fe", padding: "1px 8px", borderRadius: 999, display: "inline-block", marginBottom: 10 }}>{getCategoryName(service)}</span>
                                            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                                                {(() => {
                                                    const svcPrice = getServicePrice(service);
                                                    const priceObj = allPrices.find(p => p.service_id === service.id || p.service_id === Number(service.id));
                                                    return svcPrice > 0 ? (
                                                        <>
                                                            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 9, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                                                                <IndianRupee size={11} color="#16a34a" />
                                                                <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d" }}>{svcPrice.toLocaleString()}</span>
                                                            </div>
                                                            <button
                                                                onClick={e => { e.stopPropagation(); setPriceModal({ service, existingPrice: priceObj }); }}
                                                                title="View / Edit Price"
                                                                style={{ width: 26, height: 26, borderRadius: 7, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
                                                                onMouseEnter={e => { e.currentTarget.style.background = "#dbeafe"; e.currentTarget.style.transform = "scale(1.12)"; }}
                                                                onMouseLeave={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.transform = ""; }}
                                                            >
                                                                <Eye size={12} color="#2563eb" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={e => { e.stopPropagation(); setPriceModal({ service, existingPrice: null }); }}
                                                            style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 11px", borderRadius: 9, background: "#fafafa", border: "1.5px dashed #cbd5e1", cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.borderColor = "#86efac"; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                                                        >
                                                            <Plus size={11} color="#64748b" />
                                                            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Set Price</span>
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #f8fafc" }}>
                                                <div style={{ display: "flex" }}>
                                                    {staff.slice(0, 3).length > 0 ? staff.slice(0, 3).map((_, i) => (
                                                        <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg,${["#60a5fa,#818cf8", "#34d399,#60a5fa", "#f472b6,#fb923c"][i % 3]})`, border: "2px solid #fff", marginLeft: i > 0 ? -7 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <User size={10} color="#fff" />
                                                        </div>
                                                    )) : (
                                                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f1f5f9", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                            <User size={10} color="#94a3b8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    <button onClick={e => handleEdit(e, service)} className="sm-edit-btn" style={{ padding: 6, borderRadius: 8, border: "none", display: "flex" }}><Edit size={13} /></button>
                                                    <button onClick={e => handleOpenDeleteSvc(e, service)} className="sm-del-btn" style={{ padding: 6, borderRadius: 8, border: "none", display: "flex" }}><Trash2 size={13} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ══ Create Service Modal ══ */}
            {createSvcTarget && (
                <CreateServiceModal
                    category={createSvcTarget}
                    onClose={() => setCreateSvcTarget(null)}
                    onCreated={() => {}}
                />
            )}

            {/* ══ Price Modal ══ */}
            {priceModal && (
                <PriceModal
                    service={priceModal.service}
                    existingPrice={priceModal.existingPrice}
                    onClose={() => setPriceModal(null)}
                    onSaved={() => {}}
                />
            )}

            {/* ══ Create Category Modal ══ — renders as full overlay with dark backdrop */}
            {showNewCategory && (
                <CreateCategoryPanel
                    onClose={() => setShowNewCategory(false)}
                    onCreated={() => {}}
                />
            )}

            {/* ══ Edit Service Modal ══ */}
            {editServiceTarget && (
                <EditServiceModal
                    service={editServiceTarget}
                    onClose={() => setEditServiceTarget(null)}
                />
            )}

            {/* ══ Category Action Modal (⋮ click) ══ */}
            {catActionTarget && (
                <CategoryActionModal
                    category={catActionTarget}
                    onClose={() => setCatActionTarget(null)}
                    onCatDeleted={() => {
                        if (String(categoryFilter) === String(catActionTarget.id)) setCategoryFilter("all");
                    }}
                    onCreateService={(cat) => {
                        setCreateSvcTarget(cat);
                    }}
                />
            )}

            {/* ══ Delete Service Modal ══ */}
            {showDeleteSvcModal && (
                <div className="sm-overlay">
                    <div className="sm-modal" style={{ background: "#fff", borderRadius: 24, padding: 26, width: "100%", maxWidth: 370, boxShadow: "0 32px 80px rgba(0,0,0,.22)" }}>
                        {!deleteSvcSuccess ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 13, background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Trash2 size={17} color="#e11d48" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>Delete Service</p>
                                            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>This cannot be undone</p>
                                        </div>
                                    </div>
                                    <button onClick={handleCloseDeleteSvc} style={{ padding: 6, borderRadius: 9, border: "none", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <X size={14} color="#64748b" />
                                    </button>
                                </div>
                                <div style={{ background: "#fff1f2", border: "1px solid #ffe4e6", borderRadius: 13, padding: "13px 15px", marginBottom: 20 }}>
                                    <p style={{ fontSize: 13, color: "#475569" }}>
                                        Delete <strong style={{ color: "#0f172a" }}>{serviceToDelete?.name || serviceToDelete?.service_name}</strong>?
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: 9 }}>
                                    <button onClick={handleCloseDeleteSvc} style={{ flex: 1, padding: 12, borderRadius: 13, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#475569", fontFamily: "inherit" }}>Cancel</button>
                                    <button onClick={handleDeleteSvcConfirm} disabled={isDeleting}
                                        style={{ flex: 1, padding: 12, borderRadius: 13, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 16px rgba(239,68,68,.3)", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                        {isDeleting ? <><Spin /> Deleting…</> : <><Trash2 size={13} /> Delete</>}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ textAlign: "center", padding: "16px 0" }}>
                                <div className="sm-pop" style={{ width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 6px 24px rgba(34,197,94,.35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                                    <Check size={28} color="#fff" />
                                </div>
                                <p style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 5 }}>Deleted!</p>
                                <p style={{ fontSize: 13, color: "#94a3b8" }}>Service removed successfully.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ServicesManagement;