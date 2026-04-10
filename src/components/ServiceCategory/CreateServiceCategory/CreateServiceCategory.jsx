import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useCreateServiceCategoryMutation } from "../../../app/service/slice";
import { X, FolderPlus, Check } from "lucide-react";

const GlobalStyles = () => (
    <style>{`
        button, a, [role="button"] { cursor: pointer !important; }
    `}</style>
);

const CreateServiceCategory = ({ onClose, onSuccess }) => {
    const [createCategory, { isLoading }] = useCreateServiceCategoryMutation();
    const [created, setCreated] = useState(false);
    const [formData, setFormData] = useState({ name: "" });

    let business_id = null;
    const token = localStorage.getItem("token");
    if (token) {
        try { const decoded = jwtDecode(token); business_id = decoded.business_id; }
        catch (e) { console.error("Token decode error:", e); }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!business_id) { alert("Business ID not found. Please login again."); return; }
        try {
            await createCategory({ name: formData.name, business_id }).unwrap();
            setCreated(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            alert(err?.data?.message || "Failed to create service category");
        }
    };

    const handleReset = () => { setFormData({ name: "" }); setCreated(false); };
    const handleClose = () => { if (onClose) onClose(); handleReset(); };

    return (
        <>
            <GlobalStyles />
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Create Service Category</h2>
                        {/* ✅ Close X button */}
                        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {!created ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange}
                                    required placeholder="e.g., Hair Styling, Spa Services"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                {/* ✅ Cancel button */}
                                <button type="button" onClick={handleClose}
                                    className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                                    Cancel
                                </button>
                                {/* ✅ Create button */}
                                <button type="submit" disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isLoading ? "Creating..." : <><FolderPlus size={18} /> Create</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Category Created!</h3>
                            <p className="text-gray-600 mb-6">
                                <span className="font-semibold">{formData.name}</span> has been successfully created.
                            </p>
                            <div className="flex gap-4">
                                {/* ✅ Create Another button */}
                                <button onClick={handleReset}
                                    className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                                    Create Another
                                </button>
                                {/* ✅ Close button */}
                                <button onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors">
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreateServiceCategory;