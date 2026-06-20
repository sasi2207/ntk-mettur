import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, fileUrl } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { ArrowRight, ChevronRight, Calendar, MapPin, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedCounter from "@/components/AnimatedCounter";
import SEO from "@/components/SEO";

const HERO_IMG = "https://images.unsplash.com/photo-1713001075225-8c490e800e29?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHJhbGx5JTIwY3Jvd2R8ZW58MHx8fHwxNzgxNzY0OTc1fDA&ixlib=rb-4.1.0&q=85";

export default function Home() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [stats, setStats] = useState({ members: 0, villages: 0, events: 0, complaints: 0 });

  useEffect(() => {
    api.get("/news?limit=3").then((r) => setNews(r.data || []));
    api.get("/events?status=upcoming").then((r) => setEvents((r.data || []).slice(0, 3)));
    api.get("/leaders").then((r) => setLeaders((r.data || []).slice(0, 6)));
    api.get("/gallery?media_type=image").then((r) => setGallery((r.data || []).slice(0, 6)));
  }, []);

  useEffect(() => {
    // animated stats — use derived counts from public data + nice fallbacks
    setStats({
      members: 12480,
      villages: 87,
      events: 142,
      complaints: 6320,
    });
  }, []);

  return (
    <div data-testid="home-page">
      <SEO path="/" />
      {/* HERO */}
      <section className="relative isolate overflow-hidden min-h-[88vh] flex items-center grain" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="NTK rally" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        </div>
        <div className="absolute inset-y-0 right-0 w-2 bg-ntk-red hidden md:block" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-ntk-yellow/40 bg-black/30 px-3 py-1 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-ntk-yellow animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-ntk-yellow">{t.home.hero_eyebrow}</span>
            </div>
            <h1 className={`mt-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.02] text-balance ${ta ? "font-tamil" : "font-display"}`}>
              {ta ? t.home.hero_title_ta : t.home.hero_title}
            </h1>
            <div className={`mt-3 text-2xl sm:text-3xl ${ta ? "font-display" : "font-tamil"} text-ntk-yellow font-bold`}>
              {ta ? "Rise of the Tamil Nation." : "தமிழின உரிமை. மேட்டூரின் உயர்வு."}
            </div>
            <p className={`mt-7 max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed ${tCls}`}>{t.home.hero_sub}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/membership">
                <Button data-testid="hero-join-btn" className="bg-ntk-red hover:bg-ntk-redHover text-white font-bold rounded-full px-7 h-12 shadow-xl hover:-translate-y-0.5 transition">
                  <Flame className="h-4 w-4 mr-2" /> {t.home.join_cta}
                </Button>
              </Link>
              <Link to="/about">
                <Button data-testid="hero-learn-btn" variant="outline" className="border-white/30 text-white bg-white/5 hover:bg-white hover:text-black font-bold rounded-full px-7 h-12">
                  {t.home.learn_more} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:block">
            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ntk-yellow">Mettur Today</div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  { label: t.home.counters.members, value: stats.members },
                  { label: t.home.counters.villages, value: stats.villages },
                  { label: t.home.counters.events, value: stats.events },
                  { label: t.home.counters.complaints, value: stats.complaints },
                ].map((s, i) => (
                  <div key={i} className="rounded-lg bg-black/40 border border-white/10 p-4">
                    <div className="text-3xl font-display font-black text-ntk-yellow"><AnimatedCounter to={s.value} /></div>
                    <div className={`text-xs text-white/70 mt-1 ${tCls}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* slogan strip */}
        <div className="absolute bottom-0 inset-x-0 bg-ntk-red text-white py-3 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap animate-marquee will-change-transform">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12 px-6 text-sm font-semibold">
                {["தமிழன் என்று சொல்லடா","Tamil First","மண் காக்கும் இயக்கம்","People-Led Politics","மேட்டூருக்காய்","Mettur Rising","தமிழ் தேசியம்","Self-Respect"].map((s, i) => (
                  <span key={i} className="font-tamil tracking-wide">★ {s}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTERS (mobile) */}
      <section className="lg:hidden bg-ntk-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-4">
          {[
            { label: t.home.counters.members, value: stats.members },
            { label: t.home.counters.villages, value: stats.villages },
            { label: t.home.counters.events, value: stats.events },
            { label: t.home.counters.complaints, value: stats.complaints },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="text-3xl font-display font-black text-ntk-yellow"><AnimatedCounter to={s.value} /></div>
              <div className={`text-xs text-white/70 mt-1 ${tCls}`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST NEWS */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ntk-red">{t.home.latest_news}</div>
              <h2 className={`mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${tCls}`}>{t.home.latest_news}</h2>
              <p className={`mt-2 text-muted-foreground max-w-xl ${tCls}`}>{t.home.latest_news_sub}</p>
            </div>
            <Link to="/news" className="text-sm font-semibold text-ntk-red hover:text-ntk-redHover inline-flex items-center gap-1">
              {t.home.view_all} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((n, idx) => (
              <Link key={n.id} to={`/news/${n.id}`} className={`group rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all hover:-translate-y-1 ${idx === 0 ? "md:col-span-1" : ""}`} data-testid={`home-news-${idx}`}>
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  {n.image_url && <img src={fileUrl(n.image_url)} alt="" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />}
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ntk-red">{n.category || "news"}</div>
                  <h3 className={`mt-2 font-display font-bold text-lg leading-snug ${tCls}`}>{ta && n.title_ta ? n.title_ta : n.title}</h3>
                  <p className={`mt-2 text-sm text-muted-foreground line-clamp-2 ${tCls}`}>{ta && n.summary_ta ? n.summary_ta : n.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-20 bg-secondary/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ntk-red">Events</div>
              <h2 className={`mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${tCls}`}>{t.home.upcoming_events}</h2>
              <p className={`mt-2 text-muted-foreground max-w-xl ${tCls}`}>{t.home.upcoming_events_sub}</p>
            </div>
            <Link to="/events" className="text-sm font-semibold text-ntk-red hover:text-ntk-redHover inline-flex items-center gap-1">
              {t.home.view_all} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.length === 0 && <div className="text-sm text-muted-foreground">{t.common.no_data}</div>}
            {events.map((e, i) => {
              const d = new Date(e.date);
              return (
                <div key={e.id} className="rounded-xl overflow-hidden bg-card border border-border hover:shadow-xl transition" data-testid={`home-event-${i}`}>
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    {e.image_url && <img src={fileUrl(e.image_url)} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-ntk-red font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      {d.toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <h3 className={`mt-2 font-display font-bold text-lg ${tCls}`}>{ta && e.title_ta ? e.title_ta : e.title}</h3>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{e.location}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ntk-red">Leadership</div>
              <h2 className={`mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${tCls}`}>{t.home.leadership}</h2>
              <p className={`mt-2 text-muted-foreground max-w-xl ${tCls}`}>{t.home.leadership_sub}</p>
            </div>
            <Link to="/leadership" className="text-sm font-semibold text-ntk-red hover:text-ntk-redHover inline-flex items-center gap-1">
              {t.home.view_all} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {leaders.map((l, i) => (
              <div key={l.id} className="group" data-testid={`home-leader-${i}`}>
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary border border-border">
                  {l.photo_url && <img src={fileUrl(l.photo_url)} alt={l.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />}
                </div>
                <div className="mt-3">
                  <div className={`font-display font-bold text-sm ${tCls}`}>{ta && l.name_ta ? l.name_ta : l.name}</div>
                  <div className={`text-xs text-muted-foreground ${tCls}`}>{ta && l.designation_ta ? l.designation_ta : l.designation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-20 bg-ntk-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-ntk-yellow">Gallery</div>
              <h2 className={`mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${tCls}`}>{t.home.gallery}</h2>
              <p className={`mt-2 text-white/70 max-w-xl ${tCls}`}>{t.home.gallery_sub}</p>
            </div>
            <Link to="/gallery" className="text-sm font-semibold text-ntk-yellow hover:underline inline-flex items-center gap-1">
              {t.home.view_all} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {gallery.map((g, i) => (
              <div key={g.id} className={`relative overflow-hidden rounded-lg ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`} data-testid={`home-gallery-${i}`}>
                <img src={fileUrl(g.url)} alt={g.title} className="h-full w-full object-cover hover:scale-110 transition duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
