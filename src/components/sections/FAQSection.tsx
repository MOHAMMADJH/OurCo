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
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">
            الأسئلة الشائعة
          </h2>
          <p className="text-xl text-gray-400">
            إجابات على أكثر الأسئلة شيوعاً
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right text-lg font-medium text-white hover:text-blue-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-right text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
