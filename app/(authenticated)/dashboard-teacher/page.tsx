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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { tokenService } from "@/lib/auth/token";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { TeachingDetailsCard } from "./components/TeachingDetailsCard";
import { VerificationStatus } from "./components/VerificationStatus";

interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option: SelectOption) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const selected = options.find(
      (option: SelectOption) => option.value === value
    );
    setDisplayValue(selected ? selected.label : "");
    setSearchTerm("");
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        const selected = options.find(
          (option: SelectOption) => option.value === value
        );
        setDisplayValue(selected ? selected.label : "");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [value, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    onChange(optionValue);
    setDisplayValue(optionLabel);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center relative ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        ref={inputRef}
      >
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
          onFocus={() => !disabled && setIsOpen(true)}
          required={required}
          autoComplete="off"
        />
        <ChevronDown className="absolute right-3 h-4 w-4 opacity-50" />
      </div>
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-popover-foreground shadow-md"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No options found
            </div>
          ) : (
            filteredOptions.map((option: SelectOption) => (
              <div
                key={option.value}
                className={`px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                  option.value === value
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() => handleOptionClick(option.value, option.label)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
      <input type="hidden" value={value || ""} />
    </div>
  );
};

interface VerificationStatus {
  id: string;
  teacherId: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  document: string;
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function DashboardPage() {
  const { makeAuthenticatedRequest } = useAuth();
  const [profile, setProfile] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const decodedToken = useToken();
  console.log(decodedToken);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [districtsData, setDistrictsData] = useState<
    Array<{ district: string; areas: string[] }>
  >([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus | null>(null);

  // Add effect to monitor verification status
  useEffect(() => {
    console.log("Verification status changed:", verificationStatus);
  }, [verificationStatus]);

  // Convert data for the searchable select component
  const districtOptions = districtsData.map((d) => ({
    value: d.district.toLowerCase(),
    label: d.district,
  }));

  const areaOptions = availableAreas.map((area) => ({
    value: area.toLowerCase(),
    label: area,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://gist.githubusercontent.com/sifatulrabbi/9c1ae990e905bf620af298b5a4489f68/raw/4d9596fc0e0e48c223dea79efe902f6478e70cfd/bd_districts_areas.json"
        );
        const data = await response.json();
        setDistrictsData(data);
      } catch (error) {
        console.error("Failed to fetch districts and areas:", error);
        toast({
          title: "Error",
          description: "Failed to load districts and areas.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // Update available areas when district changes
  useEffect(() => {
    if (profile?.district && profile.district !== "") {
      const district = districtsData.find(
        (d) => d.district.toLowerCase() === profile.district.toLowerCase()
      );
      setAvailableAreas(district?.areas || []);
    } else {
      setAvailableAreas([]);
    }
  }, [profile?.district, districtsData]);

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
      console.log(data);
      setProfile(data);

      // Fetch verification status
      const verifyResponse = await makeAuthenticatedRequest(
        `/api/verify/${data.id}`
      );
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log("Setting verification status:", verifyData);
        setVerificationStatus(verifyData);
      }
    } catch (error) {
      console.error("Dashboard Error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        userId: decodedToken?.sub,
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

                {/* Verification Status Section */}
                {verificationStatus && verificationStatus.status && (
                  <VerificationStatus {...verificationStatus} />
                )}

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
                      {profile?.district}, {profile?.area}
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
              <TeachingDetailsCard
                details={{
                  district: profile?.district || "",
                  area: profile?.area || "",
                  gender: profile?.profile?.gender || "",
                  age: profile?.profile?.age || 0,
                  education: profile?.profile?.education || "",
                  yearsOfExperience: profile?.profile?.yearsOfExperience || 0,
                  subjects: profile?.profile?.subjects || [],
                  specialization: profile?.profile?.specialization || "",
                  teachingLevel: profile?.profile?.teachingLevel || "",
                  availability: profile?.profile?.availability || "",
                  monthlySalary: profile?.profile?.monthlySalary || 0,
                  medium: profile?.profile?.medium || "",
                }}
                teacherId={decodedToken?.sub || ""}
                onUpdate={(updatedDetails) => {
                  if (profile) {
                    setProfile({
                      ...profile,
                      district: updatedDetails.district,
                      area: updatedDetails.area,
                      profile: {
                        ...profile.profile,
                        gender: updatedDetails.gender,
                        age: updatedDetails.age,
                        education: updatedDetails.education,
                        yearsOfExperience: updatedDetails.yearsOfExperience,
                        subjects: updatedDetails.subjects,
                        specialization: updatedDetails.specialization,
                        teachingLevel: updatedDetails.teachingLevel,
                        availability: updatedDetails.availability,
                        monthlySalary: updatedDetails.monthlySalary,
                        medium: updatedDetails.medium,
                      },
                    });
                  }
                }}
              />
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
