import axios from "axios";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api-moestream.sofyan.id/api";

export const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
