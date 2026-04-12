import axios from "axios";

export const API_URL = "https://api-anime.sofyan.id/api/v1";

export const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
