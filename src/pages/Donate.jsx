import React, { useState } from "react";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Smartphone, CreditCard, CheckCircle2, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const AMOUNTS = [101, 501, 1001, 5001, 10001];

export default function Donate() {
  const { t, lang } = useLang();
  const { settings } = useSettings();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [mode, setMode] = useState("upi");
  const [form, setForm] = useState({ name: "", mobile: "", email: "", amount: 501, message: "" });
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target?.value ?? e });

  const upiLink = (amt) => {
    const vpa = settings.upi_vpa || "ntkmettur@upi";
    const tn = encodeURIComponent("NTK Mettur Donation");
    return `upi://pay?pa=${vpa}&pn=NTK%20Mettur&am=${amt}&cu=INR&tn=${tn}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.amount) return toast.error("Name, mobile and amount required");
    setBusy(true);
    try {
      const r = await api.post("/donations", { ...form, mode, amount: Number(form.amount) });
      setDone(r.data);
    } catch { toast.error("Failed to create donation"); }
    finally { setBusy(false); }
  };

  if (done) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16" data-testid="donate-success">
        <SEO title={ta ? "நன்கொடை" : "Donate"} path="/donate" />
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-ntk-red/10 text-ntk-red flex items-center justify-center"><CheckCircle2 className="h-8 w-8" /></div>
          <h2 className={`mt-4 text-2xl font-display font-bold ${tCls}`}>{ta ? "உங்கள் நன்கொடை பதிவாகியுள்ளது" : "Your donation intent is recorded"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">ID: <span className="font-mono">{done.id}</span></p>
          {done.mode === "upi" && (
            <div className="mt-6 grid sm:grid-cols-2 gap-6 items-center text-left">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-ntk-red">Scan to pay (UPI)</div>
                <div className={`mt-2 text-sm ${tCls}`}>Pay ₹{done.amount} to <span className="font-mono">{done.upi_vpa}</span></div>
                <button onClick={() => { navigator.clipboard.writeText(done.upi_vpa); toast.success("UPI ID copied"); }} className="mt-2 inline-flex items-center gap-1 text-xs text-ntk-red font-bold"><Copy className="h-3 w-3" />Copy UPI ID</button>
                <a href={upiLink(done.amount)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-ntk-red text-white px-4 py-2 text-sm font-bold hover:bg-ntk-redHover">Open UPI app</a>
              </div>
              <div className="rounded-xl bg-white p-4 flex items-center justify-center">
                <QRCodeCanvas value={upiLink(done.amount)} size={180} fgColor="#0A0A0A" includeMargin />
              </div>
            </div>
          )}
          {done.mode === "razorpay" && (
            <div className="mt-6 text-sm text-muted-foreground">
              {done.rzp_order_id
                ? <>Razorpay order created: <span className="font-mono">{done.rzp_order_id}</span>. Complete payment in your provider checkout.</>
                : <>Razorpay keys are placeholders. Set <code>razorpay_key_id</code> & secret in admin Settings to enable live checkout.</>}
            </div>
          )}
          <Button onClick={() => setDone(null)} className="mt-6 bg-ntk-red text-white">Donate again</Button>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="donate-page">
      <SEO title={ta ? "நன்கொடை" : "Donate"} path="/donate" />
      <section className="bg-ntk-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Support the Cause</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{ta ? "நன்கொடை" : "Donate to NTK Mettur"}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{ta ? "உங்கள் நன்கொடை எங்கள் தொகுதி நலப் பணிகளுக்கு பயன்படுத்தப்படும்." : "Your contribution powers welfare drives, ground meetings and community programmes across Mettur."}</p>
        </div>
      </section>

      <form onSubmit={submit} className="max-w-3xl mx-auto px-4 sm:px-6 py-12 grid gap-6" data-testid="donate-form">
        <div>
          <Label className="text-xs uppercase tracking-wider font-semibold">{ta ? "தொகை (₹)" : "Amount (₹)"}</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <button key={a} type="button" onClick={() => setForm({ ...form, amount: a })} data-testid={`donate-amt-${a}`}
                className={`rounded-full border px-5 py-2 text-sm font-bold transition ${form.amount === a ? "bg-ntk-red text-white border-ntk-red" : "border-border hover:border-ntk-red"}`}>
                ₹{a.toLocaleString()}
              </button>
            ))}
            <Input type="number" min="1" value={form.amount} onChange={set("amount")} className="w-32 h-10" data-testid="donate-amt-custom" />
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider font-semibold">{ta ? "கட்டண முறை" : "Payment Method"}</Label>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => setMode("upi")} data-testid="donate-mode-upi"
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${mode === "upi" ? "border-ntk-red bg-ntk-red/5" : "border-border"}`}>
              <Smartphone className={`h-5 w-5 ${mode === "upi" ? "text-ntk-red" : "text-muted-foreground"}`} />
              <div>
                <div className="font-bold text-sm">UPI / QR</div>
                <div className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm</div>
              </div>
            </button>
            <button type="button" onClick={() => setMode("razorpay")} data-testid="donate-mode-razorpay"
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${mode === "razorpay" ? "border-ntk-red bg-ntk-red/5" : "border-border"}`}>
              <CreditCard className={`h-5 w-5 ${mode === "razorpay" ? "text-ntk-red" : "text-muted-foreground"}`} />
              <div>
                <div className="font-bold text-sm">Razorpay</div>
                <div className="text-xs text-muted-foreground">Card · Netbanking · Wallet</div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={ta ? "பெயர்" : "Name"}><Input data-testid="donate-name" value={form.name} onChange={set("name")} required /></Field>
          <Field label={ta ? "கைபேசி" : "Mobile"}><Input data-testid="donate-mobile" value={form.mobile} onChange={set("mobile")} required /></Field>
          <Field label={ta ? "மின்னஞ்சல்" : "Email"}><Input data-testid="donate-email" type="email" value={form.email} onChange={set("email")} /></Field>
        </div>
        <Field label={ta ? "செய்தி (விரும்பினால்)" : "Message (optional)"}><Textarea data-testid="donate-msg" value={form.message} onChange={set("message")} rows={3} /></Field>
        <Button data-testid="donate-submit" type="submit" disabled={busy} className="bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full h-12 px-8 w-fit">
          <Heart className="h-4 w-4 mr-2" />{busy ? "..." : (ta ? `₹${form.amount} அளி` : `Donate ₹${form.amount}`)}
        </Button>
      </form>
    </div>
  );
}

const Field = ({ label, children }) => (<div className="grid gap-1.5"><Label className="text-xs uppercase tracking-wider font-semibold">{label}</Label>{children}</div>);
