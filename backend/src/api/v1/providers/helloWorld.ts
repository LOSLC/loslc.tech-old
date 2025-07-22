import type { HelloWorldResponse } from "../dto/helloWorld";

export async function helloWorld(): Promise<HelloWorldResponse> {
  return {
    message: "Hello, World!",
  };
}
