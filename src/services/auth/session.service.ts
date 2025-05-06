
// Service for managing user sessions
import { toast } from "@/components/ui/use-toast";

class SessionService {
  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user type
  getUserType(): 'admin' | 'doctor' | 'hospital' | 'user' | null {
    return localStorage.getItem('userType') as 'admin' | 'doctor' | 'hospital' | 'user' | null;
  }

  // Get current user ID
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Get user name
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  // Set session data in localStorage
  setSessionData(token: string, userId: string, userType: string, userName: string, userEmail?: string, userMobile?: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userType', userType);
    localStorage.setItem('userName', userName);
    
    if (userEmail) localStorage.setItem('userEmail', userEmail);
    if (userMobile) localStorage.setItem('userMobile', userMobile);
  }

  // Clear session data from localStorage
  clearSessionData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
  }
}

export const sessionService = new SessionService();
