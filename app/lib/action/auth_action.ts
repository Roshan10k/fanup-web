//Server side actions
"use server";

import { 
  login, 
  register, 
  requestPasswordReset,  
  resetPassword 
} from "../api/auth";
import { getAuthToken, getUserData, setAuthToken, setUserData } from "../cookie";

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export async function handleRegister(formData: unknown) {
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
  } catch (error: unknown) {
    return { success: false, message: getErrorMessage(error, "register failed") };
  }
}

export async function handleLogin(formData: unknown) {
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
  } catch (error: unknown) {
    return { success: false, message: getErrorMessage(error, "login failed") };
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
  } catch (error: unknown) {
    return { 
      success: false, 
      message: getErrorMessage(error, 'Request password reset action failed') 
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
  } catch (error: unknown) {
    return { 
      success: false, 
      message: getErrorMessage(error, 'Reset password action failed') 
    };
  }
};

export const handleUpdateProfile = async (formData: FormData) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
      };
    }

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:3001";
    const photo = formData.get("photo");
    const hasPhoto = photo instanceof File && photo.size > 0;
    let response: Response;

    if (hasPhoto) {
      const user = await getUserData();
      const userId = user?._id;

      if (!userId) {
        return {
          success: false,
          message: "User id not found. Please login again.",
        };
      }

      response = await fetch(`${API_BASE_URL}/api/auth/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        cache: "no-store",
      });
    } else {
      const payload = {
        fullName: String(formData.get("fullName") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
      };

      response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message || "Failed to update profile",
      };
    }

    const updatedUser = payload?.data || payload?.user || null;

    if (updatedUser) {
      await setUserData(updatedUser);
    }

    return {
      success: true,
      message: payload?.message || "Profile updated successfully",
      data: updatedUser,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Profile update failed"),
    };
  }
};
