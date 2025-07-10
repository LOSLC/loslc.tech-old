"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Shield,
  Users,
  AlertCircle,
  CheckCircle,
  MessageCircle,
} from "lucide-react";

export default function CodeOfConduct() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-4">
            <Heart className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">
              Code of Conduct
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Building a welcoming, inclusive, and respectful community for
            everyone
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
                <Heart className="w-5 h-5 text-primary" />
                <span>Our Commitment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                LOSL-C is committed to providing a welcoming, safe, and
                inclusive environment for all community members, regardless of
                their background, identity, or experience level. We believe that
                diverse perspectives strengthen our community and advance our
                mission of promoting Linux and Open-Source technologies across
                Africa.
              </p>
              <p className="text-muted-foreground">
                This Code of Conduct outlines our expectations for all community
                members and provides guidelines for creating a positive and
                productive environment for learning and collaboration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Our Values</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <span className="mr-2">🤝</span> Inclusivity
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We welcome people of all backgrounds, skill levels, and
                    perspectives
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <span className="mr-2">🎓</span> Learning
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We foster an environment where everyone can learn and grow
                    together
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <span className="mr-2">💙</span> Respect
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We treat each other with dignity, kindness, and
                    understanding
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <span className="mr-2">🤲</span> Collaboration
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    We work together to achieve common goals and support each
                    other
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Expected Behavior</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                All community members are expected to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Be respectful and kind:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Treat others with courtesy and empathy, even when
                      disagreeing
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Use inclusive language:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Choose words that welcome and include all community
                      members
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Help newcomers:</strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Welcome new members and help them navigate the community
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Share knowledge freely:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Contribute to discussions and help others learn
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Respect different perspectives:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Value diverse viewpoints and approaches to problem-solving
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Give constructive feedback:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Provide helpful, specific, and actionable feedback
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Respect privacy:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Don&apos;t share personal information without consent
                    </span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Unacceptable Behavior</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The following behaviors are not tolerated in our community:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Harassment and discrimination:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Based on race, gender, sexual orientation, religion,
                      nationality, age, disability, or any other characteristic
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Offensive or inappropriate content:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Including sexual, violent, or discriminatory language and
                      imagery
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Personal attacks:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Insults, trolling, or deliberately inflammatory comments
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Spam and self-promotion:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Excessive self-promotion, advertising, or off-topic
                      content
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Doxxing and privacy violations:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Sharing someone&apos;s private information without permission
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Intellectual property violations:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Sharing copyrighted material without proper authorization
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">
                      Disruptive behavior:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Deliberately disrupting discussions, events, or community
                      activities
                    </span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Reporting and Enforcement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  How to Report
                </h4>
                <p className="text-muted-foreground mb-3">
                  If you experience or witness behavior that violates this Code
                  of Conduct, please report it immediately:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    Email: <strong>conduct@loslc.tech</strong> (monitored by
                    community moderators)
                  </li>
                  <li>
                    Contact any community administrator or moderator directly
                  </li>
                  <li>
                    Use the report function on our platforms where available
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  What to Include
                </h4>
                <p className="text-muted-foreground mb-2">
                  When reporting, please include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Description of the incident</li>
                  <li>Where and when it occurred</li>
                  <li>Screenshots or evidence if available</li>
                  <li>Names of people involved (if known)</li>
                  <li>Any additional context that might be helpful</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Our Response
                </h4>
                <p className="text-muted-foreground">
                  All reports will be reviewed promptly and confidentially. We
                  are committed to creating a safe environment and will take
                  appropriate action, which may include warnings, temporary
                  suspension, or permanent removal from the community.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consequences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Violations of this Code of Conduct may result in:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <strong className="text-foreground">Warning:</strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Private discussion about the behavior and expectations
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <strong className="text-foreground">
                      Temporary suspension:
                    </strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Temporary removal from community activities and platforms
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <strong className="text-foreground">Permanent ban:</strong>
                    <span className="text-muted-foreground">
                      {" "}
                      Permanent removal from all community services and events
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                The severity of consequences depends on the nature and frequency
                of violations. We may skip steps for serious violations that
                threaten the safety or well-being of community members.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This Code of Conduct applies to all LOSL-C community spaces,
                including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Online forums, chat platforms, and social media</li>
                <li>In-person events, workshops, and meetups</li>
                <li>Project collaboration spaces</li>
                <li>
                  Email communications and private messages between community
                  members
                </li>
                <li>
                  Any other space where you represent or interact with the
                  LOSL-C community
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appeals Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you believe you have been unfairly sanctioned under this Code
                of Conduct, you may appeal by:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  Sending an email to <strong>support@loslc.tech</strong> within
                  30 days of the decision
                </li>
                <li>
                  Including a detailed explanation of why you believe the
                  decision was unfair
                </li>
                <li>Providing any additional evidence or context</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Appeals will be reviewed by community leaders who were not
                involved in the original decision.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Questions and Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We welcome questions and feedback about this Code of Conduct. If
                you have suggestions for improvement or need clarification on
                any point, please reach out:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> support@loslc.tech
                </p>
                <p>
                  <strong>Community Discussion:</strong> Start a conversation in
                  our forums
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acknowledgments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This Code of Conduct is inspired by and adapted from the
                Contributor Covenant, Django Code of Conduct, and other
                open-source community guidelines. We thank these communities for
                their pioneering work in creating inclusive and welcoming spaces
                for collaboration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
