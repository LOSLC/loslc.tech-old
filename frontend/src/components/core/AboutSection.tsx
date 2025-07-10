import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { forwardRef } from "react";
import { Code2, Cpu, Handshake, Shield } from "lucide-react";

interface AboutSectionProps {
  className?: string;
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ className }, ref) => {
    return (
      <section
        ref={ref}
        className={`w-full py-16 px-6 bg-gradient-to-b from-muted/30 to-background ${className}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 motion-preset-slide-right">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  We&apos;re Linux Users, But Not Just That!
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  LOSL-C is more than a Linux user group. We&apos;re passionate
                  advocates for open-source software, cybersecurity excellence, digital freedom, and
                  technological empowerment across Africa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Code2 className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Open Source Development
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Contributing to projects that make a difference
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Cybersecurity Excellence
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Building secure systems and educating on digital safety
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Cpu className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      System Administration
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Mastering Linux systems and server management
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Handshake className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Community Building
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Fostering collaboration and knowledge exchange
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/mission">
                  <Button
                    size="lg"
                    className="hover:scale-105 transition-all duration-200"
                  >
                    Learn About Our Mission
                  </Button>
                </Link>
                <Link href="https://github.com/LOSLC">
                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:scale-105 transition-all duration-200"
                  >
                    See Our Projects
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Content */}
            <div className="motion-preset-slide-left">
              <Card className="border-2 border-primary/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div>
                    <div className="bottom-4 left-4 right-4">
                      <Card className="backdrop-blur-sm border-none">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            🌟 Join 500+ passionate developers, sysadmins, tech
                            enthusiasts and entrepreneurs across Africa!
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
