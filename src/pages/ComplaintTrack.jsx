import React, { useState } from "react";
import { api, formatErr } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ShieldCheck, Clock, AlertCircle, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";

const STATUS_META = {
  Pending:    { Icon: Clock,        cls: "bg-amber-500/15 text-amber-700 border-amber-500/40" },
  Processing: { Icon: AlertCircle,  cls: "bg-ntk-yellow/20 text-foreground border-ntk-yellow/50" },
  Resolved:   { Icon: ShieldCheck,  cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/40" },
};

export default function ComplaintTrack() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [mobile, setMobile] = useState("");
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setResult(null); setBusy(true);
    try {
      const r = await api.get(`/complaints/track?mobile=${encodeURIComponent(mobile)}&id=${encodeURIComponent(id)}`);
      setResult(r.data);
    } catch (ex) {
      setErr(formatErr(ex.response?.data?.detail) || (ta ? "புகார் கிடைக்கவில்லை" : "Complaint not found"));
    } finally { setBusy(false); }
  };

  const meta = result ? STATUS_META[result.status] || STATUS_META.Pending : null;

  return (
    <div data-testid="track-page">
      <SEO title={ta ? "புகார் கண்காணிப்பு" : "Track Complaint"} path="/complaint/track" />
      <section className="bg-ntk-black text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Public Tracking</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{ta ? "புகார் நிலையை கண்காணி" : "Track Your Complaint"}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{ta ? "உங்கள் கைபேசி எண் மற்றும் புகார் ID யை பயன்படுத்தி நிலை பாருங்கள்." : "Use your mobile number + complaint ID to see the current status and any reply from the team."}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 grid gap-6">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 grid gap-5" data-testid="track-form">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wider font-semibold">{ta ? "கைபேசி எண்" : "Mobile Number"}</Label>
              <Input data-testid="track-mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs uppercase tracking-wider font-semibold">{ta ? "புகார் ID" : "Complaint ID"}</Label>
              <Input data-testid="track-id" value={id} onChange={(e) => setId(e.target.value)} required placeholder="xxxxxxxx-xxxx-..." />
            </div>
          </div>
          <Button data-testid="track-submit" disabled={busy} type="submit" className="bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full h-12 px-8 w-fit">
            <Search className="h-4 w-4 mr-2" />{busy ? "..." : (ta ? "கண்காணி" : "Track")}
          </Button>
          {err && <div className="text-sm text-destructive" data-testid="track-error">{err}</div>}
        </form>

        {result && meta && (
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 grid gap-4" data-testid="track-result">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Complainant</div>
                <div className="font-display font-bold text-lg mt-1">{result.name}</div>
                <div className="text-xs text-muted-foreground">{result.mobile} {result.village && `· ${result.village}`}</div>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-bold ${meta.cls}`}>
                <meta.Icon className="h-4 w-4" /> {result.status}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{result.category || "General"}</div>
              <p className="mt-1 text-sm whitespace-pre-line">{result.description}</p>
            </div>
            {result.reply && (
              <div className="rounded-xl border border-ntk-red/30 bg-ntk-red/5 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-ntk-red flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" />Official reply</div>
                <p className="mt-1 text-sm whitespace-pre-line">{result.reply}</p>
              </div>
            )}
            <div className="text-xs text-muted-foreground">Filed on {new Date(result.created_at).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
