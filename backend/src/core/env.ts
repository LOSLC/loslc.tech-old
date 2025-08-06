import * as dotenv from "dotenv";

dotenv.config();

export type Env =
  | "MAIL_SERVICE"
  | "APP_EMAIL"
  | "SADMIN_EMAIL"
  | "SMTP_PASSWORD"
  | "APP_URL"
  | "DEBUG"
  | "OTP_EXPIRATION_MINUTES"
  | "AUTH_SESSION_EXPIRATION_DAYS"
  | "EMAIL_VERIFICATION_EXPIRATION_HOURS"
  | "PASSWORD_RESET_EXPIRATION_MINUTES"
  | "DATABASE_URL"
  | "STORAGE"
  | "CORS_ORIGIN"

export function getEnv(key: Env): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
