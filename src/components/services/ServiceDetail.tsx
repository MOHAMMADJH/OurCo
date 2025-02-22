import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceDetailProps {
  title?: string;
  description?: string;
  features?: string[];
  imageUrl?: string;
  benefits?: string[];
  price?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const ServiceDetail = ({
  title = "تطوير التطبيقات المخصصة",
  description = "نقدم خدمات تطوير برمجيات متكاملة مصممة خصيصاً لتلبية احتياجات عملك",
  features = [
    "تصميم واجهات المستخدم الحديثة",
    "تطوير الواجهة الأمامية والخلفية",
    "اختبار الجودة الشامل",
    "الدعم الفني المستمر",
  ],
  imageUrl = "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  benefits = [
    "تحسين كفاءة العمل",
    "زيادة رضا العملاء",
    "تقليل التكاليف التشغيلية",
  ],
  price = "يبدأ من 5000 ريال",
  ctaText = "طلب استشارة مجانية",
  onCtaClick = () => console.log("CTA clicked"),
}: ServiceDetailProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-16 text-right lg:px-8">
      <Card className="mx-auto max-w-6xl overflow-hidden bg-white shadow-xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[300px] overflow-hidden lg:h-full"
          >
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <Badge className="mb-4" variant="secondary">
              خدماتنا المتميزة
            </Badge>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mb-6 text-lg text-gray-600">{description}</p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                المميزات الرئيسية
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                الفوائد
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="rounded-lg bg-gray-50 p-4 text-center"
                  >
                    {benefit}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex flex-col items-start gap-4 border-t pt-6 md:flex-row md:items-center md:justify-between">
              <div className="text-2xl font-bold text-gray-900">{price}</div>
              <Button
                onClick={onCtaClick}
                size="lg"
                className="group w-full md:w-auto"
              >
                {ctaText}
                <ArrowRight className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default ServiceDetail;
