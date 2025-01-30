"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";
import { TeacherDetail, UpdateTeacherDto } from "@/types/Teacher";
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
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<UpdateTeacherDto>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phone: "",
    profile: {
      district: "",
      area: "",
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
        const response = await fetchWithAuth(
          `http://localhost:8000/teacher/${params.id}`
        );
        const data = await response.json();
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          location: data.location,
          phone: data.phone,
          profile: data.profile
            ? {
                district: data.profile.district,
                area: data.profile.area,
                gender: data.profile.gender,
                medium: data.profile.medium,
                education: data.profile.education,
                yearsOfExperience: Number(data.profile.yearsOfExperience) || 0,
                subjects: data.profile.subjects,
                specialization: data.profile.specialization || "",
                teachingLevel: data.profile.teachingLevel,
                availability: data.profile.availability,
                monthlySalary: Number(data.profile.monthlySalary) || 0,
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
    setLoading(true);

    try {
      const response = await fetchWithAuth(
        `http://localhost:8000/teacher/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update teacher");
      }

      setNotification({
        message: "Teacher updated successfully",
        type: "success",
      });
      router.push("/admin-dashboard/teachers");
    } catch (error: any) {
      console.error("Error updating teacher:", error);
      setNotification({
        message: "Failed to update teacher",
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
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />

          <h2 className="text-xl font-semibold mt-8 mb-4">
            Profile Information
          </h2>

          <Input
            label="District"
            name="profile.district"
            value={formData.profile?.district}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Area"
            name="profile.area"
            value={formData.profile?.area}
            onChange={handleInputChange}
            required
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
            required
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
            required
          />

          <Input
            label="Education"
            name="profile.education"
            value={formData.profile?.education}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Years of Experience"
            type="number"
            name="profile.yearsOfExperience"
            value={formData.profile?.yearsOfExperience}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Monthly Salary"
            type="number"
            name="profile.monthlySalary"
            value={formData.profile?.monthlySalary}
            onChange={handleInputChange}
            required
          />

          <div className="flex justify-end space-x-2">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
