import { NextResponse } from "next/server";
import { Announcement, UpdateAnnouncementDto } from "@/types/Announcement"; // Make sure path is correct

// Mock data - replace with actual DB calls (shared with the other route file, ideally refactored)
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
// Ensure consistent mock data state if running concurrently - ideally use a real DB
let nextId = 3; // Needs synchronization if POST runs here too, better kept separate or use DB

interface Context {
  params: {
    id: string;
  };
}

export async function GET(req: Request, context: Context) {
  try {
    const { id } = context.params;
    // TODO: Add authentication checks
    // const user = await getCurrentUser();
    // if (!user) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // Replace with actual database query
    // const announcement = await db.announcement.findUnique({
    //   where: { id },
    // });
    const announcement = mockAnnouncements.find((a) => a.id === id);

    if (!announcement) {
      return new NextResponse("Announcement not found", { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[ANNOUNCEMENT_GET_BY_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request, context: Context) {
  try {
    const { id } = context.params;
    // TODO: Add authentication and authorization checks
    // const user = await getCurrentUser();
    // if (!user || user.role !== 'ADMIN') {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const body: UpdateAnnouncementDto = await req.json();

    // Replace with actual database update
    // const updatedAnnouncement = await db.announcement.update({
    //   where: { id },
    //   data: body,
    // });
    const index = mockAnnouncements.findIndex((a) => a.id === id);
    if (index === -1) {
      return new NextResponse("Announcement not found", { status: 404 });
    }
    const updatedAnnouncement = {
      ...mockAnnouncements[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    mockAnnouncements[index] = updatedAnnouncement;

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error("[ANNOUNCEMENT_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const { id } = context.params;
    // TODO: Add authentication and authorization checks
    // const user = await getCurrentUser();
    // if (!user || user.role !== 'ADMIN') {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // Replace with actual database deletion
    // await db.announcement.delete({
    //   where: { id },
    // });
    const index = mockAnnouncements.findIndex((a) => a.id === id);
    if (index === -1) {
      return new NextResponse("Announcement not found", { status: 404 });
    }
    mockAnnouncements.splice(index, 1);

    return new NextResponse(null, { status: 204 }); // No content
  } catch (error) {
    console.error("[ANNOUNCEMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
