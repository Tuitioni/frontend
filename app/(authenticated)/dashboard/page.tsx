"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Clock,
  AlertCircle,
} from "lucide-react";
import React from "react";
import { ProfileEditModal } from "./components/ProfileEditModal";
import { useRouter } from "next/navigation";

interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  profile_pic: string | null;
  profile: {
    district: string;
    area: string;
    gender: string;
    age: number;
    medium: string;
    education: string;
    yearsOfExperience: number;
    subjects: string[];
    specialization: string;
    teachingLevel: string;
    availability: string;
    monthlySalary: number;
  };
}

export default function DashboardPage() {
  const { makeAuthenticatedRequest, logout } = useAuth();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const decodedToken = useToken();
  console.log(decodedToken);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  // Memoize fetchProfile to prevent recreation on every render
  const fetchProfile = useCallback(async () => {
    if (!decodedToken?.sub) {
      setError("Authentication error - no user ID found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await makeAuthenticatedRequest(
        `/api/teacher/${decodedToken.sub}`
      );
      setProfile(data);
    } catch (error) {
      console.error("Dashboard Error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        userId: decodedToken.sub,
        timestamp: new Date().toISOString(),
      });
      setError(
        error instanceof Error ? error.message : "Failed to load profile data"
      );
    } finally {
      setLoading(false);
    }
  }, [decodedToken?.sub, makeAuthenticatedRequest]);

  // Use a ref to track if the component is mounted
  const isMounted = React.useRef(false);

  useEffect(() => {
    // Only fetch on initial mount
    if (!isMounted.current) {
      isMounted.current = true;
      fetchProfile();
    }
  }, [fetchProfile]);

  const handleProfileUpdate = (updatedProfile: TeacherProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) return <DashboardSkeleton />;
  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button variant="outline" onClick={logout} className="hover:bg-red-100">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Takes full width on mobile, 1/3 on desktop */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Profile</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {profile?.profile_pic ? (
                  <img
                    src={profile.profile_pic}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {profile?.firstName?.[0]}
                    {profile?.lastName?.[0]}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-gray-500">
                {profile?.profile.teachingLevel} Teacher
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{profile?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>
                  {profile?.profile.district}, {profile?.profile.area}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area - Takes 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Teaching Details */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Teaching Details</CardTitle>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <h3 className="font-medium">Education</h3>
                    </div>
                    <p>{profile?.profile.education}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <h3 className="font-medium">Experience</h3>
                    </div>
                    <p>{profile?.profile.yearsOfExperience} years</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Subjects</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.profile.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <h3 className="font-medium">Availability</h3>
                    </div>
                    <p>{profile?.profile.availability}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Medium</h3>
                  <p className="font-semibold">
                    {profile?.profile.medium.replace("_", " ")}
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">Specialization</h3>
                  <p className="font-semibold">
                    {profile?.profile.specialization}
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="text-sm text-gray-500 mb-1">
                    Expected Salary
                  </h3>
                  <p className="font-semibold">
                    ₹{profile?.profile.monthlySalary}/month
                  </p>
                </div>
              </div>

              <Card className="bg-yellow-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Verify Your Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please verify your account by uploading either your NID or
                    Birth Certificate
                  </p>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/verify/nid`)}
                    >
                      Upload NID
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        router.push(`/dashboard/verify/birth_certificate`)
                      }
                    >
                      Upload Birth Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-4 flex-wrap">
            <Button className="flex-1">Find Teaching Jobs</Button>
            <Button className="flex-1" variant="outline">
              View Applications
            </Button>
            <Button className="flex-1" variant="outline">
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      {profile && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
