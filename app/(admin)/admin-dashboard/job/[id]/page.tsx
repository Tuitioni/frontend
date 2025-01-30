"use client";

import { useEffect, useState } from "react";
import { Post } from "@/types/Post";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/ui/admin/adminCard";
import { Notification } from "@/components/ui/Notification";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetchWithAuth(
          `${process.env.TUITIONI_API}/post/${params.id}`
        );
        const data = await response.json();
        setPost(data);
      } catch (error: any) {
        console.error("Error fetching post:", error);
        setNotification({
          message: "Failed to fetch job post",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id, fetchWithAuth]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job post?")) return;

    try {
      const response = await fetchWithAuth(
        `${process.env.TUITIONI_API}/post/${params.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete post");

      setNotification({
        message: "Job post deleted successfully",
        type: "success",
      });

      router.push("/admin-dashboard/job");
    } catch (error) {
      console.error("Error deleting post:", error);
      setNotification({
        message: "Failed to delete job post",
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        onClick={() => router.push(`/admin-dashboard/job/${params.id}/edit`)}
      >
        Edit
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <AdminCard title="Job Post Details" footer={footer}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {post.firstName} {post.lastName}
            </p>
            <p>
              <strong>District:</strong> {post.district}
            </p>
            <p>
              <strong>Area:</strong> {post.area}
            </p>
            <p>
              <strong>Age:</strong> {post.age}
            </p>
            <p>
              <strong>Medium:</strong> {post.medium}
            </p>
            <p>
              <strong>Level of Study:</strong> {post.levelOfStudy}
            </p>
            <p>
              <strong>School:</strong> {post.school || "N/A"}
            </p>
            <p>
              <strong>College:</strong> {post.college || "N/A"}
            </p>
            <p>
              <strong>University:</strong> {post.university || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Subjects:</strong> {post.subjects.join(", ")}
            </p>
            <p>
              <strong>Gender:</strong> {post.gender}
            </p>
            <p>
              <strong>Salary:</strong> {post.salary}
            </p>
            <p>
              <strong>Number of Days:</strong> {post.numberOfDays}
            </p>
            <p>
              <strong>Duration:</strong> {post.duration}
            </p>
            <p>
              <strong>Tuition Type:</strong> {post.tuitionType}
            </p>
            <p>
              <strong>Class:</strong> {post.class}
            </p>
            <p>
              <strong>Note:</strong> {post.note || "N/A"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
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
