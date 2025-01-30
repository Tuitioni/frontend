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
