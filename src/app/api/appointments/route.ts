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

    const bookings = await prisma.booking.findMany({
      where: userId && session.user.role === "ADMIN" ? { userId } : where,
      include: {
        doctor: { select: { id: true, name: true, specialization: true, image: true } },
        service: { select: { id: true, title: true, duration: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { appointmentDate: "desc" },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
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

    if (!body) {
      return NextResponse.json({ success: false, error: "Empty request body" }, { status: 400 });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      console.error("VALIDATION ERROR:", parsed.error.issues);
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { patientName, patientPhone, doctorId, serviceId, appointmentDate, appointmentTime, notes } = parsed.data;

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        patientName,
        patientPhone,
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

    console.log("BOOKING CREATED:", booking.id);

    return NextResponse.json(
      { success: true, data: booking, message: "Booking created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("APPOINTMENT API ERROR:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || "Internal Server Error",
        details: error instanceof Error ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
