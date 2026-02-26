'use client';

import { useEffect, useState } from 'react';

import { AdminCard } from '@/components/ui/admin/AdminCard';
import { Badge } from '@/components/ui/badge';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Payment Details</h1>
      <div className="grid grid-cols-1 gap-8">
        {/* Payment Information */}
        <AdminCard title="Payment Information" className="bg-white shadow-lg rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="text-xl font-semibold text-gray-900">৳{payment.amount}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge
                variant={payment.paymentStatus === 'PAID' ? 'success' : 'destructive'}
                className="mt-1 w-fit"
              >
                {payment.paymentStatus}
              </Badge>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="text-lg font-semibold text-gray-900">{payment.paymentMethod}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Transaction ID</p>
              <p className="text-lg font-semibold text-gray-900">{payment.transactionId}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Payment Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(payment.paymentDate)}
              </p>
            </div>
          </div>
        </AdminCard>

        {/* Teacher Information */}
        <AdminCard title="Teacher Information" className="bg-white shadow-lg rounded-xl">
          <div className="space-y-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {payment.teacher.firstName} {payment.teacher.lastName}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base text-gray-900">{payment.teacher.email}</p>
            </div>
          </div>
        </AdminCard>

        {/* Timestamps */}
        <AdminCard title="Timeline" className="bg-white shadow-lg rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-base text-gray-900">{formatDate(payment.createdAt)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-base text-gray-900">{formatDate(payment.updatedAt)}</p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
