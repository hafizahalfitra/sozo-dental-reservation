import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const where =
      session.user.role === "ADMIN"
        ? {}
        : { userId: session.user.id };

    const appointments = await prisma.appointment.findMany({
      where: userId && session.user.role === "ADMIN" ? { userId } : where,
      include: {
        doctor: { select: { id: true, name: true, specialization: true } },
        service: { select: { id: true, title: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    console.error("APPOINTMENTS_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("APPOINTMENT PAYLOAD:", body);

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { patientName, patientPhone, doctorId, serviceId, appointmentDate, appointmentTime, notes } = parsed.data;

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        name: patientName, // Mapped from form patientName to schema name
        phone: patientPhone, // Mapped from form patientPhone to schema phone
        doctorId,
        serviceId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        notes,
        status: "PENDING",
      },
      include: {
        doctor: { select: { name: true } },
        service: { select: { title: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: appointment, message: "Appointment created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("APPOINTMENT_POST_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
