"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Heart, Globe, Users, Lightbulb, BookOpen, Code2, Award, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Mission() {
  const coreValues = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Passion for Open Source",
      description: "We believe in the transformative power of open-source software and the freedom it brings to users and developers alike."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Cybersecurity Excellence",
      description: "We prioritize security education and practice, ensuring our community is equipped to build and maintain secure systems."
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Community First",
      description: "Our community is at the heart of everything we do. We prioritize collaboration, mutual support, and inclusive participation."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-500" />,
      title: "Knowledge Sharing",
      description: "We believe that knowledge should be freely shared and accessible to all, fostering continuous learning and growth."
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      title: "African Innovation",
      description: "We're committed to showcasing and fostering technological innovation across the African continent."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "Continuous Learning",
      description: "We embrace a culture of lifelong learning, encouraging curiosity and the pursuit of new skills and knowledge."
    },
    {
      icon: <Code2 className="w-8 h-8 text-indigo-500" />,
      title: "Technical Excellence",
      description: "We strive for high standards in technical skills while maintaining accessibility for learners at all levels."
    }
  ];

  const impactGoals = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Build a Thriving Community",
      description: "Create a vibrant ecosystem of 1000+ active members across West Africa by 2026",
      metrics: "Currently: 500+ members"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Democratize Tech Education",
      description: "Provide free, high-quality technical education to underserved communities",
      metrics: "Target: 100+ workshops annually"
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Foster Open Source Contribution",
      description: "Encourage and support African developers to contribute to global open-source projects",
      metrics: "Goal: 50+ active contributors"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Bridge the Digital Divide",
      description: "Make technology accessible and relevant to local African contexts and challenges",
      metrics: "Impact: 5+ cities reached"
    }
  ];

  const principles = [
    {
      title: "Inclusivity & Accessibility",
      description: "We welcome people of all backgrounds, skill levels, and perspectives. Technology should be accessible to everyone, regardless of economic status or educational background."
    },
    {
      title: "Practical Learning",
      description: "We focus on hands-on, practical learning experiences that directly apply to real-world scenarios and career development."
    },
    {
      title: "Cultural Relevance",
      description: "We ensure our programs and projects address local African challenges and leverage local innovation and creativity."
    },
    {
      title: "Sustainability",
      description: "We build sustainable programs that can grow and evolve with our community, ensuring long-term impact and value."
    },
    {
      title: "Collaboration Over Competition",
      description: "We believe in the power of collaboration and mutual support over individual competition, fostering a supportive learning environment."
    },
    {
      title: "Freedom Through Technology",
      description: "We advocate for digital freedom, privacy rights, and the use of technology as a tool for empowerment and liberation."
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-6">
            <Target className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Our Mission</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Empowering Africa through Linux, Open-Source software, cybersecurity excellence, and collaborative innovation
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-2xl text-foreground leading-relaxed mb-8">
                To democratize access to technology education and foster a thriving community of 
                Linux, Open-Source, and Cybersecurity enthusiasts across Africa, empowering individuals to become 
                creators, innovators, and leaders in the secure digital economy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">600+</div>
                  <div className="text-muted-foreground">Community Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10+</div>
                  <div className="text-muted-foreground">Workshops Conducted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5+</div>
                  <div className="text-muted-foreground">Cities Reached</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-3xl">
                    <Eye className="w-10 h-10 text-primary mr-4" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    We envision an Africa where technology is not just consumed but created, where 
                    every individual has the opportunity to participate in the digital revolution, 
                    and where open-source principles drive innovation and economic growth.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    By 2030, we see LOSL-C as the premier technology community across West Africa, 
                    having trained thousands of developers, system administrators, and tech 
                    entrepreneurs who are leading the continent&apos;s digital transformation.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="border-2 mt-0 pt-0 border-primary/20 overflow-hidden duration-200 hover:border-primary">
                <CardContent className="p-0">
                  <Image
                    src="/people.png"
                    alt="African tech community collaboration"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover rounded-t-sm"
                  />
                  <div className="p-6">
                    <p className="text-center text-muted-foreground font-medium">
                      Building the future of African technology, one community member at a time
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide our community and shape our approach to technology education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card 
                key={index}
                className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {value.icon}
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Goals */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Impact Goals</h2>
            <p className="text-xl text-muted-foreground">
              Measurable objectives that drive our mission forward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactGoals.map((goal, index) => (
              <Card 
                key={index}
                className="border-2 border-border hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{goal.title}</CardTitle>
                      <p className="text-muted-foreground">{goal.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-sm font-semibold text-primary">{goal.metrics}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Guiding Principles</h2>
            <p className="text-xl text-muted-foreground">
              The foundational beliefs that shape how we operate and serve our community
            </p>
          </div>
          
          <div className="space-y-6">
            {principles.map((principle, index) => (
              <Card 
                key={index}
                className="border-l-primary hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
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
                Join Our Mission
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Be part of the movement that&apos;s shaping the future of technology in Africa. 
                Together, we can build a more inclusive and innovative digital ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="https://link.loslc.tech/discord">
                  <Button size="lg" className="hover:scale-105 transition-all duration-200">
                    <Users className="mr-2 w-5 h-5" />
                    Join Our Community
                  </Button>
                </Link>
                <Link href="/learn-more">
                  <Button variant="outline" size="lg" className="hover:scale-105 transition-all duration-200">
                    <BookOpen className="mr-2 w-5 h-5" />
                    Learn More About Us
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
