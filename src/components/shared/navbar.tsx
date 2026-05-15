"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, Stethoscope, User, LogOut, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

import LanguageSwitcher from "./language-switcher";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeT = (key: string, fallback: string) => {
    return t(key, { defaultValue: fallback });
  };

  const isLoggedIn = !!session;

  const navLinks = [
    { name: safeT("home", "Beranda"), href: "/" },
    { name: safeT("dokter", "Dokter"), href: "/doctors" },
    ...(isLoggedIn ? [
      { name: "Booking Sekarang", href: "/booking" },
      { name: "Riwayat Reservasi", href: "/booking/history" },
      ...(session?.user?.role === "ADMIN" ? [{ name: "Admin", href: "/admin" }] : []),
    ] : []),
  ];

  if (!mounted) return null;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md saturate-150 transition-all duration-300">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-200">
            <Stethoscope size={22} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            SOZO<span className="text-blue-600">Dental</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href as any}
                className={cn(
                  "relative text-sm font-semibold transition-colors duration-200 py-1",
                  active ? "text-blue-600" : "text-slate-600 hover:text-blue-500"
                )}
              >
                {link.name}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto flex gap-2 pl-1 pr-3 rounded-full hover:bg-slate-100 transition-all">
                  <Avatar className="h-8 w-8 border border-blue-100">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">
                      {session.user?.name?.substring(0, 2).toUpperCase() || "SZ"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline-block text-sm font-medium text-slate-700">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 p-2 mt-2 shadow-xl border-slate-100">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-slate-900">{session.user?.name}</p>
                    <p className="text-xs leading-none text-slate-500">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                   <Link href="/dashboard/patient" className="flex w-full items-center">
                      <User className="mr-2 h-4 w-4" /> Dashboard
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer rounded-md mt-1"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-full px-6 shadow-md hover:shadow-lg transition-all active:scale-95 bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </Link>
          )}

          {/* MOBILE MENU */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-100">
                  <Menu className="h-6 w-6 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="text-left mb-8 border-b pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <Stethoscope className="text-blue-600" /> SOZO Dental
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href as any}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-lg font-semibold rounded-xl transition-all",
                        pathname === link.href 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/booking"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white mt-2"
                      >
                        {safeT("booking", "Reservasi Sekarang")}
                      </Link>
                      <Link
                        href="/dashboard/patient"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-lg font-semibold rounded-xl text-slate-600 hover:bg-slate-50"
                      >
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white mt-2"
                    >
                      Login
                    </Link>
                  )}
                  
                  <div className="mt-4 pt-4 border-t px-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Pengaturan</p>
                    <LanguageSwitcher />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}