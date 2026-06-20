import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "@/components/admin/Table";
import { toast } from "sonner";
import { Save } from "lucide-react";

const FIELDS = [
  { key: "whatsapp_number", label: "WhatsApp Number", placeholder: "+919876543210" },
  { key: "phone",           label: "Phone (display)",  placeholder: "+91 98765 43210" },
  { key: "email",           label: "Public Email",     placeholder: "contact@ntkmettur.in" },
  { key: "facebook",        label: "Facebook URL",     placeholder: "https://facebook.com/…" },
  { key: "twitter",         label: "Twitter / X URL",  placeholder: "https://twitter.com/…" },
  { key: "instagram",       label: "Instagram URL",    placeholder: "https://instagram.com/…" },
  { key: "youtube",         label: "YouTube URL",      placeholder: "https://youtube.com/…" },
  { key: "upi_vpa",         label: "UPI VPA",          placeholder: "ntkmettur@upi" },
  { key: "razorpay_key_id", label: "Razorpay Key ID",  placeholder: "rzp_live_xxx" },
  { key: "site_url",        label: "Site URL (for SEO/sitemap)", placeholder: "https://ntkmettur.in" },
];

export default function AdminSettings() {
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { setForm({ ...settings }); }, [settings]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put("/admin/settings", { data: form });
      toast.success("Settings updated");
      refresh();
    } catch { toast.error("Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <AdminPageHeader title="Site Settings" />
      <form onSubmit={save} className="max-w-3xl grid gap-5" data-testid="settings-form">
        <div className="grid sm:grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.key} className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wider font-semibold">{f.label}</Label>
              <Input data-testid={`set-${f.key}`} value={form[f.key] || ""} onChange={set(f.key)} placeholder={f.placeholder} />
            </div>
          ))}
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs uppercase tracking-wider font-semibold">Office Address (English)</Label>
          <Textarea data-testid="set-address_en" value={form.address_en || ""} onChange={set("address_en")} rows={2} />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs uppercase tracking-wider font-semibold">Office Address (தமிழ்)</Label>
          <Textarea data-testid="set-address_ta" value={form.address_ta || ""} onChange={set("address_ta")} rows={2} className="font-tamil" />
        </div>
        <Button type="submit" disabled={busy} className="bg-ntk-red text-white w-fit" data-testid="settings-save">
          <Save className="h-4 w-4 mr-2" />{busy ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
