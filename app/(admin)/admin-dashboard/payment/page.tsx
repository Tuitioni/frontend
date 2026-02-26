'use client';

import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/admin/DataTable';
import { Input, Select } from '@/components/ui/admin/Form';
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
import { PaymentMethod, PaymentStatus } from '@/types';
import { PaymentPreview } from '@/types/Payment';

export default function PaymentDashboard() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    status: '',
    teacherId: '',
    paymentMethod: PaymentMethod.BKASH,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentStatus: PaymentStatus.UNPAID,
    transactionId: '',
  });

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }

      setPayments((prev) => prev.filter((payment) => payment.id !== id));
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPayment),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const data = await response.json();
      setPayments((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewPayment({
        amount: 0,
        status: '',
        teacherId: '',
        paymentMethod: PaymentMethod.BKASH,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentStatus: PaymentStatus.UNPAID,
        transactionId: '',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }

        const data = await response.json();
        setPayments(data);
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

    fetchPayments();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const columns = [
    { key: 'teacher', label: 'Teacher' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'paymentStatus', label: 'Status' },
    { key: 'paymentDate', label: 'Date' },
  ];

  const tableData = payments.map((payment) => ({
    id: payment.id,
    teacher: `${payment.teacher.firstName} ${payment.teacher.lastName}`,
    amount: `৳${payment.amount}`,
    paymentMethod: payment.paymentMethod,
    paymentStatus: payment.paymentStatus,
    paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
  }));

  const handleView = (id: string) => {
    window.location.href = `/admin-dashboard/payment/${id}`;
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin-dashboard/payment/${id}/edit`;
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Dashboard</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Payment</Button>
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
            <DialogTitle>Create New Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Amount"
              type="number"
              value={newPayment.amount}
              onChange={(e) =>
                setNewPayment((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
            />
            <Input
              label="Teacher ID"
              value={newPayment.teacherId}
              onChange={(e) =>
                setNewPayment((prev) => ({
                  ...prev,
                  teacherId: e.target.value,
                }))
              }
            />
            <Select
              label="Payment Method"
              value={newPayment.paymentMethod}
              onChange={(e) =>
                setNewPayment((prev) => ({
                  ...prev,
                  paymentMethod: e.target.value as PaymentMethod,
                }))
              }
              options={[
                { value: PaymentMethod.BKASH, label: 'Bkash' },
                { value: PaymentMethod.NAGAD, label: 'Nagad' },
              ]}
            />
            <Input
              label="Transaction ID"
              value={newPayment.transactionId}
              onChange={(e) =>
                setNewPayment((prev) => ({
                  ...prev,
                  transactionId: e.target.value,
                }))
              }
            />
            <Input
              type="date"
              label="Payment Date"
              value={newPayment.paymentDate}
              onChange={(e) =>
                setNewPayment((prev) => ({
                  ...prev,
                  paymentDate: e.target.value,
                }))
              }
            />
            <Select
              label="Payment Status"
              value={newPayment.paymentStatus}
              onChange={(e) =>
                setNewPayment((prev) => ({
                  ...prev,
                  paymentStatus: e.target.value as PaymentStatus,
                }))
              }
              options={[
                { value: PaymentStatus.PAID, label: 'Paid' },
                { value: PaymentStatus.UNPAID, label: 'Unpaid' },
              ]}
            />
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
