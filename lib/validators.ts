import { z } from 'zod';
import { hashSync, compare } from "bcrypt-ts";

export const userValidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"), // required field
  lastName: z.string().min(1, "Last name is required"),   // required field
  email: z.string().email("Invalid email format").min(1, "Email is required"), // email validation
  password: z.string().min(6, "Password must be at least 6 characters long"),   // password field with minimum length
  house: z.string().min(1, "House number is required"),
  unit: z.string().min(1, "House unit is required"),
});

export const loginValidateSchema = z.object({
  email: z.string().min(1, "Email is required"), // email validation
  password: z.string().min(1, "Password is required"),   // password field with minimum length
});

export const hashPassword = (password: string) => {
  try {
    var hash = hashSync(password, 10);
    return hash
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

export const validatePassword = async(password:string, hashedPassword: string) => {
  var isValid = compare(password, hashedPassword)
  return isValid
}

export const generateCode = () => {
  const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return newCode
};

export const isWithinFiveHours= async (targetDate : any) =>  {
  const currentTime = new Date();
  const timeDifference = Math.abs(currentTime.getTime() - targetDate.getTime());
  const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
  return hoursDifference < 5;
}
