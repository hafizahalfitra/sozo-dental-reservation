"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "@/components/shared/section-title";
import DoctorCard from "./doctor-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

const featuredDoctors = [
  {
    id: "drg-jesica-amanda",
    name: "drg. Jesica Amanda, Sp.RKG",
    specialty: "Radiologi Kedokteran Gigi",
    image: "/jesica.jpg",
    rating: 4.9,
    reviews: 124,
    experience: 8,
  },
  {
    id: "drg-deviana-maria",
    name: "drg. Deviana Maria, Sp.Ort",
    specialty: "Ortodonti (Kawat Gigi)",
    image: "/Deviana.jpg",
    rating: 4.8,
    reviews: 98,
    experience: 10,
  },
  {
    id: "drg-muhammad-ikbal",
    name: "drg. Muhammad Ikbal, Sp.Pros",
    specialty: "Prostodonti (Implan & Mahkota Gigi)",
    image: "/Muhammad.jpg",
    rating: 4.9,
    reviews: 112,
    experience: 12,
  },
  {
    id: "drg-ananta-wicaksono",
    name: "drg. Ananta Wicaksono, Sp.KGA",
    specialty: "Kedokteran Gigi Anak",
    image: "/Ananta.jpg",
    rating: 5.0,
    reviews: 143,
    experience: 6,
  }
];

export default function DoctorPreviewSection() {
  const t = useTranslations("doctors");

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionTitle
            align="left"
            subtitle={t("subtitle")}
            title={t("title")}
            description={t("description")}
            className="mb-0"
          />
          <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 text-lg font-bold group">
            <Link href="/doctors" className="flex items-center">
              {t("viewAll")}
              <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} {...doctor} />
          ))}
        </div>

        {/* Mobile view only button */}
        <div className="mt-10 md:hidden">
          <Button asChild variant="outline" className="w-full rounded-xl py-6 border-slate-200 text-primary">
            <Link href="/doctors">{t("viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
