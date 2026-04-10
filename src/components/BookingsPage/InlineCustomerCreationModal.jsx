
import React, { useState } from 'react';
import { X, Check, Loader2, AlertCircle, User, Mail, Phone, Lock } from 'lucide-react';
import { useCreateCustomerMutation } from '../../app/service/slice';

/**
 * InlineCustomerCreationModal
 * 
 * This modal allows users to create a new customer directly from the booking creation flow
 * when the searched customer is not found.
 * 
 * Usage in CreateBookingModal:
 * 1. Import this component
 * 2. Add state: const [showCreateCustomer, setShowCreateCustomer] = useState(false);
 * 3. Render at the end of CreateBookingModal, before closing div
 * 4. Add "Create New Customer" button in the customer dropdown when no results found
 */

const BLANK_CUSTOMER = {
    first_name: '', last_name: '', middle_name: '',
    email_id: '', mobile_country_code: '+91', mobile_number: '',
    alternate_mobile_number_country_code: '+91', alternate_mobile_number: '',
    username: '', password: '',
};

const InlineCustomerCreationModal = ({ onClose, onCustomerCreated, initialSearch = '' }) => {
    const [form, setForm] = useState(() => {
        // Pre-fill form with search query if it looks like a phone number
        const isPhone = /^\d{10}$/.test(initialSearch);
        return {
            ...BLANK_CUSTOMER,
            ...(isPhone ? { mobile_number: initialSearch } : {}),
        };
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await createCustomer(form).unwrap();
            setSuccess(true);
            
            // Wait a moment to show success, then callback with new customer
            setTimeout(() => {
                onCustomerCreated(result);
                onClose();
            }, 800);
        } catch (err) {
            setError(err?.data?.message || 'Failed to create customer. Please try again.');
        }
    };

    // Reusable input component
    const InputField = ({ label, name, type = 'text', required, placeholder, icon: Icon }) => (
        <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Icon size={16} className="text-gray-400" />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={form[name] || ''}
                    onChange={handleChange}
                    required={required}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white hover:border-gray-300 ${Icon ? 'pl-11' : ''}`}
                />
            </div>
        </div>
    );

    const PhoneField = ({ label, codeName, numName, required }) => (
        <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">
                {label}{required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
                <input
                    name={codeName}
                    value={form[codeName] || ''}
                    onChange={handleChange}
                    placeholder="+91"
                    className="w-20 text-center px-3 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
                />
                <input
                    name={numName}
                    value={form[numName] || ''}
                    onChange={handleChange}
                    required={required}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
                />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] px-4 py-6 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-auto">
                
                {/* Header */}
                <div className="flex justify-between items-start px-6 pt-6 pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            Create New Customer
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 ml-10">Add customer details to continue with booking</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                {!success ? (
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                        
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-sm text-red-600">
                                <AlertCircle size={14} className="flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Personal Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <User size={14} className="text-blue-500" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Information</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="First Name" name="first_name" required placeholder="John" icon={User} />
                                <InputField label="Last Name" name="last_name" required placeholder="Doe" icon={User} />
                            </div>
                            <InputField label="Middle Name" name="middle_name" placeholder="(optional)" icon={User} />
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Mail size={14} className="text-emerald-500" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Details</p>
                            </div>
                            <InputField label="Email Address" name="email_id" type="email" required placeholder="john@example.com" icon={Mail} />
                            <PhoneField label="Mobile Number" codeName="mobile_country_code" numName="mobile_number" required />
                            <PhoneField label="Alternate Mobile" codeName="alternate_mobile_number_country_code" numName="alternate_mobile_number" />
                        </div>

                        {/* Login Credentials */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Lock size={14} className="text-purple-500" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Login Credentials</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="Username" name="username" required placeholder="johndoe" icon={User} />
                                <InputField label="Password" name="password" type="password" required placeholder="Min 6 chars" icon={Lock} />
                            </div>
                        </div>

                        {/* Info Banner */}
                        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                            <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700">Once created, you can immediately select this customer for your booking.</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg">
                                {isCreating 
                                    ? <><Loader2 size={14} className="animate-spin" /> Creating Customer...</>
                                    : <><Check size={14} /> Create & Continue</>
                                }
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-12 px-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={28} className="text-green-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">Customer Created!</h3>
                        <p className="text-sm text-gray-500">Returning to booking form...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InlineCustomerCreationModal;