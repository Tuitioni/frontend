"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types/Post";
import DataTable from "@/components/ui/admin/dataTable";
import { Notification } from "@/components/ui/Notification";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.TUITIONI_API}/post`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job post?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.TUITIONI_API}/post/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setError(null);
    } catch (error: any) {
      console.error("Error deleting post:", error);
      setError("Failed to delete job post");
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <Notification
        message={error}
        type="error"
        onClose={() => setError(null)}
      />
    );
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "district", label: "District" },
    { key: "class", label: "Class" },
    { key: "subjects", label: "Subjects" },
    { key: "salary", label: "Salary" },
  ];

  const tableData = posts.map((post) => ({
    id: post.id,
    name: `${post.firstName} ${post.lastName}`,
    district: post.district,
    class: post.class,
    subjects: post.subjects.join(", "),
    salary: post.salary,
  }));

  const handleView = (id: string) => {
    window.location.href = `/admin-dashboard/job/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin-dashboard/job/${id}/edit`;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Posts</h1>
      </div>

      <DataTable
        data={tableData}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
