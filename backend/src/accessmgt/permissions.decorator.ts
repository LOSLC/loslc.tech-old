import { Reflector } from "@nestjs/core";
import { ParamPermissionCheck } from "./accessmgt.types";

export const Permissions = Reflector.createDecorator<ParamPermissionCheck[]>();
