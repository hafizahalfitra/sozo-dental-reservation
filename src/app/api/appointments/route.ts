import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    const where =
      session.user.role === "ADMIN"
        ? {}
        : { patientId: session.user.id };

    const appointments = await prisma.appointment.findMany({
      where: patientId && session.user.role === "ADMIN" ? { patientId } : where,
      include: {
        doctor: { select: { id: true, name: true, specialization: true, image: true } },
        service: { select: { id: true, title: true, duration: true, price: true } },
        patient: { select: { id: true, name: true, email: true } },
      },
      orderBy: { appointmentDate: "desc" },
    });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("[APPOINTMENTS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments" },
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
    const parsed = appointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { doctorId, serviceId, appointmentDate, appointmentTime, notes } = parsed.data;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId,
        serviceId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        notes,
        status: "PENDING",
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        service: { select: { title: true, price: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: appointment, message: "Appointment booked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[APPOINTMENTS_POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
