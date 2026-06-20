import React from "react";
import { Helmet } from "react-helmet-async";
import { useLang } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

/**
 * SEO — adds open-graph + meta tags. Use on each page.
 */
export default function SEO({ title, description, image, path }) {
  const { lang, t } = useLang();
  const { settings } = useSettings();
  const fullTitle = title ? `${title} — ${t.party_name} Mettur` : `${t.party_name} — Mettur Constituency`;
  const desc = description || (lang === "ta"
    ? "நாம் தமிழர் கட்சி — மேட்டூர் சட்டமன்றத் தொகுதியின் அதிகாரப்பூர்வ வலைதளம்."
    : "Naam Tamilar Katchi — Mettur Assembly Constituency official site. News, events, leadership, complaints and membership.");
  const url = (settings.site_url || "https://ntkmettur.in").replace(/\/$/, "") + (path || "");
  const img = image || "https://images.unsplash.com/photo-1713001075225-8c490e800e29?w=1200&q=80";

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content={lang === "ta" ? "ta_IN" : "en_IN"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      <link rel="canonical" href={url} />
      <meta name="theme-color" content="#D71920" />
    </Helmet>
  );
}
