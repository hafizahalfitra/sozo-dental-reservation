"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope, Loader2 } from "lucide-react";
import type { DoctorType } from "@/types";

export default function DoctorsPage() {
  const t = useTranslations("doctors");
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch("/api/doctors");
        const data = await response.json();
        if (data.success) {
          setDoctors(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch doctors");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4 min-h-screen mt-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t("title")}</h1>
          <p className="text-slate-500 text-lg">{t("description")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl">{doctor.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{doctor.specialization}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {doctor.experience} years of experience in providing world-class dental care. Experienced specialist dedicated to your smile health.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
