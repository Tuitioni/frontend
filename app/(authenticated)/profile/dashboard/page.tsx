"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function Dashboard() {
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    // Get the access token from cookies
    const token = Cookies.get("access_token");

    if (token) {
      try {
        // Decode the JWT to get the payload
        const payload = jwt.decode(token);

        console.log("Decoded JWT payload:", payload);

        if (payload?.sub) {
          // Fetch teacher data using the extracted ID
          fetch(`/api/teacher/${payload.sub}`)
            .then((res) => {
              if (!res.ok) {
                throw new Error("Failed to fetch teacher data");
              }
              return res.json();
            })
            .then((data) => {
              console.log("Fetched teacher data:", data);
              setTeacherData(data);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.log("No access token found in cookies.");
    }
  }, []);

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Applied Tuition Number */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Applied Tuition</h2>
          <p className="text-4xl font-semibold text-blue-500 mt-4">2 </p>
        </div>

        {/* Hired Tuition Number */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Hired Tuition</h2>
          <p className="text-4xl font-semibold text-green-500 mt-4">2</p>
        </div>

        {/* Ongoing Tuition Number */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Ongoing Tuition</h2>
          <p className="text-4xl font-semibold text-yellow-500 mt-4">2 </p>
        </div>

        {/* Due Amount */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-gray-700">Due Amount</h2>
          <p className="text-4xl font-semibold text-red-500 mt-4">2 </p>
        </div>
      </div>
    </div>
  );
}
