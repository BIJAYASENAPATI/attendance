import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useUpdateServiceDescriptionMutation,
    useGetSingleServiceDescriptionQuery,
    useGetServiceByIdQuery
} from "../../../../../app/service/slice";
import { ArrowLeft, Save, Check, Loader2, FileText, Key, Info, Edit2, Sparkles } from "lucide-react";

const UpdateServiceDescription = () => {
    const { id: serviceId, descId } = useParams();
    const navigate = useNavigate();

    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service || serviceData?.data || serviceData;

    const { data: descData, isLoading: loadingDesc } = useGetSingleServiceDescriptionQuery(descId);
    const desc = descData?.data || descData;

    const [updateDescription, { isLoading }] = useUpdateServiceDescriptionMutation();
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [formData, setFormData] = useState({
        description_key: "",
        description_value: "",
    });

    useEffect(() => {
        if (desc) {
            setFormData({
                description_key: desc.description_key || "",
                description_value: desc.description_value || "",
            });
        }
    }, [desc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDescription({
                id: descId,
                data: formData,
            }).unwrap();
            setUpdateSuccess(true);
            setTimeout(() => {
                navigate(`/dashboard/services/${serviceId}/descriptions`, { replace: true });
            }, 2000);
        } catch (err) {
            console.error("Update error:", err);
            alert(err?.data?.message || "Failed to update description");
        }
    };

    const handleBackToDescriptions = () => {
        navigate(`/dashboard/services/${serviceId}/descriptions`, { replace: true });
    };

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loadingDesc) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-3xl mx-auto space-y-5 animate-pulse">
                    <div className="h-5 bg-purple-100 rounded w-32" />
                    <div className="h-8 bg-purple-100 rounded w-48" />
                    <div className="bg-white rounded-3xl border border-purple-100 p-8 space-y-6">
                        <div className="h-12 bg-purple-100 rounded-xl" />
                        <div className="h-32 bg-purple-100 rounded-xl" />
                        <div className="h-12 bg-purple-100 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 sm:p-6 lg:p-8">
            <button
                onClick={handleBackToDescriptions}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 transition-all group cursor-pointer"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Descriptions
            </button>
            <div className="max-w-3xl mx-auto">

                {/* ══════════════════════════════════════════════════
                    FORM OR SUCCESS STATE
                ══════════════════════════════════════════════════ */}
                {!updateSuccess ? (
                    <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
                        {/* Form Header with Service Badge (Center Top) */}
                        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 border-b-2 border-purple-200 px-6 sm:px-8 py-6">
                            {/* Service Badge (Centered) */}
                            {service?.name && (
                                <div className="flex justify-center mb-4">
                                    <div className="inline-flex items-center gap-3 bg-white border-2 border-purple-400 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                            <FileText size={20} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Service</p>
                                            <p className="text-base font-bold text-gray-900 leading-none">{service.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section Title */}
                            <div className="text-center">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                                    Update Description
                                </h3>
                                <p className="text-sm text-gray-600">Modify the key-value information below</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-white to-purple-50/30">
                            {/* Description Key */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Key size={14} className="text-purple-600" />
                                    </div>
                                    Information Type (Key)
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="description_key"
                                    value={formData.description_key}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-400 focus:outline-none transition-all hover:border-purple-300 bg-white group-hover:shadow-md"
                                />
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                                    <Info size={12} className="text-purple-500" />
                                    This is the label or category for your description
                                </p>
                            </div>

                            {/* Description Value */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                                        <FileText size={14} className="text-pink-600" />
                                    </div>
                                    Description Detail (Value)
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description_value"
                                    value={formData.description_value}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-400 focus:outline-none transition-all hover:border-pink-300 bg-white resize-none group-hover:shadow-md"
                                />
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                                    <Info size={12} className="text-pink-500" />
                                    Provide detailed information about this aspect
                                </p>
                            </div>

                            {/* Service Info Banner */}
                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-4 hover:shadow-lg transition-all">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                        <FileText size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">Editing Description For</p>
                                        <p className="text-sm font-semibold text-purple-800">{service?.name || "Loading..."}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleBackToDescriptions}
                                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-300 hover:shadow-2xl hover:shadow-pink-300 active:scale-95 transition-all cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Update Description
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 p-6 sm:p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl animate-bounce">
                                <Check size={48} className="text-white" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Updated Successfully!
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                                Your description has been saved successfully.
                            </p>
                            <p className="text-xs text-gray-500">Redirecting to descriptions list...</p>
                        </div>

                        <div className="p-6 sm:p-8 border-t-2 border-gray-100 bg-gradient-to-b from-white to-emerald-50/30">
                            <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1 flex-shrink-0 animate-pulse" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Updated</p>
                                        <p className="text-base font-semibold text-gray-900 truncate">{formData.description_key}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateServiceDescription;