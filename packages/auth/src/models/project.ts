import { type InferInput, object, string, literal, optional } from "valibot";

export const projectSchema = object({
	__typename: optional(literal("Project"), "Project"),
	id: string(),
	ownerId: string(),
});

export type Project = InferInput<typeof projectSchema>;
