"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import { TeacherDetail, UpdateTeacherDto } from "@/types/Teacher";
import { Gender, Medium } from "@/types";

interface TeacherEditProps {
  params: { id: string };
}

export default function TeacherEdit({ params }: TeacherEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
        const token = localStorage.getItem("admin_token");
        console.log(token);

        const response = await fetch(
          `http://localhost:8000/teacher/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch teacher");
        }

        const teacher: TeacherDetail = await response.json();

        setFormData({
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          location: teacher.location,
          phone: teacher.phone,
          profile: teacher.profile
            ? {
                district: teacher.profile.district,
                area: teacher.profile.area,
                gender: teacher.profile.gender,
                medium: teacher.profile.medium,
                education: teacher.profile.education,
                yearsOfExperience:
                  Number(teacher.profile.yearsOfExperience) || 0,
                subjects: teacher.profile.subjects,
                specialization: teacher.profile.specialization || "",
                teachingLevel: teacher.profile.teachingLevel,
                availability: teacher.profile.availability,
                monthlySalary: Number(teacher.profile.monthlySalary) || 0,
              }
            : undefined,
        });
      } catch (error) {
        setNotification({
          message: "Failed to fetch teacher details",
          type: "error",
        });
      }
    };

    fetchTeacher();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      console.log(token);

      // Ensure numeric fields are numbers before sending
      const dataToSend = {
        ...formData,
        profile: formData.profile
          ? {
              ...formData.profile,
              yearsOfExperience: Number(formData.profile.yearsOfExperience),
              monthlySalary: Number(formData.profile.monthlySalary),
              age: Number(formData.profile.age),
            }
          : undefined,
      };

      const response = await fetch(
        `http://localhost:8000/teacher/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update teacher");
      }

      setNotification({
        message: "Teacher updated successfully",
        type: "success",
      });
      router.push("/dashboard/teachers");
    } catch (error) {
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Teacher</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
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
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />

        <h2 className="text-xl font-semibold mt-8 mb-4">Profile Information</h2>

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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : "Update Teacher"}
          </Button>
        </div>
      </form>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
