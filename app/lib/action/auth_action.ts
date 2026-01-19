//Server side actions
"use server";

import { login, register } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";

export async function handleRegister(formData: any) {
  try {
    //how to take data from component
    const result = await register(formData);
    //how to send data to component
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
    //how to take data from component
    const result = await login(formData);
    //how to send data to component
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
