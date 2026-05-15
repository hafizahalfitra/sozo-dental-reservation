import HeroSection from "@/components/shared/hero-section";
import ServicesSection from "@/components/shared/services-section";
import DoctorPreviewSection from "@/components/doctor/doctor-preview-section";
import WhyChooseUs from "@/components/shared/why-choose-us";
import CTASection from "@/components/shared/cta-section";

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <ServicesSection />
      <DoctorPreviewSection />
      <WhyChooseUs />
      <CTASection />
    </main>
  );
}