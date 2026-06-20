import React from "react";
import { MessageCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export default function WhatsAppFab() {
  const { settings } = useSettings();
  const num = (settings.whatsapp_number || "+919876543210").replace(/[^\d]/g, "");
  return (
    <a
      href={`https://wa.me/${num}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-fab"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 transition"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}
