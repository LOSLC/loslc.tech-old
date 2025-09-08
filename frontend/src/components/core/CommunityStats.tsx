import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, MapPin, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CommunityStats() {
  const { t } = useTranslation();
  const stats = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      number: t('communityStats.stats.members.number'),
      label: t('communityStats.stats.members.label'),
      description: t('communityStats.stats.members.description')
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      number: t('communityStats.stats.workshops.number'),
      label: t('communityStats.stats.workshops.label'),
      description: t('communityStats.stats.workshops.description')
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      number: t('communityStats.stats.events.number'),
      label: t('communityStats.stats.events.label'),
      description: t('communityStats.stats.events.description')
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      number: t('communityStats.stats.cities.number'),
      label: t('communityStats.stats.cities.label'),
      description: t('communityStats.stats.cities.description')
    },
  ];

  return (
    <section className="w-full py-20 px-6 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{t('communityStats.title')}</h2>
          <p className="text-xl text-muted-foreground">
            {t('communityStats.subtitle')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="border border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 motion-preset-focus"
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
