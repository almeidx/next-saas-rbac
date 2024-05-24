import { type InferInput, literal, tuple, union } from "valibot";
import { projectSchema } from "../models/project.ts";

export const projectSubject = tuple([
	union([
		//
		literal("manage"),
		literal("get"),
		literal("create"),
		literal("update"),
		literal("delete"),
	]),
	union([literal("Project"), projectSchema]),
]);

export type ProjectSubject = InferInput<typeof projectSubject>;
