export interface ReportPreview {
  id: string;
  title: string;
  subject: string;
  status: string;
  createdAt: Date;
  student?: {
    firstName: string;
    lastName: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
}

export interface ReportDetail {
  id: string;
  title: string;
  subject: string;
  description: string;
  status: string;
  studentId?: string;
  teacherId?: string;
  resolverId?: string;
  createdAt: Date;
  updatedAt: Date;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  resolver?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UpdateReportDto {
  title?: string;
  subject?: string;
  description?: string;
  status?: string;
  studentId?: string;
  teacherId?: string;
  resolverId?: string;
}
