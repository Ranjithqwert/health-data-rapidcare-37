
export type TableName = 'doctors' | 'hospitals' | 'patients' | 'admins' | 'admission_reports' | 'admissions' | 'consultations' | 'otps';

export type UserType = 'doctor' | 'hospital' | 'user' | 'admin';

export interface VillageVerificationRequest {
  userId: string;
  village: string;
  userType: 'doctor' | 'hospital' | 'user';
}
