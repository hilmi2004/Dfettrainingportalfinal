import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#0684e5] text-white p-8 border-t border-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
                {/* Logo and Address */}
                <div className="md:w-1/3">
                    <div>
                    <img src="src/image/dfetlogotrial.png" alt=""  />
                    </div>
                    <p className="text-sm">DE-FUTURE ELITE TECHNOLOGY LTD.</p>
                    <p className="mt-2 text-sm">Suite 301, Elyon Plaza, 1st Avenue, Gwarinpa,<br />
                        900108, Abuja, Nigeria</p>
                    <div className="flex space-x-3 mt-4">
                        <FaFacebookF size={30} className="cursor-pointer" />
                        <FaInstagram size={30} className="cursor-pointer" />
                        <FaTwitter size={30} className="cursor-pointer" />
                        <FaYoutube size={30} className="cursor-pointer" />
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="md:w-1/3 mt-5">
                    <h3 className="text-lg font-semibold text-center">Navigation</h3>
                    <ul className="mt-2 space-y-2 text-[18px] text-sm text-center">
                        <li>Home</li>
                        <li>Service</li>
                        <li>Courses</li>
                        <li>Testimonials</li>
                        <li>Projects</li>
                    </ul>
                </div>

                {/* Subscription and Contact */}
                <div className="md:w-1/3 mt-5">
                    <p className="text-sm">Not quite ready yet?<br />Join our online community for free. No spam.</p>
                    <div className="flex mt-3">
                        <input type="email" placeholder="Your Email Here" className="p-2 w-full rounded-l-md text-black bg-white" />
                        <button className="bg-purple-700 px-4 py-2 rounded-r-md">Subscribe</button>
                    </div>
                    <div className="space-y-3">
                    <h3 className="text-lg font-semibold mt-4">Contact</h3>
                    <p className="text-sm">+2349041 695865</p>
                    <p className="text-sm">omoghene.v.efekemo@gmail.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
