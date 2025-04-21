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
import { TeacherDetail } from "@/types/teacher";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardPage() {
  const { makeAuthenticatedRequest, logout } = useAuth();
  const [profile, setProfile] = useState<TeacherDetail | null>(null);
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
      const response = await makeAuthenticatedRequest(
        `/api/teacher/${decodedToken.sub}`
      );
      const data: TeacherDetail = await response.json();
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

  const handleProfileUpdate = (updatedProfile: TeacherDetail) => {
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
    <AnimatePresence>
      <motion.div
        className="p-4 sm:p-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Toaster />
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Teacher Dashboard</h1>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1 sm:flex-initial text-sm sm:text-base"
              onClick={() => router.push("/jobs")}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Find Teaching Jobs
            </Button>
            <Button
              className="flex-1 sm:flex-initial text-sm sm:text-base"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2" />
              View Applications
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
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="lg:col-span-1 h-fit lg:sticky lg:top-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg sm:text-xl">Profile</CardTitle>
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
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl sm:text-2xl font-bold">
                      {profile?.firstName?.[0]}
                      {profile?.lastName?.[0]}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-center">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500">
                    {profile?.profile?.teachingLevel} Teacher
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base break-all">
                      {profile?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {profile?.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {profile?.profile?.district}, {profile?.profile?.area}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Teaching Details Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg sm:text-xl">
                      Teaching Details
                    </CardTitle>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-sm sm:text-base">
                            Education
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base">
                          {profile?.profile?.education}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-sm sm:text-base">
                            Experience
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base">
                          {profile?.profile?.yearsOfExperience} years
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-2">
                          Subjects
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile?.profile?.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 rounded-full text-sm sm:text-base"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-sm sm:text-base">
                            Availability
                          </h3>
                        </div>
                        <p className="text-sm sm:text-base">
                          {profile?.profile?.availability}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Details Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                        Medium
                      </h3>
                      <p className="font-semibold text-sm sm:text-base">
                        {profile?.profile?.medium.replace("_", " ")}
                      </p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                        Specialization
                      </h3>
                      <p className="font-semibold text-sm sm:text-base line-clamp-1">
                        {profile?.profile?.specialization}
                      </p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="text-xs sm:text-sm text-gray-500 mb-1">
                        Expected Salary
                      </h3>
                      <p className="font-semibold text-sm sm:text-base">
                        ₹{profile?.profile?.monthlySalary.toLocaleString()}
                        /month
                      </p>
                    </div>
                  </div>

                  {/* Verification Card */}
                  <Card className="bg-yellow-50/50 mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        Verify Your Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                        Please verify your account by uploading either your NID
                        or Birth Certificate
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(`/dashboard-teacher/verify/nid`)
                          }
                          className="text-sm sm:text-base"
                        >
                          Upload NID
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/dashboard-teacher/verify/birth-certificate`
                            )
                          }
                          className="text-sm sm:text-base"
                        >
                          Upload Birth Certificate
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(`/dashboard-teacher/verify/passport`)
                          }
                          className="text-sm sm:text-base"
                        >
                          Upload Passport
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Profile Edit Modal */}
        {profile && (
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton className="h-8 w-40 sm:h-10" />
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Teaching Details Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-8 w-20 rounded-full" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>

              {/* Verification Card Skeleton */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
