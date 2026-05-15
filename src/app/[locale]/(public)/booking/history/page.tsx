"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import type { BookingType } from "@/types";

export default function ReservationHistory() {
  const t = useTranslations("booking");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-none"><Clock3 className="w-3 h-3 mr-1" /> {t("status.pending")}</Badge>;
      case "APPROVED":
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> {t("status.approved")}</Badge>;
      case "REJECTED":
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-none"><XCircle className="w-3 h-3 mr-1" /> {t("status.rejected")}</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> {t("status.completed")}</Badge>;
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
    <div className="container mx-auto py-24 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Riwayat Reservasi</h1>
          <p className="text-slate-500 text-lg">Pantau jadwal dan status kunjungan gigi Anda.</p>
        </div>
        <Link href="/booking">
          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
            Buat Reservasi Baru <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {bookings.length === 0 ? (
          <Card className="border-dashed border-2 p-20 text-center bg-slate-50/50 rounded-3xl">
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t("history.empty")}</h3>
            <p className="text-slate-500 mb-6">Anda belum pernah melakukan reservasi di SOZO Dental.</p>
            <Link href="/booking">
              <Button size="lg" className="rounded-full px-8">
                Mulai Booking Sekarang
              </Button>
            </Link>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="border-none shadow-xl shadow-slate-100 rounded-3xl overflow-hidden hover:scale-[1.01] transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-slate-50/50 p-8 md:w-1/4 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-3">
                      <Calendar size={24} />
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(booking.appointmentDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                    </p>
                    <p className="text-sm text-slate-500">{booking.appointmentTime}</p>
                    <div className="mt-4">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Stethoscope size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dokter</p>
                          <h3 className="font-bold text-slate-900">{booking.doctor?.name}</h3>
                          <p className="text-sm text-slate-500">{booking.doctor?.specialization}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Layanan</p>
                          <h3 className="font-bold text-slate-900">{booking.service?.title}</h3>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nama Pasien</p>
                        <p className="font-semibold text-slate-700">{booking.name || session?.user?.name}</p>
                        <p className="text-xs text-slate-400">{booking.phone}</p>
                      </div>
                      
                      {booking.notes && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Keluhan / Catatan</p>
                          <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                            "{booking.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
