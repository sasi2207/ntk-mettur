import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { formatErr } from "@/lib/api";

export default function AdminLogin() {
  const { admin, login, loading } = useAuth();
  const { t } = useLang();
  const [email, setEmail] = useState("admin@ntkmettur.in");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  if (!loading && admin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try { await login(email, password); nav("/admin"); }
    catch (er) { setErr(formatErr(er.response?.data?.detail) || "Login failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-ntk-black text-white grid lg:grid-cols-2">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#D71920_0%,transparent_55%)]" />
      <div className="relative hidden lg:flex flex-col justify-between p-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to site</Link>
        <div>
          <div className="h-12 w-12 rounded-md bg-ntk-red flex items-center justify-center font-display font-black text-xl">ந</div>
          <h1 className="mt-6 text-5xl xl:text-6xl font-display font-black tracking-tighter">NTK Mettur<br/>Admin Console</h1>
          <p className="mt-4 text-white/70 max-w-md">Manage members, complaints, news, leaders and events from one place.</p>
        </div>
        <div className="text-xs text-white/40">© NTK Mettur</div>
      </div>
      <div className="relative flex items-center justify-center p-6 lg:p-12 bg-background text-foreground">
        <form onSubmit={onSubmit} className="w-full max-w-md grid gap-5" data-testid="admin-login-form">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-ntk-red">Admin</div>
            <h2 className="mt-2 text-3xl font-display font-bold">{t.admin.login_title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.admin.login_sub}</p>
          </div>
          {err && <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2" data-testid="admin-login-error">{err}</div>}
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-wider font-semibold">{t.admin.email}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input data-testid="admin-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-wider font-semibold">{t.admin.password}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input data-testid="admin-password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 h-11" required />
            </div>
          </div>
          <Button data-testid="admin-login-btn" disabled={busy} className="h-12 bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full">{busy ? "..." : t.admin.login}</Button>
          <Link to="/" className="text-xs text-muted-foreground text-center hover:text-ntk-red">← Back to public site</Link>
        </form>
      </div>
    </div>
  );
}
