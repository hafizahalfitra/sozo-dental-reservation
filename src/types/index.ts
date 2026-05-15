import { AppointmentStatus, Role } from "@prisma/client";

export type { AppointmentStatus, Role };

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface DoctorType {
  id: string;
  name: string;
  specialization: string;
  image: string | null;
  experience: number;
  available: boolean;
  createdAt: Date;
}

export interface ServiceType {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  createdAt: Date;
}

export interface AppointmentType {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  appointmentDate: Date;
  appointmentTime: string;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: Date;
  patient?: UserType;
  doctor?: DoctorType;
  service?: ServiceType;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
