import React from "react";

const Astudent = () => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-white py-12">
            <div className="container mx-auto px-5">
                <div className="flex flex-col lg:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden">
                    {/* Image Section */}
                    <div className="lg:w-1/2 w-full">
                        <img
                            className="w-full h-full object-cover"
                            src="src/image/aiony-haust-3TLl_97HNJo-unsplash.jpg"
                            alt="Student Learning"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 w-full flex flex-col justify-center p-8 lg:p-14">
                        <h1 className="text-blue-700 font-extrabold text-3xl lg:text-6xl lleading-tight">
                            Learn With <br /> Confidence
                        </h1>
                        <p className="mt-6 text-gray-700 text-lg lg:text-xl leading-relaxed">
                            Our students’ reputation matters a lot, which is why all of our
                            online courses/training has been reviewed and certified in
                            partnership with qualified industry experts. Our courses and
                            training are complete, each training course is packed with
                            well-detailed tutorials to enable a newbie to understand what it
                            entails, and access to the tutor directly to further ask questions
                            where necessary.
                        </p>
                        <p className="mt-4 text-gray-700 text-lg lg:text-xl">
                            We carefully selected top experts to get their course listed and
                            made sure these courses were worth the prices.
                        </p>

                        {/* Call to Action */}
                        <button className="mt-8 bg-blue-600 hover:bg-blue-800 text-white font-semibold text-lg px-6 py-3 rounded-xl shadow-md transition duration-300">
                            Explore Courses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Astudent;
