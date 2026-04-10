import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useDeleteServiceCategoryMutation,
    useGetServiceCategoryByIdQuery
} from "../../../app/service/slice";
import { ArrowLeft, Trash2, Check } from "lucide-react";

const GlobalStyles = () => (
    <style>{`
        button, a, [role="button"] { cursor: pointer !important; }
    `}</style>
);

const DeleteServiceCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const { data, isLoading: isFetching, isError } = useGetServiceCategoryByIdQuery(id);
    const category = data?.data || data || null;
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteServiceCategoryMutation();

    const handleDelete = async () => {
        try {
            await deleteCategory(id).unwrap();
            setDeleteSuccess(true);
            setTimeout(() => navigate("/admin/service-category"), 2000);
        } catch (error) {
            alert(error?.data?.message || "Failed to delete category");
        }
    };

    if (isFetching) return (
        <>
            <GlobalStyles />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading category details...</p>
            </div>
        </>
    );

    if (isError || !category) return (
        <>
            <GlobalStyles />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load category details</p>
                    <button onClick={() => navigate("/admin/service-category")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Back to Categories
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen bg-gray-50 p-8">
                {/* ✅ Back button */}
                <button onClick={() => navigate("/admin/service-category")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft size={20} /> Back to Categories
                </button>

                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                        {!deleteSuccess ? (
                            <>
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 size={32} className="text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Delete Service Category</h2>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <p className="text-gray-700 text-center">
                                        Are you sure you want to delete
                                        <span className="font-bold text-red-600"> {category.name}</span>?
                                    </p>
                                    <p className="text-sm text-gray-600 text-center mt-2">This action cannot be undone.</p>
                                </div>
                                <div className="flex gap-4">
                                    {/* ✅ Cancel button */}
                                    <button onClick={() => navigate("/admin/service-category")}
                                        className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                                        Cancel
                                    </button>
                                    {/* ✅ Delete confirm button */}
                                    <button onClick={handleDelete} disabled={isDeleting}
                                        className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Deleted Successfully!</h3>
                                <p className="text-gray-600">Redirecting to categories...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteServiceCategory;