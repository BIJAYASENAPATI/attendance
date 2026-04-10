import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetPricesByBusinessQuery,
    useDeleteServicePriceMutation,
    useGetServiceByIdQuery,
} from "../../../../../app/service/slice";
import { ArrowLeft, Plus, Edit2, Trash2, Check, X, DollarSign, Package } from "lucide-react";

const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes shimmer  { 0% { background-position:-400px 0; } 100% { background-position:400px 0; } }
        @keyframes pulseRing { 0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,.35); } 50% { box-shadow:0 0 0 8px rgba(99,102,241,0); } }

        .page-enter    { animation: fadeInUp .45s cubic-bezier(.22,1,.36,1) both; }
        .page-enter.d1 { animation-delay:.07s; }
        .page-enter.d2 { animation-delay:.14s; }
        .fade-enter    { animation: fadeIn .3s ease both; }

        .shimmer-bg {
            background: linear-gradient(90deg,#f1f5f9 25%,#e8eef5 50%,#f1f5f9 75%);
            background-size: 400px 100%; animation: shimmer 1.4s infinite linear;
        }

        .icon-btn {
            display:inline-flex; align-items:center; justify-content:center;
            border-radius:10px; padding:9px; cursor:pointer; border:none; outline:none;
            transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
        }
        .icon-btn:hover  { transform: translateY(-2px) scale(1.1); }
        .icon-btn:active { transform: scale(.93); }

        .primary-btn {
            display:inline-flex; align-items:center; justify-content:center; gap:8px;
            cursor:pointer; border:none; outline:none; position:relative; overflow:hidden;
            transition: transform .18s ease, box-shadow .18s ease;
            animation: pulseRing 2.8s infinite;
        }
        .primary-btn:hover  { transform:translateY(-2px); box-shadow:0 8px 28px rgba(79,70,229,.4); }
        .primary-btn:active { transform:scale(.97); }

        .detail-row { display:flex; flex-direction:column; gap:4px; }
        .detail-label { font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.07em; }
        .detail-value { font-size:15px; font-weight:600; color:#1e293b; }

        .modal-overlay { animation: fadeIn .2s ease both; }
        .modal-card    { animation: fadeInUp .28s cubic-bezier(.22,1,.36,1) both; }

        [data-tip] { position: relative; }
        [data-tip]::after {
            content: attr(data-tip); position: absolute; bottom: calc(100% + 7px); left: 50%;
            transform: translateX(-50%) scale(.85); background: #1e293b; color: #fff;
            font-size: 11px; font-weight: 600; white-space: nowrap; padding: 4px 9px;
            border-radius: 7px; opacity: 0; pointer-events: none;
            transition: opacity .15s ease, transform .15s ease; z-index: 99;
        }
        [data-tip]:hover::after { opacity: 1; transform: translateX(-50%) scale(1); }
    `}</style>
);

const DetailRow = ({ label, value, mono = false }) => (
    <div className="detail-row">
        <span className="detail-label">{label}</span>
        <span className="detail-value" style={mono ? { fontFamily: "monospace", fontSize: 14 } : {}}>{value ?? "—"}</span>
    </div>
);

const ServicePricesPage = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();
    const businessId = localStorage.getItem("business_id");

    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service || serviceData?.data || serviceData;

    const { data: pricesResponse, isLoading, error } = useGetPricesByBusinessQuery(businessId);
    const allPrices = pricesResponse?.data || pricesResponse || [];
    const servicePrices = Array.isArray(allPrices) ? allPrices.filter(p => p.service_id === Number(serviceId)) : [];
    const price = servicePrices.length > 0 ? servicePrices[0] : null;

    const [deletePrice] = useDeleteServicePriceMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleDelete = async () => {
        try {
            await deletePrice(price.id).unwrap();
            setDeleteSuccess(true);
            setTimeout(() => { setShowDeleteModal(false); navigate(-1); }, 1500);
        } catch (err) {
            alert(err?.data?.message || "Failed to delete price");
        }
    };

    if (isLoading) return (
        <>
            <GlobalStyles />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
                <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">
                    <div className="shimmer-bg h-4 w-20 rounded-lg" />
                    <div className="shimmer-bg h-40 w-full rounded-2xl" />
                    <div className="bg-white rounded-2xl p-8 space-y-4 shadow-sm border border-slate-100">
                        <div className="grid grid-cols-3 gap-8">
                           {[...Array(6)].map((_, i) => <div key={i} className="space-y-2"><div className="shimmer-bg h-3 w-24 rounded" /><div className="shimmer-bg h-5 w-full rounded-lg" /></div>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f8fafc 60%,#fff 100%)" }}>
                
                <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">

                    {/* Back Button */}
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 text-sm font-medium cursor-pointer transition-colors group page-enter">
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Services
                    </button>

                    {/* Header Card */}
                    <div className="page-enter rounded-3xl p-8 sm:p-10 mb-8"
                        style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1 55%,#818cf8)", boxShadow: "0 20px 50px rgba(79,70,229,.2)" }}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div>
                                <p className="text-indigo-100 text-xs font-bold uppercase tracking-[0.2em] mb-2">Service Pricing Configuration</p>
                                <h1 className="text-3xl sm:text-3xl font-extrabold text-white tracking-tight">{service?.name || "Service Details"}</h1>
                                {price && (
                                    <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-2xl w-fit"
                                        style={{ background: "rgba(255,255,255,.12)", backdropFilter: "blur(12px)" }}>
                                        <DollarSign size={16} style={{ color: "#86efac" }} />
                                        <span className="text-white font-bold text-lg">₹{price.total_price}</span>
                                        <div className="h-3 w-[1px] bg-white/20 mx-1"></div>
                                        <span className="text-green-200 text-[10px] uppercase font-black tracking-widest">Final Amount</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 flex-shrink-0">
                                {price ? (
                                    <>
                                        <button data-tip="Edit Price"
                                            onClick={() => navigate(`/dashboard/services/${serviceId}/prices/update/${price.id}`)}
                                            className="icon-btn w-10 h-10"
                                            style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
                                            <Edit2 size={20} />
                                        </button>
                                        <button data-tip="Delete Price"
                                            onClick={() => { setDeleteSuccess(false); setShowDeleteModal(true); }}
                                            className="icon-btn w-10 h-10"
                                            style={{ background: "rgba(239,68,68,.25)", color: "#fca5a5" }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => navigate(`/dashboard/services/${serviceId}/prices/create`)}
                                        className="primary-btn px-8 py-4 rounded-2xl text-sm font-bold text-indigo-700 bg-white shadow-xl hover:shadow-white/20">
                                        <Plus size={18} /> Configure New Price
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {!price ? (
                        <div className="page-enter d1 text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                                style={{ background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)" }}>
                                <Package size={36} className="text-indigo-500" />
                            </div>
                            <h2 className="text-slate-800 font-bold text-2xl mb-2">No pricing configured</h2>
                            <p className="text-slate-400 mb-10 max-w-md mx-auto">This service currently has no associated price. Add a price to enable customer bookings and billing.</p>
                            <button onClick={() => navigate(`/dashboard/services/${serviceId}/prices/create`)}
                                className="primary-btn px-10 py-4 rounded-2xl text-base font-bold text-white shadow-lg"
                                style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>
                                <Plus size={20} /> Create First Price
                            </button>
                        </div>
                    ) : (
                        <div className="page-enter d1 bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 mb-5 shadow-sm">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                {/* FONT SIZE INCREASED HERE: text-xs -> text-base */}
                                <p className="text-base font-black text-slate-500 uppercase tracking-widest">Configuration Details</p>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">LIVE CONFIG</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10">
                                {/* CHANGED Business Unit to Service Name */}
                                <DetailRow label="Service Name" value={service?.name} />
                                <DetailRow label="SAC Code" value={price.sac_code} mono />
                                <DetailRow label="Base Price" value={`₹${price.price}`} />
                                <DetailRow label="GST Status" value={price.is_gst_applicable ? "Active" : "Inactive"} />
                                <DetailRow label="CGST Rate" value={`${price.cgst_percent || 0}%`} />
                                <DetailRow label="SGST Rate" value={`${price.sgst_percent || 0}%`} />
                                <DetailRow label="IGST Rate" value={`${price.igst_percent || 0}%`} />
                            </div>

                            <div className="mt-12 p-8 sm:p-10 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between gap-6"
                                style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0" }}>
                                <div>
                                    <p className="text-xs font-bold text-green-600 uppercase tracking-[0.2em] mb-1 text-center sm:text-left">Calculated Total</p>
                                    <p className="text-3xl font-black text-green-700">₹{price.total_price}</p>
                                </div>
                                <div className="w-15 h-15 rounded-3xl flex items-center justify-center shadow-lg"
                                    style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)" }}>
                                    <DollarSign size={36} style={{ color: "#fff" }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4 modal-overlay"
                    style={{ background: "rgba(15,23,42,.6)", backdropFilter: "blur(6px)" }}>
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md modal-card"
                        style={{ boxShadow: "0 30px 70px rgba(0,0,0,.25)" }}>
                        {!deleteSuccess ? (
                            <>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: "#fef2f2" }}>
                                            <Trash2 size={22} style={{ color: "#dc2626" }} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">Remove Price</h2>
                                            <p className="text-xs text-slate-400">This action cannot be undone</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                                        <X size={20} className="text-slate-400" />
                                    </button>
                                </div>
                                <div className="rounded-2xl p-5 mb-8" style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
                                    <p className="text-sm leading-relaxed text-slate-600">Are you sure you want to delete the pricing for <span className="font-bold text-slate-900">{service?.name}</span>? This will affect all current booking calculations.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 rounded-2xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</button>
                                    <button onClick={handleDelete} className="flex-1 py-4 rounded-2xl text-sm font-bold text-white shadow-lg shadow-red-200" style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)" }}>Delete Price</button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10 fade-enter">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100" style={{ background: "#dcfce7" }}>
                                    <Check size={40} style={{ color: "#16a34a" }} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Price Removed</h3>
                                <p className="text-sm text-slate-400">Redirecting you back...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ServicePricesPage;