// AUTHENTICATION API CALLS
import axios from "./axios";
import { isAxiosError } from "axios";
import { API } from "./endpoints";

type ApiPayload = {
  success?: boolean;
  message?: string;
  data?: unknown;
  token?: string;
  user?: unknown;
  [key: string]: unknown;
};

const getAxiosErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message;
    return message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const register = async (registrationData: unknown): Promise<ApiPayload> => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registrationData);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Registration failed"));
  }
};

export const login = async (loginData: unknown): Promise<ApiPayload> => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Login failed"));
  }
};

export const googleLogin = async (credential: string): Promise<ApiPayload> => {
  try {
    const response = await axios.post(API.AUTH.GOOGLE_LOGIN, { credential });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Google login failed"));
  }
};

export const requestPasswordReset = async (email: string): Promise<ApiPayload> => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Request password reset failed"));
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiPayload> => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD(token), {
      newPassword,
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Reset password failed"));
  }
};

export const updateProfileWithPhoto = async (
  token: string,
  userId: string,
  formData: FormData
): Promise<ApiPayload> => {
  try {
    const response = await axios.put(API.AUTH.UPDATEPROFILE_PHOTO(userId), formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to update profile"));
  }
};

export const updateProfile = async (
  token: string,
  payload: { fullName: string; phone: string }
): Promise<ApiPayload> => {
  try {
    const response = await axios.put(API.AUTH.UPDATEPROFILE, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to update profile"));
  }
};

export const hydrateSession = async (token: string): Promise<ApiPayload> => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      getAxiosErrorMessage(error, "Session expired. Please login again.")
    );
  }
};

export const getProfileStats = async (token: string): Promise<ApiPayload> => {
  try {
    const response = await axios.get(API.AUTH.PROFILE_STATS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch profile stats"));
  }
};
