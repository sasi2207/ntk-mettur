import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api, fileUrl } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

export function NewsList() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [news, setNews] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");

  const categories = ["all", "party", "welfare", "culture", "general"];

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "all") params.set("category", category);
    api.get(`/news?${params}`).then((r) => setNews(r.data || []));
  }, [q, category]);

  return (
    <div data-testid="news-page">
      <section className="bg-ntk-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Press</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{t.news.title}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{t.news.sub}</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input data-testid="news-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.news.search} className="pl-9 h-11" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} data-testid={`news-cat-${c}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider border transition ${
                  category === c ? "bg-ntk-red text-white border-ntk-red" : "border-border hover:border-ntk-red"
                }`}>{c === "all" ? t.news.all : c}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length === 0 && <div className="text-sm text-muted-foreground">{t.common.no_data}</div>}
          {news.map((n, i) => (
            <Link key={n.id} to={`/news/${n.id}`} className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all hover:-translate-y-1" data-testid={`news-card-${i}`}>
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                {n.image_url && <img src={fileUrl(n.image_url)} alt="" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />}
              </div>
              <div className="p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ntk-red">{n.category} · {new Date(n.date).toLocaleDateString()}</div>
                <h3 className={`mt-2 font-display font-bold text-lg leading-snug ${tCls}`}>{ta && n.title_ta ? n.title_ta : n.title}</h3>
                <p className={`mt-2 text-sm text-muted-foreground line-clamp-3 ${tCls}`}>{ta && n.summary_ta ? n.summary_ta : n.summary}</p>
                <div className="mt-3 text-sm font-bold text-ntk-red">{t.news.read_more} →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewsDetail() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [item, setItem] = useState(null);
  const nav = useNavigate();
  useEffect(() => { api.get(`/news/${id}`).then((r) => setItem(r.data)).catch(() => nav("/news")); }, [id, nav]);
  if (!item) return <div className="max-w-3xl mx-auto p-10 text-sm text-muted-foreground">{t.common.loading}</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12" data-testid="news-detail">
      <Link to="/news" className="inline-flex items-center gap-2 text-sm text-ntk-red font-semibold mb-6"><ArrowLeft className="h-4 w-4" />Back</Link>
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-ntk-red">{item.category} · {new Date(item.date).toLocaleDateString()}</div>
      <h1 className={`mt-3 text-3xl sm:text-4xl font-display font-black tracking-tight ${tCls}`}>{ta && item.title_ta ? item.title_ta : item.title}</h1>
      {item.image_url && <img src={fileUrl(item.image_url)} alt="" className="mt-6 rounded-xl w-full aspect-video object-cover" />}
      <div className={`mt-8 text-base leading-relaxed text-foreground/90 whitespace-pre-line ${tCls}`}>
        {ta && item.content_ta ? item.content_ta : item.content}
      </div>
    </article>
  );
}
