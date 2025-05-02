
// Database models that will be used throughout the application

export interface Admin {
  username: string;
  password: string; // Stored encrypted
}

export interface Doctor {
  doctorId: string;
  name: string;
  mobileNumber: string;
  email?: string;
  dateOfBirth: string;
  hospital: string;
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
  hospitalId: string;
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
  userId: string;
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
  height: number; // in cm
  weight: number; // in kg
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
  otpValue: string;
  validity: string; // DateTime
  expired: boolean;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  place: "Hospital" | "Clinic";
  placeId: string;
  prescription?: string;
  report?: string; // Link to files
}

export interface Admission {
  id: string;
  userId: string;
  userName: string;
  hospitalId: string;
  hospitalName: string;
  dateIn: string;
  timeIn: string;
  dateOut?: string;
  timeOut?: string;
  report?: string; // Link to files
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
