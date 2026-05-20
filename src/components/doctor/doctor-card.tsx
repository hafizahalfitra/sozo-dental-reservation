"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, Calendar, Star } from "lucide-react";
import { Link } from "@/i18n/routing";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviews: number;
  experience: number;
}

export default function DoctorCard({
  id,
  name,
  specialty,
  image,
  rating,
  reviews,
  experience,
}: DoctorCardProps) {
  const t = useTranslations("doctors.card");

  return (
    <Card className="group overflow-hidden border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/90 backdrop-blur-md text-primary hover:bg-white border-none shadow-lg py-1.5 px-3 rounded-full font-bold">
            {specialty}
          </Badge>
        </div>

      </div>
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <div className="flex items-center text-amber-400">
            <Star size={16} fill="currentColor" />
            <span className="ml-1 text-sm font-bold text-slate-900">{rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-2">
        <div className="flex items-center text-slate-500 text-sm mb-6 space-x-4">
          <div className="flex items-center">
            <Stethoscope size={14} className="mr-1.5 text-primary" />
            <span>{experience} {t("experience")}</span>
          </div>
          <div className="flex items-center">
            <span className="text-slate-400">({reviews} {t("reviews")})</span>
          </div>
        </div>
        <Button asChild variant="outline" className="w-full rounded-xl border-slate-200 group-hover:border-primary group-hover:text-primary transition-all">
          <Link href="/booking" className="flex items-center">
            <Calendar size={18} className="mr-2" />
            {t("bookNow")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
