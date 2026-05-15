"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  Trash2, 
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";
import type { BookingType } from "@/types";

export default function AdminPage() {
  const t = useTranslations("booking");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<BookingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/");
      toast.error("Unauthorized access");
    } else if (status === "authenticated") {
      fetchAppointments();
    }
  }, [status, session, router]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/appointments");
      const json = await response.json();
      if (json.success) {
        setAppointments(json.data);
      } else {
        toast.error(json.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("ADMIN_FETCH_ERROR:", error);
      toast.error("Fetch error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(`Status updated to ${newStatus}`);
        setAppointments(prev =>
          prev.map(item => item.id === id ? { ...item, status: newStatus as any } : item)
        );
      } else {
        toast.error(json.error || "Update failed");
      }
    } catch (err) {
      console.error("STATUS_UPDATE_ERROR:", err);
      toast.error("Network error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100 shadow-none"><Clock className="w-3 h-3 mr-1" /> {t("status.pending")}</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 shadow-none"><CheckCircle2 className="w-3 h-3 mr-1" /> {t("status.approved")}</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 shadow-none"><XCircle className="w-3 h-3 mr-1" /> {t("status.rejected")}</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-none">{t("status.completed")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clinic Admin Dashboard</h1>
          <p className="text-slate-500 font-medium">
            Total Appointments: <span className="text-primary font-bold">{appointments.length}</span>
          </p>
        </div>
        <Button onClick={fetchAppointments} variant="outline" className="rounded-full gap-2">
          <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh Data
        </Button>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold py-5 pl-8">Patient Name</TableHead>
                <TableHead className="font-bold py-5">Phone</TableHead>
                <TableHead className="font-bold py-5">Doctor</TableHead>
                <TableHead className="font-bold py-5">Date</TableHead>
                <TableHead className="font-bold py-5">Status</TableHead>
                <TableHead className="text-right font-bold py-5 pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                    No records found in database.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/30 border-slate-50">
                    <TableCell className="py-5 pl-8 font-semibold text-slate-900">
                      {item.name || item.user?.name}
                    </TableCell>
                    <TableCell className="py-5 text-slate-600">
                      {item.phone}
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="font-medium">{item.doctor?.name}</div>
                      <div className="text-xs text-slate-400">{item.service?.title}</div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="text-sm font-medium">{new Date(item.appointmentDate).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">{item.appointmentTime}</div>
                    </TableCell>
                    <TableCell className="py-5">
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="py-5 pr-8 text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === "PENDING" && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 h-9"
                              onClick={() => updateStatus(item.id, "APPROVED")}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 h-9"
                              onClick={() => updateStatus(item.id, "REJECTED")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {item.status !== "PENDING" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-400 hover:text-primary rounded-full"
                            onClick={() => updateStatus(item.id, "PENDING")}
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
