
import React from "react";
import { Coins } from "lucide-react";


const PointsDisplay = ({ points }) => {
  return (
    <div className="app-card p-4 flex items-center justify-between animate-scale-in">
      <div>
        <h3 className="text-gray-600 font-medium">Your Points</h3>
        <p className="text-2xl font-bold text-teach-blue-600">{points}</p>
        <p className="text-xs text-gray-500 mt-1">Use these to purchase courses</p>
      </div>
      
      <div className="h-12 w-12 bg-teach-blue-100 rounded-full flex items-center justify-center">
        <Coins className="h-6 w-6 text-teach-blue-600" />
      </div>
    </div>
  );
};

export default PointsDisplay;
