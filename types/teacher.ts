import { Gender, Medium } from "./index";

//to use in the public page

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

//to use in the admin page and dashboard page

export interface TeacherDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  district: string;
  area: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    id: string;
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

//to use in the admin page and dashboard page

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
  district?: string;
  area?: string;
}

export interface UpdateAdminTeacherDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  location?: string;
  phone?: string;
  profile?: UpdateTeacherProfileDto;
  district?: string;
  area?: string;
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
