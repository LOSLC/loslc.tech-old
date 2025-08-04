import { Reflector } from "@nestjs/core";
import { BypassRole as BRole } from "./accessmgt.types";

export const BypassRole = Reflector.createDecorator<BRole | undefined>();
