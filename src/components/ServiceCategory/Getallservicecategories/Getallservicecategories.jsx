import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllServiceCategoriesQuery } from "../../../app/service/slice";
import { ArrowLeft, Plus, Edit, Trash2, FolderOpen } from "lucide-react";

const GetAllServiceCategories = () => {
    const navigate = useNavigate();
    const { data: response, isLoading, isError } = useGetAllServiceCategoriesQuery();
    const categories = response?.data || [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading categories...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-500">Failed to load categories</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Service Categories</h1>
                        <p className="text-gray-500 mt-1">Manage your service offerings and classifications.</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/service-category/create")}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl font-medium"
                    >
                        <Plus size={20} />
                        New Category
                    </button>
                </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6 max-w-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Categories</p>
                        <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FolderOpen size={24} className="text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No categories found.</p>
                    <button
                        onClick={() => navigate("/admin/service-category/create")}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                        Create First Category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                                    📁
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{cat.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">ID: {cat.id}</p>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/admin/service-category/update/${cat.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    <Edit size={16} />
                                    Update
                                </button>
                                <button
                                    onClick={() => navigate(`/admin/service-category/delete/${cat.id}`)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GetAllServiceCategories;