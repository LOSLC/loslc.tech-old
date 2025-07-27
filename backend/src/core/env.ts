import dotenv from "dotenv";

dotenv.config();

export type Env =
  | "MAIL_SERVICE"
  | "APP_EMAIL"
  | "SADMIN_EMAIL"
  | "SMTP_PASSWORD"
  | "APP_URL"
  | "DEBUG"

export function getEnv(key: Env): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
