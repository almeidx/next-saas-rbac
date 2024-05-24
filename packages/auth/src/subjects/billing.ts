import { type InferInput, literal, tuple, union } from "valibot";

export const billingSubject = tuple([
	union([
		//
		literal("manage"),
		literal("get"),
		literal("export"),
	]),
	literal("Billing"),
]);

export type BillingSubject = InferInput<typeof billingSubject>;
