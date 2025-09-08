import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { forwardRef } from "react";
import { Code2, Cpu, Handshake, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AboutSectionProps {
  className?: string;
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ className }, ref) => {
  const { t } = useTranslation();
    return (
      <section
        ref={ref}
        className={`w-full py-20 px-6 bg-gradient-to-b from-background via-muted/20 to-background ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8 motion-preset-slide-right">
              <div>
        <h2 className="text-4xl font-bold text-foreground mb-6">
                  {t('about.title')}
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('about.description')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Code2 className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('about.bullets.openSource.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.bullets.openSource.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('about.bullets.cybersecurity.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.bullets.cybersecurity.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Cpu className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('about.bullets.sysadmin.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.bullets.sysadmin.description')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Handshake className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('about.bullets.community.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('about.bullets.community.description')}
                    </p>
                  </div>
                </div>
              </div>

      <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/mission">
                  <Button
        size="lg"
        className="hover:scale-105 transition-all duration-200 shadow-sm cursor-pointer"
                  >
                    {t('about.cta.learnMission')}
                  </Button>
                </Link>
                <Link href="https://github.com/LOSLC">
                  <Button
                    variant="outline"
        size="lg"
        className="hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    {t('about.cta.seeProjects')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Content */}
            <div className="motion-preset-slide-left">
              <Card className="border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div>
                    <div className="bottom-4 left-4 right-4">
                      <Card className="backdrop-blur-sm border-none">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            {t('about.banner')}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

AboutSection.displayName = "AboutSection";

export default AboutSection;
