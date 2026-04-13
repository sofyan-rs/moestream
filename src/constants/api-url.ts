import axios from "axios";

export const API_URL =
  "https://casio-fabulous-suit-fragrance.trycloudflare.com/api";

export const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
