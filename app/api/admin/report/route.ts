import { NextRequest, NextResponse } from "next/server";
import { Report, CreateReportDto } from "@/types/Report";

// Dummy data store
let reports: Report[] = [
  {
    id: "1",
    title: "Monthly Financial Summary - Jan 2024",
    content:
      "Detailed breakdown of income and expenses for January 2024. Overall profitable month.",
    generatedBy: "AdminUser1",
    reportType: "FINANCIAL",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "User Activity Report - Week 5",
    content:
      "Summary of user logins, registrations, and key activities from last week.",
    generatedBy: "AdminUser2",
    reportType: "USER_ACTIVITY",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "System Health Check - Feb 15, 2024",
    content:
      "All systems operational. Minor latency spikes observed on DB server 2.",
    generatedBy: "SystemDaemon",
    reportType: "SYSTEM_HEALTH",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// GET /api/admin/report - List all reports
export async function GET(req: NextRequest) {
  // In a real app, you'd fetch this from your database
  // Add authorization logic here if needed
  try {
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { message: "Error fetching reports" },
      { status: 500 }
    );
  }
}

// POST /api/admin/report - Create a new report
export async function POST(req: NextRequest) {
  // Add authorization logic here
  try {
    const body = (await req.json()) as CreateReportDto;

    if (!body.title || !body.content || !body.generatedBy || !body.reportType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReport: Report = {
      id: String(reports.length + 1), // Simple ID generation for dummy data
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reports.push(newReport);
    // In a real app, you'd save this to your database
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Error creating report", error: errorMessage },
      { status: 500 }
    );
  }
}
