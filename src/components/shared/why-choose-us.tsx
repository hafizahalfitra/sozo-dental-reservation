"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "./section-title";
import { 
  Award, 
  Clock, 
  HeartHandshake, 
  Users 
} from "lucide-react";

export default function WhyChooseUs() {
  const t = useTranslations("whyChooseUs");

  const features = [
    {
      title: t("features.doctors.title"),
      description: t("features.doctors.description"),
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: t("features.tech.title"),
      description: t("features.tech.description"),
      icon: <Award className="h-6 w-6" />,
    },
    {
      title: t("features.patient.title"),
      description: t("features.patient.description"),
      icon: <HeartHandshake className="h-6 w-6" />,
    },
    {
      title: t("features.scheduling.title"),
      description: t("features.scheduling.description"),
      icon: <Clock className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1170&auto=format&fit=crop"
                alt="Our Modern Clinic"
                className="rounded-3xl shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl z-20 hidden sm:block">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-primary">15+</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {t("yearsExp").split(' ').join('<br />')}
                    {/* Simplified for now, in a real case we might use multiple keys or dangerouslySetInnerHTML if we want <br /> */}
                    {t("yearsExp")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-8">
            <SectionTitle
              align="left"
              subtitle={t("subtitle")}
              title={t("title")}
              description={t("description")}
              className="mb-8"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col space-y-3 group">
                  <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
