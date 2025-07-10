import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, MapPin, Shield } from "lucide-react";

export default function CommunityStats() {
  const stats = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      number: "500+",
      label: "Community Members",
      description: "Active contributors and enthusiasts"
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      number: "15+",
      label: "Security Workshops",
      description: "Cybersecurity training sessions"
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      number: "10+",
      label: "Events Organized",
      description: "Workshops, meetups, and conferences"
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      number: "5+",
      label: "Cities Reached",
      description: "Across Togo and West Africa"
    },
  ];

  return (
    <section className="w-full py-16 px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Impact in Numbers</h2>
          <p className="text-xl text-muted-foreground">
            See how we&apos;re growing and making a difference in the tech community
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="border-none bg-background hover:bg-card transition-all duration-300 hover:scale-105 motion-preset-focus"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
