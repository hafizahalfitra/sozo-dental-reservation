import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        doctor: { select: { name: true } },
        service: { select: { title: true } },
        user: { select: { name: true, email: true } },
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("APPOINTMENT_PATCH_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error: any) {
    console.error("APPOINTMENT_DELETE_ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
