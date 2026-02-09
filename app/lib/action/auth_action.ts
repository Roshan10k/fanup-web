//Server side actions
"use server";

import { 
  login, 
  register, 
  requestPasswordReset,  
  resetPassword 
} from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export async function handleRegister(formData: any) {
  try {
    const result = await register(formData);
    if (result.success) {
      return {
        success: true,
        message: "Register Successful",
        data: result.data,
      };
    }
    return { success: false, message: result.message || "register failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}

export async function handleLogin(formData: any) {
  try {
    const result = await login(formData);
    if (result.success) {
      await setAuthToken(result.token);
      await setUserData(result.data);
      return {
        success: true,
        message: "Login Successful",
        data: result.data,
      };
    }
    return { success: false, message: result.message || "login failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}

// Request password reset action
export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);
    if (response.success) {
      return {
        success: true,
        message: 'Password reset email sent successfully'
      };
    }
    return { 
      success: false, 
      message: response.message || 'Request password reset failed' 
    };
  } catch (error: Error | any) {
    return { 
      success: false, 
      message: error.message || 'Request password reset action failed' 
    };
  }
};

// Reset password action
export const handleResetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await resetPassword(token, newPassword);
    if (response.success) {
      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    }
    return { 
      success: false, 
      message: response.message || 'Reset password failed' 
    };
  } catch (error: Error | any) {
    return { 
      success: false, 
      message: error.message || 'Reset password action failed' 
    };
  }
};