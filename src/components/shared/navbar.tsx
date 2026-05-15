"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Phone, 
  Stethoscope, 
  ArrowRight,
  Menu,
  Sparkles
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle,
  SheetHeader 
} from "@/components/ui/sheet";
import LanguageSwitcher from "./language-switcher";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("navbar");

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("doctors"), href: "/doctors" },
    { name: t("services"), href: "/services" },
    { name: t("about"), href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-in-out px-4 sm:px-8 py-4",
        isScrolled ? "py-3" : "py-6"
      )}
    >
      <nav
        className={cn(
          "mx-auto max-w-7xl rounded-2xl transition-all duration-500",
          "flex h-16 items-center justify-between px-6",
          isScrolled 
            ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/20 dark:bg-slate-950/70" 
            : "bg-transparent"
        )}
      >
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-blue-400 opacity-25 blur transition duration-300 group-hover:opacity-100" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg transition-transform group-hover:scale-110 group-active:scale-95">
              <Stethoscope size={22} strokeWidth={2.5} />
            </div>
          </div>
          <span className="hidden text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:block">
            SOZO<span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Dental</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href as any}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold transition-colors rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                  isActive ? "text-primary" : "text-slate-600 dark:text-slate-400"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-4 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t("emergencyCall")}</span>
            <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
              <Phone size={14} fill="currentColor" />
              <span>+62 21 1234 5678</span>
            </div>
          </div>

          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <Button 
            asChild 
            className="group hidden md:flex rounded-full px-6 bg-primary hover:bg-primary/90 shadow-[0_10px_20px_-10px_rgba(var(--primary),0.3)] transition-all hover:translate-y-[-2px] active:translate-y-0"
          >
            <Link href="/booking">
              {t("bookAppointment")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col w-full p-0 sm:max-w-sm border-l-0">
                <SheetHeader className="p-6 border-b text-left">
                    <SheetTitle className="flex items-center gap-2">
                         <div className="p-2 bg-primary rounded-lg text-white">
                            <Stethoscope size={20} />
                         </div>
                         SOZO Dental
                    </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-2 p-6 flex-1">
                  {navLinks.map((link, idx) => (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={link.name}
                    >
                        <Link
                        href={link.href as any}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-2xl text-lg font-semibold transition-all",
                            pathname === link.href 
                                ? "bg-primary/5 text-primary border border-primary/10" 
                                : "hover:bg-slate-50 text-slate-600"
                        )}
                        >
                        {link.name}
                        {pathname === link.href && <Sparkles size={16} className="animate-pulse" />}
                        </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 mt-auto border-t bg-slate-50/50">
                  <Button asChild className="w-full h-14 rounded-2xl text-lg shadow-xl shadow-primary/20">
                    <Link href="/booking" onClick={() => setIsOpen(false)}>{t("bookAppointment")}</Link>
                  </Button>
                  <p className="mt-4 text-center text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
                    <Phone size={14} /> {t("emergencyCall")}: +62 21 1234 5678
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}