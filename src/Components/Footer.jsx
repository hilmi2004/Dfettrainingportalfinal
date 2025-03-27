import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#0684e5] text-white p-8 border-t border-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-10 md:space-y-0">
                {/* Logo and Address Section */}
                <div className="md:w-1/3 flex flex-col items-start">
                    <img src="src/image/dfetlogotrial.png" alt="DFET Logo" className="w-32" />
                    <p className="text-sm mt-2 font-semibold">DE-FUTURE ELITE TECHNOLOGY LTD.</p>
                    <p className="mt-2 text-sm leading-6">
                        Suite 301, Elyon Plaza, 1st Avenue, Gwarinpa,<br />
                        900108, Abuja, Nigeria
                    </p>
                    {/* Social Icons */}
                    <div className="flex space-x-4 mt-4">
                        <FaFacebookF size={30} className="cursor-pointer hover:text-blue-300 transition duration-300" />
                        <FaInstagram size={30} className="cursor-pointer hover:text-pink-400 transition duration-300" />
                        <FaTwitter size={30} className="cursor-pointer hover:text-blue-400 transition duration-300" />
                        <FaYoutube size={30} className="cursor-pointer hover:text-red-500 transition duration-300" />
                    </div>
                </div>

                {/* Navigation Links Section */}
                <div className="md:w-1/3 text-center">
                    <h3 className="text-lg font-semibold">Navigation</h3>
                    <ul className="mt-3 space-y-2 text-[18px]">
                        <li className="hover:underline cursor-pointer">Home</li>
                        <li className="hover:underline cursor-pointer">Services</li>
                        <li className="hover:underline cursor-pointer">Courses</li>
                        <li className="hover:underline cursor-pointer">Testimonials</li>
                        <li className="hover:underline cursor-pointer">Projects</li>
                    </ul>
                </div>

                {/* Subscription and Contact Section */}
                <div className="md:w-1/3">
                    <p className="text-sm">
                        Not quite ready yet? <br /> Join our online community for free. No spam.
                    </p>
                    {/* Email Subscription */}
                    <div className="flex mt-3">
                        <input
                            type="email"
                            placeholder="Your Email Here"
                            className="p-2 w-full rounded-l-md text-black bg-white outline-none"
                        />
                        <button className="bg-purple-700 px-4 py-2 rounded-r-md hover:bg-purple-800 transition duration-300">
                            Subscribe
                        </button>
                    </div>
                    {/* Contact Info */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <p className="text-sm mt-1">+234 9041 695865</p>
                        <p className="text-sm mt-1">omoghene.v.efekemo@gmail.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
