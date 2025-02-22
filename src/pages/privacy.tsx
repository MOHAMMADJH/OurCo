import React from "react";
import Navbar from "@/components/navigation/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <section className="bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-invert mx-auto max-w-3xl text-right"
            >
              <h1 className="mb-8 text-4xl font-bold text-white">
                سياسة الخصوصية
              </h1>

              <div className="space-y-6 text-gray-300">
                <section>
                  <h2 className="text-2xl font-bold text-white">
                    جمع المعلومات
                  </h2>
                  <p>
                    نحن نجمع المعلومات التي تقدمها لنا مباشرة عند استخدام
                    خدماتنا. قد تتضمن هذه المعلومات:
                  </p>
                  <ul className="list-disc space-y-2 pr-6">
                    <li>الاسم وعنوان البريد الإلكتروني</li>
                    <li>معلومات الاتصال</li>
                    <li>تفاصيل المشروع</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white">
                    استخدام المعلومات
                  </h2>
                  <p>
                    نستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسينها، بما في
                    ذلك:
                  </p>
                  <ul className="list-disc space-y-2 pr-6">
                    <li>تقديم الخدمات المطلوبة</li>
                    <li>التواصل معك بخصوص خدماتنا</li>
                    <li>تحسين تجربة المستخدم</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white">
                    حماية المعلومات
                  </h2>
                  <p>
                    نحن نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير
                    المصرح به أو التغيير أو الإفصاح أو الإتلاف.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white">
                    التواصل معنا
                  </h2>
                  <p>
                    إذا كان لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا
                    عبر:
                  </p>
                  <ul className="list-disc space-y-2 pr-6">
                    <li>البريد الإلكتروني: privacy@example.com</li>
                    <li>الهاتف: +966 12 345 6789</li>
                  </ul>
                </section>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;
