"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

export default function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-sky-700 opacity-90" />
      
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-300/10 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {t("title")} <br className="hidden md:block" />
            <span className="text-sky-200">{t("titleHighlight")}</span>
          </h2>
          
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="h-16 px-10 rounded-full bg-white text-primary hover:bg-sky-50 text-lg font-bold shadow-2xl transition-all hover:scale-105">
              <Link href="/booking" className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {t("button")}
              </Link>
            </Button>
            
            <a 
              href="tel:+622112345678" 
              className="flex items-center space-x-3 text-white hover:text-sky-200 transition-colors p-4 group"
            >
              <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wider text-sky-200">{t("orCall")}</p>
                <p className="text-lg font-bold">+62 21 1234 5678</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
