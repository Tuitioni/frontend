"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { Button } from "@/components/ui/button";

export default function VerificationRequest() {
  const [file, setFile] = useState<File | null>(null);
  const [verificationType, setVerificationType] = useState("NID");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [teacherData, setTeacherData] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleVerificationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVerificationType(e.target.value);
  };

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      try {
        // Decode the JWT to get the payload
        const payload = jwt.decode(token) as { sub: string };

        if (payload?.sub) {
          // Fetch teacher data using the extracted ID
          fetch(`/api/teacher/${payload.sub}`)
            .then((response) => response.json())
            .then((data) => setTeacherData(data))
            .catch((error) => {
              console.error("Error fetching teacher data:", error);
              setErrorMessage("Failed to fetch teacher data.");
            });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setErrorMessage("Failed to decode token.");
      }
    } else {
      setErrorMessage("No access token found.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!file) {
      setErrorMessage("Please select a file for verification.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = Cookies.get("access_token");

      if (token) {
        const payload = jwt.decode(token) as { sub: string };
        if (payload?.sub) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("verificationType", verificationType);

          const response = await fetch(
            `/api/teacher/${payload.sub}/${verificationType.toLowerCase()}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            setSuccessMessage(`${verificationType} verification file uploaded successfully.`);
            setFile(null); // Reset file input after success
          } else {
            const errorData = await response.json();
            setErrorMessage(errorData.error || "Failed to upload verification file.");
          }
        }
      }
    } catch (error) {
      console.error("Error submitting verification request:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 mx-auto mt-6 max-w-4xl bg-white shadow-md rounded-lg h-[500px]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Verification Request</h2>

      {/* Display Teacher Data if Available */}
      {teacherData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Teacher Information</h3>
          <p className="text-gray-700">Name: {teacherData.name}</p>
          <p className="text-gray-700">Email: {teacherData.email}</p>
        </div>
      )}

      {/* Success and Error Messages */}
      {successMessage && (
        <p className="mb-4 text-green-600 font-medium">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mb-4 text-red-600 font-medium">{errorMessage}</p>
      )}

      {/* Table for Required Documents */}
      <table className="min-w-full table-auto border-collapse mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Document</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* NID/Passport/Birth Certificate */}
          <tr>
            <td className="px-4 py-2 text-gray-700">NID/Passport/Birth Certificate</td>
            <td className="px-4 py-2 text-gray-500">Not Verified</td>
          </tr>
        </tbody>
      </table>

      {/* Verification Type and File Input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Verification Type Selector */}
        <div className="flex items-center gap-4">
          <label htmlFor="verificationType" className="text-gray-700 font-semibold w-40">
            Verification Type:
          </label>
          <select
            id="verificationType"
            value={verificationType}
            onChange={handleVerificationTypeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          >
            <option value="NID">NID</option>
            <option value="Passport">Passport</option>
            <option value="Birth-Certificate">Birth Certificate</option>
          </select>
        </div>

        {/* File Input */}
        <div className="flex items-center gap-4">
          <label htmlFor="file" className="text-gray-700 font-semibold w-40">
            Upload Document:
          </label>
          <input
            type="file"
            id="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        {/* Update Button (Visible only after file is selected) */}
        {file && (
          <Button variant="default">            {isSubmitting ? "Uploading..." : "Update Verification Document"}
</Button>

        )}
      </form>
    </div>
  );
}
