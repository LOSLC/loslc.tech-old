import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Heart, Lightbulb, Globe, BookOpen, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Driven",
      description:
        "A vibrant community of Linux, Open-Source, and Cybersecurity enthusiasts sharing knowledge and experiences.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Cybersecurity Focus",
      description:
        "Dedicated to building secure systems and educating the community on cybersecurity best practices.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Passion for FOSS",
      description:
        "We believe in the power of Free and Open Source Software to transform lives and communities.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovation & Learning",
      description:
        "Fostering innovation through continuous learning, workshops, and collaborative projects.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "African Tech Growth",
      description:
        "Promoting technological advancement across Africa through open-source solutions.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Security Education",
      description:
        "Workshops, tutorials, and mentorship programs covering Linux, FOSS, and cybersecurity knowledge.",
    },
  ];

  return (
    <section className="w-full py-16 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Makes Us Special
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re more than just Linux users. We&apos;re a family of
            passionate individuals working together to build a better
            technological future for Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg motion-preset-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
