"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "./section-title";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Baby, 
  HeartPulse 
} from "lucide-react";

export default function ServicesSection() {
  const t = useTranslations("services");

  const services = [
    {
      title: t("items.general.title"),
      description: t("items.general.description"),
      icon: <Smile className="h-10 w-10 text-primary" />,
      color: "bg-blue-50",
    },
    {
      title: t("items.cosmetic.title"),
      description: t("items.cosmetic.description"),
      icon: <Sparkles className="h-10 w-10 text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      title: t("items.orthodontics.title"),
      description: t("items.orthodontics.description"),
      icon: <Activity className="h-10 w-10 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: t("items.pediatric.title"),
      description: t("items.pediatric.description"),
      icon: <Baby className="h-10 w-10 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      title: t("items.emergency.title"),
      description: t("items.emergency.description"),
      icon: <HeartPulse className="h-10 w-10 text-rose-600" />,
      color: "bg-rose-50",
    },
    {
      title: t("items.implants.title"),
      description: t("items.implants.description"),
      icon: <ShieldCheck className="h-10 w-10 text-sky-600" />,
      color: "bg-sky-50",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4">
                <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                  {service.icon}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
