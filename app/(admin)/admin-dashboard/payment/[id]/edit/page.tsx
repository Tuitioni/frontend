'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Input, Select } from '@/components/ui/admin/Form';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { PaymentMethod, PaymentStatus } from '@/types';
import { PaymentDetail, UpdatePaymentDto } from '@/types/Payment';

interface PaymentEditProps {
  params: { id: string };
}

export default function PaymentEdit({ params }: PaymentEditProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UpdatePaymentDto>({
    amount: 0,
    tuitionId: '',
    status: '',
    teacherId: '',
    paymentMethod: PaymentMethod.BKASH,
    paymentDate: new Date(),
    paymentStatus: PaymentStatus.UNPAID,
    transactionId: '',
  });

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payment');
        }

        const payment: PaymentDetail = await response.json();
        setFormData({
          amount: payment.amount,
          tuitionId: payment.tuitionId,
          status: payment.status,
          teacherId: payment.teacherId,
          paymentMethod: payment.paymentMethod,
          paymentDate: new Date(payment.paymentDate),
          paymentStatus: payment.paymentStatus,
          transactionId: payment.transactionId,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch payment details',
          variant: 'destructive',
        });
      }
    };

    fetchPayment();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment');
      }

      toast({
        title: 'Success',
        description: 'Payment updated successfully',
      });
      router.push('/admin-dashboard/payment');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Input
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
        />

        <Input
          label="Teacher ID"
          name="teacherId"
          value={formData.teacherId}
          onChange={handleInputChange}
        />

        <Select
          label="Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleInputChange}
          options={[
            { value: PaymentMethod.BKASH, label: 'Bkash' },
            { value: PaymentMethod.NAGAD, label: 'Nagad' },
          ]}
        />

        <Input
          label="Transaction ID"
          name="transactionId"
          value={formData.transactionId}
          onChange={handleInputChange}
        />

        <Input
          type="date"
          label="Payment Date"
          name="paymentDate"
          value={formData.paymentDate.toISOString().split('T')[0]}
          onChange={handleInputChange}
        />

        <Select
          label="Payment Status"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleInputChange}
          options={[
            { value: PaymentStatus.PAID, label: 'Paid' },
            { value: PaymentStatus.UNPAID, label: 'Unpaid' },
          ]}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : 'Update Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
