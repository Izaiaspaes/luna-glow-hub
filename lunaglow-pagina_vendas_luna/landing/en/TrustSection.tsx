import { Shield, Lock, CheckCircle, RefreshCw, FileCheck, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const trustBadges = [
  {
    icon: RefreshCw,
    title: "7-Day Guarantee",
    description: "Not satisfied? We'll refund 100% of your money, no questions asked"
  },
  {
    icon: Lock,
    title: "Encrypted Data",
    description: "End-to-end encryption. Your data is never shared"
  },
  {
    icon: Shield,
    title: "GDPR Compliant",
    description: "Full compliance with General Data Protection Regulation"
  },
  {
    icon: FileCheck,
    title: "SSL Certificate",
    description: "Secure and protected connection in all your interactions"
  },
  {
    icon: Award,
    title: "Regular Audits",
    description: "Security tested and approved by independent experts"
  },
  {
    icon: CheckCircle,
    title: "Secure Payment",
    description: "Processing via certified and recognized platforms"
  }
];

export const TrustSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Trust is Our Priority
          </h2>
          <p className="text-lg text-muted-foreground">
            Committed to your security, privacy and satisfaction
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-luna-pink-light/30 border-2 border-primary/20 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">
              Over 10,000 women trust Luna Glow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};