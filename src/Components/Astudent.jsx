import React from 'react';

const Astudent = () => {
    return (
        <div className=" bg-white py-15">
            <div className="container mx-auto">
                <div className="flex bg-white shadow-2xl ">
                    <div>
                        <img  src="src/image/aiony-haust-3TLl_97HNJo-unsplash.jpg" alt=""/>
                    </div>
                    <div className="mt-35">
                        <h1 className="text-blue-700 font-bold text-6xl px-10">Learn With <br/> Confidence</h1>
                        <p className="mt-5 text-2xl px-10">Our students’ reputation matters a lot, which is why all of our online courses/training has been reviewed and certified in partnership with qualified industry experts. Our courses and training are complete, each training course is packed with well-detailed tutorials to enable a newbie to understand what it entails, and access to the tutor directly to further ask questions where necessary.
                            We carefully selected top experts to get their course listed, and made sure these courses were worth the prices.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Astudent;