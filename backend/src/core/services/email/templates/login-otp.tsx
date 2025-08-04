import { Body, Head, Html, Container, Text, Heading, Section, Hr } from "@react-email/components";
import { EmailTailwindWrapper } from "../components/Tailwind";

interface LoginOtpEmailProps {
  userName: string;
  otpCode: string;
  expirationMinutes: number;
}

export default function LoginOtpEmail({ 
  userName,
  otpCode,
  expirationMinutes
}: LoginOtpEmailProps) {
  return (
    <Html>
      <Head>
        <title>Your LOSL-C Login Code</title>
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
                Hello, {userName}!
              </Heading>
              
              <Text 
                className="text-base leading-relaxed mb-6"
                style={{ color: '#869AA8', margin: '0 0 24px 0', lineHeight: '1.6' }}
              >
                We received a login attempt for your LOSL-C account. To complete your login, 
                please use the one-time password (OTP) below:
              </Text>

              {/* OTP Code Section */}
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
                  Your Login Code:
                </Text>
                <Text 
                  className="text-3xl font-bold tracking-widest"
                  style={{ 
                    color: '#ffffff',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    letterSpacing: '8px',
                    fontFamily: 'monospace',
                    margin: '0'
                  }}
                >
                  {otpCode}
                </Text>
                <Text 
                  className="text-xs mt-2"
                  style={{ color: '#869AA8', margin: '8px 0 0 0', fontSize: '12px' }}
                >
                  This code expires in {expirationMinutes} minutes
                </Text>
              </Section>

              <Text 
                className="text-sm mb-6"
                style={{ color: '#869AA8', margin: '0 0 24px 0', fontSize: '14px', lineHeight: '1.5' }}
              >
                Enter this code in your login screen to access your account. If you didn't attempt to log in, 
                please ignore this email and consider changing your password.
              </Text>

              <Hr style={{ borderColor: '#11161B', margin: '24px 0' }} />

              {/* Security Information */}
              <Section 
                className="p-4 rounded"
                style={{
                  backgroundColor: '#0A0F14',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #11161B'
                }}
              >
                <Text 
                  className="text-sm font-medium mb-3"
                  style={{ color: '#ffffff', margin: '0 0 12px 0', fontWeight: '600' }}
                >
                  🔒 Login Details:
                </Text>
                <Text 
                  className="text-xs mb-1"
                  style={{ color: '#869AA8', margin: '0 0 4px 0', fontSize: '12px' }}
                >
                  <strong>Account:</strong> {userName}
                </Text>
                <Text 
                  className="text-xs"
                  style={{ color: '#869AA8', margin: '0', fontSize: '12px' }}
                >
                  <strong>Code:</strong> {otpCode}
                </Text>
              </Section>

              <Hr style={{ borderColor: '#11161B', margin: '24px 0' }} />

              {/* Security Warning */}
              <Section 
                className="p-4 rounded"
                style={{
                  backgroundColor: '#11161B',
                  borderRadius: '8px',
                  padding: '16px',
                  borderLeft: '4px solid #09416B'
                }}
              >
                <Text 
                  className="text-sm font-medium mb-2"
                  style={{ color: '#ffffff', margin: '0 0 8px 0', fontWeight: '600' }}
                >
                  ⚠️ Security Notice
                </Text>
                <Text 
                  className="text-xs"
                  style={{ color: '#869AA8', fontSize: '12px', margin: '0', lineHeight: '1.4' }}
                >
                  Never share this code with anyone. LOSL-C staff will never ask for your OTP code. 
                  If you didn't request this login, please secure your account immediately.
                </Text>
              </Section>
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
              <Text 
                className="text-xs mt-2"
                style={{ color: '#869AA8', fontSize: '10px', margin: '4px 0 0 0' }}
              >
                This is an automated security email. Please do not reply.
              </Text>
            </Section>
          </Container>
        </Body>
      </EmailTailwindWrapper>
    </Html>
  );
}
