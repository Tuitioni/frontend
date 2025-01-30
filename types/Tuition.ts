import { Student } from "./Student";
import { Teacher } from "./teacher";

export interface Tuition {
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

export interface TuitionPreview {
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

export interface CreateTuitionDto {
  teacherId: string;
  studentId: string;
  fee: number;
  paymentId: string;
}

export interface UpdateTuitionDto {
  teacherId: string;
  studentId: string;
  fee: number;
  paymentId: string;
}
