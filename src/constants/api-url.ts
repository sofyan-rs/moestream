import axios from "axios";

export const API_URL =
  "https://carbon-knit-anyone-passive.trycloudflare.com/api";

export const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
