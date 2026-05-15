"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookingSchema, type BookingInput } from "@/lib/validations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Stethoscope, Calendar, Clock, Loader2, Phone, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import type { DoctorType, ServiceType } from "@/types";

export default function BookingPage() {
  const t = useTranslations("booking");
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientName: session?.user?.name || "",
      patientPhone: "",
      doctorId: "",
      serviceId: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchInitialData();
      if (session?.user?.name) {
        form.setValue("patientName", session.user.name);
      }
    }
  }, [status, session]);

  const fetchInitialData = async () => {
    try {
      const [docsRes, servRes] = await Promise.all([
        fetch("/api/doctors"),
        fetch("/api/services")
      ]);

      const [docs, serv] = await Promise.all([
        docsRes.json(),
        servRes.json()
      ]);

      if (docs.success) setDoctors(docs.data);
      if (serv.success) setServices(serv.data);
    } catch (error) {
      toast.error("Failed to load doctors or services");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BookingInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(t("form.success"));
        router.push("/booking/history");
      } else {
        toast.error(result.error || t("form.error"));
      }
    } catch (error) {
      toast.error(t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          {t("title")}
        </h1>
        <p className="text-slate-500 text-lg">
          {t("subtitle")}
        </p>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        <div className="bg-primary/5 p-8 border-b border-primary/10">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="text-primary" />
            Formulir Reservasi
          </h2>
        </div>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <User size={14} className="text-primary" /> {t("form.name")}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Pasien" {...field} className="rounded-xl h-12 border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Patient Phone */}
                <FormField
                  control={form.control}
                  name="patientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Phone size={14} className="text-primary" /> {t("form.phone")}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="0812..." {...field} className="rounded-xl h-12 border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Doctor Selection */}
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Stethoscope size={14} className="text-primary" /> {t("form.doctor")}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-12 border-slate-200">
                            <SelectValue placeholder={t("form.doctor")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctors.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.name} - {doc.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Selection */}
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <MessageSquare size={14} className="text-primary" /> {t("form.service")}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-12 border-slate-200">
                            <SelectValue placeholder={t("form.service")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services.map((ser) => (
                            <SelectItem key={ser.id} value={ser.id}>
                              {ser.title} - Rp {ser.price.toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Selection */}
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Calendar size={14} className="text-primary" /> {t("form.date")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]} 
                          {...field} 
                          className="rounded-xl h-12 border-slate-200" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Selection */}
                <FormField
                  control={form.control}
                  name="appointmentTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Clock size={14} className="text-primary" /> {t("form.time")}
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="rounded-xl h-12 border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <MessageSquare size={14} className="text-primary" /> {t("form.notes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Berikan detail keluhan atau catatan tambahan..." 
                        {...field} 
                        className="rounded-2xl min-h-[120px] border-slate-200 focus:ring-primary/20" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Calendar className="w-5 h-5 mr-2" />
                )}
                {t("submit")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
