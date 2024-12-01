"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function UpdateProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nidFile, setNidFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [achievement, setAchievement] = useState("");

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSubjects(selectedOptions);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic, e.g., send data to API
  };

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
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

        {/* Location */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="location"
            className="text-gray-700 font-semibold w-32"
          >
            Location:
          </label>
          <Select onValueChange={setLocation}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg px-4 py-2">
              {location || "Select Location"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dhaka">Dhaka</SelectItem>
              <SelectItem value="Chittagong">Chittagong</SelectItem>
              <SelectItem value="Sylhet">Sylhet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Curriculum */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="curriculum"
            className="text-gray-700 font-semibold w-32"
          >
            Curriculum:
          </label>
          <Select onValueChange={setCurriculum}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg px-4 py-2">
              {curriculum || "Select Curriculum"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English Medium">English Medium</SelectItem>
              <SelectItem value="Bangla Medium">Bangla Medium</SelectItem>
              <SelectItem value="Madrasa">Madrasa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subjects */}
        <div className="flex items-center gap-4 col-span-2">
          <label
            htmlFor="subjects"
            className="text-gray-700 font-semibold w-32"
          >
            Subjects:
          </label>
          <select
            id="subjects"
            multiple
            value={subjects}
            onChange={handleSubjectChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          >
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
          </select>
        </div>

        {/* Class */}
        <div className="flex items-center gap-4">
          <label htmlFor="class" className="text-gray-700 font-semibold w-32">
            Class:
          </label>
          <Select onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg px-4 py-2">
              {selectedClass || "Select Class"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expected Salary */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="expectedSalary"
            className="text-gray-700 font-semibold w-32"
          >
            Expected Salary:
          </label>
          <input
            type="number"
            id="expectedSalary"
            placeholder="Salary"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
        </div>

        {/* Achievement */}
        <div className="flex items-center gap-4 col-span-2">
          <label
            htmlFor="achievement"
            className="text-gray-700 font-semibold w-32"
          >
            Achievement:
          </label>
          <textarea
            id="achievement"
            placeholder="Your achievements"
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-right">
          <Button variant="default">Update Profile</Button>
        </div>
      </form>
    </div>
  );
}
