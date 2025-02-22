import React from "react";
import { Link } from "react-router-dom";
import { COMPANY_NAME } from "@/lib/i18n";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">{COMPANY_NAME}</h3>
            <p className="text-sm">
              نقدم حلولاً رقمية مبتكرة لتمكين نجاح عملائنا في العصر الرقمي
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white">
                  معرض الأعمال
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">مصادر</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="hover:text-white">
                  المدونة
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">
              تواصل معنا
            </h4>
            <ul className="space-y-2 text-sm">
              <li>الهاتف: +966 12 345 6789</li>
              <li>البريد: info@example.com</li>
              <li>العنوان: الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME}. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
