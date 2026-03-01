//Server side actions
"use server";

import { 
  getProfileStats,
  googleLogin,
  hydrateSession,
  login, 
  register, 
  requestPasswordReset,  
  resetPassword,
  updateProfile,
  updateProfileWithPhoto,
} from "../api/auth";
import {
  clearAuthCookies,
  getAuthToken,
  getUserData,
  setAuthToken,
  setUserData,
} from "../cookie";

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
      await setAuthToken(result.token as string);
      await setUserData(result.data);
      return {
        success: true,
        message: "Login Successful",
        data: result.data as Record<string, unknown>,
      };
    }
    return { success: false, message: result.message || "login failed" };
  } catch (error: unknown) {
    return { success: false, message: getErrorMessage(error, "login failed") };
  }
}

export async function handleGoogleLogin(credential: string) {
  try {
    const result = await googleLogin(credential);
    if (result.success) {
      await setAuthToken(result.token as string);
      await setUserData(result.data);
      return {
        success: true,
        message: "Login Successful",
        data: result.data as Record<string, unknown>,
      };
    }
    return { success: false, message: result.message || "Google login failed" };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Google login failed"),
    };
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

    const photo = formData.get("photo");
    const hasPhoto = photo instanceof File && photo.size > 0;
    if (hasPhoto) {
      const user = await getUserData();
      const userId = user?._id;

      if (!userId) {
        return {
          success: false,
          message: "User id not found. Please login again.",
        };
      }

      const payload = await updateProfileWithPhoto(token, userId, formData);
      const updatedUser = payload?.data || payload?.user || null;

      if (updatedUser) {
        await setUserData(updatedUser);
      }

      return {
        success: true,
        message: payload?.message || "Profile updated successfully",
        data: updatedUser,
      };
    } else {
      const requestPayload = {
        fullName: String(formData.get("fullName") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
      };

      const payload = await updateProfile(token, requestPayload);
      const updatedUser = payload?.data || payload?.user || null;

      if (updatedUser) {
        await setUserData(updatedUser);
      }

      return {
        success: true,
        message: payload?.message || "Profile updated successfully",
        data: updatedUser,
      };
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Profile update failed"),
    };
  }
};

export const handleHydrateSession = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
        data: null,
      };
    }

    const payload = await hydrateSession(token);
    if (!payload?.success || !payload?.data) {
      await clearAuthCookies();
      return {
        success: false,
        message: payload?.message || "Session expired. Please login again.",
        data: null,
      };
    }

    await setUserData(payload.data);
    return {
      success: true,
      message: payload?.message || "Session validated",
      data: payload.data,
    };
  } catch (error: unknown) {
    await clearAuthCookies();
    return {
      success: false,
      message: getErrorMessage(error, "Failed to validate session"),
      data: null,
    };
  }
};

export const handleGetProfileStats = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login again.",
        data: null,
      };
    }

    const payload = await getProfileStats(token);
    if (!payload?.success) {
      return {
        success: false,
        message: payload?.message || "Failed to fetch profile stats",
        data: null,
      };
    }

    return {
      success: true,
      message: payload?.message || "Profile stats fetched",
      data: payload?.data || null,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch profile stats"),
      data: null,
    };
  }
};
