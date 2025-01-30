"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, Select } from "@/components/ui/admin/Form";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import { StudentDetail, UpdateStudentDto } from "@/types/Student";
import { Gender, Medium } from "@/types";

interface StudentEditProps {
  params: { id: string };
}

export default function StudentEdit({ params }: StudentEditProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<UpdateStudentDto>({
    firstName: "",
    lastName: "",
    email: "",
    profile: {
      district: "",
      area: "",
      gender: Gender.MALE,
      age: 18,
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
        const token = localStorage.getItem("admin_token");
        const response = await fetch(
          `${process.env.TUITIONI_API}/student/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student");
        }

        const student: StudentDetail = await response.json();
        setFormData({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          profile: student.profile
            ? {
                district: student.profile.district,
                area: student.profile.area,
                gender: student.profile.gender,
                age: student.profile.age,
                medium: student.profile.medium,
                levelOfStudy: student.profile.levelOfStudy,
                school: student.profile.school,
                college: student.profile.college,
                university: student.profile.university,
                subjects: student.profile.subjects,
              }
            : undefined,
        });
      } catch (error) {
        setNotification({
          message: "Failed to fetch student details",
          type: "error",
        });
      }
    };

    fetchStudent();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${process.env.TUITIONI_API}/student/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      setNotification({
        message: "Student updated successfully",
        type: "success",
      });
      router.push("/admin-dashboard/students");
    } catch (error) {
      setNotification({
        message: "Failed to update student",
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
    const numericFields = ["profile.age"];

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
      <h1 className="text-2xl font-bold mb-6">Edit Student</h1>
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
          label="Age"
          type="number"
          name="profile.age"
          value={formData.profile?.age}
          onChange={handleInputChange}
        />

        <Input
          label="Level of Study"
          name="profile.levelOfStudy"
          value={formData.profile?.levelOfStudy}
          onChange={handleInputChange}
        />

        <Input
          label="School"
          name="profile.school"
          value={formData.profile?.school}
          onChange={handleInputChange}
        />

        <Input
          label="College"
          name="profile.college"
          value={formData.profile?.college}
          onChange={handleInputChange}
        />

        <Input
          label="University"
          name="profile.university"
          value={formData.profile?.university}
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
            {loading ? <LoadingSpinner size="sm" /> : "Update Student"}
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
