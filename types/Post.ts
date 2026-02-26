import { Gender, Medium } from './index';

export interface Post {
  id: string;
  firstName: string;
  lastName: string;
  district: string;
  area: string;
  age: number;
  medium: Medium;
  levelOfStudy: string;
  school?: string;
  college?: string;
  university?: string;
  subjects: string[];
  gender: Gender;
  salary: number;
  numberOfDays: number;
  duration: string;
  tuitionType: string;
  class: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  studentId: string;
}
