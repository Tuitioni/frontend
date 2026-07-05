'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/admin/DataTable';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { Post } from '@/types/Post';

export default function PostPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job post?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error: any) {
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

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'district', label: 'District' },
    { key: 'class', label: 'Class' },
    { key: 'subjects', label: 'Subjects' },
    { key: 'salary', label: 'Salary' },
  ];

  const tableData = posts.map((post) => ({
    id: post.id,
    name: `${post.firstName} ${post.lastName}`,
    district: post.district,
    class: post.class,
    subjects: post.subjects.join(', '),
    salary: post.salary,
  }));

  const handleView = (id: string) => {
    window.location.href = `/admin-dashboard/job/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin-dashboard/job/${id}/edit`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">View, edit, and manage all job posts.</p>
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
