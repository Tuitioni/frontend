'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { Post } from '@/types/Post';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/post/${params.id}`
        );
        const data = await response.json();
        setPost(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to fetch job post',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id, fetchWithAuth]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job post?')) return;

    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/post/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      toast({
        title: 'Success',
        description: 'Job post deleted successfully',
      });

      router.push('/admin-dashboard/job');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete job post',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!post) {
    return (
      <EmptyState
        title="Post not found"
        description="The job post you are looking for does not exist or has been removed."
      />
    );
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <Button
        variant="outline"
        className="rounded-pill"
        onClick={() => router.push(`/admin-dashboard/job/${params.id}/edit`)}
      >
        Edit
      </Button>
      <Button variant="destructive" className="rounded-pill" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Job Details</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full details for the job post by {post.firstName} {post.lastName}.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Applicant Information */}
        <AdminCard title="Applicant Information">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-lg font-semibold">
                {post.firstName} {post.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Gender
              </p>
              <p className="mt-1 text-lg font-semibold">{post.gender}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Age
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{post.age}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Medium
              </p>
              <p className="mt-1 text-lg font-semibold">{post.medium}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Level of Study
              </p>
              <p className="mt-1 text-lg font-semibold">{post.levelOfStudy}</p>
            </div>
          </div>
        </AdminCard>

        {/* Tuition Details */}
        <AdminCard title="Tuition Details">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subjects
              </p>
              <p className="mt-1 text-lg font-semibold">{post.subjects.join(', ')}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Salary
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{post.salary}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Number of Days
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{post.numberOfDays}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Duration
              </p>
              <p className="mt-1 text-lg font-semibold">{post.duration}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tuition Type
              </p>
              <p className="mt-1 text-lg font-semibold">{post.tuitionType}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Class
              </p>
              <p className="mt-1 text-lg font-semibold">{post.class}</p>
            </div>
          </div>
        </AdminCard>

        {/* Location & Education */}
        <AdminCard title="Location & Education" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </p>
              <p className="mt-1 text-lg font-semibold">
                {post.area}, {post.district}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                School
              </p>
              <p className="mt-1 text-lg font-semibold">{post.school || 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                College
              </p>
              <p className="mt-1 text-lg font-semibold">{post.college || 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                University
              </p>
              <p className="mt-1 text-lg font-semibold">{post.university || 'N/A'}</p>
            </div>
          </div>
        </AdminCard>

        {/* Additional Details */}
        <AdminCard title="Additional Details" footer={footer} className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Note
              </p>
              <p className="mt-1 text-lg font-semibold">{post.note || 'N/A'}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Updated At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {new Date(post.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
