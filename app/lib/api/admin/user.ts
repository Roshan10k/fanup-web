import axios from "../axios";
import { API } from "../endpoints";
import { isAxiosError } from "axios";

const getAxiosErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
};

export const getAllUsers = async (
  token: string,
  page = "1",
  size = "10",
  search?: string
) => {
  try {
    const currentPage = parseInt(page, 10) || 1;
    const currentSize = parseInt(size, 10) || 10;
    const params = new URLSearchParams({
      page: String(currentPage),
      size: String(currentSize),
    });
    if (search) params.append("search", search);

    const response = await axios.get(`${API.ADMIN.USERS}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      ...response.data,
      pagination: response.data.pagination || {
        page: currentPage,
        size: currentSize,
        totalItems: 0,
        totalPages: 0,
      },
    };
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch users"));
  }
};

export const getUserById = async (token: string, id: string) => {
  try {
    const response = await axios.get(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch user"));
  }
};

export const getUserStats = async (token: string) => {
  try {
    const response = await axios.get(API.ADMIN.USER_STATS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to fetch stats"));
  }
};

export const createUser = async (token: string, formData: FormData) => {
  try {
    const response = await axios.post(API.ADMIN.USERS, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to create user"));
  }
};

export const updateUser = async (token: string, id: string, formData: FormData) => {
  try {
    const response = await axios.put(API.ADMIN.USER_BY_ID(id), formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to update user"));
  }
};

export const deleteUser = async (token: string, id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getAxiosErrorMessage(error, "Failed to delete user"));
  }
};