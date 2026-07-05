'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/admin/Form';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { AnnouncementDetail, UpdateAnnouncementDto } from '@/types/Announcement';

interface AnnouncementEditProps {
  params: { id: string };
}

export default function AnnouncementEdit({ params }: AnnouncementEditProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UpdateAnnouncementDto>({
    title: '',
    content: '',
  });

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/announcement/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch announcement');
        }

        const announcement: AnnouncementDetail = await response.json();
        setFormData({
          title: announcement.title,
          content: announcement.content,
          adminId: announcement.adminId,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch announcement details',
          variant: 'destructive',
        });
      }
    };

    fetchAnnouncement();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcement/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update announcement');
      }

      toast({
        title: 'Success',
        description: 'Announcement updated successfully',
      });
      router.push('/admin-dashboard/announcement');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update announcement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Announcement</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the announcement&apos;s title and content.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft-sm"
      >
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          maxLength={20}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            maxLength={50}
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-soft-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-pill"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="rounded-pill" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : 'Update Announcement'}
          </Button>
        </div>
      </form>
    </div>
  );
}
