import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const ServiceCard = ({
  title = "خدمة التطوير",
  description = "نقدم خدمات تطوير برمجيات عالية الجودة مع التركيز على تجربة المستخدم وأحدث التقنيات",
  imageUrl = "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  ctaText = "اكتشف المزيد",
  onCtaClick = () => console.log("CTA clicked"),
}: ServiceCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-[400px] bg-[#0A1128]"
    >
      <Card className="h-[500px] overflow-hidden border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm transition-all hover:border-white/20">
        <CardHeader className="p-0">
          <div className="relative h-[200px] w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 text-right">
          <CardTitle className="mb-4 text-2xl font-bold text-white">
            {title}
          </CardTitle>
          <CardDescription className="text-base text-gray-300">
            {description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            onClick={onCtaClick}
            className="w-full justify-between bg-[#FF6B00] hover:bg-[#FF8533]"
          >
            <span>{ctaText}</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
