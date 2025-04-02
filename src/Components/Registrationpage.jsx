import React, { useState } from "react";
import { FaCheck, FaStop } from "react-icons/fa";

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
    const [validated, setValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // In Registrationpage.jsx
    const coursePrices = {
        "Web Development": 50000,
        "App Development": 60000,
        "Crypto Classes": 70000,
        "UI/UX": 40000
    };

    const durationMultiplier = {
        "3 months": 1,
        "6 months": 1.8,
        "12 months": 3,
    };

    const modeMultiplier = {
        "Online": 1,
        "Physical": 1.2
    };

    const calculatePrice = (selectedCourse, selectedDuration, selectedMode, appliedCoupon = "") => {
        if (selectedCourse && selectedDuration && selectedMode) {
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
        calculatePrice(selectedCourse, duration, teachingMode, coupon);
    };

    const handleDurationChange = (event) => {
        const selectedDuration = event.target.value;
        setDuration(selectedDuration);
        calculatePrice(course, selectedDuration, teachingMode, coupon);
    };

    const handleModeChange = (event) => {
        const selectedMode = event.target.value;
        setTeachingMode(selectedMode);
        calculatePrice(course, duration, selectedMode, coupon);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);


        if (!course || !duration || !teachingMode || price <= 0) {
            setErrors({
                submit: "Please complete all course selection fields"
            });
            return;
        }

        // Client-side validation
        const formErrors = {};
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phoneNumber.trim();

        if (!trimmedFirstName) formErrors.firstName = "First name is required";
        if (!trimmedLastName) formErrors.lastName = "Last name is required";
        if (!trimmedEmail) {
            formErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            formErrors.email = "Please enter a valid email address";
        }
        if (!trimmedPhone) formErrors.phoneNumber = "Phone number is required";
        if (!course) formErrors.course = "Please select a course";
        if (!duration) formErrors.duration = "Please select duration";
        if (!teachingMode) formErrors.teachingMode = "Please select teaching mode";

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            setErrors({});

            const response = await fetch("http://localhost:2000/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: trimmedFirstName,
                    lastName: trimmedLastName,
                    email: trimmedEmail,
                    phoneNumber: trimmedPhone,
                    course,
                    duration,
                    teachingMode,
                    price
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    setErrors({ submit: data.message });
                } else {
                    setErrors({ submit: "Registration failed" });
                }
                return;
            }

            setValidated(true);

        } catch (error) {
            console.error("Registration error:", error);
            setErrors({
                submit: error.message || "Registration failed. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-white py-9">
            <div className="bg-[#f3f9ff] p-8 rounded-lg shadow-md w-full max-w-lg relative">
                <h2 className="text-2xl font-bold text-center mb-6">Course Registration</h2>

                <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    {validated && (
                        <div className="bg-white inset-1 p-10 rounded-lg shadow-lg items-center justify-center flex flex-col absolute top-1/2 lg:w-125 text-center z-30 border border-gray-200">
                            <FaCheck className="bg-green-600 text-white rounded-full p-4" size="30" />
                            <FaStop
                                className="absolute top-0 right-0 cursor-pointer"
                                size="20"
                                onClick={() => setValidated(false)}
                            />
                            <h1 className="text-4xl font-bold text-green-600 tracking-wide leading-normal">
                                Successfully Registered
                            </h1>
                            <p className="text-xl font-semibold text-black">
                                Thank You for registering for our course.
                            </p>
                        </div>
                    )}

                    <div className="col-span-2 md:col-span-1">
                        <label className="block font-medium">First Name</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.firstName ? "border-red-500" : "border-[#2e97e9]"}`}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block font-medium">Last Name</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.lastName ? "border-red-500" : "border-[#2e97e9]"}`}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block font-medium">Phone Number</label>
                        <input
                            type="text"
                            placeholder="+234 00 0000 0000"
                            className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.phoneNumber ? "border-red-500" : "border-[#2e97e9]"}`}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="example@example.com"
                            className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-[#2e97e9]"}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium">Course</label>
                        <select
                            onChange={handleCourseChange}
                            value={course}
                            className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.course ? "border-red-500" : "border-[#2e97e9]"}`}
                        >
                            <option value="">Please select</option>
                            {Object.keys(coursePrices).map((courseOpt) => (
                                <option key={courseOpt} value={courseOpt}>
                                    {courseOpt}
                                </option>
                            ))}
                        </select>
                        {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block font-medium">Duration</label>
                        <select
                            onChange={handleDurationChange}
                            value={duration}
                            className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.duration ? "border-red-500" : "border-[#2e97e9]"}`}
                        >
                            <option value="">Please select</option>
                            {Object.keys(durationMultiplier).map((durationOption) => (
                                <option key={durationOption} value={durationOption}>
                                    {durationOption}
                                </option>
                            ))}
                        </select>
                        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <label className="block font-medium">Mode of Teaching</label>
                        <select
                            value={teachingMode}
                            onChange={handleModeChange}
                            className={`mt-1 w-full px-4 py-2 border rounded-md ${errors.teachingMode ? "border-red-500" : "border-[#2e97e9]"}`}
                        >
                            <option value="">Select Mode</option>
                            <option value="Online">Online</option>
                            <option value="Physical">Physical</option>
                        </select>
                        {errors.teachingMode && <p className="text-red-500 text-sm mt-1">{errors.teachingMode}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium">Coupon Code</label>
                        <input
                            type="text"
                            placeholder="XX XX XX"
                            className="mt-1 w-full px-4 py-2 border border-[#2e97e9] rounded-md"
                            value={coupon}
                            onChange={(e) => {
                                setCoupon(e.target.value);
                                calculatePrice(course, duration, teachingMode, e.target.value);
                            }}
                        />
                    </div>

                    <div className="col-span-2 text-lg font-semibold text-blue-600">
                        {price ? `Total: N${price.toFixed(2)}` : "Total: NXXX"}
                    </div>

                    {errors.submit && (
                        <div className="col-span-2 text-red-500 text-center">
                            {errors.submit}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="col-span-2 mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Processing..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;