'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Input } from '@/components/ui/admin/Form';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerCenter } from '@/components/ui/LoadingSpinnerCenter';
import { useToast } from '@/components/ui/use-toast';
import { useAuthFetch } from '@/hooks/useAuthFetch';
import { handleTokenError } from '@/lib/auth/admin';
import { Tuition, UpdateTuitionDto } from '@/types/Tuition';

export default function EditTuitionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetchWithAuth } = useAuthFetch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateTuitionDto>({
    teacherId: '',
    studentId: '',
    fee: 0,
    paymentId: '',
  });

  useEffect(() => {
    async function fetchTuition() {
      try {
        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/tuition/${params.id}`
        );
        const data: Tuition = await response.json();
        setFormData({
          teacherId: data.teacher.id,
          studentId: data.student.id,
          fee: data.fee,
          paymentId: data.paymentId || '',
        });
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

    fetchTuition();
  }, [params.id, fetchWithAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuition/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('jwt expired');
        }
        throw new Error('Failed to update tuition');
      }

      toast({
        title: 'Success',
        description: 'Tuition updated successfully',
      });

      router.push(`/admin-dashboard/tuition/${params.id}`);
    } catch (error: any) {
      handleTokenError(error);
      toast({
        title: 'Error',
        description: 'Failed to update tuition',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <LoadingSpinnerCenter />;
  }

  const footer = (
    <div className="flex gap-2 justify-end">
      <Button type="submit" form="edit-tuition-form">
        Update Tuition
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push(`/admin-dashboard/tuition/${params.id}`)}
      >
        Cancel
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <AdminCard title="Edit Tuition" footer={footer}>
        <form id="edit-tuition-form" onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Teacher ID"
            name="teacherId"
            value={formData.teacherId}
            onChange={(e) => handleChange('teacherId', e.target.value)}
            required
          />

          <Input
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            required
          />

          <Input
            label="Fee"
            name="fee"
            type="number"
            value={formData.fee}
            onChange={(e) => handleChange('fee', parseInt(e.target.value))}
            required
          />

          <Input
            label="Payment ID"
            name="paymentId"
            value={formData.paymentId}
            onChange={(e) => handleChange('paymentId', e.target.value)}
          />
        </form>
      </AdminCard>
    </div>
  );
}
