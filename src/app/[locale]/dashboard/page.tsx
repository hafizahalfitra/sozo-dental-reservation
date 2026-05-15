import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/login`);
  }

  if (session.user.role === "ADMIN") {
    redirect(`/${locale}/dashboard/admin`);
  }

  redirect(`/${locale}/dashboard/patient`);
}
