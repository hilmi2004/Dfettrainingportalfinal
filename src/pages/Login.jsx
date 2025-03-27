import React from 'react';

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <a href="#" className="self-start mb-4 text-black font-semibold">Return to main page</a>
            <div className="w-[100rem] max-w-lg  p-6 bg-white border-2 border-blue-500 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-700">User login</h2>
                <p className="text-sm text-gray-500">*Fill in the following info</p>
                <form className="mt-4 p-10">

                    <div className="mb-4">
                        <label className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
