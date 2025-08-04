"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-4">
            <FileText className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Terms of Service</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Terms and conditions for using LOSL-C community services
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
                <Scale className="w-5 h-5 text-primary" />
                <span>Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing or using LOSL-C community services, including our website, events, forums, 
                and other platforms, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you 
                do not agree with any part of these terms, you may not access or use our services.
              </p>
              <p className="text-muted-foreground mt-4">
                These Terms apply to all visitors, users, and others who access or use our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Community Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                LOSL-C provides the following services to promote Linux and Open-Source software education:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Educational workshops and technical training sessions</li>
                <li>Community forums and discussion platforms</li>
                <li>Open-source project collaboration opportunities</li>
                <li>Networking events and meetups</li>
                <li>Technical resources and documentation</li>
                <li>Mentorship and career guidance programs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Account Creation</h4>
                <p className="text-muted-foreground">
                  To access certain services, you may need to create an account. You must provide accurate, 
                  current, and complete information during registration and keep your account information updated.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Account Security</h4>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account credentials and 
                  for all activities that occur under your account. You must immediately notify us of any 
                  unauthorized use of your account.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Eligibility</h4>
                <p className="text-muted-foreground">
                  Our services are open to individuals of all skill levels who are interested in Linux 
                  and Open-Source technologies. Users under 18 must have parental consent to participate 
                  in community activities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Permitted Uses</h4>
                <p className="text-muted-foreground">
                  You may use our services for educational, collaborative, and professional development purposes 
                  related to Linux and Open-Source technologies.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Prohibited Activities</h4>
                <p className="text-muted-foreground mb-2">You agree not to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Use our services for any unlawful purpose or in violation of any applicable laws</li>
                  <li>Harass, abuse, or harm other community members</li>
                  <li>Post spam, malware, or malicious content</li>
                  <li>Violate intellectual property rights of others</li>
                  <li>Share inappropriate, offensive, or discriminatory content</li>
                  <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                  <li>Interfere with or disrupt the operation of our services</li>
                  <li>Use our services for commercial purposes without prior written consent</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">User-Generated Content</h4>
                <p className="text-muted-foreground">
                  You retain ownership of content you create and share in our community. By posting content, 
                  you grant LOSL-C a non-exclusive, royalty-free license to use, display, and distribute 
                  your content for community purposes.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">LOSL-C Content</h4>
                <p className="text-muted-foreground">
                  Educational materials, documentation, and resources created by LOSL-C are generally 
                  available under open-source licenses. Specific licensing terms will be clearly indicated 
                  for each resource.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Respect for IP Rights</h4>
                <p className="text-muted-foreground">
                  You must respect the intellectual property rights of others. Do not share copyrighted 
                  materials without proper authorization or attribution.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Events and Workshops</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Registration and Attendance</h4>
                <p className="text-muted-foreground">
                  Event registration may be required for certain workshops and meetups. We reserve the 
                  right to limit attendance based on capacity and other factors.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Cancellation Policy</h4>
                <p className="text-muted-foreground">
                  We reserve the right to cancel or reschedule events due to unforeseen circumstances. 
                  Participants will be notified as soon as possible of any changes.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Code of Conduct</h4>
                <p className="text-muted-foreground">
                  All event participants must adhere to our Community Code of Conduct. Violations may 
                  result in removal from events and community services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <span>Disclaimers and Limitations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Educational Purpose</h4>
                <p className="text-muted-foreground">
                  Our services are provided for educational and community building purposes. While we 
                  strive to provide accurate and up-to-date information, we make no warranties about 
                  the completeness or accuracy of the content.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Service Availability</h4>
                <p className="text-muted-foreground">
                  We provide our services on a voluntary basis. We do not guarantee uninterrupted access 
                  to our services and may modify or discontinue services at any time.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Limitation of Liability</h4>
                <p className="text-muted-foreground">
                  LOSL-C shall not be liable for any indirect, incidental, special, or consequential 
                  damages arising from your use of our services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection, use, and protection of your personal 
                information is governed by our Privacy Policy, which is incorporated into these Terms 
                by reference. Please review our Privacy Policy to understand our data practices.
              </p>
              <div className="mt-4">
                <Link href="/privacy-policy">
                  <Button variant="outline" size="sm">
                    View Privacy Policy
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice, 
                for conduct that we believe violates these Terms or is harmful to other users or the community.
              </p>
              <p className="text-muted-foreground">
                You may terminate your account at any time by contacting us. Upon termination, your right 
                to use our services will cease immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of material 
                changes by posting the updated Terms on our website and updating the &quot;Last updated&quot; date. 
                Your continued use of our services after changes constitutes acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                These Terms are governed by the laws of Togo. Any disputes arising from these Terms or 
                your use of our services will be resolved through good faith negotiation.
              </p>
              <p className="text-muted-foreground">
                If disputes cannot be resolved through negotiation, they may be submitted to mediation 
                or arbitration as appropriate under Togolese law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@loslc.tech</p>
                <p><strong>General Contact:</strong> support@loslc.tech</p>
                <p><strong>Address:</strong> LOSL-C Community, Lomé, Togo</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
