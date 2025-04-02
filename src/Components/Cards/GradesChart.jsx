
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";



const GradesChart = () => {
  const gradeData = [
    { name: "A", value: 4, color: "#4CAF50" },
    { name: "B", value: 2, color: "#2196F3" },
    { name: "C", value: 1, color: "#FFC107" },
    { name: "D", value: 0, color: "#FF9800" },
    { name: "F", value: 0, color: "#F44336" },
  ];


  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded-md border border-gray-100">
          <p className="font-medium">{`${payload[0].name} Grades: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gradeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            dataKey="value"
            animationDuration={800}
            animationBegin={200}
          >
            {gradeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradesChart;
