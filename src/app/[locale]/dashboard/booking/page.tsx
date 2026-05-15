"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Stethoscope, 
  History, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  XCircle,
  Clock3
} from "lucide-react";
import { toast } from "sonner";
import type { BookingType, DoctorType, ServiceType } from "@/types";

export default function BookingDashboard() {
  const t = useTranslations("booking.dashboard");
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("create");
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [currentBookings, setCurrentBookings] = useState<BookingType[]>([]);
  const [historyBookings, setHistoryBookings] = useState<BookingType[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    doctorId: "",
    serviceId: "",
    date: "",
    time: "",
    notes: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchInitialData();
    }
  }, [status]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [docsRes, servRes, currentRes, historyRes] = await Promise.all([
        fetch("/api/doctors"),
        fetch("/api/services"),
        fetch("/api/bookings/current"),
        fetch("/api/bookings/history")
      ]);

      const [docs, serv, current, history] = await Promise.all([
        docsRes.json(),
        servRes.json(),
        currentRes.json(),
        historyRes.json()
      ]);

      if (docs.success) setDoctors(docs.data);
      if (serv.success) setServices(serv.data);
      if (current.success) setCurrentBookings(current.data);
      if (history.success) setHistoryBookings(history.data);
      
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.serviceId || !formData.date || !formData.time) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          appointmentDate: formData.date,
          appointmentTime: formData.time
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t("form.success"));
        setFormData({ doctorId: "", serviceId: "", date: "", time: "", notes: "" });
        // Refresh current bookings and switch tab
        const currentRes = await fetch("/api/bookings/current");
        const currentData = await currentRes.json();
        if (currentData.success) setCurrentBookings(currentData.data);
        setActiveTab("active");
      } else {
        toast.error(data.error || t("form.error"));
      }
    } catch (error) {
      toast.error(t("form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"><Clock3 className="w-3 h-3 mr-1" /> {t("status.pending")}</Badge>;
      case "CONFIRMED":
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> {t("status.confirmed")}</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-none"><XCircle className="w-3 h-3 mr-1" /> {t("status.cancelled")}</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> {t("status.completed")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
    <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{t("title")}</h1>
        <p className="text-slate-500 text-lg">{t("subtitle")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-slate-100 p-1 rounded-2xl w-full sm:w-auto h-auto grid grid-cols-3">
          <TabsTrigger value="create" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t("tabs.create")}</span>
            <span className="sm:hidden">Buat</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t("tabs.active")}</span>
            <span className="sm:hidden">Aktif</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <History className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t("tabs.history")}</span>
            <span className="sm:hidden">Riwayat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-primary/10">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="text-primary" />
                {t("tabs.create")}
              </h2>
            </div>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">{t("form.doctor")}</Label>
                    <Select value={formData.doctorId} onValueChange={(val) => setFormData({...formData, doctorId: val})}>
                      <SelectTrigger className="rounded-xl h-12 border-slate-200 focus:ring-primary/20">
                        <SelectValue placeholder={t("form.doctor")} />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">{t("form.service")}</Label>
                    <Select value={formData.serviceId} onValueChange={(val) => setFormData({...formData, serviceId: val})}>
                      <SelectTrigger className="rounded-xl h-12 border-slate-200 focus:ring-primary/20">
                        <SelectValue placeholder={t("form.service")} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((ser) => (
                          <SelectItem key={ser.id} value={ser.id}>{ser.title} - Rp {ser.price.toLocaleString()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">{t("form.date")}</Label>
                    <Input 
                      type="date" 
                      value={formData.date} 
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="rounded-xl h-12 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">{t("form.time")}</Label>
                    <Input 
                      type="time" 
                      value={formData.time} 
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="rounded-xl h-12 border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">{t("form.notes")}</Label>
                  <Textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="rounded-2xl min-h-[120px] border-slate-200"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                  {t("form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBookings.length === 0 ? (
              <Card className="col-span-full border-dashed border-2 p-12 text-center bg-slate-50/50 rounded-3xl">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">{t("active.empty")}</p>
                <Button variant="link" onClick={() => setActiveTab("create")} className="mt-2 text-primary font-bold">
                  {t("tabs.create")} Sekarang
                </Button>
              </Card>
            ) : (
              currentBookings.map((booking) => (
                <Card key={booking.id} className="border-none shadow-xl shadow-slate-100 rounded-3xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
                  <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
                    {getStatusBadge(booking.status)}
                    <span className="text-[10px] font-mono text-slate-400">#{booking.id.slice(-6)}</span>
                  </div>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{booking.doctor?.name}</h3>
                        <p className="text-xs text-slate-500">{booking.doctor?.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <CalendarIcon size={16} className="text-primary" />
                        {new Date(booking.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Clock size={16} className="text-primary" />
                        {booking.appointmentTime}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <PlusCircle size={16} className="text-primary" />
                        {booking.service?.title}
                      </div>
                    </div>

                    {booking.status === "PENDING" && (
                      <Button variant="outline" className="w-full rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 h-11">
                        {t("active.cancel")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="border-none shadow-xl shadow-slate-100 rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-8 py-5">{t("form.date")}</th>
                      <th className="px-8 py-5">{t("form.doctor")}</th>
                      <th className="px-8 py-5">{t("form.service")}</th>
                      <th className="px-8 py-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyBookings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">
                          {t("history.empty")}
                        </td>
                      </tr>
                    ) : (
                      historyBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-2 font-semibold text-slate-700">
                              <CalendarIcon size={14} className="text-slate-400" />
                              {new Date(booking.appointmentDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{booking.doctor?.name}</span>
                              <span className="text-xs text-slate-500">{booking.doctor?.specialization}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-600">
                            {booking.service?.title}
                          </td>
                          <td className="px-8 py-6">
                            {getStatusBadge(booking.status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
