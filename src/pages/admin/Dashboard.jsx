import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Users, UserCheck, CalendarDays, MessageSquareWarning, Newspaper, Mail, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const { admin } = useAuth();
  const { t } = useLang();
  const [stats, setStats] = useState({});
  useEffect(() => { api.get("/admin/stats").then((r) => setStats(r.data)); }, []);

  const cards = [
    { key: "members", label: t.admin.total_members, icon: Users, color: "bg-ntk-red" },
    { key: "volunteers", label: t.admin.total_volunteers, icon: UserCheck, color: "bg-ntk-black" },
    { key: "events", label: t.admin.total_events, icon: CalendarDays, color: "bg-ntk-red" },
    { key: "complaints", label: t.admin.total_complaints, icon: MessageSquareWarning, color: "bg-ntk-black" },
    { key: "pending_complaints", label: t.admin.pending_complaints, icon: AlertCircle, color: "bg-amber-500" },
    { key: "news", label: t.admin.total_news, icon: Newspaper, color: "bg-ntk-red" },
    { key: "contacts", label: t.admin.total_contacts, icon: Mail, color: "bg-ntk-black" },
  ];

  return (
    <div data-testid="admin-dashboard">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-ntk-red">{t.admin.welcome}</div>
        <h1 className="mt-1 text-3xl font-display font-bold">{admin?.name || "Admin"}</h1>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.key} className="rounded-xl border border-border bg-card p-5" data-testid={`stat-${c.key}`}>
              <div className="flex items-start justify-between">
                <div className={`h-10 w-10 rounded-md ${c.color} text-white flex items-center justify-center`}><Icon className="h-5 w-5" /></div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">live</div>
              </div>
              <div className="mt-4 text-3xl font-display font-black">{stats[c.key] ?? 0}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-ntk-red">Tip</div>
          <h3 className="mt-1 font-display font-bold text-lg">Manage complaints quickly</h3>
          <p className="mt-2 text-sm text-muted-foreground">Update complaint status to Processing or Resolved and post a public reply.</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-ntk-red">Tip</div>
          <h3 className="mt-1 font-display font-bold text-lg">Publish news in both languages</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add Tamil titles & content alongside English for broader reach.</p>
        </div>
      </div>
    </div>
  );
}
