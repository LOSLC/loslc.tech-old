import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BypassRole } from "./bypassroles.decorator";
import * as objsAreEqual from "fast-deep-equal";
import {
  ActionType,
  BypassRoles as BypassRolesReg,
  ParamPermissionCheck,
  ResourceType,
} from "./accessmgt.types";
import { Permissions } from "./permissions.decorator";
import { AuthenticatedRequest } from "@/common/types/authRequest.type";
import { checkExistence } from "@/common/checkers/utils";
import { AccessmgtService } from "./accessmgt.service";

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessmgtService: AccessmgtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const bypassRole = this.reflector.get(BypassRole, context.getHandler());
    const permissionChecks = this.reflector.get(
      Permissions,
      context.getHandler(),
    );
    const user = checkExistence(
      (context.switchToHttp().getRequest() as AuthenticatedRequest).user,
      { message: "Unauthorized", statusCode: 401 },
    );

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const userRoles = await this.accessmgtService.getUserRoles({
      userId: user.id,
      all: true,
    });

    if (bypassRole) {
      const bypassed = userRoles.filter(
        (r) =>
          r.name &&
          BypassRolesReg[r.name] !== undefined &&
          (BypassRolesReg[r.name] as number) >=
            BypassRolesReg[bypassRole.roleName],
      );
      if (bypassed.length > 0) {
        return true;
      }
    }

    for (const role of userRoles) {
      const rolePermissions: ParamPermissionCheck[] = (
        await this.accessmgtService.getRolePermissions({
          roleId: role.id,
          all: true,
        })
      ).map((o) => {
        return {
          action: o.action as ActionType,
          resource: o.resource as ResourceType,
          resourceId: o.resourceId,
        };
      });
      for (const pcheck of permissionChecks) {
        const hasPermission = rolePermissions.some(
          (p) =>
            objsAreEqual(p, {
              action: pcheck.action,
              resource: pcheck.resource,
              resourceId: req.params[pcheck.resourceParamName ?? ""],
            }) ||
            (objsAreEqual(
              { resource: p.resource, action: p.action },
              { resource: p.resource, action: pcheck.action },
            ) &&
              (p.resourceParamName === null ||
                p.resourceParamName === undefined)),
        );
        if (hasPermission) {
          return true;
        }
      }
    }
    return false;
  }
}
