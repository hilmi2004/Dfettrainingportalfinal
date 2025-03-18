import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "What is your refund policy?",
        answer:
            "We offer a full refund within 7 days of purchase. If you're not satisfied, reach out, and we’ll make it right.",
    },
    {
        question: "How long does shipping take?",
        answer:
            "Shipping times vary based on location, but typically it takes between 3 to 7 business days.",
    },
    {
        question: "Do you offer customer support?",
        answer:
            "Yes! Our support team is available 24/7 to help you with any questions or concerns.",
    },
    {
        question: "Can I change my order after placing it?",
        answer:
            "Yes, you can modify your order within 24 hours of placing it. Contact our support for assistance.",
    },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white text-gray-900 py-16 px-6 md:px-12 lg:px-32">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-10">
                Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-blue-300 rounded-xl overflow-hidden shadow-md"
                    >
                        <button
                            className="w-full flex justify-between items-center px-6 py-4 bg-blue-50 hover:bg-blue-100 transition duration-300"
                            onClick={() => toggleFAQ(index)}
                        >
                            <span className="text-lg font-medium">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="text-blue-600" />
                            ) : (
                                <ChevronDown className="text-blue-600" />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className="px-6 py-4 text-gray-700 bg-white border-t border-blue-200">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faq;
