'use client';

import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/formatters';
import { PaymentDetail } from '@/types/Payment';

export default function PaymentDashboardByID({ params }: { params: { id: string } }) {
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment details');
        }

        const data = await response.json();
        setPayment(data);
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!payment) {
    return (
      <EmptyState
        title="No payment found"
        description="The payment record you're looking for doesn't exist or has been removed."
      />
    );
  }

  const statusPillClass = (status: string) => {
    const base = 'inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-medium';
    if (status === 'PAID' || status === 'COMPLETED') return `${base} bg-success/10 text-success`;
    if (status === 'FAILED') return `${base} bg-error/10 text-error`;
    return `${base} bg-warning/10 text-warning`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Payment Details</h1>
        <p className="mt-1 text-sm text-muted-foreground">Full details for this payment record.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Information */}
        <AdminCard title="Payment Information" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Amount
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular">৳{payment.amount}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </p>
              <span className={`mt-2 w-fit ${statusPillClass(payment.paymentStatus)}`}>
                {payment.paymentStatus}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Payment Method
              </p>
              <p className="mt-1 text-lg font-semibold">{payment.paymentMethod}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Transaction ID
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{payment.transactionId}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Payment Date
              </p>
              <p className="mt-1 text-lg font-semibold tabular">
                {formatDate(payment.paymentDate)}
              </p>
            </div>
          </div>
        </AdminCard>

        {/* Teacher Information */}
        <AdminCard title="Teacher Information">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-lg font-semibold">
                {payment.teacher.firstName} {payment.teacher.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-lg font-semibold">{payment.teacher.email}</p>
            </div>
          </div>
        </AdminCard>

        {/* Timestamps */}
        <AdminCard title="Timeline">
          <div className="space-y-5">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created At
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{formatDate(payment.createdAt)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last Updated
              </p>
              <p className="mt-1 text-lg font-semibold tabular">{formatDate(payment.updatedAt)}</p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
