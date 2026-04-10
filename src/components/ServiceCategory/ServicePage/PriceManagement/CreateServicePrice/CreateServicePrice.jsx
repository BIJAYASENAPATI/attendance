import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useCreateServicePriceMutation,
    useGetServiceByIdQuery
} from "../../../../../app/service/slice";
import { ArrowLeft, Save, Check } from "lucide-react";

const CreateServicePrice = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();

    const { data: serviceData } = useGetServiceByIdQuery(serviceId);
    const service = serviceData?.service || serviceData?.data || serviceData;

    const [createPrice, { isLoading }] = useCreateServicePriceMutation();
    const [created, setCreated] = useState(false);

    const [formData, setFormData] = useState({
        price: "",
        sac_code: "",
        is_gst_applicable: false,
        cgst_percent: 0,
        sgst_percent: 0,
        igst_percent: 0,
    });

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
            await createPrice({
                service_id: Number(serviceId),
                price: Number(formData.price),
                sac_code: formData.sac_code,
                is_gst_applicable: formData.is_gst_applicable,
                cgst_percent: Number(formData.cgst_percent),
                sgst_percent: Number(formData.sgst_percent),
                igst_percent: Number(formData.igst_percent),
            }).unwrap();

            setCreated(true);
        } catch (err) {
            console.error("Create error:", err);
            alert(err?.data?.message || "Failed to create price");
        }
    };

    const handleReset = () => {
        setFormData({
            price: "",
            sac_code: "",
            is_gst_applicable: false,
            cgst_percent: 0,
            sgst_percent: 0,
            igst_percent: 0,
        });
        setCreated(false);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(`/dashboard/services/${serviceId}/prices`)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    Back to Price Details
                </button>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Service Price</h1>
                    <p className="text-gray-600 mt-1">{service?.name}</p>
                </div>
            </div>

            {/* Form or Success */}
            {!created ? (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Base Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Base Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                step="0.01"
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* SAC Code */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SAC Code
                            </label>
                            <input
                                type="text"
                                name="sac_code"
                                value={formData.sac_code}
                                onChange={handleChange}
                                placeholder="998314"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* GST Applicable Checkbox */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="gst_applicable"
                                name="is_gst_applicable"
                                checked={formData.is_gst_applicable}
                                onChange={handleChange}
                                className="w-5 h-5 text-blue-500 rounded"
                            />
                            <label htmlFor="gst_applicable" className="text-sm font-medium text-gray-700">
                                Apply GST to this service
                            </label>
                        </div>

                        {/* GST Fields */}
                        {formData.is_gst_applicable && (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CGST (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="cgst_percent"
                                        value={formData.cgst_percent}
                                        onChange={handleChange}
                                        step="0.01"
                                        placeholder="9"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        SGST (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="sgst_percent"
                                        value={formData.sgst_percent}
                                        onChange={handleChange}
                                        step="0.01"
                                        placeholder="9"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        IGST (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="igst_percent"
                                        value={formData.igst_percent}
                                        onChange={handleChange}
                                        step="0.01"
                                        placeholder="18"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Price Summary */}
                        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Subtotal:</span>
                                    <span className="font-semibold">₹{formData.price || "0.00"}</span>
                                </div>
                                {formData.is_gst_applicable && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">
                                            GST ({(Number(formData.cgst_percent) + Number(formData.sgst_percent) + Number(formData.igst_percent)).toFixed(2)}%):
                                        </span>
                                        <span className="font-semibold">
                                            ₹{(calculateTotal() - Number(formData.price || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-blue-300">
                                    <span className="text-lg font-semibold text-gray-900">Total Payable:</span>
                                    <span className="text-2xl font-bold text-blue-600">₹{calculateTotal()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/dashboard/services/${serviceId}/prices`)}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? "Creating..." : (
                                    <>
                                        <Save size={18} />
                                        Create Price
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Price Created!</h3>
                        <p className="text-gray-600 mb-6">Service price has been successfully created.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Create Another
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/services/${serviceId}/prices`)}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                            >
                                View Price Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateServicePrice;