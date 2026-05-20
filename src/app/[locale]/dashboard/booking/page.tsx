"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock3,
  User,
  Phone,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import type { BookingType, DoctorType, ServiceType } from "@/types";

export default function BookingDashboard() {
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
        toast.success("Reservasi berhasil dibuat!");
        setFormData({ doctorId: "", serviceId: "", date: "", time: "", notes: "" });
        const currentRes = await fetch("/api/bookings/current");
        const currentData = await currentRes.json();
        if (currentData.success) setCurrentBookings(currentData.data);
        setActiveTab("active");
      } else {
        toast.error(data.error || "Gagal membuat reservasi.");
      }
    } catch (error) {
      toast.error("Gagal memproses reservasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-200/60 rounded-lg px-2.5 py-1 font-medium shadow-sm"><Clock3 className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Menunggu</Badge>;
      case "CONFIRMED":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-lg px-2.5 py-1 font-medium shadow-sm"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Dikonfirmasi</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary" className="bg-rose-50 text-rose-700 border border-rose-200/60 rounded-lg px-2.5 py-1 font-medium shadow-sm"><XCircle className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Dibatalkan</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200/60 rounded-lg px-2.5 py-1 font-medium shadow-sm"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Selesai</Badge>;
      default:
        return <Badge className="rounded-lg">{status}</Badge>;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-[85vh] items-center justify-center bg-slate-50/40">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
          <Stethoscope className="h-6 w-6 text-primary absolute animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-6 sm:py-10 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl antialiased overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-10 lg:mb-12 border-b border-slate-100 pb-5 sm:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-1.5 sm:mb-2 bg-gradient-to-r from-slate-950 to-slate-700 bg-clip-text text-transparent">
            Sistem Reservasi
          </h1>
          <p className="text-slate-500 text-sm sm:text-base lg:text-lg max-w-2xl font-normal leading-relaxed">
            Kelola jadwal kunjungan dokter gigi Anda di satu tempat.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        {/* Modern Segmented Controls */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-slate-200/80 pb-px">
          <TabsList className="bg-transparent p-0 gap-4 sm:gap-6 lg:gap-8 w-max sm:w-auto justify-start h-auto rounded-none border-none">
            <TabsTrigger 
              value="create" 
              className="bg-transparent p-0 pb-3 sm:pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-slate-500 data-[state=active]:text-primary font-semibold text-sm sm:text-base transition-all gap-1.5 sm:gap-2 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Buat Reservasi</span>
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="bg-transparent p-0 pb-3 sm:pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-slate-500 data-[state=active]:text-primary font-semibold text-sm sm:text-base transition-all gap-1.5 sm:gap-2 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Reservasi Aktif</span>
              {currentBookings.length > 0 && (
                <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-primary/10 text-primary">
                  {currentBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="bg-transparent p-0 pb-3 sm:pb-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-slate-500 data-[state=active]:text-primary font-semibold text-sm sm:text-base transition-all gap-1.5 sm:gap-2 whitespace-nowrap"
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Riwayat Kunjungan</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Formulir Reservasi */}
        <TabsContent value="create" className="mt-0 focus-visible:outline-none">
          <Card className="border border-slate-200/70 shadow-lg shadow-slate-100/40 rounded-2xl overflow-hidden bg-white">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Formulir Reservasi</h2>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate">Silakan lengkapi data kunjungan Anda di bawah ini</p>
              </div>
            </div>
            
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Input: Nama Pasien */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Nama Lengkap
                    </Label>
                    <Input 
                      type="text"
                      placeholder="Nama Pasien"
                      className="w-full rounded-xl h-12 min-h-[48px] border-slate-200 focus-visible:ring-primary/20 bg-slate-50/40 focus:bg-white transition-all text-slate-800 text-sm sm:text-base"
                    />
                  </div>

                  {/* Input: Nomor Telepon */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      Nomor Telepon
                    </Label>
                    <Input 
                      type="tel"
                      placeholder="e.g. 0812345678"
                      className="w-full rounded-xl h-12 min-h-[48px] border-slate-200 focus-visible:ring-primary/20 bg-slate-50/40 focus:bg-white transition-all text-slate-800 text-sm sm:text-base"
                    />
                  </div>

                  {/* Input: Dokter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-slate-400" />
                      Pilih Dokter
                    </Label>
                    <Select value={formData.doctorId} onValueChange={(val) => setFormData({...formData, doctorId: val})}>
                      <SelectTrigger className="rounded-xl min-h-[48px] h-auto py-2 px-3.5 w-full border-slate-200 focus:ring-primary/20 bg-slate-50/40 focus:bg-white transition-all text-slate-700 text-left overflow-hidden">
                        <SelectValue placeholder="Pilih Dokter">
                          <div className="truncate line-clamp-1 w-full text-left">
                            {formData.doctorId ? doctors.find((d) => d.id === formData.doctorId)?.name : "Pilih Dokter"}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-xl p-1.5 z-50 min-w-[var(--radix-select-trigger-width)]">
                        {doctors.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id} className="rounded-lg py-2.5 px-3 my-0.5 hover:bg-slate-50 focus:bg-slate-50 cursor-pointer data-[state=checked]:bg-slate-50">
                            <div className="flex flex-col items-start gap-0.5 text-left">
                              <span className="font-semibold text-slate-900 text-sm leading-tight">{doc.name}</span>
                              <span className="text-[11px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded mt-1 block w-fit">{doc.specialization}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Input: Layanan */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-slate-400" />
                      Pilih Layanan
                    </Label>
                    <Select value={formData.serviceId} onValueChange={(val) => setFormData({...formData, serviceId: val})}>
                      <SelectTrigger className="rounded-xl min-h-[48px] h-auto py-2 px-3.5 w-full border-slate-200 focus:ring-primary/20 bg-slate-50/40 focus:bg-white transition-all text-slate-700 text-left overflow-hidden">
                        <SelectValue placeholder="Pilih Layanan">
                          <div className="truncate line-clamp-1 w-full text-left">
                            {formData.serviceId ? services.find((s) => s.id === formData.serviceId)?.title : "Pilih Layanan"}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-xl p-1.5 z-50 min-w-[var(--radix-select-trigger-width)]">
                        {services.map((ser) => (
                          <SelectItem key={ser.id} value={ser.id} className="rounded-lg py-2.5 px-3 my-0.5 hover:bg-slate-50 focus:bg-slate-50 cursor-pointer data-[state=checked]:bg-slate-50">
                            <div className="flex justify-between items-center w-full gap-4 text-left">
                              <span className="font-medium text-slate-900 text-sm truncate">{ser.title}</span>
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">Rp {ser.price.toLocaleString("id-ID")}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Input: Tanggal */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-slate-400" />
                      Tanggal
                    </Label>
                    <Input 
                      type="date" 
                      value={formData.date} 
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full rounded-xl h-12 min-h-[48px] border-slate-200 focus-visible:ring-primary/20 bg-slate-50/40 focus:bg-white transition-all text-slate-700 text-sm sm:text-base"
                    />
                  </div>

                  {/* Input: Jam */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Jam
                    </Label>
                    <Input 
                      type="time" 
                      value={formData.time} 
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full rounded-xl h-12 min-h-[48px] border-slate-200 focus-visible:ring-primary/20 bg-slate-50/40 focus:bg-white transition-all text-slate-700 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Input: Catatan Tambahan */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Catatan (Opsional)
                  </Label>
                  <Textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Berikan detail keluhan atau catatan tambahan..."
                    className="w-full rounded-xl min-h-[100px] sm:min-h-[120px] border-slate-200 focus-visible:ring-primary/20 bg-slate-50/40 focus:bg-white transition-all text-slate-800 text-sm sm:text-base leading-relaxed resize-none"
                  />
                </div>

                {/* Tombol Submit Premium */}
                <div className="pt-1 sm:pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-12 min-h-[48px] rounded-xl text-sm sm:text-base font-semibold shadow-md shadow-primary/10 transition-all hover:opacity-95 active:scale-[0.99] bg-primary text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2 shrink-0" /> Memproses...</>
                    ) : (
                      <><CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> Konfirmasi Reservasi</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Kartu Reservasi Aktif */}
        <TabsContent value="active" className="mt-0 focus-visible:outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentBookings.length === 0 ? (
              <Card className="col-span-full border-dashed border-2 border-slate-200 py-12 sm:py-16 px-6 text-center bg-slate-50/40 rounded-2xl">
                <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium text-sm mb-3">Anda tidak memiliki reservasi aktif saat ini.</p>
                <Button variant="outline" onClick={() => setActiveTab("create")} className="rounded-xl font-semibold text-xs h-9 px-4 border-slate-200">
                  Buat Sekarang
                </Button>
              </Card>
            ) : (
              currentBookings.map((booking) => (
                <Card key={booking.id} className="border border-slate-200/80 shadow-md shadow-slate-100/50 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="bg-slate-50/60 px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center border-b border-slate-100">
                      {getStatusBadge(booking.status)}
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">#{booking.id.slice(-6).toUpperCase()}</span>
                    </div>
                    
                    <CardContent className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 border border-slate-200/40 flex items-center justify-center shrink-0">
                          <Stethoscope size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{booking.doctor?.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{booking.doctor?.specialization}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-2.5 bg-slate-50/70 p-3 sm:p-4 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                          <CalendarIcon size={13} className="text-slate-400 mt-0.5 shrink-0" />
                          <span className="leading-snug">{new Date(booking.appointmentDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                          <Clock size={13} className="text-slate-400 shrink-0" />
                          <span>{booking.appointmentTime} WIB</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600 border-t border-slate-200/50 pt-2 mt-1">
                          <PlusCircle size={13} className="text-primary/70 shrink-0" />
                          <span className="truncate font-semibold text-slate-700">{booking.service?.title}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {booking.status === "PENDING" && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <Button variant="outline" className="w-full rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-10 text-xs font-semibold transition-colors">
                        Batalkan
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Riwayat Kunjungan Selesai */}
        <TabsContent value="history" className="mt-0 focus-visible:outline-none">
          {historyBookings.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 py-12 sm:py-16 px-6 text-center bg-slate-50/40 rounded-2xl">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium text-sm">Belum ada riwayat reservasi.</p>
            </Card>
          ) : (
            <>
              {/* Mobile: card list (hidden sm+) */}
              <div className="flex flex-col gap-3 sm:hidden">
                {historyBookings.map((booking) => (
                  <Card key={booking.id} className="border border-slate-200/70 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="px-4 py-3 bg-slate-50/60 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <CalendarIcon size={12} className="text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{new Date(booking.appointmentDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm truncate">{booking.doctor?.name}</span>
                        <span className="text-xs text-slate-400 mt-0.5 truncate">{booking.doctor?.specialization}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium truncate">{booking.service?.title}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop: table (hidden on mobile) */}
              <Card className="hidden sm:block border border-slate-200/70 shadow-md shadow-slate-100/50 rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="px-4 lg:px-6 py-4">Tanggal</th>
                          <th className="px-4 lg:px-6 py-4">Dokter</th>
                          <th className="px-4 lg:px-6 py-4">Layanan</th>
                          <th className="px-4 lg:px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {historyBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors bg-white">
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2 font-medium text-slate-700">
                                <CalendarIcon size={13} className="text-slate-400 shrink-0" />
                                <span className="text-xs lg:text-sm">{new Date(booking.appointmentDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 text-xs lg:text-sm truncate max-w-[140px] lg:max-w-none">{booking.doctor?.name}</span>
                                <span className="text-xs text-slate-400 mt-0.5 truncate max-w-[140px] lg:max-w-none">{booking.doctor?.specialization}</span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 text-slate-600 font-medium text-xs lg:text-sm max-w-[120px] lg:max-w-none">
                              <span className="line-clamp-2">{booking.service?.title}</span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(booking.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}