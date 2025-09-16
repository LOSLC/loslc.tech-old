import { User as DBUser } from "@/core/db/schema";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedRequest } from "../types/authRequest.type";
import { checkConditions } from "../checkers/utils";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = (request as AuthenticatedRequest).user as DBUser;
    checkConditions({
      conditions: [!!user],
      statusCode: 401,
      message: "Unauthenticated",
      either: false,
    });
    return user;
  },
);

export const OptionalUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = (request as AuthenticatedRequest).user;
    return user;
  },
);
