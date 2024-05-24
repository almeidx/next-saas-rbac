import { AbilityBuilder, createMongoAbility, type CreateAbility, type MongoAbility } from "@casl/ability";
import type { User } from "./models/user.ts";
import { permissions } from "./permissions.ts";
import assert from "node:assert";
import type { UserSubject } from "./subjects/user.ts";
import type { ProjectSubject } from "./subjects/project.ts";
import type { BillingSubject } from "./subjects/billing.ts";
import type { InviteSubject } from "./subjects/invite.ts";
import type { OrganizationSubject } from "./subjects/organization.ts";

type AppAbilities =
	| BillingSubject
	| InviteSubject
	| OrganizationSubject
	| ProjectSubject
	| UserSubject
	| ["manage", "all"];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
	const builder = new AbilityBuilder(createAppAbility);

	assert(user.role in permissions, `Role ${user.role} is not defined in permissions`);

	permissions[user.role](user, builder);

	return builder.build({
		detectSubjectType(subject) {
			// biome-ignore lint/style/noNonNullAssertion:
			return subject.__typename!;
		},
	});
}

export * from "./models/organization.ts";
export * from "./models/project.ts";
export * from "./models/user.ts";

export { parse } from "valibot";
