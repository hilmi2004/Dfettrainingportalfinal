import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:2000/api/auth/login',
                {
                    email: email.trim().toLowerCase(),
                    password
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Set default headers for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
            // Clear invalid token if exists
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <Link to="/" className="self-start mb-4 text-black font-semibold">
                Return to main page
            </Link>
            <div className="w-full max-w-lg p-6 bg-white border-2 border-blue-500 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-700">User Login</h2>
                <p className="text-sm text-gray-500">*Fill in the following info</p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form className="mt-4 p-10" onSubmit={handleLogin}>
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
                    <div className="mb-4">
                        <label className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 font-semibold text-white rounded-sm focus:outline-none focus:ring ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
                        }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-blue-500 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;