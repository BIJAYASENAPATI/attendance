import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetServiceByIdQuery,
    useGetAllServiceMetadataQuery,
    useCreateServiceMetadataMutation,
    useUpdateServiceMetadataMutation,
    useDeleteServiceMetadataMutation,
} from "../../../../app/service/slice";
import { ArrowLeft, Plus, Edit2, Trash2, Database, X, Check, Save, Loader2, Info } from "lucide-react";

const VALUE_TYPES = ["text", "option", "date"];

const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes shimmer { 0% { background-position:-1000px 0; } 100% { background-position:1000px 0; } }

        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out both; }
        
        .shimmer-bg {
            background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
            background-size: 1000px 100%; animation: shimmer 2s infinite linear;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }

        .input-focus-effect:focus {
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
            border-color: #6366f1;
        }

        .btn-grad {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            transition: all 0.3s ease;
        }
        .btn-grad:hover {
            filter: brightness(1.1);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
        }
    `}</style>
);

const typeBadgeStyle = {
    text: "bg-blue-50 text-blue-600 border-blue-100",
    option: "bg-purple-50 text-purple-600 border-purple-100",
    date: "bg-rose-50 text-rose-600 border-rose-100",
};

const MetaForm = ({ initial = {}, onSubmit, onCancel, isLoading, submitLabel }) => {
    const [form, setForm] = useState({
        metadata_name: initial.metadata_name || "",
        metadata_value_type: initial.metadata_value_type || "text",
    });

    return (
        <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Metadata Name</label>
                <input 
                    type="text" 
                    value={form.metadata_name}
                    onChange={e => setForm(p => ({ ...p, metadata_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 outline-none input-focus-effect transition-all font-medium"
                    placeholder="Enter descriptive name..."
                    required
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Type of Input</label>
                <div className="grid grid-cols-3 gap-2">
                    {VALUE_TYPES.map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setForm(p => ({ ...p, metadata_value_type: t }))}
                            className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                form.metadata_value_type === t 
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                            }`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onCancel} className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all cursor-pointer">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 text-sm font-bold text-white btn-grad rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};

const ServiceMetadataPage = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();
    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service ?? serviceData?.data ?? serviceData;
    const { data: allMetadata = [], isLoading, refetch } = useGetAllServiceMetadataQuery();

    const metadata = useMemo(() => allMetadata.filter(m => String(m.service_id) === String(serviceId)), [allMetadata, serviceId]);

    const [createMeta, { isLoading: isCreating }] = useCreateServiceMetadataMutation();
    const [updateMeta, { isLoading: isUpdating }] = useUpdateServiceMetadataMutation();
    const [deleteMeta, { isLoading: isDeleting }] = useDeleteServiceMetadataMutation();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingMeta, setEditingMeta] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMeta, setSelectedMeta] = useState(null);

    // Handlers
    const handleAction = async (fn, successMsg) => {
        try {
            await fn().unwrap();
            refetch();
            setShowCreateForm(false);
            setEditingMeta(null);
            setShowDeleteModal(false);
        } catch (err) { alert(err?.data?.message || "Action failed"); }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="shimmer-bg h-40 rounded-3xl w-full" />
                <div className="shimmer-bg h-20 rounded-2xl w-full" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            <GlobalStyles />
            
            {/* Top Navigation Bar */}
            <div className="relative py-6 px-8 mb-6">
                <div className="flex items-center justify-between">
                    {/* Back Button - Left */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors group cursor-pointer"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    {/* Live Database Indicator - Right */}
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LIVEDATABASE</span>
                    </div>
                </div>
            </div>

            {/* Main Content - Wider Container */}
            <div className="max-w-6xl mx-auto px-8">
                {/* Header Card */}
                <div className="relative overflow-hidden rounded-[2rem] p-8 mb-8 text-white shadow-2xl shadow-indigo-200 group animate-slide-up"
                    style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)" }}>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Database size={20} className="text-indigo-200" />
                                </div>
                                <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Metadata Manager</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                                {service?.name || "Service Details"}
                            </h1>
                            <p className="text-indigo-100/80 text-sm max-w-md font-medium">
                                Configure custom fields and data points for this service to enhance reporting and categorization.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center min-w-[120px]">
                            <div className="text-4xl font-black mb-1">{metadata.length}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Total Fields</div>
                        </div>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl" />
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Field Definitions
                        <Info size={14} className="text-slate-400" />
                    </h3>
                    <button 
                        onClick={() => setShowCreateForm(true)}
                        className="btn-grad px-6 py-3 rounded-xl text-white text-sm font-bold flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={18} /> New Field
                    </button>
                </div>

                {/* Create Form Container */}
                {showCreateForm && (
                    <div className="animate-scale-in glass-card rounded-2xl p-6 border-2 border-indigo-100 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Create New Field</h2>
                            <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X /></button>
                        </div>
                        <MetaForm 
                            submitLabel="Create Metadata" 
                            isLoading={isCreating} 
                            onCancel={() => setShowCreateForm(false)}
                            onSubmit={(form) => handleAction(() => createMeta({ ...form, service_id: Number(serviceId) }))}
                        />
                    </div>
                )}

                {/* Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metadata.map((meta, idx) => (
                        <div key={meta.id} 
                            className="animate-slide-up group bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300"
                            style={{ animationDelay: `${idx * 0.05}s` }}>
                            
                            {editingMeta?.id === meta.id ? (
                                <MetaForm 
                                    initial={meta}
                                    submitLabel="Update"
                                    isLoading={isUpdating}
                                    onCancel={() => setEditingMeta(null)}
                                    onSubmit={(form) => handleAction(() => updateMeta({ id: meta.id, body: form }))}
                                />
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${typeBadgeStyle[meta.metadata_value_type] || "bg-slate-50"}`}>
                                            {meta.metadata_value_type}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingMeta(meta)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"><Edit2 size={14}/></button>
                                            <button onClick={() => { setSelectedMeta(meta); setShowDeleteModal(true); }} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-1 capitalize truncate">{meta.metadata_name}</h4>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {metadata.length === 0 && !showCreateForm && (
                        <div className="md:col-span-2 py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Database size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">No Metadata Defined</h3>
                            <p className="text-slate-400 text-sm mb-6">Start by adding your first custom data field.</p>
                            <button onClick={() => setShowCreateForm(true)} className="text-indigo-600 font-bold hover:underline cursor-pointer">Click here to start</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-scale-in">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Are you sure?</h2>
                        <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
                            Deleting <span className="font-bold text-slate-800">"{selectedMeta?.metadata_name}"</span> is permanent and may affect linked data.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">Cancel</button>
                            <button onClick={() => handleAction(() => deleteMeta(selectedMeta.id))} disabled={isDeleting} className="flex-1 py-4 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-lg shadow-rose-100 transition-all cursor-pointer">
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceMetadataPage;