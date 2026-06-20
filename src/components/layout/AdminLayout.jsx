import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LayoutDashboard, Users, UserCheck, Newspaper, CalendarDays, Image as ImageIcon, MessageSquareWarning, Mail, LogOut, Crown, Moon, Sun, Heart, Settings as SettingsIcon } from "lucide-react";

const items = [
  { to: "/admin", end: true, icon: LayoutDashboard, key: "dashboard" },
  { to: "/admin/members", icon: Users, key: "members" },
  { to: "/admin/volunteers", icon: UserCheck, key: "volunteers" },
  { to: "/admin/leaders", icon: Crown, key: "leaders" },
  { to: "/admin/news", icon: Newspaper, key: "news" },
  { to: "/admin/events", icon: CalendarDays, key: "events" },
  { to: "/admin/gallery", icon: ImageIcon, key: "gallery" },
  { to: "/admin/complaints", icon: MessageSquareWarning, key: "complaints" },
  { to: "/admin/contacts", icon: Mail, key: "contacts" },
  { to: "/admin/donations", icon: Heart, key: "donations" },
  { to: "/admin/settings", icon: SettingsIcon, key: "settings" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { t } = useLang();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  const onLogout = async () => {
    await logout();
    nav("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-secondary/40">
      <aside className="hidden md:flex md:flex-col w-64 bg-ntk-black text-white border-r border-white/10" data-testid="admin-sidebar">
        <Link to="/" className="px-5 py-5 border-b border-white/10 flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-ntk-red flex items-center justify-center font-display font-black">ந</div>
          <div>
            <div className="font-display font-bold text-sm">NTK Mettur</div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">Admin</div>
          </div>
        </Link>
        <nav className="flex-1 px-3 py-4 grid gap-1 overflow-y-auto">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink key={it.key} to={it.to} end={it.end} data-testid={`admin-nav-${it.key}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${isActive ? "bg-ntk-red text-white" : "text-white/80 hover:bg-white/10"}`}>
                <Icon className="h-4 w-4" />
                <span className="capitalize">{t.admin[it.key]}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 text-xs text-white/60">
          Signed in as<br /><span className="text-white font-medium" data-testid="admin-email">{admin?.email}</span>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border h-14 flex items-center px-4 sm:px-6 justify-between">
          <div className="md:hidden font-display font-bold">NTK Admin</div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggle} className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border" data-testid="admin-theme-toggle">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md bg-ntk-red text-white text-sm font-medium hover:bg-ntk-redHover" data-testid="admin-logout-btn">
              <LogOut className="h-4 w-4" /> {t.admin.logout}
            </button>
          </div>
        </header>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b border-border bg-background">
          {items.map((it) => (
            <NavLink key={it.key} to={it.to} end={it.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-md text-xs ${isActive ? "bg-ntk-red text-white" : "bg-secondary"}`}>
              {t.admin[it.key]}
            </NavLink>
          ))}
        </nav>
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
