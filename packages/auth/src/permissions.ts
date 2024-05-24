import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "./index.ts";
import type { User } from "./models/user.ts";
import type { Role } from "./roles.ts";

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, PermissionsByRole> = {
	Admin(user, { can, cannot }) {
		can("manage", "all");

		cannot(["transfer_ownership", "update"], "Organization");
		can(["transfer_ownership", "update"], "Organization", { ownerId: { $eq: user.id } });
	},
	Member(user, { can }) {
		can("get", "User");
		can(["create", "get"], "Project");
		can(["update", "delete"], "Project", { ownerId: { $eq: user.id } });
	},
	Billing(_user, { can }) {
		can("manage", "Billing");
	},
};
