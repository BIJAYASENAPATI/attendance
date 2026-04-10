import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useCreateServiceDescriptionMutation,
    useGetServiceByIdQuery
} from "../../../../../app/service/slice";
import { ArrowLeft, Save, Check, Loader2, FileText, Key, Info, Sparkles } from "lucide-react";

const CreateServiceDescription = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();

    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service || serviceData?.data || serviceData;

    const [createDescription, { isLoading }] = useCreateServiceDescriptionMutation();
    const [created, setCreated] = useState(false);

    const [formData, setFormData] = useState({
        description_key: "",
        description_value: "",
    });

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
            await createDescription({
                service_id: Number(serviceId),
                ...formData,
            }).unwrap();
            setCreated(true);
        } catch (err) {
            console.error("Create error:", err);
            alert(err?.data?.message || "Failed to create description");
        }
    };

    const handleReset = () => {
        setFormData({
            description_key: "",
            description_value: "",
        });
        setCreated(false);
    };

    const handleBackToDescriptions = () => {
        navigate(`/dashboard/services/${serviceId}/descriptions`, { replace: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
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
                {!created ? (
                    <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
                        {/* Form Header with Service Badge (Center Top) */}
                        <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-b-2 border-blue-200 px-6 sm:px-8 py-6">
                            {/* Service Badge (Centered) */}
                            {service?.name && (
                                <div className="flex justify-center mb-4">
                                    <div className="inline-flex items-center gap-3 bg-white border-2 border-blue-400 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
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
                                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                    Description Details
                                </h3>
                                <p className="text-sm text-gray-600">Add key-value information about this service</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-white to-blue-50/30">
                            {/* Description Key */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Key size={14} className="text-blue-600" />
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
                                    placeholder="e.g., Warranty, Duration, Requirements"
                                    className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:outline-none transition-all hover:border-blue-300 bg-white group-hover:shadow-md"
                                />
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                                    <Info size={12} className="text-blue-500" />
                                    This is the label or category for your description
                                </p>
                            </div>

                            {/* Description Value */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <FileText size={14} className="text-emerald-600" />
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
                                    placeholder="e.g., 2 years parts and labor warranty included"
                                    className="w-full px-4 py-3.5 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition-all hover:border-emerald-300 bg-white resize-none group-hover:shadow-md"
                                />
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                                    <Info size={12} className="text-emerald-500" />
                                    Provide detailed information about this aspect
                                </p>
                            </div>

                            {/* Service Info Banner */}
                            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-2xl p-4 hover:shadow-lg transition-all">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                        <FileText size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">Adding to Service</p>
                                        <p className="text-sm font-semibold text-blue-800">{service?.name || "Loading..."}</p>
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
                                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-300 hover:shadow-2xl hover:shadow-purple-300 active:scale-95 transition-all cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Add Description
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
                                Description Added!
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-bold text-emerald-700">{formData.description_key}</span> has been successfully created.
                            </p>
                            <p className="text-xs text-gray-500">You can add another or return to the list</p>
                        </div>

                        <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-emerald-50/30">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all cursor-pointer"
                                >
                                    Add Another
                                </button>
                                <button
                                    onClick={handleBackToDescriptions}
                                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-300 hover:shadow-xl hover:shadow-purple-300 active:scale-95 transition-all cursor-pointer"
                                >
                                    View All Descriptions
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateServiceDescription;