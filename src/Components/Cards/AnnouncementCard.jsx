
import React from "react";
import { CalendarClock } from "lucide-react";


const AnnouncementCard = ({ 
  title, 
  content, 
  date, 
  important = false 
}) => {
  return (
    <div className={`app-card p-4 border-l-4 ${important ? 'border-l-red-500' : 'border-l-teach-blue-500'} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-800">
          {important && (
            <span className="mr-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600">
              Important
            </span>
          )}
          {title}
        </h3>
      </div>
      
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        {content}
      </p>
      
      <div className="flex items-center mt-3 text-xs text-gray-500">
        <CalendarClock className="w-3 h-3 mr-1" />
        <span>{date}</span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
