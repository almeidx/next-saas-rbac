import { type InferInput, literal, tuple, union } from "valibot";

export const userSubject = tuple([
	union([
		//
		literal("manage"),
		literal("get"),
		literal("update"),
		literal("delete"),
	]),
	literal("User"),
]);

export type UserSubject = InferInput<typeof userSubject>;
