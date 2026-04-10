import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useUpdateServiceCategoryMutation,
    useGetServiceCategoryByIdQuery
} from "../../../app/service/slice";
import { ArrowLeft, Save, Check } from "lucide-react";

const GlobalStyles = () => (
    <style>{`
        button, a, [role="button"] { cursor: pointer !important; }
    `}</style>
);

const UpdateServiceCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const { data, isLoading: isFetching } = useGetServiceCategoryByIdQuery(id);
    const category = data?.data || data || null;
    const [updateCategory, { isLoading }] = useUpdateServiceCategoryMutation();

    useEffect(() => {
        if (category) setName(category.name);
    }, [category]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!name.trim()) { alert("Category name is required"); return; }
        try {
            await updateCategory({ id, data: { name } }).unwrap();
            setUpdateSuccess(true);
            setTimeout(() => navigate("/admin/service-category"), 2000);
        } catch (error) {
            alert(error?.data?.message || "Failed to update category");
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
                        {!updateSuccess ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Service Category</h2>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
                                        <input type="text" placeholder="Enter category name"
                                            value={name} onChange={e => setName(e.target.value)} required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        {/* ✅ Cancel button */}
                                        <button type="button" onClick={() => navigate("/admin/service-category")}
                                            className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                                            Cancel
                                        </button>
                                        {/* ✅ Save button */}
                                        <button type="submit" disabled={isLoading}
                                            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                            {isLoading ? "Updating..." : <><Save size={18} /> Update</>}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Updated Successfully!</h3>
                                <p className="text-gray-600">Redirecting to categories...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateServiceCategory;