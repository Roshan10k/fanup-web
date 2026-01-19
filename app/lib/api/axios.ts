import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
    || "http://localhost:3001"

export const axiosInstance = axios.create(
    {
        baseURL: BASE_URL,
        headers: {
            'content-Type': 'application/json'
        }
    }
)

export default axiosInstance;