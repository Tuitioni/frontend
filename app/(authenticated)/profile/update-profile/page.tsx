"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function UpdateProfile() {
  const [teacherData, setTeacherData] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [achievement, setAchievement] = useState("");

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      try {
        const payload = jwt.decode(token);

        if (payload?.sub) {
          fetch(`/api/teacher/${payload.sub}`)
            .then((res) => {
              if (!res.ok) {
                throw new Error("Failed to fetch teacher data");
              }
              return res.json();
            })
            .then((data) => {
              setTeacherData(data);
              setUsername(`${data.firstName} ${data.lastName}`);
              setEmail(data.email);
              setPhone(data.phone);
              setLocation(data.profile?.area || "");
              setCurriculum(data.profile?.medium || "");
              setSubjects(data.profile?.subjects || []);
              setSelectedClass(data.profile?.teachingLevel || "");
              setExpectedSalary(data.profile?.monthlySalary || "");
              setAchievement(data.profile?.specialization || "");
            })
            .catch((error) => {
              console.error(error);
            });
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.log("No access token found in cookies.");
    }
  }, []);

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSubjects(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      username,
      email,
      phone,
      location,
      curriculum,
      subjects,
      selectedClass,
      expectedSalary,
      achievement,
    };

    fetch(`/api/teacher/${teacherData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update profile");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Profile updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-4">
          <label htmlFor="username" className="text-gray-700 font-semibold w-32">
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

        <div className="flex items-center gap-4">
          <label htmlFor="location" className="text-gray-700 font-semibold w-32">
            Location:
          </label>
          <input
            type="text"
            id="location"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="curriculum" className="text-gray-700 font-semibold w-32">
            Curriculum:
          </label>
          <input
            type="text"
            id="curriculum"
            placeholder="Curriculum"
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="subjects" className="text-gray-700 font-semibold w-32">
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
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="class" className="text-gray-700 font-semibold w-32">
            Class:
          </label>
          <input
            type="text"
            id="class"
            placeholder="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="salary" className="text-gray-700 font-semibold w-32">
            Expected Salary:
          </label>
          <input
            type="number"
            id="salary"
            placeholder="Expected Salary"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="achievement" className="text-gray-700 font-semibold w-32">
            Achievement:
          </label>
          <input
            type="text"
            id="achievement"
            placeholder="Achievement"
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            required
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
