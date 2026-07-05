'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input, Select } from '@/components/ui/admin/Form';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { Post } from '@/types/Post';

enum Medium {
  BANGLA = 'BANGLA',
  ENGLISH = 'ENGLISH',
  BOTH = 'BOTH',
}

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  ANY = 'ANY',
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/job/${params.id}`);
        const data = await response.json();
        setFormData(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update post');

      toast({
        title: 'Success',
        description: 'Job post updated successfully',
      });

      router.push(`/admin-dashboard/job/${params.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job post',
        variant: 'destructive',
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
    return (
      <EmptyState
        title="Post not found"
        description="The job post you are looking for does not exist or has been removed."
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Job</h1>
        <p className="mt-1 text-sm text-muted-foreground">Update the details of this job post.</p>
      </div>
      <form
        id="edit-post-form"
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft-sm"
      >
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required
        />

        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required
        />

        <Input
          label="District"
          name="district"
          value={formData.district}
          onChange={(e) => handleChange('district', e.target.value)}
          required
        />

        <Input
          label="Area"
          name="area"
          value={formData.area}
          onChange={(e) => handleChange('area', e.target.value)}
          required
        />

        <Input
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={(e) => handleChange('age', parseInt(e.target.value))}
          required
        />

        <Select
          label="Medium"
          name="medium"
          value={formData.medium}
          onChange={(e) => handleChange('medium', e.target.value)}
          options={Object.values(Medium).map((medium: Medium) => ({
            value: medium,
            label: medium,
          }))}
          required
        />

        <h2 className="mb-2 mt-8 border-t border-border pt-6 font-display text-lg font-bold">
          Tuition Details
        </h2>

        <Input
          label="Level of Study"
          name="levelOfStudy"
          value={formData.levelOfStudy}
          onChange={(e) => handleChange('levelOfStudy', e.target.value)}
          required
        />

        <Input
          label="Subjects (comma-separated)"
          name="subjects"
          value={formData.subjects.join(', ')}
          onChange={(e) =>
            setFormData((prev) =>
              prev
                ? {
                    ...prev,
                    subjects: e.target.value.split(',').map((s) => s.trim()),
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
          onChange={(e) => handleChange('gender', e.target.value)}
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
          onChange={(e) => handleChange('salary', parseInt(e.target.value))}
          required
        />

        <Input
          label="Number of Days"
          name="numberOfDays"
          type="number"
          value={formData.numberOfDays}
          onChange={(e) => handleChange('numberOfDays', parseInt(e.target.value))}
          required
        />

        <Input
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          required
        />

        <Input
          label="Tuition Type"
          name="tuitionType"
          value={formData.tuitionType}
          onChange={(e) => handleChange('tuitionType', e.target.value)}
          required
        />

        <Input
          label="Class"
          name="class"
          value={formData.class}
          onChange={(e) => handleChange('class', e.target.value)}
          required
        />

        <Input
          label="Note"
          name="note"
          value={formData.note || ''}
          onChange={(e) => handleChange('note', e.target.value)}
        />

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-pill"
            onClick={() => router.push(`/admin-dashboard/job/${params.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" className="rounded-pill">
            Update Job Post
          </Button>
        </div>
      </form>
    </div>
  );
}
