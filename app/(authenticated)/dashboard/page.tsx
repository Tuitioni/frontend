"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToken } from "@/hooks/useToken";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  subjects: string[];
  yearsOfExperience: number;
  medium: string;
}

export default function DashboardPage() {
  const { makeAuthenticatedRequest, logout } = useAuth();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const decodedToken = useToken();
  console.log(decodedToken);

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

  if (loading) {
    return <DashboardSkeleton />;
  }

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout} className="hover:bg-red-100">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-500">Name</h3>
                <p className="text-lg">
                  {profile?.firstName} {profile?.lastName}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Contact</h3>
                <p>{profile?.email}</p>
                <p>{profile?.phone}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Location</h3>
                <p>{profile?.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-500">Education</h3>
                <p>{profile?.education}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Experience</h3>
                <p>{profile?.yearsOfExperience} years</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Medium</h3>
                <p>{profile?.medium}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h3 className="text-2xl font-bold">0</h3>
                <p className="text-sm text-gray-500">Active Jobs</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h3 className="text-2xl font-bold">0</h3>
                <p className="text-sm text-gray-500">Completed Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                Update Profile
              </Button>
              <Button className="w-full" variant="outline">
                Browse Jobs
              </Button>
              <Button className="w-full" variant="outline">
                View Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
