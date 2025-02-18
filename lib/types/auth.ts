export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  district: string;
  area: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export type AuthMode = "login" | "register";
