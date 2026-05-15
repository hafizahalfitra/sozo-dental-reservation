"use client";

import { useTranslations } from "next-intl";
import SectionTitle from "@/components/shared/section-title";
import DoctorCard from "./doctor-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

const featuredDoctors = [
  {
    id: "dr-sarah-johnson",
    name: "Dr. Sarah Johnson",
    specialty: "Orthodontist",
    image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=1170&auto=format&fit=crop",
    rating: 4.9,
    reviews: 124,
    experience: 12,
  },
  {
    id: "dr-michael-chen",
    name: "Dr. Michael Chen",
    specialty: "General Dentist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop",
    rating: 4.8,
    reviews: 98,
    experience: 8,
  },
  {
    id: "dr-emily-williams",
    name: "Dr. Emily Williams",
    specialty: "Pediatric Dentist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1170&auto=format&fit=crop",
    rating: 5.0,
    reviews: 156,
    experience: 15,
  },
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
