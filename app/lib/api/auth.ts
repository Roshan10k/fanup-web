//AUTHENTICATION API CALL
import axios from "./axios"; 
import {API} from "./endpoints";



export const register = async (registrationData: any) => {
    try{
        const response = await axios.post(API.AUTH.REGISTER, registrationData)
        return response.data; //response ko body
    }catch(err: Error | any){
        //4xx- 5xx falls in catch
        throw new Error(
            err.response?.data?.message //message from backend
            || err.message  //general exception message
            || 'Registration Failed' //fallback message
        )
    }
}

export const login = async (loginData: any) => {
    try{
        const response = await axios.post(API.AUTH.LOGIN, loginData)
        return response.data; 
    }catch(err: Error | any){
       
        throw new Error(
            err.response?.data?.message //message from backend
            || err.message  //general exception message
            || 'Login Failed' //fallback message
        )
    }
}