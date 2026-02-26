export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Medium {
  ENGLISH_MEDIUM = 'ENGLISH_MEDIUM',
  BANGLA_MEDIUM = 'BANGLA_MEDIUM',
  ENGLISH_VERSION = 'ENGLISH_VERSION',
}

export enum PaymentMethod {
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

export type { RegisterFormData, LoginFormData, AuthMode } from './auth';
