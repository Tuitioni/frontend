'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Input, Select } from '@/components/ui/admin/Form';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { ReportDetail, UpdateReportDto } from '@/types/Report';

interface ReportEditProps {
  params: { id: string };
}

export default function ReportEdit({ params }: ReportEditProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UpdateReportDto>({
    title: '',
    subject: '',
    description: '',
    status: 'pending',
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const report: ReportDetail = await response.json();
        setFormData({
          title: report.title,
          subject: report.subject,
          description: report.description,
          status: report.status.toLowerCase(),
          studentId: report.studentId,
          teacherId: report.teacherId,
          resolverId: report.resolverId,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch report details',
          variant: 'destructive',
        });
      }
    };

    fetchReport();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update report');
      }

      toast({
        title: 'Success',
        description: 'Report updated successfully',
      });
      router.push('/admin-dashboard/report');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update report',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Edit Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the report&apos;s details and status.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft-sm"
      >
        <Input label="Title" name="title" value={formData.title} onChange={handleInputChange} />
        <Input
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-foreground">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'resolved', label: 'Resolved' },
          ]}
        />

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
            {loading ? <LoadingSpinner size="sm" /> : 'Update Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}
