import React from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import AboutPage from "./pages/about";
import ServicesPage from "./pages/services";
import PortfolioPage from "./pages/portfolio";
import BlogPage from "./pages/blog";
import FAQPage from "./pages/faq";
import ContactPage from "./pages/contact";
import PrivacyPage from "./pages/privacy";
import DashboardPage from "./pages/dashboard";
import DashboardServicesPage from "./pages/dashboard/services";
import DashboardProjectsPage from "./pages/dashboard/projects";
import DashboardClientsPage from "./pages/dashboard/clients";
import DashboardBlogPage from "./pages/dashboard/blog";
import BlogEditPage from "./pages/dashboard/blog/edit";
import MessagesPage from "./pages/dashboard/messages";
import LoginPage from "./pages/auth/login";
import routes from "tempo-routes";

const App = () => {
  return (
    <>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/projects" element={<DashboardProjectsPage />} />
        <Route path="/dashboard/services" element={<DashboardServicesPage />} />
        <Route path="/dashboard/clients" element={<DashboardClientsPage />} />
        <Route path="/dashboard/blog" element={<DashboardBlogPage />} />
        <Route path="/dashboard/blog/edit" element={<BlogEditPage />} />
        <Route path="/dashboard/blog/edit/:id" element={<BlogEditPage />} />
        <Route path="/dashboard/messages" element={<MessagesPage />} />

        {/* Add this before any catchall route */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
      </Routes>
    </>
  );
};

export default App;
