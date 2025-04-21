"use client";
import { useEffect, useState, useCallback } from "react";
import { useToken } from "@/hooks/useToken";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit2,
  MapPin,
  Mail,
  User,
  Book,
  GraduationCap,
  School,
} from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { StudentDetail } from "@/types/Student";
import { Toaster } from "@/components/ui/toaster";

const StudentDashboard = () => {
  const decodedToken = useToken();
  const { makeAuthenticatedRequest, logout } = useAuth();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Log token payload only once
  useEffect(() => {
    if (decodedToken) {
      console.log("Token payload:", decodedToken);
    }
  }, [decodedToken]);

  const fetchStudentData = useCallback(async () => {
    if (!decodedToken?.sub) {
      setLoading(false);
      setError("No user ID found in token");
      return;
    }

    try {
      const response = await makeAuthenticatedRequest(
        `/api/student/${decodedToken.sub}`
      );
      const data = await response.json();
      setStudent(data);
    } catch (err) {
      setError("Failed to fetch student data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [decodedToken?.sub, makeAuthenticatedRequest]);

  // Fetch data only once when component mounts and dependencies change
  useEffect(() => {
    if (decodedToken?.sub && !student && loading) {
      fetchStudentData();
    }
  }, [decodedToken?.sub, fetchStudentData, student, loading]);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Toaster />
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Student Dashboard</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <Button
            className="flex-1 sm:flex-initial text-sm sm:text-base"
            onClick={() => router.push("/tutors")}
          >
            <User className="h-4 w-4 mr-2" />
            View Tutors
          </Button>
          <Button
            className="flex-1 sm:flex-initial text-sm sm:text-base"
            variant="outline"
            onClick={() => router.push("/courses")}
          >
            <Book className="h-4 w-4 mr-2" />
            Browse Courses
          </Button>
          <Button
            variant="outline"
            onClick={logout}
            className="flex-1 sm:flex-initial hover:bg-red-100 text-sm sm:text-base"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 h-fit lg:sticky lg:top-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg sm:text-xl">Profile</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/profile/edit")}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl sm:text-2xl font-bold">
                  {student?.firstName?.[0]}
                  {student?.lastName?.[0]}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-center">
                {student?.firstName} {student?.lastName}
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                {student?.profile?.levelOfStudy || "Student"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">
                  {student?.email}
                </span>
              </div>
              {student?.profile && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">
                    {student.profile.area}, {student.profile.district}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Education Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg sm:text-xl">
                  Education Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/profile/edit")}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {student?.profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <h3 className="font-medium text-sm sm:text-base">
                          Education Level
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base">
                        {student.profile.levelOfStudy}
                      </p>
                    </div>
                    {student.profile.school && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <School className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-sm sm:text-base">
                            School
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base">
                          {student.profile.school}
                        </p>
                      </div>
                    )}
                    {student.profile.college && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <School className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-sm sm:text-base">
                            College
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base">
                          {student.profile.college}
                        </p>
                      </div>
                    )}
                    {student.profile.university && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <School className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-sm sm:text-base">
                            University
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base">
                          {student.profile.university}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Book className="h-4 w-4 text-gray-500" />
                        <h3 className="font-medium text-sm sm:text-base">
                          Medium
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base">
                        {student.profile.medium}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base mb-2">
                        Subjects
                      </h3>
                      {student.profile.subjects &&
                      student.profile.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {student.profile.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 rounded-full text-sm sm:text-base"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No subjects specified
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    Your profile information is incomplete.
                  </p>
                  <Button
                    className="mt-2"
                    variant="outline"
                    onClick={() => router.push("/profile/edit")}
                  >
                    Complete Your Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes or Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">
                  Start exploring tutors and courses tailored to your interests.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={() => router.push("/tutors")}>
                    Find Tutors
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/courses")}
                  >
                    Browse Courses
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton className="h-10 w-64" />
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Skeleton className="w-24 h-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
