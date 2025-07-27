import { randomBytes, randomInt } from "node:crypto";

export function randId(length = 50): string {
  return randomBytes((length * 3) / 4)
    .toString("base64url")
    .slice(0, length);
}

export function randOTP(length = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const index = randomInt(0, digits.length);
    otp += digits[index];
  }
  return otp;
}
