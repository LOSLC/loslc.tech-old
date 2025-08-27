"use client";

import Footer from "@/components/core/Footer";
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
import { useTranslation } from "react-i18next";

export default function LearnMore() {
  const { t } = useTranslation();
  const admins = [
    {
      name: "Daniel Ametsowou",
      roleKey: "learnMore.admins.daniel.role",
      avatar: "dani.png",
      bioKey: "learnMore.admins.daniel.bio",
      specialtiesKey: "learnMore.admins.daniel.specialties",
    },
    {
      name: "Rayane Tchabodi",
      roleKey: "learnMore.admins.rayane.role",
      avatar: "ray.jpg",
      bioKey: "learnMore.admins.rayane.bio",
      specialtiesKey: "learnMore.admins.rayane.specialties",
    },
    {
      name: "Emerick Mitchikpè",
      roleKey: "learnMore.admins.emerick.role",
      avatar: "emer.png",
      bioKey: "learnMore.admins.emerick.bio",
      specialtiesKey: "learnMore.admins.emerick.specialties",
    },
    {
      name: "Laureen Ekon",
      roleKey: "learnMore.admins.laureen.role",
      avatar: "laur.png",
      bioKey: "learnMore.admins.laureen.bio",
      specialtiesKey: "learnMore.admins.laureen.specialties",
    },
    {
      name: "Kallern Atter",
      roleKey: "learnMore.admins.kallern.role",
      avatar: "kall.jpg",
      bioKey: "learnMore.admins.kallern.bio",
      specialtiesKey: "learnMore.admins.kallern.specialties",
    },
    {
      name: "Bayédzè Comlan",
      roleKey: "learnMore.admins.bayedze.role",
      avatar: "bay.jpg",
      bioKey: "learnMore.admins.bayedze.bio",
      specialtiesKey: "learnMore.admins.bayedze.specialties",
    },
    {
      name: "Denise Deabalo",
      roleKey: "learnMore.admins.denise.role",
      avatar: "den.png",
      bioKey: "learnMore.admins.denise.bio",
      specialtiesKey: "learnMore.admins.denise.specialties",
    },
    {
      name: "Abdou-Jabar Mikailou",
      roleKey: "learnMore.admins.abdou.role",
      avatar: "abdou.png",
      bioKey: "learnMore.admins.abdou.bio",
      specialtiesKey: "learnMore.admins.abdou.specialties",
    },
  ];

  const milestones = [
    {
      year: "2024",
      titleKey: "learnMore.milestones.founded.title",
      descriptionKey: "learnMore.milestones.founded.description",
      icon: <Users className="w-6 h-6" />,
    },
    {
      year: "January 2025",
      titleKey: "learnMore.milestones.firstWorkshop.title",
      descriptionKey: "learnMore.milestones.firstWorkshop.description",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      year: "Mid january 2025",
      titleKey: "learnMore.milestones.hundredMembers.title",
      descriptionKey: "learnMore.milestones.hundredMembers.description",
      icon: <Award className="w-6 h-6" />,
    },
    {
      year: "February 2025",
      titleKey: "learnMore.milestones.expansion.title",
      descriptionKey: "learnMore.milestones.expansion.description",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      year: "June 2025",
      titleKey: "learnMore.milestones.openSourceProjects.title",
      descriptionKey: "learnMore.milestones.openSourceProjects.description",
      icon: <Code2 className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-foreground mb-4">{t('learnMore.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('learnMore.subtitle')}
          </p>
        </div>
      </div>

      {/* Community Story */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">
                {t('learnMore.howItStartedTitle')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('learnMore.howItStartedText1')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('learnMore.howItStartedText2')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('learnMore.howItStartedText3')}
              </p>
            </div>
            <div className="relative">
              <Card className="p-0 m-0 border-2 border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="/lmevent.png"
                    alt="LOSL-C community gathering"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover rounded-sm"
                  />
                  <div className="p-6 bg-gradient-to-t from-background/95 to-transparent">
                    <p className="text-center text-muted-foreground">
                      {t('learnMore.imageCaption')}
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
              {t('learnMore.journeyTitle')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('learnMore.journeySubtitle')}
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
                                                        <CardTitle className="text-xl mb-2">
                                {t(milestone.titleKey)}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {t(milestone.descriptionKey)}
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
                                {t(milestone.titleKey)}
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            {t(milestone.descriptionKey)}
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
              {t('learnMore.adminsTitle')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('learnMore.adminsSubtitle')}
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
                    {t(admin.roleKey)}
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t(admin.bioKey)}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">
                      {t('learnMore.specialties')}
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(t(admin.specialtiesKey, { returnObjects: true }) as string[]).map((specialty: string, i: number) => (
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
                {t('learnMore.joinStoryTitle')}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t('learnMore.joinStoryText')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/join">
                  <Button
                    size="lg"
                    className="hover:scale-105 transition-all duration-200"
                  >
                    <Heart className="mr-2 w-5 h-5" />
                    {t('common.joinCommunity')}
                  </Button>
                </Link>
                <Link href="https://link.loslc.tech/next-event">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-all duration-200"
                  >
                    <Calendar className="mr-2 w-5 h-5" />
                    {t('common.attendNextEvent')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
