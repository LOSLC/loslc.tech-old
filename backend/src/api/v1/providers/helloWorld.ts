import { db } from "@/core/db/db";
import type { HelloWorldResponse } from "../dto/helloWorld";
import { usersTable } from "@/core/db/schema/user";

export async function helloWorld(): Promise<HelloWorldResponse> {
  console.log(await db.select().from(usersTable))
  return {
    message: "Hello, World!",
  };
}
