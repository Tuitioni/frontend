import { Gender, Medium } from "./index";
export interface StudentPreview {
  id: string;
  firstName: string;
  lastName: string;
  profile: {
    district: string;
    area: string;
    gender: Gender;
    medium: Medium;
    levelOfStudy: string;
  };
}

export interface StudentDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    id: string;
    district: string;
    area: string;
    gender: Gender;
    age: number;
    medium: Medium;
    levelOfStudy: string;
    school?: string;
    college?: string;
    university?: string;
    subjects: string[];
  };
}

export interface UpdateStudentProfileDto {
  district?: string;
  area?: string;
  gender?: Gender;
  age?: number;
  medium?: Medium;
  levelOfStudy?: string;
  school?: string;
  college?: string;
  university?: string;
  subjects?: string[];
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profile?: UpdateStudentProfileDto;
}
