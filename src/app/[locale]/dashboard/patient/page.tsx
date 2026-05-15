"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Stethoscope, 
  CheckCircle2, 
  Clock3, 
  XCircle,
  Loader2,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import type { BookingType } from "@/types";

export default function PatientDashboard() {
  const t = useTranslations("dashboard.patient");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<BookingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    async function fetchAppointments() {
      try {
        const response = await fetch("/api/appointments");
        const data = await response.json();
        if (data.success) {
          setAppointments(data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchAppointments();
    }
  }, [status, router]);

  const cancelAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Appointment cancelled");
        setAppointments(appointments.map(app => 
          app.id === id ? { ...app, status: "REJECTED" as any } : app
        ));
      }
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"><Clock3 className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "APPROVED":
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case "REJECTED":
        return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-none"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const upcoming = appointments.filter(a => a.status === "PENDING" || a.status === "APPROVED");
  const history = appointments.filter(a => a.status === "COMPLETED" || a.status === "REJECTED");

  return (
    <div className="container mx-auto py-10 px-4 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-slate-500">{t("welcome")}, {session?.user?.name}</p>
        </div>
        <Button asChild className="rounded-full shadow-lg shadow-primary/20">
          <Link href="/appointment">
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-800">{t("upcoming")}</h2>
          </div>
          {upcoming.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-slate-500">
                {t("noAppointments")}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((app) => (
                <Card key={app.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-slate-50/50 pb-4">
                    <div className="flex justify-between items-start">
                      {getStatusBadge(app.status)}
                      <span className="text-xs text-slate-400 font-mono">#{app.id.slice(-6)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Stethoscope size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{app.doctor?.name}</p>
                        <p className="text-xs text-slate-500">{app.doctor?.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={14} className="text-primary" />
                        {new Date(app.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={14} className="text-primary" />
                        {app.appointmentTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={14} className="text-primary" />
                        {app.service?.title}
                      </div>
                    </div>

                    <div className="pt-2">
                      {app.status !== "REJECTED" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => cancelAppointment(app.id)}
                        >
                          {t("cancel")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-800">{t("history")}</h2>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Doctor</th>
                    <th className="px-6 py-4 font-semibold">Service</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No previous records found.
                      </td>
                    </tr>
                  ) : (
                    history.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                          {new Date(app.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{app.doctor?.name}</span>
                            <span className="text-xs text-slate-500">{app.doctor?.specialization}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {app.service?.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(app.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
