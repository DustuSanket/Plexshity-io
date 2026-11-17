import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/auth`,
  withCredentials: true,
});

export async function register({ fullName, email, password }) {
  const response = await api.post("/register", {
    fullName,
    email,
    password,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/login", { email, password });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/get-me");
  return response.data;
}

export async function logout() {
  const response = await api.get("/logout");
  return response.data;
}

export async function resendVerificationEmail(email) {
  const response = await api.post("/resend-verification", { email });
  return response.data;
}
