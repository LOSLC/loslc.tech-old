import { db } from "@/core/db/db";
import { safeQuery } from "../middleware/drizzle";
import { usersTable } from "@/core/db/schema/user";
import { userToDTO } from "../dto/user";
import { eq } from "drizzle-orm";

export async function getAllUsers({
  skip = 0,
  limit = 10,
}: { skip: number; limit: number }) {
  const users = await safeQuery(() =>
    db.select().from(usersTable).offset(skip).limit(limit),
  );
  return users.map((user) => userToDTO(user));
}

export async function getUserById(id: string) {
  const user = await safeQuery(() =>
    db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1),
  );
  if (user.length === 0) {
    throw new Error("User not found");
  }
  return userToDTO(user[0]);
}

export async function deleteUser(id: string) {
  const result = await safeQuery(() =>
    db.delete(usersTable).where(eq(usersTable.id, id)).returning(),
  );
  if (result.length === 0) {
    throw new Error("User not found");
  }
  return userToDTO(result[0]);
}
