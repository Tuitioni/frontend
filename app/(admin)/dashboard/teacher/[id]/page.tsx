"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";

import { TeacherDetail } from "@/types/Teacher";
import { AdminCard } from "@/components/ui/admin/adminCard";

export default function TeacherDashboardByID({
  params,
}: {
  params: { id: string };
}) {
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const apiUrl = `http://localhost:8000/teacher/${params.id}`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch teacher details");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setTeacher(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <Notification
        message={error}
        type="error"
        onClose={() => setError(null)}
      />
    );
  }

  if (!teacher) {
    return <div>No teacher found</div>;
  }

  const formatMedium = (medium: string) => {
    medium = medium.toLowerCase();
    return medium
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Teacher Profile
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <AdminCard
          title="Personal Information"
          className="bg-white shadow-lg rounded-xl"
        >
          <div className="space-y-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {teacher.firstName} {teacher.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {teacher.email}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-lg font-semibold text-gray-900">
                {teacher.phone}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-lg font-semibold text-gray-900">
                {teacher.location}
              </p>
            </div>
          </div>
        </AdminCard>

        {/* Profile Information */}
        {teacher.profile && (
          <AdminCard
            title="Teaching Profile"
            className="bg-white shadow-lg rounded-xl"
          >
            <div className="space-y-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Medium</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatMedium(teacher.profile.medium)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">
                  Teaching Level
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {teacher.profile.teachingLevel}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Subjects</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacher.profile.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Experience</p>
                <p className="text-lg font-semibold text-gray-900">
                  {teacher.profile.yearsOfExperience} years
                </p>
              </div>
            </div>
          </AdminCard>
        )}

        {/* Additional Details */}
        {teacher.profile && (
          <AdminCard
            title="Additional Details"
            className="bg-white shadow-lg rounded-xl lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {teacher.profile.area}, {teacher.profile.district}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Education</p>
                <p className="text-lg font-semibold text-gray-900">
                  {teacher.profile.education}
                </p>
              </div>
              {teacher.profile.specialization && (
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-500">
                    Specialization
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {teacher.profile.specialization}
                  </p>
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">
                  Availability
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {teacher.profile.availability}
                </p>
              </div>
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
