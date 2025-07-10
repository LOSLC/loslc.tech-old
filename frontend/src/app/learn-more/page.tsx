"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Heart,
  Code2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LearnMore() {
  const admins = [
    {
      name: "Daniel Ametsowou",
      role: "Founder & Lead Administrator",
      avatar: "dani.png",
      bio: "Passionate Linux advocate. Started LOSL-C to bridge the technology gap in Africa.",
      specialties: [
        "Software Development",
        "Linux System Administration",
        "Community Building",
      ],
    },
    {
      name: "Rayane Tchabodi",
      role: "Content Manager",
      avatar: "ray.jpg",
      bio: "Expert in digital communication. Creates the beautiful content you see on our platforms and manages community outreach.",
      specialties: [
        "Content Creation",
        "Mentorship Programs",
        "Event Planning",
      ],
    },
    {
      name: "Emerick Mitchikpè",
      role: "Cybersecurity Specialist & Trainer",
      avatar: "emer.png",
      bio: "Emerick is the boss of the bosses when it comes to cybersecurity. He leads our training programs in cybersecurity and ensures our community stays safe online.",
      specialties: [
        "Cybersecurity",
        "Training",
        "Community Safety & Engagement",
      ],
    },
    {
      name: "Laureen Ekon",
      role: "Communications Manager",
      avatar: "laur.png",
      bio: "This girl boss is the voice of LOSL-C. She handles all our communications, social media, and public relations.",
      specialties: ["Web Development", "Cybersecurity", "Communications"],
    },
    {
      name: "Kallern Atter",
      role: "WEB Pentester & Trainer",
      avatar: "kall.jpg",
      bio: "Although he is very humble, Kallern is master in his field. He specializes in web penetration testing and leads our training sessions on cybersecurity best practices.",
      specialties: ["Web Development", "Cybersecurity", "Community Engagement"],
    },
    {
      name: "Bayédzè Comlan",
      role: "Cybersecurity Specialist, Intelligence gatherer & Event planner",
      avatar: "bay.jpg",
      bio: "Without this guy, LOSL-C's events would not be as successful. Bayédzè is the calm in the storm, managing our events and ensuring everything runs smoothly.",
      specialties: [
        "Web Development",
        "System Administration",
        "Cybersecurity",
      ],
    },
    {
      name: "Denise Deabalo",
      role: "Web developer & Trainer",
      avatar: "den.png",
      bio: "This lady is the teacher you wish you had in school. Denise is a web developer and trainer who helps our members learn the skills they need to succeed in tech.",
      specialties: ["Web Development", "Training", "Project Management"],
    },
    {
      name: "Abdou-Jabar Mikailou",
      role: "Web developer & Intelligence gatherer",
      avatar: "abdou.png",
      bio: "Abdou-Jabar is a web developer and intelligence gatherer who helps our community stay informed about the latest trends and technologies in the industry.",
      specialties: ["Web Development", "Intelligence Gathering", "Trends"],
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Community Founded",
      description: "Started as a small group of Linux enthusiasts in Lomé",
      icon: <Users className="w-6 h-6" />,
    },
    {
      year: "January 2025",
      title: "First Workshop",
      description:
        "Organized our first Linux installation workshop for beginners",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      year: "Mid january 2025",
      title: "100 Members",
      description: "Reached our first major milestone of 100 active members",
      icon: <Award className="w-6 h-6" />,
    },
    {
      year: "February 2025",
      title: "Regional Expansion",
      description:
        "Extended our reach to other cities across Togo and West Africa",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      year: "June 2025",
      title: "Open Source Projects",
      description: "Launched several community-driven open source projects",
      icon: <Code2 className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-foreground mb-4">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Learn about the journey of LOSL-C and the passionate people who make
            our community special
          </p>
        </div>
      </div>

      {/* Community Story */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                How It All Started
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                LOSL-C was born from a simple observation: while technology was
                rapidly advancing globally, many communities in Africa lacked
                access to quality technical education and open-source knowledge.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                What started as informal meetups between friends passionate
                about Linux has grown into a vibrant community of over 500
                members across West Africa. We believe that technology should be
                accessible to everyone, regardless of their background or
                location.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we&apos;re not just a Linux user group - we&apos;re a
                family of developers, system administrators, students, and tech
                enthusiasts working together to build a better technological
                future for Africa.
              </p>
            </div>
            <div className="relative">
              <Card className="border-2 border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/lmevent.png"
                    alt="LOSL-C community gathering"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-6 bg-gradient-to-t from-background/95 to-transparent">
                    <p className="text-center text-muted-foreground">
                      One of our early community workshops in Lomé, Togo
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our community&apos;s growth and development
            </p>
          </div>

          <div className="relative">
            {/* Timeline line - hidden on mobile, visible on desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-border h-full hidden lg:block"></div>
            {/* Mobile timeline line */}
            <div className="absolute left-6 w-1 bg-border h-full lg:hidden"></div>

            <div className="space-y-8 lg:space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center lg:${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Mobile Layout */}
                  <div className="flex items-center w-full lg:hidden">
                    {/* Timeline dot for mobile */}
                    <div className="w-6 h-6 bg-primary rounded-full border-4 border-background relative z-10 mr-6 flex-shrink-0"></div>

                    <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 flex-1">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            {milestone.icon}
                          </div>
                          <div>
                            <div className="text-xl font-bold text-primary">
                              {milestone.year}
                            </div>
                            <CardTitle className="text-lg">
                              {milestone.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:flex lg:items-center lg:w-full">
                    <div
                      className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}
                    >
                      <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
                        <CardHeader>
                          <div
                            className={`flex items-center gap-3 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
                          >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              {milestone.icon}
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                {milestone.year}
                              </div>
                              <CardTitle className="text-lg">
                                {milestone.title}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline dot for desktop */}
                    <div className="w-6 h-6 bg-primary rounded-full border-4 border-background relative z-10"></div>

                    <div className="w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admins Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet Our Admins
            </h2>
            <p className="text-xl text-muted-foreground">
              The dedicated leaders who keep our community thriving
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {admins.map((admin, index) => (
              <Card
                key={index}
                className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center text-4xl mx-auto mb-4">
                    <Image
                      src={`/staff/${admin.avatar}`}
                      alt={`${admin.name}'s avatar`}
                      width={100}
                      height={100}
                      className="rounded-full object-cover w-[100px] h-[100px]"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {admin.name}
                  </h3>
                  <p className="text-primary font-semibold mb-4">
                    {admin.role}
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {admin.bio}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">
                      Specialties:
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {admin.specialties.map((specialty, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Want to Be Part of Our Story?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Every great community is built by its members. Join us and help
                write the next chapter of technological advancement in Africa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="https://link.loslc.tech/discord">
                  <Button
                    size="lg"
                    className="hover:scale-105 transition-all duration-200"
                  >
                    <Heart className="mr-2 w-5 h-5" />
                    Join Our Community
                  </Button>
                </Link>
                <Link href="https://link.loslc.tech/next-event">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-all duration-200"
                  >
                    <Calendar className="mr-2 w-5 h-5" />
                    Attend Next Event
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
