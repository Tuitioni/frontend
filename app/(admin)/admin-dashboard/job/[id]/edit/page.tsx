'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
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

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button type="submit" form="edit-post-form">
        Update Job Post
      </Button>
      <Button variant="outline" onClick={() => router.push(`/admin-dashboard/job/${params.id}`)}>
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
            </div>

            <div className="space-y-4">
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
            </div>
          </div>

          <div className="space-y-4">
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
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
