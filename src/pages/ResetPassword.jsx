import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const validatePassword = (password) => {
        return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[\W]/.test(password);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Invalid or missing token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!validatePassword(password)) {
            setError(
                "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `http://localhost:2000/api/auth/reset-password/${token}`,
                { password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.success) {
                setSuccess("Password reset successful! Redirecting...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setError(response.data.message || "Something went wrong.");
            }
        } catch (error) {
            setError(
                error.response?.data?.message || "Invalid or expired token. Please request a new one."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-700">Reset Password</h2>

                {error && <p className="mt-2 text-red-500">{error}</p>}
                {success && <p className="mt-2 text-green-500">{success}</p>}

                <form className="mt-4" onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <label className="block text-gray-600">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-sm focus:ring focus:ring-blue-300"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-sm focus:ring focus:ring-blue-300"
                            placeholder="Confirm new password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 font-semibold text-white rounded-sm ${
                            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    <p className="mt-4 text-center">
                        <a href="/login" className="text-blue-500 hover:underline">
                            Go to Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
