import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
      include: {
        doctor: { select: { id: true, name: true, specialization: true, image: true } },
        service: { select: { id: true, title: true, duration: true, price: true } },
      },
      orderBy: { appointmentDate: "asc" },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("[BOOKINGS_CURRENT_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch current bookings" },
      { status: 500 }
    );
  }
}
