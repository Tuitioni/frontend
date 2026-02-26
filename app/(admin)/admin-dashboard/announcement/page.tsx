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
    <div className="flex flex-col items-center p-6">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcement Dashboard</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Announcement</Button>
      </div>

      <div className="w-full flex justify-center">
        <DataTable
          data={tableData}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

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
              <label className="block text-sm font-medium text-gray-700">Content</label>
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
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
