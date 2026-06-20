import React from "react";
import "@/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Constituency from "@/pages/Constituency";
import Leadership from "@/pages/Leadership";
import { NewsList, NewsDetail } from "@/pages/News";
import Events from "@/pages/Events";
import Gallery from "@/pages/Gallery";
import Membership from "@/pages/Membership";
import Volunteer from "@/pages/Volunteer";
import Complaint from "@/pages/Complaint";
import ComplaintTrack from "@/pages/ComplaintTrack";
import Donate from "@/pages/Donate";
import MemberCard from "@/pages/MemberCard";
import Contact from "@/pages/Contact";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminMembers from "@/pages/admin/Members";
import AdminVolunteers from "@/pages/admin/Volunteers";
import AdminLeaders from "@/pages/admin/Leaders";
import AdminNews from "@/pages/admin/News";
import AdminEvents from "@/pages/admin/Events";
import AdminGallery from "@/pages/admin/Gallery";
import AdminComplaints from "@/pages/admin/Complaints";
import AdminContacts from "@/pages/admin/Contacts";
import AdminDonations from "@/pages/admin/Donations";
import AdminSettings from "@/pages/admin/Settings";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/constituency", element: <Constituency /> },
      { path: "/leadership", element: <Leadership /> },
      { path: "/news", element: <NewsList /> },
      { path: "/news/:id", element: <NewsDetail /> },
      { path: "/events", element: <Events /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/membership", element: <Membership /> },
      { path: "/volunteer", element: <Volunteer /> },
      { path: "/complaint", element: <Complaint /> },
      { path: "/complaint/track", element: <ComplaintTrack /> },
      { path: "/donate", element: <Donate /> },
      { path: "/id/:id", element: <MemberCard /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
  { path: "/admin/login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "members", element: <AdminMembers /> },
      { path: "volunteers", element: <AdminVolunteers /> },
      { path: "leaders", element: <AdminLeaders /> },
      { path: "news", element: <AdminNews /> },
      { path: "events", element: <AdminEvents /> },
      { path: "gallery", element: <AdminGallery /> },
      { path: "complaints", element: <AdminComplaints /> },
      { path: "contacts", element: <AdminContacts /> },
      { path: "donations", element: <AdminDonations /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <SettingsProvider>
            <AuthProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </SettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
