export interface Report {
  id: string;
  title: string;
  content: string;
  generatedBy: string; // User ID or name
  reportType: "FINANCIAL" | "USER_ACTIVITY" | "SYSTEM_HEALTH" | "OTHER";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateReportDto {
  title: string;
  content: string;
  generatedBy: string; // Should ideally be taken from authenticated user on backend
  reportType: "FINANCIAL" | "USER_ACTIVITY" | "SYSTEM_HEALTH" | "OTHER";
}

export interface UpdateReportDto extends Partial<CreateReportDto> {}
