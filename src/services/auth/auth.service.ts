
// Main auth service that uses all the other services
import { LoginRequest, LoginWithMobileRequest, ResetPasswordRequest, LoginResponse } from "@/models/models";
import { sessionService } from "./session.service";
import { idService } from "./id.service";
import { loginService } from "./login.service";
import { otpService } from "./otp.service";
import { passwordService } from "./password.service";
import { userService } from "./user.service";
import { TableName } from "./auth.types";

class AuthService {
  // Session management
  isLoggedIn = sessionService.isLoggedIn.bind(sessionService);
  getUserType = sessionService.getUserType.bind(sessionService);
  getUserId = sessionService.getUserId.bind(sessionService);
  getUserName = sessionService.getUserName.bind(sessionService);
  
  // ID generation
  generateUniqueId = idService.generateUniqueId.bind(idService);
  
  // Login functions
  login = loginService.login.bind(loginService);
  loginWithMobile = loginService.loginWithMobile.bind(loginService);
  
  // Logout
  logout(): void {
    sessionService.clearSessionData();
    // Redirect to home page
    window.location.href = '/';
  }
  
  // OTP functions
  sendOTP = otpService.sendOTP.bind(otpService);
  verifyOTP = otpService.verifyOTP.bind(otpService);
  
  // Password management
  resetPassword = passwordService.resetPassword.bind(passwordService);
  changePassword = passwordService.changePassword.bind(passwordService);
  
  // User details
  getCurrentUserDetails = userService.getCurrentUserDetails.bind(userService);
}

export const authService = new AuthService();
