"use client";

import { useEffect, useState } from "react";

import DataTable from "@/components/ui/admin/dataTable";
import { Input, Select } from "@/components/ui/admin/Form";
import { Modal } from "@/components/ui/admin/Modal";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import { PaymentMethod, PaymentStatus } from "@/types";
import { PaymentPreview } from "@/types/Payment";

export default function PaymentDashboard() {
  const [payments, setPayments] = useState<PaymentPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    status: "",
    teacherId: "",
    paymentMethod: PaymentMethod.BKASH,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentStatus: PaymentStatus.UNPAID,
    transactionId: "",
  });

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${process.env.TUITIONI_API}/payment/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete payment");
      }

      setPayments((prev) => prev.filter((payment) => payment.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${process.env.TUITIONI_API}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPayment),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const data = await response.json();
      setPayments((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewPayment({
        amount: 0,
        status: "",
        teacherId: "",
        paymentMethod: PaymentMethod.BKASH,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentStatus: PaymentStatus.UNPAID,
        transactionId: "",
      });
    } catch (err: any) {
      console.error("Create error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`${process.env.TUITIONI_API}/payment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data = await response.json();
        setPayments(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <Notification
        message={error}
        type="error"
        onClose={() => setError(null)}
      />
    );
  }

  const columns = [
    { key: "teacher", label: "Teacher" },
    { key: "amount", label: "Amount" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "paymentStatus", label: "Status" },
    { key: "paymentDate", label: "Date" },
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Payment"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </>
        }
      >
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
              { value: PaymentMethod.BKASH, label: "Bkash" },
              { value: PaymentMethod.NAGAD, label: "Nagad" },
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
              { value: PaymentStatus.PAID, label: "Paid" },
              { value: PaymentStatus.UNPAID, label: "Unpaid" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
