
import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import {
  Menu,
  X,
  Flame,
  ChevronDown,
  Newspaper,
  CalendarDays,
  Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/images/NTK-LOGO.jpg"

export default function Navbar() {
  const { lang, t } = useLang();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setMobileMediaOpen(false);
  }, [location.pathname]);

  // Auto close on scroll


  const links = [
    { to: "/", label: t.nav.home, key: "home" },
    { to: "/about", label: t.nav.about, key: "about" },
    { to: "/constituency", label: t.nav.constituency, key: "constituency" },
    { to: "/leadership", label: t.nav.leadership, key: "leadership" },
    { to: "/contact", label: t.nav.contact, key: "contact" },
  ];

  const mediaLinks = [
    {
      to: "/news",
      label: t.nav.news,
      icon: <Newspaper className="w-4 h-4 text-red-600" />,
      key: "news",
    },
    {
      to: "/events",
      label: t.nav.events,
      icon: <CalendarDays className="w-4 h-4 text-red-600" />,
      key: "events",
    },
    {
      to: "/gallery",
      label: t.nav.gallery,
      icon: <Images className="w-4 h-4 text-red-600" />,
      key: "gallery",
    },
  ];

  const closeMenu = () => {
    setOpen(false);
    setMobileMediaOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-red-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
     <Link
  to="/"
  className="absolute left-1/2 gap-2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center"
>
 <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0">
    <img
      src={logo}
      alt="NTK Logo"
      className="w-full h-full  object-cover object-center"
    />
  </div>

  <div className="flex flex-col items-center navbar-brand ntk-brand text-center">
    <span className="font-bold ntk-title text-sm md:text-lg text-red-700 leading-tight">
      நாம் தமிழர் கட்சி - மேட்டூர்
    </span>

    <small className="text-[10px] ntk-slogan md:text-xs text-gray-600">
      பிறப்பொக்கும் எல்லா உயிர்க்கும்!
    </small>
  </div>
</Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8">

            {links.map((link) => (
              <NavLink
                key={link.key}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition ${
                    isActive
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Premium Dropdown */}
            <div className="relative group">

              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600">
                மீடியா

                <ChevronDown className="w-4 h-4 transition duration-300 group-hover:rotate-180" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block z-50">

                <div className="w-60 bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden">

                  {mediaLinks.map((item) => (
                    <NavLink
                      key={item.key}
                      to={item.to}
                      className="flex items-center gap-3 px-6 py-4 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ))}

                </div>

              </div>
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            <Link to="/donate" className="hidden md:flex">
              <Button
                variant="outline"
                className="rounded-full border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-black"
              >
                Donate
              </Button>
            </Link>

            <Link to="/membership" className="hidden md:flex">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 rounded-full hover:scale-105 transition">
                <Flame className="w-4 h-4 mr-2" />
                {t.nav.join}
              </Button>
            </Link>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden h-10 w-10 border rounded-xl flex items-center justify-center"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
     <div
  className={`fixed top-0 right-0 h-screen w-80 bg-white z-50 shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-100 transition-transform duration-500 lg:hidden ${
    open ? "translate-x-0" : "translate-x-full"
  }`}
>
        <div className="p-5">

          <div className="flex justify-between mb-6">
            <h2 className="font-bold text-red-600">Menu</h2>

            <button onClick={closeMenu}>
              <X />
            </button>
          </div>

          <div className="space-y-2">

            {links.map((link) => (
              <NavLink
                key={link.key}
                to={link.to}
                onClick={closeMenu}
                className="block px-4 py-3 rounded-xl hover:bg-red-50"
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile Media */}
            <div className="border rounded-2xl">

              <button
                className="w-full flex justify-between px-4 py-3"
                onClick={() => setMobileMediaOpen(!mobileMediaOpen)}
              >
                <span>மீடியா</span>

                <ChevronDown
                  className={`transition ${
                    mobileMediaOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${
                  mobileMediaOpen ? "max-h-60" : "max-h-0"
                }`}
              >
                {mediaLinks.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-red-50"
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <Link to="/donate" onClick={closeMenu}>
              <Button
                variant="outline"
                className="w-full mt-3 border-yellow-500 text-yellow-600"
              >
                Donate
              </Button>
            </Link>

            <Link to="/membership" onClick={closeMenu}>
              <Button className="w-full mt-3 bg-red-600 hover:bg-red-700">
                <Flame className="w-4 h-4 mr-2" />
                {t.nav.join}
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}

