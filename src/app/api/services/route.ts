import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("[SERVICES_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
