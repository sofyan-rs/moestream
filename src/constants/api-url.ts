import axios from "axios";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
