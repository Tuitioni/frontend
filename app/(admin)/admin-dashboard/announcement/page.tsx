'use client';

import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/admin/DataTable';
import { Input } from '@/components/ui/admin/Form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { AnnouncementPreview } from '@/types/Announcement';

export default function AnnouncementDashboard() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<AnnouncementPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcement/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete announcement');
      }

      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcement/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newAnnouncement,
          adminId: jwtDecode<{ sub: string }>(token).sub,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }

      const data = await response.json();
      setAnnouncements((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewAnnouncement({ title: '', content: '' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcement`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }

        const data = await response.json();
        setAnnouncements(data);
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

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'content', label: 'Content' },
    { key: 'admin', label: 'Created By' },
    { key: 'createdAt', label: 'Created At' },
  ];

  const tableData = announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    admin: announcement.admin.name,
    createdAt: new Date(announcement.createdAt).toLocaleDateString(),
  }));

  const handleView = (id: string) => {
    window.location.href = `/admin-dashboard/announcement/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin-dashboard/announcement/${id}/edit`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Announcements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, edit, and manage all announcements.
          </p>
        </div>
        <Button className="rounded-pill" onClick={() => setIsModalOpen(true)}>
          Create Announcement
        </Button>
      </div>

      <DataTable
        data={tableData}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Title"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              maxLength={20}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-foreground">Content</label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) =>
                  setNewAnnouncement((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                maxLength={50}
                rows={3}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-soft-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
