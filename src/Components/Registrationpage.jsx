import React, { useState } from "react";

const RegistrationPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [duration, setDuration] = useState("");
    const [teachingMode, setTeachingMode] = useState("");
    const [coupon, setCoupon] = useState("");
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({});

    const coursePrices = {
        "Web development": 50000,
        "App development": 60000,
        "Crypto Classes": 70000,
        "UI/UX": 40000,
    };

    const durationMultiplier = {
        "3 months": 1,
        "6 months": 1.8,
        "12 months": 3,
    };

    const modeMultiplier = {
        "Online": 1,
        "Physical": 1.2,
    }

    const calculatePrice = (selectedCourse, selectedDuration,selectedMode, appliedCoupon = "") => {
        if (selectedCourse && selectedDuration) {
            let totalPrice = coursePrices[selectedCourse] * durationMultiplier[selectedDuration];
            totalPrice = totalPrice * modeMultiplier[selectedMode];

            if (appliedCoupon === "12345") {
                totalPrice *= 0.9; // Apply 10% discount
            }

            setPrice(totalPrice);
        } else {
            setPrice(0);
        }
    };

    const handleCourseChange = (event) => {
        const selectedCourse = event.target.value;
        setCourse(selectedCourse);
        calculatePrice(selectedCourse, duration, coupon);
    };

    const handleDurationChange = (event) => {
        const selectedDuration = event.target.value;
        setDuration(selectedDuration);
        calculatePrice(course, selectedDuration, coupon);
    };

    const handleModeChange = (event) => {
        const selectedMode = event.target.value;
        setTeachingMode(selectedMode);
        calculatePrice(course, duration, selectedMode);
    };

    const validateForm = () => {
        let newErrors = {};

        if (!firstName.trim()) newErrors.firstName = "First Name is required";
        if (!lastName.trim()) newErrors.lastName = "Last Name is required";
        if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
            newErrors.email = "Invalid email format";
        if (!course) newErrors.course = "Select a course";
        if (!duration) newErrors.duration = "Select a duration";
        if (!teachingMode) newErrors.teachingMode = "Select a teaching mode";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            console.log("Form Submitted:", { firstName, lastName, phoneNumber, email, course, duration, teachingMode, coupon, price });
        }
    };

    return (
        <div className="flex items-center justify-center bg-white py-9">
            <div className="bg-[#f3f9ff] p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Course Registration</h2>

                <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block font-medium">First Name</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Last Name</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Phone Number</label>
                        <input
                            type="text"
                            placeholder="+234 00 0000 0000"
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="example@example.com"
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Course</label>
                        <select
                            onChange={handleCourseChange}
                            value={course}
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"
                        >
                            <option value="">Please select</option>
                            {Object.keys(coursePrices).map((courseOpt) => (
                                <option key={courseOpt} value={courseOpt}>
                                    {courseOpt}
                                </option>
                            ))}
                        </select>
                        {errors.course && <p className="text-red-500">{errors.course}</p>}
                    </div>
                    <div>
                        <label className="block font-medium">Duration</label>
                        <select
                            onChange={handleDurationChange}
                            value={duration}
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"
                        >
                            <option value="">Please select</option>
                            {Object.keys(durationMultiplier).map((durationOption) => (
                                <option key={durationOption} value={durationOption}>
                                    {durationOption}
                                </option>
                            ))}
                        </select>
                        {errors.duration && <p className="text-red-500">{errors.duration}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium">Mode of Teaching</label>
                        <select
                            value={teachingMode}
                            onChange={handleModeChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"

                        >
                            <option value="">Select Mode of Teaching</option>
                            <option value="Online">Online</option>
                            <option value="Physical">Physical</option>
                        </select>
                        {errors.teachingMode && <p className="text-red-500">{errors.teachingMode}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium">Coupon Code</label>
                        <input
                            type="text"
                            placeholder="XX XX XX"
                            className="mt-1 w-full px-4 py-2 border rounded-md border-[#2e97e9]"
                            value={coupon}
                            onChange={(e) => {
                                setCoupon(e.target.value);
                                calculatePrice(course, duration,teachingMode, e.target.value);
                            }}
                        />
                    </div>

                    <div className="col-span-2 text-lg font-semibold text-blue-600">
                        {price ? `Total: N${price.toFixed(2)}` : "Total: NXXX"}
                    </div>

                    <button type="submit" className="col-span-2 mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;