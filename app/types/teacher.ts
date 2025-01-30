export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  profile_pic: string | null;
  profile: {
    district: string;
    area: string;
    gender: string;
    age: number;
    medium: string;
    education: string;
    yearsOfExperience: number;
    subjects: string[];
    specialization: string;
    teachingLevel: string;
    availability: string;
    monthlySalary: number;
    teacherId: string;
  };
}
