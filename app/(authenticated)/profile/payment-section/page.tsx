"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function PaymentSection() {
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionId("");
  };

  return (
    <div className="p-6 mx-auto max-w-lg mt-6 h-[500px] overflow-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Section</h2>

      {/* Due Payment */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Payment Due:</h3>
        <p className="text-2xl font-bold text-red-500">$200</p>
      </div>

      {/* bKash Number */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">bKash Number:</h3>
        <p className="text-xl font-medium text-gray-800">+880123456789</p>
      </div>

      {/* Transaction ID Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <label
            htmlFor="transactionId"
            className="text-gray-700 font-semibold w-40"
          >
            Enter Transaction ID:
          </label>
          <input
            type="text"
            id="transactionId"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        {/* Submit Button */}
        <Button variant="yellowBorder" type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
