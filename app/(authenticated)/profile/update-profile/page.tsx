"use client";
import React, { useState } from "react";

export default function UpdateProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nidFile, setNidFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic, e.g., send data to API
  };

  return (
    <div className="p-6 mx-auto ">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Username */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="username"
            className="text-gray-700 font-semibold w-32"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <label htmlFor="email" className="text-gray-700 font-semibold w-32">
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-4">
          <label htmlFor="phone" className="text-gray-700 font-semibold w-32">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        {/* NID Document */}
        <div className="flex items-center gap-4">
          <label htmlFor="nidFile" className="text-gray-700 font-semibold w-32">
            Upload NID Document:
          </label>
          <input
            type="file"
            id="nidFile"
            onChange={(e) => setNidFile(e.target.files[0])}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
        </div>

        {/* Passport-size Photo */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="photoFile"
            className="text-gray-700 font-semibold w-32"
          >
            Upload Passport-size Photo:
          </label>
          <input
            type="file"
            id="photoFile"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            accept=".jpg,.jpeg,.png"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none mt-6"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
