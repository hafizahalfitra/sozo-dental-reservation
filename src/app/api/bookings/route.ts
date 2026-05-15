import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { doctorId, serviceId, appointmentDate, appointmentTime, notes } = parsed.data;

    const booking = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        name: parsed.data.patientName || "Unknown",
        phone: parsed.data.patientPhone || "Unknown",
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
      { success: true, data: booking, message: "Booking created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
