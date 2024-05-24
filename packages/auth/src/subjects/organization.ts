import { type InferInput, literal, tuple, union } from "valibot";
import { organizationSchema } from "../models/organization.ts";

export const organizationSubject = tuple([
	union([
		//
		literal("manage"),
		literal("update"),
		literal("delete"),
		literal("transfer_ownership"),
	]),
	union([literal("Organization"), organizationSchema]),
]);

export type OrganizationSubject = InferInput<typeof organizationSubject>;
