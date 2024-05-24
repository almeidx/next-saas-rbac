import { type InferInput, literal, union } from "valibot";

export const roleSchema = union([
	//
	literal("Admin"),
	literal("Member"),
	literal("Billing"),
]);

export type Role = InferInput<typeof roleSchema>;
