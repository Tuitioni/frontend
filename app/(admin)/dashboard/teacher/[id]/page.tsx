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
        console.log("Fetching teacher details for ID:", params.id);
        const apiUrl = `http://localhost:8000/teacher/${params.id}`;
        console.log("API URL:", apiUrl);

        const response = await fetch(apiUrl);
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Teacher Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <AdminCard title="Personal Information">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">
                {teacher.firstName} {teacher.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{teacher.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{teacher.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{teacher.location}</p>
            </div>
          </div>
        </AdminCard>

        {/* Profile Information */}
        {teacher.profile && (
          <AdminCard title="Teaching Profile">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Medium</p>
                <p className="font-medium">{teacher.profile.medium}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teaching Level</p>
                <p className="font-medium">{teacher.profile.teachingLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.profile.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-gray-100 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">
                  {teacher.profile.yearsOfExperience} years
                </p>
              </div>
            </div>
          </AdminCard>
        )}

        {/* Additional Details */}
        {teacher.profile && (
          <AdminCard title="Additional Details">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {teacher.profile.area}, {teacher.profile.district}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Education</p>
                <p className="font-medium">{teacher.profile.education}</p>
              </div>
              {teacher.profile.specialization && (
                <div>
                  <p className="text-sm text-gray-500">Specialization</p>
                  <p className="font-medium">
                    {teacher.profile.specialization}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-medium">{teacher.profile.availability}</p>
              </div>
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
