import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetPricesByBusinessQuery } from "../../../../app/service/slice";
import { ArrowLeft, Plus, Edit, Trash2, Package } from "lucide-react";

const GetPriceByBusiness = () => {
    const navigate = useNavigate();
    const businessId = localStorage.getItem("business_id");

    const { data, isLoading, error } = useGetPricesByBusinessQuery(businessId);
    const prices = data?.data || [];

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Loading prices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading prices</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Service Prices</h1>
                        <p className="text-gray-600 mt-1">All pricing configurations for your business</p>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Price Configurations</p>
                        <p className="text-3xl font-bold text-gray-900">{prices.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package size={24} className="text-green-600" />
                    </div>
                </div>
            </div>

            {/* Prices List */}
            {prices.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No service prices configured yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        SAC Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Base Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Total Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {prices.map((price) => (
                                    <tr key={price.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">
                                                {price.service?.name || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                {price.sac_code || "N/A"}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">₹{price.price}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-green-600">
                                                ₹{price.total_price}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => navigate(`/dashboard/services/${price.service_id}/prices`)}
                                                    className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/dashboard/services/${price.service_id}/prices/update/${price.id}`)}
                                                    className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                                >
                                                    <Edit size={14} className="inline" /> Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetPriceByBusiness;