import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, Loader2, Check, AlertCircle, User, Mail,
    Phone, Lock, X, Edit
} from "lucide-react";
import {
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation,
} from "../../../app/service/slice";

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADIENTS = [
    ["#3B82F6", "#1D4ED8"], ["#8B5CF6", "#6D28D9"],
    ["#10B981", "#059669"], ["#F59E0B", "#D97706"],
    ["#EC4899", "#BE185D"], ["#14B8A6", "#0F766E"],
    ["#F43F5E", "#BE123C"], ["#6366F1", "#4338CA"],
];
const grad     = (s = "") => GRADIENTS[(s.charCodeAt(0) || 0) % GRADIENTS.length];
const initials = (c) => `${c?.first_name?.[0] || ""}${c?.last_name?.[0] || ""}`.toUpperCase() || "?";
const fullName = (c) => [c?.first_name, c?.middle_name, c?.last_name].filter(Boolean).join(" ");

// ─────────────────────────────────────────────────────────────────────────────
const UpdateCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: raw, isLoading: loadingCustomer } = useGetCustomerByIdQuery(id);
    const customer = raw?.data ?? raw;

    const [updateCustomer, { isLoading: isSaving }] = useUpdateCustomerMutation();

    const [form, setForm]       = useState(null);
    const [success, setSuccess] = useState(false);
    const [err, setErr]         = useState("");

    React.useEffect(() => {
        if (customer && !form) {
            setForm({
                first_name: customer.first_name || "",
                middle_name: customer.middle_name || "",
                last_name: customer.last_name || "",
                email_id: customer.email_id || "",
                mobile_country_code: customer.mobile_country_code || "+91",
                mobile_number: customer.mobile_number || "",
                alternate_mobile_number_country_code: customer.alternate_mobile_number_country_code || "+91",
                alternate_mobile_number: customer.alternate_mobile_number || "",
                username: customer.username || "",
                password: "",
            });
        }
    }, [customer, form]);

    const set = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const body = { ...form };
            if (!body.password) delete body.password;
            await updateCustomer({ id, data: body }).unwrap();
            setSuccess(true);
            setTimeout(() => navigate(-1), 1600);
        } catch (ex) {
            setErr(ex?.data?.message || "Update failed. Please try again.");
        }
    };

    const TF = ({ label, name, type = "text", req, ph, icon: Icon }) => (
        <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">
                {label}{req && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Icon size={16} className="text-gray-400" />
                    </div>
                )}
                <input
                    type={type} name={name}
                    value={form?.[name] || ""} onChange={set}
                    required={req} placeholder={ph}
                    className={`w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all bg-white hover:border-gray-300 ${Icon ? "pl-11" : ""}`}
                />
            </div>
        </div>
    );

    const PhoneF = ({ label, codeName, numName, req }) => (
        <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">
                {label}{req && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
                <input
                    name={codeName} value={form?.[codeName] || ""} onChange={set}
                    placeholder="+91"
                    className="w-20 text-center px-3 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white hover:border-gray-300"
                />
                <input
                    name={numName} value={form?.[numName] || ""} onChange={set}
                    required={req} placeholder="9876543210"
                    className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white hover:border-gray-300"
                />
            </div>
        </div>
    );

    /* ── Loading ── */
    if (loadingCustomer || !form) {
        return (
            /* max-w-4xl — wider than before */
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 space-y-5 animate-pulse">
                    <div className="h-6 bg-gray-100 rounded w-1/3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ── Success ── */
    if (success) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
                        <Check size={36} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Updated!</h3>
                    <p className="text-sm text-gray-500">Changes saved. Redirecting back…</p>
                </div>
            </div>
        );
    }

    const [c1, c2] = grad(customer?.first_name);

    return (
        /* max-w-4xl — wider update form */
        <div className="max-w-4xl mx-auto p-4 sm:p-6">

            <button onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>

            {/* Header card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-6">
                <div className="h-28 sm:h-32 w-full relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }} />
                </div>
                <div className="px-6 sm:px-8 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl font-black text-white ring-6 ring-white shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-300"
                            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                            {initials(customer)}
                        </div>
                        <div className="pb-2 flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{fullName(customer)}</h1>
                            <p className="text-base font-mono text-gray-400">@{customer?.username}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Edit size={16} className="text-white" />
                        </div>
                        Edit Customer Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 ml-10">Update the fields you want to change</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {err && (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl px-4 py-3.5 text-sm text-red-700">
                            <AlertCircle size={18} className="flex-shrink-0" />
                            <span className="font-medium">{err}</span>
                        </div>
                    )}

                    {/* Personal Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <User size={16} className="text-blue-500" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Information</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TF label="First Name" name="first_name" req ph="John" icon={User} />
                            <TF label="Last Name" name="last_name" req ph="Doe" icon={User} />
                        </div>
                        <TF label="Middle Name" name="middle_name" ph="(optional)" icon={User} />
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Mail size={16} className="text-emerald-500" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Details</p>
                        </div>
                        <TF label="Email Address" name="email_id" type="email" req ph="john@example.com" icon={Mail} />
                        <PhoneF label="Mobile Number" codeName="mobile_country_code" numName="mobile_number" req />
                        <PhoneF label="Alternate Mobile" codeName="alternate_mobile_number_country_code" numName="alternate_mobile_number" />
                    </div>

                    {/* Credentials */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Lock size={16} className="text-purple-500" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Login Credentials</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TF label="Username" name="username" req ph="johndoe" icon={User} />
                            <TF label="New Password" name="password" type="password" ph="Leave blank to keep" icon={Lock} />
                        </div>
                        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                            <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700">Leave password blank to keep the existing password unchanged.</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-98 transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving}
                            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl active:scale-98 transition-all">
                            {isSaving
                                ? <><Loader2 size={16} className="animate-spin" /> Saving Changes…</>
                                : <><Check size={16} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCustomer;