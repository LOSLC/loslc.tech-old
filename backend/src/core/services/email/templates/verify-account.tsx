import { Body, Head, Html, Button, Container, Text, Heading, Section, Hr } from "@react-email/components";
import { EmailTailwindWrapper } from "../components/Tailwind";

interface VerifyAccountEmailProps {
  userName: string;
  verificationLink: string;
  verificationToken: string;
}

export default function VerifyAccountEmail({ 
  userName = "User",
  verificationLink = "#",
  verificationToken = "TOKEN123"
}: VerifyAccountEmailProps) {
  return (
    <Html>
      <Head>
        <title>Verify your LOSL-C account.</title>
        <style>{`
          :root {
            --indigo-dye: #09416B;
            --rich-black: #11161B;
            --cadet-gray: #869AA8;
            --rich-black-2: #0A0F14;
            --rich-black-3: #13181E;
          }
        `}</style>
      </Head>
      <EmailTailwindWrapper>
        <Body 
          className="flex flex-col font-sans"
          style={{
            backgroundColor: '#0A0F14',
            margin: '0',
            padding: '0',
            color: '#869AA8'
          }}
        >
          <Container 
            className="mx-auto max-w-2xl"
            style={{
              backgroundColor: '#13181E',
              borderRadius: '8px',
              margin: '32px auto',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Section 
              className="px-8 py-6"
              style={{
                backgroundColor: '#09416B',
                background: 'linear-gradient(135deg, #09416B, #11161B)'
              }}
            >
              <Heading 
                className="text-2xl font-bold text-center m-0"
                style={{ color: '#ffffff' }}
              >
                LOSL-C
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="px-8 py-8">
              <Heading 
                className="text-xl font-semibold mb-4"
                style={{ color: '#ffffff', margin: '0 0 16px 0' }}
              >
                Welcome to LOSL-C, {userName}!
              </Heading>
              
              <Text 
                className="text-base leading-relaxed mb-6"
                style={{ color: '#869AA8', margin: '0 0 24px 0', lineHeight: '1.6' }}
              >
                Thank you for creating your account. To get started and ensure the security of your account, 
                please verify your email address using the verification code below or by clicking the button.
              </Text>

              {/* Verification Token Section */}
              <Section 
                className="text-center mb-8 p-6 rounded-lg"
                style={{
                  backgroundColor: '#11161B',
                  borderRadius: '12px',
                  border: '2px solid #09416B',
                  margin: '0 0 32px 0',
                  padding: '24px'
                }}
              >
                <Text 
                  className="text-sm font-medium mb-2"
                  style={{ color: '#869AA8', margin: '0 0 8px 0', fontSize: '14px' }}
                >
                  Your Verification Code:
                </Text>
                <Text 
                  className="text-3xl font-bold tracking-widest"
                  style={{ 
                    color: '#ffffff', 
                    margin: '0 0 16px 0',
                    fontFamily: 'monospace',
                    letterSpacing: '4px',
                    fontSize: '32px',
                    fontWeight: 'bold'
                  }}
                >
                  {verificationToken}
                </Text>
                <Text 
                  className="text-xs"
                  style={{ color: '#869AA8', margin: '0', fontSize: '12px' }}
                >
                  This code expires in 24 hours
                </Text>
              </Section>

              <Section className="text-center mb-8">
                <Button
                  href={verificationLink}
                  className="inline-block px-6 py-3 text-white font-medium rounded-lg text-decoration-none"
                  style={{
                    backgroundColor: '#09416B',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    padding: '12px 24px',
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Verify My Account
                </Button>
              </Section>

              <Text 
                className="text-sm mb-4"
                style={{ color: '#869AA8', margin: '0 0 16px 0', fontSize: '14px' }}
              >
                If the button above doesn't work, you can copy and paste this link into your browser:
              </Text>
              
              <Text 
                className="text-sm break-all p-3 rounded mb-6"
                style={{ 
                  color: '#09416B', 
                  backgroundColor: '#11161B',
                  padding: '12px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  wordBreak: 'break-all',
                  margin: '0 0 24px 0'
                }}
              >
                {verificationLink}
              </Text>

              <Hr style={{ borderColor: '#11161B', margin: '24px 0' }} />

              <Section>
                <Text 
                  className="text-sm font-medium mb-2"
                  style={{ color: '#ffffff', margin: '0 0 8px 0', fontWeight: '600' }}
                >
                  Alternative Method:
                </Text>
                <Text 
                  className="text-xs mb-4"
                  style={{ color: '#869AA8', margin: '0 0 16px 0', fontSize: '12px' }}
                >
                  You can also verify your account by visiting the verification page and entering your code manually.
                </Text>
              </Section>

              <Text 
                className="text-xs"
                style={{ color: '#869AA8', fontSize: '12px', margin: '0' }}
              >
                This verification link will expire in 24 hours. If you didn't create this account, 
                please ignore this email or contact our support team.
              </Text>
            </Section>

            {/* Footer */}
            <Section 
              className="px-8 py-6 text-center"
              style={{
                backgroundColor: '#11161B',
                borderTop: '1px solid #13181E'
              }}
            >
              <Text 
                className="text-xs m-0"
                style={{ color: '#869AA8', fontSize: '12px', margin: '0' }}
              >
                © {new Date().getUTCFullYear()} LOSL-C. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </EmailTailwindWrapper>
    </Html>
  );
}
