import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Send, Phone, Mail, Clock } from "lucide-react";

interface ContactSectionProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

const ContactSection = ({
  onSubmit = (data) => console.log("Form submitted:", data),
  isLoading = false,
}: ContactSectionProps) => {
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
            <span className="text-lg font-medium text-white">تواصل معنا</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            نحن هنا لمساعدتك في تحقيق رؤيتك الرقمية
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-right text-xl text-white">
                  نموذج الاتصال
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit({
                      name: (e.target as any).name.value,
                      email: (e.target as any).email.value,
                      message: (e.target as any).message.value,
                    });
                  }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="block text-right text-gray-200"
                    >
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="أدخل اسمك الكامل"
                      className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="block text-right text-gray-200"
                    >
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="block text-right text-gray-200"
                    >
                      الرسالة
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="اكتب رسالتك هنا"
                      className="min-h-[150px] border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#FF6B00] text-white hover:bg-[#FF8533]"
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
                    <Send className="mr-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-right text-xl font-semibold text-white">
                  معلومات الاتصال
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <div className="text-right">
                      <p className="font-medium text-white">رقم الهاتف</p>
                      <p className="text-gray-300">+966 12 345 6789</p>
                    </div>
                    <Phone className="h-6 w-6 text-[#FF6B00]" />
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <div className="text-right">
                      <p className="font-medium text-white">
                        البريد الإلكتروني
                      </p>
                      <p className="text-gray-300">info@example.com</p>
                    </div>
                    <Mail className="h-6 w-6 text-[#FF6B00]" />
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <div className="text-right">
                      <p className="font-medium text-white">ساعات العمل</p>
                      <p className="text-gray-300">
                        الأحد - الخميس: 9:00 ص - 6:00 م
                      </p>
                      <p className="text-gray-300">الجمعة - السبت: مغلق</p>
                    </div>
                    <Clock className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-right text-xl font-semibold text-white">
                  موقعنا
                </h3>
                <div className="text-right">
                  <p className="text-gray-300">
                    الرياض، المملكة العربية السعودية
                  </p>
                  <p className="mt-2 text-gray-300">
                    الدور الثالث، برج الأعمال، شارع الملك فهد
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
