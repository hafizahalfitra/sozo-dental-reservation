import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { available: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    console.error("[DOCTORS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
