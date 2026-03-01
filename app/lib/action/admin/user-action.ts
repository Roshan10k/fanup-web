"use server";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserStats,
  updateUser,
} from "../../api/admin/user";
import { getAuthToken } from "../../cookie";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export async function handleGetAllUsers(
  page: string = "1",
  size: string = "10",
  search?: string
) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getAllUsers(token, page, size, search);
    return {
      success: true,
      data: payload.data,
      pagination: payload.pagination,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch users"),
    };
  }
}

export async function handleGetUserById(id: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getUserById(token, id);
    return {
      success: true,
      data: payload.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch user"),
    };
  }
}

export async function handleGetUserStats() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await getUserStats(token);
    return {
      success: true,
      data: payload.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to fetch stats"),
    };
  }
}

export async function handleCreateUser(formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await createUser(token, formData);
    return {
      success: true,
      message: payload?.message || "User created successfully",
      data: payload.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to create user"),
    };
  }
}

export async function handleUpdateUser(id: string, formData: FormData) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await updateUser(token, id, formData);
    return {
      success: true,
      message: payload?.message || "User updated successfully",
      data: payload.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to update user"),
    };
  }
}

export async function handleDeleteUser(id: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: "Unauthorized. Please login again." };
    }

    const payload = await deleteUser(token, id);
    return {
      success: true,
      message: payload?.message || "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to delete user"),
    };
  }
}