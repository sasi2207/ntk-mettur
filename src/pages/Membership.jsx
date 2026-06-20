import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";
import SEO from "@/components/SEO";

const PageHero = ({ eyebrow, title, sub }) => (
  <section className="bg-ntk-black text-white py-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">{eyebrow}</div>
      <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{title}</h1>
      <p className="mt-3 text-white/75 max-w-2xl">{sub}</p>
    </div>
  </section>
);

export default function Membership() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", email: "", gender: "", date_of_birth: "", occupation: "", address: "", village: "", ward_number: "", photo_url: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    if (!form.name || !form.mobile) { toast.error("Name and mobile are required"); return; }
    setSubmitting(true);
    try {
      const r = await api.post("/members", form);
      toast.success(t.membership.thanks);
      nav(`/id/${r.data.id}`);
    } catch {
      toast.error("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="membership-page">
      <SEO title={ta ? "உறுப்பினராக" : "Become a Member"} path="/membership" />
      <PageHero eyebrow="Join" title={t.membership.title} sub={t.membership.sub} />
      <form onSubmit={submit} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 grid gap-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.membership.fields.name} required>
            <Input data-testid="memb-name" value={form.name} onChange={set("name")} required />
          </Field>
          <Field label={t.membership.fields.mobile} required>
            <Input data-testid="memb-mobile" value={form.mobile} onChange={set("mobile")} required type="tel" />
          </Field>
          <Field label={t.membership.fields.email}>
            <Input data-testid="memb-email" value={form.email} onChange={set("email")} type="email" />
          </Field>
          <Field label={t.membership.fields.gender}>
            <select data-testid="memb-gender" value={form.gender} onChange={set("gender")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">--</option>
              <option value="male">{t.membership.genders.male}</option>
              <option value="female">{t.membership.genders.female}</option>
              <option value="other">{t.membership.genders.other}</option>
            </select>
          </Field>
          <Field label={t.membership.fields.dob}>
            <Input data-testid="memb-dob" type="date" value={form.date_of_birth} onChange={set("date_of_birth")} />
          </Field>
          <Field label={t.membership.fields.occupation}>
            <Input data-testid="memb-occupation" value={form.occupation} onChange={set("occupation")} />
          </Field>
          <Field label={t.membership.fields.village}>
            <Input data-testid="memb-village" value={form.village} onChange={set("village")} />
          </Field>
          <Field label={t.membership.fields.ward}>
            <Input data-testid="memb-ward" value={form.ward_number} onChange={set("ward_number")} />
          </Field>
        </div>
        <Field label={t.membership.fields.address}>
          <Textarea data-testid="memb-address" value={form.address} onChange={set("address")} rows={3} />
        </Field>
        <Field label={t.membership.fields.photo}>
          <FileUploader value={form.photo_url} onChange={(url) => setForm({ ...form, photo_url: url })} folder="members" testid="memb-photo" />
        </Field>
        <Button data-testid="memb-submit" type="submit" disabled={submitting} className="bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full h-12 px-8 mt-2 w-fit">{submitting ? "..." : t.membership.submit}</Button>
        <p className="text-xs text-muted-foreground">{ta ? "சமர்ப்பித்த பிறகு உங்கள் டிஜிட்டல் உறுப்பினர் அடையாள அட்டை தயாராகும்." : "After submitting you'll receive your digital member ID card with a QR code."}</p>
      </form>
    </div>
  );
}

const Field = ({ label, children, required }) => (
  <div className="grid gap-1.5">
    <Label className="text-xs uppercase tracking-wider font-semibold">{label}{required && <span className="text-ntk-red"> *</span>}</Label>
    {children}
  </div>
);
