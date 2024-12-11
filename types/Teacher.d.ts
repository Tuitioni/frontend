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

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

enum Medium {
  ENGLISH_MEDIUM = "ENGLISH_MEDIUM",
  BANGLA_MEDIUM = "BANGLA_MEDIUM",
  ENGLISH_VERSION = "ENGLISH_VERSION",
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
