import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  const { t, lang } = useLang();
  const { settings } = useSettings();
  const tamilCls = lang === "ta" ? "font-tamil" : "";
  const social = [
    { Icon: Facebook, url: settings.facebook, key: "fb" },
    { Icon: Twitter,  url: settings.twitter,  key: "tw" },
    { Icon: Instagram,url: settings.instagram,key: "ig" },
    { Icon: Youtube,  url: settings.youtube,  key: "yt" },
  ];
  return (
    <footer className="mt-24 border-t border-border bg-ntk-black text-white relative" data-testid="site-footer">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ntk-red via-ntk-yellow to-ntk-red" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-ntk-red flex items-center justify-center font-display font-black text-xl">ந</div>
            <div>
              <div className="font-display font-extrabold text-lg">{t.party_name}</div>
              <div className={`text-xs text-white/70 ${tamilCls}`}>{t.constituency_name}</div>
            </div>
          </div>
          <p className={`mt-5 text-sm text-white/70 max-w-md leading-relaxed ${tamilCls}`}>{t.footer.tagline}</p>
          <div className="mt-5 flex gap-3">
            {social.map(({ Icon, url, key }) => (
              <a key={key} href={url || "#"} target="_blank" rel="noopener noreferrer"
                 className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/20 hover:bg-ntk-red hover:border-ntk-red transition" data-testid={`footer-social-${key}`}>
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <Link to="/donate" data-testid="footer-donate-link" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ntk-yellow text-ntk-black px-5 py-2 text-sm font-bold hover:scale-105 transition">
            <Heart className="h-4 w-4" /> Donate
          </Link>
        </div>
        <div className="md:col-span-3">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-ntk-yellow">{t.footer.links}</div>
          <ul className="mt-4 grid gap-2 text-sm text-white/80">
            {[
              { to: "/about", label: t.nav.about },
              { to: "/constituency", label: t.nav.constituency },
              { to: "/leadership", label: t.nav.leadership },
              { to: "/news", label: t.nav.news },
              { to: "/events", label: t.nav.events },
              { to: "/gallery", label: t.nav.gallery },
              { to: "/membership", label: t.nav.membership },
              { to: "/complaint", label: t.nav.complaint },
              { to: "/complaint/track", label: lang === "ta" ? "புகார் நிலை" : "Track Complaint" },
              { to: "/donate", label: lang === "ta" ? "நன்கொடை" : "Donate" },
            ].map((l) => (
              <li key={l.to}><Link to={l.to} className={`hover:text-ntk-yellow ${tamilCls}`}>{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-ntk-yellow">{t.footer.contact}</div>
          <ul className="mt-4 grid gap-3 text-sm text-white/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-ntk-yellow" /><span className={tamilCls}>{lang === "ta" ? settings.address_ta : settings.address_en}</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-ntk-yellow" /><a href={`tel:${settings.phone}`} className="hover:text-ntk-yellow">{settings.phone}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-ntk-yellow" /><a href={`mailto:${settings.email}`} className="hover:text-ntk-yellow">{settings.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} {t.party_name} — Mettur. {t.footer.rights}</div>
          <Link to="/admin/login" className="hover:text-ntk-yellow" data-testid="footer-admin-link">{t.footer.admin}</Link>
        </div>
      </div>
    </footer>
  );
}
