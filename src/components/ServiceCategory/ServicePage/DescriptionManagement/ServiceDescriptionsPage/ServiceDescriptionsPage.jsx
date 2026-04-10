import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetDescriptionsByServiceQuery,
    useDeleteServiceDescriptionMutation,
    useGetServiceByIdQuery
} from "../../../../../app/service/slice";
import { ArrowLeft, Plus, Edit, Trash2, FileText, X, Check, Loader2, AlertCircle, List } from "lucide-react";

const ServiceDescriptionsPage = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();

    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service || serviceData?.data || serviceData;

    const { data: descriptions = [], isLoading, error } = useGetDescriptionsByServiceQuery(serviceId);
    const [deleteDescription, { isLoading: isDeleting }] = useDeleteServiceDescriptionMutation();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDesc, setSelectedDesc] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleDelete = async () => {
        try {
            await deleteDescription(selectedDesc.id).unwrap();
            setDeleteSuccess(true);
            setTimeout(() => {
                setShowDeleteModal(false);
                setSelectedDesc(null);
                setDeleteSuccess(false);
            }, 1500);
        } catch (err) {
            console.error("Delete error:", err);
            alert(err?.data?.message || "Failed to delete description");
        }
    };

    // ── Loading Skeleton ──────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading your data...</p>
                </div>
            </div>
        );
    }

    // ── Error State ───────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                <div className="text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <p className="text-lg font-bold text-gray-800 mb-2">Error loading descriptions</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-white border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer shadow-sm"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse delay-700" />

            <div className="max-w-5xl mx-auto relative z-10">

                {/* ── Header / Back Button ──────────────────────────────────── */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-all group cursor-pointer"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <div>
                        {/* Styled Title with Gradient */}
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800">
                            Service Descriptions
                        </h1>
                        {service?.name && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                                <FileText size={14} className="text-indigo-600" />
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{service.name}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Styled Action Button with Gradient and Pointer */}
                    <button
                        onClick={() => navigate(`/dashboard/services/${serviceId}/descriptions/create`)}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-700 text-white text-sm font-black rounded-2xl hover:from-indigo-700 hover:to-violet-800 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95 transition-all cursor-pointer group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                        Add Description
                    </button>
                </div>

                {/* ── Stats Card ────────────────────────────────────────────── */}
                <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 p-6 mb-8 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <List size={28} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                Total Entries
                            </p>
                            <p className="text-4xl font-black text-slate-900 leading-none">{descriptions.length}</p>
                        </div>
                    </div>
                </div>

                {/* ── Main Content Grid ──────────────────────────────────────── */}
                {descriptions.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-16 text-center animate-in fade-in duration-700">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Empty List</h3>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Click the "Add Description" button to begin populating this service.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {descriptions.map((desc, index) => {
                            const colors = [
                                { grad: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" },
                                { grad: "from-indigo-500 to-purple-500", bg: "bg-indigo-50", text: "text-indigo-700" },
                                { grad: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700" },
                                { grad: "from-rose-500 to-orange-500", bg: "bg-rose-50", text: "text-rose-700" },
                            ];
                            const color = colors[index % colors.length];

                            return (
                                <div
                                    key={desc.id}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    className="group bg-white rounded-[2rem] border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
                                >
                                    <div className={`h-1.5 bg-gradient-to-r ${color.grad}`} />
                                    <div className="p-8">
                                        <div className={`inline-flex items-center gap-2 ${color.bg} ${color.text} px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4`}>
                                            {desc.description_key}
                                        </div>
                                        <p className="text-slate-600 text-base font-medium leading-relaxed mb-8 min-h-[3rem]">
                                            {desc.description_value}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => navigate(`/dashboard/services/${serviceId}/descriptions/update/${desc.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer font-bold text-sm"
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedDesc(desc);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Delete Confirmation Modal ─────────────────────────────── */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                            {!deleteSuccess ? (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                            <Trash2 size={32} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900">Are you sure?</h2>
                                        <p className="text-slate-500 mt-2 font-medium">
                                            Delete <span className="text-slate-900 font-bold">"{selectedDesc?.description_key}"</span>? This cannot be undone.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            className="flex-1 px-6 py-4 border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl text-sm font-black hover:bg-red-600 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-red-200"
                                        >
                                            {isDeleting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Delete Now"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-6 animate-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-200">
                                        <Check size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">Deleted!</h3>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDescriptionsPage;