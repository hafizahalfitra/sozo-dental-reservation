"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Sparkles, Star, ShieldCheck, Play, MousePointer2 } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");
  
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-black pt-24 pb-16">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" 
        />
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, 
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, white, transparent)' 
          }} 
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* LEFT COLUMN: Content */}
          <div className="lg:col-span-7">
            <motion.div 
              initial="initial"
              animate="animate"
              transition={{ staggerChildren: 0.15 }}
              className="space-y-10 text-center lg:text-left"
            >
              <motion.div variants={fadeUp}>
                <Badge
                  variant="outline"
                  className="rounded-full px-4 py-1.5 border-primary/20 bg-white/50 dark:bg-white/5 backdrop-blur-md shadow-sm"
                >
                  <Sparkles size={14} className="mr-2 text-primary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">
                    {t("badge")}
                  </span>
                </Badge>
              </motion.div>

              <motion.h1 
                variants={fadeUp}
                className="text-6xl md:text-[92px] font-bold tracking-[-0.05em] leading-[0.85] text-slate-900 dark:text-white"
              >
                {t("title")} <br />
                <span className="relative inline-block mt-2">
                  <span className="font-serif italic font-light text-primary lowercase pr-4">{t("titleItalic")}</span>
                  <motion.svg 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                    viewBox="0 0 300 10"
                  >
                    <path d="M5 5 Q 150 15 295 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                  </motion.svg>
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeUp}
                className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-slate-600 dark:text-slate-400 font-normal leading-relaxed"
              >
                {t("description")}
              </motion.p>

              <motion.div 
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
              >
                <Button asChild size="lg" className="group relative h-16 px-10 rounded-full bg-slate-900 dark:bg-white dark:text-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10">
                  <Link href="/booking" className="relative z-10 flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase">
                    {t("cta")}
                    <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </Link>
                </Button>

                <button className="group flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-slate-500 hover:text-primary transition-all">
                  <div className="h-14 w-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <Play size={16} className="fill-current relative z-10" />
                    <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                  </div>
                  <span>{t("watchTour")}</span>
                </button>
              </motion.div>

              {/* Trust Section */}
              <motion.div 
                variants={fadeUp}
                className="pt-10 flex flex-wrap items-center justify-center lg:justify-start gap-12"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex -space-x-3 items-center">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-black bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=dentist${i}`} alt="Specialist" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold border-2 border-white dark:border-black">
                      +8
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{t("specialists")}</p>
                </div>

                <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="ml-2 text-sm font-bold text-slate-900 dark:text-white">5.0</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{t("satisfaction")}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -z-10 -top-20 -right-20 w-[140%] h-[140%] bg-gradient-radial from-primary/5 to-transparent opacity-50" />
            
            <div className="relative z-10 aspect-[4/5.5] group">
              <div className="w-full h-full rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070"
                  alt="Studio Interior"
                  className="object-cover w-full h-full grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                />
              </div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/20 max-w-[200px]"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-900 dark:text-white">Safe Studio</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Fully sterilized with UV-C & HEPA technology.</p>
              </motion.div>

              <div className="absolute bottom-10 -left-10 h-28 w-28 rounded-full bg-primary text-white flex flex-col items-center justify-center shadow-2xl rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500">
                <MousePointer2 size={24} className="mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-tighter text-center leading-none">Immersive<br/>Space</span>
              </div>
            </div>

            {/* Background Rings */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-[120%] h-[120%] border border-slate-200 dark:border-slate-800 rounded-full opacity-50 animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-[90%] h-[90%] border border-primary/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}