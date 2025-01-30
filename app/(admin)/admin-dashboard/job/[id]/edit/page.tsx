"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { Notification } from "@/components/ui/Notification";

import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { Input, Select } from "@/components/ui/admin/Form";
import { Post } from "@/types/Post";

enum Medium {
  BANGLA = "BANGLA",
  ENGLISH = "ENGLISH",
  BOTH = "BOTH",
}

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  ANY = "ANY",
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Post | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetchWithAuth(
          `http://localhost:8000/job/${params.id}`
        );
        const data = await response.json();
        setFormData(data);
      } catch (error: any) {
        console.error("Error fetching job post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id, fetchWithAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const response = await fetch(`http://localhost:8000/post/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update post");

      setNotification({
        message: "Job post updated successfully",
        type: "success",
      });

      router.push(`/admin-dashboard/job/${params.id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      setNotification({
        message: "Failed to update job post",
        type: "error",
      });
    }
  };

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev: any) => (prev ? { ...prev, [name]: value } : null));
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  if (!formData) {
    return <div>Post not found</div>;
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button type="submit" form="edit-post-form">
        Update Job Post
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push(`/admin-dashboard/job/${params.id}`)}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <AdminCard title="Edit Job Post" footer={footer}>
        <form id="edit-post-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />

              <Input
                label="District"
                name="district"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
                required
              />

              <Input
                label="Area"
                name="area"
                value={formData.area}
                onChange={(e) => handleChange("area", e.target.value)}
                required
              />

              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", parseInt(e.target.value))}
                required
              />

              <Select
                label="Medium"
                name="medium"
                value={formData.medium}
                onChange={(e) => handleChange("medium", e.target.value)}
                options={Object.values(Medium).map((medium: Medium) => ({
                  value: medium,
                  label: medium,
                }))}
                required
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Level of Study"
                name="levelOfStudy"
                value={formData.levelOfStudy}
                onChange={(e) => handleChange("levelOfStudy", e.target.value)}
                required
              />

              <Input
                label="Subjects (comma-separated)"
                name="subjects"
                value={formData.subjects.join(", ")}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev
                      ? {
                          ...prev,
                          subjects: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        }
                      : null
                  )
                }
                required
              />

              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                options={Object.values(Gender).map((gender: Gender) => ({
                  value: gender,
                  label: gender,
                }))}
                required
              />

              <Input
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  handleChange("salary", parseInt(e.target.value))
                }
                required
              />

              <Input
                label="Number of Days"
                name="numberOfDays"
                type="number"
                value={formData.numberOfDays}
                onChange={(e) =>
                  handleChange("numberOfDays", parseInt(e.target.value))
                }
                required
              />

              <Input
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Tuition Type"
              name="tuitionType"
              value={formData.tuitionType}
              onChange={(e) => handleChange("tuitionType", e.target.value)}
              required
            />

            <Input
              label="Class"
              name="class"
              value={formData.class}
              onChange={(e) => handleChange("class", e.target.value)}
              required
            />

            <Input
              label="Note"
              name="note"
              value={formData.note || ""}
              onChange={(e) => handleChange("note", e.target.value)}
            />
          </div>
        </form>
      </AdminCard>

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
