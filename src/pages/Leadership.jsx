import React, { useEffect, useMemo, useState } from "react";
import { api, fileUrl } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";

const wingsConfig = (t) => [
  { key: "district", label: { en: "District", ta: "மாவட்டம்" } },
  { key: "constituency", label: { en: "Constituency", ta: "தொகுதி" } },
  { key: "youth", label: { en: "Youth Wing", ta: "இளைஞரணி" } },
  { key: "women", label: { en: "Women Wing", ta: "மகளிரணி" } },
  { key: "it", label: { en: "IT Wing", ta: "தகவல் தொழில்நுட்பம்" } },
];

export default function Leadership() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [leaders, setLeaders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/leaders").then((r) => setLeaders(r.data || []));
  }, []);

  const wings = wingsConfig(t);
  const filtered = useMemo(() => filter === "all" ? leaders : leaders.filter(l => l.wing === filter), [leaders, filter]);

  return (
    <div data-testid="leadership-page">
      <section className="bg-ntk-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Team</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{t.leadership.title}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{t.leadership.sub}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-2 overflow-x-auto pb-2" data-testid="wing-filters">
          {[{ key: "all", label: { en: "All", ta: "அனைத்தும்" } }, ...wings].map((w) => (
            <button key={w.key} onClick={() => setFilter(w.key)} data-testid={`wing-filter-${w.key}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border transition ${
                filter === w.key ? "bg-ntk-red text-white border-ntk-red" : "border-border hover:border-ntk-red"
              } ${tCls}`}>
              {w.label[lang]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length === 0 && <div className="text-sm text-muted-foreground">{t.common.no_data}</div>}
          {filtered.map((l, i) => (
            <div key={l.id} className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all hover:-translate-y-1" data-testid={`leader-card-${i}`}>
              <div className="aspect-[3/4] overflow-hidden bg-secondary">
                {l.photo_url && <img src={fileUrl(l.photo_url)} alt={l.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />}
              </div>
              <div className="p-4">
                <div className={`font-display font-bold ${tCls}`}>{ta && l.name_ta ? l.name_ta : l.name}</div>
                <div className={`text-xs text-muted-foreground ${tCls}`}>{ta && l.designation_ta ? l.designation_ta : l.designation}</div>
                {l.wing && <span className="mt-2 inline-block rounded bg-ntk-red/10 text-ntk-red text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">{l.wing}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
