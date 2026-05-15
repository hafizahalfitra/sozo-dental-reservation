import SectionTitle from "./section-title";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Baby, 
  HeartPulse 
} from "lucide-react";

const services = [
  {
    title: "General Dentistry",
    description: "Comprehensive oral health checkups, cleanings, and preventative care for all ages.",
    icon: <Smile className="h-10 w-10 text-primary" />,
    color: "bg-blue-50",
  },
  {
    title: "Cosmetic Dentistry",
    description: "Enhance your smile with teeth whitening, veneers, and aesthetic restorations.",
    icon: <Sparkles className="h-10 w-10 text-purple-600" />,
    color: "bg-purple-50",
  },
  {
    title: "Orthodontics",
    description: "Straighten your teeth and correct bite issues with modern braces or clear aligners.",
    icon: <Activity className="h-10 w-10 text-green-600" />,
    color: "bg-green-50",
  },
  {
    title: "Pediatric Care",
    description: "Specialized dental care for children in a friendly, gentle environment.",
    icon: <Baby className="h-10 w-10 text-amber-600" />,
    color: "bg-amber-50",
  },
  {
    title: "Emergency Care",
    description: "Immediate assistance for dental trauma, severe pain, or broken teeth.",
    icon: <HeartPulse className="h-10 w-10 text-rose-600" />,
    color: "bg-rose-50",
  },
  {
    title: "Dental Implants",
    description: "Permanent and natural-looking solutions for missing teeth using the latest technology.",
    icon: <ShieldCheck className="h-10 w-10 text-sky-600" />,
    color: "bg-sky-50",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Our Expert Services"
          title="Comprehensive Care for Your Smile"
          description="We offer a wide range of dental services to help you achieve and maintain optimal oral health."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4">
                <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                  {service.icon}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
