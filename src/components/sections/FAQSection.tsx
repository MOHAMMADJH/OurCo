import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
  {
    question: "ما هي مدة تطوير موقع إلكتروني؟",
    answer:
      "تختلف مدة التطوير حسب حجم وتعقيد المشروع. عادةً ما تستغرق المواقع البسيطة 2-4 أسابيع، بينما قد تستغرق المشاريع الأكبر 2-3 أشهر.",
  },
  {
    question: "هل تقدمون خدمة ما بعد التسليم؟",
    answer:
      "نعم، نقدم خدمات الدعم والصيانة لجميع مشاريعنا. نوفر فترة ضمان وخدمات دعم فني مستمرة.",
  },
  {
    question: "كيف تضمنون جودة المشروع؟",
    answer:
      "نتبع منهجية تطوير صارمة تشمل اختبارات الجودة المستمرة، ومراجعة الكود، واختبارات الأداء والأمان.",
  },
  {
    question: "ما هي تكلفة تطوير موقع إلكتروني؟",
    answer:
      "تعتمد التكلفة على متطلبات المشروع. نقدم تقديرات مفصلة بعد دراسة احتياجات العميل وتحديد نطاق العمل.",
  },
];

const FAQSection = ({ faqs = defaultFAQs }: FAQSectionProps) => {
  return (
    <section className="relative w-full bg-[#0B1340] px-4 py-16 text-right lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a237e10_0%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00] opacity-[0.15] blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A90E2] opacity-[0.1] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-block rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg font-medium text-white">
              الأسئلة الشائعة
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            إجابات على أكثر الأسئلة شيوعاً
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-white/10"
                >
                  <AccordionTrigger className="text-right text-lg font-medium text-white hover:text-[#FF6B00]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-right text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-300">
            لم تجد إجابة لسؤالك؟ تواصل معنا وسنسعد بالرد على استفساراتك
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
