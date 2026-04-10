import React, { useState, useMemo } from "react";
import {
    Search, Plus, Edit, Trash2, X, Check,
    Ban, Users, Mail, Phone, Eye,
    Loader2, UserCheck, UserX, AlertCircle,
    Shield, ShieldOff
} from "lucide-react";
import {
    useGetCustomersByBusinessQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} from "../.././app/service/slice";

// ── Helpers ───────────────────────────────────────────────────────────────────
const GRADIENTS = [
    "from-blue-500 to-blue-600",       "from-violet-500 to-violet-600",
    "from-emerald-500 to-emerald-600", "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",       "from-teal-500 to-teal-600",
    "from-rose-500 to-rose-600",       "from-indigo-500 to-indigo-600",
];
const GRADIENT_COLORS = [
    ["#3B82F6","#2563EB"], ["#8B5CF6","#7C3AED"],
    ["#10B981","#059669"], ["#F97316","#EA580C"],
    ["#EC4899","#DB2777"], ["#14B8A6","#0D9488"],
    ["#F43F5E","#E11D48"], ["#6366F1","#4F46E5"],
];
const grad       = (s = "") => GRADIENTS[(s.charCodeAt(0) || 0) % GRADIENTS.length];
const gradColors = (s = "") => GRADIENT_COLORS[(s.charCodeAt(0) || 0) % GRADIENT_COLORS.length];
const initials   = (c) => `${c?.first_name?.[0] || ""}${c?.last_name?.[0] || ""}`.toUpperCase() || "?";
const fullName   = (c) => [c?.first_name, c?.middle_name, c?.last_name].filter(Boolean).join(" ");
const fmtDate    = (d) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }); }
    catch { return null; }
};

// Module-level style constants — never recreated on render
const IC  = "w-full px-3.5 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition hover:border-gray-300 bg-white";
const ICC = "w-16 text-center px-2 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition hover:border-gray-300 bg-white";
const LC  = "block text-xs font-semibold text-gray-600 mb-1.5";

// ─────────────────────────────────────────────────────────────────────────────
const CustomersPage = () => {
    const [search, setSearch]           = useState("");
    const [filter, setFilter]           = useState("all");
    const [showAdd, setShowAdd]         = useState(false);
    const [showEdit, setShowEdit]       = useState(false);
    const [showDel, setShowDel]         = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [selected, setSelected]       = useState(null);
    const [delSuccess, setDelSuccess]   = useState(false);

    const { data: raw, isLoading, error, refetch } = useGetCustomersByBusinessQuery();
    const customers = useMemo(() => Array.isArray(raw) ? raw : raw?.data ?? [], [raw]);

    const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
    const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
    const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

    const stats = useMemo(() => ({
        total:  customers.length,
        active: customers.filter(c => c.status !== "blacklist").length,
        banned: customers.filter(c => c.status === "blacklist").length,
    }), [customers]);

    const filtered = useMemo(() => {
        let list = customers;
        if (filter === "active")    list = list.filter(c => c.status !== "blacklist");
        if (filter === "blacklist") list = list.filter(c => c.status === "blacklist");
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                fullName(c).toLowerCase().includes(q) ||
                c.email_id?.toLowerCase().includes(q) ||
                c.mobile_number?.includes(q) ||
                c.username?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [customers, search, filter]);

    const openProfile = c => { setSelected(c); setShowProfile(true); };
    const openEdit    = c => { setSelected(c); setShowEdit(true); };
    const openDel     = c => { setSelected(c); setDelSuccess(false); setShowDel(true); };

    const handleBlacklist = async (c) => {
        try {
            const status = c.status === "blacklist" ? "active" : "blacklist";
            await updateCustomer({ id: c.id, data: { status } }).unwrap();
            if (showProfile) setSelected(p => ({ ...p, status }));
            refetch();
        } catch (e) { alert(e?.data?.message || "Failed"); }
    };

    const handleDelete = async () => {
        try {
            await deleteCustomer(selected.id).unwrap();
            setDelSuccess(true);
            setTimeout(() => { setShowDel(false); setDelSuccess(false); refetch(); }, 1600);
        } catch (e) { alert(e?.data?.message || "Failed to delete"); }
    };

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <AlertCircle size={32} className="mx-auto text-red-400 mb-3" />
                <p className="font-semibold text-gray-700 mb-1">Failed to load customers</p>
                <p className="text-xs text-gray-400 mb-4">{error?.data?.message || "Unknown error"}</p>
                <button onClick={refetch} className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">Retry</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your customer database</p>
                </div>
                <button onClick={() => setShowAdd(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-100 self-start sm:self-auto cursor-pointer">
                    <Plus size={18} /> Add Customer
                </button>
            </div>

            {/* Stats + Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch">
                <div className="flex items-stretch gap-2 flex-shrink-0 flex-wrap">
                    {[
                        { label:"TOTAL",  val: stats.total,  Icon: Users,     bg:"bg-blue-50",  tx:"text-blue-600"  },
                        { label:"ACTIVE", val: stats.active, Icon: UserCheck, bg:"bg-green-50", tx:"text-green-600" },
                        { label:"BANNED", val: stats.banned, Icon: UserX,     bg:"bg-red-50",   tx:"text-red-600"   },
                    ].map(({ label, val, Icon, bg, tx }) => (
                        <div key={label} className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl shadow-sm px-4 h-[48px]">
                            <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon size={14} className={tx} />
                            </div>
                            <div className="leading-none">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                                <p className="text-base font-bold text-gray-900 mt-0.5">{isLoading ? "—" : val}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative flex-1 min-w-0">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Search by name, email, phone or username…"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full h-[48px] pl-10 pr-9 text-sm bg-white border border-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <X size={13} className="text-gray-400" />
                        </button>
                    )}
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)}
                    className="flex-shrink-0 h-[48px] text-sm border border-gray-100 bg-white rounded-xl px-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blacklist">Blacklisted</option>
                </select>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex items-center gap-4" style={{ minHeight:96 }}>
                            <div className="w-1.5 self-stretch bg-gray-100 rounded-full" />
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex-shrink-0" />
                            <div className="flex-1 space-y-2.5">
                                <div className="h-4 bg-gray-100 rounded w-1/3" />
                                <div className="h-3 bg-gray-100 rounded w-1/4" />
                                <div className="h-3 bg-gray-100 rounded w-2/5" />
                            </div>
                            <div className="hidden sm:flex gap-2">
                                <div className="h-9 w-16 bg-gray-100 rounded-xl" />
                                <div className="h-9 w-9 bg-gray-100 rounded-xl" />
                                <div className="h-9 w-9 bg-gray-100 rounded-xl" />
                                <div className="h-9 w-9 bg-gray-100 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Users size={22} className="text-blue-400" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-1">
                        {search ? `No results for "${search}"` : "No customers yet"}
                    </p>
                    {!search && (
                        <button onClick={() => setShowAdd(true)}
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
                            <Plus size={16} /> Add First Customer
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-2.5">
                    {filtered.map(c => (
                        <CustomerRow key={c.id} customer={c}
                            onView={() => openProfile(c)}
                            onEdit={() => openEdit(c)}
                            onDelete={() => openDel(c)}
                            onBlacklist={() => handleBlacklist(c)}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {showAdd && (
                <AddEditModal mode="add" onClose={() => setShowAdd(false)} isSaving={isCreating}
                    onSave={async body => { await createCustomer(body).unwrap(); setShowAdd(false); refetch(); }} />
            )}
            {showEdit && selected && (
                <AddEditModal mode="edit" initial={selected} onClose={() => setShowEdit(false)} isSaving={isUpdating}
                    onSave={async body => { await updateCustomer({ id: selected.id, data: body }).unwrap(); setShowEdit(false); refetch(); }} />
            )}
            {showProfile && selected && (
                <ProfileModal customer={selected} onClose={() => setShowProfile(false)}
                    onEdit={() => { setShowProfile(false); openEdit(selected); }}
                    onBlacklist={() => handleBlacklist(selected)} />
            )}
            {showDel && selected && (
                <DeleteModal customer={selected} success={delSuccess} isDeleting={isDeleting}
                    onConfirm={handleDelete} onClose={() => setShowDel(false)} />
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Customer Row
// ─────────────────────────────────────────────────────────────────────────────
const CustomerRow = ({ customer: c, onView, onEdit, onDelete, onBlacklist }) => {
    const g = grad(c.first_name);
    const banned = c.status === "blacklist";
    return (
        <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${banned ? "border-red-100" : "border-gray-100"}`}>
            <div className="flex items-center gap-4 px-5 py-5" style={{ minHeight:96 }}>
                <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 bg-gradient-to-b ${banned ? "from-red-400 to-red-500" : g}`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${banned ? "from-red-400 to-red-500" : g} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-lg font-extrabold text-white">{initials(c)}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{fullName(c)}</p>
                        {banned && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full uppercase">
                                <Ban size={8} /> Blacklisted
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                        {c.email_id && (
                            <span className="flex items-center gap-1 text-xs text-gray-400 truncate max-w-[200px]">
                                <Mail size={11} className="flex-shrink-0" />{c.email_id}
                            </span>
                        )}
                        {c.mobile_number && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Phone size={11} className="flex-shrink-0" />{c.mobile_country_code}{c.mobile_number}
                            </span>
                        )}
                    </div>
                    {c.username && (
                        <span className="inline-block mt-1.5 text-[10px] font-mono font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                            @{c.username}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={onView} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all cursor-pointer active:scale-95">
                        <Eye size={14} /><span className="hidden sm:inline">View</span>
                    </button>
                    <button onClick={onEdit} className="p-2.5 text-gray-600 border border-gray-200 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer active:scale-95">
                        <Edit size={14} />
                    </button>
                    <button onClick={onBlacklist} title={banned ? "Remove blacklist" : "Blacklist"}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer active:scale-95 ${banned ? "text-green-600 bg-green-50 border-green-100 hover:bg-green-100" : "text-orange-500 bg-orange-50 border-orange-100 hover:bg-orange-100"}`}>
                        {banned ? <Shield size={14} /> : <ShieldOff size={14} />}
                    </button>
                    <button onClick={onDelete} className="p-2.5 text-red-500 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition-colors cursor-pointer active:scale-95">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Add / Edit Modal
//
//  THE FIX: All <input> elements are written directly in the JSX tree —
//  no TF/PhoneF helper sub-components are used inside this modal.
//
//  Why this matters: When you define a component (const TF = ...) inside
//  another component's render function, React sees it as a BRAND NEW component
//  type on every render. This forces a full unmount → remount of the DOM node,
//  which destroys the focused input element. The user then has to click again.
//
//  By inlining the inputs, React simply updates the existing DOM node in-place
//  on every keystroke → focus is never lost.
// ─────────────────────────────────────────────────────────────────────────────
const BLANK = {
    first_name:"", last_name:"", middle_name:"",
    email_id:"", mobile_country_code:"+91", mobile_number:"",
    alternate_mobile_number_country_code:"+91", alternate_mobile_number:"",
    username:"", password:"",
};

const AddEditModal = ({ mode, initial = {}, onClose, onSave, isSaving }) => {
    const [form, setForm] = useState(() => ({ ...BLANK, ...initial, password:"" }));
    const [success, setOK] = useState(false);
    const [err, setErr]    = useState("");

    const onChange = e => {
        const name  = e.target.name;
        const value = e.target.value;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = async e => {
        e.preventDefault();
        setErr("");
        try {
            const body = { ...form };
            if (mode === "edit" && !body.password) delete body.password;
            await onSave(body);
            setOK(true);
        } catch (ex) {
            setErr(ex?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto">

                {/* Header */}
                <div className="flex justify-between items-start px-6 pt-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {mode === "add" ? "Add New Customer" : "Edit Customer"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {mode === "add" ? "Fill in customer details" : "Update customer information"}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <X size={17} className="text-gray-500" />
                    </button>
                </div>

                {!success ? (
                    <form onSubmit={submit} className="px-6 py-5 space-y-4">
                        {err && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm text-red-600">
                                <AlertCircle size={14} className="flex-shrink-0" />{err}
                            </div>
                        )}

                        {/* First Name + Last Name */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={LC}>First Name <span className="text-red-400">*</span></label>
                                <input name="first_name" value={form.first_name} onChange={onChange}
                                    required placeholder="John" className={IC} />
                            </div>
                            <div>
                                <label className={LC}>Last Name <span className="text-red-400">*</span></label>
                                <input name="last_name" value={form.last_name} onChange={onChange}
                                    required placeholder="Doe" className={IC} />
                            </div>
                        </div>

                        {/* Middle Name */}
                        <div>
                            <label className={LC}>Middle Name</label>
                            <input name="middle_name" value={form.middle_name} onChange={onChange}
                                placeholder="(optional)" className={IC} />
                        </div>

                        {/* Email + Mobile */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={LC}>Email <span className="text-red-400">*</span></label>
                                <input name="email_id" type="email" value={form.email_id} onChange={onChange}
                                    required placeholder="john@example.com" className={IC} />
                            </div>
                            <div>
                                <label className={LC}>Mobile <span className="text-red-400">*</span></label>
                                <div className="flex gap-1.5">
                                    <input name="mobile_country_code" value={form.mobile_country_code} onChange={onChange}
                                        placeholder="+91" className={ICC} />
                                    <input name="mobile_number" value={form.mobile_number} onChange={onChange}
                                        required placeholder="9876543210" className={`flex-1 ${IC}`} />
                                </div>
                            </div>
                        </div>

                        {/* Alternate Mobile */}
                        <div>
                            <label className={LC}>Alternate Mobile</label>
                            <div className="flex gap-1.5">
                                <input name="alternate_mobile_number_country_code" value={form.alternate_mobile_number_country_code} onChange={onChange}
                                    placeholder="+91" className={ICC} />
                                <input name="alternate_mobile_number" value={form.alternate_mobile_number} onChange={onChange}
                                    placeholder="9876543210" className={`flex-1 ${IC}`} />
                            </div>
                        </div>

                        {/* Login Credentials */}
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Login Credentials</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={LC}>Username <span className="text-red-400">*</span></label>
                                    <input name="username" value={form.username} onChange={onChange}
                                        required placeholder="johndoe" className={IC} />
                                </div>
                                <div>
                                    <label className={LC}>
                                        {mode === "edit" ? "New Password" : <>Password <span className="text-red-400">*</span></>}
                                    </label>
                                    <input name="password" type="password" value={form.password} onChange={onChange}
                                        required={mode === "add"}
                                        placeholder={mode === "edit" ? "Leave blank to keep" : "Min 6 chars"}
                                        className={IC} />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95">
                                Cancel
                            </button>
                            <button type="submit" disabled={isSaving}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md shadow-blue-100">
                                {isSaving
                                    ? <><Loader2 size={14} className="animate-spin" />{mode === "add" ? "Adding…" : "Saving…"}</>
                                    : mode === "add" ? "Add Customer" : "Save Changes"
                                }
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-12 px-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={28} className="text-green-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            {mode === "add" ? "Customer Added!" : "Changes Saved!"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {mode === "add" ? "New customer created successfully." : "Customer details updated."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Profile Modal
// ─────────────────────────────────────────────────────────────────────────────
const ProfileModal = ({ customer: c, onClose, onEdit, onBlacklist }) => {
    const [c1, c2] = gradColors(c.first_name);
    const banned   = c.status === "blacklist";
    const joined   = fmtDate(c.created_at || c.createdAt || c.joinedAt || c.join_date);

    const Row = ({ label, value }) => {
        if (!value && value !== 0) return null;
        return (
            <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex-shrink-0">{label}</span>
                <span className="text-sm font-semibold text-gray-800 text-right">{value}</span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-auto overflow-hidden">
                <div className="relative px-8 pt-10 pb-7 text-center"
                     style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                    <div className="absolute inset-0 opacity-10"
                         style={{ backgroundImage:"radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize:"24px 24px" }} />
                    <button onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 bg-white/25 hover:bg-white/40 rounded-xl transition-colors cursor-pointer">
                        <X size={15} className="text-white" />
                    </button>
                    <div className="w-20 h-20 bg-white/25 rounded-2xl flex items-center justify-center mx-auto mb-3 ring-4 ring-white/30 shadow-xl relative z-10">
                        <span className="text-2xl font-extrabold text-white">{initials(c)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white relative z-10">{fullName(c)}</h2>
                    <p className="text-white/70 text-sm mt-0.5 font-mono relative z-10">@{c.username}</p>
                    {banned && (
                        <span className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-bold px-3 py-1.5 bg-white/25 text-white rounded-full uppercase tracking-widest relative z-10">
                            <Ban size={9} /> Blacklisted
                        </span>
                    )}
                </div>
                <div className="px-7 py-2">
                    <Row label="Email"      value={c.email_id} />
                    <Row label="Mobile"     value={c.mobile_number ? `${c.mobile_country_code || ""}${c.mobile_number}` : null} />
                    <Row label="Alt Mobile" value={c.alternate_mobile_number ? `${c.alternate_mobile_number_country_code || ""}${c.alternate_mobile_number}` : null} />
                    <Row label="Username"   value={c.username} />
                    <Row label="Joined"     value={joined || "Not available"} />
                    <Row label="Status"     value={
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${banned ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                            {banned ? "Blacklisted" : "Active"}
                        </span>
                    } />
                </div>
                <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-4 flex gap-2.5">
                    <button onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-md shadow-blue-100 cursor-pointer">
                        <Edit size={14} /> Edit
                    </button>
                    <button onClick={onBlacklist}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-bold rounded-xl border transition-all cursor-pointer active:scale-[0.97] ${
                            banned
                                ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                                : "text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100"
                        }`}>
                        {banned ? <><Shield size={14} />Unblock</> : <><ShieldOff size={14} />Blacklist</>}
                    </button>
                    <button onClick={onClose}
                        className="px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer active:scale-[0.97]">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Delete Modal
// ─────────────────────────────────────────────────────────────────────────────
const DeleteModal = ({ customer: c, success, isDeleting, onConfirm, onClose }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl">
            {!success ? (
                <>
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Trash2 size={20} className="text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-900">Delete Customer</h2>
                                <p className="text-xs text-gray-400 mt-0.5">This cannot be undone</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                            <X size={17} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-700">
                            Are you sure you want to delete{" "}
                            <span className="font-bold text-gray-900">{fullName(c)}</span>?{" "}
                            All their data will be permanently removed.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95">
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={isDeleting}
                            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md shadow-red-100">
                            {isDeleting
                                ? <><Loader2 size={14} className="animate-spin" />Deleting…</>
                                : <><Trash2 size={14} />Delete</>
                            }
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={30} className="text-green-600" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Deleted Successfully!</h3>
                    <p className="text-sm text-gray-500">Customer has been permanently removed.</p>
                </div>
            )}
        </div>
    </div>
);

export default CustomersPage;