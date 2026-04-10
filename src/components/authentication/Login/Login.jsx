// import React, { useState } from "react";
// import { useLoginUserMutation } from "../../../app/service/slice";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff, Lock, Mail, Calendar } from "lucide-react";

// const Login = () => {
//     const [email_id, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const [loginUser, { isLoading }] = useLoginUserMutation();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const res = await loginUser({ email_id, password }).unwrap();

//             const role = res.staff?.role;
//             const businessId = res.staff?.business_id;

//             // Store authentication data
//             localStorage.setItem("token", res.token);
//             localStorage.setItem("role", role);
//             localStorage.setItem("business_id", businessId);

//             // Navigate to dashboard
//             navigate("/dashboard");

//         } catch (err) {
//             console.error("Login error:", err);
//             alert(err?.data?.message || "Login failed. Please check your credentials.");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
//             <div className="w-full max-w-md">

//                 {/* Login Form */}
//                 <div className="bg-white rounded-2xl shadow-2xl p-8">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
//                         Welcome Back
//                     </h2>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Email Input */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Email Address
//                             </label>
//                             <div className="relative">
//                                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                                 <input
//                                     type="email"
//                                     placeholder="admin@example.com"
//                                     value={email_id}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                     className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 />
//                             </div>
//                         </div>

//                         {/* Password Input */}
//                         <div>
//                             <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     placeholder="Enter your password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                     className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                 >
//                                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Remember Me & Forgot Password */}
//                         <div className="flex items-center justify-between">
//                             <label className="flex items-center">
//                                 <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
//                                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
//                             </label>
//                             <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                                 Forgot password?
//                             </button>
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             disabled={isLoading}
//                             className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isLoading ? "Logging in..." : "Login"}
//                         </button>
//                     </form>

//                     {/* Footer */}
//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-gray-600">
//                             Don't have an account?{" "}
//                             <button className="text-blue-600 hover:text-blue-700 font-medium">
//                                 Contact Admin
//                             </button>
//                         </p>
//                     </div>
//                 </div>

//                 {/* Copyright */}
//                 <div className="text-center mt-8">
//                     <p className="text-sm text-blue-100">
//                         © 2026 BookingPro. All rights reserved.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;





import React, { useState } from "react";
import { useLoginUserMutation } from "../../../app/service/slice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const Login = () => {
    const [email_id, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loginUser, { isLoading }] = useLoginUserMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser({ email_id, password }).unwrap();

            // staff object is at res.staff
            const staff = res.staff || {};

            // ── Store auth tokens ──────────────────────────────────────────
            localStorage.setItem("token",       res.token || "");
            localStorage.setItem("role",        staff.role || "");
            localStorage.setItem("business_id", String(staff.business_id || ""));

            // ── Build admin profile from full staff object ─────────────────
            const adminProfile = {
                firstName: staff.first_name    || "",
                lastName:  staff.last_name     || "",
                username:  staff.username      || (staff.email_id || email_id).split("@")[0],
                email:     staff.email_id      || email_id || "",
                phone:     staff.mobile_number || staff.phone || staff.mobile || "",
                role:      staff.role          || "",
                avatar:    staff.avatar        || staff.profile_picture || staff.image || null,
                _raw:      staff,
            };

            localStorage.setItem("admin_profile", JSON.stringify(adminProfile));

            navigate("/dashboard");

        } catch (err) {
            console.error("Login error:", err);
            alert(err?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Welcome Back
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email_id}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                                Contact Admin
                            </button>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-8">
                    <p className="text-sm text-blue-100">© 2026 BookingPro. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;