import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Forgotpassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleResetRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:2000/forgot-password", { email });
            alert(response.data.message)
            if (response.data.success) {
                setMessage("A password reset link has been sent to your email.");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setMessage("Error: " + response.data.message);
            }
        } catch (error) {
            setMessage("Failed to send reset link. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <a href="/login" className="self-start mb-4 text-black font-semibold">Return to Login</a>
            <div className="w-[100rem] max-w-lg p-6 bg-white border-2 border-blue-500 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-700">Forgot Password</h2>
                <p className="text-sm text-gray-500">Enter your email to receive a reset link</p>

                {message && <p className="text-green-500">{message}</p>}

                <form className="mt-4 p-10" onSubmit={handleResetRequest}>
                    <div className="mb-4">
                        <label className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Forgotpassword;
