import React, { useEffect, useMemo, useState } from "react";
import { api, fileUrl } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function Events() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState("upcoming");

  useEffect(() => { api.get("/events").then((r) => setEvents(r.data || [])); }, []);

  const filtered = useMemo(() => events.filter((e) => e.status === tab), [events, tab]);

  return (
    <div data-testid="events-page">
      <section className="bg-ntk-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Calendar</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{t.events.title}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{t.events.sub}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="inline-flex p-1 rounded-full border border-border bg-secondary/40 mb-8">
          {[
            { k: "upcoming", l: t.events.upcoming },
            { k: "completed", l: t.events.completed },
          ].map((x) => (
            <button key={x.k} onClick={() => setTab(x.k)} data-testid={`events-tab-${x.k}`}
              className={`px-5 py-2 rounded-full text-sm font-bold transition ${tab === x.k ? "bg-ntk-red text-white" : "text-foreground/70"} ${tCls}`}>{x.l}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.length === 0 && <div className="text-sm text-muted-foreground">{t.common.no_data}</div>}
          {filtered.map((e, i) => {
            const d = new Date(e.date);
            return (
              <div key={e.id} className="grid grid-cols-[110px,1fr] gap-5 rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl transition" data-testid={`event-card-${i}`}>
                <div className="bg-ntk-red text-white flex flex-col items-center justify-center p-4">
                  <div className="text-4xl font-display font-black">{d.getDate()}</div>
                  <div className="text-xs uppercase tracking-widest">{d.toLocaleString(lang === "ta" ? "ta-IN" : "en-IN", { month: "short" })}</div>
                  <div className="text-[10px] mt-1 text-white/80">{d.getFullYear()}</div>
                </div>
                <div className="p-5">
                  <h3 className={`font-display font-bold text-lg ${tCls}`}>{ta && e.title_ta ? e.title_ta : e.title}</h3>
                  <p className={`mt-1 text-sm text-muted-foreground line-clamp-2 ${tCls}`}>{ta && e.description_ta ? e.description_ta : e.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {e.location && <div className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.location}</div>}
                    <div className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {d.toLocaleTimeString(lang === "ta" ? "ta-IN" : "en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
