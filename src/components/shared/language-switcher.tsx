"use client";

import { useLocale } from "next-intl";
import { routing, useRouter, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onLanguageChange(nextLocale: "en" | "id") {
    router.replace(
      // @ts-ignore
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 rounded-full px-3 transition-all hover:bg-primary/10 hover:text-primary"
        >
          <Languages size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">
            {locale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 p-1">
        <DropdownMenuItem
          onClick={() => onLanguageChange("id")}
          className={cn(
            "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            locale === "id" ? "bg-primary text-white" : "hover:bg-slate-100"
          )}
        >
          ID - Indonesia
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLanguageChange("en")}
          className={cn(
            "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            locale === "en" ? "bg-primary text-white" : "hover:bg-slate-100"
          )}
        >
          EN - English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
