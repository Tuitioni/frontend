import { NextRequest, NextResponse } from "next/server";
import { Report, UpdateReportDto } from "@/types/Report";

// This would typically interact with the same data store as in app/api/admin/report/route.ts
// For simplicity, we'll re-declare and manage it here.
// In a real app, use a shared service or database connection.
let reports: Report[] = [
  {
    id: "1",
    title: "Monthly Financial Summary - Jan 2024",
    content:
      "Detailed breakdown of income and expenses for January 2024. Overall profitable month.",
    generatedBy: "AdminUser1",
    reportType: "FINANCIAL",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "User Activity Report - Week 5",
    content:
      "Summary of user logins, registrations, and key activities from last week.",
    generatedBy: "AdminUser2",
    reportType: "USER_ACTIVITY",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "System Health Check - Feb 15, 2024",
    content:
      "All systems operational. Minor latency spikes observed on DB server 2.",
    generatedBy: "SystemDaemon",
    reportType: "SYSTEM_HEALTH",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface Params {
  params: { id: string };
}

// GET /api/admin/report/[id] - Get a specific report
export async function GET(req: NextRequest, { params }: Params) {
  // Add authorization logic here
  try {
    const report = reports.find((r) => r.id === params.id);
    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error(`Error fetching report ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error fetching report" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/report/[id] - Update a report
export async function PATCH(req: NextRequest, { params }: Params) {
  // Add authorization logic here
  try {
    const body = (await req.json()) as UpdateReportDto;
    const reportIndex = reports.findIndex((r) => r.id === params.id);

    if (reportIndex === -1) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    const updatedReport = {
      ...reports[reportIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    reports[reportIndex] = updatedReport;

    // In a real app, you'd update this in your database
    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error(`Error updating report ${params.id}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error updating report", error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/report/[id] - Delete a report
export async function DELETE(req: NextRequest, { params }: Params) {
  // Add authorization logic here
  try {
    const reportIndex = reports.findIndex((r) => r.id === params.id);

    if (reportIndex === -1) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    reports.splice(reportIndex, 1);
    // In a real app, you'd delete this from your database
    return NextResponse.json(
      { message: "Report deleted successfully" },
      { status: 200 }
    ); // or 204 No Content
  } catch (error) {
    console.error(`Error deleting report ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error deleting report" },
      { status: 500 }
    );
  }
}
