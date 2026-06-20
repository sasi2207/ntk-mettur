import React from "react";
import { useLang } from "@/contexts/LanguageContext";
import { CheckCircle2, MapPin, Lightbulb, AlertTriangle, Award } from "lucide-react";

export default function Constituency() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";

  const Section = ({ icon: Icon, title, children, accent }) => (
    <section className="py-10 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-md flex items-center justify-center ${accent}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className={`text-2xl sm:text-3xl font-display font-bold ${tCls}`}>{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );

  return (
    <div data-testid="constituency-page">
      <section className="relative isolate overflow-hidden text-white bg-ntk-black">
        <div className="absolute inset-0 opacity-50">
          <img src="https://images.unsplash.com/photo-1670992230437-2ca0980e8126?w=1600&q=85" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Mettur</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-tighter">{t.constituency.title}</h1>
          <p className={`mt-4 max-w-2xl text-white/80 ${tCls}`}>{t.constituency.overview_p}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Section icon={MapPin} title={t.constituency.villages_h} accent="bg-ntk-red">
          <p className={`text-muted-foreground ${tCls}`}>{t.constituency.villages_p}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {t.constituency.villages.map((v) => (
              <span key={v} className={`inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1.5 text-sm ${tCls}`}>{v}</span>
            ))}
          </div>
        </Section>

        <Section icon={Lightbulb} title={t.constituency.plans_h} accent="bg-ntk-red">
          <ul className="grid md:grid-cols-2 gap-4">
            {t.constituency.plans.map((p, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border p-4 bg-card">
                <CheckCircle2 className="h-5 w-5 text-ntk-red shrink-0 mt-0.5" />
                <span className={`text-sm ${tCls}`}>{p}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={AlertTriangle} title={t.constituency.issues_h} accent="bg-ntk-black">
          <ul className="grid md:grid-cols-2 gap-4">
            {t.constituency.issues.map((p, i) => (
              <li key={i} className={`rounded-xl border-l-4 border-ntk-red bg-card p-4 text-sm ${tCls}`}>{p}</li>
            ))}
          </ul>
        </Section>

        <Section icon={Award} title={t.constituency.achievements_h} accent="bg-ntk-red">
          <ul className="grid md:grid-cols-2 gap-4">
            {t.constituency.achievements.map((p, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-ntk-yellow/10 border border-ntk-yellow/40 p-4">
                <Award className="h-5 w-5 text-ntk-red shrink-0 mt-0.5" />
                <span className={`text-sm font-medium ${tCls}`}>{p}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
