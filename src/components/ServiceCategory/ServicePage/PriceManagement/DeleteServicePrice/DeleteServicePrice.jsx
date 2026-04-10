import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    useDeleteServicePriceMutation,
    useGetSingleServicePriceQuery 
} from "../../../../../app/service/slice";
import { ArrowLeft, AlertTriangle, Check } from "lucide-react";

const DeleteServicePrice = () => {
    const { id: serviceId, priceId } = useParams();
    const navigate = useNavigate();

    const { data: priceData, isLoading: loadingPrice } = useGetSingleServicePriceQuery(priceId);
    const price = priceData?.data;

    const [deletePrice, { isLoading }] = useDeleteServicePriceMutation();
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleDelete = async () => {
        try {
            await deletePrice(priceId).unwrap();
            setDeleteSuccess(true);
            setTimeout(() => {
                navigate(`/dashboard/services/${serviceId}/prices`);
            }, 2000);
        } catch (err) {
            console.error("Delete error:", err);
            alert(err?.data?.message || "Failed to delete price");
        }
    };

    if (loadingPrice) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold text-gray-900">Delete Service Price</h1>
                </div>
            </div>

            {/* Delete Confirmation or Success */}
            {!deleteSuccess ? (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Permanently Delete?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Service price configuration for <strong>ID: {priceId}</strong> cannot be undone.
                            This will remove all pricing information including tax rates.
                        </p>

                        {price && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <h3 className="font-semibold text-gray-900 mb-2">Price Details:</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-600">Base Price:</span> <span className="font-semibold">₹{price.price}</span></p>
                                    <p><span className="text-gray-600">SAC Code:</span> <span className="font-semibold">{price.sac_code || "N/A"}</span></p>
                                    <p><span className="text-gray-600">Total Price:</span> <span className="font-semibold">₹{price.total_price}</span></p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate(`/dashboard/services/${serviceId}/prices`)}
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                            >
                                Keep Service Price
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Deleted Successfully!
                        </h3>
                        <p className="text-gray-600">
                            Price has been deleted. Redirecting...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteServicePrice;