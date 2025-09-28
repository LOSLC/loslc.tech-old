export type BypassRoleName = "admin" | "superadmin" | "member" | "mod";
export type ActionType = "r" | "rw";
export type ResourceType =
	| "user"
	| "role"
	| "permission"
	| "adminaction"
	| "file"
	| "blogpost"
	| "blogcomment"
	| "blogcategory"
	| "blogtag"
	| "bloglike"
	| "blogview";

export interface BypassRole {
	roleName: BypassRoleName;
}

export interface ParamPermissionCheck {
	action: ActionType;
	resource: ResourceType;
	resourceParamName?: string | null;
}

export interface PermissionCheck {
	action: ActionType;
	resource: ResourceType;
	resourceId?: string | null;
}

export const BypassRoles: Record<BypassRoleName, number> = {
	superadmin: 3,
	admin: 2,
	mod: 1,
	member: 0,
};
