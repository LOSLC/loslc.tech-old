"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function TermsOfService() {
  const { t } = useTranslation();
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-4">
            <FileText className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">{t('termsOfService.title')}</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            {t('termsOfService.subtitle')}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('termsOfService.lastUpdated')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-primary" />
                <span>{t('termsOfService.acceptanceTitle')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('termsOfService.acceptanceText1')}
              </p>
              <p className="text-muted-foreground mt-4">
                {t('termsOfService.acceptanceText2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>{t('termsOfService.servicesTitle')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('termsOfService.servicesText')}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t('termsOfService.services.items.item1')}</li>
                <li>{t('termsOfService.services.items.item2')}</li>
                <li>{t('termsOfService.services.items.item3')}</li>
                <li>{t('termsOfService.services.items.item4')}</li>
                <li>{t('termsOfService.services.items.item5')}</li>
                <li>{t('termsOfService.services.items.item6')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.accountTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.account.sections.creationTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.account.sections.creationText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.account.sections.securityTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.account.sections.securityText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.account.sections.eligibilityTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.account.sections.eligibilityText')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.acceptableUseTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.acceptableUse.permittedTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.acceptableUse.permittedText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.acceptableUse.prohibitedTitle')}</h4>
                <p className="text-muted-foreground mb-2">{t('termsOfService.acceptableUse.prohibitedIntro')}</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>{t('termsOfService.acceptableUse.prohibitedItems.item1')}</li>
                  <li>{t('termsOfService.acceptableUse.prohibitedItems.item2')}</li>
                  <li>{t('termsOfService.acceptableUse.prohibitedItems.item3')}</li>
                  <li>{t('termsOfService.acceptableUse.prohibitedItems.item4')}</li>
                  <li>{t('termsOfService.acceptableUse.prohibitedItems.item5')}</li>
                  <li>{t("termsOfService.acceptableUse.prohibitedItems.item6")}</li>
                  <li>{t('termsOfService.acceptableUse.prohibitedItems.item7')}</li>
                  <li>{t('termsOfService.acceptableUse.prohibitedItems.item8')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.contentTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.content.userGeneratedTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.content.userGeneratedText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.content.loslcContentTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.content.loslcContentText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.content.ipRespectTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.content.ipRespectText')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.eventsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.events.registrationTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.events.registrationText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.events.cancellationTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.events.cancellationText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.events.codeOfConductTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.events.codeOfConductText')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <span>{t('termsOfService.disclaimers.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.disclaimers.educationalTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.disclaimers.educationalText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.disclaimers.availabilityTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.disclaimers.availabilityText')}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">{t('termsOfService.disclaimers.liabilityTitle')}</h4>
                <p className="text-muted-foreground">
                  {t('termsOfService.disclaimers.liabilityText')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.privacyTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('termsOfService.privacyText')}
              </p>
              <div className="mt-4">
                <Link href="/privacy-policy">
                  <Button variant="outline" size="sm">
                    {t('footer.links.privacy')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.terminationTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('termsOfService.terminationText1')}
              </p>
              <p className="text-muted-foreground">
                {t('termsOfService.terminationText2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.changesTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('termsOfService.changesText')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.governingLawTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('termsOfService.governingLawText1')}
              </p>
              <p className="text-muted-foreground">
                {t('termsOfService.governingLawText2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('termsOfService.contactTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('termsOfService.contactText')}
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>{t('termsOfService.contactDetails.emailLabel')}:</strong> {t('termsOfService.contactDetails.legalEmail')}</p>
                <p><strong>{t('termsOfService.contactDetails.generalLabel')}:</strong> {t('termsOfService.contactDetails.generalEmail')}</p>
                <p><strong>{t('termsOfService.contactDetails.addressLabel')}:</strong> {t('termsOfService.contactDetails.addressValue')}</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
