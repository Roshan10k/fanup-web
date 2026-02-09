"use server";

import { getAuthToken } from "@/app/lib/cookie"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function handleGetAllUsers(page: string = '1', size: string = '10', search?: string) {
    try {
        const token = await getAuthToken();
        
        const currentPage = parseInt(page) || 1;
        const currentSize = parseInt(size) || 10;
        
        const params = new URLSearchParams({
            page: currentPage.toString(),
            size: currentSize.toString(),
        });
        
        if (search) {
            params.append('search', search);
        }
        
        const response = await fetch(`${API_BASE_URL}/api/admin/users?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Failed to fetch users',
            };
        }

        const data = await response.json();
        
        
        return {
            success: true,
            data: data.data,
            pagination: data.pagination || {
                page: currentPage,
                size: currentSize,
                totalItems: 0,
                totalPages: 0
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch users',
        };
    }
}
export async function handleGetUserById(id: string) {
    try {
        const token = await getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Failed to fetch user',
            };
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch user',
        };
    }
}

export async function handleGetUserStats() {
    try {
        const token = await getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/api/admin/users/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Failed to fetch stats',
            };
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to fetch stats',
        };
    }
}

export async function handleCreateUser(formData: FormData) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Failed to create user',
            };
        }

        const data = await response.json();
        return {
            success: true,
            message: 'User created successfully',
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create user',
        };
    }
}

export async function handleUpdateUser(id: string, formData: FormData) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Failed to update user',
            };
        }

        const data = await response.json();
        return {
            success: true,
            message: 'User updated successfully',
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update user',
        };
    }
}

export async function handleDeleteUser(id: string) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return {
                success: false,
                message: error.message || 'Failed to delete user',
            };
        }

        return {
            success: true,
            message: 'User deleted successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete user',
        };
    }
}