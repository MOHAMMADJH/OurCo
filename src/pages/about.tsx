import React from "react";
import Navbar from "@/components/navigation/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
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
              className="mb-12 text-center"
            >
              <h1 className="mb-4 text-4xl font-bold text-white">من نحن</h1>
              <p className="text-xl text-gray-300">
                تعرف على فريقنا وقصة نجاحنا
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-gray-700 bg-gray-800">
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-2xl font-bold text-white">
                      رؤيتنا
                    </h2>
                    <p className="text-gray-300">
                      نسعى لأن نكون الشريك الأول في التحول الرقمي للشركات في
                      المنطقة، من خلال تقديم حلول مبتكرة وخدمات عالية الجودة.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-gray-700 bg-gray-800">
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-2xl font-bold text-white">
                      مهمتنا
                    </h2>
                    <p className="text-gray-300">
                      تمكين عملائنا من تحقيق النجاح في العصر الرقمي من خلال
                      تقديم حلول تقنية متطورة وخدمات استشارية متخصصة.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12"
            >
              <Card className="border-gray-700 bg-gray-800">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-bold text-white">قيمنا</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-white">
                        الابتكار
                      </h3>
                      <p className="text-gray-300">
                        نسعى دائماً لتقديم حلول مبتكرة وفريدة
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-white">
                        الجودة
                      </h3>
                      <p className="text-gray-300">
                        نلتزم بأعلى معايير الجودة في كل ما نقدمه
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-semibold text-white">
                        الشفافية
                      </h3>
                      <p className="text-gray-300">
                        نؤمن بالشفافية والوضوح في تعاملاتنا
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
