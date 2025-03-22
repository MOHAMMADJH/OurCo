import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
// import routes from "tempo-routes"; // تعليق هذا الاستيراد إذا كان يسبب مشكلة
import DashboardUsersPage from "./pages/dashboard/users";
import ProfilePage from "./pages/dashboard/profile";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DebugPage from "./pages/dashboard/debug";
import NewBlogPost from "./pages/dashboard/blog/new";
import CommentsPage from "./pages/dashboard/comments";
import BlogEditorPage from "./pages/dashboard/blog/editor";
import BlogPostPage from "./pages/blog/[slug]";

const App = () => {
  // Handle tempo routes - نقوم بتعليق هذا الكود إذا كان يسبب مشكلة
  // const tempoRoutes = useRoutes(import.meta.env.VITE_TEMPO ? routes : []);

  return (
    <>
      {/* {tempoRoutes} */}
      <Routes>
        {/* الصفحات العامة */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* صفحات لوحة التحكم */}
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
        <Route path="/dashboard/projects" element={<ProtectedRoute element={<DashboardProjectsPage />} />} />
        <Route path="/dashboard/services" element={<ProtectedRoute element={<DashboardServicesPage />} requireAdmin={true} />} />
        <Route path="/dashboard/clients" element={<ProtectedRoute element={<DashboardClientsPage />} />} />
        <Route path="/dashboard/users" element={<ProtectedRoute element={<DashboardUsersPage />} requireAdmin={true} />} />
        <Route path="/dashboard/blog" element={<ProtectedRoute element={<DashboardBlogPage />} />} />
        <Route path="/dashboard/blog/new" element={<ProtectedRoute element={<NewBlogPost />} />} />
        <Route path="/dashboard/blog/edit/:id" element={<ProtectedRoute element={<BlogEditPage />} />} />
        <Route path="/dashboard/blog/editor" element={<ProtectedRoute element={<BlogEditorPage />} />} />
        <Route path="/dashboard/comments" element={<ProtectedRoute element={<CommentsPage />} />} />
        <Route path="/dashboard/messages" element={<ProtectedRoute element={<MessagesPage />} />} />
        <Route path="/dashboard/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/dashboard/debug" element={<ProtectedRoute element={<DebugPage />} />} />
        <Route 
          path="/dashboard/settings" 
          element={
            <ProtectedRoute 
              element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(React.lazy(() => import("./pages/dashboard/settings")))}
                </React.Suspense>
              } 
            />
          } 
        />
        
        {/* توجيه للصفحة الرئيسية في حالة عدم العثور على المسار */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
