
// Calculate BMI
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  
  // Convert height from cm to m
  const heightM = heightCm / 100;
  
  // Calculate BMI: weight (kg) / height² (m²)
  const bmi = weightKg / (heightM * heightM);
  
  // Return rounded to 1 decimal place
  return Math.round(bmi * 10) / 10;
};

// Determine obesity level based on BMI
export const getObesityLevel = (bmi: number): 'Low' | 'Correct' | 'High' => {
  if (!bmi) return 'Correct';
  
  if (bmi < 18.5) {
    return 'Low';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Correct';
  } else {
    return 'High';
  }
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Get current time in HH:MM format
export const getCurrentTime = (): string => {
  const date = new Date();
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

// Extract date, month, and year from a date string
export const extractDateComponents = (dateString: string): { date: string; month: string; year: string } => {
  const date = new Date(dateString);
  return {
    date: date.getDate().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    year: date.getFullYear().toString()
  };
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
