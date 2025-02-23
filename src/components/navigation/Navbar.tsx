import React from "react";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Globe, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { COMPANY_NAME, translations, type Language } from "@/lib/i18n";
import { useLanguage } from "@/hooks/useLanguage";

interface NavbarProps {
  logo?: string;
  initialLang?: Language;
}

const Navbar = ({
  logo = "https://api.dicebear.com/7.x/initials/svg?seed=CS",
  initialLang = "ar",
}: NavbarProps) => {
  const { currentLang, toggleLanguage } = useLanguage(initialLang);

  const menuItems = [
    { title: translations[currentLang].nav.home, href: "/" },
    { title: translations[currentLang].nav.services, href: "/services" },
    { title: translations[currentLang].nav.portfolio, href: "/portfolio" },
    { title: translations[currentLang].nav.blog, href: "/blog" },
    { title: translations[currentLang].nav.faq, href: "/faq" },
    { title: translations[currentLang].nav.contact, href: "/contact" },
    { title: "لوحة التحكم", href: "/dashboard" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <span className="mr-3 text-xl font-bold text-white">
            {COMPANY_NAME}
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex-row-reverse">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 hover:text-gray-100 focus:bg-gray-800 focus:text-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    href={item.href}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="ml-4 text-white hover:bg-gray-800 hover:text-gray-100"
          >
            <Globe className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] bg-gray-900 text-white"
          >
            <SheetHeader>
              <SheetTitle className="text-right text-white">
                {translations[currentLang].nav.home}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col items-end gap-4">
              {menuItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="text-lg font-medium text-gray-300 hover:text-white"
                >
                  {item.title}
                </a>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="mt-4 w-full justify-end gap-2 text-white hover:bg-gray-800 hover:text-gray-100"
              >
                <Globe className="h-5 w-5" />
                <span>{translations[currentLang].nav.changeLanguage}</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
