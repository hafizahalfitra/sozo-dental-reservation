"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Login successful");
        router.refresh();
        const callbackUrl = searchParams.get("redirect") || "/";
        router.push(callbackUrl as any);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/40 p-4 sm:p-6 lg:p-8 antialiased overflow-hidden">
      {/* Background Aesthetic Soft Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Card className="w-full max-w-[420px] border border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-3xl overflow-hidden bg-white dark:bg-slate-900 transition-all duration-300">
        <CardHeader className="space-y-3 pt-8 pb-4 px-6 sm:px-8 text-center">
          {/* Brand/Security Icon Indicator */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
              {t("subtitle")}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-8 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Field Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {t("email")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          placeholder="name@example.com"
                          {...field}
                          disabled={isLoading}
                          className="pl-11 rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 focus-visible:ring-primary/20 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-sm w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-rose-500 pt-0.5" />
                  </FormItem>
                )}
              />

              {/* Field Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {t("password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          type="password"
                          {...field}
                          disabled={isLoading}
                          placeholder="••••••••"
                          className="pl-11 rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 focus-visible:ring-primary/20 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-sm w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium text-rose-500 pt-0.5" />
                  </FormItem>
                )}
              />

              {/* Tombol Submit Premium */}
              <div className="pt-2">
                <Button
                  className="w-full h-12 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] bg-primary text-white flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  <span>{t("button")}</span>
                </Button>
              </div>
            </form>
          </Form>

          {/* Registrasi Link Section */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800/60 pt-5">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline underline-offset-4 ml-1 transition-all">
              {t("register")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}