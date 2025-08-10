import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageCircle, Calendar, Github, Mic } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function CallToAction() {
  const { t } = useTranslation();
  return (
    <section className="w-full py-20 px-6 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="max-w-5xl mx-auto">
        <Card className="border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {t('callToAction.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t('callToAction.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href={"https://link.loslc.tech/next-event"}
                className={`${buttonVariants({ variant: "default", size: "lg" })} group px-8 py-6 text-lg hover:scale-105 transition-all duration-200`}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t('callToAction.joinDiscord')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={"https://link.loslc.tech/next-event"}
                className={`${buttonVariants({ variant: "outline", size: "lg" })} group px-8 py-6 text-lg hover:scale-105 transition-all duration-200`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                {t('callToAction.attendNextEvent')}
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={"https://github.com/LOSLC"}
                className={`${buttonVariants({ variant: "outline", size: "lg" })} group px-6 py-4 hover:scale-105 transition-all duration-200`}
              >
                <Github className="mr-2 h-5 w-5" />
                {t('callToAction.viewProjects')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={"https://link.loslc.tech/be-speaker"}
                className={`${buttonVariants({ variant: "outline", size: "lg" })} group px-6 py-4 hover:scale-105 transition-all duration-200`}
              >
                <Mic className="mr-2 h-5 w-5" />
                {t('callToAction.becomeSpeaker')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="select-none text-sm text-muted-foreground">
                {t('callToAction.tagline')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
