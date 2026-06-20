import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Copy, Search } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";
import SEO from "@/components/SEO";

export default function Complaint() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", village: "", category: "", description: "", photo_url: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    if (!form.name || !form.mobile || !form.description) return toast.error("Required fields missing");
    setSubmitting(true);
    try {
      const r = await api.post("/complaints", form);
      setDone({ id: r.data.id, mobile: form.mobile });
    } catch { toast.error("Failed"); } finally { setSubmitting(false); }
  };

  if (done) return (
    <div className="min-h-[70vh] grid place-items-center text-center px-4 py-12" data-testid="complaint-success">
      <div className="max-w-md rounded-2xl border border-border bg-card p-8">
        <div className="mx-auto h-16 w-16 rounded-full bg-ntk-red/10 text-ntk-red flex items-center justify-center"><CheckCircle2 className="h-8 w-8" /></div>
        <h2 className={`mt-4 text-2xl font-display font-bold ${tCls}`}>{t.complaint.thanks}</h2>
        <div className="mt-5 rounded-xl bg-secondary p-4 text-left">
          <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{ta ? "உங்கள் புகார் ID" : "Your complaint ID"}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-sm break-all">{done.id}</span>
            <button onClick={() => { navigator.clipboard.writeText(done.id); toast.success("Copied"); }} className="text-ntk-red"><Copy className="h-4 w-4" /></button>
          </div>
          <p className={`mt-2 text-xs text-muted-foreground ${tCls}`}>{ta ? "இந்த ID யை சேமித்து வைக்கவும். மொபைல் + ID கொண்டு நிலையை பின்தொடரலாம்." : "Save this ID. Track status anytime using your mobile + this ID."}</p>
        </div>
        <Link to="/complaint/track" className="mt-5 inline-flex items-center gap-2 rounded-full bg-ntk-red text-white px-5 py-2.5 text-sm font-bold"><Search className="h-4 w-4" />{ta ? "நிலையை கண்காணி" : "Track status"}</Link>
      </div>
    </div>
  );

  return (
    <div data-testid="complaint-page">
      <SEO title={ta ? "புகார்" : "Complaint"} path="/complaint" />
      <section className="bg-ntk-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Public Grievance</div>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{t.complaint.title}</h1>
            <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{t.complaint.sub}</p>
          </div>
          <Link to="/complaint/track" className="inline-flex items-center gap-2 rounded-full border border-ntk-yellow/60 text-ntk-yellow px-5 py-2 text-sm font-bold hover:bg-ntk-yellow hover:text-ntk-black transition" data-testid="goto-track">
            <Search className="h-4 w-4" />{ta ? "புகார் கண்காணிப்பு" : "Track existing"}
          </Link>
        </div>
      </section>
      <form onSubmit={submit} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 grid gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Lab label={t.complaint.fields.name}><Input data-testid="comp-name" value={form.name} onChange={set("name")} required /></Lab>
          <Lab label={t.complaint.fields.mobile}><Input data-testid="comp-mobile" value={form.mobile} onChange={set("mobile")} required type="tel" /></Lab>
          <Lab label={t.complaint.fields.village}><Input data-testid="comp-village" value={form.village} onChange={set("village")} /></Lab>
          <Lab label={t.complaint.fields.category}>
            <select data-testid="comp-category" value={form.category} onChange={set("category")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">--</option>
              {t.complaint.categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Lab>
        </div>
        <Lab label={t.complaint.fields.description}><Textarea data-testid="comp-desc" rows={5} value={form.description} onChange={set("description")} required /></Lab>
        <Lab label={t.complaint.fields.photo}>
          <FileUploader value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} folder="complaints" testid="comp-photo" />
        </Lab>
        <Button data-testid="comp-submit" type="submit" disabled={submitting} className="bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full h-12 px-8 mt-2 w-fit">{submitting ? "..." : t.complaint.submit}</Button>
      </form>
    </div>
  );
}

const Lab = ({ label, children }) => (<div className="grid gap-1.5"><Label className="text-xs uppercase tracking-wider font-semibold">{label}</Label>{children}</div>);
