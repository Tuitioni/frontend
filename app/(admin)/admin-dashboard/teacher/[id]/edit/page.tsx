"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import {
  TeacherDetail,
  UpdateAdminTeacherDto,
  UpdateTeacherDto,
} from "@/types/teacher";
import { Gender, Medium } from "@/types";
import { useAuthFetch } from "@/hooks/useAuthFetch";

interface TeacherEditProps {
  params: { id: string };
}

export default function TeacherEdit({ params }: TeacherEditProps) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [originalTeacherData, setOriginalTeacherData] =
    useState<TeacherDetail | null>(null);

  const [formData, setFormData] = useState<UpdateTeacherDto>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phone: "",
    profile: {
      gender: Gender.MALE,
      medium: Medium.BANGLA_MEDIUM,
      education: "",
      yearsOfExperience: 0,
      subjects: [],
      specialization: "",
      teachingLevel: "",
      availability: "",
      monthlySalary: 0,
    },
  });

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetchWithAuth(`/api/admin/teacher/${params.id}`);
        const data: TeacherDetail = await response.json();
        setOriginalTeacherData(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          profile: data.profile
            ? {
                ...data.profile,
                specialization: data.profile.specialization ?? "",
              }
            : undefined,
        });
      } catch (error: any) {
        console.error("Error fetching teacher:", error);
        setNotification({
          message: "Failed to fetch teacher details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [fetchWithAuth, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalTeacherData) return;
    setLoading(true);

    const updatePayload: Partial<UpdateTeacherDto> = {};
    let profileChanged = false;
    const profilePayload: Partial<UpdateTeacherDto["profile"]> = {};

    if (formData.firstName !== originalTeacherData.firstName)
      updatePayload.firstName = formData.firstName;
    if (formData.lastName !== originalTeacherData.lastName)
      updatePayload.lastName = formData.lastName;
    if (formData.email !== originalTeacherData.email)
      updatePayload.email = formData.email;
    if (formData.phone !== originalTeacherData.phone)
      updatePayload.phone = formData.phone;

    if (formData.profile && originalTeacherData.profile) {
      const currentProfile = formData.profile;
      const originalProfile = originalTeacherData.profile;

      if (currentProfile.gender !== originalProfile.gender) {
        profilePayload.gender = currentProfile.gender;
        profileChanged = true;
      }
      if (currentProfile.medium !== originalProfile.medium) {
        profilePayload.medium = currentProfile.medium;
        profileChanged = true;
      }
      if (currentProfile.education !== originalProfile.education) {
        profilePayload.education = currentProfile.education;
        profileChanged = true;
      }
      if (
        currentProfile.yearsOfExperience !== originalProfile.yearsOfExperience
      ) {
        profilePayload.yearsOfExperience = currentProfile.yearsOfExperience;
        profileChanged = true;
      }
      if (
        JSON.stringify(currentProfile.subjects) !==
        JSON.stringify(originalProfile.subjects)
      ) {
        profilePayload.subjects = currentProfile.subjects;
        profileChanged = true;
      }
      if (currentProfile.specialization !== originalProfile.specialization) {
        profilePayload.specialization = currentProfile.specialization;
        profileChanged = true;
      }
      if (currentProfile.teachingLevel !== originalProfile.teachingLevel) {
        profilePayload.teachingLevel = currentProfile.teachingLevel;
        profileChanged = true;
      }
      if (currentProfile.availability !== originalProfile.availability) {
        profilePayload.availability = currentProfile.availability;
        profileChanged = true;
      }
      if (currentProfile.monthlySalary !== originalProfile.monthlySalary) {
        profilePayload.monthlySalary = currentProfile.monthlySalary;
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
      const response = await fetchWithAuth(`/api/admin/teacher/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update teacher");
      }

      const updatedDataResponse = await fetchWithAuth(
        `/api/admin/teacher/${params.id}`
      );
      const updatedData = await updatedDataResponse.json();
      setOriginalTeacherData(updatedData);
      setFormData({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        location: updatedData.location,
        phone: updatedData.phone,
        profile: updatedData.profile ? { ...updatedData.profile } : undefined,
      });

      setNotification({
        message: "Teacher updated successfully",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating teacher:", error);
      setNotification({
        message: error.message || "Failed to update teacher",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "profile.yearsOfExperience",
      "profile.monthlySalary",
    ];

    if (name.includes("profile.")) {
      const profileField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: numericFields.includes(name) ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (notification) {
    return (
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Teacher</h1>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin-dashboard/teacher/${params.id}`)}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />

          <h2 className="text-xl font-semibold mt-8 mb-4">
            Profile Information
          </h2>

          <Input
            label="District"
            name="profile.district"
            value={formData.profile?.district}
            onChange={handleInputChange}
          />
          <Input
            label="Area"
            name="profile.area"
            value={formData.profile?.area}
            onChange={handleInputChange}
          />

          <Select
            label="Gender"
            name="profile.gender"
            value={formData.profile?.gender}
            onChange={handleInputChange}
            options={[
              { value: Gender.MALE, label: "Male" },
              { value: Gender.FEMALE, label: "Female" },
            ]}
          />

          <Select
            label="Medium"
            name="profile.medium"
            value={formData.profile?.medium}
            onChange={handleInputChange}
            options={[
              { value: Medium.BANGLA_MEDIUM, label: "Bangla Medium" },
              { value: Medium.ENGLISH_MEDIUM, label: "English Medium" },
              { value: Medium.ENGLISH_VERSION, label: "English Version" },
            ]}
          />

          <Input
            label="Education"
            name="profile.education"
            value={formData.profile?.education}
            onChange={handleInputChange}
          />

          <Input
            label="Years of Experience"
            type="number"
            name="profile.yearsOfExperience"
            value={formData.profile?.yearsOfExperience}
            onChange={handleInputChange}
          />

          <Input
            label="Monthly Salary"
            type="number"
            name="profile.monthlySalary"
            value={formData.profile?.monthlySalary}
            onChange={handleInputChange}
          />

          <div className="flex justify-end space-x-2">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
