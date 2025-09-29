import {
	Body,
	Head,
	Html,
	Button,
	Container,
	Text,
	Heading,
	Section,
	Hr,
} from "@react-email/components";
import { EmailTailwindWrapper } from "../components/Tailwind";

interface PasswordResetEmailProps {
	userName: string;
	resetLink: string;
	resetToken: string;
	expirationMinutes: number;
}

export default function PasswordResetEmail({
	userName,
	resetLink,
	resetToken,
	expirationMinutes,
}: PasswordResetEmailProps) {
	return (
		<Html>
			<Head>
				<title>Reset your LOSL-C password</title>
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
						backgroundColor: "#0A0F14",
						margin: "0",
						padding: "0",
						color: "#869AA8",
					}}
				>
					<Container
						className="mx-auto max-w-2xl"
						style={{
							backgroundColor: "#13181E",
							borderRadius: "8px",
							margin: "32px auto",
							overflow: "hidden",
						}}
					>
						{/* Header */}
						<Section
							className="px-8 py-6"
							style={{
								backgroundColor: "#09416B",
								background: "linear-gradient(135deg, #09416B, #11161B)",
							}}
						>
							<Heading
								className="text-2xl font-bold text-center m-0"
								style={{ color: "#ffffff" }}
							>
								LOSL-C
							</Heading>
						</Section>

						{/* Main Content */}
						<Section className="px-8 py-8">
							<Heading
								className="text-xl font-semibold mb-4"
								style={{ color: "#ffffff", margin: "0 0 16px 0" }}
							>
								Password Reset Request
							</Heading>

							<Text
								className="text-base leading-relaxed mb-6"
								style={{
									color: "#869AA8",
									margin: "0 0 24px 0",
									lineHeight: "1.6",
								}}
							>
								Hello {userName}, we received a request to reset your password
								for your LOSL-C account. If you made this request, click the
								button below to set a new password.
							</Text>

							{/* Reset Token Section */}
							<Section
								className="text-center mb-8 p-6 rounded-lg"
								style={{
									backgroundColor: "#11161B",
									borderRadius: "12px",
									border: "2px solid #09416B",
									margin: "0 0 32px 0",
									padding: "24px",
								}}
							>
								<Text
									className="text-sm font-medium mb-2"
									style={{
										color: "#869AA8",
										margin: "0 0 8px 0",
										fontSize: "14px",
									}}
								>
									Your Reset Token:
								</Text>
								<Text
									className="text-3xl font-bold tracking-widest"
									style={{
										color: "#ffffff",
										margin: "0 0 16px 0",
										fontFamily: "monospace",
										letterSpacing: "4px",
										fontSize: "32px",
										fontWeight: "bold",
									}}
								>
									{resetToken}
								</Text>
								<Text
									className="text-xs"
									style={{ color: "#869AA8", margin: "0", fontSize: "12px" }}
								>
									This token expires in {expirationMinutes} minutes
								</Text>
							</Section>

							<Section className="text-center mb-8">
								<Button
									href={resetLink}
									className="inline-block px-6 py-3 text-white font-medium rounded-lg text-decoration-none"
									style={{
										backgroundColor: "#09416B",
										borderRadius: "8px",
										textDecoration: "none",
										display: "inline-block",
										padding: "12px 24px",
										fontWeight: "600",
										fontSize: "16px",
										color: "#ffffff",
										border: "none",
										cursor: "pointer",
									}}
								>
									Reset My Password
								</Button>
							</Section>

							<Text
								className="text-sm mb-4"
								style={{
									color: "#869AA8",
									margin: "0 0 16px 0",
									fontSize: "14px",
								}}
							>
								If the button above doesn't work, you can copy and paste this
								link into your browser:
							</Text>

							<Text
								className="text-sm break-all p-3 rounded mb-6"
								style={{
									color: "#09416B",
									backgroundColor: "#11161B",
									padding: "12px",
									borderRadius: "6px",
									fontFamily: "monospace",
									fontSize: "12px",
									wordBreak: "break-all",
									margin: "0 0 24px 0",
								}}
							>
								{resetLink}
							</Text>

							<Hr style={{ borderColor: "#11161B", margin: "24px 0" }} />

							<Section
								className="p-4 rounded-lg mb-6"
								style={{
									backgroundColor: "#11161B",
									borderLeft: "4px solid #09416B",
									padding: "16px",
									borderRadius: "6px",
									margin: "0 0 24px 0",
								}}
							>
								<Text
									className="text-sm font-medium mb-2"
									style={{
										color: "#ffffff",
										margin: "0 0 8px 0",
										fontWeight: "600",
									}}
								>
									Security Notice:
								</Text>
								<Text
									className="text-xs mb-2"
									style={{
										color: "#869AA8",
										margin: "0 0 8px 0",
										fontSize: "12px",
									}}
								>
									• This password reset request was made for:{" "}
									<strong>{userName}</strong>
								</Text>
								<Text
									className="text-xs mb-2"
									style={{
										color: "#869AA8",
										margin: "0 0 8px 0",
										fontSize: "12px",
									}}
								>
									• The reset link will expire in {expirationMinutes} minutes
								</Text>
								<Text
									className="text-xs"
									style={{ color: "#869AA8", margin: "0", fontSize: "12px" }}
								>
									• If you didn't request this reset, please ignore this email
								</Text>
							</Section>

							<Text
								className="text-xs"
								style={{ color: "#869AA8", fontSize: "12px", margin: "0" }}
							>
								If you didn't request a password reset, please ignore this email
								or contact our support team if you have concerns about your
								account security.
							</Text>
						</Section>

						{/* Footer */}
						<Section
							className="px-8 py-6 text-center"
							style={{
								backgroundColor: "#11161B",
								borderTop: "1px solid #13181E",
							}}
						>
							<Text
								className="text-xs m-0"
								style={{ color: "#869AA8", fontSize: "12px", margin: "0" }}
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
