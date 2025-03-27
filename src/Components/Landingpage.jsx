import React from "react";

const Landingpage = () => {
    return (
        <div className="relative min-h-screen bg-[url('/src/image/dfetcrewimage.png')] bg-cover bg-center bg-no-repeat">
            {/* Navigation */}
            <nav className="bg-[#1321da] mx-5 md:mx-10 rounded-xl py-5 px-4 md:px-8 shadow-lg">
                <ul className="flex flex-wrap space-y-4 lg:space-y-0  items-center justify-between text-lg md:text-2xl">
                    <li>
                        <a
                            href="#"
                            className="text-[#1321da] font-bold bg-white hover:bg-gray-200 rounded-2xl py-3 px-6 transition duration-300"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="text-white hover:bg-gray-600 rounded-2xl py-3 px-6 transition duration-300"
                        >
                            Services
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="text-white hover:bg-gray-600 rounded-2xl py-3 px-6 transition duration-300"
                        >
                            Courses
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="text-white hover:bg-gray-600 rounded-2xl py-3 px-6 transition duration-300"
                        >
                            Contact
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center text-center md:text-left md:items-start mt-32 md:mt-40 px-6 md:px-16 max-w-4xl">
                <h1 className="text-[#0684e5] text-4xl md:text-6xl font-bold leading-tight">
                    Master In-Demand Skills with DFET's Expert-Led Courses!
                </h1>
                <p className="py-5 text-lg md:text-2xl text-gray-800">
                    Learn Mobile and Web Development, UI/UX, Branding, Graphics, and more.
                    Gain hands-on experience and kickstart your career today!
                </p>

                {/* Buttons */}
                <div className="text-lg md:text-2xl space-x-4 flex ">
                    <button className="bg-[#1321da] text-white py-3 px-6 rounded-xl border-2 border-[#1321da] hover:bg-blue-800 transition duration-300">
                        Read More
                    </button>
                    <button className="bg-white text-[#1321da] py-3 px-6 border-2 border-[#1321da] rounded-xl hover:bg-blue-100 transition duration-300">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landingpage;
