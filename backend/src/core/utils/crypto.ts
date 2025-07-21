import { randomBytes } from "node:crypto";

export function randId(length = 50): string {
  return randomBytes((length * 3) / 4)
    .toString("base64url")
    .slice(0, length);
}
