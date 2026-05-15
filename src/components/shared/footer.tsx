"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const nt = useTranslations("navbar");

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeT = (translator: any, key: string, fallback: string) => {
    try {
      return translator(key);
    } catch (error) {
      return fallback;
    }
  };

  const quickLinks = [
    { name: safeT(nt, "home", "Home"), href: "/" },
    { name: safeT(nt, "dokter", "Doctors"), href: "/doctors" },
    { name: safeT(nt, "booking", "Booking"), href: "/dashboard/booking" },
  ];

  if (!mounted) return null;

  return (
    <footer className="bg-slate-950 text-slate-400 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2 text-white group">
              <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:scale-110">
                <Stethoscope size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                SOZO<span className="text-primary">Dental</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {safeT(t, "description", "Providing world-class dental services.")}
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contact@sozodental.com" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all group">
                <Mail size={18} />
              </a>
              <a href="tel:+622112345678" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <Phone size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <MapPin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">{safeT(t, "quickLinks", "Quick Links")}</h3>
            <ul className="space-y-4 text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href as any} className="hover:text-primary transition-colors flex items-center group">
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">{safeT(t, "contactUs", "Contact Us")}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Jl. Sudirman No. 123, Jakarta Selatan, Indonesia 12190</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>contact@sozodental.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">{safeT(t, "openingHours", "Opening Hours")}</h3>
            <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span>{safeT(t, "monFri", "Mon - Fri")}:</span>
                <span className="text-white font-medium">08:00 - 20:00</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span>{safeT(t, "sat", "Saturday")}:</span>
                <span className="text-white font-medium">09:00 - 18:00</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-slate-900">
                <span>{safeT(t, "sun", "Sunday")}:</span>
                <span className="text-primary font-bold uppercase text-[10px] tracking-widest bg-primary/10 px-2 py-0.5 rounded">{safeT(t, "closed", "Closed")}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs">
          <p>© {currentYear} SOZO Dental Clinic. {safeT(t, "rights", "All rights reserved.")}</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
