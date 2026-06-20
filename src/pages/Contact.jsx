import React, { useState } from "react";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("Required fields");
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      toast.success(t.contact.thanks);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch { toast.error("Failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <div data-testid="contact-page">
      <section className="bg-ntk-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Reach Out</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{t.contact.title}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{t.contact.sub}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 grid gap-5">
          <Info icon={MapPin} title={t.contact.address_h} value={t.contact.address} tCls={tCls} />
          <Info icon={Phone} title={t.contact.phone_label} value="+91 98765 43210" link="tel:+919876543210" />
          <Info icon={Mail} title={t.contact.email_label} value="contact@ntkmettur.in" link="mailto:contact@ntkmettur.in" />
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-ntk-red">{t.contact.social}</div>
            <div className="mt-3 flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((I, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-full bg-ntk-black text-white flex items-center justify-center hover:bg-ntk-red transition" data-testid={`contact-social-${i}`}><I className="h-4 w-4" /></a>
              ))}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border bg-secondary aspect-video">
            <iframe
              title="Mettur Map"
              src="https://www.google.com/maps?q=Mettur,Salem,Tamilnadu&output=embed"
              className="h-full w-full" loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-3 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Lab label={t.contact.name}><Input data-testid="ct-name" value={form.name} onChange={set("name")} required /></Lab>
            <Lab label={t.contact.email}><Input data-testid="ct-email" type="email" value={form.email} onChange={set("email")} required /></Lab>
            <Lab label={t.contact.phone}><Input data-testid="ct-phone" value={form.phone} onChange={set("phone")} /></Lab>
            <Lab label={t.contact.subject}><Input data-testid="ct-subject" value={form.subject} onChange={set("subject")} /></Lab>
          </div>
          <Lab label={t.contact.message}><Textarea data-testid="ct-message" value={form.message} onChange={set("message")} rows={6} required /></Lab>
          <Button data-testid="ct-submit" disabled={submitting} className="bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full h-12 px-8 w-fit">{submitting ? "..." : t.contact.send}</Button>
        </form>
      </section>
    </div>
  );
}

const Info = ({ icon: Icon, title, value, link, tCls }) => (
  <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
    <div className="h-10 w-10 rounded-md bg-ntk-red text-white flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
      {link ? <a href={link} className={`mt-1 block font-medium hover:text-ntk-red ${tCls || ""}`}>{value}</a> : <div className={`mt-1 text-sm ${tCls || ""}`}>{value}</div>}
    </div>
  </div>
);

const Lab = ({ label, children }) => (<div className="grid gap-1.5"><Label className="text-xs uppercase tracking-wider font-semibold">{label}</Label>{children}</div>);
