import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Send, Phone, Mail } from "lucide-react";

interface ContactSectionProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

const ContactSection = ({
  onSubmit = (data) => console.log("Form submitted:", data),
  isLoading = false,
}: ContactSectionProps) => {
  return (
    <section className="w-full bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">تواصل معنا</h2>
          <p className="mb-8 text-gray-300">
            نحن هنا لمساعدتك في تحقيق رؤيتك الرقمية
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-gray-700 bg-gray-800">
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
                      className="text-right bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
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
                      className="text-right bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
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
                      className="min-h-[150px] text-right bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
            <Card className="border-gray-700 bg-gray-800">
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
                    <Phone className="h-6 w-6 text-blue-400" />
                  </div>

                  <div className="flex items-center justify-end space-x-4 space-x-reverse">
                    <div className="text-right">
                      <p className="font-medium text-white">
                        البريد الإلكتروني
                      </p>
                      <p className="text-gray-300">info@example.com</p>
                    </div>
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-800">
              <CardContent className="p-6">
                <h3 className="mb-4 text-right text-xl font-semibold text-white">
                  ساعات العمل
                </h3>
                <div className="space-y-2 text-right">
                  <p className="text-gray-300">
                    الأحد - الخميس: 9:00 ص - 6:00 م
                  </p>
                  <p className="text-gray-300">الجمعة - السبت: مغلق</p>
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
