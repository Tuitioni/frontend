import { NextRequest, NextResponse } from "next/server";
import { Announcement, CreateAnnouncementDto } from "@/types/Announcement"; // Make sure path is correct

// Mock data for demonstration - replace with actual DB calls
let mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome New Tutors!",
    content: "A warm welcome to all the new tutors joining our platform.",
    targetAudience: "TEACHERS",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Platform Maintenance",
    content: "Scheduled maintenance on Sunday from 2 AM to 4 AM.",
    targetAudience: "ALL",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];
let nextId = 3;

export async function GET(req: NextRequest) {
  try {
    // TODO: Add authentication and authorization checks
    // const user = await getCurrentUser();
    // if (!user || user.role !== 'ADMIN') {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // Replace with actual database query
    // const announcements = await db.announcement.findMany({
    //   orderBy: { createdAt: 'desc' },
    // });
    const announcements = mockAnnouncements.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("[ANNOUNCEMENT_GET]", error);
    // Updated error response
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // TODO: Add authentication and authorization checks
    // const user = await getCurrentUser();
    // if (!user || user.role !== 'ADMIN') {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body: CreateAnnouncementDto = await req.json();
    const { title, content, targetAudience } = body;

    if (!title || !content || !targetAudience) {
      // Updated error response
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Replace with actual database creation
    // const newAnnouncement = await db.announcement.create({
    //   data: {
    //     title,
    //     content,
    //     targetAudience,
    //     // adminId: user.id // Link to the admin who created it
    //   },
    // });
    const newAnnouncement: Announcement = {
      id: String(nextId++),
      title,
      content,
      targetAudience,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // adminId: user.id // TODO: Uncomment if user.id is available and needed
    };
    mockAnnouncements.push(newAnnouncement);

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("[ANNOUNCEMENT_POST]", error);
    // Updated error response
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
