'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/admin/dataTable';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { TeacherPreview } from '@/types/teacher';

export default function TeacherDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<TeacherPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/teacher`);
        const data = await response.json();
        setTeachers(data);
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

    fetchTeachers();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/teacher/${id}`, {
        method: 'DELETE',
      });

      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'medium', label: 'Medium' },
    { key: 'gender', label: 'Gender' },
    { key: 'location', label: 'Location' },
  ];

  const tableData = teachers.map((teacher) => ({
    id: teacher.id,
    name: `${teacher.firstName} ${teacher.lastName}`,
    medium: teacher.profile?.medium || 'N/A',
    gender: teacher.profile?.gender || 'N/A',
    location: teacher.profile ? `${teacher.profile.area}, ${teacher.profile.district}` : 'N/A',
  }));

  const handleView = (id: string) => {
    router.push(`/admin-dashboard/teacher/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/teacher/${id}/edit`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Teacher Dashboard</h1>
      <div className="w-full flex justify-center">
        <DataTable
          data={tableData}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
