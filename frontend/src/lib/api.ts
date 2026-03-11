import axios from "axios";

// Centralizamos o IP aqui. Mudou o IP? Muda só aqui.
export const api = axios.create({
  baseURL: "http://192.168.0.119:8080",
});