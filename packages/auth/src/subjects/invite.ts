import { type InferInput, literal, tuple, union } from "valibot";

export const inviteSubject = tuple([
	union([
		//
		literal("manage"),
		literal("get"),
		literal("create"),
		literal("delete"),
	]),
	literal("Invite"),
]);

export type InviteSubject = InferInput<typeof inviteSubject>;
