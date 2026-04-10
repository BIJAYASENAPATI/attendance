import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useUpdateServiceMutation,
    useGetServiceByIdQuery,
} from "../../../../app/service/slice";
import { ArrowLeft, Save, Check, Loader2 } from "lucide-react";

const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes shimmer  { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
        @keyframes pulseRing { 0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,.35); } 50% { box-shadow:0 0 0 8px rgba(99,102,241,0); } }
        @keyframes grow { from { width:0; } to { width:100%; } }
        @keyframes spin { to { transform:rotate(360deg); } }

        .page-enter    { animation: fadeInUp .45s cubic-bezier(.22,1,.36,1) both; }
        .page-enter.d1 { animation-delay:.07s; }
        .page-enter.d2 { animation-delay:.14s; }
        .fade-enter    { animation: fadeIn .3s ease both; }

        .shimmer-bg {
            background: linear-gradient(90deg,#f1f5f9 25%,#e8eef5 50%,#f1f5f9 75%);
            background-size: 400px 100%; animation: shimmer 1.4s infinite linear;
        }

        .form-input {
            width:100%; padding:11px 14px; font-size:14px; font-weight:500;
            border:1.5px solid #e2e8f0; border-radius:14px; background:#fff; outline:none;
            transition: border-color .15s ease, box-shadow .15s ease;
            color: #1e293b;
        }
        .form-input:focus { border-color:#a5b4fc; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
        .form-input::placeholder { color:#94a3b8; }

        .form-label {
            display:block; font-size:11px; font-weight:700; color:#64748b;
            text-transform:uppercase; letter-spacing:.07em; margin-bottom:7px;
        }

        .primary-btn {
            display:inline-flex; align-items:center; justify-content:center; gap:8px;
            cursor:pointer; border:none; outline:none; position:relative; overflow:hidden;
            transition: transform .18s ease, box-shadow .18s ease;
            animation: pulseRing 2.8s infinite;
        }
        .primary-btn:hover  { transform:translateY(-2px); box-shadow:0 8px 28px rgba(79,70,229,.4); }
        .primary-btn:active { transform:scale(.97); }
        .primary-btn:disabled { opacity:.6; cursor:not-allowed; animation:none; }

        .spin { animation: spin .7s linear infinite; }

        .toggle-track {
            position:relative; width:44px; height:24px; border-radius:99px;
            transition: background .2s ease; cursor:pointer; flex-shrink:0;
        }
        .toggle-thumb {
            position:absolute; top:3px; left:3px; width:18px; height:18px;
            background:#fff; border-radius:50%; box-shadow:0 1px 4px rgba(0,0,0,.18);
            transition: transform .2s ease;
        }
        .toggle-thumb.on { transform: translateX(20px); }

        .progress-bar { animation: grow 2s linear forwards; }
    `}</style>
);

const UpdateService = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading: loadingData } = useGetServiceByIdQuery(id);
    const [updateService, { isLoading }] = useUpdateServiceMutation();

    const [formData, setFormData] = useState({ name: "", description: "", pre_payment_required: false });
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (data) {
            const s = data.service || data.data || data;
            setFormData({ name: s.name || "", description: s.description || "", pre_payment_required: s.pre_payment_required || false });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateService({ id, data: formData }).unwrap();
            setUpdateSuccess(true);
            setTimeout(() => navigate(-1), 2000);
        } catch (error) {
            alert(error?.data?.message || "Failed to update service");
        }
    };

    /* ── Loading ── */
    if (loadingData) return (
        <>
            <GlobalStyles />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
                    <div className="shimmer-bg h-4 w-24 rounded-lg" />
                    <div className="shimmer-bg h-32 w-full rounded-2xl" />
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 space-y-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="shimmer-bg h-3 w-28 rounded" />
                                <div className="shimmer-bg h-11 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    /* ── Success ── */
    if (updateSuccess) return (
        <>
            <GlobalStyles />
            <div className="min-h-screen flex items-center justify-center px-4"
                style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
                <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full fade-enter"
                    style={{ boxShadow: "0 24px 64px rgba(0,0,0,.1)" }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)" }}>
                        <Check size={30} style={{ color: "#16a34a" }} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Updated!</h3>
                    <p className="text-sm text-slate-400 mb-5">Redirecting you back…</p>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full progress-bar" style={{ background: "linear-gradient(90deg,#4f46e5,#6366f1)" }} />
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>

                {/* Back */}
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 text-sm font-medium cursor-pointer transition-colors group page-enter">
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back
                </button>

                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

                    {/* Header Card */}
                    <div className="page-enter rounded-2xl p-6 sm:p-8 mb-6"
                        style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1 55%,#818cf8)", boxShadow: "0 12px 40px rgba(79,70,229,.28)" }}>
                        <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Services</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Update Service</h1>
                        <p className="text-indigo-200 text-sm mt-1">Edit the details below and save your changes.</p>
                    </div>

                    {/* Form Card */}
                    <div className="page-enter d1 bg-white rounded-2xl border border-slate-100 p-6 sm:p-8"
                        style={{ boxShadow: "0 4px 28px rgba(0,0,0,.07)" }}>
                        <form onSubmit={handleUpdate} className="space-y-6">

                            {/* Service Name */}
                            <div>
                                <label className="form-label">Service Name <span style={{ color: "#ef4444" }}>*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange}
                                    required placeholder="e.g. Deep Cleaning, Hair Cut"
                                    className="form-input" />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="form-label">Description <span style={{ color: "#ef4444" }}>*</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange}
                                    required rows={4} placeholder="Describe what this service includes…"
                                    className="form-input" style={{ resize: "none" }} />
                                <p className="text-xs text-slate-400 mt-1.5 font-medium">{formData.description.length} characters</p>
                            </div>

                            {/* Pre-payment Toggle */}
                            <div onClick={() => setFormData(prev => ({ ...prev, pre_payment_required: !prev.pre_payment_required }))}
                                className="flex items-center justify-between gap-4 p-5 rounded-2xl border-2 cursor-pointer select-none transition-all"
                                style={{
                                    borderColor: formData.pre_payment_required ? "#fdba74" : "#e2e8f0",
                                    background: formData.pre_payment_required ? "#fff7ed" : "#f8fafc",
                                }}>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Require Pre-payment</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Customers must pay before the service is confirmed</p>
                                </div>
                                <div className="toggle-track" style={{ background: formData.pre_payment_required ? "#f97316" : "#cbd5e1" }}>
                                    <div className={`toggle-thumb ${formData.pre_payment_required ? "on" : ""}`} />
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff)" }} />

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button type="button" onClick={() => navigate(-1)}
                                    className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading}
                                    className="primary-btn flex-1 py-3 rounded-2xl text-sm font-bold text-white"
                                    style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", boxShadow: "0 4px 16px rgba(79,70,229,.3)" }}>
                                    {isLoading
                                        ? <><Loader2 size={15} className="spin" /> Updating…</>
                                        : <><Save size={15} /> Save Changes</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateService;