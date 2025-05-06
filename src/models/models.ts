
// Database models that will be used throughout the application

export interface Admin {
  username: string;
  password: string; // Stored encrypted
}

export interface Doctor {
  doctorId: string; // This will be a 10-digit ID
  name: string;
  mobileNumber: string;
  email?: string;
  dateOfBirth: string;
  hospital: string; // Changed from hospital_id to hospital
  speciality: string;
  clinicHouseNumber: string;
  clinicStreet: string;
  clinicVillage: string;
  clinicDistrict: string;
  clinicState: string;
  clinicCountry: string;
  clinicPincode: string;
  password: string; // Stored encrypted
}

export interface Hospital {
  hospitalId: string; // This will be a 10-digit ID
  hospitalName: string;
  emailId: string;
  mobile: string;
  hospitalLicenseNumber: string;
  hospitalHouseNumber: string;
  hospitalStreet: string;
  hospitalVillage: string;
  hospitalDistrict: string;
  hospitalState: string;
  hospitalCountry: string;
  hospitalPincode: string;
  type: "general" | "specialty";
  speciality?: string;
  numberOfICUs: number;
  numberOfOPRooms: number;
  numberOfDoctors: number; // Calculated field
  password: string; // Stored encrypted
}

export interface User {
  userId: string; // This will be a 10-digit ID
  name: string;
  mobileNumber: string;
  emailId: string;
  dateOfBirth: string;
  age: number;
  sugar: "Yes" | "No";
  sugarLevel?: string;
  bp: "Yes" | "No";
  bpLevel?: string;
  cardiac: "Yes" | "No";
  cardiacInfo?: string;
  kidney: "Yes" | "No";
  kidneyInfo?: string;
  liver: "Yes" | "No";
  liverInfo?: string;
  lungs: "Yes" | "No";
  lungsInfo?: string;
  smoke: "Yes" | "No";
  alcohol: "Yes" | "No";
  inTreatment: "Yes" | "No";
  height_cm: number; // Updated to match database column name
  weight_kg: number; // Updated to match database column name
  bmi: number; // Calculated field
  obesityLevel: "Low" | "Correct" | "High"; // Calculated field
  houseNumber: string;
  street: string;
  village: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  password: string; // Stored encrypted
  createdDate: string; 
  createdMonth: string;
  createdYear: string;
}

export interface OTP {
  id: string;
  otpValue: string;  // Changed from otpCode to match DB schema
  validity: string;  // Changed from expiresAt to match DB schema
  expired: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  consultation_date: string; // Match the exact database column names
  consultation_time: string; // Match the exact database column names
  place: "Hospital" | "Clinic";
  place_id?: string;
  prescription?: string;
  report_link?: string; // Added report_link property 
}

export interface Admission {
  id: string;
  patient_id: string; // Updated to match database column name
  patient_name: string; // Updated to match database column name
  hospital_id: string; // Updated to match database column name
  hospital_name: string; // Updated to match database column name
  date_in: string; // Updated to match database column name
  time_in: string; // Updated to match database column name
  date_out?: string; // Updated to match database column name
  time_out?: string; // Updated to match database column name
  report_link?: string; // Updated to match database column name
  discharged: boolean;
  recovered: boolean;
  feedback?: string;
}

// Auth related interfaces
export interface LoginRequest {
  userId: string;
  password: string;
  userType: 'admin' | 'doctor' | 'hospital' | 'user';
}

// New interface for login with mobile number
export interface LoginWithMobileRequest {
  mobileNumber: string;
  password: string;
  userType: 'admin' | 'doctor' | 'hospital' | 'user';
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  userId?: string;
  name?: string;
  error?: string;
}

export interface ForgotPasswordRequest {
  userId: string;
  userType: 'doctor' | 'hospital' | 'user';
}

export interface OTPVerificationRequest {
  userId: string;
  otp: string;
  userType: 'doctor' | 'hospital' | 'user';
}

export interface ResetPasswordRequest {
  userId: string;
  newPassword: string;
  confirmPassword: string;
  userType: 'doctor' | 'hospital' | 'user';
}
