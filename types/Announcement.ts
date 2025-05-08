export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  targetAudience: "ALL" | "STUDENTS" | "TEACHERS"; // Example target audience
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  targetAudience: "ALL" | "STUDENTS" | "TEACHERS";
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {}
