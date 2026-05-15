"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  CheckCircle2, 
  Clock3, 
  XCircle,
  Loader2,
  TrendingUp,
  MoreVertical
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { AppointmentType } from "@/types";

export default function AdminDashboard() {
  const t = useTranslations("dashboard.admin");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0,
    revenue: 0
  });

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "ADMIN")) {
      router.push("/login");
    }

    async function fetchData() {
      try {
        const response = await fetch("/api/appointments");
        const data = await response.json();
        if (data.success) {
          const apps = data.data as AppointmentType[];
          setAppointments(apps);
          
          // Calculate basic stats
          const uniquePatients = new Set(apps.map(a => a.patientId)).size;
          const uniqueDoctors = new Set(apps.map(a => a.doctorId)).size;
          const completedApps = apps.filter(a => a.status === "COMPLETED");
          const rev = completedApps.reduce((acc, curr) => acc + (curr.service?.price || 0), 0);
          
          setStats({
            totalAppointments: apps.length,
            totalDoctors: uniqueDoctors,
            totalPatients: uniquePatients,
            revenue: rev
          });
        }
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated" && session?.user.role === "ADMIN") {
      fetchData();
    }
  }, [status, session, router]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Appointment marked as ${newStatus.toLowerCase()}`);
        setAppointments(appointments.map(app => 
          app.id === id ? { ...app, status: newStatus as any } : app
        ));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-none"><Clock3 className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "CONFIRMED":
        return <Badge variant="secondary" className="bg-green-100 text-green-700 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary" className="bg-red-100 text-red-700 border-none"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
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

  return (
    <div className="container mx-auto py-10 px-4 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-slate-500">Welcome back, {session?.user?.name}. Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="border-none shadow-sm bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{t("stats.totalAppointments")}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.totalAppointments}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Calendar size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{t("stats.totalDoctors")}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.totalDoctors}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                <Stethoscope size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-purple-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{t("stats.totalPatients")}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.totalPatients}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                <Users size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900">Rp {stats.revenue.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                <TrendingUp size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{t("recent")}</h2>
          <Button variant="outline" size="sm" className="rounded-full">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Patient</th>
                <th className="px-6 py-4 font-bold">Doctor & Service</th>
                <th className="px-6 py-4 font-bold">Date & Time</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {app.patient?.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{app.patient?.name}</span>
                          <span className="text-xs text-slate-400">{app.patient?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{app.doctor?.name}</span>
                        <span className="text-xs text-slate-500">{app.service?.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{new Date(app.appointmentDate).toLocaleDateString()}</span>
                        <span className="text-xs text-slate-400">{app.appointmentTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => updateStatus(app.id, "CONFIRMED")}>
                            Mark as Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, "COMPLETED")}>
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => updateStatus(app.id, "CANCELLED")}
                          >
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
