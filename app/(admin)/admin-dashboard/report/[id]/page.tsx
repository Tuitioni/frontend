'use client';

import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/formatters';
import { ReportDetail } from '@/types/Report';

export default function ReportDashboardByID({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch report details');
        }

        const data = await response.json();
        setReport(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!report) {
    return (
      <EmptyState
        title="No report found"
        description="The report you're looking for doesn't exist or has been removed."
      />
    );
  }

  const statusVariantMap: Record<string, 'warning' | 'info' | 'success' | 'secondary'> = {
    PENDING: 'warning',
    IN_PROGRESS: 'info',
    RESOLVED: 'success',
    CLOSED: 'secondary',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Report Details</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full details for {report.title}.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Report Information */}
        <AdminCard title="Report Information" className="lg:col-span-2">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Title
              </p>
              <p className="mt-1 text-lg font-semibold">{report.title}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subject
              </p>
              <p className="mt-1 text-lg font-semibold">{report.subject}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="mt-1 whitespace-pre-wrap text-foreground">{report.description}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <Badge
                variant={statusVariantMap[report.status] || 'secondary'}
                className="mt-1 w-fit"
              >
                {report.status}
              </Badge>
            </div>
          </div>
        </AdminCard>

        {/* Involved Parties */}
        <AdminCard title="Involved Parties">
          <div className="space-y-5">
            {report.student && (
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Student
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {report.student.firstName} {report.student.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{report.student.email}</p>
              </div>
            )}
            {report.teacher && (
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Teacher
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {report.teacher.firstName} {report.teacher.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{report.teacher.email}</p>
              </div>
            )}
            {report.resolver && (
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Resolver
                </p>
                <p className="mt-1 text-lg font-semibold">{report.resolver.name}</p>
                <p className="text-sm text-muted-foreground">{report.resolver.email}</p>
              </div>
            )}
          </div>
        </AdminCard>

        {/* Timestamps */}
        <AdminCard title="Timeline">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{formatDate(report.createdAt)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last Updated
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{formatDate(report.updatedAt)}</p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
