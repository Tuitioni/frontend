"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Report, UpdateReportDto } from "@/types/Report";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Notification } from "@/components/ui/Notification";
import { LoadingSpinnerCenter } from "@/components/ui/LoadingSpinnerCenter";
import { AdminCard } from "@/components/ui/admin/adminCard";

const reportTypes: Report["reportType"][] = [
  "FINANCIAL",
  "USER_ACTIVITY",
  "SYSTEM_HEALTH",
  "OTHER",
];

const EditReportPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { fetchWithAuth } = useAuthFetch();

  const [report, setReport] = useState<Partial<UpdateReportDto>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchReport = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      setError("Report ID is missing.");
      setNotification({ message: "Report ID is missing", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(`/api/admin/report/${id}`);
      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(
          responseBody.message || "Failed to fetch report details"
        );
      }

      const data: Report = responseBody;
      setReport({
        title: data.title,
        content: data.content,
        reportType: data.reportType,
        generatedBy: data.generatedBy,
      });
      setError(null);
    } catch (err: any) {
      console.error("Fetch error:", err);
      const message = err.message || `Failed to load report data for editing.`;
      setError(message);
      setNotification({ message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchWithAuth]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    setError(null);
    setNotification(null);

    const updatePayload: UpdateReportDto = {};
    if (report.title !== undefined) updatePayload.title = report.title;
    if (report.content !== undefined) updatePayload.content = report.content;
    if (report.reportType !== undefined)
      updatePayload.reportType = report.reportType;
    if (report.generatedBy !== undefined)
      updatePayload.generatedBy = report.generatedBy;

    if (Object.keys(updatePayload).length === 0) {
      setNotification({ message: "No changes to save.", type: "success" });
      setIsSubmitting(false);
      router.push(`/admin-dashboard/report/${id}`);
      return;
    }

    try {
      const response = await fetchWithAuth(`/api/admin/report/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.message || "Failed to update report");
      }

      setNotification({
        message: "Report updated successfully!",
        type: "success",
      });
      router.push(`/admin-dashboard/report/${id}`);
    } catch (err: any) {
      console.error("Update error:", err);
      const message = err.message || "Failed to update report.";
      setError(message);
      setNotification({ message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: Report["reportType"]) => {
    setReport((prev) => ({ ...prev, reportType: value }));
  };

  if (isLoading && !Object.keys(report).length) return <LoadingSpinnerCenter />;

  const cardTitle = `Edit Report: ${report.title || id}`;
  const cardFooter = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="editReportForm"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => {
            setNotification(null);
            if (notification.type === "error" && error) setError(null);
          }}
        />
      )}

      <AdminCard title={cardTitle} footer={cardFooter}>
        {error && !notification && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {isLoading && !Object.keys(report).length ? (
          <div className="p-4 text-center">
            <LoadingSpinnerCenter />
          </div>
        ) : Object.keys(report).length === 0 && !isLoading && !error ? (
          <p className="p-4 text-center text-gray-500">
            Report data not found or could not be loaded.
          </p>
        ) : (
          <form
            id="editReportForm"
            onSubmit={handleSubmit}
            className="space-y-6 p-4"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                value={report.title || ""}
                onChange={handleChange}
                className="w-full"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={report.content || ""}
                onChange={handleChange}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="reportType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Report Type
              </label>
              <Select
                value={report.reportType || "OTHER"}
                onValueChange={handleSelectChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {report.generatedBy && (
              <div>
                <label
                  htmlFor="generatedBy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Generated By
                </label>
                <Input
                  id="generatedBy"
                  name="generatedBy"
                  type="text"
                  value={report.generatedBy}
                  onChange={handleChange}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
            )}
          </form>
        )}
      </AdminCard>
    </div>
  );
};

export default EditReportPage;
