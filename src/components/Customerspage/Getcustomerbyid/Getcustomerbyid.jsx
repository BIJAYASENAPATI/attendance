import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, Edit, Trash2, Shield, ShieldOff, Mail, Phone,
    User, Calendar, Wallet, Tag, Clock, CreditCard, AlertCircle,
    Loader2, Ban, Check, X, MapPin, TrendingUp, FileText
} from "lucide-react";
import {
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} from "../../../app/service/slice";

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADIENTS = [
    ["#3B82F6","#1D4ED8"], ["#8B5CF6","#6D28D9"],
    ["#10B981","#059669"], ["#F59E0B","#D97706"],
    ["#EC4899","#BE185D"], ["#14B8A6","#0F766E"],
    ["#F43F5E","#BE123C"], ["#6366F1","#4338CA"],
];
const grad        = (s = "") => GRADIENTS[(s.charCodeAt(0) || 0) % GRADIENTS.length];
const initials    = (c) => `${c?.first_name?.[0] || ""}${c?.last_name?.[0] || ""}`.toUpperCase() || "?";
const fullName    = (c) => [c?.first_name, c?.middle_name, c?.last_name].filter(Boolean).join(" ");
const fmtDate     = (d) => d ? new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "—";

// ─────────────────────────────────────────────────────────────────────────────
const GetCustomerById = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: raw, isLoading, error, refetch } = useGetCustomerByIdQuery(id);
    const customer = raw?.data ?? raw;

    const [updateCustomer] = useUpdateCustomerMutation();
    const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleBlacklist = async () => {
        try {
            const status = customer.status === "blacklist" ? "active" : "blacklist";
            await updateCustomer({ id, data: { status } }).unwrap();
            refetch();
        } catch (e) {
            alert(e?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCustomer(id).unwrap();
            setDeleteSuccess(true);
            setTimeout(() => navigate("/dashboard/customers"), 1600);
        } catch (e) {
            alert(e?.data?.message || "Failed to delete");
        }
    };

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="space-y-5 animate-pulse">
                    <div className="h-5 bg-gray-100 rounded w-24" />
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="h-24 bg-gray-100" />
                        <div className="p-6 space-y-4">
                            <div className="h-6 bg-gray-100 rounded w-1/3" />
                            <div className="grid grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-100 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────────
    if (error || !customer) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <button onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={24} className="text-red-400" />
                    </div>
                    <p className="font-bold text-gray-800 mb-1">Customer not found</p>
                    <p className="text-sm text-gray-400 mb-5">The customer you're looking for doesn't exist or has been deleted.</p>
                    <button onClick={() => navigate("/dashboard/customers")}
                        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                        Back to Customers
                    </button>
                </div>
            </div>
        );
    }

    const [c1, c2] = grad(customer.first_name);
    const isBlacklisted = customer.status === "blacklist";

    const bookings = [
        { id: "BK001", service: "Deep Tissue Massage", date: "2026-02-15 14:00", amount: 1200, status: "completed" },
        { id: "BK002", service: "Facial Treatment",    date: "2026-02-10 10:30", amount: 800,  status: "completed" },
        { id: "BK003", service: "Manicure",            date: "2026-02-05 16:00", amount: 600,  status: "cancelled" },
    ];

    const payments = [
        { id: "PAY001", date: "2026-02-15", amount: 1200, method: "Card", status: "paid" },
        { id: "PAY002", date: "2026-02-10", amount: 800,  method: "UPI",  status: "paid" },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6">

            {/* Back */}
            <button onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={16} /> Back
            </button>

            {/* ══ HERO CARD ══ */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-6">
                <div className="h-32 sm:h-36 w-full relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                    {isBlacklisted && (
                        <div className="absolute top-5 right-5">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg">
                                <Ban size={13} /> Blacklisted
                            </span>
                        </div>
                    )}
                </div>

                <div className="px-6 sm:px-8 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 sm:-mt-16 mb-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-black text-white ring-6 ring-white shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-300"
                            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                            {initials(customer)}
                        </div>
                        <div className="pb-1 flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{fullName(customer)}</h1>
                            <p className="text-sm sm:text-base font-mono text-gray-400">@{customer.username}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pb-1">
                            <button onClick={() => navigate(`/dashboard/customers/update/${id}`)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 hover:shadow-lg active:scale-95 transition-all">
                                <Edit size={15} /> <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button onClick={handleBlacklist}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl hover:shadow-lg active:scale-95 transition-all ${
                                    isBlacklisted
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                        : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                                }`}>
                                {isBlacklisted ? <><Shield size={15} /><span className="hidden sm:inline">Unblock</span></> : <><ShieldOff size={15} /><span className="hidden sm:inline">Blacklist</span></>}
                            </button>
                            <button onClick={() => setShowDeleteModal(true)}
                                className="p-2.5 text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 hover:shadow-lg active:scale-95 transition-all">
                                <Trash2 size={17} />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Bookings", value: bookings.length,  Icon: Calendar,   color: "text-blue-600",    bg: "bg-blue-50",    hover: "hover:bg-blue-100"    },
                            { label: "Total Spent",    value: `₹${payments.reduce((s,p) => s+p.amount,0).toLocaleString()}`, Icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", hover: "hover:bg-emerald-100" },
                            { label: "Wallet Balance", value: "₹0",             Icon: Wallet,     color: "text-purple-600",  bg: "bg-purple-50",  hover: "hover:bg-purple-100"  },
                            { label: "Member Since",   value: fmtDate(customer.created_at), Icon: User, color: "text-gray-600", bg: "bg-gray-50", hover: "hover:bg-gray-100"    },
                        ].map(({ label, value, Icon, color, bg, hover }) => (
                            <div key={label} className={`${bg} ${hover} rounded-2xl p-5 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default`}>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
                                    <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center border border-white shadow-sm`}>
                                        <Icon size={16} className={color} />
                                    </div>
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ CONTACT & DETAILS — Customer ID card removed ══ */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 mb-6">
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {customer.email_id && (
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <Mail size={18} className="text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email Address</p>
                                <p className="text-sm text-gray-800 font-semibold truncate">{customer.email_id}</p>
                            </div>
                        </div>
                    )}
                    {customer.mobile_number && (
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <Phone size={18} className="text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Mobile Number</p>
                                <p className="text-sm text-gray-800 font-semibold">{customer.mobile_country_code}{customer.mobile_number}</p>
                            </div>
                        </div>
                    )}
                    {customer.alternate_mobile_number && (
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                <Phone size={18} className="text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Alternate Mobile</p>
                                <p className="text-sm text-gray-800 font-semibold">{customer.alternate_mobile_number_country_code}{customer.alternate_mobile_number}</p>
                            </div>
                        </div>
                    )}
                    {/* Username card kept, Customer ID card REMOVED */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <User size={18} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Username</p>
                            <p className="text-sm text-gray-800 font-bold font-mono">@{customer.username}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ BOOKING HISTORY ══ */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 mb-6">
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Calendar size={16} className="text-white" />
                    </div>
                    Booking History
                    <span className="ml-auto text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                    </span>
                </h2>
                {bookings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Calendar size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No bookings yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookings.map(b => (
                            <div key={b.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-gray-100 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-transparent hover:border-blue-200 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200">
                                        <Calendar size={22} className="text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-gray-900 text-base mb-1 truncate">{b.service}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1"><Clock size={11} />{b.date}</span>
                                            <span className="flex items-center gap-1 font-mono"><FileText size={11} />{b.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                    <p className="text-xl font-bold text-gray-900">₹{b.amount.toLocaleString()}</p>
                                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${
                                        b.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                                        "bg-amber-100 text-amber-700"
                                    }`}>{b.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ══ PAYMENT HISTORY ══ */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8">
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <CreditCard size={16} className="text-white" />
                    </div>
                    Payment History
                    <span className="ml-auto text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        ₹{payments.reduce((s,p) => s+p.amount,0).toLocaleString()}
                    </span>
                </h2>
                {payments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No payments yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payments.map(p => (
                            <div key={p.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-gray-100 rounded-2xl hover:bg-gradient-to-br hover:from-emerald-50/50 hover:to-transparent hover:border-emerald-200 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200">
                                        <CreditCard size={22} className="text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-gray-900 text-base mb-1">{p.method}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1"><Calendar size={11} />{p.date}</span>
                                            <span className="flex items-center gap-1 font-mono"><FileText size={11} />{p.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                    <p className="text-xl font-bold text-emerald-600">₹{p.amount.toLocaleString()}</p>
                                    <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-full">{p.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl">
                        {!deleteSuccess ? (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Delete Customer</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">This cannot be undone</p>
                                    </div>
                                    <button onClick={() => setShowDeleteModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                        <X size={17} className="text-gray-500" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mb-6 bg-red-50 border border-red-100 rounded-xl p-3">
                                    Delete <span className="font-semibold text-gray-900">{fullName(customer)}</span>? All data will be permanently removed.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button onClick={handleDelete} disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                                        {isDeleting ? <><Loader2 size={14} className="animate-spin" />Deleting…</> : "Delete"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={26} className="text-emerald-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Deleted!</h3>
                                <p className="text-sm text-gray-500">Customer removed successfully.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetCustomerById;