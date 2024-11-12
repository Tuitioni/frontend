"use client";
import React, { useState } from "react";

export default function VerificationRequest() {
  const [transactionId, setTransactionId] = useState("");

  const handleTransactionIdChange = (e) => {
    setTransactionId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to API
    alert("Form submitted!");
  };

  return (
    <div className="p-6 mx-auto mt-6 max-w-4xl bg-white shadow-md rounded-lg h-[400px]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Verification Request
      </h2>

      {/* Table for Required Documents */}
      <table className="min-w-full table-auto border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Document
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {/* NID/Passport/Birth Certificate */}
          <tr>
            <td className="px-4 py-2 text-gray-700">
              NID/Passport/Birth Certificate
            </td>
            <td className="px-4 py-2 text-gray-500">Not Uploaded</td>
          </tr>
          {/* School Certificate */}
          <tr>
            <td className="px-4 py-2 text-gray-700">School Certificate</td>
            <td className="px-4 py-2 text-gray-500">Not Uploaded</td>
          </tr>
          {/* College Certificate */}
          <tr>
            <td className="px-4 py-2 text-gray-700">College Certificate</td>
            <td className="px-4 py-2 text-gray-500">Not Uploaded</td>
          </tr>
          {/* University ID Card or Certificate */}
          <tr>
            <td className="px-4 py-2 text-gray-700">
              University ID Card or Certificate
            </td>
            <td className="px-4 py-2 text-gray-500">Not Uploaded</td>
          </tr>
        </tbody>
      </table>

      {/* Transaction ID Input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label
            htmlFor="transactionId"
            className="text-gray-700 font-semibold w-40"
          >
            Enter Payment Transaction ID:
          </label>
          <input
            type="text"
            id="transactionId"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={handleTransactionIdChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none mt-6"
        >
          Submit Verification Request
        </button>
      </form>
    </div>
  );
}
