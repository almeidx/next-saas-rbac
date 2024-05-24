import { type InferInput, object, string } from "valibot";
import { roleSchema } from "../roles.ts";

export const userSchema = object({
	id: string(),
	role: roleSchema,
});

export type User = InferInput<typeof userSchema>;
