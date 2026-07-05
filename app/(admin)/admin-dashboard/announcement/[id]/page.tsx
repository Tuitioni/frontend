'use client';

import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/formatters';
import { AnnouncementDetail } from '@/types/Announcement';

export default function AnnouncementDashboardByID({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [announcement, setAnnouncement] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          throw new Error('Failed to fetch announcement details');
        }

        const data = await response.json();
        setAnnouncement(data);
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!announcement) {
    return (
      <EmptyState
        title="No announcement found"
        description="The announcement you are looking for does not exist or has been removed."
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Announcement Details</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full details for this announcement.</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* Announcement Content */}
        <AdminCard title="Announcement">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Title
              </p>
              <p className="mt-1 text-lg font-semibold">{announcement.title}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Content
              </p>
              <p className="mt-1 whitespace-pre-wrap text-foreground">{announcement.content}</p>
            </div>
          </div>
        </AdminCard>

        {/* Admin Information */}
        <AdminCard title="Created By">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Admin Name
              </p>
              <p className="mt-1 text-lg font-semibold">{announcement.admin.name}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Admin Email
              </p>
              <p className="mt-1 text-lg font-semibold">{announcement.admin.email}</p>
            </div>
          </div>
        </AdminCard>

        {/* Timestamps */}
        <AdminCard title="Timeline">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {formatDate(announcement.createdAt)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last Updated
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {formatDate(announcement.updatedAt)}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
