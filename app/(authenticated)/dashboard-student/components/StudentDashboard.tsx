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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentProfileForm } from "./StudentProfileForm";
import { useToast } from "@/components/ui/use-toast";

interface StudentProfile {
  district: string;
  area: string;
  gender: string;
  age: number;
  medium: string;
  levelOfStudy: string;
  school: string;
  college: string | null;
  university: string | null;
  subjects: string[];
  studentId: string;
}

const StudentDashboard = () => {
  const decodedToken = useToken();
  const { makeAuthenticatedRequest, logout } = useAuth();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Default form state for the job post
  const [postForm, setPostForm] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    district: student?.profile?.district || "",
    area: student?.profile?.area || "",
    age: student?.profile?.age || 14,
    medium: student?.profile?.medium || "ENGLISH_MEDIUM",
    levelOfStudy: student?.profile?.levelOfStudy || "Middle School",
    school: student?.profile?.school || "",
    college: student?.profile?.college || null,
    university: student?.profile?.university || null,
    subjects: student?.profile?.subjects || ["Biology", "History", "Spanish"],
    gender: student?.profile?.gender || "FEMALE",
    salary: 1500,
    numberOfDays: 3,
    duration: "1.5 hours",
    tuitionType: "Private",
    class: "8th Grade",
    note: "Prefers weekend classes",
  });
  const [posting, setPosting] = useState(false);

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

  const fetchProfile = async () => {
    try {
      const token = await makeAuthenticatedRequest("/api/student-profile");
      if (token.ok) {
        const data = await token.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (updatedProfile: StudentProfile) => {
    try {
      if (!decodedToken?.sub) {
        throw new Error("No user ID found");
      }

      const formattedData = {
        ...updatedProfile,
        gender: updatedProfile.gender.toUpperCase(),
        medium:
          updatedProfile.medium === "English"
            ? "ENGLISH_MEDIUM"
            : updatedProfile.medium === "Bengali"
            ? "BANGLA_MEDIUM"
            : "ENGLISH_VERSION",
        studentId: decodedToken.sub,
      };

      const response = await makeAuthenticatedRequest("/api/student-profile", {
        method: "POST",
        data: formattedData,
      });

      if (response.ok) {
        setProfile(formattedData);
        setIsOpen(false);
      } else {
        const errorData = await response.json();
        console.error("Profile update failed:", errorData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosting(true);
    try {
      if (!decodedToken?.sub) {
        toast({
          title: "Error",
          description: "No student ID found in token",
          variant: "destructive",
        });
        setPosting(false);
        return;
      }
      const response = await makeAuthenticatedRequest("/api/student-post", {
        method: "POST",
        data: { ...postForm, studentId: decodedToken.sub },
      });
      if (response.ok) {
        toast({ title: "Post created successfully!" });
        setPostForm((prev) => ({ ...prev, note: "" }));
      } else {
        const errorData = await response.json();
        toast({
          title: "Failed to create post",
          description: errorData.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  const handlePostChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    // List of fields that should be numbers
    const numberFields = ["age", "salary", "numberOfDays"];
    setPostForm((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostForm((prev) => ({ ...prev, subjects: e.target.value.split(",") }));
  };

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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
          </DialogHeader>
          <StudentProfileForm
            initialData={profile}
            onSubmit={handleProfileUpdate}
          />
        </DialogContent>
      </Dialog>
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
                onClick={() => setIsOpen(true)}
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
        {/* Simple Post Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post a Tuition Job</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handlePostSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="firstName"
                    value={postForm.firstName}
                    onChange={handlePostChange}
                    placeholder="First Name"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="lastName"
                    value={postForm.lastName}
                    onChange={handlePostChange}
                    placeholder="Last Name"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="district"
                    value={postForm.district}
                    onChange={handlePostChange}
                    placeholder="District"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="area"
                    value={postForm.area}
                    onChange={handlePostChange}
                    placeholder="Area"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="age"
                    type="number"
                    value={postForm.age}
                    onChange={handlePostChange}
                    placeholder="Age"
                    required
                  />
                  <select
                    className="border rounded px-3 py-2 w-full"
                    name="medium"
                    value={postForm.medium}
                    onChange={handlePostChange}
                    required
                  >
                    <option value="ENGLISH_MEDIUM">English Medium</option>
                    <option value="BANGLA_MEDIUM">Bangla Medium</option>
                    <option value="ENGLISH_VERSION">English Version</option>
                  </select>
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="levelOfStudy"
                    value={postForm.levelOfStudy}
                    onChange={handlePostChange}
                    placeholder="Level of Study"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="school"
                    value={postForm.school}
                    onChange={handlePostChange}
                    placeholder="School"
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="college"
                    value={postForm.college || ""}
                    onChange={handlePostChange}
                    placeholder="College (optional)"
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="university"
                    value={postForm.university || ""}
                    onChange={handlePostChange}
                    placeholder="University (optional)"
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="subjects"
                    value={postForm.subjects.join(",")}
                    onChange={handleSubjectsChange}
                    placeholder="Subjects (comma separated)"
                    required
                  />
                  <select
                    className="border rounded px-3 py-2 w-full"
                    name="gender"
                    value={postForm.gender}
                    onChange={handlePostChange}
                    required
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="salary"
                    type="number"
                    value={postForm.salary}
                    onChange={handlePostChange}
                    placeholder="Salary"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="numberOfDays"
                    type="number"
                    value={postForm.numberOfDays}
                    onChange={handlePostChange}
                    placeholder="Number of Days"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="duration"
                    value={postForm.duration}
                    onChange={handlePostChange}
                    placeholder="Duration (e.g. 1.5 hours)"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="tuitionType"
                    value={postForm.tuitionType}
                    onChange={handlePostChange}
                    placeholder="Tuition Type"
                    required
                  />
                  <input
                    className="border rounded px-3 py-2 w-full"
                    name="class"
                    value={postForm.class}
                    onChange={handlePostChange}
                    placeholder="Class"
                    required
                  />
                </div>
                <textarea
                  className="border rounded px-3 py-2 w-full"
                  name="note"
                  value={postForm.note}
                  onChange={handlePostChange}
                  placeholder="Note (optional)"
                  rows={2}
                />
                <Button type="submit" disabled={posting}>
                  {posting ? "Posting..." : "Post Tuition Job"}
                </Button>
              </form>
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
