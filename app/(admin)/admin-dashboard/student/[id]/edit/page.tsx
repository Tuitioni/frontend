"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import {
  StudentDetail,
  UpdateStudentDto,
  UpdateStudentProfileDto,
} from "@/types/Student";
import { Gender, Medium } from "@/types";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { AdminCard } from "@/components/ui/admin/adminCard";

interface StudentEditFormState extends UpdateStudentDto {}

interface StudentEditProps {
  params: { id: string };
}

export default function StudentEdit({ params }: StudentEditProps) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [originalStudentData, setOriginalStudentData] =
    useState<StudentDetail | null>(null);
  const [formData, setFormData] = useState<StudentEditFormState>({
    firstName: "",
    lastName: "",
    email: "",
    profile: {
      district: "",
      area: "",
      gender: Gender.MALE,
      age: 0,
      medium: Medium.BANGLA_MEDIUM,
      levelOfStudy: "",
      school: "",
      college: "",
      university: "",
      subjects: [],
    },
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetchWithAuth(`/api/admin/student/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch student details");
        const data: StudentDetail = await response.json();

        setOriginalStudentData(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          profile: data.profile
            ? {
                district: data.profile.district || "",
                area: data.profile.area || "",
                gender: data.profile.gender || Gender.MALE,
                age: data.profile.age || 0,
                medium: data.profile.medium || Medium.BANGLA_MEDIUM,
                levelOfStudy: data.profile.levelOfStudy || "",
                school: data.profile.school || "",
                college: data.profile.college || "",
                university: data.profile.university || "",
                subjects: data.profile.subjects || [],
              }
            : undefined,
        });
      } catch (error: any) {
        console.error("Error fetching student:", error);
        setNotification({
          message: error.message || "Failed to load student",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [fetchWithAuth, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalStudentData) return;
    setLoading(true);

    const updatePayload: Partial<StudentEditFormState> = {};
    let profileChanged = false;
    const profilePayload: Partial<UpdateStudentProfileDto> = {};

    if (formData.firstName !== originalStudentData.firstName)
      updatePayload.firstName = formData.firstName;
    if (formData.lastName !== originalStudentData.lastName)
      updatePayload.lastName = formData.lastName;
    if (formData.email !== originalStudentData.email)
      updatePayload.email = formData.email;

    if (formData.profile && originalStudentData.profile) {
      const currentProfile = formData.profile;
      const originalProfile = originalStudentData.profile;

      if (currentProfile.district !== originalProfile.district) {
        profilePayload.district = currentProfile.district;
        profileChanged = true;
      }
      if (currentProfile.area !== originalProfile.area) {
        profilePayload.area = currentProfile.area;
        profileChanged = true;
      }
      if (currentProfile.gender !== originalProfile.gender) {
        profilePayload.gender = currentProfile.gender;
        profileChanged = true;
      }
      if (currentProfile.age !== originalProfile.age) {
        profilePayload.age = currentProfile.age;
        profileChanged = true;
      }
      if (currentProfile.medium !== originalProfile.medium) {
        profilePayload.medium = currentProfile.medium;
        profileChanged = true;
      }
      if (currentProfile.levelOfStudy !== originalProfile.levelOfStudy) {
        profilePayload.levelOfStudy = currentProfile.levelOfStudy;
        profileChanged = true;
      }
      if (currentProfile.school !== originalProfile.school) {
        profilePayload.school = currentProfile.school;
        profileChanged = true;
      }
      if (currentProfile.college !== originalProfile.college) {
        profilePayload.college = currentProfile.college;
        profileChanged = true;
      }
      if (currentProfile.university !== originalProfile.university) {
        profilePayload.university = currentProfile.university;
        profileChanged = true;
      }
      if (
        JSON.stringify(currentProfile.subjects) !==
        JSON.stringify(originalProfile.subjects)
      ) {
        profilePayload.subjects = currentProfile.subjects;
        profileChanged = true;
      }
    }

    if (profileChanged) {
      updatePayload.profile = profilePayload;
    }

    if (Object.keys(updatePayload).length === 0) {
      setNotification({ message: "No changes detected.", type: "info" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWithAuth(`/api/admin/student/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update student");
      }

      const updatedDataResponse = await fetchWithAuth(
        `/api/admin/student/${params.id}`
      );
      const updatedData = await updatedDataResponse.json();
      setOriginalStudentData(updatedData);
      setFormData({
        firstName: updatedData.firstName || "",
        lastName: updatedData.lastName || "",
        email: updatedData.email || "",
        profile: updatedData.profile
          ? {
              district: updatedData.profile.district || "",
              area: updatedData.profile.area || "",
              gender: updatedData.profile.gender || Gender.MALE,
              age: updatedData.profile.age || 0,
              medium: updatedData.profile.medium || Medium.BANGLA_MEDIUM,
              levelOfStudy: updatedData.profile.levelOfStudy || "",
              school: updatedData.profile.school || "",
              college: updatedData.profile.college || "",
              university: updatedData.profile.university || "",
              subjects: updatedData.profile.subjects || [],
            }
          : undefined,
      });

      setNotification({
        message: "Student updated successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating student:", error);
      setNotification({
        message: error.message || "Failed to update student",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    isProfileField = false
  ) => {
    const { name, value } = e.target;
    const numericFields = ["profile.age"];

    if (isProfileField) {
      const profileField = name as keyof UpdateStudentProfileDto;
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...(prev.profile || {}),
          [profileField]: numericFields.includes(`profile.${profileField}`)
            ? Number(value)
            : value,
        },
      }));
    } else {
      const formField = name as keyof StudentEditFormState;
      setFormData((prev) => ({
        ...prev,
        [formField]: value,
      }));
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const subjects = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        subjects: subjects,
      },
    }));
  };

  if (loading) return <LoadingSpinnerCenter />;

  return (
    <div className="container mx-auto py-10">
      <AdminCard
        title="Edit Student"
        footer={
          <div className="flex gap-2 justify-end">
            <Button type="submit" form="edit-student-form" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin-dashboard/student/${params.id}`)
              }
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <form
          id="edit-student-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold border-b pb-1 mb-2">
            Basic Information
          </h3>
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <h3 className="text-lg font-semibold border-b pb-1 mb-2 mt-4">
            Profile Information
          </h3>
          <Input
            label="District"
            name="district"
            value={formData.profile?.district ?? ""}
            onChange={(e) => handleInputChange(e, true)}
          />
          <Input
            label="Area"
            name="area"
            value={formData.profile?.area ?? ""}
            onChange={(e) => handleInputChange(e, true)}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.profile?.gender ?? Gender.MALE}
            onChange={(e) => handleInputChange(e, true)}
            options={Object.values(Gender).map((g) => ({ value: g, label: g }))}
          />
          <Input
            label="Age"
            type="number"
            name="age"
            value={formData.profile?.age ?? 0}
            onChange={(e) => handleInputChange(e, true)}
          />
          <Select
            label="Medium"
            name="medium"
            value={formData.profile?.medium ?? Medium.BANGLA_MEDIUM}
            onChange={(e) => handleInputChange(e, true)}
            options={Object.values(Medium).map((m) => ({ value: m, label: m }))}
          />
          <Input
            label="Level of Study"
            name="levelOfStudy"
            value={formData.profile?.levelOfStudy ?? ""}
            onChange={(e) => handleInputChange(e, true)}
          />
          <Input
            label="School (Optional)"
            name="school"
            value={formData.profile?.school ?? ""}
            onChange={(e) => handleInputChange(e, true)}
          />
          <Input
            label="College (Optional)"
            name="college"
            value={formData.profile?.college ?? ""}
            onChange={(e) => handleInputChange(e, true)}
          />
          <Input
            label="University (Optional)"
            name="university"
            value={formData.profile?.university ?? ""}
            onChange={(e) => handleInputChange(e, true)}
          />
          <div className="space-y-1">
            <label
              htmlFor="subjects"
              className="block text-sm font-medium text-gray-700"
            >
              Subjects (comma-separated)
            </label>
            <textarea
              id="subjects"
              name="subjects"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.profile?.subjects?.join(", ") ?? ""}
              onChange={handleSubjectChange}
            />
          </div>
        </form>
      </AdminCard>

      {notification && (
        <div className="mt-4">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </div>
  );
}
