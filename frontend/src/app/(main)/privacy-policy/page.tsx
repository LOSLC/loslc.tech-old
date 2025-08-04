"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            How LOSL-C collects, uses, and protects your personal information
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Personal Information
                </h4>
                <p className="text-muted-foreground">
                  When you join our community or attend events, we may collect:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Name and email address</li>
                  <li>Social media handles (when voluntarily provided)</li>
                  <li>Technical skill level and interests</li>
                  <li>Location (city/country) for event organization</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Usage Information
                </h4>
                <p className="text-muted-foreground">
                  We might automatically collect certain information when you
                  visit our website:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent</li>
                  <li>Device and operating system information</li>
                  <li>Referral source (which website directed you to us)</li>
                </ul>
                <p className="text-muted-foreground mt-2 text-sm">
                  <strong>Note:</strong> We do not collect or store IP
                  addresses.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Organizing and announcing community events and workshops
                </li>
                <li>Sending relevant technical content and updates</li>
                <li>Facilitating networking between community members</li>
                <li>Improving our website and community services</li>
                <li>Responding to your questions and support requests</li>
                <li>Analyzing usage patterns to enhance user experience</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-primary" />
                <span>Data Protection & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Security Measures
                </h4>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures
                  to protect your personal data:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>
                    Limited access to personal data on a need-to-know basis
                  </li>
                  <li>Secure hosting with reputable cloud providers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Data Retention
                </h4>
                <p className="text-muted-foreground">
                  We retain your personal information only as long as necessary
                  for the purposes outlined in this policy or as required by
                  law. Inactive accounts may be deleted after 2 years of
                  inactivity with prior notice.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share information only in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>
                  To protect the rights and safety of our community members
                </li>
                <li>
                  With trusted service providers who assist in operating our
                  community (under strict confidentiality agreements)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of the personal data
                  we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  or incomplete data
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to
                  another service
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing of your data
                  for specific purposes
                </li>
                <li>
                  <strong>Withdrawal:</strong> Withdraw consent at any time
                  where processing is based on consent
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us at{" "}
                <strong>support@loslc.tech</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our website uses minimal cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Provide basic website functionality</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>
                  We do not use third-party cookies or tracking scripts.
                </strong>{" "}
                Any analytics we perform is done with privacy-focused tools that
                respect user privacy and do not track users across websites.
              </p>
              <p className="text-muted-foreground mt-4">
                You can control cookie settings through your browser
                preferences. However, disabling certain cookies may affect
                website functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use the following third-party services that may collect
                information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  <strong>GitHub:</strong> For code repositories and project
                  management
                </li>
                <li>
                  <strong>Social Media Platforms:</strong> For community
                  engagement and content sharing
                </li>
                <li>
                  <strong>Email Services:</strong> For community communications
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>Privacy-focused approach:</strong> We prioritize
                services that respect user privacy and do not engage in
                cross-site tracking. When possible, we use privacy-focused
                alternatives to mainstream analytics and tracking tools.
              </p>
              <p className="text-muted-foreground mt-4">
                These services have their own privacy policies. We encourage you
                to review them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or legal requirements. We will notify
                you of any material changes by posting the updated policy on our
                website and updating the &quot;Last updated&quot; date. Continued use of
                our services after such changes constitutes acceptance of the
                updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> privacy@loslc.tech
                </p>
                <p>
                  <strong>General Contact:</strong> support@loslc.tech
                </p>
                <p>
                  <strong>Address:</strong> LOSL-C Community, Lomé, Togo
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
