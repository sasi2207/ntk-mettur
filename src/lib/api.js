import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
export const FILE_BASE = `${BACKEND_URL}`;

export const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ntk_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fileUrl = (urlOrPath) => {
  if (!urlOrPath) return "";
  if (urlOrPath.startsWith("http")) return urlOrPath;
  if (urlOrPath.startsWith("/api/")) return `${BACKEND_URL}${urlOrPath}`;
  return urlOrPath;
};

export function formatErr(detail) {
  if (detail == null) return "Something went wrong";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(", ");
  if (detail.msg) return detail.msg;
  return String(detail);
}
