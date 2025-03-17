import React from 'react';

const Registrationpage = () => {
    return (
        <div className="flex items-center justify-center bg-white py-9">
            <div className="bg-[#f3f9ff] p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center mb-6"></h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Name</label>
                        <input type="text" placeholder="First Name" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-2 border-[#2e97e9]"  />
                    </div>
                    <div>
                        <label className="block font-medium">&nbsp;</label>
                        <input type="text" placeholder="Last Name" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500  border-[#2e97e9]" />
                    </div>
                    <div>
                        <label className="block font-medium">Phone Number</label>
                        <input type="text" placeholder="+234 00 0000 0000" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500  border-[#2e97e9]" />
                    </div>
                    <div>
                        <label className="block font-medium">Email</label>
                        <input type="email" placeholder="example@example.com" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500  border-[#2e97e9]" />
                    </div>
                    <div>
                        <label className="block font-medium">Courses</label>
                        <select className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500  border-[#2e97e9]">
                            <option>Please select</option>
                            <option>Web development</option>
                            <option>App development</option>
                            <option>Crypto Classes</option>
                            <option>UI/UX</option>




                        </select>
                    </div>
                    <div>
                        <label className="block font-medium">Duration</label>
                        <select className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500  border-[#2e97e9]">
                            <option>3 months</option>
                            <option>6 months</option>
                            <option>12 months</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block font-medium">Coupon Code</label>
                        <input type="text" placeholder="XX XX XX" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500  border-[#2e97e9]" />
                    </div>
                </div>

                <p className="mt-4 text-lg font-semibold text-blue-600">Total: NXXX</p>

                <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Submit</button>
            </div>
        </div>
    );
};

export default Registrationpage;