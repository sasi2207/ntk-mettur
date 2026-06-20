import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const SettingsContext = createContext({ settings: {}, refresh: () => {} });

const DEFAULTS = {
  whatsapp_number: "+919876543210",
  phone: "+919876543210",
  email: "contact@ntkmettur.in",
  address_en: "Naam Tamilar Katchi, Mettur Constituency Office, Mettur, Salem District, Tamil Nadu - 636401",
  address_ta: "நாம் தமிழர் கட்சி, மேட்டூர் தொகுதி அலுவலகம், மேட்டூர், சேலம் மாவட்டம், தமிழ்நாடு - 636401",
  facebook: "#", twitter: "#", instagram: "#", youtube: "#",
  upi_vpa: "ntkmettur@upi", razorpay_key_id: "rzp_test_PLACEHOLDER",
  site_url: "https://ntkmettur.in",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  const refresh = async () => {
    try {
      const r = await api.get("/settings");
      setSettings({ ...DEFAULTS, ...(r.data || {}) });
    } catch (e) { /* keep defaults */ }
  };

  useEffect(() => { refresh(); }, []);

  return <SettingsContext.Provider value={{ settings, refresh }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
