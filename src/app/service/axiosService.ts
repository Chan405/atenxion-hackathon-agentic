import axios, { AxiosInstance } from "axios";

export const axiosServerInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 600000,
});
