import SectionTitle from "./section-title";
import { 
  Award, 
  Clock, 
  HeartHandshake, 
  Users 
} from "lucide-react";

const features = [
  {
    title: "Expert Doctors",
    description: "Our team consists of highly qualified and experienced dental specialists.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Advanced Technology",
    description: "We use the latest dental equipment and digital imaging for precise diagnosis.",
    icon: <Award className="h-6 w-6" />,
  },
  {
    title: "Patient-First Approach",
    description: "Your comfort and satisfaction are our top priorities at every visit.",
    icon: <HeartHandshake className="h-6 w-6" />,
  },
  {
    title: "Convenient Scheduling",
    description: "Flexible appointment times including evenings and weekends for your convenience.",
    icon: <Clock className="h-6 w-6" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1170&auto=format&fit=crop"
                alt="Our Modern Clinic"
                className="rounded-3xl shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl z-20 hidden sm:block">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-primary">15+</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    Years of<br />Experience
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-8">
            <SectionTitle
              align="left"
              subtitle="Why Choose Us"
              title="Experience Dental Care Reimagined"
              description="We combine medical excellence with a premium hospitality experience to make your dental visits something to look forward to."
              className="mb-8"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col space-y-3 group">
                  <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
