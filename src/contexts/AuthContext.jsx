import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext({ admin: null, loading: true, login: async () => {}, logout: async () => {} });

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ntk_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/admin/me")
      .then((r) => setAdmin(r.data))
      .catch(() => {
        localStorage.removeItem("ntk_admin_token");
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await api.post("/admin/login", { email, password });
    if (r.data.access_token) localStorage.setItem("ntk_admin_token", r.data.access_token);
    setAdmin({ id: r.data.id, email: r.data.email, name: r.data.name });
    return r.data;
  };

  const logout = async () => {
    try { await api.post("/admin/logout"); } catch (e) {}
    localStorage.removeItem("ntk_admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
