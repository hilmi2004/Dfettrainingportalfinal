
import React from "react";
import { BookOpen, Clock, BarChart } from "lucide-react";



const CourseCard = ({ 
  title, 
  instructor, 
  progress, 
  lessons, 
  duration, 
  image 
}) => {
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
            <span>{progress}% complete</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div 
            className="bg-teach-blue-500 h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <button className="btn-primary w-full">
          <BookOpen className="w-4 h-4 mr-2" />
          Continue
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
