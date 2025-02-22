import { Button } from "./button";
import { Globe } from "lucide-react";
import { Language } from "@/lib/i18n";

interface LanguageToggleProps {
  currentLang: Language;
  onToggle: (lang: Language) => void;
}

export function LanguageToggle({ currentLang, onToggle }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggle(currentLang === "ar" ? "en" : "ar")}
      className="relative group"
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">Toggle language</span>
      <div className="absolute -bottom-8 hidden group-hover:block bg-popover text-popover-foreground px-2 py-1 rounded text-sm">
        {currentLang === "ar" ? "English" : "العربية"}
      </div>
    </Button>
  );
}
