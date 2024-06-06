import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "#lib/prisma.js";

export async function getProfile(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/profile",
		{
			schema: {
				summary: "Get authenticated user's profile",
				tags: ["auth"],
				response: {
					200: z.object({
						user: z.object({
							id: z.string().uuid(),
							name: z.string().nullable(),
							email: z.string().email(),
							avatarUrl: z.string().url().nullable(),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const id = await request.getCurrentUserId();

			const user = await prisma.user.findUnique({
				where: {
					id,
				},
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			});

			if (!user) {
				throw app.httpErrors.notFound("User not found");
			}

			return { user };
		},
	);
}
