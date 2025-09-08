"use client";

import { useEffect, useState } from "react";

import { AdminCard } from "@/components/ui/admin/adminCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Notification } from "@/components/ui/Notification";
import { ReportDetail } from "@/types/Report";

export default function ReportDashboardByID({
  params,
}: {
  params: { id: string };
}) {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${process.env.TUITIONI_API}/report/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch report details");
        }

        const data = await response.json();
        setReport(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.id]);

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

  if (!report) {
    return <div>No report found</div>;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      RESOLVED: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Report Details
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report Information */}
        <AdminCard
          title="Report Information"
          className="bg-white shadow-lg rounded-xl lg:col-span-2"
        >
          <div className="space-y-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="text-lg font-semibold text-gray-900">
                {report.title}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p className="text-lg font-semibold text-gray-900">
                {report.subject}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-base text-gray-900 whitespace-pre-wrap">
                {report.description}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status}
              </span>
            </div>
          </div>
        </AdminCard>

        {/* Involved Parties */}
        <AdminCard
          title="Involved Parties"
          className="bg-white shadow-lg rounded-xl"
        >
          <div className="space-y-6">
            {report.student && (
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Student</p>
                <p className="text-lg font-semibold text-gray-900">
                  {report.student.firstName} {report.student.lastName}
                </p>
                <p className="text-sm text-gray-500">{report.student.email}</p>
              </div>
            )}
            {report.teacher && (
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Teacher</p>
                <p className="text-lg font-semibold text-gray-900">
                  {report.teacher.firstName} {report.teacher.lastName}
                </p>
                <p className="text-sm text-gray-500">{report.teacher.email}</p>
              </div>
            )}
            {report.resolver && (
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">Resolver</p>
                <p className="text-lg font-semibold text-gray-900">
                  {report.resolver.name}
                </p>
                <p className="text-sm text-gray-500">{report.resolver.email}</p>
              </div>
            )}
          </div>
        </AdminCard>

        {/* Timestamps */}
        <AdminCard title="Timeline" className="bg-white shadow-lg rounded-xl">
          <div className="space-y-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-base text-gray-900">
                {formatDate(report.createdAt)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-base text-gray-900">
                {formatDate(report.updatedAt)}
              </p>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
