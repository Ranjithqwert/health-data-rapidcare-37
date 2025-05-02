
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Generates a random password of specified length
 */
export const generatePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

/**
 * Sends a welcome email to a newly created user with their login credentials
 */
export const sendWelcomeEmail = async (
  email: string, 
  name: string, 
  userType: 'admin' | 'doctor' | 'hospital' | 'user',
  password: string,
  userId: string
): Promise<boolean> => {
  try {
    console.log(`Sending welcome email to ${userType}: ${email}`);
    
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        email,
        name,
        userType,
        password,
        userId
      }
    });

    if (error) {
      console.error("Error invoking send-welcome-email function:", error);
      throw error;
    }

    console.log("Email function response:", data);
    
    toast({
      title: "Email Sent",
      description: `Welcome email with login credentials has been sent to ${email}`,
    });
    
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    toast({
      title: "Email Error",
      description: `Failed to send welcome email: ${(error as Error).message}`,
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Converts a boolean database value to "Yes"/"No" string format for UI
 */
export const booleanToYesNo = (value: boolean | null | undefined): "Yes" | "No" => {
  return value ? "Yes" : "No";
};

/**
 * Converts "Yes"/"No" string to boolean for database storage
 */
export const yesNoToBoolean = (value: "Yes" | "No" | string): boolean => {
  return value === "Yes";
};

/**
 * Calculates BMI based on height (cm) and weight (kg)
 */
export const calculateBMI = (heightCm: number, weightKg: number): number => {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  // BMI = weight (kg) / height (m)^2
  const heightMeters = heightCm / 100;
  return Number((weightKg / (heightMeters * heightMeters)).toFixed(2));
};

/**
 * Determines obesity level based on BMI
 */
export const getObesityLevel = (bmi: number): "Low" | "Correct" | "High" => {
  if (bmi < 18.5) return "Low";
  if (bmi >= 18.5 && bmi <= 24.9) return "Correct";
  return "High";
};

/**
 * Calculates age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
