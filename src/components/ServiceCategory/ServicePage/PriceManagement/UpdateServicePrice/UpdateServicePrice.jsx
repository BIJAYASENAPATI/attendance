import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useUpdateServicePriceMutation,
    useGetSingleServicePriceQuery,
    useGetServiceByIdQuery
} from "../../../../../app/service/slice";
import { ArrowLeft, Save, Check, Calculator, Info } from "lucide-react";

const UpdateServicePrice = () => {
    const { id: serviceId, priceId } = useParams();
    const navigate = useNavigate();

    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service || serviceData?.data || serviceData;

    const { data: priceData, isLoading: loadingPrice } = useGetSingleServicePriceQuery(priceId);
    const price = priceData?.data;

    const [updatePrice, { isLoading }] = useUpdateServicePriceMutation();
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [formData, setFormData] = useState({
        price: "",
        sac_code: "",
        is_gst_applicable: false,
        cgst_percent: 0,
        sgst_percent: 0,
        igst_percent: 0,
    });

    useEffect(() => {
        if (price) {
            setFormData({
                price: price.price || "",
                sac_code: price.sac_code || "",
                is_gst_applicable: price.is_gst_applicable || false,
                cgst_percent: price.cgst_percent || 0,
                sgst_percent: price.sgst_percent || 0,
                igst_percent: price.igst_percent || 0,
            });
        }
    }, [price]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const calculateTotal = () => {
        const base = Number(formData.price) || 0;
        if (!formData.is_gst_applicable) return base.toFixed(2);
        const cgst = (base * Number(formData.cgst_percent)) / 100;
        const sgst = (base * Number(formData.sgst_percent)) / 100;
        const igst = (base * Number(formData.igst_percent)) / 100;
        return (base + cgst + sgst + igst).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePrice({
                id: priceId,
                price: Number(formData.price),
                sac_code: formData.sac_code,
                is_gst_applicable: formData.is_gst_applicable,
                cgst_percent: Number(formData.cgst_percent),
                sgst_percent: Number(formData.sgst_percent),
                igst_percent: Number(formData.igst_percent),
            }).unwrap();

            setUpdateSuccess(true);
            setTimeout(() => {
                navigate(`/dashboard/services/${serviceId}/prices`);
            }, 2000);
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (loadingPrice) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Fetching price details...</p>
            </div>
        );
    }

    return (
        /* Increased width to 5xl for better visual balance */
        <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
            
            {/* Header Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 items-center">
                {/* Back Button on the Left */}
                <div className="md:col-span-3">
                    <button
                        onClick={() => navigate(`/dashboard/services/${serviceId}/prices`)}
                        className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Pricing List
                    </button>
                </div>

                {/* Title and Service Info Centered */}
                <div className="md:col-span-6 text-center">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Update Service Price
                    </h1>
                    <p className="text-gray-500 flex items-center justify-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase tracking-wider">Service</span>
                        <span className="font-semibold text-gray-700">{service?.name}</span>
                    </p>
                </div>

                {/* Spacer to maintain center alignment */}
                <div className="hidden md:block md:col-span-3"></div>
            </div>

            {!updateSuccess ? (
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
                        {/* Main Form Content */}
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Top Row: Price and SAC */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Base Price (₹) *</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium group-focus-within:text-blue-500">₹</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">SAC Code</label>
                                    <input
                                        type="text"
                                        name="sac_code"
                                        value={formData.sac_code}
                                        onChange={handleChange}
                                        placeholder="Enter SAC Code"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* GST Toggle */}
                            <div className={`p-4 rounded-2xl border transition-all ${formData.is_gst_applicable ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="is_gst_applicable"
                                            checked={formData.is_gst_applicable}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className="font-bold text-gray-800">Taxable (GST Applicable)</span>
                                </label>
                            </div>

                            {/* GST Breakdown Grid */}
                            {formData.is_gst_applicable && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {['cgst_percent', 'sgst_percent', 'igst_percent'].map((field) => (
                                        <div key={field} className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                                {field.replace('_percent', '').toUpperCase()} (%)
                                            </label>
                                            <input
                                                type="number"
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                step="0.01"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sticky Footer / Summary */}
                        <div className="p-6 md:p-8 bg-gray-50/80 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                        <Calculator size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium leading-none mb-1">Total Payable Amount</p>
                                        <p className="text-3xl font-black text-gray-900">₹{calculateTotal()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/dashboard/services/${serviceId}/prices`)}
                                        className="flex-1 md:flex-none px-6 py-3 text-gray-700 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] md:flex-none px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Update Price
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Price Updated!</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        The changes have been saved successfully. Redirecting you back to the pricing dashboard...
                    </p>
                </div>
            )}

            {/* Helper Note */}
            <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="mt-0.5 text-amber-600">
                    <Info size={20} />
                </div>
                <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Updating the price will apply to all new transactions. Existing invoices or quotes created prior to this change will remain unaffected.
                </p>
            </div>
        </div>
    );
};

export default UpdateServicePrice;