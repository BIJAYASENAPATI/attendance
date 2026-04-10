import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, Loader2, Check, AlertCircle,
    Trash2, AlertTriangle, User, Mail, Phone, Calendar
} from "lucide-react";
import {
    useGetCustomerByIdQuery,
    useDeleteCustomerMutation,
} from "../../../app/service/slice";

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADIENTS = [
    ["#3B82F6","#1D4ED8"], ["#8B5CF6","#6D28D9"],
    ["#10B981","#059669"], ["#F59E0B","#D97706"],
    ["#EC4899","#BE185D"], ["#14B8A6","#0F766E"],
    ["#F43F5E","#BE123C"], ["#6366F1","#4338CA"],
];
const grad     = (s = "") => GRADIENTS[(s.charCodeAt(0) || 0) % GRADIENTS.length];
const initials = (c) => `${c?.first_name?.[0] || ""}${c?.last_name?.[0] || ""}`.toUpperCase() || "?";
const fullName = (c) => [c?.first_name, c?.middle_name, c?.last_name].filter(Boolean).join(" ");
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }) : "—";

// ─────────────────────────────────────────────────────────────────────────────
const DeleteCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: raw, isLoading } = useGetCustomerByIdQuery(id);
    const customer = raw?.data ?? raw;

    const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

    const [confirmed, setConfirmed] = useState(false);
    const [success, setSuccess]     = useState(false);
    const [err, setErr]             = useState("");
    const [inputVal, setInputVal]   = useState("");

    const CONFIRM_WORD = "DELETE";
    const canDelete = inputVal === CONFIRM_WORD;

    const handleDelete = async () => {
        if (!canDelete) return;
        setErr("");
        try {
            await deleteCustomer(id).unwrap();
            setSuccess(true);
            setTimeout(() => navigate("/dashboard/customers"), 1800);
        } catch (ex) {
            setErr(ex?.data?.message || "Failed to delete. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 space-y-5 animate-pulse">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto" />
                    <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto" />
                    <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                    <div className="h-12 bg-gray-100 rounded-xl" />
                    <div className="h-12 bg-gray-100 rounded-xl" />
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl animate-scale-in">
                        <Check size={36} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Deleted</h3>
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">{fullName(customer)}</span> has been permanently removed.
                    </p>
                    <p className="text-xs text-gray-400 mt-3">Redirecting to customers list…</p>
                </div>
            </div>
        );
    }

    const [c1, c2] = grad(customer?.first_name);

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6">

            <button onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            {/* Danger banner */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-6 flex items-start gap-4 mb-6 shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <AlertTriangle size={22} className="text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-base font-bold text-red-800 mb-1">Permanent Action — Cannot Be Undone</p>
                    <p className="text-sm text-red-700 leading-relaxed">
                        Deleting this customer will permanently remove <strong>all their data</strong> including bookings, payments, wallet balance, notes, and tags. This action is <strong>irreversible</strong>.
                    </p>
                </div>
            </div>

            {/* Customer card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-6">
                <div className="h-20 sm:h-24 w-full relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                </div>
                <div className="px-6 sm:px-8 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
                        <div
                            className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black text-white ring-6 ring-white shadow-2xl flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                            {initials(customer)}
                        </div>
                        <div className="pb-1 flex-1 min-w-0">
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{fullName(customer)}</p>
                            <p className="text-sm font-mono text-gray-400">@{customer?.username}</p>
                        </div>
                    </div>
                    <div className="mt-5 space-y-3">
                        {customer?.email_id && (
                            <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-xl">
                                <Mail size={16} className="text-blue-500 flex-shrink-0" />
                                <span className="truncate">{customer.email_id}</span>
                            </div>
                        )}
                        {customer?.mobile_number && (
                            <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-xl">
                                <Phone size={16} className="text-emerald-500 flex-shrink-0" />
                                {customer.mobile_country_code}{customer.mobile_number}
                            </div>
                        )}
                        {customer?.created_at && (
                            <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-xl">
                                <Calendar size={16} className="text-purple-500 flex-shrink-0" />
                                Member since {fmtDate(customer.created_at)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h2>
                <p className="text-sm text-gray-600 mb-5">
                    To confirm, type <span className="font-bold text-red-600 font-mono text-base">{CONFIRM_WORD}</span> in the box below.
                </p>

                <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value.toUpperCase())}
                    placeholder={`Type ${CONFIRM_WORD} to confirm`}
                    className={`w-full px-5 py-3.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all mb-5 font-mono tracking-widest font-bold ${
                        inputVal && !canDelete
                            ? "border-red-300 bg-red-50 focus:ring-red-300 text-red-700"
                            : canDelete
                                ? "border-emerald-300 bg-emerald-50 focus:ring-emerald-300 text-emerald-800"
                                : "border-gray-200 focus:ring-blue-500"
                    }`}
                />

                {err && (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-5">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span className="font-medium">{err}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => navigate(-1)}
                        className="flex-1 px-6 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-98 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!canDelete || isDeleting}
                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:shadow-xl active:scale-98 transition-all">
                        {isDeleting
                            ? <><Loader2 size={16} className="animate-spin" /> Deleting Customer…</>
                            : <><Trash2 size={16} /> Delete Permanently</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCustomer;