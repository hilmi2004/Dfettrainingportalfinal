
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import PointsDisplay from "@/components/dashboard/PointsDisplay";
import PointsHistory from "@/components/points/PointsHistory";
import { getUserPoints, getPointsTransactions } from "@/services/pointsService";
import { toast } from "sonner";

const Points = () => {
  const { 
    data: pointsBalance = 0, 
    isLoading: isLoadingBalance 
  } = useQuery({
    queryKey: ['pointsBalance'],
    queryFn: getUserPoints,
    onError: () => {
      toast.error("Failed to load points balance. Please try again later.");
    }
  });

  const { 
    data: transactions = [], 
    isLoading: isLoadingTransactions 
  } = useQuery({
    queryKey: ['pointsTransactions'],
    queryFn: getPointsTransactions,
    onError: () => {
      toast.error("Failed to load transaction history. Please try again later.");
    }
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 page-transition">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Points</h1>
            <p className="text-gray-600">Manage and track your learning points</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <PointsDisplay points={pointsBalance} />
              
              <div className="app-card p-4 mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3">How to Earn Points</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-teach-blue-100 text-teach-blue-600 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Complete courses: 50-200 points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-teach-blue-100 text-teach-blue-600 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Submit assignments: 10-50 points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-teach-blue-100 text-teach-blue-600 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Participate in discussions: 5-15 points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-teach-blue-100 text-teach-blue-600 h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Daily login streak: 5 points per day</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <PointsHistory 
                transactions={transactions} 
                isLoading={isLoadingTransactions} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Points;
