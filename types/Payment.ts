import { PaymentMethod, PaymentStatus } from "./index";

export interface PaymentPreview {
  id: string;
  amount: number;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate: Date;
  tuitionId: string;
  teacher: {
    firstName: string;
    lastName: string;
  };
}

export interface PaymentDetail {
  id: string;
  amount: number;
  status: string;
  teacherId: string;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  transactionId: string;
  tuitionId: string;
  createdAt: Date;
  updatedAt: Date;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreatePaymentDto {
  amount: number;
  status: string;
  teacherId: string;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  transactionId: string;
  tuitionId: string;
}

export interface UpdatePaymentDto {
  amount: number;
  status: string;
  teacherId: string;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  transactionId: string;
  tuitionId: string;
}
