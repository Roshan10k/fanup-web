//AUTHENTICATION API CALL
import axios from "./axios";
import { API } from "./endpoints";

export const register = async (registrationData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registrationData);
    return response.data; 
  } catch (err: Error | any) {
    //4xx- 5xx falls in catch
    throw new Error(
      err.response?.data?.message || //message from backend
        err.message || //general exception message
        "Registration Failed", //fallback message
    );
  }
};

export const login = async (loginData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || //message from backend
        err.message || //general exception message
        "Login Failed", //fallback message
    );
  }
};

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
};
