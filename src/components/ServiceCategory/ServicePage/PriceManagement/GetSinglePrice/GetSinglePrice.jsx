import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleServicePriceQuery, useGetServiceByIdQuery } from "../../../../app/service/slice";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

const GetSinglePrice = () => {
    const { priceId } = useParams();
    const navigate = useNavigate();

    const { data: priceData, isLoading, error } = useGetSingleServicePriceQuery(priceId);
    const price = priceData?.data;

    const { data: serviceData } = useGetServiceByIdQuery(price?.service_id);
    const service = serviceData?.service || serviceData?.data || serviceData;

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Loading price details...</p>
            </div>
        );
    }

    if (error || !price) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Price not found</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Service Price Details</h1>
                    <p className="text-gray-600 mt-1">{service?.name}</p>
                </div>
            </div>

            {/* Price Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Service Configuration</h2>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Business Unit */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Business Unit
                            </label>
                            <p className="text-gray-900">{price.business?.name || "N/A"}</p>
                        </div>

                        {/* Service Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Service Name
                            </label>
                            <p className="text-gray-900">{service?.name || "N/A"}</p>
                        </div>

                        {/* SAC Code */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SAC Code
                            </label>
                            <p className="text-gray-900 font-mono">{price.sac_code || "N/A"}</p>
                        </div>

                        {/* Base Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Base Price
                            </label>
                            <p className="text-2xl font-bold text-gray-900">₹{price.price}</p>
                        </div>

                        {/* GST Applicable */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                GST Applicable
                            </label>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                price.is_gst_applicable 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                            }`}>
                                {price.is_gst_applicable ? "Active" : "Inactive"}
                            </span>
                        </div>

                        {/* CGST Rate */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                CGST Rate
                            </label>
                            <p className="text-gray-900">{price.cgst_percent || 0}%</p>
                        </div>

                        {/* SGST Rate */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                SGST Rate
                            </label>
                            <p className="text-gray-900">{price.sgst_percent || 0}%</p>
                        </div>

                        {/* IGST Rate */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                IGST Rate
                            </label>
                            <p className="text-gray-900">{price.igst_percent || 0}%</p>
                        </div>
                    </div>

                    {/* Final Price */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-700">Final Service Price</span>
                            <span className="text-3xl font-bold text-blue-600">₹{price.total_price}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 px-8 py-4 flex gap-4">
                    <button
                        onClick={() => navigate(`/dashboard/services/${price.service_id}/prices/update/${price.id}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                    >
                        <Edit size={18} />
                        Edit Details
                    </button>
                    <button
                        onClick={() => navigate(`/dashboard/services/${price.service_id}/prices/delete/${price.id}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                    >
                        <Trash2 size={18} />
                        Delete Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GetSinglePrice;