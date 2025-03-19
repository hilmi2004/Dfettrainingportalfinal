import React from 'react';

const Landingpage = () => {
    return (
        <div className=" mt-3 min-h-screen bg-[url('/src/image/dfetcrewimage.png')] bg-cover bg-center bg-no-repeat">
            <nav className="bg-[#1321da] mx-10 rounded-4xl py-6 px-2 ">
                <ul className="flex items-center justify-between text-2xl">
                    <li><a href="#" className="text-[#1321da] font-bold bg-white hover: rounded-3xl py-4 px-8 ">Home</a>
                    </li>
                    {/*<li><a href="#" className="text-white hover:bg-gray-600 rounded-4xl py-3 px-6">About</a></li>*/}
                    <li><a href="#" className="text-white hover:bg-gray-600 rounded-4xl py-3 px-6">Services</a></li>
                    <li><a href="#" className="text-white hover:bg-gray-600 rounded-4xl py-3 px-6">Courses</a></li>
                    <li><a href="#" className="text-white hover:bg-gray-600 rounded-4xl py-3 px-6">Contact</a></li>

                </ul>
            </nav>

            <div className="mx-30 mt-40 h-full " id="bg">
                <h1 className="text-[#0684e5] text-6xl font-bold">Master In-Demand Skills with DFET's Expert-Led
                    Courses!</h1>
                <p className="py-5 text-2xl">Learn Mobile and Web development, UI/UX, Branding, Graphics, and more.
                    Gain hands-on experience and kickstart your career today!</p>
                <div className="text-2xl space-x-4  ">
                    <button className="bg-[#1321da] text-white p-3 border-3 border-[#1321da] rounded-xl">Read More
                    </button>
                    <a>
                    <button className="bg-white text-[#1321da] p-3 border-3 border-[#1321da] rounded-xl">Enroll Now
                    </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Landingpage;