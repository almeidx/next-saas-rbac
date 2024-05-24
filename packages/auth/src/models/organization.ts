import { type InferInput, object, string, literal, optional } from "valibot";

export const organizationSchema = object({
	__typename: optional(literal("Organization"), "Organization"),
	id: string(),
	ownerId: string(),
});

export type Organization = InferInput<typeof organizationSchema>;
