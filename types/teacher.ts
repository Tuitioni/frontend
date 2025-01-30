import { Gender, Medium } from "./index";

export interface TeacherPreview {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  profile: {
    district: string;
    area: string;
    gender: Gender;
    medium: Medium;
  };
}

export interface TeacherDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    id: string;
    district: string;
    area: string;
    gender: Gender;
    age: number;
    medium: Medium;
    education: string;
    yearsOfExperience: number;
    subjects: string[];
    specialization: string | null;
    teachingLevel: string;
    availability: string;
    monthlySalary: number;
  };
}

export interface UpdateTeacherProfileDto {
  district?: string;
  area?: string;
  gender?: Gender;
  age?: number;
  medium?: Medium;
  education?: string;
  yearsOfExperience?: number;
  subjects?: string[];
  specialization?: string;
  teachingLevel?: string;
  availability?: string;
  monthlySalary?: number;
  teacherId?: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  location?: string;
  phone?: string;
  profile?: UpdateTeacherProfileDto;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

//for frontend

export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  profile_pic: string | null;
  profile: {
    education: string;
    yearsOfExperience: number;
    medium: "ENGLISH_MEDIUM" | "BANGLA_MEDIUM";
    monthlySalary: number;
    district: string;
    area: string;
    gender: string;
    age: number;
    subjects: string[];
    specialization: string;
    teachingLevel: string;
    availability: string;
  };
}
