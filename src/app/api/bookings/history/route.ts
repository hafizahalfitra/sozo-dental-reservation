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

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["COMPLETED", "CANCELLED"],
        },
      },
      include: {
        doctor: { select: { id: true, name: true, specialization: true, image: true } },
        service: { select: { id: true, title: true, duration: true, price: true } },
      },
      orderBy: { appointmentDate: "desc" },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("[BOOKINGS_HISTORY_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking history" },
      { status: 500 }
    );
  }
}
