import axios from "axios";

export const api = axios.create({ baseURL: process.env.URL_API || "https://tecadilabs.tecadi.com.br:8088/" });
