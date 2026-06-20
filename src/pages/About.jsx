import React from "react";
import { useLang } from "@/contexts/LanguageContext";

const PageHeader = ({ eyebrow, title, sub }) => (
  <header className="relative isolate overflow-hidden bg-ntk-black text-white pt-16 pb-12">
    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,#D71920_0%,transparent_50%)]" />
    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-ntk-red via-ntk-yellow to-ntk-red" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">{eyebrow}</div>
      <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{title}</h1>
      {sub && <p className="mt-3 text-white/75 max-w-2xl">{sub}</p>}
    </div>
  </header>
);

export default function About() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";

  const Block = ({ title, body, img }) => (
    <div className="grid md:grid-cols-2 gap-10 items-center py-12 border-b border-border last:border-0">
      <div>
        <h2 className={`text-2xl sm:text-3xl font-display font-bold ${tCls}`}>{title}</h2>
        <p className={`mt-4 text-base text-muted-foreground leading-relaxed ${tCls}`}>{body}</p>
      </div>
      <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-secondary">
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  );

  return (
    <div data-testid="about-page">
      <PageHeader eyebrow="NTK" title={t.about.title} sub={t.tagline} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Block title={t.about.history_h} body={t.about.history_p}
          img="https://images.unsplash.com/photo-1713001075225-8c490e800e29?w=1200&q=80" />
        <Block title={t.about.vision_h} body={t.about.vision_p}
          img="https://images.pexels.com/photos/30424953/pexels-photo-30424953.jpeg" />
        <Block title={t.about.mission_h} body={t.about.mission_p}
          img="https://images.pexels.com/photos/5399393/pexels-photo-5399393.jpeg" />
        <Block title={t.about.founder_h} body={t.about.founder_p}
          img="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=1200&q=80" />

        <div className="py-12">
          <h2 className={`text-2xl sm:text-3xl font-display font-bold ${tCls}`}>{t.about.principles_h}</h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-4">
            {t.about.principles.map((p, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border p-5 bg-card">
                <span className="h-7 w-7 shrink-0 rounded-md bg-ntk-red text-white font-display font-bold flex items-center justify-center">{i + 1}</span>
                <span className={`text-sm leading-relaxed ${tCls}`}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
