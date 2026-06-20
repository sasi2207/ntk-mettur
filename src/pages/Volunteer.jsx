import React, { useState } from "react";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Volunteer() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", skills: "", area_of_interest: "", available_time: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    if (!form.name || !form.mobile) return toast.error("Name and mobile required");
    setSubmitting(true);
    try { await api.post("/volunteers", form); setDone(true); }
    catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };

  if (done) return (
    <div className="min-h-[70vh] grid place-items-center text-center px-4" data-testid="vol-success">
      <div className="max-w-md">
        <div className="mx-auto h-16 w-16 rounded-full bg-ntk-red/10 text-ntk-red flex items-center justify-center"><CheckCircle2 className="h-8 w-8" /></div>
        <h2 className={`mt-4 text-2xl font-display font-bold ${tCls}`}>{t.volunteer.thanks}</h2>
      </div>
    </div>
  );

  return (
    <div data-testid="volunteer-page">
      <section className="bg-ntk-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Cadre</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{t.volunteer.title}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{t.volunteer.sub}</p>
        </div>
      </section>
      <form onSubmit={submit} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 grid gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Lab label={t.volunteer.fields.name}><Input data-testid="vol-name" value={form.name} onChange={set("name")} required /></Lab>
          <Lab label={t.volunteer.fields.mobile}><Input data-testid="vol-mobile" value={form.mobile} onChange={set("mobile")} required type="tel" /></Lab>
          <Lab label={t.volunteer.fields.skills}><Input data-testid="vol-skills" value={form.skills} onChange={set("skills")} /></Lab>
          <Lab label={t.volunteer.fields.interest}><Input data-testid="vol-interest" value={form.area_of_interest} onChange={set("area_of_interest")} /></Lab>
        </div>
        <Lab label={t.volunteer.fields.time}><Textarea data-testid="vol-time" value={form.available_time} onChange={set("available_time")} rows={3} /></Lab>
        <Button data-testid="vol-submit" type="submit" disabled={submitting} className="bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full h-12 px-8 mt-2 w-fit">{submitting ? "..." : t.volunteer.submit}</Button>
      </form>
    </div>
  );
}

const Lab = ({ label, children }) => (<div className="grid gap-1.5"><Label className="text-xs uppercase tracking-wider font-semibold">{label}</Label>{children}</div>);
