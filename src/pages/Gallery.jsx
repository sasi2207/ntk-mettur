import React, { useEffect, useMemo, useState } from "react";
import { api, fileUrl } from "@/lib/api";
import { useLang } from "@/contexts/LanguageContext";
import { Play, X } from "lucide-react";

export default function Gallery() {
  const { t, lang } = useLang();
  const ta = lang === "ta";
  const tCls = ta ? "font-tamil" : "";
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [album, setAlbum] = useState("all");
  const [preview, setPreview] = useState(null);

  useEffect(() => { api.get("/gallery").then((r) => setItems(r.data || [])); }, []);

  const albums = useMemo(() => ["all", ...new Set(items.map((i) => i.album).filter(Boolean))], [items]);
  const filtered = useMemo(() => items.filter((i) => {
    if (tab !== "all" && i.media_type !== (tab === "images" ? "image" : "video")) return false;
    if (album !== "all" && i.album !== album) return false;
    return true;
  }), [items, tab, album]);

  return (
    <div data-testid="gallery-page">
      <section className="bg-ntk-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-ntk-yellow">Media</div>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter">{t.gallery.title}</h1>
          <p className={`mt-3 text-white/75 max-w-2xl ${tCls}`}>{t.gallery.sub}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex p-1 rounded-full border border-border bg-secondary/40">
            {[
              { k: "all", l: t.gallery.all },
              { k: "images", l: t.gallery.images },
              { k: "videos", l: t.gallery.videos },
            ].map((x) => (
              <button key={x.k} onClick={() => setTab(x.k)} data-testid={`gallery-tab-${x.k}`}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${tab === x.k ? "bg-ntk-red text-white" : "text-foreground/70"}`}>{x.l}</button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {albums.map((a) => (
              <button key={a} onClick={() => setAlbum(a)} data-testid={`gallery-album-${a}`}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition ${
                  album === a ? "bg-ntk-black text-white border-ntk-black" : "border-border hover:border-ntk-red"
                }`}>{a}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.length === 0 && <div className="col-span-4 text-sm text-muted-foreground">{t.common.no_data}</div>}
          {filtered.map((g, i) => (
            <button key={g.id} onClick={() => setPreview(g)} className="group relative aspect-square overflow-hidden rounded-lg border border-border" data-testid={`gallery-item-${i}`}>
              <img src={fileUrl(g.thumbnail_url || g.url)} alt={g.title} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" />
              {g.media_type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-12 w-12 rounded-full bg-white/90 text-ntk-red flex items-center justify-center">
                    <Play className="h-5 w-5" fill="currentColor" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-left">
                <div className={`text-xs font-semibold text-white ${tCls}`}>{ta && g.title_ta ? g.title_ta : g.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setPreview(null)} data-testid="gallery-preview">
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white text-black flex items-center justify-center"><X className="h-5 w-5" /></button>
          {preview.media_type === "video" ? (
            <video src={fileUrl(preview.url)} controls autoPlay className="max-h-[90vh] max-w-[90vw] rounded-lg" onClick={(e) => e.stopPropagation()} />
          ) : (
            <img src={fileUrl(preview.url)} alt="" className="max-h-[90vh] max-w-[90vw] rounded-lg" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}
    </div>
  );
}
