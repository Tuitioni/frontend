import { Student } from "./Student";
import { Teacher } from "./teacher";

export interface Hire {
  id: string;
  subject: string;
  level: string;
  status: string;
  student: Student;
  teacher: Teacher;
  fee: number;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HirePreview {
  id: string;
  subject: string;
  level: string;
  status: string;
  student?: {
    firstName: string;
    lastName: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export interface CreateHireDto {
  teacherId: string;
  studentId: string;
  fee: number;
  paymentId: string;
}

export interface UpdateHireDto {
  teacherId: string;
  studentId: string;
  fee: number;
  paymentId: string;
}
