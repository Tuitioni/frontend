'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/admin/DataTable';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { StudentPreview } from '@/types/Student';

export default function StudentDashboard() {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/student`);
        const data = await response.json();
        setStudents(data);
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

    fetchStudents();
  }, [fetchWithAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/student/${id}`, {
        method: 'DELETE',
      });

      setStudents((prev) => prev.filter((student) => student.id !== id));
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
    { key: 'levelOfStudy', label: 'Level of Study' },
    { key: 'location', label: 'Location' },
  ];

  const tableData = students.map((student) => ({
    id: student.id,
    name: `${student.firstName} ${student.lastName}`,
    medium: student.profile?.medium || 'N/A',
    levelOfStudy: student.profile?.levelOfStudy || 'N/A',
    location: student.profile ? `${student.profile.area}, ${student.profile.district}` : 'N/A',
  }));

  const handleView = (id: string) => {
    router.push(`/admin-dashboard/student/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin-dashboard/student/${id}/edit`);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
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
