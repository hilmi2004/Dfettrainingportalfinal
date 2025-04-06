import React, { useState, useEffect } from "react";
import { BookOpen, Clock, BarChart } from "lucide-react";

const CourseCard = ({
                        title,
                        instructor,
                        lessons,
                        duration,
                        startDate,
                        expectedEndDate,
                        image,
                        progress
                    }) => {
    const [currentProgress, setCurrentProgress] = useState(progress);

    useEffect(() => {
        // Update progress every day to keep it current
        const updateProgress = () => {
            const now = new Date();
            if (now >= new Date(expectedEndDate)) {
                setCurrentProgress(100);
                return;
            }
            if (now <= new Date(startDate)) {
                setCurrentProgress(0);
                return;
            }

            const totalDuration = new Date(expectedEndDate) - new Date(startDate);
            const elapsedTime = now - new Date(startDate);
            const newProgress = Math.min(100, Math.round((elapsedTime / totalDuration) * 100));
            setCurrentProgress(newProgress);
        };

        updateProgress();
        // Update progress once per day
        const interval = setInterval(updateProgress, 86400000); // 24 hours

        return () => clearInterval(interval);
    }, [startDate, expectedEndDate, progress]);

    return (
        <div className="app-card card-hover h-full">
            <div className="relative h-40 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-teach-blue-600">
                        {lessons} Lessons
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{title}</h3>
                <p className="text-sm text-gray-500 mb-3">Instructor: {instructor}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center">
                        <BarChart className="w-3 h-3 mr-1" />
                        <span>{currentProgress}% complete</span>
                    </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                    <div
                        className="bg-teach-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${currentProgress}%` }}
                    ></div>
                </div>

                <button className="bg-blue-500 flex p-4 items-center rounded-md w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CourseCard;