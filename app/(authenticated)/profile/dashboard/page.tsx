import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Applied Tuition Number */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Applied Tuition</h2>
          <p className="text-4xl font-semibold text-blue-500 mt-4">15</p>{" "}
          {/* Replace '15' with dynamic data */}
        </div>

        {/* Hired Tuition Number */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Hired Tuition</h2>
          <p className="text-4xl font-semibold text-green-500 mt-4">8</p>{" "}
          {/* Replace '8' with dynamic data */}
        </div>

        {/* Ongoing Tuition Number */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Ongoing Tuition</h2>
          <p className="text-4xl font-semibold text-yellow-500 mt-4">5</p>{" "}
          {/* Replace '5' with dynamic data */}
        </div>

        {/* Due Amount */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Due Amount</h2>
          <p className="text-4xl font-semibold text-red-500 mt-4">$200</p>{" "}
          {/* Replace '$200' with dynamic data */}
        </div>
      </div>
    </div>
  );
}
