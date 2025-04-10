import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Pagination, Autoplay } from "swiper/modules";

const testimonials = [
    {
        name: "Jackson Avery",
        text: "This platform transformed my business. The experience was seamless and rewarding!",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
        name: "Maggie Pierce",
        text: "Absolutely love the service! Professional and top-notch quality every time.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        name: "Derek Shepherd",
        text: "A game-changer for my work. The process was smooth, and the results were fantastic!",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        name: "Meredith Grey",
        text: "This is exactly what I needed. Highly recommend it to anyone looking for great service!",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
];

const Testimonial = () => {
    return (
        <div className="min-h-screen py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto text-center px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    See what our happy customers have to say about our amazing services.
                </p>

                {/* Swiper Component */}
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    modules={[Pagination, Autoplay]}
                    className="w-full max-w-3xl mx-auto"
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white text-gray-900 p-15 rounded-lg shadow-xl flex flex-col items-center transition-transform duration-300 hover:scale-105">
                                <FaQuoteLeft className="text-4xl text-blue-500 mb-4" />
                                <p className="text-lg md:text-xl italic text-center leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                                <div className="mt-6 flex flex-col items-center">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full border-4 border-blue-500 shadow-lg"
                                    />
                                    <h3 className="text-xl font-semibold mt-3">{testimonial.name}</h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Testimonial;
