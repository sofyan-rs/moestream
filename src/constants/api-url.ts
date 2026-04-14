import axios from "axios";

export const API_URL =
  "https://amenities-antivirus-sacred-adjusted.trycloudflare.com/api";

export const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
